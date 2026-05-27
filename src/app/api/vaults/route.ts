import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { id, encryptedData, iv, salt, name } = await request.json();

  if (!id || !encryptedData || !iv || !salt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const vault = await prisma.vault.create({
    data: { id, encryptedData, iv, salt, name },
  });

  return NextResponse.json({ id: vault.id });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const vault = await prisma.vault.findUnique({ where: { id } });

  if (!vault) {
    return NextResponse.json({ error: "Vault not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: vault.id,
    encryptedData: vault.encryptedData,
    iv: vault.iv,
    salt: vault.salt,
    name: vault.name,
    createdAt: vault.createdAt,
  });
}
