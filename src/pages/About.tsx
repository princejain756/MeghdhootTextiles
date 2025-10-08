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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Factory,
  Globe2,
  Handshake,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const timeline = [
  {
    year: "1998",
    title: "Founded in Bangalore",
    description: "Meghdoot textiles starts as a boutique saree studio focused on handcrafted bridal wear for local retailers.",
  },
  {
    year: "2008",
    title: "Pan-India expansion",
    description: "Distribution network scales across tier 1 and 2 cities with specialized reseller programs and logistics partnerships.",
  },
  {
    year: "2016",
    title: "Digital catalog launch",
    description: "We introduce virtual showrooms, catalog apps and real-time inventory signals tailored for resellers and boutique owners.",
  },
  {
    year: "2024",
    title: "Meghdoot Trade Hub",
    description: "Unified wholesale platform blending merchandising intelligence, fast logistics and launch-ready marketing support.",
  },
];

const leadership = [
  {
    name: "Mukesh Bhawarlal Jain",
    role: "Director",
    bio: "DIN: 00336547 — appointed: 27-Nov-1998. Leading the company's strategic direction and operations since inception.",
    initials: "MJ",
  },
  {
    name: "Deepak Bhawarlal Jain",
    role: "Director",
    bio: "DIN: 02491717 — appointed: 16-Jun-2014. Overseeing business development and corporate governance initiatives.",
    initials: "DJ",
  },
];

const values = [
  {
    title: "Craft with conscience",
    description: "Partnering with artisan clusters and modern units to ensure heritage techniques thrive alongside innovation.",
    icon: Leaf,
  },
  {
    title: "Data-guided creativity",
    description: "Trend intelligence, sell-through analytics and studio storytelling align to build commercially successful drops.",
    icon: Lightbulb,
  },
  {
    title: "Partnership mindset",
    description: "We move beyond transactions to co-create growth, supporting everything from marketing to replenishment.",
    icon: Handshake,
  },
];

const stats = [
  {
    label: "Retail partners",
    value: "1000+",
    detail: "Boutiques, resellers and modern trade across 150 cities",
  },
  {
    label: "Collections each year",
    value: "40",
    detail: "Seasonal drops spanning sarees, kurtis, co-ords and custom edits",
  },
  {
    label: "Dispatch velocity",
    value: "2-5 days",
    detail: "Optimized production and logistics network with QC at every stage",
  },
];

const About = () => {
  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-[#132032] text-primary-foreground">
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(circle at 15% 25%, rgba(255,255,255,0.14), transparent 60%)" }} />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl space-y-6">
            <Badge variant="secondary" className="bg-background/15 text-primary-foreground">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> About Meghdoot
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Heritage craftsmanship meets modern wholesale intelligence
            </h1>
            <p className="text-lg text-primary-foreground/85 md:text-xl">
              For over two decades we have been curating premium Indian ethnic wear for retailers, resellers and boutiques—bringing stories from looms to storefronts with precision.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base">
                Explore our journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/30 bg-background/10 px-8 text-base text-primary-foreground hover:bg-background/20"
              >
                Meet the leadership
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-section-title">Our evolution</h2>
            <p className="text-base text-muted-foreground">
              Meghdoot has grown from a family-run design studio to a nationwide wholesale partner. Yet our obsession with detail, respectful sourcing and curated storytelling remains unchanged.
            </p>
            <div className="relative space-y-8 border-l border-dashed border-border pl-6">
              {timeline.map((item) => (
                <div key={item.year} className="relative">
                  <div className="absolute -left-[34px] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                    {item.year}
                  </div>
                  <div className="space-y-2 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="border border-border/70 bg-card shadow-sm">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-max rounded-full border-accent text-xs uppercase tracking-wide">
                Our promise
              </Badge>
              <CardTitle className="text-xl">Craft, consistency and collaboration</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                We champion slow craft with fast, reliable fulfilment so your business can scale without compromise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                <Factory className="mb-2 h-4 w-4 text-accent" />
                Vertical production with artisan clusters and trusted manufacturing partners in Surat.
              </div>
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                <Globe2 className="mb-2 h-4 w-4 text-accent" />
                Serving retailers across India, Middle East and South-East Asia with localized assortment recommendations.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <h2 className="text-section-title">Board of Directors</h2>
              <p className="text-base text-muted-foreground">
                Current board of directors (as of Sep 21, 2025) leading Meghdoot Textiles with decades of experience in the textile industry.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>100+ people powering Meghdoot</span>
            </div>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {leadership.map((leader) => (
              <Card key={leader.name} className="border border-border/70 bg-card shadow-sm">
                <CardHeader className="space-y-4">
                  <Avatar className="h-14 w-14 border border-border/70">
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {leader.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{leader.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{leader.role}</p>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {leader.bio}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h2 className="text-section-title">Values we live by</h2>
            <p className="text-base text-muted-foreground">
              Every decision—from sourcing to storytelling—is anchored in these non-negotiables.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <Card key={value.title} className="border border-border/70 bg-card shadow-sm">
                  <CardHeader className="space-y-4">
                    <value.icon className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {value.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card className="border-none bg-gradient-to-br from-primary via-primary/95 to-[#101a2a] text-primary-foreground">
            <CardHeader className="space-y-4">
              <Badge className="w-max bg-background/15 text-xs uppercase tracking-wide">
                Sustainability lens
              </Badge>
              <CardTitle className="text-2xl">Responsible sourcing commitments</CardTitle>
              <CardDescription className="text-sm text-primary-foreground/80">
                We partner with mills investing in water conservation, azo-free dyes and ethical working conditions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <Leaf className="mb-2 h-4 w-4 text-accent" />
                60% of our core collection uses eco viscose and responsibly sourced cotton blends.
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <ShieldCheck className="mb-2 h-4 w-4 text-accent" />
                Compliance audits every quarter across partner facilities with transparent reporting.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border border-border/70 bg-card shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <p className="text-3xl font-semibold text-primary">{stat.value}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Card className="border border-border/70 bg-card shadow-sm">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-max rounded-full border-accent text-xs uppercase tracking-wide">
                Community initiatives
              </Badge>
              <CardTitle className="text-xl">Empowering artisans and boutiques</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Meghdoot invests in workshops, digital training and credit assistance for partners to adopt new-age selling tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                Skill upliftment programs for 500+ artisans every year.
              </div>
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                Boutique accelerator support with merchandising playbooks and marketing mentorship.
              </div>
            </CardContent>
          </Card>
          <Card className="border-none bg-gradient-to-br from-primary via-primary/95 to-[#111b2b] text-primary-foreground">
            <CardHeader className="space-y-4">
              <Badge className="w-max bg-background/15 text-xs uppercase tracking-wide">
                Join the journey
              </Badge>
              <CardTitle className="text-2xl">Co-create the future of Indian ethnic retail</CardTitle>
              <CardDescription className="text-sm text-primary-foreground/80">
                Partner with Meghdoot to unlock thoughtful collections, data-backed decisions and elevated customer experiences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Connect with us
              </Button>
              <Separator className="bg-primary-foreground/30" />
              <p className="text-xs text-primary-foreground/70">
                We respond within 6 working hours and tailor a sourcing roadmap for your brand.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
