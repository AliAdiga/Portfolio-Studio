import { ImageResponse } from "next/og";
import { getProject, projects } from "@/content/projects";

export const alt = "Scroll & Serif case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  const name = p?.name ?? "Case study";
  const colors = p?.palette ?? [{ name: "Plum", hex: "#674350" }];
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
        <div style={{ fontSize: 34, display: "flex" }}>Scroll &amp; Serif / Case study</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 128, lineHeight: 1, letterSpacing: -3 }}>{name}</span>
          <span style={{ fontSize: 40, marginTop: 20, fontFamily: "sans-serif", color: "#57514b" }}>{p?.category}</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {colors.map((c) => (
            <div key={c.hex} style={{ width: 120, height: 36, borderRadius: 18, background: c.hex, border: "2px solid #24211F33" }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
