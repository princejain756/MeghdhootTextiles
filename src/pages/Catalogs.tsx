import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CatalogApi } from "@/lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDown, Search, Sparkles, Layers, Library, Shield, ArrowUpRight } from "lucide-react";
import type { ApiCatalog } from "@/types/api";
import logomegh from "@/assets/logomegh.png";
import ProductGrid from "@/components/ProductGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// PDF thumbnails
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker once per bundle
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type CatalogCategory = "all" | "sarees" | "kurtis" | "fusion" | "menswear";

const categoryOptions: { id: CatalogCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sarees", label: "Sarees" },
  { id: "kurtis", label: "Kurtis" },
  { id: "fusion", label: "Fusion" },
  { id: "menswear", label: "Menswear" },
];

const faqItems = [
  {
    question: "How often are catalogs refreshed?",
    answer:
      "Major edits drop every fortnight with micro-updates pushed when pricing or availability shifts. You receive alerts instantly via WhatsApp and email.",
  },
  {
    question: "Do catalogs include marketing content?",
    answer:
      "Every catalog ships with product copy, styling notes, and recommended merchandising sets. Premium packs include ready-to-use reels and static posts.",
  },
  {
    question: "Can I request a bespoke catalog?",
    answer:
      "Yes. Share your target customer, price band and preferred fabrics. Our team will craft an exclusive line-sheet within 24 hours.",
  },
];

