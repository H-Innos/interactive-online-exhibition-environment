"use client"; 

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ExhibitionList } from "~/app/_components/exhibition-dashboard-cards";
import type { Exhibition } from "~/lib/types/exhibition";

const ArchiveClientComponent = () => {
  const router = useRouter();
  const { data: archivedExhibitions, isLoading } = api.exhibition.getArchived.useQuery();

  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/view/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!archivedExhibitions || archivedExhibitions.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p className="text-xl">No archived exhibitions found.</p>
      </div>
    );
  }

  return (
    <ExhibitionList
      exhibitions={archivedExhibitions}
      onExhibitionClick={handleExhibitionClick}
      isArchivePage={true}
    />
  );
};

export default ArchiveClientComponent;