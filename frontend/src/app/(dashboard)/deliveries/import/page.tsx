"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deliveryService } from "@/services/delivery.service";
import { toast } from "sonner";

export default function ImportDeliveriesPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.name.endsWith(".csv") && !f.name.endsWith(".xlsx")) {
      toast.error("Formato inválido. Use CSV ou Excel (.xlsx)");
      return;
    }
    setFile(f);
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await deliveryService.importCSV(file);
      setResult(res);
      if (res.imported > 0) {
        toast.success(`${res.imported} entregas importadas com sucesso!`);
      }
    } catch {
      toast.error("Erro ao importar arquivo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/deliveries">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Importar Entregas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload de Arquivo CSV ou Excel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-10 w-10 text-green-500" />
                <p className="font-medium text-green-700">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="font-medium">Arraste e solte o arquivo aqui</p>
                <p className="text-sm text-gray-500">ou clique para selecionar</p>
                <p className="text-xs text-gray-400">Suporta CSV e Excel (.xlsx)</p>
              </div>
            )}
          </div>

          {/* Column requirements */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Colunas obrigatórias:</p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>customer_name (Nome do cliente)</li>
              <li>address (Endereço)</li>
              <li>city (Cidade)</li>
              <li>state (Estado - ex: SP)</li>
              <li>quantity (Quantidade)</li>
            </ul>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{result.imported} entregas importadas!</span>
              </div>
              {result.errors.length > 0 && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">{result.errors.length} erros encontrados:</span>
                  </div>
                  <ul className="text-sm text-red-600 space-y-1 max-h-32 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleUpload} disabled={!file || isUploading} isLoading={isUploading}>
              {isUploading ? "Importando..." : "Importar"}
            </Button>
            {result && (
              <Button variant="outline" onClick={() => router.push("/deliveries")}>
                Ver Entregas
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
