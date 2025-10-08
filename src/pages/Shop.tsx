import PageLayout from "@/components/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Filter,
  Palette,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Truck,
} from "lucide-react";

const quickFilters = [
  "Ready Stock",
  "Festive Edit",
  "MOQ 6",
  "Express Dispatch",
  "Trending Prints",
  "Premium Handwork",
  "Plus Sizes",
];

const productHighlights = [
  {
    name: "Signature Bridal Sarees",
    description:
      "Hand-embroidered zardozi, sequins and organza textures curated for premium bridal boutiques.",
    priceRange: "₹1,299 – ₹3,499",
    turnaround: "Dispatch in 3 days",
    gradient: "linear-gradient(135deg, rgba(27,36,62,0.95), rgba(60,73,115,0.8), rgba(252,163,17,0.85))",
    tags: ["Handwork", "Wedding", "Limited Edition"],
    metrics: [
      { label: "MOQ", value: "10 pcs" },
      { label: "Margin", value: "up to 48%" },
    ],
  },
  {
    name: "Everyday Saree Capsules",
    description:
      "Breathable georgette and cotton blends with effortless drape designed for daily-wear retailers.",
    priceRange: "₹449 – ₹999",
    turnaround: "Dispatch in 48 hours",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(225,238,255,0.9), rgba(125,180,255,0.75))",
    tags: ["Ready Stock", "Georgette", "Retail Favorite"],
    metrics: [
      { label: "MOQ", value: "6 pcs" },
      { label: "Margin", value: "35%" },
    ],
  },
  {
    name: "Occasion Wear Kurtis",
    description:
      "Statement silhouettes in silk-cotton with artisanal embellishments tailored for boutique curation.",
    priceRange: "₹699 – ₹1,599",
    turnaround: "Dispatch in 4 days",
    gradient: "linear-gradient(135deg, rgba(36,28,79,0.92), rgba(73,50,123,0.85), rgba(252,163,17,0.7))",
    tags: ["Festive", "Artisanal", "Boutique"],
    metrics: [
      { label: "MOQ", value: "8 pcs" },
      { label: "Margin", value: "42%" },
    ],
  },
];

const curatedStories = [
  {
    title: "Reseller Starter Box",
    focus: "Matched saree + kurti bundles with marketing content ready to list.",
    highlight: "8 curated looks",
    tone: "from-primary/90 via-primary/80 to-primary/70",
  },
  {
    title: "Boutique Luxe Rack",
    focus: "Fabric-first edit featuring modal silk, tissue organza and foil-detailed co-ords.",
    highlight: "Limited 30 sets",
    tone: "from-primary/90 via-[#434379] to-accent/70",
  },
  {
    title: "Festive Color Lab",
    focus: "Trend forecasting with seasonal color stories, Pantone matching and swatch boards.",
    highlight: "12 moodboards",
    tone: "from-primary/90 via-primary/85 to-[#FDBB74]/80",
  },
];

const serviceHighlights = [
  {
    icon: Truck,
    title: "Logistics orchestrated",
    description:
      "Trusted transport partners with live dispatch tracking, secure packaging and GST-ready paperwork for every shipment.",
  },
  {
    icon: ShieldCheck,
    title: "Quality compliance",
    description:
      "Multi-layer QC with defect imaging, stitched labels and steam press finishing before dispatch for boutique-ready delivery.",
  },
  {
    icon: PhoneCall,
    title: "Stylist concierge",
    description:
      "Dedicated merchandisers help build drops, align sizing curves and co-create exclusive capsules for your customer base.",
  },
];

const insightBlocks = [
  {
    title: "Visual merchandising kits",
    description:
      "Instant access to product imagery, reel templates and storytelling copy to help you launch each collection online in hours.",
    badge: "Marketing Support",
  },
  {
    title: "Sell-through intelligence",
    description:
      "Real-time signals on what is reordering across India with weekly sell-through dashboards and margin planners.",
    badge: "Data-backed",
  },
  {
    title: "Fabric innovation desk",
    description:
      "Preview experimental weaves, eco viscose blends and designer collaborations months before seasonal demand peaks.",
    badge: "Exclusive Preview",
  },
];

