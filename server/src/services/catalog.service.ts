import { prisma } from "../lib/prisma";
import { slugify } from "../utils/slug";

export interface CatalogInput {
  title: string;
  description?: string;
  category?: string;
  status?: string;
  catalogCode?: string;
  fabric?: string;
  setSize?: string;
  dispatch?: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  itemsCount?: number;
  productIds?: string[]; // optional set + order
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  const baseSlug = slugify(base);
  let slug = baseSlug;
  let i = 1;
  while (true) {
    const found = await prisma.catalog.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    if (!found) return slug;
    slug = `${baseSlug}-${i++}`;
  }
}

export const CatalogService = {
  async list() {
    return prisma.catalog.findMany({
      include: {
        items: {
          orderBy: { position: "asc" },
          include: {
            product: {
              include: {
                images: { orderBy: { position: "asc" } },
                videos: { orderBy: { position: "asc" } },
                categories: { include: { category: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  async get(id: string) {
    const catalog = await prisma.catalog.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { position: "asc" },
          include: {
            product: {
              include: {
                images: { orderBy: { position: "asc" } },
                videos: { orderBy: { position: "asc" } },
                categories: { include: { category: true } },
              },
            },
          },
        },
      },
    });
    if (!catalog) throw new Error("Catalog not found");
    return catalog;
  },

  async create(input: CatalogInput) {
    const slug = await ensureUniqueSlug(input.title);
    const productIds = input.productIds ?? [];
    return prisma.catalog.create({
      data: {
        title: input.title,
        slug,
        description: input.description,
        category: input.category,
        status: input.status ?? "ACTIVE",
        catalogCode: input.catalogCode,
        fabric: input.fabric,
        setSize: input.setSize,
        dispatch: input.dispatch,
        coverImageUrl: input.coverImageUrl,
        pdfUrl: input.pdfUrl,
        itemsCount: input.itemsCount,
        items: productIds.length
          ? {
              create: productIds.map((id, index) => ({ productId: id, position: index })),
            }
          : undefined,
      },
      include: {
        items: { orderBy: { position: "asc" }, include: { product: true } },
      },
    });
  },

  async update(id: string, input: CatalogInput) {
    const slug = input.title ? await ensureUniqueSlug(input.title, id) : undefined;
    const productIds = input.productIds;
    return prisma.catalog.update({
      where: { id },
      data: {
        title: input.title,
        slug,
        description: input.description,
        category: input.category,
        status: input.status,
        catalogCode: input.catalogCode,
        fabric: input.fabric,
        setSize: input.setSize,
        dispatch: input.dispatch,
        coverImageUrl: input.coverImageUrl,
        pdfUrl: input.pdfUrl,
        itemsCount: input.itemsCount,
        ...(productIds
          ? {
              items: {
                deleteMany: {},
                create: productIds.map((pid, index) => ({ productId: pid, position: index })),
              },
            }
          : {}),
      },
      include: {
        items: { orderBy: { position: "asc" }, include: { product: true } },
      },
    });
  },

  async setProducts(id: string, productIds: string[]) {
    return prisma.catalog.update({
      where: { id },
      data: {
        items: {
          deleteMany: {},
          create: productIds.map((pid, index) => ({ productId: pid, position: index })),
        },
      },
      include: { items: { orderBy: { position: "asc" }, include: { product: true } } },
    });
  },

  async remove(id: string) {
    await prisma.catalog.delete({ where: { id } });
  },
};
