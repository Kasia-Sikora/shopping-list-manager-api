import { DELETE, GET, PATCH } from "@/app/api/lists/[id]/route";
import { NotFoundError, ValidationError } from "@/errors";
import { DEFAULT_VALUES, exampleList } from "@/services/__tests__/fixtures";
import * as listService from "@/services/listService";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/listService");

beforeEach(() => vi.resetAllMocks());

describe("/lists/id", () => {
  it("returns 200 and the lists for the /lists/id /GET method", async () => {
    vi.mocked(listService.getList).mockResolvedValueOnce(DEFAULT_VALUES[1]);

    const req = new NextRequest("http://localhost/api/lists", {
      method: "GET",
    });

    const response = await GET(req, {
      params: Promise.resolve({ id: DEFAULT_VALUES[1].id }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(DEFAULT_VALUES[1]);
  });

  it("should handle error and return NotFoundError error response for the /lists/id /GET method", async () => {
    vi.mocked(listService.getList).mockRejectedValueOnce(new NotFoundError());

    const req = new NextRequest("http://localhost/api/lists", {
      method: "GET",
    });

    const response = await GET(req, {
      params: Promise.resolve({ id: DEFAULT_VALUES[1].id }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: `Failed to get list with id ${DEFAULT_VALUES[1].id}. List not found`,
    });
  });

  it("should handle error and return error response for the /lists/id /GET method", async () => {
    vi.mocked(listService.getList).mockRejectedValueOnce(new Error());
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = new NextRequest("http://localhost/api/lists", {
      method: "GET",
    });

    const response = await GET(req, {
      params: Promise.resolve({ id: DEFAULT_VALUES[1].id }),
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to get list",
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to get list in GET method. ",
      { error: expect.any(Error) },
    );
  });

  it("returns 200 and list from the service /PATCH method", async () => {
    const list = {
      ...exampleList,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(listService.patchList).mockResolvedValueOnce(list);

    const req = new NextRequest("http://localhost/api/lists", {
      method: "PATCH",
      body: JSON.stringify(list),
    });
    const response = await PATCH(req, {
      params: Promise.resolve({ id: exampleList.id }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(list);
  });

  it("returns 400 for returned ValidationError in /PATCH method", async () => {
    const list = {
      ...exampleList,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(listService.patchList).mockRejectedValueOnce(
      new ValidationError(),
    );

    const req = new NextRequest("http://localhost/api/lists", {
      method: "PATCH",
      body: JSON.stringify(list),
    });
    const response = await PATCH(req, {
      params: Promise.resolve({ id: exampleList.id }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: `Failed to update list with id ${exampleList.id}. Data is not valid`,
    });
  });

  it("returns 404 for returned NotFoundError in /PATCH method", async () => {
    const list = {
      ...exampleList,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(listService.patchList).mockRejectedValueOnce(new NotFoundError());

    const req = new NextRequest("http://localhost/api/lists", {
      method: "PATCH",
      body: JSON.stringify(list),
    });
    const response = await PATCH(req, {
      params: Promise.resolve({ id: exampleList.id }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: `Failed to update list with id ${exampleList.id}. List not found`,
    });
  });

  it("returns 500 for returned error other than ValidationError in /PATCH method", async () => {
    const list = {
      ...exampleList,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(listService.patchList).mockRejectedValueOnce(new Error());
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = new NextRequest("http://localhost/api/lists", {
      method: "PATCH",
      body: JSON.stringify(list),
    });
    const response = await PATCH(req, {
      params: Promise.resolve({ id: exampleList.id }),
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: `Failed to update list with id ${exampleList.id}`,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "PATCH /api/lists/[id] failed:",
      expect.any(Error),
    );
  });

  it("returns 200 and list from /DELETE method when list.id exists", async () => {
    vi.mocked(listService.deleteList).mockResolvedValueOnce(true);

    const req = new NextRequest("http://localhost/api/lists", {
      method: "DELETE",
    });
    const response = await DELETE(req, {
      params: Promise.resolve({ id: exampleList.id }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ id: exampleList.id });
  });

  it("returns 404 for returned NotFoundError in /DELETE method", async () => {
    vi.mocked(listService.deleteList).mockRejectedValueOnce(
      new NotFoundError(),
    );

    const req = new NextRequest("http://localhost/api/lists", {
      method: "DELETE",
    });
    const response = await DELETE(req, {
      params: Promise.resolve({ id: exampleList.id }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: `Failed to delete list with id ${exampleList.id}. List not found`,
    });
  });

  it("returns 500 for returned error other than NotFoundError in /DELETE method", async () => {
    vi.mocked(listService.deleteList).mockRejectedValueOnce(new Error());
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = new NextRequest("http://localhost/api/lists", {
      method: "DELETE",
    });
    const response = await DELETE(req, {
      params: Promise.resolve({ id: exampleList.id }),
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: `Failed to delete list with id ${exampleList.id}`,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "DELETE /api/lists/[id] failed:",
      expect.any(Error),
    );
  });
});
