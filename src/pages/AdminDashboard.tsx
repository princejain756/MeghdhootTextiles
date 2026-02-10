import { useEffect, useMemo, useState } from "react";
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
  ChevronDown,
  ChevronRight,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import VideoUploader, { type UploaderVideo } from "@/components/VideoUploader";
import AssetLibrary from "@/components/AssetLibrary";
import type {
  ApiOrder,
  ApiProduct,
  ApiUser,
  OrderStatus,
  SupportStatus,
  SupportTicket,
  ApiCatalog,
  Permission,
} from "@/types/api";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const productFormSchema = z.object({
  name: z.string().min(3, "Name is required"),
  summary: z.string().nullable().optional().transform(v => v ?? undefined),
  description: z.string().nullable().optional().transform(v => v ?? undefined),
  shippingInfo: z.string().nullable().optional().transform(v => v ?? undefined),
  careInstructions: z.string().nullable().optional().transform(v => v ?? undefined),
  price: z.preprocess((value) => Number(value), z.number().positive("Enter a valid price")),
  stock: z.preprocess((value) => Number(value ?? 0), z.number().int().min(0)),
  currency: z.string().length(3).default("INR"),
  categories: z.string().nullable().optional().transform(v => v ?? ""),
  // images handled via custom uploader
  videoUrls: z.string().nullable().optional().transform(v => v ?? undefined),
  sku: z.string().nullable().optional().transform(v => v ?? undefined),
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
  const [videos, setVideos] = useState<UploaderVideo[]>([]);
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
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [showAllDetails, setShowAllDetails] = useState(false);
  type SortPref = "original" | "az" | "priceAsc" | "priceDesc" | "sku" | "shuffle";
  const [sortPref, setSortPref] = useState<SortPref>("original");
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [activeTab, setActiveTab] = useState("products");
  const [confirmDeleteCatalog, setConfirmDeleteCatalog] = useState<ApiCatalog | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [respondTicketId, setRespondTicketId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<SupportStatus | undefined>(undefined);
  // User management
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<ApiUser | null>(null);

  const permOptions: Permission[] = ["PRODUCTS", "CATALOGS", "ORDERS", "SUPPORT", "CUSTOMERS", "UPLOADS"];
  const createUserSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Password must include upper, lower, number, and symbol"),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    role: z.enum(["ADMIN", "USER", "UPLOADER"]).default("USER"),
    permissions: z.array(z.string()).default([]),
  });
  type CreateUserForm = z.infer<typeof createUserSchema>;
  const createUserForm = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: "", username: "", password: "", fullName: "", phone: "", companyName: "", role: "USER", permissions: [] },
  });
  const createUserMutation = useMutation({
    mutationFn: (values: CreateUserForm) => AuthApi.createUser(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "users"] });
      setIsCreateUserOpen(false);
      createUserForm.reset();
      toast({ title: "User created" });
    },
    onError: (err) => toast({ title: "Create failed", description: String(err), variant: "destructive" }),
  });
  const updateUserMutation = useMutation({
    mutationFn: ({ id, role, permissions }: { id: string; role?: string; permissions?: string[] }) =>
      AuthApi.updateUser(id, { role, permissions }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "users"] });
      setEditUser(null);
      toast({ title: "Access updated" });
    },
    onError: (err) => toast({ title: "Update failed", description: String(err), variant: "destructive" }),
  });

  // Delivery update dialog
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [deliveryOrderId, setDeliveryOrderId] = useState<string | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    courier: "",
    trackingNumber: "",
    status: "Preparing",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
    estimatedDelivery: "",
    instructions: "",
  });

  const perms = user?.permissions ?? [];
  const canProducts = (user?.role === "ADMIN") || perms.includes("PRODUCTS");
  const canOrders = (user?.role === "ADMIN") || perms.includes("ORDERS");
  const canSupport = (user?.role === "ADMIN") || perms.includes("SUPPORT");
  const canCustomers = (user?.role === "ADMIN") || perms.includes("CUSTOMERS");
  const canCatalogs = (user?.role === "ADMIN") || perms.includes("CATALOGS");
  const canUploads = (user?.role === "ADMIN") || perms.includes("UPLOADS") || (user?.role === "UPLOADER");

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => ProductApi.list(),
    select: (response) => response.products,
    enabled: Boolean(user && (canProducts || canUploads || canCatalogs || user.role === "UPLOADER" || user.role === "ADMIN")),
  });

  // Build preset categories from existing products + default list
  const presetCategories = useMemo(() => {
    const defaultPresets = ["Sarees", "Kurtis", "Salwars", "Indo-Western", "Fabrics", "Eco And Jewellery", "Menswear"];
    const dbCategories = new Set<string>();
    productsQuery.data?.forEach((product) => {
      product.categories?.forEach((c) => {
        if (c.category?.name) dbCategories.add(c.category.name);
      });
    });
    // Merge default + DB categories, deduplicated and sorted
    return Array.from(new Set([...defaultPresets, ...dbCategories])).sort();
  }, [productsQuery.data]);

  const catalogsQuery = useQuery({
    queryKey: ["catalogs"],
    queryFn: () => CatalogApi.list(),
    select: (response) => response.catalogs,
    enabled: Boolean(user && (canCatalogs || canProducts || canUploads || user.role === "UPLOADER" || user.role === "ADMIN")),
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

      const desiredCounts: Record<string, number> = {};

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
    enabled: Boolean(user && (user.role === "ADMIN" || canOrders)),
  });

  const supportQuery = useQuery({
    queryKey: ["support", "tickets"],
    queryFn: () => SupportApi.list(),
    select: (response) => response.tickets,
    enabled: Boolean(user && (user.role === "ADMIN" || canSupport)),
  });

  const usersQuery = useQuery({
    queryKey: ["auth", "users"],
    queryFn: () => AuthApi.listUsers(),
    select: (response) => response.users,
    enabled: Boolean(user && user.role === "ADMIN"),
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      summary: "",
      description: "",
      shippingInfo: "",
      careInstructions: "",
      price: 0,
      stock: 0,
      currency: "INR",
      categories: "",
      videoUrls: "",
      sku: "",
      featured: false,
    },
  });

  // PDP specifications state managed separately (ordered list of label/value)
  type SpecItem = { label: string; value: string };
  const [specs, setSpecs] = useState<SpecItem[]>([]);

  const resetProductForm = () => {
    form.reset({
      name: "",
      summary: "",
      description: "",
      shippingInfo: "",
      careInstructions: "",
      price: 0,
      stock: 0,
      currency: "INR",
      categories: "",
      videoUrls: "",
      sku: "",
      featured: false,
    });
    setEditingProduct(null);
    setSpecs([]);
    setSelectedCategories([]);
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
      shippingInfo: product.shippingInfo ?? "",
      careInstructions: product.careInstructions ?? "",
      price: Number(product.price),
      stock: product.stock,
      currency: product.currency,
      categories,
      videoUrls,
      sku: product.sku ?? "",
      featured: product.featured,
    });
    setImages(product.images.map((img) => ({ url: img.url, alt: img.alt })));
    // Load videos into VideoUploader (with thumbnail display)
    setVideos((product.videos ?? []).map((video) => ({ url: video.url })));
    // Load specs if available
    const initialSpecs = Array.isArray(product.specs)
      ? (product.specs as unknown as SpecItem[]).filter((s) => s && typeof s.label === "string")
      : [];
    setSpecs(initialSpecs);
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  // Only use selectedCategories as the source of truth for categories
  // The categories form field is deprecated and kept for backwards compatibility
  const parseCategories = () =>
    Array.from(new Set(selectedCategories.filter(Boolean)));

  const parseVideos = (videos?: string) =>
    videos
      ?.split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((url, index) => ({ url, position: index })) ?? [];

  const createProduct = useMutation({
    mutationFn: (values: ProductFormValues) => {
      // Filter images to only include those with valid URLs
      const validImages = images
        .filter((img) => img.url && img.url.trim() !== "")
        .map((img, index) => ({ url: img.url, alt: img.alt || undefined, position: index }));

      return ProductApi.create({
        name: values.name,
        summary: values.summary || undefined,
        description: values.description || undefined,
        shippingInfo: values.shippingInfo || undefined,
        careInstructions: values.careInstructions || undefined,
        specs: specs.length > 0 ? specs : undefined,
        price: values.price,
        stock: values.stock ?? 0,
        currency: values.currency || "INR",
        categories: parseCategories(),
        images: validImages.length > 0 ? validImages : undefined,
        videos: videos.length > 0
          ? videos.map((v, index) => ({ url: v.url, position: index }))
          : parseVideos(values.videoUrls) || undefined,
        sku: values.sku || undefined,
        featured: values.featured,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product created", description: "The catalog has been refreshed." });
      setIsProductDialogOpen(false);
      resetProductForm();
      setImages([]);
      setVideos([]);
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
      // Filter images to only include those with valid URLs
      const validImages = images
        .filter((img) => img.url && img.url.trim() !== "")
        .map((img, index) => ({ url: img.url, alt: img.alt || undefined, position: index }));

      return ProductApi.update(editingProduct.id, {
        name: values.name,
        summary: values.summary || undefined,
        description: values.description || undefined,
        shippingInfo: values.shippingInfo || undefined,
        careInstructions: values.careInstructions || undefined,
        specs: specs.length > 0 ? specs : undefined,
        price: values.price,
        stock: values.stock ?? 0,
        currency: values.currency || "INR",
        categories: parseCategories(),
        images: validImages.length > 0 ? validImages : undefined,
        videos: videos.length > 0
          ? videos.map((v, index) => ({ url: v.url, position: index }))
          : parseVideos(values.videoUrls) || undefined,
        sku: values.sku || undefined,
        featured: values.featured,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product updated", description: "Changes are live." });
      setIsProductDialogOpen(false);
      resetProductForm();
      setImages([]);
      setVideos([]);
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
    mutationFn: (values: { title: string; description?: string; category?: string; catalogCode?: string; fabric?: string; setSize?: string; dispatch?: string; coverImageUrl?: string; pdfUrl?: string; itemsCount?: number; price?: number }) =>
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
    mutationFn: (values: { title?: string; description?: string; category?: string; catalogCode?: string; fabric?: string; setSize?: string; dispatch?: string; coverImageUrl?: string; pdfUrl?: string; itemsCount?: number; price?: number }) => {
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

  const isAdmin = !!user && user.role === "ADMIN";
  const isUploader = !!user && (user.role === "UPLOADER" || canUploads);

  if (!user || (!isAdmin && !isUploader && !(canProducts || canCatalogs || canOrders || canSupport || canCustomers))) {
    return null;
  }

  // Default tab for uploaders: focus on products
  useEffect(() => {
    if (isUploader && activeTab === "overview") {
      setActiveTab("products");
    }
  }, [isUploader, activeTab]);

  const handleProductSubmit = async (values: ProductFormValues) => {
    if (editingProduct) {
      await updateProduct.mutateAsync(values);
    } else {
      await createProduct.mutateAsync(values);
    }
  };

  const handleCatalogSubmit = async (values: { title: string; description?: string; category?: string; catalogCode?: string; fabric?: string; setSize?: string; dispatch?: string; coverImageUrl?: string; pdfUrl?: string; itemsCount?: number; price?: number }) => {
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
        <Button
          size="sm"
          variant="outline"
          className="ml-2"
          onClick={() => {
            setDeliveryOrderId(order.id);
            setDeliveryForm({
              courier: order.delivery?.courier || "",
              trackingNumber: order.delivery?.trackingNumber || "",
              status: order.delivery?.status || "Preparing",
              addressLine1: order.delivery?.addressLine1 || "",
              addressLine2: order.delivery?.addressLine2 || "",
              city: order.delivery?.city || "",
              state: order.delivery?.state || "",
              postalCode: order.delivery?.postalCode || "",
              country: order.delivery?.country || "IN",
              estimatedDelivery: order.delivery?.estimatedDelivery ? new Date(order.delivery.estimatedDelivery).toISOString().slice(0, 10) : "",
              instructions: order.delivery?.instructions || "",
            });
            setDeliveryDialogOpen(true);
          }}
        >
          Delivery
        </Button>
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
        <Button asChild variant="secondary" size="sm">
          <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">View</a>
        </Button>
        <Button variant="outline" size="sm" onClick={() => openEditProduct(product)}>
          <PenSquare className="mr-2 h-3.5 w-3.5" /> Edit
        </Button>
        {user?.role === "ADMIN" && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteProduct.mutate(product.id)}
            disabled={deleteProduct.isPending}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
          </Button>
        )}
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
    productsQuery.isError || (isAdmin && (ordersQuery.isError || supportQuery.isError || usersQuery.isError));

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

        {user?.role === "ADMIN" && (
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
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            {isAdmin && <TabsTrigger value="overview">Overview</TabsTrigger>}
            {(isAdmin || canProducts || canUploads) && <TabsTrigger value="products">Products</TabsTrigger>}
            {(isAdmin || canCatalogs) && <TabsTrigger value="catalogs">Catalogs</TabsTrigger>}
            {(isAdmin || canOrders) && <TabsTrigger value="orders">Orders</TabsTrigger>}
            {(isAdmin || canSupport) && <TabsTrigger value="support">Support</TabsTrigger>}
            {(isAdmin || canCustomers) && <TabsTrigger value="customers">Customers</TabsTrigger>}
            {(isAdmin || canUploads) && <TabsTrigger value="assets">Asset Library</TabsTrigger>}
          </TabsList>

          {user?.role === "ADMIN" && (
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
          )}

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
                {user?.role === "ADMIN" && (
                  <Button variant="outline" onClick={bulkImportLocal}>Import local PDFs</Button>
                )}
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
                            {user?.role === "ADMIN" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setConfirmDeleteCatalog(cat)}
                                title="Delete catalog"
                              >
                                <Trash2 className="mr-1 h-4 w-4" /> Delete
                              </Button>
                            )}
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

          {user?.role === "ADMIN" && (
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
          )}

          {user?.role === "ADMIN" && (
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
          )}

          {/* Asset Library Tab */}
          {(isAdmin || canUploads) && (
            <TabsContent value="assets" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Asset Library</h2>
              </div>
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Manage Uploaded Files</CardTitle>
                  <CardDescription>
                    View, optimize, and delete uploaded images and videos.
                    Images larger than 500KB and videos larger than 2MB will be marked for optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AssetLibrary />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {user?.role === "ADMIN" && (
            <TabsContent value="customers" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Trade partners</h2>
                <div className="flex items-center gap-2">
                  {usersQuery.data?.length ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllDetails(!showAllDetails)}
                    >
                      {showAllDetails ? "Hide Details" : "Show All Details"}
                    </Button>
                  ) : null}
                  {(isAdmin || canCustomers) && (
                    <Button size="sm" onClick={() => setIsCreateUserOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" /> New user
                    </Button>
                  )}
                </div>
              </div>
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
                          {showAllDetails && <TableHead className="w-8"></TableHead>}
                          <TableHead>Name</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          {showAllDetails && (
                            <>
                              <TableHead>Phone</TableHead>
                              <TableHead>Company</TableHead>
                            </>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersQuery.data.map((customer: ApiUser) => {
                          const isExpanded = expandedUsers.has(customer.id);
                          return (
                            <>
                              <TableRow key={customer.id}>
                                {showAllDetails && (
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => {
                                        const newExpanded = new Set(expandedUsers);
                                        if (isExpanded) {
                                          newExpanded.delete(customer.id);
                                        } else {
                                          newExpanded.add(customer.id);
                                        }
                                        setExpandedUsers(newExpanded);
                                      }}
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TableCell>
                                )}
                                <TableCell>{customer.fullName ?? "—"}</TableCell>
                                <TableCell>{customer.username}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>
                                  <Badge variant={customer.role === "ADMIN" ? "default" : "secondary"}>
                                    {customer.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>{format(new Date(customer.createdAt), "dd MMM yyyy")}</TableCell>
                                {showAllDetails && (
                                  <>
                                    <TableCell>{customer.phone ?? "—"}</TableCell>
                                    <TableCell>{customer.companyName ?? "—"}</TableCell>
                                  </>
                                )}
                              </TableRow>
                              {showAllDetails && isExpanded && (
                                <TableRow key={`${customer.id}-expanded`} className="bg-muted/30">
                                  <TableCell colSpan={8} className="py-4">
                                    <div className="space-y-3">
                                      <h4 className="text-sm font-medium">Additional Details</h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">User ID:</span>
                                          <p className="font-mono text-xs mt-1">{customer.id}</p>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Account Created:</span>
                                          <p className="mt-1">{format(new Date(customer.createdAt), "PPP 'at' p")}</p>
                                        </div>
                                        {customer.phone && (
                                          <div>
                                            <span className="text-muted-foreground">Phone Number:</span>
                                            <p className="mt-1">{customer.phone}</p>
                                          </div>
                                        )}
                                        {customer.companyName && (
                                          <div>
                                            <span className="text-muted-foreground">Company Name:</span>
                                            <p className="mt-1">{customer.companyName}</p>
                                          </div>
                                        )}
                                        {customer.address && (
                                          <div className="col-span-2">
                                            <span className="text-muted-foreground">Business Address:</span>
                                            <p className="mt-1">
                                              {customer.address.line1}
                                              {customer.address.line2 ? `, ${customer.address.line2}` : ""}, {customer.address.city}, {customer.address.state} {customer.address.postalCode}, {customer.address.country}
                                            </p>
                                          </div>
                                        )}
                                        {customer.tradeProfile && (
                                          <div className="col-span-2 grid grid-cols-2 gap-4">
                                            <div>
                                              <span className="text-muted-foreground">GST Number:</span>
                                              <p className="mt-1">{customer.tradeProfile.gstNumber || "—"}</p>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Business Type:</span>
                                              <p className="mt-1">{customer.tradeProfile.businessType || "—"}</p>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Annual Turnover:</span>
                                              <p className="mt-1">{customer.tradeProfile.annualTurnover || "—"}</p>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Years in Business:</span>
                                              <p className="mt-1">{customer.tradeProfile.experience || "—"}</p>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Product Interest:</span>
                                              <p className="mt-1">{customer.tradeProfile.productInterest || "—"}</p>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Website:</span>
                                              <p className="mt-1">
                                                {customer.tradeProfile.website ? (
                                                  <a href={customer.tradeProfile.website} target="_blank" rel="noreferrer" className="underline">
                                                    {customer.tradeProfile.website}
                                                  </a>
                                                ) : (
                                                  "—"
                                                )}
                                              </p>
                                            </div>
                                            <div className="col-span-2">
                                              <span className="text-muted-foreground">Additional Info:</span>
                                              <p className="mt-1 whitespace-pre-wrap">{customer.tradeProfile.additionalInfo || "—"}</p>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Verified:</span>
                                              <p className="mt-1">
                                                {customer.tradeProfile.verified ? (
                                                  <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-4 w-4" /> Verified</span>
                                                ) : (
                                                  <span className="text-amber-600">Pending</span>
                                                )}
                                              </p>
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">Terms Accepted:</span>
                                              <p className="mt-1">{customer.tradeProfile.termsAcceptedAt ? format(new Date(customer.tradeProfile.termsAcceptedAt), "dd MMM yyyy") : "—"}</p>
                                            </div>
                                          </div>
                                        )}
                                        {(isAdmin || canCustomers) && (
                                          <div className="col-span-2 flex flex-wrap gap-2">
                                            <Button size="sm" variant="outline" onClick={() => setEditUser(customer)}>
                                              Manage access
                                            </Button>
                                            {customer.tradeProfile && (
                                              <Button
                                                size="sm"
                                                variant={customer.tradeProfile.verified ? "secondary" : "default"}
                                                onClick={async () => {
                                                  try {
                                                    await AuthApi.setTradeVerification(customer.id, !customer.tradeProfile?.verified);
                                                    await queryClient.invalidateQueries({ queryKey: ["auth", "users"] });
                                                  } catch (e) {
                                                    toast({ title: "Failed", description: String(e), variant: "destructive" });
                                                  }
                                                }}
                                              >
                                                {customer.tradeProfile.verified ? "Unverify" : "Verify trade partner"}
                                              </Button>
                                            )}
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={async () => {
                                                try {
                                                  const res = await AuthApi.resetUserPassword(customer.id);
                                                  await navigator.clipboard.writeText(res.tempPassword);
                                                  toast({ title: "Temporary password generated", description: "Copied to clipboard" });
                                                } catch (e) {
                                                  toast({ title: "Failed to reset password", description: String(e), variant: "destructive" });
                                                }
                                              }}
                                            >
                                              Reset password
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={async () => {
                                                if (!confirm("Delete this user? This cannot be undone and only works for users without orders/tickets.")) return;
                                                try {
                                                  await AuthApi.deleteUser(customer.id);
                                                  await queryClient.invalidateQueries({ queryKey: ["auth", "users"] });
                                                  toast({ title: "User deleted" });
                                                } catch (e) {
                                                  toast({ title: "Delete failed", description: String(e), variant: "destructive" });
                                                }
                                              }}
                                            >
                                              Delete user
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          );
                        })}
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
          )}
        </Tabs>

        <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
          setIsProductDialogOpen(open);
          if (!open) {
            resetProductForm();
            setImages([]);
            setVideos([]);
            setSpecs([]);
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

                <FormField
                  control={form.control}
                  name="shippingInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping information</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="Dispatch timelines, GST invoice, pan-India shipping, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="careInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Care instructions</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="Care and maintenance guidance for the product" {...field} />
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

                {/* Categories section */}
                <div className="grid gap-3">
                  <Label>Categories</Label>
                  <div className="flex items-center gap-3">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="justify-between min-w-[180px]">
                          {selectedCategories.length > 0
                            ? `${selectedCategories.length} selected`
                            : "Select categories"}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto z-[9999]" sideOffset={5}>
                        {presetCategories.map((cat) => (
                          <DropdownMenuCheckboxItem
                            key={cat}
                            checked={selectedCategories.includes(cat)}
                            onCheckedChange={(checked) => {
                              setSelectedCategories((prev) => {
                                const set = new Set(prev);
                                if (checked) set.add(cat);
                                else set.delete(cat);
                                return Array.from(set);
                              });
                            }}
                          >
                            {cat}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {selectedCategories.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategories([])}
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  {/* Custom categories input */}
                  <div className="flex items-center gap-2">
                    <Input
                      id="customCategories"
                      placeholder="Add custom categories (comma-separated)"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          const newCats = input.value
                            .split(",")
                            .map((c) => c.trim())
                            .filter((c) => c.length > 0);
                          if (newCats.length > 0) {
                            setSelectedCategories((prev) =>
                              Array.from(new Set([...prev, ...newCats]))
                            );
                            input.value = "";
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById("customCategories") as HTMLInputElement;
                        if (!input) return;
                        const newCats = input.value
                          .split(",")
                          .map((c) => c.trim())
                          .filter((c) => c.length > 0);
                        if (newCats.length > 0) {
                          setSelectedCategories((prev) =>
                            Array.from(new Set([...prev, ...newCats]))
                          );
                          input.value = "";
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="rounded-full cursor-pointer"
                          onClick={() => {
                            setSelectedCategories((prev) =>
                              prev.filter((c) => c !== cat)
                            );
                          }}
                        >
                          {cat} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <ImageUploader value={images} onChange={setImages} max={8} />

                <VideoUploader value={videos} onChange={setVideos} max={4} />

                {/* PDP Specifications editor */}
                <div className="space-y-2">
                  <Label>Specifications</Label>
                  <div className="space-y-2">
                    {specs.map((spec, idx) => (
                      <div key={idx} className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                        <Input
                          className="sm:col-span-2"
                          placeholder="Label (e.g., Fabric)"
                          value={spec.label}
                          onChange={(e) => {
                            const next = specs.slice();
                            next[idx] = { ...next[idx], label: e.target.value };
                            setSpecs(next);
                          }}
                        />
                        <Input
                          className="sm:col-span-3"
                          placeholder="Value (e.g., Pure Silk)"
                          value={spec.value}
                          onChange={(e) => {
                            const next = specs.slice();
                            next[idx] = { ...next[idx], value: e.target.value };
                            setSpecs(next);
                          }}
                        />
                        <div className="flex justify-end sm:col-span-5">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-rose-600 hover:text-rose-700"
                            onClick={() => setSpecs((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSpecs((prev) => [...prev, { label: "", value: "" }])}
                  >
                    Add specification
                  </Button>
                </div>

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
        {/* Delivery dialog */}
        <Dialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update delivery</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Courier</Label>
                  <Input value={deliveryForm.courier} onChange={(e) => setDeliveryForm({ ...deliveryForm, courier: e.target.value })} />
                </div>
                <div>
                  <Label>Tracking #</Label>
                  <Input value={deliveryForm.trackingNumber} onChange={(e) => setDeliveryForm({ ...deliveryForm, trackingNumber: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Input value={deliveryForm.status} onChange={(e) => setDeliveryForm({ ...deliveryForm, status: e.target.value })} />
                </div>
                <div>
                  <Label>ETA (yyyy-mm-dd)</Label>
                  <Input type="date" value={deliveryForm.estimatedDelivery} onChange={(e) => setDeliveryForm({ ...deliveryForm, estimatedDelivery: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Address line 1</Label>
                <Input value={deliveryForm.addressLine1} onChange={(e) => setDeliveryForm({ ...deliveryForm, addressLine1: e.target.value })} />
              </div>
              <div>
                <Label>Address line 2</Label>
                <Input value={deliveryForm.addressLine2} onChange={(e) => setDeliveryForm({ ...deliveryForm, addressLine2: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>City</Label>
                  <Input value={deliveryForm.city} onChange={(e) => setDeliveryForm({ ...deliveryForm, city: e.target.value })} />
                </div>
                <div>
                  <Label>State</Label>
                  <Input value={deliveryForm.state} onChange={(e) => setDeliveryForm({ ...deliveryForm, state: e.target.value })} />
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input value={deliveryForm.postalCode} onChange={(e) => setDeliveryForm({ ...deliveryForm, postalCode: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Country</Label>
                <Input value={deliveryForm.country} onChange={(e) => setDeliveryForm({ ...deliveryForm, country: e.target.value })} />
              </div>
              <div>
                <Label>Instructions</Label>
                <Textarea rows={3} value={deliveryForm.instructions} onChange={(e) => setDeliveryForm({ ...deliveryForm, instructions: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (!deliveryOrderId) return;
                  const payload = {
                    delivery: {
                      ...deliveryForm,
                      estimatedDelivery: deliveryForm.estimatedDelivery ? new Date(deliveryForm.estimatedDelivery).toISOString() : undefined,
                    },
                  } as any;
                  OrderApi.upsertDelivery(deliveryOrderId, payload.delivery).then(() => {
                    queryClient.invalidateQueries({ queryKey: ["orders"] });
                    setDeliveryDialogOpen(false);
                  });
                }}
              >
                Save
              </Button>
            </DialogFooter>
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
                  price: Number(String(fd.get("price") ?? "")) || undefined,
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
                <div className="grid gap-2">
                  <Label htmlFor="price">Catalog price (INR)</Label>
                  <Input id="price" name="price" type="number" step="0.01" min={0} placeholder="e.g. 999" defaultValue={(editingCatalog?.price ? Number(editingCatalog.price) : "") as any} />
                  <p className="text-xs text-muted-foreground">Visible to trade users only on storefront.</p>
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
        {/* Create user dialog */}
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create user</DialogTitle>
            </DialogHeader>
            <Form {...createUserForm}>
              <form onSubmit={createUserForm.handleSubmit((v) => createUserMutation.mutate(v))} className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField name="email" control={createUserForm.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="username" control={createUserForm.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField name="password" control={createUserForm.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="role" control={createUserForm.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                        <SelectContent>
                          {["USER", "UPLOADER", "ADMIN"].map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField name="fullName" control={createUserForm.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField name="phone" control={createUserForm.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
                <FormField name="companyName" control={createUserForm.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )} />
                <div className="space-y-2">
                  <FormLabel>Module access</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {permOptions.map((p) => {
                      const selected = createUserForm.watch("permissions").includes(p);
                      return (
                        <Button
                          key={p}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const cur = new Set(createUserForm.getValues("permissions"));
                            if (cur.has(p)) cur.delete(p); else cur.add(p);
                            createUserForm.setValue("permissions", Array.from(cur));
                          }}
                        >
                          {p}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending ? "Creating…" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit user access dialog */}
        <Dialog open={Boolean(editUser)} onOpenChange={(open) => { if (!open) setEditUser(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage access {editUser ? `— ${editUser.username}` : ""}</DialogTitle>
            </DialogHeader>
            {editUser && (
              <div className="space-y-3">
                <div>
                  <Label>Role</Label>
                  <Select defaultValue={editUser.role} onValueChange={(val) => updateUserMutation.mutate({ id: editUser.id, role: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["USER", "UPLOADER", "ADMIN"].map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Module access</Label>
                  <div className="flex flex-wrap gap-2">
                    {permOptions.map((p) => {
                      const selected = (editUser.permissions ?? []).includes(p);
                      return (
                        <Button
                          key={p}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const set = new Set(editUser.permissions ?? []);
                            if (set.has(p)) set.delete(p); else set.add(p);
                            const permissions = Array.from(set);
                            setEditUser({ ...editUser, permissions });
                          }}
                        >
                          {p}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => editUser && updateUserMutation.mutate({ id: editUser.id, permissions: editUser.permissions })}
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending ? "Saving…" : "Save"}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
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
