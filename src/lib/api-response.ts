import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  const body: { ok: false; error: string; details?: unknown } = {
    ok: false,
    error: message,
  };
  if (details !== undefined) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}
