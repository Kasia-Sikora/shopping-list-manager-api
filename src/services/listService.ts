import * as listQueries from "@/db/queries/listQueries";
import { NotFoundError, ValidationError } from "@/errors";
import { List } from "@/interfaces";

export const getAllLists = async () => {
  const lists = await listQueries.getAllLists();
  return lists;
};

export const getList = async (id: string) => {
  const list = await listQueries.getList(id);
  if (!list) throw new NotFoundError(`List with id: ${id} was not found`);
  return list;
};

export const createList = async (data: List) => {
  const now = new Date().toISOString();

  const list = {
    ...data,
    ownerId: null,
    createdAt: data?.createdAt ?? now,
    updatedAt: data?.updatedAt ?? now,
  };

  if (!list.id || typeof list.title !== 'string' || !list.content) {
    throw new ValidationError(
      `Data provided is not valid: ${JSON.stringify(list)}`,
    );
  }

  await listQueries.insertList(list);
  return list;
};

export const deleteList = async (id: string) => {
  const isListDeleted = await listQueries.deleteList(id);
  if (!isListDeleted) {
    throw new NotFoundError(`List with id: ${id} was not found`);
  }
  return isListDeleted;
};

export const patchList = async (id: string, data: List) => {
  const list = await listQueries.getList(id);
  if (!list) throw new NotFoundError(`List ${id} not found`);

  const newList = {
    ...list,
    ...data,
  } as List;

  if (typeof newList.title !== 'string'  || !newList.content || !newList.createdAt) {
    throw new ValidationError(
      `Data provided is not valid: ${JSON.stringify(newList)}`,
    );
  }
  await listQueries.updateList(id, newList);
  return newList;
};
