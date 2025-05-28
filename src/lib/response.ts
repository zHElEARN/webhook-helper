import { NextResponse } from "next/server";

export const createResponse = (payload: any, status: number = 200) => {
  return NextResponse.json(payload, {
    status: status,
  });
};