const Shop = () => {
  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-[#1d2536] text-primary-foreground">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-accent/30 blur-[120px]" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <Badge variant="secondary" className="bg-background/15 text-primary-foreground">
                <Sparkles className="mr-2 h-3.5 w-3.5" /> Curated wholesale marketplace
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Shop Meghdoot collections with confidence and creative control
              </h1>
              <p className="text-lg text-primary-foreground/85 md:text-xl">
                Layered lookbooks, transparent pricing and premium support for retailers, resellers and boutique founders who expect more from their suppliers.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base">
                  Build my next drop
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-primary-foreground/30 bg-background/10 px-8 text-base text-primary-foreground hover:bg-background/20"
                >
                  Explore ready stock
                </Button>
              </div>
              <div className="grid gap-6 pt-4 sm:grid-cols-3">
                {["2-5 day dispatch", "1000+ active retailers", "Pan-India logistics"].map((item) => (
                  <div key={item} className="rounded-xl border border-primary-foreground/15 bg-background/10 px-4 py-3 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <Card className="relative max-w-md border-none bg-background/10 p-1 backdrop-blur">
              <div className="rounded-xl bg-background/90 p-8 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-accent/20 p-3 text-accent">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">
                      Live retailer pulse
                    </p>
                    <p className="text-2xl font-semibold text-foreground">Top performing edits</p>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-5">
                  {[
                    {
                      label: "Festive heritage",
                      metric: "+62% vs last drop",
                    },
                    {
                      label: "Contemporary kurtis",
                      metric: "+38% sell-through",
                    },
                    {
                      label: "Everyday sarees",
                      metric: "Repeat orders in 9 states",
                    },
                  ].map((insight) => (
                    <div key={insight.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{insight.label}</p>
                        <p className="text-xs text-muted-foreground">Curated for tier 1 & 2 cities</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-500">
                        {insight.metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/40">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Shop by what matters to you
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="rounded-full border border-primary/10 bg-background px-4 py-1 text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-4">
            <h2 className="text-section-title">Signature collections to anchor your assortment</h2>
            <p className="text-base text-muted-foreground">
              Every collection ships with lookbooks, merchandising notes and reorder pathways so you can launch seamlessly across channels.
            </p>
          </div>
          <Button variant="ghost" className="self-start text-primary">
            Download latest catalog
          </Button>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {productHighlights.map((collection) => (
            <Card
              key={collection.name}
              className="group relative overflow-hidden border-none shadow-xl"
            >
              <div
                className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                style={{ backgroundImage: collection.gradient }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/20 to-black/30" />
              <div className="relative flex h-full flex-col justify-between gap-10 p-8 text-primary-foreground">
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {collection.tags.map((tag) => (
                      <Badge key={tag} className="bg-background/20 text-xs font-medium uppercase tracking-wide">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold leading-tight">
                      {collection.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-primary-foreground/80">
                      {collection.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/20 bg-black/20 p-4 text-xs uppercase tracking-wide">
                  <div>
                    <p className="font-semibold text-sm">{collection.priceRange}</p>
                    <p className="text-[11px] text-primary-foreground/70">{collection.turnaround}</p>
                  </div>
                  <div className="flex gap-6">
                    {collection.metrics.map((metric) => (
                      <div key={metric.label} className="text-right">
                        <p className="text-[11px] text-primary-foreground/70">{metric.label}</p>
                        <p className="text-sm font-semibold">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Price-hold policy strip */}
      <section className="container mx-auto px-4 py-10">
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="text-section-title">Merchandising stories built for discovery</h2>
              <p className="text-base text-muted-foreground">
                Translate runway inspiration into store-ready capsules with curated color flows, fabric swatches and content packs.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Updated every fortnight</span>
            </div>
          </div>
          <ScrollArea className="mt-10 w-full">
            <div className="flex gap-6 pb-4">
              {curatedStories.map((story) => (
                <Card
                  key={story.title}
                  className={`relative w-[320px] overflow-hidden border-none bg-gradient-to-br ${story.tone} text-primary-foreground shadow-lg`}
                >
                  <div className="absolute inset-0 bg-black/20 mix-blend-soft-light" />
                  <CardHeader className="relative space-y-2 text-primary-foreground">
                    <Badge className="w-max bg-background/20 text-xs uppercase tracking-wide">
                      {story.highlight}
                    </Badge>
                    <CardTitle className="text-xl text-primary-foreground">{story.title}</CardTitle>
                    <CardDescription className="text-sm text-primary-foreground/80">
                      {story.focus}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative flex flex-col gap-4 text-primary-foreground">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary-foreground/80">
                      <Palette className="h-4 w-4" />
                      Color-curated stories
                    </div>
                    <Button
                      variant="secondary"
                      className="h-10 w-full bg-background/90 text-primary hover:bg-background"
                    >
                      View styling notes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-section-title">Operational excellence from enquiry to re-order</h2>
              <p className="text-base text-muted-foreground">
                Partner with a wholesale team that obsesses over details. Every order is supported with thorough QC, merchandising guidance and business intelligence.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {serviceHighlights.map((service) => (
                <Card key={service.title} className="h-full border border-border/70 bg-card shadow-sm">
                  <CardHeader className="space-y-3">
                    <service.icon className="h-6 w-6 text-accent" />
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card className="flex flex-col justify-between border-dashed border-accent/40 bg-accent/5 p-8">
            <div className="space-y-4">
              <Badge className="w-max bg-accent text-sm uppercase">
                Concierge desk
              </Badge>
              <h3 className="text-xl font-semibold">Need a bespoke capsule for your storefront?</h3>
              <p className="text-sm text-muted-foreground">
                Our stylists will translate your brief into a color-balanced assortment with ready-to-post content, pricing strategy and replenishment plan.
              </p>
            </div>
            <Button size="lg" className="mt-6 justify-between bg-primary text-primary-foreground hover:bg-primary/90">
              Brief the team
              <Star className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="text-section-title">Stay ahead with the Meghdoot knowledge desk</h2>
              <p className="text-base text-muted-foreground">
                Tap into insider intel on fabrics, demand signals and launch playbooks built for fast-moving wholesale teams.
              </p>
            </div>
            <Button variant="secondary" className="h-10">
              Download sample playbook
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insightBlocks.map((block) => (
              <Card key={block.title} className="h-full border border-border bg-card shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="space-y-3">
                  <Badge variant="outline" className="w-max rounded-full border-dashed border-accent text-xs uppercase tracking-wide">
                    {block.badge}
                  </Badge>
                  <CardTitle className="text-lg leading-tight">{block.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {block.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#162032]" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1), transparent 60%)" }} />
        <div className="relative container mx-auto px-4 py-20 text-primary-foreground">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-6">
              <Badge className="bg-background/15 text-xs uppercase tracking-wide">
                Partnership-first wholesale
              </Badge>
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                Build a future-proof inventory pipeline with Meghdoot Trade Hub
              </h2>
              <p className="text-base text-primary-foreground/80">
                Secure priority access to fresh drops, flexible payment windows and data-backed insights that help you scale responsibly.
              </p>
              <div className="grid gap-6 sm:grid-cols-3">
                {["Priority preview", "MOQ flexibility", "Replenishment alerts"].map((value) => (
                  <div key={value} className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm">
                    {value}
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-none bg-background/10 p-1 backdrop-blur">
              <div className="rounded-xl bg-background/95 p-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span className="text-sm uppercase tracking-wide">Start a conversation</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-foreground">
                  Share your sourcing goals
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tell us about your customer, price points and timelines. We will craft a bespoke line-sheet within 24 hours.
                </p>
                <Button size="lg" className="mt-8 w-full">
                  Schedule discovery call
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Shop;
