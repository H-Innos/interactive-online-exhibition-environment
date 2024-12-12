"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ContributorForm from "./contributor-form";
import { ExhibitionDataForm } from "~/app/_components/exhibition-data-form";
import type { Exhibition } from "~/lib/types/entities";
import { useTranslation } from "react-i18next";

type ExhibitionTabsProps = {
  exhibition: Exhibition;
  onSave: () => void;
};

const ExhibitionTabs: React.FC<ExhibitionTabsProps> = ({
  exhibition,
  onSave,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="mx-auto w-full max-w-4xl"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">{t("exhibitionDetails")}</TabsTrigger>
        <TabsTrigger value="contributors">
          {t("contributors.contributors")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <ExhibitionDataForm exhibition={exhibition} onSave={onSave} />
      </TabsContent>
      <TabsContent value="contributors">
        <ContributorForm exhibition={exhibition} onSave={onSave} />
      </TabsContent>
    </Tabs>
  );
};

export default ExhibitionTabs;
