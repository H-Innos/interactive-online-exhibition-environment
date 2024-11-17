import React from 'react';

interface SearchBarProps {
value: string;
onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
return (
<div className="w-full max-w-md">
    <input
    type="text"
    placeholder="Search exhibitions..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
</div>
);
};

export default SearchBar;