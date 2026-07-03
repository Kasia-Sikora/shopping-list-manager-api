import { NextResponse } from "next/server";

async function proxy() {
  // For now: Allow all requests (no-op)
  // Later: Check Google OAuth token here
  // Then: All protected routes "just work"
  
  // req.userId will be undefined now
  // Later: req.userId = decoded token's user id
  return NextResponse.next();
}

export default proxy