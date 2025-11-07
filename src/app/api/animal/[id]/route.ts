import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getRouteParam } from "@/lib/utils/url";
import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas dinâmicas para animais (animal) com operações CRUD.
 *
 * PUT: Atualiza um animal existente.
 * DELETE: Deleta um animal existente.
 * PATCH: Atualiza o status de um animal existente.
 */
const prisma = new PrismaClient();

/**
 * Atualiza um animal existente.
 * Requer o ID do animal na URL e os dados atualizados no corpo da requisição.
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

  const { name, description, species, breed, gender, imageUrl, status } = await request.json();

  const updated = await prisma.animal.update({
    where: { id: String(id) },
    data: { name, description, species, breed, gender, imageUrl, status },
  });

  return NextResponse.json(updated);
}

/**
 * Deleta um animal existente.
 * Requer o ID do animal na URL.
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

  const exists = await prisma.animal.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Animal não encontrado" }, { status: 404 });
  }

  await prisma.animal.delete({
    where: { id: String(id) },
  });

  return NextResponse.json({ message: "Animal deletado com sucesso" });
}

/**
 * Atualiza o status de um animal existente.
 * Requer o ID do animal na URL e o novo status no corpo da requisição.
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

  const exists = await prisma.animal.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Animal não encontrado" }, { status: 404 });
  }

  const { status } = await request.json();

  const updated = await prisma.animal.update({
    where: { id: String(id) },
    data: { status },
  });

  return NextResponse.json(updated);
}
