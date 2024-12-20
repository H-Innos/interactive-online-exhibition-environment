import React from "react";
import { type Contributor } from "~/lib/types/entities";

interface ContributorsSectionProps {
  contributors: Contributor[];
}

export default function ContributorsSection({
  contributors,
}: ContributorsSectionProps) {
  if (contributors.length === 0) {
    return null;
  }
  return (
    <section className="mx-auto mt-16 w-full max-w-4xl px-4 pb-10">
      <hr className="mb-8 border-t border-gray-200" aria-hidden="true" />
      <div className="space-y-6">
        {contributors.map((contributor, index) => (
          <div key={index}>
            <h3 className="mb-2 text-lg font-semibold">{contributor.role}:</h3>
            <p className="mb-1">{contributor.names}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
