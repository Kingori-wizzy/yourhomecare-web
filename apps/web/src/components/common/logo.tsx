import Image from "next/image";
import Link from "next/link";

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
    <Link
      href="/"
      className="flex items-center gap-4"
    >
      <Image
        src={logoUrl}
        alt={name}
        width={58}
        height={58}
        priority
        className="h-[58px] w-auto"
      />

      <div>
        <h1 className="text-3xl font-bold leading-none text-slate-900">
          {name}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {tagline}
        </p>
      </div>
    </Link>
  );
}
