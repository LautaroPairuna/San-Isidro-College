import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

type UploadProgress = {
  percent: number;
  stage: "uploading" | "compressing" | "generating_thumbnail" | "done" | "error";
  updatedAt: number;
  error?: string;
};

async function getProgress(id: string): Promise<UploadProgress> {
  const progressDir =
    process.env.UPLOAD_PROGRESS_DIR ||
    path.join(/*turbopackIgnore: true*/ process.cwd(), ".runtime", "upload-progress");
  const filePath = path.join(progressDir, `${id}.json`);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as UploadProgress;
  } catch {
    return { percent: 0, stage: "uploading", updatedAt: Date.now() };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const progress = await getProgress(id);
  return NextResponse.json(progress);
}