const Catalogs = () => {
  const thumbCache = useRef(new Map<string, string>()).current;

  // Prefer pre-shot catalog cover images over rendering the first PDF page
  const imageModules = import.meta.glob("/src/assets/CatalogImages/*.{png,jpg,jpeg,webp}", {
    eager: true,
    as: "url",
  }) as Record<string, string>;

  const normalizeKey = (value: string) =>
    value
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/\s*\(\d+\)\s*/g, " ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  function PdfThumb({ url, alt }: { url: string; alt: string }) {
    const [thumb, setThumb] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);
    const hostRef = useRef<HTMLDivElement | null>(null);
    const startedRef = useRef(false);

    useEffect(() => {
      const el = hostRef.current;
      if (!el) return;

      const start = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        (async () => {
          try {
            const cached = thumbCache.get(url);
            if (cached) {
              setThumb(cached);
              setLoading(false);
              return;
            }
            const loadingTask = (pdfjsLib as any).getDocument({ url });
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const containerWidth = hostRef.current?.clientWidth || 640;
            const baseViewport = page.getViewport({ scale: 1 });
            const scale = Math.min(1.2, Math.max(0.3, containerWidth / baseViewport.width));
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            await page.render({ canvasContext: ctx!, viewport }).promise;
            const dataUrl = canvas.toDataURL("image/png");
            thumbCache.set(url, dataUrl);
            setThumb(dataUrl);
          } catch (_e) {
            setErrored(true);
          } finally {
            setLoading(false);
          }
        })();
      };

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                start();
                io.disconnect();
              }
            });
          },
          { rootMargin: "150px" }
        );
        io.observe(el);
        return () => io.disconnect();
      }

      // Fallback without IO
      start();
    }, [url]);

    return (
      <div ref={hostRef} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/40">
        {thumb ? (
          <img src={thumb} alt={alt} className="h-full w-full object-contain bg-white" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            {errored ? "Preview unavailable" : loading ? "Generating preview…" : "Preview unavailable"}
          </div>
        )}
      </div>
    );
  }
  // Static PDF catalogs imported from assets (build-time glob)
  const pdfModules = import.meta.glob("/src/assets/Catalogs/*.pdf", { eager: true, as: "url" }) as Record<string, string>;
  const staticPdfs = useMemo(() => {
    const humanize = (file: string) =>
      file
        .replace(/^.*\//, "")
        .replace(/\.[Pp][Dd][Ff]$/, "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\s*\(\d+\)\s*/g, " ")
        .trim();
    const imageByKey = new Map<string, string>();
    Object.entries(imageModules).forEach(([imgPath, imgUrl]) => {
      imageByKey.set(normalizeKey(imgPath), imgUrl);
    });
    return Object.entries(pdfModules)
      .map(([path, url]) => {
        const key = normalizeKey(path);
        const image = imageByKey.get(key);
        return { title: humanize(path), url, image } as { title: string; url: string; image?: string };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  // A thumb component that uses a catalog image if present, otherwise falls back to a PDF render
  function CatalogThumb({ url, alt, image }: { url: string; alt: string; image?: string }) {
    if (image) {
      return (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/40">
          <img src={image} alt={alt} className="h-full w-full object-cover" />
        </div>
      );
    }
    return <PdfThumb url={url} alt={alt} />;
  }

  // Lightweight viewer state
  const [pdfOpen, setPdfOpen] = useState(false);
  const [activePdf, setActivePdf] = useState<{ title: string; url: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = (searchParams.get("cat") as CatalogCategory) || "all";
  const initialQuery = searchParams.get("q") || "";
  const [category, setCategory] = useState<CatalogCategory>(initialCategory);
  // live query bound to input
  const [query, setQuery] = useState(initialQuery);
  // debounced/committed query used for filtering + grid
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [liveCount, setLiveCount] = useState(0);

  // Debounce as user types for smoother UX
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(id);
  }, [query]);

  // Auto-open PDF preview if `pdf` query param is present
  useEffect(() => {
    const previewParam = searchParams.get("pdf");
    if (!previewParam) return;
    let decoded: string | null = null;
    try {
      decoded = decodeURIComponent(previewParam);
    } catch {
      decoded = previewParam;
    }

    // Try match by URL first, then by title
    const byUrl = staticPdfs.find((p) => p.url === decoded);
    if (byUrl) {
      setActivePdf(byUrl);
      setPdfOpen(true);
      return;
    }
    const normalize = (s: string) =>
      s.toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim();
    const byTitle = staticPdfs.find((p) => normalize(p.title) === normalize(decoded!));
    if (byTitle) {
      setActivePdf(byTitle);
      setPdfOpen(true);
    }
  }, [searchParams, staticPdfs]);

  // Sync URL when filters change (great UX + shareable URLs)
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedQuery) next.set("q", debouncedQuery); else next.delete("q");
    if (category && category !== "all") next.set("cat", category); else next.delete("cat");
    setSearchParams(next, { replace: true });
  }, [debouncedQuery, category]);

  // Load catalogs from API
  const catalogsQuery = useQuery({
    queryKey: ["catalogs", "public"],
    queryFn: () => CatalogApi.list(),
  });

  const apiCatalogs: ApiCatalog[] = catalogsQuery.data?.catalogs ?? [];

  const featuredCatalogs = useMemo(() => {
    return apiCatalogs.map((c) => ({
      title: c.title,
      category: (c.category ?? "sarees") as CatalogCategory,
      updated: new Date(c.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      downloads: String(c.downloads ?? 0),
      highlights: [
        `${c.items.length} styles selected`,
        "Includes price sheet",
        "Ready-to-share assets",
      ],
      formats: ["PDF", "CSV"],
      items: c.items.map((it) => ({
        name: it.product.name,
        sku: it.product.sku ?? "",
        price: it.product.price,
        currency: it.product.currency,
        categories: it.product.categories.map((cc) => cc.category.name),
        image: it.product.images?.[0]?.url ?? "",
      })),
    }));
  }, [apiCatalogs]);

  const filteredCatalogs = useMemo(() => {
    return featuredCatalogs.filter((catalog) => {
      const matchesCategory = category === "all" || catalog.category === category;
      const matchesQuery = catalog.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, debouncedQuery, featuredCatalogs]);

  const filteredStaticPdfs = useMemo(() => {
    if (!debouncedQuery) return staticPdfs;
    return staticPdfs.filter((p) => p.title.toLowerCase().includes(debouncedQuery.toLowerCase()));
  }, [debouncedQuery, staticPdfs]);

  // Surface local PDFs as recently added featured catalogs (Sarees)
  type FeaturedLike = {
    title: string;
    category: CatalogCategory;
    updated: string;
    downloads: string;
    highlights: string[];
    formats: string[];
    items?: Array<unknown>;
    pdfUrl?: string;
    imageUrl?: string;
  };
  const staticFeaturedCatalogs: FeaturedLike[] = useMemo(() => {
    const nowLabel = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    return staticPdfs.map((p) => ({
      title: p.title,
      category: "sarees" as CatalogCategory,
      updated: nowLabel,
      downloads: "0",
      highlights: ["New catalog", "Local PDF"],
      formats: ["PDF"],
      items: [],
      pdfUrl: p.url,
      imageUrl: (p as any).image as string | undefined,
    }));
  }, [staticPdfs]);

  const allFeaturedCatalogs: FeaturedLike[] = useMemo(() => {
    // Recently added first (local PDFs), then API results
    return [...staticFeaturedCatalogs, ...featuredCatalogs];
  }, [staticFeaturedCatalogs, featuredCatalogs]);

  const filteredAllFeatured = useMemo(() => {
    return allFeaturedCatalogs.filter((catalog) => {
      const matchesCategory = category === "all" || catalog.category === category;
      const matchesQuery = catalog.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [allFeaturedCatalogs, category, debouncedQuery]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Commit immediately and scroll to results
    setDebouncedQuery(query.trim());
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function downloadCatalogCSV(title: string, items?: Array<{ name: string; sku?: string; price: string; currency: string; categories: string[] }>) {
    if (!items?.length) return;
    const header = ["Name", "SKU", "Price", "Currency", "Categories"];
    const rows = items.map((it) => [
      it.name,
      it.sku ?? "",
      String(it.price),
      it.currency,
      it.categories.join("; "),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-catalog.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function openCatalogPrintView(title: string, items?: Array<{ name: string; sku?: string; price: string; currency: string; categories: string[]; image?: string }>) {
    if (!items?.length) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const prices = items.map((it) => Number(it.price)).filter((n) => !Number.isNaN(n));
    const count = items.length;
    const min = prices.length ? Math.min(...prices) : 0;
    const max = prices.length ? Math.max(...prices) : 0;
    const avg = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const rows = items
      .map(
        (it, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><img src="${it.image ?? ""}" alt="" style="height:56px;width:56px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;" /></td>
          <td>
            <div style="font-weight:600">${escapeHtml(it.name)}</div>
            <div style="color:#6b7280; font-size:11px">${escapeHtml(it.categories.join(", "))}</div>
          </td>
          <td>${escapeHtml(it.sku ?? "")}</td>
          <td style="white-space:nowrap;">${escapeHtml(it.currency)} ${escapeHtml(String(it.price))}</td>
        </tr>`
      )
      .join("");
    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)} – Catalog</title>
        <style>
          body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding:24px; }
          .brand{ display:flex; align-items:center; gap:12px; margin-bottom:8px; }
          .brand img{ height:40px; }
          h1{ margin:0 0 12px; font-size:20px; }
          .meta{ color:#555; font-size:12px; margin-bottom:18px; }
          .summary{ display:flex; gap:16px; margin-bottom:12px; font-size:12px; }
          .cover{ display:flex; flex-direction:column; align-items:center; justify-content:center; height:80vh; text-align:center; background:linear-gradient(135deg, #0f172a 0%, #1f2937 50%, #334155 100%); color:#fff; border-radius:12px; }
          .cover h1{ font-size:32px; margin:8px 0; }
          .cover p{ color:#e5e7eb; }
          .page-break{ page-break-after: always; }
          table{ width:100%; border-collapse: collapse; }
          th, td{ border:1px solid #e5e7eb; padding:8px; font-size:12px; }
          th{ background:#f5f5f5; text-align:left; }
          @media print {
            body{ padding:0; }
            .cover{ border-radius:0; height:100vh; }
          }
        </style>
      </head>
      <body>
        <section class="cover page-break">
          <img src="${logomegh}" alt="Meghdoot" style="height:64px" />
          <h1>${escapeHtml(title)}</h1>
          <p>Generated ${new Date().toLocaleString()}</p>
          <div style="display:flex; gap:16px; margin-top:12px; font-size:14px; color:#fde68a">
            <div>Items: <strong>${count}</strong></div>
            <div>Min: <strong>${prices.length ? escapeHtml(items[0].currency) : "INR"} ${min.toFixed(2)}</strong></div>
            <div>Avg: <strong>${prices.length ? escapeHtml(items[0].currency) : "INR"} ${avg.toFixed(2)}</strong></div>
            <div>Max: <strong>${prices.length ? escapeHtml(items[0].currency) : "INR"} ${max.toFixed(2)}</strong></div>
          </div>
        </section>

        <div class="brand">
          <img src="${logomegh}" alt="Meghdoot" />
          <div>
            <div style="font-weight:600">Meghdoot Trade Hub</div>
            <div class="meta">Product list</div>
          </div>
        </div>
        <h1>${escapeHtml(title)} – Items</h1>
        <div class="summary">
          <div><strong>Items:</strong> ${count}</div>
          <div><strong>Min:</strong> ${prices.length ? escapeHtml(items[0].currency) : "INR"} ${min.toFixed(2)}</div>
          <div><strong>Avg:</strong> ${prices.length ? escapeHtml(items[0].currency) : "INR"} ${avg.toFixed(2)}</div>
          <div><strong>Max:</strong> ${prices.length ? escapeHtml(items[0].currency) : "INR"} ${max.toFixed(2)}</div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Image</th><th>Name</th><th>SKU</th><th>Price</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <script>window.onload = () => setTimeout(() => window.print(), 50);</script>
      </body>
      </html>`;
    w.document.write(html);
    w.document.close();
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-[#151f2d] text-primary-foreground">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 10% 15%, rgba(255,255,255,0.14), transparent 60%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl space-y-6">
            <Badge variant="secondary" className="bg-background/15 text-primary-foreground">
              <Library className="mr-2 h-3.5 w-3.5" /> Meghdoot catalog library
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Download richly-detailed catalogs backed by merchandising intelligence
            </h1>
            <p className="text-lg text-primary-foreground/85 md:text-xl">
              Filter by category, price band and dispatch readiness. Every file includes lookbooks, pricing, MOQ and marketing assets.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base">
                Access premium catalog set
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/30 bg-background/10 px-8 text-base text-primary-foreground hover:bg-background/20"
              >
                Request custom curation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/40">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Search className="h-4 w-4" />
            <span className="text-sm font-medium uppercase tracking-wide">Search and filter catalogs</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <form onSubmit={onSubmit} className="relative flex items-center">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by collection, fabric, theme"
                aria-label="Search catalogs"
                autoFocus
                className="pl-10 pr-24"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  title="Clear"
                  className="absolute right-16 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted/70"
                >
                  ×
                </button>
              )}
              <Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="mr-1 h-4 w-4" />
                Search
              </Button>
            </form>
            <Tabs value={category} onValueChange={(value) => setCategory(value as CatalogCategory)}>
              <TabsList>
                {categoryOptions.map((option) => (
                  <TabsTrigger key={option.id} value={option.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      <section ref={resultsRef} className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Live product catalogs</span>
          </div>
          <Tabs value={category} onValueChange={(v) => setCategory(v as CatalogCategory)}>
            <TabsList>
              {categoryOptions.map((opt) => (
                <TabsTrigger key={opt.id} value={opt.id} className="capitalize">
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="mt-3 text-xs text-muted-foreground">
            {liveCount} live products · {filteredAllFeatured.length} featured catalogs
          </div>
        </div>
        {category === "all" ? (
          <ProductGrid search={debouncedQuery} onResultCount={setLiveCount} />
        ) : (
          <ProductGrid category={category} search={debouncedQuery} onResultCount={setLiveCount} />
        )}

        {category === "sarees" && filteredStaticPdfs.length > 0 && (
          <div className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">New saree catalogs</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStaticPdfs.map((pdf: { title: string; url: string; image?: string }) => (
                <Card key={pdf.url} className="group border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader className="space-y-2">
                    <CardTitle className="line-clamp-2 text-base leading-snug">{pdf.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Catalog · PDF</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CatalogThumb url={pdf.url} alt={pdf.title} image={pdf.image} />
                  </CardContent>
                  <CardFooter className="flex items-center justify-between gap-2 border-t bg-muted/30 px-6 py-4">
                    <Button
                      size="sm"
                      onClick={() => {
                        setActivePdf(pdf);
                        setPdfOpen(true);
                      }}
                    >
                      View
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={pdf.url} download>
                        Download
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      <section id="featured" className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h2 className="text-section-title">Featured catalogs</h2>
            <p className="text-base text-muted-foreground">
              Downloadable in multiple formats with transparent pricing, dispatch timelines and imagery.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>{filteredAllFeatured.length} curated files available</span>
          </div>
        </div>
        {filteredAllFeatured.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-border/70 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No live catalogs yet. Once you add catalogs in the dashboard, they will appear here.
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {filteredAllFeatured.map((catalog) => (
              <Card key={catalog.title} className="border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-accent text-xs uppercase tracking-wide">
                      {catalog.category}
                    </Badge>
                    <Badge className="bg-accent/10 text-xs text-accent">
                      Updated {catalog.updated}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl leading-tight">{catalog.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {catalog.highlights.join(" • ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {"pdfUrl" in catalog && (catalog as any).pdfUrl && (
                    <div>
                      {"imageUrl" in catalog && (catalog as any).imageUrl ? (
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-dashed border-border/60 bg-muted/40">
                          <img src={(catalog as any).imageUrl} alt={catalog.title} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <PdfThumb url={(catalog as any).pdfUrl} alt={catalog.title} />
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {catalog.formats.map((format) => (
                      <Badge key={format} variant="secondary" className="rounded-full border border-dashed border-border/70">
                        {format}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                    <span className="text-muted-foreground">Downloads</span>
                    <span className="font-semibold text-foreground">{catalog.downloads}</span>
                  </div>
                  {/* Territory slots / queue */}
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 px-6 py-4">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Includes lookbook + price sheet</span>
                  {"pdfUrl" in catalog && catalog.pdfUrl ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setActivePdf({ title: catalog.title, url: (catalog as any).pdfUrl });
                          setPdfOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href={(catalog as any).pdfUrl} download>
                          Download
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadCatalogCSV(catalog.title, (catalog as any).items)}
                        disabled={!(catalog as any).items?.length}
                        title={(catalog as any).items?.length ? "Download CSV" : "Available on live catalogs"}
                      >
                        <FileDown className="mr-2 h-4 w-4" /> CSV
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCatalogPrintView(catalog.title, (catalog as any).items)}
                        disabled={!(catalog as any).items?.length}
                        title={(catalog as any).items?.length ? "Download PDF" : "Available on live catalogs"}
                      >
                        <ArrowUpRight className="mr-2 h-4 w-4" /> PDF
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Dialog mounted once for all previews */}
      <Dialog
        open={pdfOpen}
        onOpenChange={(open) => {
          setPdfOpen(open);
          if (!open) {
            const next = new URLSearchParams(searchParams);
            next.delete("pdf");
            setSearchParams(next, { replace: true });
          }
        }}
      >
        <DialogContent className="p-0 overflow-hidden w-[96vw] max-w-[1200px] h-[92vh] max-h-[92vh] grid grid-rows-[auto,1fr] gap-0">
          <DialogHeader className="flex flex-row items-center justify-between px-4 py-2 border-b text-left">
            <DialogTitle className="text-base">
              {activePdf?.title}
            </DialogTitle>
            {activePdf && (
              <a
                href={activePdf.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:underline"
              >
                Open in new tab
              </a>
            )}
          </DialogHeader>
          <div className="h-full min-h-0 w-full">
            {activePdf && (
              <iframe
                src={activePdf.url}
                title={activePdf.title}
                className="block h-full w-full"
                loading="eager"
                style={{ border: 0 }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <section className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <h2 className="text-section-title">Merchandising intelligence layer</h2>
              <p className="text-base text-muted-foreground">
                Our reporting layer helps you decide swiftly with metrics across demand, replenishment and location performance.
              </p>
              <ScrollArea className="h-[300px] rounded-xl border border-dashed border-border/70 bg-card">
                <div className="space-y-5 p-6">
                  {[
                    {
                      title: "Sell-through dashboard",
                      detail: "Track how each catalog is performing pan-India with reorder alerts and aging inventory signals.",
                    },
                    {
                      title: "Fabric intelligence",
                      detail: "Blend educational videos, swatch photography and care instructions to train store teams faster.",
                    },
                    {
                      title: "Pricing simulator",
                      detail: "Plug in your markups to model margins, EMI plans and promotional levers before launch.",
                    },
                    {
                      title: "Visual merchandising cues",
                      detail: "Window layouts, focal points and styling prompts curated by our in-house design studio.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <Card className="border-none bg-gradient-to-br from-primary via-primary/95 to-[#141d2a] text-primary-foreground">
              <CardHeader className="space-y-4">
                <Badge className="w-max bg-background/15 text-xs uppercase tracking-wide">
                  Concierge request
                </Badge>
                <CardTitle className="text-2xl">Need a bespoke catalog?</CardTitle>
                <CardDescription className="text-sm text-primary-foreground/80">
                  Share your brief and we will design a personalized assortment, pricing ladder and marketing kit within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Business name" className="bg-background/15 text-primary-foreground placeholder:text-primary-foreground/60" />
                <Input placeholder="Email / WhatsApp" className="bg-background/15 text-primary-foreground placeholder:text-primary-foreground/60" />
                <Input placeholder="Preferred category" className="bg-background/15 text-primary-foreground placeholder:text-primary-foreground/60" />
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Submit request
                </Button>
                <p className="text-xs text-primary-foreground/70">
                  Dedicated merchandiser responds in under 6 working hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border border-border/70 bg-card shadow-sm">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-max rounded-full border-accent text-xs uppercase tracking-wide">
                Compliance ready
              </Badge>
              <CardTitle className="text-xl">All catalogs ship with complete compliance documents</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                GST invoices, HS codes and fabric composition sheets accompany every catalog so your internal approvals never stall.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                <Shield className="h-4 w-4 text-accent" />
                <span>Digitally signed QC checklist</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                <Layers className="h-4 w-4 text-accent" />
                <span>Fabric composition & care metadata</span>
              </div>
            </CardContent>
          </Card>
          <div>
            <h2 className="text-section-title">Catalog FAQs</h2>
            <Accordion type="single" collapsible className="mt-6 rounded-2xl border border-border/70 bg-card">
              {faqItems.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="px-6 text-left text-sm font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#121a27]" />
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12), transparent 55%)" }} />
        <div className="relative container mx-auto px-4 py-20 text-primary-foreground">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-4">
              <Badge className="bg-background/15 text-xs uppercase tracking-wide">
                Catalog drop alerts
              </Badge>
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                Never miss a new catalog release or price revision
              </h2>
              <p className="text-base text-primary-foreground/80">
                Join the Meghdoot alert list to be notified the moment fresh catalogs go live. Select your categories and dispatch preferences.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base">
                Subscribe via WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/30 bg-background/10 px-8 text-base text-primary-foreground hover:bg-background/20"
              >
                Download catalog index
              </Button>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 text-sm">
            {["Dispatch ready", "MOQ flexible", "Marketing assets", "Drop analytics"].map((chip) => (
              <Badge key={chip} className="bg-background/10 text-primary-foreground">
                {chip}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Catalogs;
