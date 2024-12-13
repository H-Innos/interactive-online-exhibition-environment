"use client";

import Image from "next/image";
import { VisitorCard } from "~/components/ExhibitionCard/cards";
import NavBar from "~/components/navbar";
import type { Exhibition } from "~/lib/types/entities";

const MainPage = ({}) => {
  const featuredExhibition: Exhibition[] = [];

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
            University of Tartu Library exhibitions
          </h2>
        </div>
      </div>
      <div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        data-testid="exhibition-list"
      >
        {featuredExhibition.map((exhibition) => (
          <VisitorCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>
    </>
  );
};

export default MainPage;
