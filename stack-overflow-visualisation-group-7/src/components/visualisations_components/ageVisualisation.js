// select the svg container first
import * as d3 from "d3";
import React from "react";
import VisaulisationWrapper from "../ui_components/visualisationWrapper/visualisationWrapper";

// code reference => Borgen, P. H. (2019, September 12). Learn to create a bar chart with D3 - A tutorial for beginners. freeCodeCamp.Org. https://www.freecodecamp.org/news/how-to-create-your-first-bar-chart-with-d3-js-a0e8ea2df386/
const AgeVisualisation = ({ data }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    var margin = { top: 5, right: 30, bottom: 30, left: 100 },
      width = 700 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    const svg = d3.select(ref.current);

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const graph = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create axes groups
    const xAxisGroup = graph
      .append("g")
      .attr("transform", `translate(0, ${height - 100})`)
      .attr("class", "axis");

    const yAxisGroup = graph.append("g").attr("class", "axis");

    const maxYaxis = d3.max(Object.values(data));

    let suitableTicks;
    if (maxYaxis < 10) {
      suitableTicks = maxYaxis;
    }

    const y = d3
      .scaleLinear()
      .domain([0, maxYaxis + 10])
      .range([height - 100, 0]);

    const sortedXDomin = [
      "Under 18 years old",
      "18 - 24 years old",
      "25 - 34 years old",
      "35 - 44 years old",
      "45 - 54 years old",
      "55 - 64 years old",
      "65 years or older",
      "Prefer not to say",
    ];

    const sortXDomain = (arr) => {
      let zip = arr.map((element) => {
        return [element, sortedXDomin.indexOf(element)];
      });

      let sortedZip = zip.sort((a, b) => a[1] - b[1]);
      return sortedZip.map((a) => a[0]);
    };
    const x = d3
      .scaleBand()
      .domain(sortXDomain(Object.keys(data)))
      .range([0, width])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    const rectsData = Object.entries(data);

    // join the data to circs
    const rects = graph.selectAll("rect").data(rectsData);

    // add attrs to circs already in the DOM
    rects
      .attr("width", x.bandwidth)
      .attr("height", (d) => height - y(d[1]))
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))

      .on("mouseover", function () {
        d3.select(this).attr("fill", "orange");
      })
      .on("mouseout", function (_, d) {
        d3.select(this)
          .transition()
          .duration(250)
          .attr("fill", "rgb(225, 0, " + d[1] * 10 + ")");
      });

    // append the enter selection to the DOM
    rects
      .enter()
      .append("rect")
      .attr("width", x.bandwidth)
      .attr("height", (d) => height - y(d[1]) - 100)
      .attr("x", (d) => {
        return x(d[0]);
      })
      .attr("y", (d) => y(d[1]))
      .attr("fill", "black")
      //On mouseover
      .on("mouseover", function () {
        d3.select(this).attr("fill", "orange");
      })
      .on("mouseout", function (_, d) {
        d3.select(this).transition().duration(250).attr("fill", "black");
      });

    //Create labels
    var labels = graph.selectAll(".labels").data(rectsData);

    //add attributes to text on dom
    labels
      .attr("x", function (d) {
        return x(d[0]) + x.bandwidth() / 2;
      })
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("y", function (d) {
        if (height - y(d[1]) > 120) {
          return y(d[1]) + 10;
        } else {
          return y(d[1]) - 14;
        }
      })
      .attr("font-family", "sans-serif")
      .attr("fill", function (d) {
        if (height - y(d[1]) > 100) {
          return "white";
        } else {
          return "black";
        }
      });

    //Enter…
    labels
      .enter()
      .append("text")
      .text(function (d) {
        return d[1];
      })
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("x", function (d) {
        return x(d[0]) + x.bandwidth() / 2;
      })
      .attr("y", function (d) {
        if (height - y(d[1]) > 120) {
          return y(d[1]) + 14;
        } else {
          return y(d[1]) - 5;
        }
      })
      .attr("fill", function (d) {
        if (height - y(d[1]) > 120) {
          return "white";
        } else {
          return "black";
        }
      });

    // create & call axesit
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    if (suitableTicks) {
      yAxis.ticks(suitableTicks);
    }

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup
      .selectAll("text")
      .attr("fill", "white")
      .attr("transform", "rotate(-40)")
      .attr("text-anchor", "end");

    graph
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height + 25) + ")")
      .attr("class", "axis-label")
      .append("text")
      .text("Age");

    graph
      .append("g")
      .attr("transform", "translate(" + -70 + "," + height / 2 + ")")
      .attr("class", "axis-label")
      .append("text")
      .attr("transform", "rotate(-90)")
      .text("Number of developers");
  }, [data]);

  return (
    <VisaulisationWrapper title="Developers' Age Distribution">
      <svg className="svg-Age" ref={ref} />
    </VisaulisationWrapper>
  );
};

export default AgeVisualisation;
