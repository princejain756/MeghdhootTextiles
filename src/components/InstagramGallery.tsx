import { instagramPosts } from "@/lib/instagram";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import { useInstagramEmbed } from "@/hooks/use-instagram-embed";

type InstagramEmbedProps = { url: string };

const InstagramEmbed = ({ url }: InstagramEmbedProps) => {
  const { ready, process } = useInstagramEmbed();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            process(el);
            io.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    if (ready) process(el);
    return () => io.disconnect();
  }, [ready, process]);

  return (
    <div ref={ref}>
      <blockquote
        className="instagram-media m-0"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        data-instgrm-captioned="false"
        data-instgrm-layout="default"
        data-instgrm-embed-version="14"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          background: "transparent",
          border: 0,
          margin: 0,
        }}
      />
    </div>
  );
};

const InstagramGallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const openLightbox = (url: string) => {
    setSelectedUrl(url);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-section-title text-primary mb-3">
            Follow Our Latest on Instagram
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real looks, real fabrics, real moments. See what’s trending now.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instagramPosts.map((url) => (
            <Card
              key={url}
              className="group relative glass-card border-0 overflow-hidden hover:shadow-strong transition-shadow"
            >
              <div className="[&_.instagram-media]:!m-0 [&_.instagram-media]:!max-w-full [&_.instagram-media]:!min-w-0 [&_.instagram-media]:!w-full [&_.instagram-media]:!overflow-hidden">
                <InstagramEmbed url={url} />
              </div>

              {/* Lightbox trigger button */}
              <div className="pointer-events-none absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="pointer-events-auto shadow-medium backdrop-blur bg-background/70"
                  aria-label="Open in lightbox"
                  onClick={() => openLightbox(url)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a
              href="https://www.instagram.com/meghdoottextiles/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Meghdoot Textiles Instagram in a new tab"
            >
              View more on Instagram
            </a>
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="w-[92vw] max-w-[560px] p-0 bg-transparent border-0 shadow-none">
          {selectedUrl && (
            <div className="rounded-lg overflow-hidden shadow-strong bg-background">
              <div className="[&_.instagram-media]:!m-0 [&_.instagram-media]:!max-w-full [&_.instagram-media]:!min-w-0 [&_.instagram-media]:!w-full [&_.instagram-media]:!overflow-hidden">
                <InstagramEmbed url={selectedUrl} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default InstagramGallery;
