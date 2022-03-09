import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { open } from 'sqlite';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Order } from '../types/Order';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PATH = resolve(join(__dirname,'../../../orders.db'));
let db: Database<sqlite3.Database, sqlite3.Statement> | undefined = undefined; // not initialized yet

// An "inline" init function, avoids needing to pre-initialize the database
async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  db = await open({
    filename: PATH,
    driver: sqlite3.Database
  });
  console.log('db connected');

  // auto-creates `rowid` column
  const createTable = `
  CREATE TABLE IF NOT EXISTS orders (
    description TEXT NULL,
    quantity INT NOT NULL,
    total int NOT NULL,
    status TEXT NOT NULL
  )`;
  await db.run(createTable);

  return db;
}

export async function getAll(): Promise<Order[]> {
  db = db || await getDb();
  const sql = `SELECT rowid as orderId, description, quantity, total, status FROM orders ORDER BY rowid`;
  const rows: Order[] = await db.all<Order[]>(sql, []);
  return rows || [];
}

export async function getNextPending(): Promise<number> {
  db = db || await getDb();
  const sql: string = `SELECT rowid as orderId FROM orders WHERE status = ?`;
  const row = await db.get<Partial<Order>>(sql, ['Pending']);
  if (row?.orderId) {
    return row.orderId;
  }
  return 0;
}

export async function add({order}: {order: Order}): Promise<number> {
  db = db || await getDb();
  const sql: string = `INSERT INTO orders(description, quantity, total, status) VALUES (?,?,?,?)`;
  const stmt = await db.run(sql, [order.description, order.quantity, order.total, order.status]);
  order.orderId = stmt.lastID ?? 0;
  return order.orderId;
}

export async function update({orderId, status}: {orderId: number, status: string}): Promise<boolean> {
  db = db || await getDb();
  const sql: string = `UPDATE orders SET status = ? WHERE rowid = ?`;
  const stmt = await db.run(sql, [status, orderId]);
  const worked = (stmt.changes ?? 0) > 0;
  return worked;
}
