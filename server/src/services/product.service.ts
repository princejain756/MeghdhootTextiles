import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";
import { slugify } from "../utils/slug";

interface ProductInput {
  name: string;
  summary?: string;
  description?: string;
  price: number;
  currency?: string;
  sku?: string;
  stock?: number;
  featured?: boolean;
  categories?: string[];
  images?: Array<{
    url: string;
    alt?: string;
    position?: number;
  }>;
  videos?: Array<{
    url: string;
    position?: number;
  }>;
}

const ensureUniqueSlug = async (baseName: string, excludeProductId?: string) => {
  const baseSlug = slugify(baseName);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

export const ProductService = {
  async listProducts() {
    return prisma.product.findMany({
      include: {
        images: { orderBy: { position: "asc" } },
        videos: { orderBy: { position: "asc" } },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: "asc" } },
        videos: { orderBy: { position: "asc" } },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      throw createHttpError(404, "Product not found");
    }

    return product;
  },

  async createProduct(input: ProductInput) {
    const slug = await ensureUniqueSlug(input.name);

    const categories = input.categories ?? [];

    const product = await prisma.product.create({
      data: {
        name: input.name,
        slug,
        summary: input.summary,
        description: input.description,
        price: new Prisma.Decimal(input.price),
        currency: input.currency ?? "INR",
        sku: input.sku,
        stock: input.stock ?? 0,
        featured: input.featured ?? false,
        images: input.images
          ? {
              create: input.images.map((image, index) => ({
                url: image.url,
                alt: image.alt,
                position: image.position ?? index,
              })),
            }
          : undefined,
        videos: input.videos
          ? {
              create: input.videos.map((video, index) => ({
                url: video.url,
                position: video.position ?? index,
              })),
            }
          : undefined,
        categories: categories.length
          ? {
              create: await Promise.all(
                categories.map(async (categoryName) => {
                  const lower = categoryName.trim();
                  if (!lower) return undefined;
                  const category = await prisma.category.upsert({
                    where: { name: lower },
                    update: {},
                    create: { name: lower },
                  });

                  return {
                    category: {
                      connect: { id: category.id },
                    },
                  };
                })
              ).then((values) => values.filter(Boolean) as { category: { connect: { id: string } } }[]),
            }
          : undefined,
      },
      include: {
        images: true,
        videos: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return product;
  },

  async updateProduct(id: string, input: ProductInput) {
    await this.getProductById(id);

    const slug = input.name ? await ensureUniqueSlug(input.name, id) : undefined;

    const categories = input.categories ?? [];

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: input.name,
        slug,
        summary: input.summary,
        description: input.description,
        price: input.price !== undefined ? new Prisma.Decimal(input.price) : undefined,
        currency: input.currency,
        sku: input.sku,
        stock: input.stock,
        featured: input.featured,
        categories: {
          deleteMany: {},
          create: categories.length
            ? await Promise.all(
                categories.map(async (categoryName) => {
                  const lower = categoryName.trim();
                  if (!lower) return undefined;
                  const category = await prisma.category.upsert({
                    where: { name: lower },
                    update: {},
                    create: { name: lower },
                  });

                  return {
                    category: {
                      connect: { id: category.id },
                    },
                  };
                })
              ).then((values) => values.filter(Boolean) as { category: { connect: { id: string } } }[])
            : [],
        },
        images: input.images
          ? {
              deleteMany: {},
              create: input.images.map((image, index) => ({
                url: image.url,
                alt: image.alt,
                position: image.position ?? index,
              })),
            }
          : undefined,
        videos: input.videos
          ? {
              deleteMany: {},
              create: input.videos.map((video, index) => ({
                url: video.url,
                position: video.position ?? index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        videos: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return product;
  },

  async deleteProduct(id: string) {
    await this.getProductById(id);

    await prisma.product.delete({ where: { id } });
  },
};
