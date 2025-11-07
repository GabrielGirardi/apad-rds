import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getRouteParam } from "@/lib/utils/url";
import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas dinâmicas para raças (breed) com operações CRUD.
 *
 * PUT: Atualiza uma raça existente.
 * DELETE: Deleta uma raça existente.
 * PATCH: Atualiza o nome de uma raça existente.
 */
const prisma = new PrismaClient();

/**
 * Atualiza uma raça existente.
 * Requer o ID da raça na URL e os dados atualizados no corpo da requisição.
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

  const { name } = await request.json();

  const updated = await prisma.breed.update({
    where: { id: String(id) },
    data: { name },
  });

  return NextResponse.json(updated);
}

/**
 * Deleta uma raça existente.
 * Requer o ID da raça na URL.
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

  const hasAnimals = await prisma.animal.findFirst({
    where: { breed: { id: String(id) } },
  });

  if (hasAnimals) {
    return NextResponse.json(
      { message: "Essa raça está vinculada a animais e não pode ser excluída." },
      { status: 400 }
    );
  }

  await prisma.breed.delete({
    where: { id: String(id) },
  });

  return NextResponse.json({ message: "Raça deletada com sucesso" });
}

/**
 * Atualiza o nome de uma raça existente.
 * Requer o ID da raça na URL e o novo nome no corpo da requisição.
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

  const exists = await prisma.breed.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Raça não encontrada" }, { status: 404 });
  }

  const { name } = await request.json();

  const updated = await prisma.breed.update({
    where: { id: String(id) },
    data: { name },
  });

  return NextResponse.json(updated);
}
