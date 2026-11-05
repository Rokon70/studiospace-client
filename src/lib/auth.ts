import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Re-use one Mongo client 
const g = globalThis as unknown as { _mongoClient?: MongoClient };
const client = g._mongoClient ?? new MongoClient(process.env.MONGODB_URI as string);
if (process.env.NODE_ENV !== "production") g._mongoClient = client;
const db = client.db("studiospace");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, 
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
