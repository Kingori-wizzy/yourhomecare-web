import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  logoUrl?: string;
  name?: string;
  tagline?: string;
}

export function Logo({
  logoUrl = "/branding/logo.png",
  name = "Your Home Care",
}: LogoProps) {
  return (
    <Link href="/" className="flex items-center" aria-label={name}>
      <Image
        src={logoUrl}
        alt={name}
        width={280}
        height={100}
        className="h-20 w-auto object-contain sm:h-24"
        priority
      />
    </Link>
  );
}
