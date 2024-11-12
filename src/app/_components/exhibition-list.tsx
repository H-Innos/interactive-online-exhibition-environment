"use client";

import React from "react";
import type { Exhibition } from "../../lib/types/exhibition";

interface ExhibitionListProps {
  exhibitions: Exhibition[];
  onExhibitionClick: (id: number) => void;
  CardComponent: React.FC<{ exhibition: Exhibition; onClick: (id: number) => void }>;
}

const ExhibitionList: React.FC<ExhibitionListProps> = ({
  exhibitions,
  onExhibitionClick,
  CardComponent,
}) => {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {exhibitions.map((exhibition) => (
        <CardComponent
          key={exhibition.id}
          exhibition={exhibition}
          onClick={onExhibitionClick}
        />
      ))}
    </div>
  );
};

export default ExhibitionList;
