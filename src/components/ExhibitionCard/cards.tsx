import { type Exhibition } from "~/lib/types/entities";
import { ExhibitionCard } from "./exhibition-card";
import { useRouter } from "next/navigation";
import React from "react";

type CardProps = {
  exhibition: Exhibition;
};

export const DraftCard: React.FC<CardProps> = ({ exhibition }) => {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/dashboard/${id}`);
  };

  return (
    <ExhibitionCard
      exhibition={exhibition}
      onClick={() => handleClick(exhibition.id)}
    >
      <ExhibitionCard.Header>
        <ExhibitionCard.ImageAlternative />
        <ExhibitionCard.Dropdown>
          <ExhibitionCard.Dropdown.Edit />
          <ExhibitionCard.Dropdown.Archive />
          <ExhibitionCard.Dropdown.Publish />
          <ExhibitionCard.Dropdown.Delete />
        </ExhibitionCard.Dropdown>
      </ExhibitionCard.Header>
      <ExhibitionCard.Content>
        <ExhibitionCard.Title />
        <ExhibitionCard.Date />
        <ExhibitionCard.Description />
      </ExhibitionCard.Content>
    </ExhibitionCard>
  );
};

export const PublishedCard: React.FC<CardProps> = ({ exhibition }) => {
  return (
    <ExhibitionCard exhibition={exhibition}>
      <ExhibitionCard.Header>
        <ExhibitionCard.ImageAlternative />
        <ExhibitionCard.Dropdown>
          <ExhibitionCard.Dropdown.Edit />
          <ExhibitionCard.Dropdown.Archive />
          <ExhibitionCard.Dropdown.Unpublish />
          <ExhibitionCard.Dropdown.Delete />
        </ExhibitionCard.Dropdown>
      </ExhibitionCard.Header>
      <ExhibitionCard.Content>
        <ExhibitionCard.Title />
        <ExhibitionCard.Date />
        <ExhibitionCard.Description />
      </ExhibitionCard.Content>
    </ExhibitionCard>
  );
};

export const ArchiveCard: React.FC<CardProps> = ({ exhibition }) => {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/${id}`);
  };

  return (
    <ExhibitionCard exhibition={exhibition} onClick={handleClick}>
      <ExhibitionCard.Header>
        <ExhibitionCard.ImageAlternative />
        <ExhibitionCard.Dropdown>
          <ExhibitionCard.Dropdown.View />
          <ExhibitionCard.Dropdown.Edit />
          <ExhibitionCard.Dropdown.Unarchive />
          <ExhibitionCard.Dropdown.Delete />
        </ExhibitionCard.Dropdown>
      </ExhibitionCard.Header>
      <ExhibitionCard.Content>
        <ExhibitionCard.Title />
        <ExhibitionCard.Date />
        <ExhibitionCard.Description />
      </ExhibitionCard.Content>
    </ExhibitionCard>
  );
};

export const VisitorCard: React.FC<CardProps> = ({ exhibition }) => {
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/${id}`);
  };

  return (
    <ExhibitionCard exhibition={exhibition} onClick={handleClick}>
      <ExhibitionCard.ImageAlternative />
      <ExhibitionCard.Content>
        <ExhibitionCard.Title />
        <ExhibitionCard.Date />
        <ExhibitionCard.Description />
      </ExhibitionCard.Content>
    </ExhibitionCard>
  );
};
