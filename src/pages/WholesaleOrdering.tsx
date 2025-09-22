import PageLayout from "@/components/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRight,
  CircleDollarSign,
  ClipboardCheck,
  Handshake,
  MessagesSquare,
  PackageSearch,
  ShieldCheck,
  Truck,
} from "lucide-react";

const processSteps = [
  {
    title: "Discovery & assortment mapping",
    description:
      "30-minute strategy call to understand target customer, volume goals, price architecture and dispatch timelines.",
    icon: MessagesSquare,
    milestone: "Day 0",
  },
  {
    title: "Curated line-sheet delivery",
    description:
      "Receive a bespoke catalog with pricing ladder, MOQ recommendations, styling notes and marketing assets.",
    icon: ClipboardCheck,
    milestone: "Day 1",
  },
  {
    title: "Production & finishing",
    description:
      "Fabric sourcing, embroidery, stitching, steam press, labeling and a 3-stage QC before pieces leave the hub.",
    icon: ShieldCheck,
    milestone: "Day 2-4",
  },
  {
    title: "Dispatch & replenishment",
    description:
      "Managed logistics with insurance, live tracking, and proactive reorder prompts once sell-through crosses 60%.",
    icon: Truck,
    milestone: "Day 5",
  },
];

const serviceTiers = [
  {
    name: "Starter",
    description: "Ideal for new retailers testing MeghDoot assortments.",
    features: ["MOQ from 6", "Standard dispatch 5 days", "Catalog access"],
    price: "₹25,000 min buy-in",
  },
  {
    name: "Growth",
    description: "For established stores scaling to multiple cities or digital channels.",
    features: ["Priority production", "Dedicated stylist", "Reorder analytics"],
    price: "₹75,000 per cycle",
  },
  {
    name: "Enterprise",
    description: "For national chains and marketplaces with complex requirements.",
    features: ["Exclusive drops", "Flexible payment", "Co-branded marketing"],
    price: "Custom proposal",
  },
];

const assuranceStats = [
  { label: "QC accuracy", value: 98 },
  { label: "On-time dispatch", value: 95 },
  { label: "Repeat partner rate", value: 88 },
];

const faqs = [
  {
    question: "What payment terms are available?",
    answer:
      "We support advance, stage-wise and LC-backed payments based on partner profile. Growth and Enterprise tiers can unlock extended credit windows.",
  },
  {
    question: "Do you offer private label services?",
    answer:
      "Yes. From branded labels, custom trims to exclusive fabric development—our enterprise desk manages end-to-end private label production.",
  },
  {
    question: "How do reorders work?",
    answer:
      "We monitor sell-through data and trigger replenishment alerts. Most core styles stay in rotation with visibility on fabric availability 60 days out.",
  },
];

