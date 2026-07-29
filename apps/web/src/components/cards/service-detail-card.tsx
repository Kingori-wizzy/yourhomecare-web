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
    <article className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/12 text-secondary">
        {icon}
      </div>

      <h3 className="mt-5 text-2xl font-bold text-primary lg:text-3xl">{title}</h3>

      <p className="mt-3 text-base leading-[1.6] text-muted-foreground">{description}</p>

      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex gap-3 text-[15px] text-primary/90">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
