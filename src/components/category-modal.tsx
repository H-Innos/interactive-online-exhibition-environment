import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategories: string[];
  onCategorySelect: (category: string) => void;
  onCategoryDeselect: (category: string) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  onCategorySelect,
  onCategoryDeselect,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [localCategories, setLocalCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const { t } = useTranslation();

  const { data: fetchedCategories = [], refetch } =
    api.category.getAll.useQuery();

  useEffect(() => {
    if (fetchedCategories) {
      setLocalCategories(
        fetchedCategories.map((cat) => ({
          ...cat,
          id: cat.id.toString(),
        })),
      );
    }
  }, [fetchedCategories]);

  if (!isOpen) return null;

  const handleCategoryClick = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryDeselect(category);
    } else {
      onCategorySelect(category);
    }
  };

  const handleAddCategory = async () => {
    if (
      newCategory &&
      !localCategories.some((cat) => cat.name === newCategory)
    ) {
      try {
        onAddCategory(newCategory);
        await refetch();
        setNewCategory("");
        toast.success(`Category "${newCategory}" added successfully`);
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error(
          `Failed to add category "${newCategory}". Please try again.`,
        );
      }
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      onDeleteCategory(categoryName);
      await refetch();
      toast.success(`Category "${categoryName}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        `Failed to delete category "${categoryName}". Please try again.`,
      );
    }
  };

  const filteredCategories = localCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg sm:w-96">
        <button
          data-testid="close-category-modal"
          onClick={onClose}
          className="mb-4 text-right text-gray-600 hover:text-black"
        >
          Close
        </button>
        <input
          type="text"
          placeholder={t("categoryModal.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
        />
        <div className="mb-4 flex">
          <input
            type="text"
            data-testid="new-category-input"
            placeholder={t("categoryModal.newCategoryPlaceholder")}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow rounded border p-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            data-testid="add-category-button"
            onClick={handleAddCategory}
            className="ml-2 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">
            {t("categoryModal.selectedCategories")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="flex cursor-pointer items-center rounded bg-blue-200 px-2 py-1"
              >
                {category}
                <X
                  className="ml-1 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => handleCategoryClick(category)}
                />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">
            {t("categoryModal.availableCategories")}
          </h3>
          <div className="flex flex-wrap gap-2" data-testid="category-list">
            {filteredCategories.map((category) => (
              <span
                key={category.id}
                className={`flex cursor-pointer items-center rounded px-2 py-1 ${
                  selectedCategories.includes(category.name)
                    ? "bg-blue-200"
                    : "bg-gray-200"
                } hover:bg-gray-300`}
                data-testid={`category-item-${category.name}`}
              >
                <span onClick={() => handleCategoryClick(category.name)}>
                  {category.name}
                </span>
                {selectedCategories.includes(category.name) ? (
                  <X
                    className="ml-1 cursor-pointer text-gray-500 hover:text-gray-700"
                    data-testid={`deselect-category-${category.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.name);
                    }}
                  />
                ) : (
                  <X
                    className="ml-1 cursor-pointer text-red-500 hover:text-red-700"
                    data-testid={`delete-category-${category.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDeleteCategory(category.name);
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