const WholesaleOrdering = () => {
  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-[#161f2c] text-primary-foreground">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.14), transparent 55%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl space-y-6">
            <Badge variant="secondary" className="bg-background/15 text-primary-foreground">
              <Handshake className="mr-2 h-3.5 w-3.5" /> MeghDoot wholesale program
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Seamless wholesale ordering designed for modern retailers
            </h1>
            <p className="text-lg text-primary-foreground/85 md:text-xl">
              From discovery to dispatch, we orchestrate every touchpoint with transparency, merchandising intelligence and white-glove logistics.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base">
                Schedule onboarding call
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/30 bg-background/10 px-8 text-base text-primary-foreground hover:bg-background/20"
              >
                Download onboarding guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-section-title">4-stage wholesale playbook</h2>
              <p className="text-base text-muted-foreground">
                Every partner receives a detailed journey map with clear owners, touchpoints and SLA-backed timelines.
              </p>
            </div>
            <div className="relative space-y-8 border-l border-dashed border-border pl-6">
              {processSteps.map((step, index) => (
                <div key={step.title} className="relative">
                  <div className="absolute -left-[37px] flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                    <span className="text-xs font-semibold">{index + 1}</span>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      <step.icon className="h-5 w-5 text-accent" />
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">{step.milestone}</span>
                    </div>
                    <p className="text-base font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="border-none bg-gradient-to-br from-primary via-primary/95 to-[#121a27] text-primary-foreground">
            <CardHeader className="space-y-4">
              <Badge className="w-max bg-background/15 text-xs uppercase tracking-wide">
                White-glove support
              </Badge>
              <CardTitle className="text-2xl">Dedicated concierge team</CardTitle>
              <CardDescription className="text-sm text-primary-foreground/80">
                Your account is backed by a stylist, production lead and logistics manager—available across WhatsApp, email and phone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                6-day production to dispatch cycle for priority orders
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                Weekly performance review with sell-through analytics
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                Exclusive previews of upcoming collections and fabrics
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <h2 className="text-section-title">Choose the partnership tier that fits your ambition</h2>
              <p className="text-base text-muted-foreground">
                Transparent, value-driven tiers whether you are discovering MeghDoot or running a nationwide retail operation.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CircleDollarSign className="h-4 w-4" />
              <span>Flexible payment structures available</span>
            </div>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {serviceTiers.map((tier) => (
              <Card key={tier.name} className="h-full border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="space-y-2">
                  <Badge variant="outline" className="w-max rounded-full border-accent text-xs uppercase tracking-wide">
                    {tier.name}
                  </Badge>
                  <CardTitle className="text-xl">{tier.price}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="gap-2 text-primary">
                    Explore tier
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-section-title">Operational assurance metrics</h2>
            <p className="text-base text-muted-foreground">
              Our success metrics are tracked in real time. Expect proactive communication should any variable shift.
            </p>
            <div className="space-y-6">
              {assuranceStats.map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-semibold text-foreground">{stat.value}%</span>
                  </div>
                  <Progress value={stat.value} className="h-3 overflow-hidden bg-secondary" />
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/40 p-6 text-sm text-muted-foreground">
              <PackageSearch className="mb-3 h-5 w-5 text-accent" />
              Daily QC snapshots, dispatch imagery and invoice packs are shared for every shipment for complete transparency.
            </div>
          </div>
          <Card className="border border-border/70 bg-card shadow-sm">
            <CardHeader className="space-y-3">
              <Badge variant="outline" className="w-max rounded-full border-accent text-xs uppercase tracking-wide">
                Partnership enquiry
              </Badge>
              <CardTitle className="text-xl">Start your wholesale conversation</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Tell us about your brand, preferred categories and rollout timeline. We respond within 6 working hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Brand name" />
              <Input placeholder="WhatsApp number" />
              <Input placeholder="City / Region" />
              <Textarea rows={4} placeholder="Share sourcing goals, target price points, size curve" />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit enquiry</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border border-border/70 bg-card shadow-sm">
              <CardHeader className="space-y-4">
                <Badge variant="outline" className="w-max rounded-full border-accent text-xs uppercase tracking-wide">
                  Payment guardrails
                </Badge>
                <CardTitle className="text-xl">Flexible yet secure payment structures</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Combine upfront, stage-wise and credit-backed options. We help model cashflows so scaling feels controlled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                  <CircleDollarSign className="mb-2 h-4 w-4 text-accent" />
                  Secure payment gateway with instant receipts and GST compliance.
                </div>
                <div className="rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3">
                  <Handshake className="mb-2 h-4 w-4 text-accent" />
                  Credit assessment for long-term partners with automatic reminders and ledger visibility.
                </div>
              </CardContent>
            </Card>
            <div>
              <h2 className="text-section-title">Wholesale FAQs</h2>
              <Accordion type="single" collapsible className="mt-6 rounded-2xl border border-border/70 bg-card">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="px-6 text-left text-sm font-semibold text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#101825]" />
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(circle at 75% 20%, rgba(255,255,255,0.12), transparent 55%)" }} />
        <div className="relative container mx-auto px-4 py-20 text-primary-foreground">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <Badge className="bg-background/15 text-xs uppercase tracking-wide">
                Always-on support
              </Badge>
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                Partner with MeghDoot Trade Hub for predictable, premium wholesale ordering
              </h2>
              <p className="text-base text-primary-foreground/80">
                Our team works as an extension of your merchandising unit—forecasting demand, aligning creative assets and ensuring inventory flows effortlessly.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Concierge on WhatsApp",
                "Dispatch tracker portal",
                "Replenishment alerts",
              ].map((item) => (
                <Card key={item} className="border-none bg-background/10 p-6 text-primary-foreground">
                  <p className="text-sm font-semibold uppercase tracking-wide">{item}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WholesaleOrdering;
