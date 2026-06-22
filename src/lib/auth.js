

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
console.log(process.env.MONGO_URI);
const client = new MongoClient(process.env. MONGODB_URI);
const db = client.db("legalease_user");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  emailAndPassword: { 
    enabled: true, 
  }, 
  trustedOrigins: [
        "http://localhost:3000",
        "https://leagalease-client.vercel.app"
    ],
 socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
      
    }
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "client", // Matches your frontend default
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "client-free",
      },
    },
  },

  session :{
  cookieCache : {
    enabled : true,
    strategy : 'jwt',
    maxAge : 30*24*60*60
  }
  },

  plugins : [
    jwt()
  ]

});

