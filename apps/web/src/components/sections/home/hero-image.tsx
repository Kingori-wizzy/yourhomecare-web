import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative">

      <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 shadow-2xl">

        <Image
          src="/images/home/hero.jpg"
          alt="Professional caregiver assisting an elderly client at home"
          fill
          priority
          className="object-cover"
        />

      </div>

    </div>
  );
}