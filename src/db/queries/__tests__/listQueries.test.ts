import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import * as listQueries from "../listQueries";
import { db } from "@/db/connection";
import { exampleList } from "@/services/__tests__/fixtures";

vi.mock("@/db/connection", () => ({ db: { query: vi.fn() } }));

const query = db.query as unknown as Mock;

describe("listQueries — deleted column", () => {
  beforeEach(() => vi.resetAllMocks());

  it("updateList writes list.deleted to the UPDATE", async () => {
    query.mockResolvedValue({ rows: [] });

    listQueries.updateList(exampleList.id, { ...exampleList, deleted: true });

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("deleted"),
      expect.arrayContaining([true]),
    );
  });

  // The NOT NULL guard: a list with no `deleted` property must default to false, never NULL
  // (this is the `list.deleted ?? false` that stops normal updates from crashing the column).
  it("updateList defaults deleted to false when the flag is absent", async () => {
    query.mockResolvedValue({ rows: [] });

    // exampleList has no `deleted` → `list.deleted ?? false` must send false, not undefined.
    await listQueries.updateList(exampleList.id, exampleList);

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("deleted"),
      expect.arrayContaining([false]),
    );
  });

  it("getAllLists selects the deleted column and does not filter tombstones", async () => {
    const rows = [{ ...exampleList, deleted: false }];
    query.mockResolvedValue({ rows });

    const result = await listQueries.getAllLists();

    const sql = query.mock.calls[0]![0] as string;
    expect(sql).toContain("deleted");
    expect(sql).not.toMatch(/where\s+deleted/i); // sync must see tombstones — no filtering here
    expect(result).toEqual(rows);
  });

  it("getList selects the deleted column", async () => {
    const row = { ...exampleList, deleted: false };
    query.mockResolvedValue({ rows: [row] });

    const result = await listQueries.getList(exampleList.id);

    const [sql, params] = query.mock.calls[0]!;
    expect(sql as string).toContain("deleted");
    expect(sql as string).toMatch(/where\s+id\s*=\s*\$1/i);
    expect(params).toEqual([exampleList.id]);
    expect(result).toEqual(row);
  });
});
