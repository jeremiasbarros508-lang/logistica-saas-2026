"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z
  .object({
    company_name: z.string().min(2, "Nome da empresa obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm_password: z.string(),
    terms: z.boolean().refine((v) => v === true, "Aceite os termos para continuar"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Senhas não conferem",
    path: ["confirm_password"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const getPasswordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (pwd.length === 0) return { label: "", color: "bg-gray-200", width: "w-0" };
    if (pwd.length < 6) return { label: "Fraca", color: "bg-red-500", width: "w-1/4" };
    if (pwd.length < 8) return { label: "Média", color: "bg-yellow-500", width: "w-2/4" };
    if (pwd.length < 12) return { label: "Boa", color: "bg-blue-500", width: "w-3/4" };
    return { label: "Forte", color: "bg-green-500", width: "w-full" };
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterForm) => {
    await registerUser({
      company_name: data.company_name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <Map className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">Logística SaaS</span>
          </div>
        </div>
        <CardTitle>Crie sua conta</CardTitle>
        <CardDescription>Registre sua empresa e comece grátis</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome da empresa"
            placeholder="Minha Empresa Ltda."
            error={errors.company_name?.message}
            {...register("company_name")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <div className="space-y-1">
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="space-y-1">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`}
                  />
                </div>
                <p className="text-xs text-gray-500">Força da senha: {strength.label}</p>
              </div>
            )}
          </div>
          <Input
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />

          <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="mt-0.5 rounded" {...register("terms")} />
            <span>
              Aceito os{" "}
              <Link href="#" className="text-primary hover:underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Criar conta
          </Button>

          <p className="text-center text-sm text-gray-600">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
