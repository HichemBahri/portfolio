interface BlobProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  opacity?: number;
}

export function Blob({
  className,
  color,
  style,
  opacity,
}: BlobProps) {
  const blobStyle = color
    ? { ...style, backgroundColor: color, opacity }
    : { ...style, opacity };

  return (
    <div
      className={className}
      style={blobStyle}
    />
  );
}