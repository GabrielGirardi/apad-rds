import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas para a tabela de relatórios (reports) com operações CRUD.
 *
 * GET: Lista todos os relatórios.
 * POST: Cria um novo relatório.
 */
const prisma = new PrismaClient();

/**
 * Lista todos os relatórios.
 *
 * @returns Relatórios em formato JSON.
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
  const { title, description, type, status } = body;

  const newReport = await prisma.report.create({
    data: {
      title,
      description,
      type,
      status,
    },
  });

  return NextResponse.json(newReport, { status: 201 });
}
