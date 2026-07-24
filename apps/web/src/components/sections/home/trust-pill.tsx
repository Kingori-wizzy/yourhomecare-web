import { CheckCircle2 } from "lucide-react";

interface Props {
  text: string;
}

export function TrustPill({ text }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
      <CheckCircle2 className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">
        {text}
      </span>
    </div>
  );
}