import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import prisma from "@/utils/prisma";
import { signJwtAccessToken } from "@/utils/jwt";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Generate timestamp / current datetime
        const currentTimeStamp = getTimeStamp(timeDiff);

        try {
          const username = credentials?.username;
          const password = credentials?.password;

          // Looking to see if the username exists
          const userCredential = await prisma.user.findUnique({
            where: { username: username },
          });

          // If the username is not found, the error message "Username doesn't exist" will appear.
          if (!userCredential) {
            throw JSON.stringify({ message: "Username doesn't exist" });
          }

          // If the username is found then identify the password input against the password in the encrypted database
          if (await bcrypt.compare(password, userCredential.password)) {
            // If identified successfully, generate an access token
            const { password: hashedPassword, ...result } = userCredential;
            const accessToken = signJwtAccessToken(result);

            const access = {
              id: result.id,
              username: result.username,
              role: result.role,
              accessToken: accessToken,
            };

            return access;
          } else {
            throw JSON.stringify({ message: "Invalid password" });
          }
        } catch (error) {
          const log = {
            created_at: currentTimeStamp,
            route: "/api/auth",
            status: 401,
            message: error.trim(),
          };
          errorLog(log)
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { authHandler as GET, authHandler as POST };
