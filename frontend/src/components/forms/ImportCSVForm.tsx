"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertMessage } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useImportDeliveries } from "@/hooks/useDeliveries";
import { useNotification } from "@/hooks/useNotification";
import { getErrorMessage } from "@/utils/api-error";

interface ImportCSVFormProps {
  onSuccess?: (count: number) => void;
}

export function ImportCSVForm({ onSuccess }: ImportCSVFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportDeliveries();
  const notify = useNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!allowedTypes.includes(f.type) && !f.name.match(/\.(csv|xlsx|xls)$/i)) {
        setError("Arquivo inválido. Use CSV, XLS ou XLSX.");
        return;
      }
      setFile(f);
      setError(null);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Selecione um arquivo para importar.");
      return;
    }
    try {
      const imported = await importMutation.mutateAsync(file);
      setResult(imported.length);
      notify.success(`${imported.length} entregas importadas com sucesso!`);
      onSuccess?.(imported.length);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <AlertMessage message={error} />}

      {result !== null && (
        <AlertMessage
          variant="success"
          title="Importação concluída"
          message={`${result} entregas importadas com sucesso.`}
        />
      )}

      <div
        className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="sr-only"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <FileSpreadsheet className="h-12 w-12 text-green-500" />
            <p className="text-sm font-medium text-gray-700">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            <Button type="button" variant="outline" size="sm" onClick={clearFile}>
              <X className="h-4 w-4 mr-1" />
              Remover
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="text-base font-medium text-gray-600">
              Arraste o arquivo aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-400">Suporta CSV, XLS e XLSX</p>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Colunas esperadas no arquivo:</p>
        <div className="flex flex-wrap gap-2">
          {["customer_name", "address", "phone", "product", "quantity", "priority", "notes", "weight_kg"].map((col) => (
            <span key={col} className="rounded-full bg-white border px-3 py-1 text-xs font-mono text-gray-600">
              {col}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!file || importMutation.isPending} className="min-w-32">
          {importMutation.isPending ? (
            <><Spinner size="sm" className="mr-2" />Importando...</>
          ) : (
            <><Upload className="h-4 w-4 mr-2" />Importar Entregas</>
          )}
        </Button>
      </div>
    </form>
  );
}
