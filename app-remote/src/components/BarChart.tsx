import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function RevenueBarChart({
  data = [
    {
      name: "Income",
      values: [1420, 1620, 1820, 1420, 1650, 2120],
      color: "#007A55",
    },
    {
      name: "Expense",
      values: [788, 810, 866, 788, 1100, 1200],
      color: "#C70036",
    },
  ],
  categories = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  height = 280,
}: {
  data?: { name: string; values: number[]; color: string }[];
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
    const margin = { top: 20, right: 10, bottom: 30, left: 50 };
    const innerW = w - margin.left - margin.right;
    const innerH = h - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width", w).attr("height", h);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const y0 = d3
      .scaleBand()
      .domain(categories)
      .range([0, innerH])
      .padding(0.2);
    const y1 = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, y0.bandwidth()])
      .padding(0.05);
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data.flatMap((d) => d.values))! * 1.1])
      .range([0, innerW]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,0)`)
      .call(
        d3
          .axisTop(x)
          .ticks(5)
          .tickFormat((d) => "$" + d)
      )
      .selectAll("text")
      .attr("fill", "white")
      .attr("class", "text-xs");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y0))
      .selectAll("text")
      .attr("fill", "white")
      .attr("class", "text-xs");

    // Bars
    const categoryGroups = g
      .selectAll("g.category")
      .data(categories)
      .join("g")
      .attr("class", "category")
      .attr("transform", (d) => `translate(0,${y0(d)})`);

    categoryGroups
      .selectAll("rect")
      .data((d) =>
        data.map((series) => ({
          key: series.name,
          value: series.values[categories.indexOf(d)],
          color: series.color,
        }))
      )
      .join("rect")
      .attr("y", (d) => y1(d.key)!)
      .attr("x", 0)
      .attr("height", y1.bandwidth())
      .attr("width", (d) => x(d.value))
      .attr("rx", 6)
      .attr("fill", (d) => d.color)
      .on("mousemove", (event, d) => {
        const [mx, my] = d3.pointer(event);
        tooltip
          .style("display", "block")
          .style("left", `${mx + margin.left + 10}px`)
          .style("top", `${my + margin.top - 30}px`)
          .html(
            `<div class="text-sm font-semibold text-white">${d.key}: $${d.value}</div>`
          );
      })
      .on("mouseleave", () => tooltip.style("display", "none"));
  }, [data, categories, height]);

  return (
    <div className="min-w-60 max-w-sm w-full bg-gray-900 border border-gray-700 rounded-2xl shadow p-4 md:p-6">
      <div className="flex justify-between border-b border-gray-700 pb-3">
        <dl>
          <dt className="text-gray-300">Profit</dt>
          <dd className="text-2xl font-semibold text-white">$5,405</dd>
        </dl>
        <div>
          <span className="inline-flex items-center bg-green-900 border border-green-700 text-green-400 text-xs font-medium px-1.5 py-0.5 rounded">
            <svg
              className="w-4 h-4 me-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v13m0-13 4 4m-4-4-4 4"
              />
            </svg>
            Profit rate 23.5%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 py-3">
        <dl>
          <dt className="text-gray-300">Income</dt>
          <dd className="text-lg font-semibold text-green-500">$23,635</dd>
        </dl>
        <dl>
          <dt className="text-gray-300">Expense</dt>
          <dd className="text-lg font-semibold text-red-500">-$18,230</dd>
        </dl>
      </div>

      <div ref={containerRef} className="relative w-full h-[280px]">
        <svg ref={svgRef} className="w-full h-full"></svg>
        <div
          ref={tooltipRef}
          className="absolute z-50 hidden pointer-events-none px-3 py-2 rounded-md shadow-lg text-left bg-gray-800/90 border border-gray-700 text-white"
        />
      </div>
    </div>
  );
}
