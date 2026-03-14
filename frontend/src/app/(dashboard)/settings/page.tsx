"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { companyService, type CompanyUpdate } from "@/services/company.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import type { Company } from "@/types";

const companySchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({ resolver: zodResolver(companySchema) });

  useEffect(() => {
    companyService
      .getMe()
      .then((data) => {
        setCompany(data);
        reset({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          address: data.address || "",
        });
      })
      .catch(() => {
        // Use mock data
        const mockCompany: Company = {
          id: "1",
          name: "Empresa Demo",
          email: "empresa@demo.com",
          plan: "basic",
          is_active: true,
          created_at: new Date().toISOString(),
        };
        setCompany(mockCompany);
        reset({ name: mockCompany.name, email: mockCompany.email });
      })
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const updated = await companyService.update(data as CompanyUpdate);
      setCompany(updated);
      toast.success("Configurações salvas!");
    } catch {
      toast.error("Erro ao salvar configurações");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Company info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Dados da Empresa</CardTitle>
              <CardDescription>Informações da sua empresa no sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nome da empresa *"
                placeholder="Minha Empresa Ltda."
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Email *"
                type="email"
                placeholder="empresa@email.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Telefone"
                placeholder="(11) 3333-3333"
                {...register("phone")}
              />
              <Input
                label="Endereço"
                placeholder="Rua das Flores, 123 - São Paulo, SP"
                {...register("address")}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="gap-2" isLoading={isSubmitting}>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Plan info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plano Atual</CardTitle>
          <CardDescription>Informações sobre seu plano de assinatura</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold capitalize">{company?.plan || "Basic"}</p>
              <p className="text-sm text-muted-foreground">Plano atual</p>
            </div>
            <Button variant="outline" size="sm">
              Fazer upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{user?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Função</p>
              <p className="font-medium capitalize">{user?.role || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
