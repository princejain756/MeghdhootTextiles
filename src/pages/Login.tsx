import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import FullScreenLoader from "@/components/FullScreenLoader";

const loginSchema = z.object({
  identifier: z.string().min(3, "Please enter your email or username"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LocationState = {
  from?: Location;
};

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname ?? "/dashboard";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [navigate, user]);

  if (isLoading) {
    return <FullScreenLoader label="Preparing personalized portal" />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login.mutateAsync(values);
      const next = response.user.role === "ADMIN" ? "/admin" : from;
      navigate(next, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const isPending = login.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container flex flex-col-reverse gap-12 py-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back to <span className="text-primary">Meghdoot Trade Hub</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Manage your wholesale orders, track deliveries, and stay connected with the Meghdoot team.
            Log in to continue your journey with us.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="rounded-lg border bg-background/60 p-4 shadow-sm backdrop-blur">
              <strong className="text-foreground">Wholesale-first</strong>
              <p>Purpose-built dashboards to streamline large order workflows.</p>
            </div>
            <div className="rounded-lg border bg-background/60 p-4 shadow-sm backdrop-blur">
              <strong className="text-foreground">Live visibility</strong>
              <p>Stay on top of delivery statuses, approvals, and product updates.</p>
            </div>
          </div>
        </div>

        <div className={cn("flex-1", "max-w-md", "mx-auto", "w-full")}> 
          <Card className="shadow-xl border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sign in</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email or username</FormLabel>
                        <FormControl>
                          <Input placeholder="you@business.com" autoComplete="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Signing in…" : "Continue"}
                  </Button>
                </form>
              </Form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                New to Meghdoot? {""}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Create your trade account
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
