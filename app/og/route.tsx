import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? "_hichem_bahri";
  const firaCodeRegular = await fetch(
    "https://cdn.jsdelivr.net/gh/tonsky/FiraCode@6.2/distr/ttf/FiraCode-Regular.ttf"
  ).then((res) => res.arrayBuffer());
  const firaCodeBold = await fetch(
    "https://cdn.jsdelivr.net/gh/tonsky/FiraCode@6.2/distr/ttf/FiraCode-Bold.ttf"
  ).then((res) => res.arrayBuffer());

  const logoSvg = (
    <svg width="164" height="136" viewBox="0 0 82 68" fill="none">
      <path d="M12 16L6.5 34L12 52L5.5 52L0 34L5.5 16L12 16Z" fill="url(#g3)" />
      <path d="M70 16L75.5 34L70 52L76.5 52L82 34L76.5 16L70 16Z" fill="url(#g4)" />
      <rect x="21" y="0" width="10" height="68" fill="url(#g0)" />
      <rect x="51" y="0" width="10" height="68" fill="url(#g1)" />
      <rect x="31" y="29" width="20" height="10" fill="url(#g2)" />
      <defs>
        <linearGradient id="g0" x1="26" y1="0" x2="26" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38F8F8" />
          <stop offset="1" stopColor="#218ADB" />
        </linearGradient>
        <linearGradient id="g1" x1="56" y1="0" x2="56" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38F8F8" />
          <stop offset="1" stopColor="#218ADB" />
        </linearGradient>
        <linearGradient id="g2" x1="41" y1="29" x2="41" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38F8F8" />
          <stop offset="1" stopColor="#218ADB" />
        </linearGradient>
        <linearGradient id="g3" x1="6" y1="16" x2="6" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38F8F8" />
          <stop offset="1" stopColor="#218ADB" />
        </linearGradient>
        <linearGradient id="g4" x1="76" y1="16" x2="76" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38F8F8" />
          <stop offset="1" stopColor="#218ADB" />
        </linearGradient>
      </defs>
    </svg>
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172b",
          color: "#f8fafc",
          fontFamily: '"Fira Code"',
          gap: "20px",
        }}
      >
        {logoSvg}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "48px",
          }}
        >
          <span style={{ color: "#615fff", fontWeight: "bold" }}>
            ~/{title}
          </span>
          <span style={{ color: "#90a1b9" }}>❯</span>
          <span style={{ color: "#f8fafc" }}>_hichem_bahri</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Fira Code",
          data: firaCodeRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Fira Code",
          data: firaCodeBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}