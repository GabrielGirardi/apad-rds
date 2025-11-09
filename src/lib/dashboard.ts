import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./prisma";

export async function getDashboardData() {
  noStore();

  try {
    const [
      totalPeople,
      totalUsers,
      totalReports,
      totalAnimals,
      totalCampaigns,
      totalEvents,
      totalBreeds,
      reportsByStatus,
      animalsByStatus
    ] = await Promise.all([
      prisma.person.count(),
      prisma.user.count({
        where: {
          email: {
            not: "admin@teste.com.br",
          },
        },
      }),
      prisma.report.count(),
      prisma.animal.count(),
      prisma.campaign.count(),
      prisma.event.count(),
      prisma.breed.count(),
      prisma.report.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.animal.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    const reportStatusSummary = reportsByStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const animalStatusSummary = animalsByStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPeople,
      totalUsers,
      totalReports,
      totalAnimals,
      totalCampaigns,
      totalEvents,
      totalBreeds,
      reportStatusSummary,
      animalStatusSummary
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return {
      totalPeople: 0,
      totalUsers: 0,
      totalReports: 0,
      totalAnimals: 0,
      totalCampaigns: 0,
      totalEvents: 0,
      totalBreeds: 0,
      reportStatusSummary: {},
      animalStatusSummary: {}
    };
  }
}
