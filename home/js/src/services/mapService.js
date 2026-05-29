export async function drawWorldMap(container) {
  if (!window.d3 || !window.topojson) return { projection: null, w: 0, h: 0 };
  const d3 = window.d3,
    topojson = window.topojson;
  const rect = container.getBoundingClientRect();
  const w = rect.width || 960,
    h = rect.height || 520;
  const isDark = document.documentElement.dataset.theme === "dark";

  let world;
  try {
    world = await d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
    );
  } catch {
    return { projection: null, w, h };
  }

  const projection = d3.geoNaturalEarth1().fitSize([w, h], { type: "Sphere" });
  const path = d3.geoPath(projection);

  const svg = d3
    .create("svg")
    .attr("class", "world-map-bg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${w} ${h}`)
    .attr("preserveAspectRatio", "xMidYMid slice")
    .style("position", "absolute")
    .style("inset", "0")
    .style("pointer-events", "none")
    .style("transform-origin", "0 0");

  svg
    .append("rect")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", isDark ? "#0d1b2a" : "#d6eaf8");
  svg
    .append("path")
    .datum({ type: "Sphere" })
    .attr("d", path)
    .attr("fill", isDark ? "#0d1b2a" : "#d6eaf8");
  svg
    .append("path")
    .datum(d3.geoGraticule()())
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)")
    .attr("stroke-width", 0.5);
  svg
    .append("path")
    .datum(topojson.feature(world, world.objects.countries))
    .attr("d", path)
    .attr("fill", isDark ? "#16291a" : "#c5dbb8")
    .attr("stroke", isDark ? "#1e3820" : "#9abf8a")
    .attr("stroke-width", 0.4);
  svg
    .append("path")
    .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", isDark ? "#243d26" : "#7dab6d")
    .attr("stroke-width", 0.3);

  container.prepend(svg.node());
  return { projection, w, h };
}
