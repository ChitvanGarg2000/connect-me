import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { connectDb } from "./src/utils/connectDb.js";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import querySchema from "./src/schema.js";
import resolvers from "./src/controllers/resolvers.js";
import { fileURLToPath } from 'url';
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs: querySchema,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

app.use(bodyParser.json());
app.use(cors({
  origin: 'https://connect-me-irez.onrender.com', 
  credentials: true
}));

app.use(express.static(path.join(__dirname, '../client/dist')));

await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: ({ req, res }) => ({ req, res }),
  })
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server started successfully on port ${PORT}`);
  try {
    await connectDb();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed", err);
  }
});
