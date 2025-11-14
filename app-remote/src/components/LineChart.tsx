import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LineChart({
  clicksData = [6500, 6418, 6456, 6526, 6356, 6456],
  cpcData = [6456, 6356, 6526, 6332, 6418, 6500],
  categories = ["01 Feb", "02 Feb", "03 Feb", "04 Feb", "05 Feb", "06 Feb"],
  height = 260,
}: {
  clicksData?: number[];
  cpcData?: number[];
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

    const brandColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-fg-brand")
        .trim() || "#1447E6";

    const brandSecondaryColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-fg-brand-subtle")
        .trim() || "#1E90FF";

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

    const allData = [...clicksData, ...cpcData];
    const minY = d3.min(allData)! * 0.95;
    const maxY = d3.max(allData)! * 1.05;
    const y = d3.scaleLinear().domain([minY, maxY]).range([innerH, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const defs = svg.append("defs");
    const gradient1 = defs
      .append("linearGradient")
      .attr("id", "gradientClicks")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    gradient1
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", brandColor)
      .attr("stop-opacity", 0.55);
    gradient1
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", brandColor)
      .attr("stop-opacity", 0);

    const gradient2 = defs
      .append("linearGradient")
      .attr("id", "gradientCPC")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    gradient2
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", brandSecondaryColor)
      .attr("stop-opacity", 0.55);
    gradient2
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", brandSecondaryColor)
      .attr("stop-opacity", 0);

    const area = d3
      .area<number>()
      .x((_, i) => x(i))
      .y0(innerH)
      .y1((d) => y(d))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(clicksData)
      .attr("d", area)
      .attr("fill", "url(#gradientClicks)");
    g.append("path")
      .datum(cpcData)
      .attr("d", area)
      .attr("fill", "url(#gradientCPC)");

    const line = d3
      .line<number>()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(d3.curveMonotoneX);
    g.append("path")
      .datum(clicksData)
      .attr("d", line)
      .attr("stroke", brandColor)
      .attr("stroke-width", 6)
      .attr("fill", "none")
      .attr("stroke-linecap", "round");
    g.append("path")
      .datum(cpcData)
      .attr("d", line)
      .attr("stroke", brandSecondaryColor)
      .attr("stroke-width", 6)
      .attr("fill", "none")
      .attr("stroke-linecap", "round");

    const overlay = g
      .append("rect")
      .attr("width", innerW)
      .attr("height", innerH)
      .attr("fill", "transparent")
      .style("cursor", "crosshair");

    overlay
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        const idx = Math.round(x.invert(mx));
        if (idx < 0 || idx >= categories.length) return;

        tooltip
          .style("display", "block")
          .style("left", `${x(idx) + margin.left + 10}px`)
          .style(
            "top",
            `${y(Math.max(clicksData[idx], cpcData[idx])) + margin.top - 30}px`
          ).html(`
            <div class="text-xs text-gray-400">${categories[idx]}</div>
            <div class="text-sm font-semibold text-indigo-500">Clicks: ${clicksData[idx]}</div>
            <div class="text-sm font-semibold text-green-500">CPC: $${cpcData[idx]}</div>
          `);
      })
      .on("mouseleave", () => {
        tooltip.style("display", "none");
      });
  }, [clicksData, cpcData, categories, height]);

  return (
    <div className="max-w-sm w-full bg-gradient-to-b from-black via-[#0d1a36] to-[#0d1a36] border border-gray-700 rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex justify-between mb-4 md:mb-6">
        <div className="grid gap-4 grid-cols-2">
          <div>
            <h5 className="inline-flex items-center text-gray-400">Clicks</h5>
            <p className="text-white text-2xl font-semibold">42,3k</p>
          </div>
          <div>
            <h5 className="inline-flex items-center text-gray-400">CPC</h5>
            <p className="text-white text-2xl font-semibold">$5.40</p>
          </div>
        </div>
        <div>
          <button className="inline-flex items-center text-gray-300 bg-gray-800 hover:bg-gray-700 font-medium rounded-lg text-sm px-3 py-2">
            Last week
          </button>
        </div>
      </div>
      <div ref={containerRef} className="relative w-full h-[260px]">
        <svg ref={svgRef} className="w-full h-full"></svg>
        <div
          ref={tooltipRef}
          className="absolute z-50 hidden pointer-events-none px-3 py-2 rounded-md shadow-lg text-left
          bg-gray-900/90 border border-gray-700 backdrop-blur"
        />
      </div>
      <div className="items-center border-t border-gray-700 mt-4 md:mt-6 pt-4 md:pt-6">
        <button className="inline-flex items-center text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-3 py-2">
          View full report
        </button>
      </div>
    </div>
  );
}
