"use client";

import React, { useEffect, useState } from "react";
import type { Exhibition } from "../../lib/types/entities";
import { useRouter } from "next/navigation";
import useResponsiveVisibleDrafts from "~/hooks/responsive-visible-drafts";
import { api } from "~/trpc/react";
import { DraftCard } from "~/components/ExhibitionCard/cards";
import { useTranslation } from "react-i18next";

const DraftExhibitions = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const maxVisibleItems = useResponsiveVisibleDrafts();

  const [visibleDrafts, setVisibleDrafts] = useState<Exhibition[]>([]);

  const {
    data: drafts,
    error,
    isLoading,
  } = api.exhibition.getDrafts.useQuery();

  useEffect(() => {
    if (drafts) {
      setVisibleDrafts(drafts.slice(0, maxVisibleItems));
    }
  }, [drafts, maxVisibleItems]);

  const handleViewAll = () => {
    router.push("/dashboard/drafts");
  };

  return (
    <div className="relative mb-10">
      {error ? (
        <div>{t("dashboard.errorLoading")}</div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleDrafts.map((exhibition) => (
            <DraftCard key={exhibition.id} exhibition={exhibition} />
          ))}
        </div>
      )}
      {visibleDrafts.length === maxVisibleItems && (
        <div className="pointer-events-none absolute right-[-50px] top-0 h-full w-1/4 bg-gradient-to-l from-white to-transparent"></div>
      )}

      <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
        <button
          onClick={handleViewAll}
          className="group flex items-center text-black"
          data-testid="view-all-button"
        >
          <span className="text-4xl text-black">〉</span>
        </button>
      </div>
    </div>
  );
};

export default DraftExhibitions;
