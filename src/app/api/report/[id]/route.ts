import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getRouteParam } from "@/lib/utils/url";
import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas dinâmicas para denúncias com operações CRUD.
 *
 * PUT: Atualiza um relatório existente.
 * DELETE: Deleta um relatório existente.
 */
const prisma = new PrismaClient();

/**
 * Atualiza um relatório existente.
 * Requer o ID do relatório na URL e os dados atualizados no corpo da requisição.
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

  const { title, description, address, tags, status } = await request.json();

  const updated = await prisma.report.update({
    where: { id: String(id) },
    data: { title, description, address, tags, status },
  });

  return NextResponse.json(updated);
}

/**
 * Deleta um relatório existente.
 * Requer o ID do relatório na URL.
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

  const exists = await prisma.report.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Relatório não encontrado" }, { status: 404 });
  }

  await prisma.report.delete({
    where: { id: String(id) },
  });

  return NextResponse.json({ message: "Relatório deletado com sucesso" });
}
