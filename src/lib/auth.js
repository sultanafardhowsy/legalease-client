// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { jwt } from "better-auth/plugins";

// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db("legalease_user");

// export const auth = betterAuth({
//   secret: process.env.BETTER_AUTH_SECRET,
//   baseURL: process.env.BETTER_AUTH_URL,

//   database: mongodbAdapter(db, { client }),

//   emailAndPassword: {
//     enabled: true,
//   },

//   trustedOrigins: [
//     "http://localhost:3000",
//     "https://leagalease-client.vercel.app",
//   ],

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
//     },
//   },

//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         required: false,
//         defaultValue: "client",
//       },
//       plan: {
//         type: "string",
//         required: false,
//         defaultValue: "client-free",
//       },
//     },
//   },

//   session: {
//     cookieCache: {
//       enabled: true,
//       strategy: "cookie",
//       maxAge: 7 * 24 * 60 * 60,
//     },
//   },

//   plugins: [
//     jwt({
//       jwt: {
//         expirationTime: "7d",
//         secret: process.env.BETTER_AUTH_SECRET,
//       },
//       schema: {
//         jwks: {
//           modelName: "jwks",
//         },
//       },
//     }),
//   ],
// });
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
//import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);

// ✅ connect before passing to adapter
await client.connect();

const db = client.db("legalease_user");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://leagalease-client.vercel.app",
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "client",
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "client-free",
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "cookie",
      maxAge: 7 * 24 * 60 * 60,
    },
  },

  // plugins: [
  //   jwt({
  //     jwt: {
  //       expirationTime: "7d",
  //       secret: process.env.BETTER_AUTH_SECRET,
  //     },
  //     schema: {
  //       jwks: {
  //         modelName: "jwks",
  //       },
  //     },
  //   }),
  // ],
});