const sqlite = require('sqlite');

module.exports = { getAll, getNextPending, add, update };

const PATH = __dirname+'/../../orders.db';
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
  db = await sqlite.open(PATH);
  console.log(`db connected`);

  await db.run(createTable);
}

async function getAll() {
  if (!db) {
    await getDb();
  }
  const sql = `SELECT rowid as orderId, description, quantity, total, status FROM orders ORDER BY rowid`;
  const rows = await db.all(sql, []);
  return rows || [];
}

async function getNextPending() {
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

async function add({order}) {
  if (!db) {
    await getDb();
  }
  const sql = `INSERT INTO orders(description, quantity, total, status) VALUES (?,?,?,?)`;
  const stmt = await db.run(sql, [order.description, order.quantity, order.total, order.status]);
  order.orderId = stmt.lastID;
  return order.orderId;
}

async function update({orderId, status}) {
  if (!db) {
    await getDb();
  }
  const sql = `UPDATE orders SET status = ? WHERE rowid = ?`;
  const stmt = await db.run(sql, [status, orderId]);
}
