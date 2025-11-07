import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getRouteParam } from "@/lib/utils/url";
import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas dinâmicas para eventos (event) com operações CRUD.
 *
 * PUT: Atualiza um evento existente.
 * DELETE: Deleta um evento existente.
 * PATCH: Atualiza o status de um evento existente.
 */
const prisma = new PrismaClient();

/**
 * Atualiza um evento existente.
 * Requer o ID do evento na URL e os dados atualizados no corpo da requisição.
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

  const { title, description, isActive, tags, finishAt } = await request.json();

  const updated = await prisma.event.update({
    where: { id: String(id) },
    data: { title, description, isActive, tags, finishAt },
  });

  return NextResponse.json(updated);
}

/**
 * Deleta um evento existente.
 * Requer o ID do evento na URL.
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

  const exists = await prisma.event.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Evento não encontrado" }, { status: 404 });
  }

  await prisma.event.delete({
    where: { id: String(id) },
  });

  return NextResponse.json({ message: "Evento deletado com sucesso" });
}

/**
 * Atualiza o status de um evento existente.
 * Requer o ID do evento na URL e o novo status no corpo da requisição.
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

  const exists = await prisma.event.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Evento não encontrado" }, { status: 404 });
  }

  const { isActive } = await request.json();

  const updated = await prisma.event.update({
    where: { id: String(id) },
    data: { isActive },
  });

  return NextResponse.json(updated);
}
