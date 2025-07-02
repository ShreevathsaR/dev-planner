import { prisma } from "@dev-planner/prisma"
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse){

    const response = await prisma.user.findMany()

    return NextResponse.json({response})

}