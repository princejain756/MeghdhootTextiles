import { createContext, useContext, useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { AuthApi } from "@/lib/api";
import type { ApiUser } from "@/types/api";
import { useToast } from "@/components/ui/use-toast";

type LoginInput = {
  identifier: string;
  password: string;
};

type RegisterInput = {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  phone?: string;
  companyName?: string;
};

type AuthContextValue = {
  user: ApiUser | null;
  isLoading: boolean;
  login: UseMutationResult<{ success: true; user: ApiUser }, Error, LoginInput>;
  register: UseMutationResult<{ success: true; user: ApiUser }, Error, RegisterInput>;
  logout: UseMutationResult<{ success: true }, Error, void>;
  refetch: () => Promise<ApiUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sessionQuery = useQuery<{ success: true; user: ApiUser } | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await AuthApi.me();
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const login = useMutation({
    mutationFn: (input: LoginInput) => AuthApi.login(input),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(["auth", "me"], { success: true, user });
      toast({ title: "Welcome back", description: `Logged in as ${user.username}` });
    },
    onError: (error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });

  const register = useMutation({
    mutationFn: (input: RegisterInput) => AuthApi.register(input),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(["auth", "me"], { success: true, user });
      toast({
        title: "Account created",
        description: "You're ready to explore MeghDoot Trade Hub",
      });
    },
    onError: (error) => {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    },
  });

  const logout = useMutation({
    mutationFn: () => AuthApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.removeQueries({ queryKey: ["orders"] });
      queryClient.removeQueries({ queryKey: ["products"] });
      queryClient.removeQueries({ queryKey: ["support"] });
      toast({ title: "Signed out", description: "You have been logged out." });
    },
  });

  const value = useMemo<AuthContextValue>(() => {
    const user = sessionQuery.data?.user ?? null;
    const isLoading = sessionQuery.isLoading;

    return {
      user,
      isLoading,
      login,
      register,
      logout,
      refetch: async () => {
        const data = await sessionQuery.refetch();
        return data.data?.user ?? null;
      },
    };
  }, [login, logout, register, sessionQuery]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
