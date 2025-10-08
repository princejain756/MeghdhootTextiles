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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Sparkles, CalendarDays, BellRing, Clock, Palette, ArrowUpRight } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";

const arrivalHighlights = [
  {
    title: "Festive Capsule 'Tyohaar'",
    description:
      "Mirror-work, sequin-georgette and tissue silk sarees in jewel tones designed for Diwali and wedding season windows.",
    shipFrom: "Ships 18 Oct",
    focus: "12 sarees + 6 kurtis",
  },
  {
    title: "City Luxe Workwear",
    description:
      "Structured kurtis and co-ord sets with understated zari and foil prints in muted urban palettes.",
    shipFrom: "Ships 22 Oct",
    focus: "15 silhouettes",
  },
  {
    title: "Minimalist Occasion Edit",
    description:
      "Layered chiffon gowns and pre-stitched sarees with sculptural drapes for modern cocktail curation.",
    shipFrom: "Ships 29 Oct",
    focus: "8 hero looks",
  },
];

const timelineMilestones = [
  {
    label: "Preview drop",
    detail: "Lookbook + swatch pack emailed",
    value: "D-10",
  },
  {
    label: "Confirm orders",
    detail: "Secure your allocation & payment terms",
    value: "D-5",
  },
  {
    label: "QC & finishing",
    detail: "Steam press, labeling, dispatch planning",
    value: "D-2",
  },
  {
    label: "Pan-India dispatch",
    detail: "Live tracking shared via WhatsApp",
    value: "Launch day",
  },
];

const lookbookSlides = [
  {
    title: "Saree Story: Noor",
    palette: "Saffron • Garnet • Ivory",
    narrative:
      "Hand-embellished motifs inspired by royal domes with floating zari trails and velvet borders.",
  },
  {
    title: "Kurti Edit: Prism",
    palette: "Teal • Sand • Charcoal",
    narrative:
      "Architectural paneling, minimal mirror appliqué and modern necklines for cosmopolitan shoppers.",
  },
  {
    title: "Co-ord Drop: Rhythm",
    palette: "Wine • Blush • Midnight",
    narrative:
      "Fluid silhouettes with cinched waists and sheen-rich satin georgette for cocktail evenings.",
  },
];

const dropKits = [
  {
    title: "Launch assets",
    points: ["Campaign copy", "Story templates", "Product carousels"],
  },
  {
    title: "Visual toolkit",
    points: ["Moodboard", "Fabric swatches", "Color pairings"],
  },
  {
    title: "Retail playbook",
    points: ["Styling notes", "MER breakdown", "Reorder path"],
  },
];

