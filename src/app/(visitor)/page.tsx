"use client";

import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CardSkeleton, VisitorCard } from "~/components/ExhibitionCard/cards";
import NavBar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { isEmpty } from "~/lib/utils/helpers";
import { api } from "~/trpc/react";

const MainPage = ({}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: featuredExhibitions } = api.exhibition.getFeatured.useQuery();

  return (
    <>
      <NavBar />
      <div className="relative mt-4 h-96 w-full overflow-hidden">
        <Image
          src="/logos/raamatukogu_fassaad.jpg"
          alt="Raamatukogu Fassaad"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h2 className="px-4 text-center text-4xl font-bold text-white">
            {t("pageTitle")}
          </h2>
        </div>
        <div className="absolute bottom-8 left-12">
          <Button
            variant="ghost"
            onClick={() => router.push("/all")}
            className="border border-white text-white"
          >
            {t("allExhibitions")} <ArrowRightIcon />
          </Button>
        </div>
      </div>

      <div className="flex w-full justify-center p-12">
        <div className="max-w-screen-xxl grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isEmpty(featuredExhibitions)
            ? Array.from({ length: 4 }, (_, index) => (
                <CardSkeleton key={index} />
              ))
            : featuredExhibitions?.map((exhibition) => (
                <VisitorCard key={exhibition.id} exhibition={exhibition} />
              ))}
        </div>
      </div>
    </>
  );
};

export default MainPage;
