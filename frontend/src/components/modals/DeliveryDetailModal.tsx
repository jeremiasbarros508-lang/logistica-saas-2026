"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DELIVERY_STATUS_LABELS, DELIVERY_STATUS_COLORS } from "@/utils/constants";
import { formatDate, formatPhone } from "@/utils/format";
import type { Delivery, DeliveryStatus } from "@/types";
import { MapPin, Phone, Package, Calendar, Weight, StickyNote } from "lucide-react";

interface DeliveryDetailModalProps {
  delivery: Delivery | null;
  onClose: () => void;
}

export function DeliveryDetailModal({ delivery, onClose }: DeliveryDetailModalProps) {
  if (!delivery) return null;

  const rows = [
    { icon: MapPin, label: "Endereço", value: delivery.address },
    { icon: Phone, label: "Telefone", value: formatPhone(delivery.phone) },
    { icon: Package, label: "Produto", value: delivery.product ?? "—" },
    { icon: Weight, label: "Peso", value: delivery.weight_kg ? `${delivery.weight_kg} kg` : "—" },
    { icon: Calendar, label: "Criado em", value: formatDate(delivery.created_at) },
    {
      icon: StickyNote,
      label: "Observações",
      value: delivery.notes ?? "—",
    },
  ];

  return (
    <Modal
      open={!!delivery}
      onClose={onClose}
      title={`Entrega: ${delivery.customer_name}`}
      className="max-w-lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge className={DELIVERY_STATUS_COLORS[delivery.status as DeliveryStatus]}>
            {DELIVERY_STATUS_LABELS[delivery.status as DeliveryStatus] ?? delivery.status}
          </Badge>
        </div>

        <div className="divide-y rounded-lg border">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3">
              <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {delivery.time_window_start && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Janela: {formatDate(delivery.time_window_start, "dd/MM HH:mm")} –{" "}
              {delivery.time_window_end
                ? formatDate(delivery.time_window_end, "dd/MM HH:mm")
                : "—"}
            </span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
