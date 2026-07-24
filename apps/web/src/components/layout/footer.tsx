import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t py-12">
      <Container>
        <div className="text-center">
          <h3 className="text-xl font-bold">
            YourHomeCare
          </h3>

          <p className="mt-3 text-muted-foreground">
            Compassionate Care. Right at Home.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            © {new Date().getFullYear()} YourHomeCare.
            All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}