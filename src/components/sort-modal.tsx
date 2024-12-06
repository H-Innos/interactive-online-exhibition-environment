import React from "react";
import { useTranslation } from "react-i18next";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

interface SortModalProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const SortModal: React.FC<SortModalProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const { t } = useTranslation();
  const { data: categories, isLoading } = api.category.getAll.useQuery();

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline">{t("sort.button")}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-lg font-bold">
            {t("sort.title")}
          </Dialog.Title>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id.toString()}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={(checked) => {
                      setSelectedCategories(
                        checked
                          ? [...selectedCategories, category.name]
                          : selectedCategories.filter(
                              (c) => c !== category.name,
                            ),
                      );
                    }}
                  />
                  <Label htmlFor={category.id.toString()}>
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Dialog.Close asChild>
            <Button className="mt-4">{t("close")}</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SortModal;
