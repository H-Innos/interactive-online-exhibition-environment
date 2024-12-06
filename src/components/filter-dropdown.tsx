import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectGroup,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { ChevronRight } from "lucide-react";

interface FilterDropdownProps {
  filterOption: string;
  setFilterOption: (option: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categories: { id: string; name: string }[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterOption,
  setFilterOption,
  selectedCategories,
  setSelectedCategories,
  categories,
}) => {
  const { t } = useTranslation();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleFilterChange = (value: string) => {
    setFilterOption(value);
    if (value !== "category") {
      setSelectedCategories([]);
    }
  };

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName],
    );
  };

  return (
    <div className="relative">
      <Select value={filterOption} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("filter")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="publishedDate">
              {t("filterOptions.publishedDate")}
            </SelectItem>
            <SelectItem value="alphabetical">
              {t("filterOptions.alphabetical")}
            </SelectItem>
            <SelectItem
              value="category"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <div className="flex w-full items-center justify-between">
                {t("filterOptions.category")}
                <ChevronRight className="h-4 w-4" />
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {isCategoryOpen && (
        <div
          className="absolute left-full top-0 z-10 w-48 rounded-md border bg-white p-2 shadow-md"
          onMouseEnter={() => setIsCategoryOpen(true)}
          onMouseLeave={() => setIsCategoryOpen(false)}
        >
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2 py-1">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => handleCategoryToggle(category.name)}
              />
              <label htmlFor={category.id} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
