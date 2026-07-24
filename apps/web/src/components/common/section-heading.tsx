interface SectionHeadingProps {
  badge: string;
  title: string;
  description: string;
}

export function SectionHeading({
  badge,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      <p className="font-semibold uppercase tracking-[0.25em] text-primary">
        {badge}
      </p>

      <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
        {title}
      </h2>

      <p className="mt-6 text-lg text-muted-foreground">
        {description}
      </p>
    </div>
  );
}