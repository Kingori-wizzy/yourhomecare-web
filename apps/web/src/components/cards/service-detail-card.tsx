import { CheckCircle2 } from "lucide-react";

interface ServiceDetailCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

export function ServiceDetailCard({
  title,
  description,
  features,
  icon,
}: ServiceDetailCardProps) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="text-primary">{icon}</div>

      <h3 className="mt-6 text-3xl font-bold">
        {title}
      </h3>

      <p className="mt-4 leading-8 text-muted-foreground">
        {description}
      </p>

      <div className="mt-8 space-y-4">
        {features.map((feature) => (
          <div key={feature} className="flex gap-3">
            <CheckCircle2
              className="mt-1 text-primary"
              size={18}
            />

            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}