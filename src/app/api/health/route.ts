import { corsHeaders } from "@/consts";
import { NextResponse } from "next/server";
export { OPTIONS } from "@/consts";

export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200, headers: corsHeaders });
}
