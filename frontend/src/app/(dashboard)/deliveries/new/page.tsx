"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryForm } from "@/components/forms/DeliveryForm";

export default function NewDeliveryPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/deliveries" className="p-2 rounded-md hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nova Entrega</h2>
          <p className="text-sm text-muted-foreground">Cadastre uma nova entrega</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados da Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <DeliveryForm onSuccess={() => router.push("/deliveries")} onCancel={() => router.push("/deliveries")} />
        </CardContent>
      </Card>
    </div>
  );
}
