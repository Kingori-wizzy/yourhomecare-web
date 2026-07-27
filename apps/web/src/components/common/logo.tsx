import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-4"
    >
      <Image
        src="/branding/logo.png"
        alt="YourHomeCare"
        width={58}
        height={58}
        priority
      />

      <div>
        <h1 className="text-3xl font-bold leading-none text-slate-900">
          YourHomeCare
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Healthcare Beyond Hospital Walls
        </p>
      </div>
    </Link>
  );
}