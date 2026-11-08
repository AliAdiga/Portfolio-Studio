import { ImageResponse } from "next/og";

export const alt = "Scroll & Serif: distinctive websites by Ali Tsai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F4EFE7",
          color: "#24211F",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 40, display: "flex", gap: 12 }}>
          <span>Scroll</span>
          <span style={{ color: "#674350", fontStyle: "italic" }}>&amp;</span>
          <span>Serif</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, lineHeight: 1.02, letterSpacing: -3 }}>
          <span>Distinctive websites.</span>
          <span style={{ color: "#674350", fontStyle: "italic" }}>Thoughtfully built.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontFamily: "sans-serif" }}>
          <span>Ali Tsai, designer and developer</span>
          <span>Amman, Jordan</span>
        </div>
      </div>
    ),
    size,
  );
}
