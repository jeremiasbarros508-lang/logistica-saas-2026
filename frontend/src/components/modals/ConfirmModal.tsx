"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/modal";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "destructive" | "default";
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  description = "Tem certeza que deseja continuar?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  variant = "destructive",
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={loading}>
            {loading && <Spinner size="sm" className="mr-2" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
