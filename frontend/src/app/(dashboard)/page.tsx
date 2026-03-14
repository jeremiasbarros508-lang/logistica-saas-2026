import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { RecentRoutes } from "@/components/dashboard/RecentRoutes";
import { DeliveryStatusSummary } from "@/components/dashboard/DeliveryStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DeliveryChart } from "@/components/charts/DeliveryChart";
import { EfficiencyGauge } from "@/components/charts/EfficiencyGauge";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <MetricsGrid />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DeliveryChart />
          <RecentRoutes />
        </div>
        <div className="space-y-6">
          <EfficiencyGauge />
          <DeliveryStatusSummary />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
