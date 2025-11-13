import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas para a tabela de eventos (events) com operações CRUD.
 *
 * GET: Lista todos os eventos.
 * POST: Cria um novo evento.
 */
const prisma = new PrismaClient();

/**
 * Lista todos os eventos.
 *
 * @returns Eventos em formato JSON.
 */
export async function GET() {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "view")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const events = await prisma.event.findMany();
  return NextResponse.json(events);
}

/**
 * Cria um evento.
 * Requer os dados do evento no corpo da requisição.
 * O corpo deve conter os campos: title, description, tags, finishAt.
 *
 * @param request
 * @returns Evento criado em formato JSON.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "create")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const body = await request.json();
  const { title, description, organizer, tags, startAt, finishAt } = body;

  const newEvent = await prisma.event.create({
    data: {
      title,
      description,
      organizer,
      tags,
      startAt: new Date(startAt),
      finishAt: new Date(finishAt),
    },
  });

  return NextResponse.json(newEvent, { status: 201 });
}
