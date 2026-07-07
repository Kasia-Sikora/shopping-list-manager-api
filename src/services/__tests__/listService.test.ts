import { beforeEach, describe, expect, it, vi } from "vitest";
import * as listQueries from "../../db/queries/listQueries";
import * as listService from "../listService";
import { DEFAULT_VALUES, exampleList } from "./fixtures";
import { List } from "@/interfaces";
import { ValidationError } from "@/errors";

vi.mock("@/db/queries/listQueries");

describe("listSevice", () => {
  beforeEach(() => vi.resetAllMocks());

  it("getLists returns the list", async () => {
    vi.mocked(listQueries.getList).mockResolvedValue(DEFAULT_VALUES[0]);
    const result = await listService.getList("0");
    expect(result).toEqual(DEFAULT_VALUES[0]);
  });

  it("getList throws NotFoundError when id is missing", async () => {
    vi.mocked(listQueries.getList);
    await expect(listService.getList("x")).rejects.toThrow("was not found");
  });

  it("createList returns list", async () => {
    vi.mocked(listQueries.insertList);
    const result = await listService.createList(exampleList);
    expect(listQueries.insertList).toHaveBeenCalledWith(exampleList)
    expect(result).toEqual(exampleList);
  });

  it("createList throws ValidationError when title and content is missing", async () => {
    vi.mocked(listQueries.insertList);
    await expect(
      listService.createList({ id: "test-id" } as List),
    ).rejects.toThrow("Data provided is not valid");
  });

  it("deleteList returns the id of deleted list", async () => {
    vi.mocked(listQueries.deleteList).mockResolvedValue(true);
    const result = await listService.deleteList("0");
    expect(result).toEqual(true);
  });

  it("deleteList throws NotFoundError when id is missing", async () => {
    vi.mocked(listQueries.deleteList).mockResolvedValue(false);
    await expect(listService.deleteList("0")).rejects.toThrow("was not found");
  });

  it("updateLists returns the list", async () => {
    vi.mocked(listQueries.getList).mockResolvedValue(DEFAULT_VALUES[0]);
    vi.mocked(listQueries.updateList);
    const result = await listService.patchList("0", exampleList);
    expect(listQueries.updateList).toHaveBeenCalledWith("0", exampleList)
    expect(result).toEqual(exampleList);
  });

  it("updateLists throws NotFoundError when id is missing", async () => {
    vi.mocked(listQueries.updateList);
    await expect(listService.patchList("0", exampleList)).rejects.toThrow(
      "not found",
    );
  });

  it("updateLists throws ValidationError when title is missing", async () => {
    vi.mocked(listQueries.getList).mockResolvedValue(DEFAULT_VALUES[0]);
    vi.mocked(listQueries.updateList);
    await expect(
      listService.patchList("test-id", { id: "test-id", title: undefined as any as string } as List),
    ).rejects.toThrow("Data provided is not valid");
  });
});
