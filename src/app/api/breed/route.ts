import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas para a tabela de raças (breeds) com operações CRUD.
 *
 * GET: Lista todas as raças.
 * POST: Cria uma nova raça.
 */
const prisma = new PrismaClient();

/**
 * Lista todas as raças.
 *
 * @returns Raças em formato JSON.
 */
export async function GET() {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "view")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const breeds = await prisma.breed.findMany();
  return NextResponse.json(breeds);
}

/**
 * Cria uma raça.
 * Requer os dados da raça no corpo da requisição.
 * O corpo deve conter o campo: name.
 *
 * @param request
 * @returns Raça criada em formato JSON.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "create")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const body = await request.json();
  const { name } = body;

  const newBreed = await prisma.breed.create({
    data: { name },
  });

  return NextResponse.json(newBreed, { status: 201 });
}
