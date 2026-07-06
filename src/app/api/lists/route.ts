import { NextRequest, NextResponse } from "next/server";
import * as listService from "../../../services/listService";
import { corsHeaders } from "@/consts";
import { ValidationError } from "@/errors";
export { OPTIONS } from "@/consts";

//get all lists
export async function GET() {
  try {
    const lists = await listService.getAllLists();
    return NextResponse.json(lists, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Failed to get lists in GET method. ", { error });
    return NextResponse.json(
      { error: "Failed to get lists" },
      { status: 500, headers: corsHeaders },
    );
  }
}

//create list
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const list = await listService.createList(data);
    return NextResponse.json(list, { status: 201, headers: corsHeaders });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: `Failed to add list. Data is not valid`,
        },
        { status: 400, headers: corsHeaders },
      );
    }
    console.error("Failed to create list in POST method. ", { error });
    return NextResponse.json(
      { error: "Failed to create list" },
      { status: 500, headers: corsHeaders },
    );
  }
}
