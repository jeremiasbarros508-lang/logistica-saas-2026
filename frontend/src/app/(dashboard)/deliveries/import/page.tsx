"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImportCSVForm } from "@/components/forms/ImportCSVForm";

export default function ImportDeliveriesPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/deliveries" className="p-2 rounded-md hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Importar Entregas</h2>
          <p className="text-sm text-muted-foreground">Importe múltiplas entregas via CSV ou Excel</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload de Arquivo</CardTitle>
          <CardDescription>
            Envie um arquivo CSV ou Excel com as entregas. Máx. 1000 registros por importação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportCSVForm onSuccess={(count) => {
            setTimeout(() => router.push("/deliveries"), 2000);
          }} />
        </CardContent>
      </Card>
    </div>
  );
}
