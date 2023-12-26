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

import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import Cors from 'cors';
import initMiddleware from '../../../lib/init-middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    origin: '*', // Replace with your allowed origin
    methods: ['POST'],
  })
);

const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Run cors middleware
        await cors(this.req, this.res);

        try {
          console.log('GET CREDENTIALS API/AUTH:', credentials);
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
            }
          );

          const json = await response.json();
          console.log('GET RES JSON API/AUTH:', json);

          if (response.status === 200) {
            return json.result;
          } else {
            throw json.error;
          }
        } catch (e) {
          throw new Error(e);
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
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

