import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertCircle, Box, Inbox, LifeBuoy, Package, Plus, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { ApiUtils, OrderApi, SupportApi } from "@/lib/api";
import type { ApiOrder, SupportStatus, SupportTicket } from "@/types/api";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/PageLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariants: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-sky-100 text-sky-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
};

const supportStatusCopy: Record<SupportStatus, { badge: string; label: string }> = {
  OPEN: { badge: "bg-amber-100 text-amber-800", label: "Awaiting response" },
  IN_PROGRESS: { badge: "bg-blue-100 text-blue-800", label: "Handling" },
  RESOLVED: { badge: "bg-emerald-100 text-emerald-800", label: "Resolved" },
  CLOSED: { badge: "bg-muted text-muted-foreground", label: "Closed" },
};

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => OrderApi.list(),
    select: (response) => response.orders,
    enabled: Boolean(user),
  });

  const supportQuery = useQuery({
    queryKey: ["support", "tickets"],
    queryFn: () => SupportApi.list(),
    select: (response) => response.tickets,
    enabled: Boolean(user),
  });

  const createTicket = useMutation({
    mutationFn: () =>
      SupportApi.create({
        subject: supportSubject,
        message: supportMessage,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      toast({ title: "Support request logged", description: "We'll get back within 1 business day." });
      setSupportSubject("");
      setSupportMessage("");
      setSupportDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Unable to create ticket", description: error.message, variant: "destructive" });
    },
  });

  const latestOrders = useMemo(() => ordersQuery.data?.slice(0, 5) ?? [], [ordersQuery.data]);

  const metrics = useMemo(() => {
    const totalOrders = ordersQuery.data?.length ?? 0;
    const delivered = ordersQuery.data?.filter((order) => order.status === "DELIVERED").length ?? 0;
    const inTransit = ordersQuery.data?.filter((order) =>
      ["PROCESSING", "SHIPPED"].includes(order.status)
    ).length ?? 0;

    return [
      {
        label: "Lifetime orders",
        value: totalOrders,
        icon: Package,
        tone: "bg-primary/10 text-primary",
      },
      {
        label: "Delivered",
        value: delivered,
        icon: Truck,
        tone: "bg-emerald-100 text-emerald-700",
      },
      {
        label: "Active",
        value: inTransit,
        icon: Box,
        tone: "bg-blue-100 text-blue-700",
      },
    ];
  }, [ordersQuery.data]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return null;
  }

  const handleTicketSubmit = () => {
    if (!supportSubject || !supportMessage) {
      toast({ title: "Fill in the details", description: "Subject and message are required." });
      return;
    }
    createTicket.mutate();
  };

  const hasErrors = ordersQuery.isError || supportQuery.isError;

  const renderOrderRow = (order: ApiOrder) => {
    const statusStyle = statusVariants[order.status] ?? "bg-muted text-muted-foreground";
    const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

    return (
      <TableRow key={order.id} className="hover:bg-muted/50">
        <TableCell className="font-medium">{format(new Date(order.createdAt), "dd MMM yyyy")}</TableCell>
        <TableCell>
          <Badge className={statusStyle}>{order.status}</Badge>
        </TableCell>
        <TableCell>{itemCount} styles</TableCell>
        <TableCell>{ApiUtils.formatCurrency(order.total)}</TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {order.delivery?.status ?? "Awaiting fulfilment"}
        </TableCell>
      </TableRow>
    );
  };

  const renderSupportCard = (ticket: SupportTicket) => {
    const config = supportStatusCopy[ticket.status];
    const latestResponse = ticket.responses[ticket.responses.length - 1];

    return (
      <Card key={ticket.id} className="border shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">{ticket.subject}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Raised on {format(new Date(ticket.createdAt), "dd MMM yyyy, h:mm a")}
            </p>
          </div>
          <Badge className={config.badge}>{config.label}</Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{ticket.message}</p>
          {latestResponse && (
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="font-medium text-foreground text-sm">
                {latestResponse.authorRole === "ADMIN" ? "Meghdoot Team" : "You"}
              </p>
              <p>{latestResponse.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(latestResponse.createdAt), "dd MMM yyyy, h:mm a")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <PageLayout className="pt-20">
      <div className="container space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">Welcome back</p>
            <h1 className="text-3xl font-bold sm:text-4xl">Hi {user.fullName ?? user.username}, here's your trade hub.</h1>
            <p className="text-muted-foreground">
              Track orders, monitor fulfilment, and stay in sync with the Meghdoot team.
            </p>
          </div>
          <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New support ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share what you need help with</DialogTitle>
                <DialogDescription>
                  Our support specialists will triage and respond within business hours.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="Need update on order tracking"
                    value={supportSubject}
                    onChange={(event) => setSupportSubject(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    rows={5}
                    placeholder="Provide context, order references, or expected outcomes…"
                    value={supportMessage}
                    onChange={(event) => setSupportMessage(event.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleTicketSubmit}
                  disabled={createTicket.isPending}
                >
                  {createTicket.isPending ? "Submitting…" : "Send ticket"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {hasErrors && (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              We couldn't load some of your data. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border shadow-sm">
              <CardContent className="flex items-center justify-between py-6">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-3xl font-semibold text-foreground">{metric.value}</p>
                </div>
                <div className={`rounded-full p-3 ${metric.tone}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent orders</CardTitle>
                <p className="text-sm text-muted-foreground">Keep a pulse on what"s moving through the pipeline.</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {ordersQuery.data?.length ?? 0} total
              </Badge>
            </CardHeader>
            <CardContent>
              {ordersQuery.isLoading ? (
                <div className="space-y-3 p-6">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : latestOrders.length ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Styles</TableHead>
                        <TableHead>Order value</TableHead>
                        <TableHead>Delivery</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{latestOrders.map(renderOrderRow)}</TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 border border-dashed rounded-lg py-12 text-muted-foreground">
                  <Inbox className="h-8 w-8" />
                  <p>No orders yet. Explore collections to place your first trade order.</p>
                  <Button asChild variant="outline" size="sm">
                    <a href="/catalogs">Explore catalogs</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Delivery spotlight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordersQuery.isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-20 w-full" />
                  ))}
                </div>
              ) : latestOrders.filter((order) => order.delivery).length ? (
                latestOrders
                  .filter((order) => order.delivery)
                  .map((order) => (
                    <div key={order.id} className="rounded-lg border bg-muted/40 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <Badge className="bg-primary/10 text-primary">{order.delivery?.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.delivery?.courier ? `${order.delivery?.courier} • ${order.delivery?.trackingNumber}` : "Awaiting pickup"}
                      </p>
                      {order.delivery?.estimatedDelivery && (
                        <p className="text-sm text-muted-foreground mt-2">
                          ETA {format(new Date(order.delivery.estimatedDelivery), "dd MMM yyyy")}
                        </p>
                      )}
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-muted-foreground">
                  <Truck className="h-8 w-8" />
                  <p>Delivery updates will appear here as soon as orders are dispatched.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Support conversations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Get transparent visibility of issues, resolutions, and next steps.
              </p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <LifeBuoy className="h-3.5 w-3.5" /> {supportQuery.data?.length ?? 0}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {supportQuery.isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, index) => (
                  <Skeleton key={index} className="h-32 w-full" />
                ))}
              </div>
            ) : supportQuery.data?.length ? (
              supportQuery.data.map(renderSupportCard)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-muted-foreground">
                <LifeBuoy className="h-8 w-8" />
                <p>Need help with something specific? Raise a ticket for proactive assistance.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
