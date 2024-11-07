"use client"; 

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ExhibitionList } from "~/app/_components/exhibition-dashboard-cards";

const ArchiveClientComponent = () => {
  const router = useRouter();
  const { data: archivedExhibitions, isLoading } = api.exhibition.getArchived.useQuery();

  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ExhibitionList
      exhibitions={archivedExhibitions ?? []}
      onExhibitionClick={handleExhibitionClick}
      isArchivePage={true}
    />
  );
};

export default ArchiveClientComponent;