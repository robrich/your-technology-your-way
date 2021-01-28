import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PATH = resolve(join(__dirname,'../../orders.db'));
let db = undefined; // not initialized yet

// auto-creates `rowid` column
const createTable = `
CREATE TABLE IF NOT EXISTS orders (
  description TEXT NULL,
  quantity INT NOT NULL,
  total int NOT NULL,
  status TEXT NOT NULL
)`;
async function getDb() {
  db = await open({
    filename: PATH,
    driver: sqlite3.Database
  });
  console.log('db connected');

  await db.run(createTable);
}

export async function getAll() {
  if (!db) {
    await getDb();
  }
  const sql = `SELECT rowid as orderId, description, quantity, total, status FROM orders ORDER BY rowid`;
  const rows = await db.all(sql, []);
  return rows || [];
}

export async function getNextPending() {
  if (!db) {
    await getDb();
  }
  const sql = `SELECT rowid as orderId FROM orders WHERE status = ?`;
  const row = await db.get(sql, ['Pending']);
  if (row && row.orderId) {
    return row.orderId;
  }
  return 0;
}

export async function add({order}) {
  if (!db) {
    await getDb();
  }
  const sql = `INSERT INTO orders(description, quantity, total, status) VALUES (?,?,?,?)`;
  const stmt = await db.run(sql, [order.description, order.quantity, order.total, order.status]);
  order.orderId = stmt.lastID;
  return order.orderId;
}

export async function update({orderId, status}) {
  if (!db) {
    await getDb();
  }
  const sql = `UPDATE orders SET status = ? WHERE rowid = ?`;
  const stmt = await db.run(sql, [status, orderId]);
}
