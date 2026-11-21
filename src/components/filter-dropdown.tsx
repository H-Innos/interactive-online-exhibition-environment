import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { Exhibition } from "~/lib/types/entities";

interface FilterDropdownProps {
  filterOption: string;
  setFilterOption: (option: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categories: { id: string; name: string }[];
  exhibitions: Exhibition[] | undefined;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterOption,
  setFilterOption,
  selectedCategories,
  setSelectedCategories,
  categories,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] =
    useState(selectedCategories);

  useEffect(() => {
    setTempSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  const handleCategoryToggle = (categoryName: string) => {
    setTempSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName],
    );
  };

  const handleApply = () => {
    setSelectedCategories(tempSelectedCategories);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button data-testid="filter-by-button" variant="outline">
          {t("filter.filterBy")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <div className="p-2">
          <h3 className="mb-2 font-semibold">{t("filter.sortBy")}</h3>
          <DropdownMenuRadioGroup
            value={filterOption}
            onValueChange={setFilterOption}
          >
            <DropdownMenuRadioItem value="updatedDate">
              {t("filter.updatedDate")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="alphabetical">
              {t("filter.alphabetical")}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <h3 className="mb-2 font-semibold">{t("categories")}</h3>
          {categories.map((category) => (
            <div key={category.id} className="mb-2 flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={tempSelectedCategories.includes(category.name)}
                onCheckedChange={() => handleCategoryToggle(category.name)}
                data-testid={`category-checkbox-${category.name}`}
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            data-testid="apply-filter-button"
            onClick={handleApply}
            className="w-full"
          >
            {t("filter.apply")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
