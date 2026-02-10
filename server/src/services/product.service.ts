import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";
import { prisma } from "../lib/prisma";
import { slugify } from "../utils/slug";

interface ProductInput {
  name: string;
  summary?: string;
  description?: string;
  specs?: unknown; // array of { label, value } or key-value map
  shippingInfo?: string;
  careInstructions?: string;
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

function normalizeCategories(categories: string[] = []) {
  return categories.map((c) => c.toLowerCase().trim());
}

function buildDefaults(categories: string[], input: ProductInput) {
  const cats = normalizeCategories(categories);
  const has = (term: string) => cats.some((c) => c.includes(term));
  let template: "sarees" | "kurtis" | "salwars" | "indo-western" | "fabrics" | "eco-jewellery" = "sarees";
  if (has("kurt")) template = "kurtis";
  else if (has("salwar") || has("suit")) template = "salwars";
  else if (has("indo") || has("fusion")) template = "indo-western";
  else if (has("fabric")) template = "fabrics";
  else if (has("eco") || has("jewel")) template = "eco-jewellery";

  const commonShipping =
    "Dispatch in 2–5 business days. Pan-India shipping with tracking. GST invoice provided.";
  const commonCare =
    "Dry clean recommended. Store away from direct sunlight. Iron on low heat.";

  switch (template) {
    case "kurtis":
      return {
        description:
          input.description ??
          "Contemporary kurti crafted for all-day comfort with versatile styling.",
        specs:
          input.specs ?? [
            { label: "Fabric", value: "Cotton/Rayon blend" },
            { label: "Fit", value: "Regular" },
            { label: "Sleeves", value: "3/4th" },
            { label: "Length", value: "Knee/Calf length" },
          ],
        shippingInfo: input.shippingInfo ?? commonShipping,
        careInstructions: input.careInstructions ?? commonCare,
      };
    case "salwars":
      return {
        description:
          input.description ??
          "Elegantly tailored salwar suit set ideal for festive and daily wear.",
        specs:
          input.specs ?? [
            { label: "Set Contents", value: "Top, Bottom, Dupatta" },
            { label: "Fabric", value: "Assorted blends" },
            { label: "Work", value: "Embroidered/Printed" },
          ],
        shippingInfo: input.shippingInfo ?? commonShipping,
        careInstructions: input.careInstructions ?? commonCare,
      };
    case "indo-western":
      return {
        description:
          input.description ??
          "Fusion silhouette balancing traditional motifs with modern cuts.",
        specs:
          input.specs ?? [
            { label: "Silhouette", value: "Contemporary" },
            { label: "Occasion", value: "Party/Cocktail" },
          ],
        shippingInfo: input.shippingInfo ?? commonShipping,
        careInstructions: input.careInstructions ?? commonCare,
      };
    case "fabrics":
      return {
        description: input.description ?? "Premium fabric yardage for bespoke tailoring.",
        specs:
          input.specs ?? [
            { label: "Width", value: "44–58 inches" },
            { label: "Material", value: "Varies" },
          ],
        shippingInfo: input.shippingInfo ?? commonShipping,
        careInstructions: input.careInstructions ?? commonCare,
      };
    case "eco-jewellery":
      return {
        description:
          input.description ??
          "Sustainably crafted accessories and jewellery with mindful materials.",
        specs:
          input.specs ?? [
            { label: "Material", value: "Eco-conscious/Alloy/Handcrafted" },
            { label: "Finish", value: "Nickel-safe" },
          ],
        shippingInfo: input.shippingInfo ?? commonShipping,
        careInstructions: input.careInstructions ?? "Wipe with soft cloth. Keep away from moisture.",
      };
    case "sarees":
    default:
      return {
        description:
          input.description ??
          "Classic saree with balanced drape and timeless detailing. Includes blouse piece unless stated otherwise.",
        specs:
          input.specs ?? [
            { label: "Length", value: "6.3 m with blouse" },
            { label: "Weave", value: "Assorted" },
            { label: "Occasion", value: "Festive/Occasion" },
          ],
        shippingInfo: input.shippingInfo ?? commonShipping,
        careInstructions: input.careInstructions ?? commonCare,
      };
  }
}

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

  async getProductById(idOrSlug: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const product = await prisma.product.findUnique({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
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

    // Auto-generate default PDP content when missing
    const defaults = buildDefaults(categories, input);

    const product = await prisma.product.create({
      data: {
        name: input.name,
        slug,
        summary: input.summary,
        description: defaults.description,
        specs: (defaults.specs ?? undefined) as Prisma.InputJsonValue,
        shippingInfo: defaults.shippingInfo,
        careInstructions: defaults.careInstructions,
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
        specs: (input.specs ?? undefined) as Prisma.InputJsonValue,
        shippingInfo: input.shippingInfo,
        careInstructions: input.careInstructions,
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
