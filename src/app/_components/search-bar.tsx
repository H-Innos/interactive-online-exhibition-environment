import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="mx-auto w-full max-w-xs px-4 sm:max-w-sm md:max-w-md lg:max-w-lg">
      <input
        type="text"
        placeholder="Search exhibitions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
