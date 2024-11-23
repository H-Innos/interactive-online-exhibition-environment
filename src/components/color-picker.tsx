"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EyeIcon as EyeDropper } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  initialColor?: string;
}

function ColorScale({ onColorSelect }: { onColorSelect: (color: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const drawColorScale = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "rgb(255, 0, 0)");
    gradient.addColorStop(1 / 6, "rgb(255, 255, 0)");
    gradient.addColorStop(2 / 6, "rgb(0, 255, 0)");
    gradient.addColorStop(3 / 6, "rgb(0, 255, 255)");
    gradient.addColorStop(4 / 6, "rgb(0, 0, 255)");
    gradient.addColorStop(5 / 6, "rgb(255, 0, 255)");
    gradient.addColorStop(1, "rgb(255, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bwGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bwGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    bwGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    bwGradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    bwGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.fillStyle = bwGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    drawColorScale();
  }, [drawColorScale]);

  const handleColorPick = useCallback(
    (
      event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      let x: number, y: number;

      if ("touches" in event && event.touches[0]) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
      } else if ("clientX" in event) {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      } else {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imageData = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b] = imageData;
      if (r === undefined || g === undefined || b === undefined) return;
      const color = `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

      onColorSelect(color);
    },
    [onColorSelect]
  );

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleColorPick(event);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleColorPick(event);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    handleColorPick(event);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    handleColorPick(event);
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={150}
      className="cursor-crosshair border border-gray-300"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    />
  );
}

export function ColorPicker({ onColorSelect, initialColor = "#ffffff" }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  useEffect(() => {
    setSelectedColor(initialColor);
  }, [initialColor]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorSelect(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      setSelectedColor(color);
      onColorSelect(color);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-full border border-gray-200"
              style={{ backgroundColor: selectedColor }}
            />
            {selectedColor}
          </div>
          <EyeDropper className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-3">
        <div className="space-y-4">
          <ColorScale onColorSelect={handleColorSelect} />
          <div className="space-y-2">
            <Label htmlFor="custom-color">Custom Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="custom-color"
                type="text"
                value={selectedColor}
                onChange={handleCustomColorChange}
                className="flex-grow"
              />
              <div
                className="h-8 w-8 rounded-full border border-gray-200"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
