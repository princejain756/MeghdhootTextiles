import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductApi, ApiUtils, getImageUrl } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuth } from "@/context/AuthContext";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

export default function Product() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  const query = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductApi.get(id),
    enabled: Boolean(id),
  });

  const product = query.data?.product;

  const media = useMemo(() => {
    if (!product) return [];
    const images = (product.images ?? []).map((img) => ({ ...img, url: getImageUrl(img.url), type: "image" as const }));
    const videos = (product.videos ?? []).map((vid) => ({ ...vid, url: getImageUrl(vid.url), type: "video" as const }));
    return [...images, ...videos];
  }, [product]);

  const handlePrevMedia = () => {
    setSelectedMediaIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNextMedia = () => {
    setSelectedMediaIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const currentMedia = media[selectedMediaIndex];

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isDirectVideo = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  // Generate Product schema for SEO
  const productSchema = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || product.summary || `${product.name} from Meghdoot Textiles wholesale collection`,
      "image": product.images?.[0]?.url ? getImageUrl(product.images[0].url) : "https://meghdoottextiles.com/og-image.jpg",
      "sku": product.id,
      "brand": {
        "@type": "Brand",
        "name": "Meghdoot Textiles"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://meghdoottextiles.com/product/${product.id}`,
        "priceCurrency": product.currency || "INR",
        "price": product.price || 0,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Meghdoot Textiles"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      }
    };
  }, [product]);

  return (
    <div className="min-h-screen bg-background">
      {/* Product Schema for SEO */}
      {product && productSchema && (
        <Helmet>
          <title>{product.name} | Meghdoot Textiles</title>
          <meta name="description" content={product.summary || `Buy ${product.name} wholesale from Meghdoot Textiles. Quality textiles at factory prices.`} />
          <script type="application/ld+json">
            {JSON.stringify(productSchema)}
          </script>
        </Helmet>
      )}
      <Header />
      <main className="container mx-auto px-4 py-8">
        {query.isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-[480px] animate-pulse rounded-lg bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-32 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Media Gallery Section */}
            <div className="space-y-4">
              {/* Main Media Viewport */}
              <Card className="overflow-hidden border bg-card relative group">
                <CardContent className="p-0">
                  <AspectRatio ratio={4 / 5}>
                    {currentMedia ? (
                      currentMedia.type === "image" ? (
                        <img
                          src={currentMedia.url}
                          alt={currentMedia.alt || product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-black">
                          {getYouTubeId(currentMedia.url) ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeId(currentMedia.url)}`}
                              className="w-full h-full"
                              allowFullScreen
                              title="Product Video"
                            />
                          ) : isDirectVideo(currentMedia.url) ? (
                            <video
                              src={currentMedia.url}
                              className="w-full h-full object-contain"
                              controls
                              playsInline
                            />
                          ) : (
                            <a
                              href={currentMedia.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/5 hover:bg-black/10 transition-colors group/video"
                            >
                              <img
                                src={getImageUrl(product.images?.[0]?.url) || "/placeholder-video.png"}
                                alt="Video Preview"
                                className="absolute inset-0 h-full w-full object-cover opacity-60"
                              />
                              <div className="relative z-10 w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center group-hover/video:scale-110 transition-transform">
                                <Play className="h-10 w-10 text-primary fill-primary ml-1" />
                              </div>
                              <div className="relative z-10 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                External Video - Open in New Tab
                                <ExternalLink className="h-4 w-4" />
                              </div>
                            </a>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        No media available
                      </div>
                    )}
                  </AspectRatio>
                  {/* Navigation Arrows */}
                  {media.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20"
                        onClick={handlePrevMedia}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20"
                        onClick={handleNextMedia}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Media Thumbnails */}
              {media.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar min-h-[80px]">
                  {media.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-all ${selectedMediaIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/30"
                        }`}
                    >
                      <img
                        src={item.type === "image" ? item.url : (getImageUrl(product.images?.[0]?.url) || "/placeholder-video.png")}
                        alt={item.type === "image" ? item.alt || `${product.name} - Image` : `${product.name} - Video`}
                        className={`h-full w-full object-cover ${item.type === "video" ? "opacity-70" : ""}`}
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              {user ? (
                <div className="text-lg font-semibold text-foreground">
                  {ApiUtils.formatCurrency(product.price, product.currency)}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Login to view trade pricing</div>
              )}
              <div className="flex flex-wrap gap-2">
                {product.categories?.map((c) => (
                  <Badge key={c.category.id} variant="secondary" className="rounded-full">{c.category.name}</Badge>
                ))}
              </div>
              {product.summary && (
                <p className="text-muted-foreground">{product.summary}</p>
              )}
              {product.description && (
                <div className="prose prose-sm dark:prose-invert">
                  <p>{product.description}</p>
                </div>
              )}
              {product.shippingInfo && (
                <div className="mt-4">
                  <h2 className="mb-1 text-lg font-semibold">Shipping</h2>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{product.shippingInfo}</p>
                </div>
              )}
              {product.careInstructions && (
                <div className="mt-4">
                  <h2 className="mb-1 text-lg font-semibold">Care</h2>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{product.careInstructions}</p>
                </div>
              )}
              {Array.isArray(product.specs) && product.specs.length > 0 && (
                <div className="mt-6">
                  <h2 className="mb-2 text-lg font-semibold">Specifications</h2>
                  <div className="divide-y rounded-md border">
                    {(product.specs as Array<{ label: string; value: string }>).map((s, i) => (
                      <div key={i} className="grid grid-cols-3 gap-4 p-3 text-sm">
                        <div className="font-medium text-muted-foreground">{s.label}</div>
                        <div className="col-span-2">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded border bg-muted/30 p-6 text-center text-sm text-muted-foreground">Product not found.</div>
        )}
      </main>
      <Footer />
    </div>
  );
}
