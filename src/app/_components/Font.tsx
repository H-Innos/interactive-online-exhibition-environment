import React, { useState } from "react";
import { createReactStyleSpec } from "@blocknote/react";

export const Font = createReactStyleSpec(
  {
    type: "font",
    propSchema: "string",
  },
  {
    render: (props) => (
      <span style={{ fontFamily: props.value }} ref={props.contentRef} />
    ),
  },
);

type FontSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectFont: (font: string) => void;
};

export const FontSelectorModal: React.FC<FontSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectFont,
}) => {
  const [selectedFont, setSelectedFont] = useState("");
  if (!isOpen) return null;

  const fontOptions = [
    "Arial",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Comic Sans MS",
    "Georgia",
    "Garamond",
    "Courier New",
    "Brush Script MT",
  ];

  return (
    <div
      style={{ zIndex: 10000 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75"
    >
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-gray-800">Select Font</h3>
        <form className="mb-4">
          {fontOptions.map((font) => (
            <label
              key={font}
              style={{ fontFamily: font }}
              className="mb-2 block cursor-pointer text-gray-700"
            >
              <input
                type="radio"
                name="font"
                value={font}
                checked={selectedFont === font}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="mr-2"
              />
              {font}
            </label>
          ))}
        </form>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              onSelectFont(selectedFont);
              setSelectedFont("");
            }}
            className="rounded-md bg-primary-dark px-4 py-2 text-white hover:bg-primary-dark_hover"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
