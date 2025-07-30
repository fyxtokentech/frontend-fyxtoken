import React from "react";
import { DriverComponent } from "../tools/index.js";

const driverSvgFilter = DriverComponent({
  idDriver: "svg-camaleon",
  svgFilterList: {
    isArray: true,
    getComponent({ getValue }) {
      return getValue().map(({ body, ...props }, i) => {
        return (
          <filter key={"svg-filter-" + i} {...props}>
            {body.map(({ type, ...propsBody }, j) =>
              ({
                feConvolveMatrix: () => (
                  <feConvolveMatrix
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feImage: () => (
                  <feImage
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feDisplacementMap: () => (
                  <feDisplacementMap
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feGaussianBlur: () => (
                  <feGaussianBlur
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feMerge: () => (
                  <feMerge
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feMergeNode: () => (
                  <feMergeNode
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feSpecularLighting: () => (
                  <feSpecularLighting
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feBlend: () => (
                  <feBlend
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feColorMatrix: () => (
                  <feColorMatrix
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feComponentTransfer: () => (
                  <feComponentTransfer
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feComposite: () => (
                  <feComposite
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feDiffuseLighting: () => (
                  <feDiffuseLighting
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feDropShadow: () => (
                  <feDropShadow
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feFlood: () => (
                  <feFlood
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feFuncA: () => (
                  <feFuncA
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feFuncB: () => (
                  <feFuncB
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feFuncG: () => (
                  <feFuncG
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feFuncR: () => (
                  <feFuncR
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feMorphology: () => (
                  <feMorphology
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feOffset: () => (
                  <feOffset
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
                feTile: () => (
                  <feTile key={"svg-subfilter-" + i + "-" + j} {...propsBody} />
                ),
                feTurbulence: () => (
                  <feTurbulence
                    key={"svg-subfilter-" + i + "-" + j}
                    {...propsBody}
                  />
                ),
              }[type]?.())
            )}
          </filter>
        );
      });
    },
  },
});

export function escapeSVGString({ width = 800, height = 600, viewBox, body }) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
     <svg 
       width="${width}" 
       height="${height}" 
       ${viewBox ? `viewBox="${viewBox}"` : ""} 
       xmlns="http://www.w3.org/2000/svg" 
       xmlns:xlink="http://www.w3.org/1999/xlink"
     >
     ${body}
     </svg>
 `)}`.replace(/\s/g, "");
}

export function AddSVGFilter(props) {
  if (typeof props == "function") {
    props = props({ escapeSVGString });
  }
  const existsFilters = props.filter((filter) =>
    driverSvgFilter.getSvgFilterList().find((x) => x.id === filter.id)
  );
  const newFilters = props.filter(
    (filter) => !existsFilters.find((x) => x.id === filter.id)
  );
  driverSvgFilter.setSvgFilterList([...existsFilters, ...newFilters]);
}

export class SVGDefs extends React.Component {
  componentDidMount() {
    driverSvgFilter.addLinkSvgFilterList(this);
  }

  componentWillUnmount() {
    driverSvgFilter.removeLinkSvgFilterList(this);
  }

  render() {
    return (
      <svg
        id="svg-defs"
        className="d-none"
        width="0"
        height="0"
        viewBox="0 0 0 0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>{driverSvgFilter.getComponentSvgFilterList()}</defs>
      </svg>
    );
  }
}
