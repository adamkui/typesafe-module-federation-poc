import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function AreaChart({
  data = [6500, 6418, 6456, 6526, 6356, 6456],
  categories = [
    "01 February",
    "02 February",
    "03 February",
    "04 February",
    "05 February",
    "06 February",
  ],
  height = 260,
}: {
  data?: number[];
  categories?: string[];
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    const w = container.clientWidth;
    const h = height;

    svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width", w).attr("height", h);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerW = w - margin.left - margin.right;
    const innerH = h - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, categories.length - 1])
      .range([0, innerW]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(data)! * 0.98, d3.max(data)! * 1.02])
      .range([innerH, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "darkGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4f46e5") // színes kiemelés
      .attr("stop-opacity", 0.55);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4f46e5")
      .attr("stop-opacity", 0);

    const area = d3
      .area<number>()
      .x((_, i) => x(i))
      .y0(innerH)
      .y1((d) => y(d))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", "url(#darkGradient)");

    const line = d3
      .line<number>()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("d", line)
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 6)
      .attr("fill", "none")
      .attr("stroke-linecap", "round");

    // Hover interactions
    const overlay = g
      .append("rect")
      .attr("width", innerW)
      .attr("height", innerH)
      .attr("fill", "transparent")
      .style("cursor", "crosshair");

    overlay
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        const x0 = x.invert(mx);
        const idx = Math.round(x0);

        if (idx < 0 || idx >= data.length) return;

        const value = data[idx];
        const cx = x(idx) + margin.left;
        const cy = y(value) + margin.top;

        tooltip
          .style("display", "block")
          .style("left", `${cx + 10}px`)
          .style("top", `${cy - 30}px`).html(`
            <div class="text-xs text-gray-400">${categories[idx]}</div>
            <div class="text-sm font-semibold text-white">${value}</div>
          `);
      })
      .on("mouseleave", () => {
        tooltip.style("display", "none");
      });
  }, [data, categories, height]);

  return (
    <div className="max-w-sm w-full bg-gradient-to-b from-black via-[#0d1a36] to-[#0d1a36] border border-gray-700 rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex justify-between items-start">
        <div>
          <h5 className="text-2xl font-semibold text-white">32.4k</h5>
          <p className="text-gray-400">Users this week</p>
        </div>
        <div className="flex items-center px-2.5 py-0.5 font-medium text-green-500 text-center">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v13m0-13 4 4m-4-4-4 4"
            />
          </svg>
          12%
        </div>
      </div>
      <div ref={containerRef} className="relative w-full h-[260px]">
        <svg ref={svgRef} className="w-full h-full"></svg>
        <div
          ref={tooltipRef}
          className="
          absolute z-50 hidden pointer-events-none px-3 py-2 rounded-md shadow-lg text-left
          bg-gray-900/90 border border-gray-700 backdrop-blur
        "
        />
      </div>

      <div className="grid grid-cols-1 items-center border-t border-gray-200 mt-4 pt-4">
        <div className="flex justify-between items-center">
          <button
            className="text-sm font-medium text-gray-300 hover:text-gray-900 inline-flex items-center"
            type="button"
          >
            Last 7 days
            <svg
              className="w-4 h-4 ms-1.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 9-7 7-7-7"
              />
            </svg>
          </button>

          <a
            href="#"
            className="inline-flex items-center text-indigo-400 bg-transparent border border-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded text-sm px-3 py-2"
          >
            Users Report
            <svg
              className="w-4 h-4 ms-1.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 12H5m14 0-4 4m4-4-4-4"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
