"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import PaginationControls from "~/components/pagination-controls";
import type { Exhibition } from "~/lib/types/entities";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "~/components/ui/select";
import { t } from "i18next";

interface PageableExhibitionsProps {
  title: string;
  exhibitions: Exhibition[];
  CardComponent: React.FC<{ exhibition: Exhibition }>;
  FilterComponent: React.ReactNode;
}

const PageableExhibitions = ({
  title,
  exhibitions,
  CardComponent,
  FilterComponent,
}: PageableExhibitionsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
  const exhibitionsPerPage = parseInt(searchParams.get("perPage") ?? "12", 10);

  const indexOfLastExhibition = currentPage * exhibitionsPerPage;
  const indexOfFirstExhibition = indexOfLastExhibition - exhibitionsPerPage;
  const currentExhibitions = exhibitions.slice(
    indexOfFirstExhibition,
    indexOfLastExhibition,
  );
  const totalPages = Math.ceil(exhibitions.length / exhibitionsPerPage);

  const handlePerPageChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("perPage", value);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="mb-10">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-neutral text-2xl font-bold">{title}</h1>
        <div className="flex items-center space-x-2">
          <Select
            value={exhibitionsPerPage.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Exhibitions per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">{t("perPage", { count: 12 })}</SelectItem>
              <SelectItem value="24">{t("perPage", { count: 24 })}</SelectItem>
              <SelectItem value="36">{t("perPage", { count: 36 })}</SelectItem>
              <SelectItem value="48">{t("perPage", { count: 48 })}</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-[180px]">{FilterComponent}</div>
        </div>
      </div>

      <div className="relative">
        <div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-testid="exhibition-list"
        >
          {currentExhibitions.map((exhibition) => (
            <CardComponent key={exhibition.id} exhibition={exhibition} />
          ))}
        </div>
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default PageableExhibitions;
