"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { cn } from "~/lib/utils";
import { AsciiDonut } from "./ascii-donut";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  placeholder?: "empty";
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
  /** Classes for the donut loader wrapper, e.g. to scale it to a small box */
  loaderClassName?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  placeholder = "empty",
  sizes,
  quality = 75,
  onLoad,
  onError,
  loaderClassName,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Create optimized image URL
  const optimizedSrc = useMemo(() => {
    if (src.startsWith("/images/")) {
      const params = new URLSearchParams();
      if (width) params.set("w", width.toString());
      if (height) params.set("h", height.toString());
      params.set("q", quality.toString());
      params.set("f", "webp");

      const queryString = params.toString();
      return queryString
        ? `/api/images${src}?${queryString}`
        : `/api/images${src}`;
    }
    return src;
  }, [src, width, height, quality]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (error: any) => {
    console.error("Image load error:", optimizedSrc, error);
    setHasError(true);
    onError?.();
  };

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-card text-muted-foreground flex items-center justify-center",
          className,
        )}
        style={fill ? {} : { width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  if (fill) {
    return (
      <>
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          placeholder={placeholder}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          sizes={sizes}
          quality={quality}
          onLoad={handleLoad}
          onError={handleError}
        />

        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="bg-card absolute inset-0 flex items-center justify-center">
            <div className={loaderClassName}>
              <AsciiDonut />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
        placeholder={placeholder}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        sizes={sizes}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="bg-card absolute inset-0 flex items-center justify-center">
          <div className="scale-75">
            <AsciiDonut />
          </div>
        </div>
      )}
    </div>
  );
}
