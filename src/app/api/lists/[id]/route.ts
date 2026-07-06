import { NextRequest, NextResponse } from "next/server";
import * as listService from "@/services/listService";
import { NotFoundError, ValidationError } from "@/errors";
import { corsHeaders } from "@/consts";
export { OPTIONS } from "@/consts";

//Get one list
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const list = await listService.getList(id);
    return NextResponse.json(list, { headers: corsHeaders });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: `Failed to get list with id ${(await params).id}. List not found`,
        },
        { status: 404, headers: corsHeaders },
      );
    }
    console.error("Failed to get list in GET method. ", { error });
    return NextResponse.json({ error: "Failed to get list" }, { status: 500, headers: corsHeaders });
  }
}

//delete list
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    await listService.deleteList(id);
    return NextResponse.json({ id }, { status: 200, headers: corsHeaders });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: `Failed to delete list with id ${(await params).id}. List not found`,
        },
        { status: 404, headers: corsHeaders },
      );
    }
    console.error("DELETE /api/lists/[id] failed:", error);
    return NextResponse.json(
      { error: `Failed to delete list with id ${(await params).id}` },
      { status: 500, headers: corsHeaders },
    );
  }
}

//update list
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const data = await _request.json();
    const list = await listService.patchList(id, data);
    return NextResponse.json(list, { status: 200, headers: corsHeaders });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: `Failed to update list with id ${(await params).id}. List not found`,
        },
        { status: 404, headers: corsHeaders },
      );
    } else if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: `Failed to update list with id ${(await params).id}. Data is not valid`,
        },
        { status: 400, headers: corsHeaders },
      );
    }
    console.error("PATCH /api/lists/[id] failed:", error);
    return NextResponse.json(
      { error: `Failed to update list with id ${(await params).id}` },
      { status: 500, headers: corsHeaders },
    );
  }
}
