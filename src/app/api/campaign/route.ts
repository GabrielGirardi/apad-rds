import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas para a tabela de campanhas (campaigns) com operações CRUD.
 *
 * GET: Lista todas as campanhas.
 * POST: Cria uma nova campanha.
 */
const prisma = new PrismaClient();

/**
 * Lista todas as campanhas.
 *
 * @returns Campanhas em formato JSON.
 */
export async function GET() {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "view")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const campaigns = await prisma.campaign.findMany();
  return NextResponse.json(campaigns);
}

/**
 * Cria uma campanha.
 * Requer os dados da campanha no corpo da requisição.
 * O corpo deve conter os campos: title, description, targetAmount, finishAt.
 *
 * @param request
 * @returns Campanha criada em formato JSON.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "create")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const body = await request.json();
  const { title, description, targetAmount, finishAt } = body;

  const newCampaign = await prisma.campaign.create({
    data: {
      title,
      description,
      targetAmount,
      finishAt: new Date(finishAt),
    },
  });

  return NextResponse.json(newCampaign, { status: 201 });
}
