"use client";

import { useState, useEffect } from "react";

function getDominantColor(imageData: ImageData) {
  const colorMap: Record<string, number> = {};
  let maxCount = 0;
  let dominantColor = "rgb(0,0,0)";

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    if (
      r === undefined ||
      g === undefined ||
      b === undefined ||
      a === undefined
    ) {
      continue;
    }

    // Ignore transparent pixels and very light/dark colors
    if (
      a < 128 ||
      (r > 240 && g > 240 && b > 240) ||
      (r < 15 && g < 15 && b < 15)
    ) {
      continue;
    }

    const rgb = `${r},${g},${b}`;
    colorMap[rgb] = (colorMap[rgb] ?? 0) + 1;

    if (colorMap[rgb] > maxCount) {
      maxCount = colorMap[rgb];
      dominantColor = `rgb(${rgb})`;
    }
  }
  return dominantColor;
}

export function useLogoColor(imageUrl: string | undefined) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const dominantColor = getDominantColor(imageData);
      setColor(dominantColor);
    };
  }, [imageUrl]);

  return color;
}
