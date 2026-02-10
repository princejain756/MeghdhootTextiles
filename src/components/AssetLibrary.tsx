import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssetApi, type Asset } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Trash2,
    Zap,
    ImageIcon,
    Video,
    FileText,
    FileQuestion,
    Loader2,
    CheckSquare,
    Square,
    RefreshCw,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export default function AssetLibrary() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

    const assetsQuery = useQuery({
        queryKey: ["assets"],
        queryFn: () => AssetApi.list(),
    });

    const assets = assetsQuery.data?.assets ?? [];

    const optimizeMutation = useMutation({
        mutationFn: (filenames?: string[]) => AssetApi.optimize(filenames),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["assets"] });
            toast({
                title: "Optimization complete",
                description: `Optimized: ${data.optimized.length}, Skipped: ${data.skipped.length}, Failed: ${data.failed.length}`,
            });
            setSelectedAssets(new Set());
        },
        onError: (error) => {
            toast({
                title: "Optimization failed",
                description: (error as Error).message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (filenames: string[]) => AssetApi.bulkDelete(filenames),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["assets"] });
            toast({
                title: "Deletion complete",
                description: `Deleted: ${data.deleted}, Failed: ${data.failed}`,
            });
            setSelectedAssets(new Set());
        },
        onError: (error) => {
            toast({
                title: "Deletion failed",
                description: (error as Error).message,
                variant: "destructive",
            });
        },
    });

    const toggleSelect = (filename: string) => {
        const next = new Set(selectedAssets);
        if (next.has(filename)) {
            next.delete(filename);
        } else {
            next.add(filename);
        }
        setSelectedAssets(next);
    };

    const selectAll = () => {
        if (selectedAssets.size === assets.length) {
            setSelectedAssets(new Set());
        } else {
            setSelectedAssets(new Set(assets.map((a) => a.filename)));
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getIcon = (type: Asset["type"]) => {
        switch (type) {
            case "image":
                return <ImageIcon className="h-4 w-4" />;
            case "video":
                return <Video className="h-4 w-4" />;
            case "pdf":
                return <FileText className="h-4 w-4" />;
            default:
                return <FileQuestion className="h-4 w-4" />;
        }
    };

    const handleOptimize = () => {
        if (selectedAssets.size > 0) {
            optimizeMutation.mutate(Array.from(selectedAssets));
        } else {
            optimizeMutation.mutate(undefined);
        }
    };

    const handleDelete = () => {
        deleteMutation.mutate(Array.from(selectedAssets));
    };

    const isLoading = optimizeMutation.isPending || deleteMutation.isPending;

    // Stats
    const stats = useMemo(() => {
        const images = assets.filter((a) => a.type === "image");
        const videos = assets.filter((a) => a.type === "video");
        const pdfs = assets.filter((a) => a.type === "pdf");
        const totalSize = assets.reduce((sum, a) => sum + a.size, 0);
        return { images: images.length, videos: videos.length, pdfs: pdfs.length, totalSize };
    }, [assets]);

    return (
        <div className="space-y-4">
            {/* Header with stats */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{stats.images} Images</Badge>
                    <Badge variant="secondary">{stats.videos} Videos</Badge>
                    <Badge variant="secondary">{stats.pdfs} PDFs</Badge>
                    <Badge variant="outline">Total: {formatSize(stats.totalSize)}</Badge>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => assetsQuery.refetch()}
                    disabled={assetsQuery.isLoading}
                >
                    <RefreshCw className={`h-4 w-4 mr-1 ${assetsQuery.isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Actions toolbar */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-3">
                <Button variant="outline" size="sm" onClick={selectAll} disabled={isLoading}>
                    {selectedAssets.size === assets.length && assets.length > 0 ? (
                        <>
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Deselect All
                        </>
                    ) : (
                        <>
                            <Square className="h-4 w-4 mr-1" />
                            Select All
                        </>
                    )}
                </Button>

                <div className="flex-1" />

                <span className="text-sm text-muted-foreground">
                    {selectedAssets.size > 0
                        ? `${selectedAssets.size} selected`
                        : "Select assets or optimize all"}
                </span>

                <Button
                    variant="default"
                    size="sm"
                    onClick={handleOptimize}
                    disabled={isLoading}
                >
                    {optimizeMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                        <Zap className="h-4 w-4 mr-1" />
                    )}
                    Optimize {selectedAssets.size > 0 ? `(${selectedAssets.size})` : "All"}
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={selectedAssets.size === 0 || isLoading}
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Delete ({selectedAssets.size})
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete {selectedAssets.size} assets?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The selected files will be permanently deleted from
                                the server.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Asset grid */}
            {assetsQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : assets.length === 0 ? (
                <div className="rounded-lg border bg-muted/20 p-12 text-center text-muted-foreground">
                    No assets found. Upload images or videos to see them here.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {assets.map((asset) => (
                        <Card
                            key={asset.filename}
                            className={`group cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 ${selectedAssets.has(asset.filename)
                                ? "ring-2 ring-primary bg-primary/5"
                                : ""
                                }`}
                            onClick={() => toggleSelect(asset.filename)}
                        >
                            <CardContent className="p-0">
                                <div className="relative aspect-square bg-muted/30">
                                    {/* Preview */}
                                    {asset.type === "image" ? (
                                        <img
                                            src={`${API_BASE.replace("/api", "")}/uploads/${asset.filename}`}
                                            alt={asset.filename}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : asset.type === "video" ? (
                                        <div className="relative h-full w-full bg-black">
                                            <video
                                                src={`${API_BASE.replace("/api", "")}/uploads/${asset.filename}`}
                                                className="h-full w-full object-cover"
                                                preload="metadata"
                                                muted
                                                playsInline
                                                onLoadedMetadata={(e) => {
                                                    (e.target as HTMLVideoElement).currentTime = 1;
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                                                    <Video className="h-4 w-4 text-primary ml-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : asset.type === "pdf" ? (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-500/20 to-orange-500/20">
                                            <FileText className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <FileQuestion className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}

                                    {/* Checkbox overlay */}
                                    <div className="absolute left-2 top-2">
                                        <Checkbox
                                            checked={selectedAssets.has(asset.filename)}
                                            onCheckedChange={() => toggleSelect(asset.filename)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="h-5 w-5 border-2 bg-white/80"
                                        />
                                    </div>

                                    {/* Type badge */}
                                    <div className="absolute right-2 top-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {getIcon(asset.type)}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1 p-2">
                                    <div className="truncate text-xs font-medium" title={asset.filename}>
                                        {asset.filename}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{formatSize(asset.size)}</span>
                                        <span
                                            className={
                                                asset.type === "image" && asset.size > 500 * 1024
                                                    ? "text-amber-600"
                                                    : asset.type === "video" && asset.size > 2 * 1024 * 1024
                                                        ? "text-amber-600"
                                                        : "text-green-600"
                                            }
                                        >
                                            {asset.type === "image" && asset.size > 500 * 1024
                                                ? "Needs optimization"
                                                : asset.type === "video" && asset.size > 2 * 1024 * 1024
                                                    ? "Needs optimization"
                                                    : "Optimized"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
