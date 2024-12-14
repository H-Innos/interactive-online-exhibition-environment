"use client";

import React, { useContext, type PropsWithChildren } from "react";
import Image from "next/image";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { cn } from "~/lib/utils";
import type { Exhibition } from "~/lib/types/entities";
import { configurations } from "~/lib/constants/config";
import { formatDate } from "~/lib/utils/formatter";
import { ExhibitionActionsDropdown } from "./exhibition-actions-dropdown";
import { ErrorBoundary } from "react-error-boundary";

type ExhibitionCardContext = {
  exhibition: Exhibition;
};

export const ExhibitionCardContext = React.createContext<
  ExhibitionCardContext | undefined
>(undefined);

export function useExhibitionCardContext() {
  const context = useContext(ExhibitionCardContext);
  if (context === undefined) {
    throw new Error(
      "useExhibitionCardContext must be used within ExhibitionCard",
    );
  }
  return context;
}

type ExhibitionCardProps = PropsWithChildren & {
  exhibition: Exhibition;
  onClick?: (id: number) => void;
  className?: string;
};

const ExhibitionCard = ({
  exhibition,
  onClick,
  className,
  children,
}: ExhibitionCardProps) => {
  const handleClick = () => {
    onClick?.(exhibition.id);
  };

  return (
    <ExhibitionCardContext.Provider value={{ exhibition }}>
      <ErrorBoundary fallback={<div>Error loading exhibition.</div>}>
        <div
          className={cn(
            "group relative max-w-sm cursor-pointer overflow-hidden bg-card text-card-foreground shadow-lg transition-shadow hover:shadow-xl",
            className,
          )}
          onClick={handleClick}
          data-testid="exhibition-card"
        >
          {children}
        </div>
      </ErrorBoundary>
    </ExhibitionCardContext.Provider>
  );
};

type DefaultProps = Partial<
  PropsWithChildren &
    Pick<React.HtmlHTMLAttributes<HTMLDivElement>, "className">
>;

ExhibitionCard.Description = function ExhibitionCardDescription({
  className,
}: DefaultProps) {
  const { exhibition } = useExhibitionCardContext();
  return (
    <p className={cn("break-words text-sm text-foreground", className)}>
      {exhibition.description}
    </p>
  );
};

ExhibitionCard.Date = function ExhibitionCardDate({ className }: DefaultProps) {
  const { exhibition } = useExhibitionCardContext();
  return (
    <p
      className={cn(
        "break-words pb-2 text-sm text-foreground text-gray-500",
        className,
      )}
    >
      {formatDate(exhibition.updatedAt)}
    </p>
  );
};

ExhibitionCard.Title = function ExhibitionCardTitle({
  className,
}: DefaultProps) {
  const { exhibition } = useExhibitionCardContext();
  return (
    <h2 className={cn("break-words text-xl font-bold", className)}>
      {exhibition.name}
    </h2>
  );
};

ExhibitionCard.Header = function ExhibitionCardHeader({
  children,
  className,
}: DefaultProps) {
  return <div className={cn("relative", className)}>{children}</div>;
};

ExhibitionCard.Content = function ExhibitionCardContent({
  children,
  className,
}: DefaultProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
};

ExhibitionCard.ImageAlternative = function ExhibitionImageAlternative() {
  const { exhibition } = useExhibitionCardContext();

  return (
    <Image
      src={exhibition.thumbnailUrl ?? configurations.DEFAULT_COVER_IMAGE_URL}
      alt={exhibition.name || "Thumbnail"}
      width={400}
      height={200}
      className="h-48 w-full object-cover"
    />
  );
};

ExhibitionCard.Thumbnail = function ExhibitionCardThumbnail() {
  const { exhibition } = useExhibitionCardContext();
  return (
    <AspectRatio ratio={16 / 9}>
      <Image
        src={exhibition.thumbnailUrl ?? configurations.DEFAULT_COVER_IMAGE_URL}
        alt={exhibition.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </AspectRatio>
  );
};

ExhibitionCard.Dropdown = ExhibitionActionsDropdown;

export { ExhibitionCard };
