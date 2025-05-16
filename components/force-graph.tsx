"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

// Placeholder data for the network graph
const nodes = [
  { id: "Native SOL", group: 1 },
  { id: "Validator A", group: 2 },
  { id: "Validator B", group: 2 },
  { id: "Validator C", group: 2 },
  { id: "LST Provider 1", group: 3 },
  { id: "LST Provider 2", group: 3 },
]

const links = [
  { source: "Native SOL", target: "Validator A", value: 5 },
  { source: "Native SOL", target: "Validator B", value: 3 },
  { source: "Native SOL", target: "Validator C", value: 4 },
  { source: "Validator A", target: "LST Provider 1", value: 2 },
  { source: "Validator B", target: "LST Provider 1", value: 1 },
  { source: "Validator C", target: "LST Provider 2", value: 3 },
  { source: "LST Provider 1", target: "Validator A", value: 1 },
  { source: "LST Provider 2", target: "Validator B", value: 2 },
]

export default function ForceGraph() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

    // Create a force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Define color scale for node groups
    const color = d3.scaleOrdinal().domain([1, 2, 3]).range(["#ff8c00", "#8884d8", "#82ca9d"])

    // Add links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value))
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)

    // Add nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) => color(d.group))
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))

    // Add labels
    const text = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.id)
      .attr("font-size", 12)
      .attr("dx", 15)
      .attr("dy", 4)

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)

      text.attr("x", (d) => d.x).attr("y", (d) => d.y)
    })

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [])

  return <svg ref={svgRef} className="w-full h-full" />
}
