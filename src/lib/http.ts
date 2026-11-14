import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";

export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export function json(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store", "Pragma": "no-cache", "Expires": "0" } });
}
export function failure(error: unknown) {
  if (error instanceof HttpError) return json({ error: { code: error.code, message: error.message } }, error.status);
  if (error instanceof z.ZodError) return json({ error: { code: "VALIDATION", message: "Check the highlighted fields and try again.", fields: z.flattenError(error).fieldErrors } }, 422);
  // Database error objects can contain submitted private text in their detail.
  console.error("API request failed");
  return json({ error: { code: "UNAVAILABLE", message: "We couldn’t complete that action. Please try again." } }, 503);
}
export async function readInput<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  if (request.headers.get("origin") !== new URL(getServerEnv().NEXT_PUBLIC_APP_URL).origin) throw new HttpError(403, "ORIGIN", "Please submit this form from Ramblin’ Reach.");
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new HttpError(422, "VALIDATION", "A JSON request is required.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(422, "VALIDATION", "Complete the required fields.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { await reader.cancel(); throw new HttpError(413, "TOO_LARGE", "This request is too large."); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  chunks.forEach(chunk => { bytes.set(chunk, offset); offset += chunk.length; });
  let input: unknown;
  try { input = JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new HttpError(422, "VALIDATION", "Check the form and try again."); }
  return schema.parse(input);
}
