import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  ClipboardList,
  LifeBuoy,
  PackageOpen,
  PenSquare,
  Plus,
  Trash2,
  Truck,
  Users,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PageLayout from "@/components/PageLayout";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAuth } from "@/context/AuthContext";
import { AuthApi, OrderApi, ProductApi, SupportApi, ApiUtils, CatalogApi, UploadApi } from "@/lib/api";
import ImageUploader, { type UploaderImage } from "@/components/ImageUploader";
import type {
  ApiOrder,
  ApiProduct,
  ApiUser,
  OrderStatus,
  SupportStatus,
  SupportTicket,
  ApiCatalog,
} from "@/types/api";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const productFormSchema = z.object({
  name: z.string().min(3, "Name is required"),
  summary: z.string().optional(),
  description: z.string().optional(),
  price: z.preprocess((value) => Number(value), z.number().positive("Enter a valid price")),
  stock: z.preprocess((value) => Number(value ?? 0), z.number().int().min(0)),
  currency: z.string().length(3).default("INR"),
  categories: z.string().optional(),
  // images handled via custom uploader
  videoUrls: z.string().optional(),
  sku: z.string().optional(),
  featured: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const orderStatusOptions: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const supportStatusOptions: SupportStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const statusBadgeTone: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-sky-100 text-sky-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
};

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [images, setImages] = useState<UploaderImage[]>([]);
  const [isCatalogDialogOpen, setIsCatalogDialogOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<ApiCatalog | null>(null);
  const [catalogCoverUrl, setCatalogCoverUrl] = useState("");
  const [catalogPdfUrl, setCatalogPdfUrl] = useState("");
  const [coverPct, setCoverPct] = useState(0);
  const [pdfPct, setPdfPct] = useState(0);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [isManageProductsOpen, setIsManageProductsOpen] = useState(false);
  const [manageCatalog, setManageCatalog] = useState<ApiCatalog | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [originalIds, setOriginalIds] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const [liveMsg, setLiveMsg] = useState("");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showDndHint, setShowDndHint] = useState(() => {
    return localStorage.getItem("mdthub_dnd_hint") !== "dismissed";
  });
  type SortPref = "original" | "az" | "priceAsc" | "priceDesc" | "sku" | "shuffle";
  const [sortPref, setSortPref] = useState<SortPref>("original");
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [confirmDeleteCatalog, setConfirmDeleteCatalog] = useState<ApiCatalog | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Sarees", "Kurtis", "Fusion", "Menswear"].slice(0, 0));
  const presetCategories = ["Sarees", "Kurtis", "Fusion", "Menswear"];
  const [respondTicketId, setRespondTicketId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<SupportStatus | undefined>(undefined);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => ProductApi.list(),
    select: (response) => response.products,
    enabled: Boolean(user),
  });

  const catalogsQuery = useQuery({
    queryKey: ["catalogs"],
    queryFn: () => CatalogApi.list(),
    select: (response) => response.catalogs,
    enabled: Boolean(user),
  });

  // Helper to import local PDFs/images into DB as catalogs (admin convenience)
  const bulkImportLocal = async () => {
    try {
      // Discover local PDFs and cover images
      const imageModules = import.meta.glob("/src/assets/CatalogImages/*.{png,jpg,jpeg,webp}", {
        eager: true,
        as: "url",
      }) as Record<string, string>;
      const pdfModules = import.meta.glob("/src/assets/Catalogs/*.pdf", { eager: true, as: "url" }) as Record<string, string>;

      const toKey = (s: string) => s.toLowerCase().replace(/\s*\(\d+\)\s*/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      const humanize = (file: string) => file.replace(/^.*\//, "").replace(/\.[Pp][Dd][Ff]$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").replace(/\s*\(\d+\)\s*/g, " ").trim();
      const imagesByKey = new Map<string, string>();
      Object.entries(imageModules).forEach(([p, u]) => imagesByKey.set(toKey(p), u));

      const desiredCounts: Record<string, number> = {
        "avantika": 8,
        "dg-0661": 8,
        "khadi-hand-embroidery": 4,
        "khadi-hand-embroidery-1": 4,
        "divine": 8,
        "sakhi": 6,
        "tanaya-delight-dg-0629-t": 9,
        "skanda-supreme-dg-0566": 8,
      };

      const existingByTitle = new Set((catalogsQuery.data ?? []).map((c) => toKey(c.title)));

      const toAbs = (u?: string) => (u ? (u.startsWith("http") ? u : new URL(u, window.location.origin).toString()) : undefined);
      const payloads = Object.entries(pdfModules).map(([path, url]) => {
        const title = humanize(path);
        const k = toKey(path);
        const img = imagesByKey.get(k) || imagesByKey.get(k.replace(/-(\d+)$/, "")) || "";
        const count = desiredCounts[k] ?? 0;
        return {
          title,
          category: "sarees",
          catalogCode: undefined as string | undefined,
          fabric: "Assorted",
          setSize: "12 pieces",
          dispatch: "3-5 days",
          coverImageUrl: toAbs(img),
          pdfUrl: toAbs(url),
          itemsCount: count || undefined,
          _key: k,
        };
      });

      const toCreate = payloads.filter((p) => !existingByTitle.has(toKey(p.title)));
      if (!toCreate.length) {
        toast({ title: "Nothing to import", description: "All local PDFs are already in admin.", });
        return;
      }

      for (const p of toCreate) {
        await CatalogApi.create({
          title: p.title,
          category: p.category,
          description: undefined,
          catalogCode: p.catalogCode,
          fabric: p.fabric,
          setSize: p.setSize,
          dispatch: p.dispatch,
          coverImageUrl: p.coverImageUrl,
          pdfUrl: p.pdfUrl,
          itemsCount: p.itemsCount,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({ title: `Imported ${toCreate.length} catalog(s)` });
    } catch (err) {
      toast({ title: "Import failed", description: String((err as Error)?.message ?? err), variant: "destructive" });
    }
  };

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => OrderApi.list(),
    select: (response) => response.orders,
    enabled: Boolean(user),
  });

  const supportQuery = useQuery({
    queryKey: ["support", "tickets"],
    queryFn: () => SupportApi.list(),
    select: (response) => response.tickets,
    enabled: Boolean(user),
  });

  const usersQuery = useQuery({
    queryKey: ["auth", "users"],
    queryFn: () => AuthApi.listUsers(),
    select: (response) => response.users,
    enabled: Boolean(user),
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      summary: "",
      description: "",
      price: 0,
      stock: 0,
      currency: "INR",
      categories: "",
      videoUrls: "",
      sku: "",
      featured: false,
    },
  });

  const resetProductForm = () => {
    form.reset({
      name: "",
      summary: "",
      description: "",
      price: 0,
      stock: 0,
      currency: "INR",
      categories: "",
      videoUrls: "",
      sku: "",
      featured: false,
    });
    setEditingProduct(null);
  };

  const openCreateProduct = () => {
    resetProductForm();
    setImages([]);
    setIsProductDialogOpen(true);
  };

  const openCreateCatalog = () => {
    setEditingCatalog(null);
    setIsCatalogDialogOpen(true);
    setCatalogCoverUrl("");
    setCatalogPdfUrl("");
  };

  const openEditCatalog = (catalog: ApiCatalog) => {
    setEditingCatalog(catalog);
    setIsCatalogDialogOpen(true);
    setCatalogCoverUrl(catalog.coverImageUrl ?? "");
    setCatalogPdfUrl(catalog.pdfUrl ?? "");
  };

  const openManageProducts = (catalog: ApiCatalog) => {
    setManageCatalog(catalog);
    const ids = catalog.items.map((i) => i.product.id);
    setSelectedIds(ids);
    setOriginalIds(ids);
    setIsManageProductsOpen(true);
    // apply last used sort preference if any
    const saved = (localStorage.getItem(catalogSortKey(catalog.id)) as SortPref | null) ?? "original";
    setSortPref(saved);
    if (saved !== "original") {
      setSelectedIds((prev) => applySort(saved, prev));
    }
  };

  const openEditProduct = (product: ApiProduct) => {
    const categories = product.categories.map((item) => item.category.name).join(", ");
    const videoUrls = (product.videos ?? []).map((video) => video.url).join("\n");
    setSelectedCategories(product.categories.map((c) => c.category.name));
    form.reset({
      name: product.name,
      summary: product.summary ?? "",
      description: product.description ?? "",
      price: Number(product.price),
      stock: product.stock,
      currency: product.currency,
      categories,
      videoUrls,
      sku: product.sku ?? "",
      featured: product.featured,
    });
    setImages(product.images.map((img) => ({ url: img.url, alt: img.alt })));
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const parseCategories = (categories?: string) =>
    Array.from(
      new Set(
        [
          ...(categories
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean) ?? []),
          ...selectedCategories,
        ].map((c) => (c ? c : "")).filter(Boolean)
      )
    );

  const parseVideos = (videos?: string) =>
    videos
      ?.split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((url, index) => ({ url, position: index })) ?? [];

  const createProduct = useMutation({
    mutationFn: (values: ProductFormValues) =>
      ProductApi.create({
        name: values.name,
        summary: values.summary,
        description: values.description,
        price: values.price,
        stock: values.stock,
      currency: values.currency,
      categories: parseCategories(values.categories),
      images: images.map((img, index) => ({ url: img.url, alt: img.alt, position: index })),
      videos: parseVideos(values.videoUrls),
      sku: values.sku,
      featured: values.featured,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product created", description: "The catalog has been refreshed." });
      setIsProductDialogOpen(false);
      resetProductForm();
      setImages([]);
    },
    onError: (error) => {
      toast({ title: "Couldn't create product", description: error.message, variant: "destructive" });
    },
  });

  const updateProduct = useMutation({
    mutationFn: (values: ProductFormValues) => {
      if (!editingProduct) {
        throw new Error("No product selected for update");
      }
      return ProductApi.update(editingProduct.id, {
        name: values.name,
        summary: values.summary,
        description: values.description,
        price: values.price,
        stock: values.stock,
      currency: values.currency,
      categories: parseCategories(values.categories),
      images: images.map((img, index) => ({ url: img.url, alt: img.alt, position: index })),
      videos: parseVideos(values.videoUrls),
      sku: values.sku,
      featured: values.featured,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product updated", description: "Changes are live." });
      setIsProductDialogOpen(false);
      resetProductForm();
      setImages([]);
    },
    onError: (error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => ProductApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product removed", description: "Catalogue cleaned successfully." });
    },
    onError: (error) => {
      toast({ title: "Unable to delete", description: error.message, variant: "destructive" });
    },
  });

  const createCatalogMutation = useMutation({
    mutationFn: (values: { title: string; description?: string; category?: string; catalogCode?: string; fabric?: string; setSize?: string; dispatch?: string; coverImageUrl?: string; pdfUrl?: string }) =>
      CatalogApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({ title: "Catalog created" });
      setIsCatalogDialogOpen(false);
      setEditingCatalog(null);
    },
    onError: (error) => toast({ title: "Couldn't create catalog", description: (error as Error).message, variant: "destructive" }),
  });

  const updateCatalogMutation = useMutation({
    mutationFn: (values: { title?: string; description?: string; category?: string; catalogCode?: string; fabric?: string; setSize?: string; dispatch?: string; coverImageUrl?: string; pdfUrl?: string }) => {
      if (!editingCatalog) throw new Error("No catalog selected");
      return CatalogApi.update(editingCatalog.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({ title: "Catalog updated" });
      setIsCatalogDialogOpen(false);
      setEditingCatalog(null);
    },
    onError: (error) => toast({ title: "Update failed", description: (error as Error).message, variant: "destructive" }),
  });

  const deleteCatalog = useMutation({
    mutationFn: (id: string) => CatalogApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({ title: "Catalog removed", description: "Catalog deleted successfully." });
    },
    onError: (error) => {
      toast({ title: "Unable to delete", description: (error as Error).message, variant: "destructive" });
    },
  });

  const setCatalogProductsMutation = useMutation({
    mutationFn: ({ id, productIds }: { id: string; productIds: string[] }) => CatalogApi.setProducts(id, productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({ title: "Catalog items updated" });
      setIsManageProductsOpen(false);
      setManageCatalog(null);
      setSelectedIds([]);
    },
    onError: (error) => toast({ title: "Update failed", description: (error as Error).message, variant: "destructive" }),
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      OrderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order status updated" });
    },
    onError: (error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const respondTicketMutation = useMutation({
    mutationFn: ({ id, message, status }: { id: string; message: string; status?: SupportStatus }) =>
      SupportApi.respond(id, message, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      toast({ title: "Response sent" });
      setRespondTicketId(null);
      setResponseMessage("");
      setResponseStatus(undefined);
    },
    onError: (error) => toast({ title: "Unable to send response", description: error.message, variant: "destructive" }),
  });

  const overviewMetrics = useMemo(() => {
    const totalRevenue = ordersQuery.data?.reduce((sum, order) => sum + Number(order.total), 0) ?? 0;
    return [
      {
        title: "Active products",
        value: productsQuery.data?.length ?? 0,
        icon: PackageOpen,
        tone: "bg-primary/10 text-primary",
      },
      {
        title: "Total orders",
        value: ordersQuery.data?.length ?? 0,
        icon: ClipboardList,
        tone: "bg-blue-100 text-blue-700",
      },
      {
        title: "Delivered orders",
        value: ordersQuery.data?.filter((order) => order.status === "DELIVERED").length ?? 0,
        icon: CheckCircle,
        tone: "bg-emerald-100 text-emerald-700",
      },
      {
        title: "Support tickets",
        value: supportQuery.data?.length ?? 0,
        icon: LifeBuoy,
        tone: "bg-purple-100 text-purple-700",
      },
      {
        title: "Registered buyers",
        value: usersQuery.data?.length ?? 0,
        icon: Users,
        tone: "bg-amber-100 text-amber-700",
      },
      {
        title: "Revenue to date",
        value: ApiUtils.formatCurrency(totalRevenue),
        icon: BarChart3,
        tone: "bg-emerald-100 text-emerald-700",
      },
    ];
  }, [ordersQuery.data, productsQuery.data, supportQuery.data, usersQuery.data]);

  if (isLoading) {
    return <FullScreenLoader label="Loading admin controls" />;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const handleProductSubmit = async (values: ProductFormValues) => {
    if (editingProduct) {
      await updateProduct.mutateAsync(values);
    } else {
      await createProduct.mutateAsync(values);
    }
  };

  const handleCatalogSubmit = async (values: { title: string; description?: string; category?: string; catalogCode?: string; fabric?: string; setSize?: string; dispatch?: string; coverImageUrl?: string; pdfUrl?: string }) => {
    if (editingCatalog) {
      await updateCatalogMutation.mutateAsync(values);
    } else {
      await createCatalogMutation.mutateAsync(values);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const moveSelected = (id: string, dir: -1 | 1) => {
    setSelectedIds((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const next = prev.slice();
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  const catalogSortKey = (id: string) => `mdthub_catalog_sort_${id}`;
  const sortPrefLabel = (pref: SortPref) =>
    ({ original: "Original", az: "Name A–Z", priceAsc: "Price low→high", priceDesc: "Price high→low", sku: "SKU", shuffle: "Shuffle" }[pref]);

  const applySort = (pref: SortPref, ids: string[]) => {
    const list = ids.slice();
    const find = (id: string) => productsQuery.data?.find((p) => p.id === id);
    switch (pref) {
      case "az":
        list.sort((a, b) => (find(a)?.name.toLowerCase() ?? "").localeCompare(find(b)?.name.toLowerCase() ?? ""));
        break;
      case "priceAsc":
        list.sort((a, b) => Number(find(a)?.price ?? 0) - Number(find(b)?.price ?? 0));
        break;
      case "priceDesc":
        list.sort((a, b) => Number(find(b)?.price ?? 0) - Number(find(a)?.price ?? 0));
        break;
      case "sku":
        list.sort((a, b) => {
          const A = (find(a)?.sku ?? "").toLowerCase();
          const B = (find(b)?.sku ?? "").toLowerCase();
          if (!A && !B) return 0; if (!A) return 1; if (!B) return -1; return A.localeCompare(B);
        });
        break;
      case "shuffle":
        for (let i = list.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [list[i], list[j]] = [list[j], list[i]];
        }
        break;
      default:
        return ids;
    }
    return list;
  };

  const persistSort = (pref: SortPref) => {
    if (!manageCatalog) return;
    localStorage.setItem(catalogSortKey(manageCatalog.id), pref);
  };

  const applyAndPersistSort = (pref: SortPref) => {
    setSelectedIds((prev) => applySort(pref, prev));
    setSortPref(pref);
    persistSort(pref);
  };

  const renderOrderRow = (order: ApiOrder) => (
    <TableRow key={order.id} className="align-top">
      <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
      <TableCell>{format(new Date(order.createdAt), "dd MMM yyyy")}</TableCell>
      <TableCell>{ApiUtils.formatCurrency(order.total)}</TableCell>
      <TableCell>
        <Badge className={statusBadgeTone[order.status]}>{order.status}</Badge>
      </TableCell>
      <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)} styles</TableCell>
      <TableCell>
        <Select
          value={order.status}
          onValueChange={(value: OrderStatus) => updateOrderStatus.mutate({ id: order.id, status: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            {orderStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );

  const renderProductRow = (product: ApiProduct) => (
    <TableRow key={product.id} className="align-top">
      <TableCell>
        <div className="font-medium">{product.name}</div>
        <div className="text-xs text-muted-foreground">SKU {product.sku ?? "–"}</div>
      </TableCell>
      <TableCell>{ApiUtils.formatCurrency(product.price, product.currency)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          {product.categories.length ? (
            product.categories.map((item) => (
              <Badge key={item.category.id} variant="secondary">
                {item.category.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
      </TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>{product.featured ? "Featured" : "Standard"}</TableCell>
      <TableCell className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => openEditProduct(product)}>
          <PenSquare className="mr-2 h-3.5 w-3.5" /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteProduct.mutate(product.id)}
          disabled={deleteProduct.isPending}
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
        </Button>
      </TableCell>
    </TableRow>
  );

  const renderSupportRow = (ticket: SupportTicket) => (
    <TableRow key={ticket.id} className="align-top">
      <TableCell className="font-medium">{ticket.subject}</TableCell>
      <TableCell>{ticket.status}</TableCell>
      <TableCell>{format(new Date(ticket.createdAt), "dd MMM yyyy")}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{ticket.message}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setRespondTicketId(ticket.id);
            setResponseMessage("");
            setResponseStatus(ticket.status);
          }}
        >
          Respond
        </Button>
      </TableCell>
    </TableRow>
  );

  const hasAnyError =
    productsQuery.isError || ordersQuery.isError || supportQuery.isError || usersQuery.isError;

  return (
    <PageLayout className="bg-muted/20">
      <div className="container py-10 space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-widest text-primary">Admin control</p>
          <h1 className="text-3xl font-bold">Command centre</h1>
          <p className="text-muted-foreground">Curate products, orchestrate fulfilment, and delight partners.</p>
        </div>

        {hasAnyError && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data refresh required</AlertTitle>
            <AlertDescription>
              We encountered issues loading some resources. Try refreshing or checking backend connectivity.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overviewMetrics.map((metric) => (
            <Card key={metric.title} className="border shadow-sm">
              <CardContent className="flex items-center justify-between py-5">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-semibold text-foreground">{metric.value}</p>
                </div>
                <div className={`rounded-full p-3 ${metric.tone}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="catalogs">Catalogs</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Operations snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border bg-background p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Order pipeline</h3>
                  <div className="mt-4 space-y-3">
                    {orderStatusOptions.map((status) => {
                      const count = ordersQuery.data?.filter((order) => order.status === status).length ?? 0;
                      return (
                        <div key={status} className="flex items-center justify-between text-sm">
                          <span>{status}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl border bg-background p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Support load</h3>
                  <div className="mt-4 space-y-3">
                    {supportStatusOptions.map((status) => {
                      const count = supportQuery.data?.filter((ticket) => ticket.status === status).length ?? 0;
                      return (
                        <div key={status} className="flex items-center justify-between text-sm">
                          <span>{status}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Catalogue</h2>
                <p className="text-sm text-muted-foreground">Craft compelling assortments and feature hero stories.</p>
              </div>
              <Button onClick={openCreateProduct} className="gap-2">
                <Plus className="h-4 w-4" /> New product
              </Button>
            </div>
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                {productsQuery.isLoading ? (
                  <div className="space-y-3 p-6">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : productsQuery.data?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead className="w-[200px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{productsQuery.data.map(renderProductRow)}</TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <PackageOpen className="h-8 w-8" />
                    <p>No products yet. Start by adding your signature styles.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="catalogs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Catalogs</h2>
                <p className="text-sm text-muted-foreground">Group products into curated sets for B2B buyers.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={bulkImportLocal}>Import local PDFs</Button>
                <Button onClick={openCreateCatalog} className="gap-2">
                  <Plus className="h-4 w-4" /> New catalog
                </Button>
              </div>
            </div>
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                {catalogsQuery.isLoading ? (
                  <div className="space-y-3 p-6">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : catalogsQuery.data?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Catalog ID</TableHead>
                        <TableHead>Fabric</TableHead>
                        <TableHead>Set Size</TableHead>
                        <TableHead>Dispatch</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="w-[260px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {catalogsQuery.data.map((cat) => (
                        <TableRow key={cat.id}>
                          <TableCell className="font-medium">{cat.title}</TableCell>
                          <TableCell>{cat.catalogCode ?? "—"}</TableCell>
                          <TableCell>{cat.fabric ?? "—"}</TableCell>
                          <TableCell>{cat.setSize ?? "—"}</TableCell>
                          <TableCell>{cat.dispatch ?? "—"}</TableCell>
                          <TableCell>{cat.category ?? "—"}</TableCell>
                          <TableCell>{cat.items.length || cat.itemsCount || 0}</TableCell>
                          <TableCell>{format(new Date(cat.updatedAt), "dd MMM yyyy")}</TableCell>
                          <TableCell className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => openEditCatalog(cat)}>
                              <PenSquare className="mr-1 h-4 w-4" /> Edit
                            </Button>
                            <Button size="sm" onClick={() => openManageProducts(cat)}>
                              <ClipboardList className="mr-1 h-4 w-4" /> Manage items
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setConfirmDeleteCatalog(cat)}
                              title="Delete catalog"
                            >
                              <Trash2 className="mr-1 h-4 w-4" /> Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <PackageOpen className="h-8 w-8" />
                    <p>No catalogs yet. Create your first curated set.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-xl font-semibold">Fulfilment queue</h2>
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                {ordersQuery.isLoading ? (
                  <div className="space-y-3 p-6">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : ordersQuery.data?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{ordersQuery.data.map(renderOrderRow)}</TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <Truck className="h-8 w-8" />
                    <p>No orders in the system yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <h2 className="text-xl font-semibold">Support service desk</h2>
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                {supportQuery.isLoading ? (
                  <div className="space-y-3 p-6">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : supportQuery.data?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{supportQuery.data.map(renderSupportRow)}</TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <LifeBuoy className="h-8 w-8" />
                    <p>Support is quiet. Great job!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <h2 className="text-xl font-semibold">Trade partners</h2>
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                {usersQuery.isLoading ? (
                  <div className="space-y-3 p-6">
                    {[...Array(4)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : usersQuery.data?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersQuery.data.map((customer: ApiUser) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.fullName ?? "—"}</TableCell>
                          <TableCell>{customer.username}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>
                            <Badge variant={customer.role === "ADMIN" ? "default" : "secondary"}>
                              {customer.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(customer.createdAt), "dd MMM yyyy")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <Users className="h-8 w-8" />
                    <p>No partners yet. Registrations will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
          setIsProductDialogOpen(open);
          if (!open) {
            resetProductForm();
            setImages([]);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Update product" : "Create product"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form className="grid gap-4" onSubmit={form.handleSubmit(handleProductSubmit)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product name</FormLabel>
                        <FormControl>
                          <Input placeholder="Silk Saree - Emerald" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="SKU-2025-01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Input placeholder="One-line merchandising story" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Detailed fabric story, care, styling tips" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" placeholder="3499" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input placeholder="INR" maxLength={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-end justify-between gap-2">
                    <FormField
                      control={form.control}
                      name="categories"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Additional categories</FormLabel>
                          <FormControl>
                            <Input placeholder="Festive, Premium" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="outline">Choose from presets</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          {presetCategories.map((opt) => (
                            <DropdownMenuCheckboxItem
                              key={opt}
                              checked={selectedCategories.includes(opt)}
                              onCheckedChange={(checked) => {
                                setSelectedCategories((prev) => {
                                  const set = new Set(prev);
                                  if (checked) set.add(opt); else set.delete(opt);
                                  return Array.from(set);
                                });
                              }}
                            >
                              {opt}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="rounded-full">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <ImageUploader value={images} onChange={setImages} max={8} />

                <FormField
                  control={form.control}
                  name="videoUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URLs</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="One video URL per line (mp4, YouTube, Instagram reels embed, etc.)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          id="featured"
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        />
                      </FormControl>
                      <FormLabel htmlFor="featured" className="text-sm font-medium leading-none">
                        Highlight on storefront
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createProduct.isPending || updateProduct.isPending}
                  >
                    {editingProduct
                      ? updateProduct.isPending
                        ? "Updating…"
                        : "Update product"
                      : createProduct.isPending
                        ? "Creating…"
                        : "Create product"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Create/Update Catalog dialog */}
        <Dialog
          open={isCatalogDialogOpen}
          onOpenChange={(open) => {
            setIsCatalogDialogOpen(open);
            if (!open) {
              setEditingCatalog(null);
              setCatalogCoverUrl("");
              setCatalogPdfUrl("");
            }
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCatalog ? "Update catalog" : "Create catalog"}</DialogTitle>
            </DialogHeader>
            <form
              className="grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const payload = {
                  title: String(fd.get("title") ?? ""),
                  category: String(fd.get("category") ?? "") || undefined,
                  description: String(fd.get("description") ?? "") || undefined,
                  catalogCode: String(fd.get("catalogCode") ?? "") || undefined,
                  fabric: String(fd.get("fabric") ?? "") || undefined,
                  setSize: String(fd.get("setSize") ?? "") || undefined,
                  dispatch: String(fd.get("dispatch") ?? "") || undefined,
                  coverImageUrl: (String(fd.get("coverImageUrl") ?? "") || undefined) ?? (catalogCoverUrl || undefined),
                  pdfUrl: (String(fd.get("pdfUrl") ?? "") || undefined) ?? (catalogPdfUrl || undefined),
                  itemsCount: Number(String(fd.get("itemsCount") ?? "")) || undefined,
                };
                await handleCatalogSubmit(payload);
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editingCatalog?.title ?? ""} required />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="coverImageUrl">Cover image URL</Label>
                  <div className="flex gap-2">
                    <Input id="coverImageUrl" name="coverImageUrl" placeholder="https://.../cover.webp" value={catalogCoverUrl} onChange={(e) => setCatalogCoverUrl(e.target.value)} />
                    <input id="coverUpload" type="file" accept="image/*" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsCoverUploading(true);
                      setCoverPct(0);
                      try {
                        const res = await UploadApi.imagesWithProgress([file], (pct) => setCoverPct(pct));
                        const url = res.files[0]?.url;
                        if (url) setCatalogCoverUrl(url);
                      } catch (err) {
                        console.error(err);
                        toast({ title: "Upload failed", description: String((err as Error).message ?? err), variant: "destructive" });
                      } finally {
                        setIsCoverUploading(false);
                        setTimeout(() => setCoverPct(0), 600);
                      }
                    }} />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("coverUpload")?.click()} disabled={isCoverUploading}>
                      {isCoverUploading ? `Uploading ${coverPct}%` : "Upload"}
                    </Button>
                  </div>
                  {isCoverUploading || coverPct > 0 ? (
                    <div className="pt-2">
                      <Progress value={coverPct} className="h-2" />
                    </div>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pdfUrl">Catalog PDF URL</Label>
                  <div className="flex gap-2">
                    <Input id="pdfUrl" name="pdfUrl" placeholder="https://.../catalog.pdf" value={catalogPdfUrl} onChange={(e) => setCatalogPdfUrl(e.target.value)} />
                    <input id="pdfUpload" type="file" accept="application/pdf" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsPdfUploading(true);
                      setPdfPct(0);
                      try {
                        const res = await UploadApi.pdfsWithProgress([file], (pct) => setPdfPct(pct));
                        const url = res.files[0]?.url;
                        if (url) setCatalogPdfUrl(url);
                        // If title is empty, set from filename
                        const titleEl = document.getElementById("title") as HTMLInputElement | null;
                        if (titleEl && !titleEl.value) {
                          const base = (file.name || "").replace(/\.[Pp][Dd][Ff]$/, "").replace(/[_-]+/g, " ").trim();
                          titleEl.value = base;
                        }
                      } catch (err) {
                        console.error(err);
                        toast({ title: "Upload failed", description: String((err as Error).message ?? err), variant: "destructive" });
                      } finally {
                        setIsPdfUploading(false);
                        setTimeout(() => setPdfPct(0), 600);
                      }
                    }} />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("pdfUpload")?.click()} disabled={isPdfUploading}>
                      {isPdfUploading ? `Uploading ${pdfPct}%` : "Upload"}
                    </Button>
                  </div>
                  {isPdfUploading || pdfPct > 0 ? (
                    <div className="pt-2">
                      <Progress value={pdfPct} className="h-2" />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="itemsCount">Products in catalog</Label>
                  <Input id="itemsCount" name="itemsCount" type="number" min={0} placeholder="e.g. 8" defaultValue={editingCatalog?.itemsCount ?? ""} />
                  <p className="text-xs text-muted-foreground">Used to show “8 styles selected” when products aren’t linked yet.</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" placeholder="sarees, kurtis…" defaultValue={editingCatalog?.category ?? ""} />
              </div>
              {/* Additional storefront metadata */}
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="catalogCode">Catalog ID</Label>
                  <Input id="catalogCode" name="catalogCode" placeholder="CAT005" defaultValue={editingCatalog?.catalogCode ?? ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fabric">Fabric</Label>
                  <Input id="fabric" name="fabric" placeholder="Assorted" defaultValue={editingCatalog?.fabric ?? ""} />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="setSize">Set Size</Label>
                  <Input id="setSize" name="setSize" placeholder="12 pieces" defaultValue={editingCatalog?.setSize ?? ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dispatch">Dispatch</Label>
                  <Input id="dispatch" name="dispatch" placeholder="3-5 days" defaultValue={editingCatalog?.dispatch ?? ""} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} defaultValue={editingCatalog?.description ?? ""} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createCatalogMutation.isPending || updateCatalogMutation.isPending}>
                  {editingCatalog
                    ? updateCatalogMutation.isPending
                      ? "Updating…"
                      : "Update"
                    : createCatalogMutation.isPending
                      ? "Creating…"
                      : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Manage catalog items */}
        <Dialog
          open={isManageProductsOpen}
          onOpenChange={(open) => {
            setIsManageProductsOpen(open);
            if (!open) {
              setManageCatalog(null);
              setSelectedIds([]);
            }
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Manage items: {manageCatalog?.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-semibold">All products</h4>
                <div className="h-72 overflow-auto rounded border p-3">
                  {productsQuery.data?.map((p) => (
                    <label key={p.id} className="flex cursor-pointer items-center justify-between gap-3 border-b py-2 text-sm last:border-b-0">
                      <span className="line-clamp-1">{p.name}</span>
                      <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold">Selected & order</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => { setSelectedIds(originalIds); setSortPref("original"); persistSort("original"); }}
                      disabled={!selectedIds.length}
                      title="Revert to original order"
                    >
                      Revert order
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => applyAndPersistSort("az")} title="Sort by name A–Z">Sort A–Z</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => applyAndPersistSort("priceAsc")} title="Sort by price low to high">Price ↑</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => applyAndPersistSort("priceDesc")} title="Sort by price high to low">Price ↓</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => applyAndPersistSort("sku")} title="Sort by SKU">SKU</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => applyAndPersistSort("shuffle")} title="Shuffle order">Shuffle</Button>
                  </div>
                </div>
                <div className="mb-2 text-xs text-muted-foreground">Sorted by: <span className="font-medium text-foreground">{sortPrefLabel(sortPref)}</span></div>
                <div
                  className="h-72 overflow-auto rounded border p-3"
                  role="listbox"
                  aria-label="Selected products in catalog"
                  aria-describedby="catalog-sort-help"
                  onKeyDown={(e) => {
                    if (focusIdx == null) return;
                    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                      e.preventDefault();
                      const dir = e.key === "ArrowUp" ? -1 : 1;
                      const id = selectedIds[focusIdx];
                      moveSelected(id, dir);
                      const nextIndex = Math.max(0, Math.min(selectedIds.length - 1, focusIdx + dir));
                      setFocusIdx(nextIndex);
                      setLiveMsg(`Moved item to position ${nextIndex + 1}`);
                    }
                  }}
                >
                  {selectedIds.length ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                      onDragStart={({ active }) => {
                        setActiveDragId(String(active.id));
                        if (showDndHint) {
                          setShowDndHint(false);
                          localStorage.setItem("mdthub_dnd_hint", "dismissed");
                        }
                      }}
                      onDragEnd={(event: DragEndEvent) => {
                        const { active, over } = event;
                        setActiveDragId(null);
                        if (!over || active.id === over.id) return;
                        const oldIndex = selectedIds.indexOf(String(active.id));
                        const newIndex = selectedIds.indexOf(String(over.id));
                        if (oldIndex < 0 || newIndex < 0) return;
                        setSelectedIds((prev) => arrayMove(prev, oldIndex, newIndex));
                        setLiveMsg(`Moved item to position ${newIndex + 1}`);
                      }}
                      onDragCancel={() => setActiveDragId(null)}
                    >
                      <SortableContext items={selectedIds} strategy={verticalListSortingStrategy}>
                        {selectedIds.map((id, idx) => {
                          const prod = productsQuery.data?.find((p) => p.id === id);
                          if (!prod) return null;
                          return (
                            <SortableRow
                              key={id}
                              id={id}
                              index={idx}
                              name={prod.name}
                              onFocus={() => setFocusIdx(idx)}
                              onMoveUp={() => moveSelected(id, -1)}
                              onMoveDown={() => moveSelected(id, 1)}
                              onRemove={() => toggleSelect(id)}
                              selected={focusIdx === idx}
                            />
                          );
                        })}
                      </SortableContext>
                      <DragOverlay dropAnimation={{ duration: 320, easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", dragSourceOpacity: 0.2 }}>
                        {activeDragId ? (
                          <div className="pointer-events-none rounded border bg-background px-3 py-2 text-sm shadow-lg">
                            {productsQuery.data?.find((p) => p.id === activeDragId)?.name ?? "Item"}
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                  ) : (
                    <p className="text-sm text-muted-foreground">No products selected.</p>
                  )}
                  <p id="catalog-sort-help" className="sr-only">Use Alt + Arrow keys to reorder focused item. Drag and drop also supported.</p>
                  <div aria-live="polite" className="sr-only">{liveMsg}</div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (!manageCatalog) return;
                  setCatalogProductsMutation.mutate({ id: manageCatalog.id, productIds: selectedIds });
                }}
                disabled={setCatalogProductsMutation.isPending}
              >
                {setCatalogProductsMutation.isPending ? "Saving…" : "Save items"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(respondTicketId)} onOpenChange={(open) => {
          if (!open) {
            setRespondTicketId(null);
            setResponseMessage("");
            setResponseStatus(undefined);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={responseStatus}
                  onValueChange={(value: SupportStatus) => setResponseStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  rows={5}
                  placeholder="Share next steps, clarifications, or resolution details"
                  value={responseMessage}
                  onChange={(event) => setResponseMessage(event.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (!respondTicketId || !responseMessage) {
                    toast({
                      title: "Add details",
                      description: "A response message is required.",
                    });
                    return;
                  }

                  respondTicketMutation.mutate({
                    id: respondTicketId,
                    message: responseMessage,
                    status: responseStatus,
                  });
                }}
                disabled={respondTicketMutation.isPending}
              >
                {respondTicketMutation.isPending ? "Sending…" : "Send response"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Confirm delete catalog */}
        <AlertDialog
          open={Boolean(confirmDeleteCatalog)}
          onOpenChange={(open) => {
            if (!open) setConfirmDeleteCatalog(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete catalog</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDeleteCatalog
                  ? `Are you sure you want to delete "${confirmDeleteCatalog.title}"? This action cannot be undone.`
                  : "This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (confirmDeleteCatalog) {
                    deleteCatalog.mutate(confirmDeleteCatalog.id);
                  }
                  setConfirmDeleteCatalog(null);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;

type SortableRowProps = {
  id: string;
  index: number;
  name: string;
  selected?: boolean;
  onFocus: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

function SortableRow({ id, index, name, selected, onFocus, onMoveUp, onMoveDown, onRemove }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      onFocus={onFocus}
      tabIndex={0}
      aria-selected={selected}
      className={`flex items-center justify-between gap-2 border-b py-2 text-sm last:border-b-0 ${isDragging ? "bg-muted ring-2 ring-accent" : "hover:bg-muted/50"}`}
      title="Drag to reorder"
    >
      <div className="flex items-center gap-2">
        <button aria-label="Drag handle" className="cursor-grab rounded p-1 text-muted-foreground hover:text-foreground" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="line-clamp-1">{index + 1}. {name}</span>
        {index === 0 && (
          <span className="hidden sm:inline rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground" title="Keyboard controls">
            Enter to pick up • Esc to cancel • Alt+↑/↓ to move
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button type="button" size="icon" variant="outline" className="h-7 w-7" onClick={onMoveUp}>↑</Button>
        <Button type="button" size="icon" variant="outline" className="h-7 w-7" onClick={onMoveDown}>↓</Button>
        <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
