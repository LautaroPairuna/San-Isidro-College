import { NextRequest, NextResponse } from "next/server";
import { getProgress } from "@/services/file.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const progress = await getProgress(id);
  return NextResponse.json(progress);
}
