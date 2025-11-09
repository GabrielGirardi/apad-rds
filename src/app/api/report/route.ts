import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas para a tabela de denúncias (reports) com operações CRUD.
 *
 * GET: Lista todos as denúncias POST: Cria uma nova denúncia.
 */
const prisma = new PrismaClient();

/**
 * Lista todos as denúncias.
 *
 * @returns denúncias em formato JSON.
 */
export async function GET() {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "view")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const reports = await prisma.report.findMany();
  return NextResponse.json(reports);
}

/**
 * Cria um relatório.
 * Requer os dados do relatório no corpo da requisição.
 * O corpo deve conter os campos: title, description, type, status.
 *
 * @param request
 * @returns Relatório criado em formato JSON.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "create")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const body = await request.json();
  const { title, description, address, tags, status } = body;

  const newReport = await prisma.report.create({
    data: {
      title,
      description,
      address,
      tags,
      status,
    },
  });

  return NextResponse.json(newReport, { status: 201 });
}
