// pages/api/_middleware.js
import { NextResponse } from "next/server";

// Release the limitation of Data sending by JSON(original 1mb but now its over)

export function middleware(req) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/api")) {
    req.headers["Content-Type"] = "application/json";
    req.headers["Content-Length"] = req.body
      ? Buffer.byteLength(JSON.stringify(req.body))
      : 0;
  }

  return NextResponse.next();
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired size limit
    },
  },
};
