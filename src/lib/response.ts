import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createResponse = (payload: any, status: number = 200) => {
  if (status === 204) {
    return new NextResponse(null, { status: status });
  }

  return NextResponse.json(payload, {
    status: status,
  });
};
