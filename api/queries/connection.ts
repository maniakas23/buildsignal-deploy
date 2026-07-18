import Database from "better-sqlite3";
const db = new Database(":memory:");
export function getDb() { return db; }
