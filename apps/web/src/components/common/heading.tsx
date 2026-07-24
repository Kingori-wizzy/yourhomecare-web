interface HeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function Heading({
  eyebrow,
  title,
  description,
}: HeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}

      <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}