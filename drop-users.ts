import "dotenv/config";
import { db } from "./server/db";

async function dropUsersTable() {
  await db.execute("DROP TABLE IF EXISTS users CASCADE");
  console.log("Dropped users table");
}

dropUsersTable().catch(console.error);