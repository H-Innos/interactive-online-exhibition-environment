import React, { useState } from "react";
import { X } from "lucide-react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategories: string[];
  onCategorySelect: (category: string) => void;
  onCategoryDeselect: (category: string) => void;
  onAddCategory: (category: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  onCategorySelect,
  onCategoryDeselect,
  onAddCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");

  if (!isOpen) return null;

  const handleCategoryClick = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryDeselect(category);
    } else {
      onCategorySelect(category);
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      onAddCategory(newCategory);
      setNewCategory("");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-4 shadow-lg">
        <button onClick={onClose} className="mb-4 text-right">
          Close
        </button>
        <input
          type="text"
          placeholder="Search categories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full rounded border p-2"
        />
        <div className="mb-4 flex">
          <input
            type="text"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow rounded border p-2"
          />
          <button
            onClick={handleAddCategory}
            className="ml-2 rounded bg-blue-500 p-2 text-white"
          >
            Add
          </button>
        </div>
        <div className="mb-4">
          <h3 className="mb-2">Selected Categories</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="flex cursor-pointer items-center rounded bg-blue-200 px-2 py-1"
              >
                {category}
                <X
                  className="ml-1 cursor-pointer text-red-500"
                  onClick={() => handleCategoryClick(category)}
                />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2">Available Categories</h3>
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((category) => (
              <span
                key={category}
                className={`cursor-pointer rounded px-2 py-1 ${
                  selectedCategories.includes(category)
                    ? "bg-blue-200"
                    : "bg-gray-200"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
