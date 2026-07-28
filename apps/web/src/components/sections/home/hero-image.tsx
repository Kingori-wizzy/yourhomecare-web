import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
        <Image
          src="/images/home/hero.png"
          alt="A YourHomeCare nurse providing compassionate care at home"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
