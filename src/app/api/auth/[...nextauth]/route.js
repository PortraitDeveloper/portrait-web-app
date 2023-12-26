// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";

// const authHandler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           console.log("GET CREDENTIALS API/AUTH:", credentials);
//           const response = await fetch(
//             `${process.env.NEXTAUTH_URL}/api/login`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 username: credentials?.username,
//                 password: credentials?.password,
//               }),
//             }
//           );

//           const json = await response.json();
//           console.log("GET RES JSON API/AUTH:", json);

//           if (response.status === 200) {
//             return json.result;
//           } else {
//             throw JSON.stringify(json);
//           }
//         } catch (e) {
//           throw new Error(e);
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       return { ...token, ...user };
//     },
//     async session({ session, token }) {
//       session.user = token;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { authHandler as GET, authHandler as POST };

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import prisma from "@/utils/prisma";
import { signJwtAccessToken } from "@/utils/jwt";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const username = credentials?.username;
          const password = credentials?.password;

          console.log("GET INPUT CREDENTIAL:", credentials);

          // Looking to see if the username exists
          const userCredential = await prisma.user.findUnique({
            where: { username: username },
          });

          console.log("GET EXISTING CREDENTIAL:", userCredential);

          // If the username is not found, the error message "Username doesn't exist" will appear.
          if (!userCredential) {
            throw JSON.stringify({ message: "Username doesn't exist" });
          }

          // If the username is found then identify the password input against the password in the encrypted database
          if (await bcrypt.compare(password, userCredential.password)) {
            // If identified successfully, generate an access token
            const { password: hashedPassword, ...result } = userCredential;
            const accessToken = signJwtAccessToken(result);
            console.log("RESULT:", result);

            const access = {
              id: result.id,
              username: result.username,
              role: result.role,
              accessToken: accessToken,
            };

            console.log("GET ACCESS:", access);

            return access;
          } else {
            throw JSON.stringify({ message: "Invalid password" });
          }
        } catch (e) {
          throw new Error(e);
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