const NewArrivals = () => {
  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#101828] via-primary/95 to-[#1d2a3f] text-primary-foreground">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.15), transparent 55%)" }} />
        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-accent/30 blur-[120px]" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl space-y-6">
            <Badge variant="secondary" className="bg-background/15 text-primary-foreground">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Meghdoot Launchpad
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Fresh arrivals dropped weekly with rich storytelling built-in
            </h1>
            <p className="text-lg text-primary-foreground/85 md:text-xl">
              Secure early access to seasonal edits that come with launch assets, merchandising strategy and assured replenishment windows.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base">
                Reserve my slots
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/30 bg-background/10 px-8 text-base text-primary-foreground hover:bg-background/20"
              >
                Download lookbook preview
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="space-y-6 mb-12">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-section-title">New arrivals</h2>
              <p className="text-sm text-muted-foreground">Freshly added catalogs from the dashboard appear here automatically.</p>
            </div>
          </div>
          <ProductGrid limit={8} />
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h2 className="text-section-title">This week's headline drops</h2>
            <p className="text-base text-muted-foreground">
              Each launch is curated with clear positioning, pricing guidance and photographic assets ready to go live.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Sell-through averaged 68% last week</span>
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {arrivalHighlights.map((drop) => (
            <Card key={drop.title} className="h-full border border-border/80 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="space-y-4">
                <Badge className="w-max bg-accent/10 text-accent">{drop.shipFrom}</Badge>
                <CardTitle className="text-xl leading-tight">{drop.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {drop.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3 text-sm">
                  <span>{drop.focus}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <h2 className="text-section-title">Launch calendar with predictable milestones</h2>
              <p className="text-base text-muted-foreground">
                Stay orchestrated with our drop timeline that aligns creative approvals, merchandising and logistics without last-minute surprises.
              </p>
              <div className="relative space-y-8 border-l border-dashed border-border pl-6">
                {timelineMilestones.map((item) => (
                  <div key={item.label} className="relative">
                    <div className="absolute -left-[39px] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                      <span className="text-xs font-semibold">{item.value}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader className="space-y-3">
                <Badge variant="outline" className="w-max rounded-full border-accent text-xs uppercase tracking-wide">
                  Launch metrics
                </Badge>
                <CardTitle className="text-lg">October drop snapshots</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Consolidated data from 180+ partnered retailers across metros and tier-two cities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm">
                {[
                  {
                    label: "Average margin potential",
                    value: "44%",
                  },
                  {
                    label: "Shortest sell-out window",
                    value: "72 hours",
                  },
                  {
                    label: "Repeat order ratio",
                    value: "2.8x",
                  },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-semibold text-foreground">{metric.value}</span>
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Price-hold policy strip */}
      <section className="container mx-auto px-4 py-10">
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h2 className="text-section-title">Lookbook preview</h2>
              <p className="text-base text-muted-foreground">
                Navigate through hero outfits and fabric stories crafted to capture attention across digital and in-store touchpoints.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Palette className="h-4 w-4" />
              <span>Color-coordinated drops</span>
            </div>
          </div>
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {lookbookSlides.map((slide) => (
                <CarouselItem key={slide.title} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full overflow-hidden border border-border/80 bg-card shadow-sm">
                    <div className="relative h-48 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
                    </div>
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-lg">{slide.title}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                        {slide.palette}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {slide.narrative}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <h2 className="text-section-title">Plug-and-play launch kits</h2>
              <p className="text-base text-muted-foreground">
                Receive everything your marketing and sales teams need to activate the drop within 24 hours of inventory arriving.
              </p>
              <div className="grid gap-5 md:grid-cols-3">
                {dropKits.map((kit) => (
                  <Card key={kit.title} className="h-full border border-border bg-card shadow-sm">
                    <CardHeader className="space-y-3">
                      <Badge variant="outline" className="w-max rounded-full border-accent text-xs uppercase tracking-wide">
                        {kit.title}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {kit.points.map((point) => (
                          <li key={point} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <Card className="border-none bg-gradient-to-br from-primary via-primary/95 to-[#162032] text-primary-foreground">
              <CardHeader className="space-y-4">
                <Badge className="w-max bg-background/15 text-xs uppercase tracking-wide">
                  Early access waitlist
                </Badge>
                <CardTitle className="text-2xl">Join the launchlist</CardTitle>
                <CardDescription className="text-sm text-primary-foreground/80">
                  Drop your details and our team will share prioritized allocation, color cards and payment flexibility options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Business name" className="bg-background/15 text-primary-foreground placeholder:text-primary-foreground/60" />
                <Input placeholder="WhatsApp number" className="bg-background/15 text-primary-foreground placeholder:text-primary-foreground/60" />
                <Input placeholder="City" className="bg-background/15 text-primary-foreground placeholder:text-primary-foreground/60" />
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Get early access
                </Button>
                <p className="text-xs text-primary-foreground/70">
                  Priority slots are shared every Friday. Expect a response within 6 working hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-[#0f1729]" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.12), transparent 55%)" }} />
        <div className="relative container mx-auto px-4 py-20 text-primary-foreground">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-4">
              <Badge className="bg-background/15 text-xs uppercase tracking-wide">
                Launch concierge
              </Badge>
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                Ready to headline the next Meghdoot drop?
              </h2>
              <p className="text-base text-primary-foreground/80">
                Tell us about your customer, price window and style direction. We will tailor your allocation and marketing kit instantly.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: CalendarDays, label: "Drop calendar", detail: "6 weeks out" },
                { icon: BellRing, label: "Priority alerts", detail: "SMS + email" },
                { icon: Clock, label: "24h styling", detail: "Launch advisory" },
              ].map((item) => (
                <Card key={item.label} className="border-none bg-background/10 p-6 text-primary-foreground">
                  <item.icon className="h-5 w-5 text-accent" />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm text-primary-foreground/75">{item.detail}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NewArrivals;
