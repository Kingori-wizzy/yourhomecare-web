import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            404
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary">
            Page not found
          </h1>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            The page you’re looking for doesn’t exist or may have moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button className="h-11 rounded-[8px] bg-secondary px-5 font-semibold text-white hover:bg-secondary/90">
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="h-11 rounded-[8px] border-primary px-5 font-semibold text-primary"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
