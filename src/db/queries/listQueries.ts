import { List } from "@/interfaces";
import { db } from "../connection";

export const getAllLists = async () => {
  const result = await db.query('SELECT id, title, content, owner_id as "ownerId", created_at as "createdAt", updated_at as "updatedAt" FROM lists');
  return result.rows
};

export const getList = async (id: string) => {
  const result = await db.query('SELECT id, title, content, owner_id as "ownerId", created_at as "createdAt", updated_at as "updatedAt" FROM lists WHERE id = $1', [id]);
  return result.rows[0] ?? null
};

export const insertList = async (list: List) => {
  return db.query(
    "INSERT INTO lists (id, title, content, owner_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      list.id,
      list.title,
      JSON.stringify(list.content),
      list.ownerId,
      list.createdAt,
      list.updatedAt,
    ],
  );
};

export const deleteList = async (id: string) => {
  const result = await db.query("DELETE FROM lists WHERE id = $1", [id]);
  return !(result.rowCount === null || result.rowCount === 0)
};

export const updateList = async (id: string, list: List) => {
 return db.query(
    "UPDATE lists SET title = $1, content = $2, owner_id = $3, updated_at = $4 WHERE id = $5",
    [
      list.title,
      JSON.stringify(list.content),
      list.ownerId,
      list.updatedAt,
      id
    ],
  );
}