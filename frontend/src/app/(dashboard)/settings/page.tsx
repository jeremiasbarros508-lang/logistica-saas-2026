"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertMessage } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import * as companyService from "@/services/company.service";
import { useNotification } from "@/hooks/useNotification";
import { getErrorMessage } from "@/utils/api-error";

const schema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const notify = useNotification();
  const qc = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", "me"],
    queryFn: companyService.getMyCompany,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => companyService.updateMyCompany({ ...data, email: data.email || null, phone: data.phone || null, address: data.address || null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["company"] }); notify.success("Configurações salvas"); },
  });

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: company ? { name: company.name, email: company.email ?? "", phone: company.phone ?? "", address: company.address ?? "" } : undefined,
  });

  const onSubmit = async (data: FormData) => {
    try { await mutation.mutateAsync(data); }
    catch (e) { setError("root", { message: getErrorMessage(e) }); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <p className="text-sm text-muted-foreground">Gerencie as informações da sua empresa</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Spinner /> : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errors.root && <AlertMessage message={errors.root.message ?? "Erro"} />}
              <div className="space-y-1">
                <Label>Nome da Empresa *</Label>
                <Input {...register("name")} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" {...register("email")} />
                </div>
                <div className="space-y-1">
                  <Label>Telefone</Label>
                  <Input {...register("phone")} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Endereço</Label>
                <Input {...register("address")} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && <Spinner size="sm" className="mr-2" />}
                  Salvar Configurações
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {company && (
        <Card>
          <CardHeader><CardTitle className="text-base">Informações do Plano</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Plano atual</span><span className="font-medium capitalize">{company.plan}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium text-green-600">{company.is_active ? "Ativo" : "Inativo"}</span></div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
