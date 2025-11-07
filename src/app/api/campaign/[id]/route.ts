import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getRouteParam } from "@/lib/utils/url";
import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas dinâmicas para campanhas (campaign) com operações CRUD.
 *
 * PUT: Atualiza uma campanha existente.
 * DELETE: Deleta uma campanha existente.
 * PATCH: Atualiza o status de uma campanha existente.
 */
const prisma = new PrismaClient();

/**
 * Atualiza uma campanha existente.
 * Requer o ID da campanha na URL e os dados atualizados no corpo da requisição.
 *
 * @param request
 * @constructor
 */
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "edit")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const id = getRouteParam(request);
  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  const { title, description, targetAmount, isActive, finishAt } = await request.json();

  const updated = await prisma.campaign.update({
    where: { id: String(id) },
    data: {
      title,
      description,
      targetAmount,
      isActive,
      finishAt: new Date(finishAt),
    },
  });

  return NextResponse.json(updated);
}

/**
 * Deleta uma campanha existente.
 * Requer o ID da campanha na URL.
 *
 * @param request
 * @constructor
 */
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "delete")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const id = getRouteParam(request);
  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  const exists = await prisma.campaign.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Campanha não encontrada" }, { status: 404 });
  }

  await prisma.campaign.delete({
    where: { id: String(id) },
  });

  return NextResponse.json({ message: "Campanha deletada com sucesso" });
}

/**
 * Atualiza o status de uma campanha existente.
 * Requer o ID da campanha na URL e o novo status no corpo da requisição.
 *
 * @param request
 * @constructor
 */
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "edit")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const id = getRouteParam(request);
  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  const exists = await prisma.campaign.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Campanha não encontrada" }, { status: 404 });
  }

  const { isActive } = await request.json();

  const updated = await prisma.campaign.update({
    where: { id: String(id) },
    data: { isActive },
  });

  return NextResponse.json(updated);
}
