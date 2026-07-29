import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  logoUrl?: string;
  name?: string;
  tagline?: string;
}

export function Logo({
  logoUrl = "/branding/logo.png",
  name = "YourHomeCare",
  tagline = "Healthcare Beyond Hospital Walls",
}: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src={logoUrl}
        alt={name}
        width={44}
        height={44}
        className="h-11 w-11 rounded-[8px] object-contain"
        priority
      />
      <div className="hidden min-[420px]:block">
        <p className="text-lg font-bold leading-none text-primary sm:text-xl">{name}</p>
        <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{tagline}</p>
      </div>
    </Link>
  );
}
