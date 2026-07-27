import { solutionsContent } from "@/content/solutions";

export function getSolution(slug: string) {
  return solutionsContent.solutions.find(
    (solution) => solution.slug === slug
  );
}