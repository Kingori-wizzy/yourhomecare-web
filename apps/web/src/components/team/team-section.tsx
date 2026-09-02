import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import type { TeamMemberItem } from "@/server/cms";

interface TeamSectionProps {
  members: TeamMemberItem[];
  showViewAll?: boolean;
  compact?: boolean;
  id?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamSection({
  members,
  showViewAll = false,
  compact = false,
  id = "team",
}: TeamSectionProps) {
  if (members.length === 0) return null;

  const displayMembers = compact ? members.slice(0, 4) : members;

  return (
    <Section id={id} className="bg-section scroll-mt-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Meet the Team
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Leadership &amp; Care Experts
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            The people guiding compassionate, nurse-led home healthcare across Kenya.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayMembers.map((member) => (
            <article
              key={member.id}
              className="rounded-[8px] border border-border bg-white p-6 text-center shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
            >
              {member.photoUrl ? (
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full">
                  <Image
                    src={member.photoUrl}
                    alt={member.fullName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary/15 text-xl font-bold text-secondary">
                  {initials(member.fullName)}
                </div>
              )}

              <h3 className="mt-5 text-xl font-bold text-primary">{member.fullName}</h3>
              <p className="mt-1 font-medium text-secondary">{member.title}</p>
              {member.rank ? (
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{member.rank}</p>
              ) : null}
              {member.department ? (
                <p className="mt-1 text-sm text-muted-foreground">{member.department}</p>
              ) : null}
              {member.biography ? (
                <p className="mt-4 text-sm leading-[1.6] text-muted-foreground">{member.biography}</p>
              ) : null}
            </article>
          ))}
        </div>

        {showViewAll ? (
          <div className="mt-10 flex justify-center">
            <Link
              href="/about#team"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted"
            >
              View full team
            </Link>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
