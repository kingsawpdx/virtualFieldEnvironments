import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

// SVG Path from https://github.com/mistic100/Photo-Sphere-Viewer/blob/5.7.4/packages/virtual-tour-plugin/src/arrow.svg?short_path=250fbf4
const arrowIconPath = `M50,50 m45,0
a45,45 0 1,0 -90,0
a45,45 0 1,0  90,0

M50,50 m38,0
a38,38 0 0,1 -76,0
a38,38 0 0,1  76,0

M50,50 m30,0
a30,30 0 1,0 -60,0
a30,30 0 1,0  60,0

M50,40 m2.5,-2.5
l17.5,17.5
a 2.5,2.5 0 0 1 -5,5
l-15,-15
l-15,15
a 2.5,2.5 0 0 1 -5,-5
l17.5,-17.5
a 3.5,3.5 0 0 1 5,0`;

export interface LinkArrowIconProps {
  color?: string;
  size: number;
}

export function LinkArrowIcon({ color, size }: LinkArrowIconProps) {
  return (
    <svg viewBox="0 0 100 100" fill={color} width={size} height={size}>
      <path d={arrowIconPath} />
    </svg>
  );
}

export function LinkArrowIconHTML(props: LinkArrowIconProps) {
  // Renders the component to HTML without using renderToString (which would greatly increase bundle sizes).
  // https://react.dev/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code

  const div = document.createElement("div");
  const root = createRoot(div);
  flushSync(() => {
    root.render(<LinkArrowIcon {...props} />);
  });
  return div.innerHTML;
}
