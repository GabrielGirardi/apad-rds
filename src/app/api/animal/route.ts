import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas para a tabela de animais (animals) com operações CRUD
 *
 * GET: Lista todos os animais.
 * POST: Cria um novo animal.
  */
  const prisma = new PrismaClient();

/**
 * Lista todas os animais.
 *
 * @returns Animais em formato JSON.
 */
export async function GET() {
    const session = await getSession();
    if (!session || !canAccess(session.user.role, "view")) {
        return new Response("Acesso negado", { status: 403 });
    }

    const animals = await prisma.animal.findMany();
    return NextResponse.json(animals);
}

/**
 * Cria um animal.
 * Requer os dados do animal no corpo da requisição.
 * O corpo deve conter os campos: name, description, species, breed, gender, imageUrl, status.
 *
 * @param request
 * @returns Animal criado em formato JSON.
 */
export async function POST(request: Request) {
    const session = await getSession();
    if (!session || !canAccess(session.user.role, "create")) {
        return new Response("Acesso negado", { status: 403 });
    }

    const body = await request.json();
    const { name, description, species, breedId, gender, imageUrl, status } = body;
    const newAnimal = await prisma.animal.create({
        data: { name, description, species, breedId, gender, imageUrl, status },
    });
    return NextResponse.json(newAnimal, { status: 201 });
}
