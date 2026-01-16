"use client";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScrolling({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactLenis root options={{ lerp: 0.07, duration: 3 }}>
      {children}
    </ReactLenis>
  );
}
