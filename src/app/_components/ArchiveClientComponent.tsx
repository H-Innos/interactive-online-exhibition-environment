"use client";

import { useRouter } from "next/navigation";
import { ArchivedExhibitionList } from "~/app/_components/exhibition-archive-cards";
import type { Exhibition } from "~/lib/types/exhibition";

interface ArchiveClientComponentProps {
  exhibitions: Exhibition[];
  isLoading: boolean;
}

const ArchiveClientComponent: React.FC<ArchiveClientComponentProps> = ({ exhibitions, isLoading }) => {
  const router = useRouter();

  const handleExhibitionClick = (id: number) => {
    router.push(`/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (exhibitions.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p className="text-xl">No matching exhibitions found.</p>
      </div>
    );
  }

  return (
    <ArchivedExhibitionList
      exhibitions={exhibitions}
      onExhibitionClick={handleExhibitionClick}
    />
  );
};

export default ArchiveClientComponent;