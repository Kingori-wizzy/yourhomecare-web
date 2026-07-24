import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
}

export function Logo({
  showTagline = true,
  className = "",
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-4 ${className}`}
    >
      <div className="relative h-14 w-14 overflow-hidden rounded-xl">
        <Image
          src="/branding/logo.png"
          alt="YourHomeCare"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="hidden sm:block">
        <h2 className="text-xl font-bold tracking-tight">
          YourHomeCare
        </h2>

        {showTagline && (
          <p className="text-sm text-muted-foreground">
            Compassion • Dignity • Independence
          </p>
        )}
      </div>
    </Link>
  );
}