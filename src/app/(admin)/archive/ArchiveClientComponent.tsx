"use client";

import { useRouter } from "next/navigation";
import { ArchivedExhibitionList } from "~/app/_components/exhibition-archive-cards";
import { api } from "~/trpc/react";

const ArchiveClientComponent = () => {
  const router = useRouter();
  const { data: archivedExhibitions, isLoading } = api.exhibition.getArchived.useQuery();

  const handleExhibitionClick = (id: number) => {
    router.push(`/${id}`);
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
    <ArchivedExhibitionList
      exhibitions={archivedExhibitions}
      onExhibitionClick={handleExhibitionClick}
    />
  );
};

export default ArchiveClientComponent;