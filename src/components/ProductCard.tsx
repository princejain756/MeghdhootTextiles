import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { ApiProduct } from "@/types/api";

type Props = {
  product: ApiProduct;
  extraBadges?: string[]; // optional chips e.g., catalog names
};

export default function ProductCard({ product, extraBadges = [] }: Props) {
  const cover = product.images?.[0]?.url;
  const categories = product.categories?.map((c) => c.category.name) ?? [];
  return (
    <Card className="overflow-hidden border bg-card shadow-sm hover:shadow-medium transition-shadow">
      <div className="bg-muted/40">
        <AspectRatio ratio={4 / 5}>
          {cover ? (
            <img
              src={cover}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
          )}
        </AspectRatio>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 line-clamp-2 text-sm font-semibold">{product.name}</div>
        <div className="text-sm text-muted-foreground">{product.currency} {product.price}</div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
        {categories.slice(0, 3).map((cat) => (
          <Badge key={cat} variant="secondary" className="rounded-full">
            {cat}
          </Badge>
        ))}
        {extraBadges.slice(0, 2).map((label, i) => (
          <Badge key={`${label}-${i}`} variant="outline" className="rounded-full">
            {label}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
