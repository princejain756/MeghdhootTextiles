import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  // Pick a handful of catalogs to synthesize demo products from
  const catalogs = await prisma.catalog.findMany({
    orderBy: { updatedAt: "desc" },
    take: 8,
  });

  for (const c of catalogs) {
    const baseName = `${c.title} Set`;
    const slug = slugify(`${c.slug}-set`);

    const existing = await prisma.product.findFirst({ where: { slug } });
    if (existing) continue;

    const product = await prisma.product.create({
      data: {
        name: baseName,
        slug,
        summary: `From ${c.title} catalog`,
        description: `Assortment from ${c.title}. Generated for storefront demo.`,
        price: 999.0,
        currency: "INR",
        sku: undefined,
        stock: 50,
        featured: false,
        images: c.coverImageUrl
          ? {
              create: [{ url: c.coverImageUrl, alt: c.title, position: 0 }],
            }
          : undefined,
        categories: {
          create: [
            {
              category: {
                connectOrCreate: {
                  where: { name: "sarees" },
                  create: { name: "sarees" },
                },
              },
            },
          ],
        },
      },
    });

    // Link product into the catalog as first item if not already linked
    try {
      await prisma.catalogProduct.create({
        data: { catalogId: c.id, productId: product.id, position: 0 },
      });
    } catch {
      // ignore unique violations
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

