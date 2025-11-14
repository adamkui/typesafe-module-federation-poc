import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PieChart({
  data = [
    { label: "Direct", value: 52.8, color: "#1447E6" },
    { label: "Organic search", value: 26.8, color: "#4F46E5" },
    { label: "Referrals", value: 20.4, color: "#22C55E" },
  ],
  height = 280,
}: {
  data?: { label: string; value: number; color: string }[];
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    const w = containerRef.current.clientWidth;
    const h = height;
    const radius = Math.min(w, h) / 2;

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width", w).attr("height", h);

    const g = svg.append("g").attr("transform", `translate(${w / 2},${h / 2})`);

    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius - 10);

    const arcs = g
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      // @ts-ignore
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#1f2937") // Tailwind dark: neutral-primary
      .attr("stroke-width", 2)
      .on("mousemove", (event, d) => {
        const [mx, my] = d3.pointer(event);
        tooltip
          .style("display", "block")
          .style("left", `${mx + w / 2 + 10}px`)
          .style("top", `${my + h / 2 - 30}px`)
          .html(
            `<div class="text-sm font-semibold text-white">${d.data.label}: ${d.data.value}%</div>`
          );
      })
      .on("mouseleave", () => tooltip.style("display", "none"));

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${w / 2 - 60},${h - 30})`);

    data.forEach((d, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);
      legendRow
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d.color);
      legendRow
        .append("text")
        .text(d.label)
        .attr("x", 16)
        .attr("y", 10)
        .attr("fill", "white")
        .attr("class", "text-xs font-normal");
    });
  }, [data, height]);

  return (
    <div className="min-w-60 max-w-sm w-full bg-gray-900 border border-gray-700 rounded-2xl shadow p-4 md:p-6">
      <div className="flex justify-between items-start w-full">
        <div className="flex-col items-center">
          <div className="flex items-center mb-1">
            <h5 className="text-xl font-semibold text-white me-1">
              Website traffic
            </h5>
            {/* Info icon could be added here */}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full h-[280px] py-6">
        <svg ref={svgRef} className="w-full h-full"></svg>
        <div
          ref={tooltipRef}
          className="absolute z-50 hidden pointer-events-none px-3 py-2 rounded-md shadow-lg bg-gray-800/90 border border-gray-700 text-white"
        />
      </div>
    </div>
  );
}
