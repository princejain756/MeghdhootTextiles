import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    image?: string;
}

export default function RealTimeSearch() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch all products for search
    const productsQuery = useQuery({
        queryKey: ["products-search"],
        queryFn: async () => {
            const res = await ProductApi.list();
            return res.products;
        },
    });

    // Filter products based on search term
    const results = useMemo<SearchResult[]>(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term || term.length < 2) return [];

        const products = productsQuery.data ?? [];
        return products
            .filter((p) => {
                const searchFields = [
                    p.name,
                    p.summary ?? "",
                    p.description ?? "",
                    p.sku ?? "",
                    ...(p.categories?.map((c) => c.category?.name ?? "") ?? []),
                ].join(" ").toLowerCase();
                return searchFields.includes(term);
            })
            .slice(0, 6) // Limit to 6 results
            .map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: Number(p.price),
                currency: p.currency,
                image: p.images?.[0]?.url,
            }));
    }, [searchTerm, productsQuery.data]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
                navigate(`/products/${results[selectedIndex].slug}`);
                setIsOpen(false);
                setSearchTerm("");
            } else if (searchTerm.trim()) {
                navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
                setIsOpen(false);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        setSelectedIndex(-1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const showResults = isOpen && searchTerm.trim().length >= 2;

    return (
        <div ref={containerRef} className="relative hidden lg:block">
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products, fabrics, catalogs"
                    aria-label="Search products"
                    className="w-72 pl-10 pr-14"
                />
                {searchTerm ? (
                    <button
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-muted"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                ) : (
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none rounded-md border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        ⌘K
                    </span>
                )}
            </div>

            {/* Results Dropdown */}
            {showResults && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-auto rounded-lg border bg-background shadow-xl">
                    {productsQuery.isLoading ? (
                        <div className="flex items-center justify-center gap-2 p-4 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Searching...</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No products found for "{searchTerm}"
                        </div>
                    ) : (
                        <>
                            <div className="p-2">
                                {results.map((product, index) => (
                                    <Link
                                        key={product.id}
                                        to={`/products/${product.slug}`}
                                        onClick={() => {
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md p-2 transition-colors",
                                            index === selectedIndex
                                                ? "bg-primary/10"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        {/* Product Image */}
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                    <Search className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm line-clamp-2">
                                                {product.name}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {user ? (
                                                    <span className="text-sm font-semibold text-primary">
                                                        {formatPrice(product.price, product.currency)}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        Login for price
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* View All Results */}
                            <div className="border-t p-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-center"
                                    onClick={() => {
                                        navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    View All Results
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
