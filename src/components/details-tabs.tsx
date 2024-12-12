"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ContributorForm from "./contributor-form";
import { ExhibitionDataForm } from "~/app/_components/exhibition-data-form";
import type { Exhibition } from "~/lib/types/entities";

type ExhibitionTabsProps = {
  exhibition: Exhibition;
};

const ExhibitionTabs: React.FC<ExhibitionTabsProps> = ({ exhibition }) => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="mx-auto w-full max-w-4xl"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Exhibition Details</TabsTrigger>
        <TabsTrigger value="contributors">Contributors</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <ExhibitionDataForm exhibition={exhibition} />
      </TabsContent>
      <TabsContent value="contributors">
        <ContributorForm exhibition={exhibition} />
      </TabsContent>
    </Tabs>
  );
};

export default ExhibitionTabs;
