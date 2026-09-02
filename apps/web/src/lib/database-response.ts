import { NextResponse } from "next/server";

import { DatabaseUnavailableError } from "@/server/db-errors";

export function databaseErrorResponse(error: unknown) {
  if (error instanceof DatabaseUnavailableError) {
    return NextResponse.json(
      {
        error: "Database unavailable",
        message: error.message,
      },
      { status: 503 },
    );
  }

  return null;
}

export function publicDatabaseErrorResponse(error: unknown) {
  if (error instanceof DatabaseUnavailableError) {
    return NextResponse.json(
      {
        success: false,
        message: "This service is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }

  return null;
}
