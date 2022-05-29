import * as d3 from "d3";
import React from "react";
import VisaulisationWrapper from "../ui_components/visualisationWrapper/visualisationWrapper";

//code reference => Basic bubble plot in d3.js. (n.d.). Retrieved May 19, 2022, from https://d3-graph-gallery.com/graph/bubble_legend.html
function appendAxis(axis, svg, x, y) {
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + x + "," + y + ")")
    .call(axis)
    .selectAll("text")
    .classed("tick-text", true)
    .selectAll("tspan")
    .data((d) => splitLabel(d)) // Returns two vals
    .enter()
    .append("tspan")
    .attr("x", 0)
    .attr("dy", function (d, i) {
      return i + 20 + "px";
    })
    .text(String);
}

function splitLabel(label) {
  const split = [
    ["Very", "dissatisfied"],
    ["Slightly", "dissatisfied"],
    ["Neither satisfied", "nor dissatisfied"],
    ["Slightly", "satisfied"],
    ["Very", "satisfied"],
  ];
  return split[label];
}

function getLegendValues(min, max, maximumLegendValue) {
  console.log("min-max", min, max);
  const logScale = d3.scaleLog();
  let minVal = transformLegendValue(min, Math.floor);
  let maxVal = transformLegendValue(max, Math.round);
  if (maxVal > maximumLegendValue) {
    maxVal = transformLegendValue(maximumLegendValue, Math.floor);
    if (maxVal < minVal) {
      minVal = maxVal;
    }
  }
  if (maxVal - minVal > 10) {
    const med = minVal + (maxVal - minVal) / 2;
    const medVal = transformLegendValue(med, Math.round);
    return [minVal, medVal, maxVal];
  } else {
    if (minVal === maxVal) {
      return maxVal === 1 ? [1] : [1, maxVal];
    }
    return [minVal, maxVal];
  }
}

function transformLegendValue(value, f) {
  if (value === 0) {
    return 1;
  }
  const logScale = d3.scaleLog();
  const scaleNum = 10 ** Math.floor(logScale(value));
  return f(value / scaleNum) * scaleNum;
}

const SatisfactionVisualisation = ({ countrySatisfactionObj }) => {
  console.log(typeof countrySatisfactionObj, countrySatisfactionObj);
  const ref = React.useRef();
  React.useEffect(() => {
    var margin = { top: 10, right: 30, bottom: 30, left: 120 },
      width = 1200 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let dataset = [];
    const levels = [
      "Very dissatisfied",
      "Slightly dissatisfied",
      "Neither satisfied nor dissatisfied",
      "Slightly satisfied",
      "Very satisfied",
    ];
    for (const level of levels) {
      dataset.push({
        satisfactionLevel: level,
        count: countrySatisfactionObj.hasOwnProperty(level)
          ? countrySatisfactionObj[level]
          : 0,
      });
    }

    console.log(dataset);
    const totalCount = dataset.reduce((prev, cur) => prev + cur.count, 0);
    const h = 500;
    const w = 1000;

    const g = svg
      .append("g")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${w} ${h}`)
      .classed("svg-content", true);
    const xPadding = 25;
    const yPadding = 50;
    const maxRadius = 40;
    const legendPadding = 78; // Radius of legend
    const xScale = d3
      .scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([xPadding, w - xPadding - legendPadding])
      .paddingOuter(0.1)
      .paddingInner(0.1);
    const areaScale = d3
      .scaleSqrt()
      .domain([0, d3.max(dataset, (d) => d.count)])
      .range([0, xScale.bandwidth() / 2]);
    const xAxis = d3.axisBottom(xScale).tickFormat((i) => "");
    console.log("bw", xScale.bandwidth());
    // Add bubbles
    g.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("cy", h / 2)
      .attr("r", (d) => areaScale(d.count))
      .attr("fill", "grey");
    // .attr("stroke", "black")
    appendAxis(xAxis, g, 0, (h + xScale.bandwidth()) / 2 + 50);
    const legendValues = getLegendValues(
      d3.min(dataset, (d) => d.count),
      d3.max(dataset, (d) => d.count),
      areaScale.invert(legendPadding)
    );
    console.log(legendValues);
    const legendGroup = g.append("g");
    legendGroup
      .selectAll("circle")
      .data(legendValues)
      .enter()
      .append("circle")
      .attr("cx", w - xPadding - legendPadding)
      .attr("cy", (d) => 2 * legendPadding + 40 - areaScale(d))
      .attr("r", (d) => areaScale(d))
      .attr("fill", "none")
      .attr("stroke", "black");

    legendGroup
      .selectAll("text")
      .data(legendValues)
      .enter()
      .append("text")
      .attr("x", w - xPadding - legendPadding)
      .attr("y", (d) => 2 * legendPadding + 38 - 2 * areaScale(d))
      .text((d) => d)
      .style("text-anchor", "middle")
      .classed("tick-text", true)
      .style("font-size", "14px");

    /*g.append('text')
            .text('Job Satisfaction')
            .attr("x", xPadding)
            .attr("y", 40)
            .classed('title', true);*/

    g.append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height - 70) + ")")
      .attr("class", "axis-label")
      .append("text")
      .text("Satisfaction");

    g.append("g")
      .attr("transform", "translate(" + 20 + "," + (height / 2 + 10) + ")")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("class", "axis-label")
      .text("Number of developers");

    var line = svg
      .append("line")
      .attr("x2", 15)
      .attr("y2", height / 2 - 200)
      .attr("x1", 15)
      .attr("y1", height / 2 - 170)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    var line = svg
      .append("line")
      .attr("x1", 15)
      .attr("y1", height / 2 + 30)
      .attr("x2", 15)
      .attr("y2", height / 2 + 70)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");
  }, [countrySatisfactionObj]);

  return (
    <VisaulisationWrapper title="Developers' Satisfaction">
      <svg ref={ref}></svg>
    </VisaulisationWrapper>
  );
};

export default SatisfactionVisualisation;
