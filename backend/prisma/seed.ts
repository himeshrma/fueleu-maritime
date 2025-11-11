import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.shipCompliance.deleteMany();
  await prisma.route.deleteMany();

  console.log("✅ Cleared existing data");

  // Seed Routes
  const routes = await prisma.route.createMany({
    data: [
      {
        routeId: "R001",
        vesselType: "Container",
        fuelType: "HFO",
        year: 2024,
        ghgIntensity: 91.0,
        fuelConsumption: 5000,
        distance: 12000,
        totalEmissions: 4500,
        isBaseline: true,
      },
      {
        routeId: "R002",
        vesselType: "BulkCarrier",
        fuelType: "LNG",
        year: 2024,
        ghgIntensity: 88.0,
        fuelConsumption: 4800,
        distance: 11500,
        totalEmissions: 4200,
        isBaseline: false,
      },
      {
        routeId: "R003",
        vesselType: "Tanker",
        fuelType: "MGO",
        year: 2024,
        ghgIntensity: 93.5,
        fuelConsumption: 5100,
        distance: 12500,
        totalEmissions: 4700,
        isBaseline: false,
      },
      {
        routeId: "R004",
        vesselType: "RoRo",
        fuelType: "HFO",
        year: 2025,
        ghgIntensity: 89.2,
        fuelConsumption: 4900,
        distance: 11800,
        totalEmissions: 4300,
        isBaseline: false,
      },
      {
        routeId: "R005",
        vesselType: "Container",
        fuelType: "LNG",
        year: 2025,
        ghgIntensity: 90.5,
        fuelConsumption: 4950,
        distance: 11900,
        totalEmissions: 4400,
        isBaseline: false,
      },
    ],
  });

  console.log(`✅ Created ${routes.count} routes`);

  // Seed Ship Compliance
  const compliance = await prisma.shipCompliance.createMany({
    data: [
      {
        shipId: "SHIP001",
        year: 2025,
        cbGco2eq: 150000,
        targetIntensity: 89.3368,
        actualIntensity: 88.0,
        energyInScope: 196800000,
      },
      {
        shipId: "SHIP002",
        year: 2025,
        cbGco2eq: -80000,
        targetIntensity: 89.3368,
        actualIntensity: 91.5,
        energyInScope: 205000000,
      },
      {
        shipId: "SHIP003",
        year: 2025,
        cbGco2eq: 200000,
        targetIntensity: 89.3368,
        actualIntensity: 87.5,
        energyInScope: 202950000,
      },
      {
        shipId: "SHIP004",
        year: 2025,
        cbGco2eq: -120000,
        targetIntensity: 89.3368,
        actualIntensity: 92.0,
        energyInScope: 200900000,
      },
    ],
  });

  console.log(`✅ Created ${compliance.count} ship compliance records`);

  // Seed Bank Entries
  const bankEntries = await prisma.bankEntry.createMany({
    data: [
      {
        shipId: "SHIP001",
        year: 2024,
        amountGco2eq: 100000,
        status: "available",
      },
      {
        shipId: "SHIP003",
        year: 2024,
        amountGco2eq: 150000,
        status: "available",
      },
    ],
  });

  console.log(`✅ Created ${bankEntries.count} bank entries`);

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
