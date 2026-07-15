import { GET, OPTIONS, POST } from "@/app/api/lists/route";
import { ValidationError } from "@/errors";
import { DEFAULT_VALUES, exampleList } from "@/services/__tests__/fixtures";
import * as listService from "@/services/listService";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/listService");

beforeEach(() => vi.resetAllMocks());

describe("/lists", () => {
  it("returns 200 and the lists from the service /GET method", async () => {
    vi.mocked(listService.getAllLists).mockResolvedValueOnce(DEFAULT_VALUES);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(DEFAULT_VALUES);
  });

  it("should handle error and return error response from the service /GET method", async () => {
    vi.mocked(listService.getAllLists).mockRejectedValueOnce(new Error());
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to get lists",
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to get lists in GET method. ",
      { error: expect.any(Error) },
    );
  });

  it("returns 201 and list from the service /POST method", async () => {
    const list = {
      ...exampleList,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(listService.createList).mockResolvedValueOnce(list);

    const req = new NextRequest("http://localhost/api/lists", {
      method: "POST",
      body: JSON.stringify(list),
    });
    const response = await POST(req);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual(list);
  });

  it("returns 400 for returned ValidationError in /POST method", async () => {
    const list = {
      ...exampleList,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(listService.createList).mockRejectedValueOnce(
      new ValidationError(),
    );

    const req = new NextRequest("http://localhost/api/lists", {
      method: "POST",
      body: JSON.stringify(list),
    });
    const response = await POST(req);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: `Failed to add list. Data is not valid`,
    });
  });

  it("returns 500 for returned error other than ValidationError in /POST method", async () => {
    const list = {
      ...exampleList,
      ownerId: null,
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(listService.createList).mockRejectedValueOnce(new Error());
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const req = new NextRequest("http://localhost/api/lists", {
      method: "POST",
      body: JSON.stringify(list),
    });
    const response = await POST(req);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to create list",
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to create list in POST method. ",
      { error: expect.any(Error) },
    );
  });

  it("should call OPTIONS", async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(200);
  });
});
