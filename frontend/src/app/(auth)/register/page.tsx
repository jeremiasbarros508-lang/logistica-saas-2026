"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertMessage } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/api-error";

const schema = z.object({
  company_name: z.string().min(2, "Nome da empresa é obrigatório"),
  name: z.string().min(2, "Seu nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Senhas não conferem",
  path: ["confirm_password"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authRegister({
        company_name: data.company_name,
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (e) {
      setError("root", { message: getErrorMessage(e) });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Criar conta</h2>
        <p className="text-sm text-gray-500 mt-1">Cadastre sua empresa gratuitamente</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && <AlertMessage message={errors.root.message ?? "Erro"} />}

        <div className="space-y-1">
          <Label htmlFor="company_name">Nome da Empresa *</Label>
          <Input id="company_name" {...register("company_name")} placeholder="Minha Empresa Ltda" />
          {errors.company_name && <p className="text-xs text-red-500">{errors.company_name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="name">Seu Nome *</Label>
          <Input id="name" {...register("name")} placeholder="João Silva" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-email">Email *</Label>
          <Input id="reg-email" type="email" {...register("email")} placeholder="joao@empresa.com" />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-password">Senha *</Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPass ? "text" : "password"}
              {...register("password")}
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirm_password">Confirmar Senha *</Label>
          <Input
            id="confirm_password"
            type="password"
            {...register("confirm_password")}
            placeholder="Repita a senha"
          />
          {errors.confirm_password && (
            <p className="text-xs text-red-500">{errors.confirm_password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner size="sm" className="mr-2" />}
          Criar Conta
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-primary-500 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
