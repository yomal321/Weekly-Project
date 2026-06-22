import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.ticket.deleteMany();

  await prisma.ticket.createMany({
    data: [
      {
        title: "Client portal login broken",
        description: "Users cannot log in — blank screen after credentials.",
        source: "Email",
        priority: "P0",
        resolved: false,
      },
      {
        title: "API returns 500 on export",
        description: "PDF export endpoint crashes for all report types.",
        source: "Slack",
        priority: "P0",
        resolved: false,
      },
      {
        title: "Dashboard loads slowly",
        description: "Main dashboard takes 8–10s on standard office machines.",
        source: "Slack",
        priority: "P1",
        resolved: false,
      },
      {
        title: "Email notifications delayed",
        description: "Alerts arriving 2–3 hours late for some users.",
        source: "Email",
        priority: "P1",
        resolved: false,
      },
      {
        title: "Update staff directory with new hires",
        description: "Three new team members missing from the staff page.",
        source: "Spreadsheet",
        priority: "P2",
        resolved: false,
      },
      {
        title: "Footer link is broken",
        description: "Privacy policy link returns 404.",
        source: "Other",
        priority: "P2",
        resolved: true,
      },
    ],
  });

  console.log("Seeded 6 tickets.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
