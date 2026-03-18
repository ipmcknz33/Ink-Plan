import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";

const app = express();
const httpServer = createServer(app);
const MemoryStoreSession = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "inkplan.sid",
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new MemoryStoreSession({
      checkPeriod: 86400000,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

async function start() {
  registerRoutes(app);

  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const PORT = Number(process.env.PORT) || 5001;

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`server running on port ${PORT}`);
  });
}

start();
