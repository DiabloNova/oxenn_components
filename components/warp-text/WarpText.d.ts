import type { CSSProperties, ReactElement } from "react";

export interface WarpTextProps {
  text?: string;
  color?: string;
  warpStrength?: number;
  warpScale?: number;
  speed?: number;
  pointerInfluence?: number;
  pointerStrength?: number;
  refraction?: number;
  chromatic?: number;
  ripple?: boolean;
  clickRipple?: boolean;
  idleDrift?: number;
  lens?: "bulge" | "pinch" | "swirl";
  intro?: boolean;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  letterSpacing?: number | string;
  lineHeight?: number | string;
  className?: string;
  style?: CSSProperties;
}

declare function WarpText(props: WarpTextProps): ReactElement;

export default WarpText;
