import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9f9f7",
          color: "#000000",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 300,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          AM
        </div>
        <div
          style={{
            width: 48,
            height: 1,
            background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
