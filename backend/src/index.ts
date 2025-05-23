import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { Express, Request, Response } from "express";
import http, { Server } from "node:http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import { verifyToken } from "./middleware/auth.js";

// Load environment variables
dotenv.config();

// Create Express application
const app: Express = express();
const httpServer: Server = http.createServer(app);

// Database connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/employee-management";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: Error) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true, // Enable introspection in all environments for development
});

// Start the server
const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1] || "";

        // Verify token and get user
        const user = token ? await verifyToken(token) : null;

        return { user };
      },
    })
  );

  // Set up other routes
  app.get("/", (req: Request, res: Response) => {
    res.send("Employee Management System API");
  });

  // Start the HTTP server
  const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, () => resolve())
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

startServer().catch((err: Error) => {
  console.error("Failed to start server:", err);
});
