import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CatalogApi, ProductApi } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type Props = {
  limit?: number;
  category?: string; // filter by category name (case-insensitive)
  search?: string; // filter by text across name/summary/description/sku/categories
  onResultCount?: (count: number) => void;
};

export default function ProductGrid({ limit, category, search, onResultCount }: Props) {
  const query = useQuery({
    queryKey: ["products", { category }],
    queryFn: async () => {
      const res = await ProductApi.list();
      return res.products;
    },
    staleTime: 60_000,
  });

  // Fetch catalogs to display chips for membership on storefront
  const catalogsQuery = useQuery({
    queryKey: ["catalogs", "public"],
    queryFn: () => CatalogApi.list(),
    staleTime: 60_000,
  });

  const products = useMemo(() => {
    const list = (query.data ?? []).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const byCategory = category
      ? list.filter((p) => p.categories.some((c) => c.category.name.toLowerCase() === category.toLowerCase()))
      : list;

    const term = (search ?? "").trim().toLowerCase();
    const bySearch = term
      ? byCategory.filter((p) => {
          const haystack = [
            p.name,
            p.summary ?? "",
            p.description ?? "",
            p.sku ?? "",
            ...p.categories.map((c) => c.category.name),
          ]
            .join("\n")
            .toLowerCase();
          return haystack.includes(term);
        })
      : byCategory;

    return typeof limit === "number" ? bySearch.slice(0, limit) : bySearch;
  }, [query.data, limit, category, search]);

  const catalogChips = useMemo(() => {
    const map = new Map<string, string[]>();
    const catalogs = catalogsQuery.data?.catalogs ?? [];
    catalogs.forEach((c) => {
      c.items?.forEach((item) => {
        const arr = map.get(item.product.id) ?? [];
        if (!arr.includes(c.title)) arr.push(c.title);
        map.set(item.product.id, arr);
      });
    });
    return map;
  }, [catalogsQuery.data]);

  // Announce result count to parent (for UX summaries)
  useMemo(() => {
    if (onResultCount) onResultCount((products ?? []).length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onResultCount, products?.length]);

  if (query.isLoading) {
    return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: limit ?? 8 }).map((_, i) => (
      <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
    ))}</div>;
  }

  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {search ? (
            <>
              No live products match "<span className="font-medium text-foreground">{search}</span>".
              Try broader terms or clearing filters. See featured catalogs below.
            </>
          ) : (
            <>No products yet.</>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} extraBadges={(catalogChips.get(p.id) ?? []).map((t) => `Catalog: ${t}`).slice(0, 2)} />
      ))}
    </div>
  );
}
