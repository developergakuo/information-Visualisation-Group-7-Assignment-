import * as d3 from "d3";
import React from "react";
import MissingVisaulisationWrapper from "../ui_components/missingVisualisationWrapper/missingVisualisationWrapper";
import VisaulisationWrapper from "../ui_components/visualisationWrapper/visualisationWrapper";

//code reference => Bostock, M. (2021). D3.js - Data-Driven Documents. D3js.Org. https://d3js.org/
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const IncomeVsExperience = ({ country, year }) => {
  const [error, setError] = React.useState(false);

  const ref = React.useRef();

  React.useEffect(() => {
    const data_path = `http://localhost:3000/processed_data/salaries/${country}-${year}-income_experience_per_country.csv`;

    //Read the data
    d3.csv(data_path).then((data, error) => {
      if (error) {
        setError(true);
      } else {
        if (data.columns.includes("<!DOCTYPE html>")) {
          setError(true);
        } else {
          // set the dimensions and margins of the graph
          var margin = { top: 10, right: 30, bottom: 30, left: 150 },
            width = 1000 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

          const uniqueEntries = data.length;

          const svg = d3.select(ref.current);
          svg.selectAll(".svg-canvas-experience-vs-income").remove();
          // append the svg object to the body of the page
          svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

          const g = svg
            .append("g")
            .attr(
              "transform",
              "translate(" + margin.left + "," + margin.top + ")"
            )
            .attr("width", width)
            .attr("height", height);

          let maxXaxis = d3.max(data, (d) => parseInt(d.YearsCodePro));
          let maxYaxis = d3.max(data, (d) => parseFloat(d.Monthly_Sal_EUR));

          let suitableXTicks;
          if (uniqueEntries < 10) {
            suitableXTicks = maxXaxis;
          }

          var x = d3
            .scaleLinear()
            .domain([0, maxXaxis])
            .nice()
            .range([0, width]);

          if (suitableXTicks) {
            const xAxisGroup = g
              .append("g")
              .attr("transform", "translate(0," + (height - 50) + ")")
              .attr("class", "axis")
              .call(d3.axisBottom(x).ticks(suitableXTicks));
          } else {
            const xAxisGroup = g
              .append("g")
              .attr("transform", "translate(0," + (height - 50) + ")")
              .attr("class", "axis")
              .call(d3.axisBottom(x));
          }

          // Add Y axis
          var y = d3
            .scaleLinear()
            .domain([0, maxYaxis])
            .nice()
            .range([height - 50, 0]);
          const yAxisGroup = g
            .append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(10));

          // Axis labels
          g.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height + ")")
            .attr("class", "axis-label")
            .append("text")
            .text("Experience in years");

          g.append("g")
            .attr("transform", "translate(" + -70 + "," + height / 2 + ")")
            .attr("class", "axis-label")
            .append("text")
            .attr("transform", "rotate(-90)")
            .text("Number of developers");

          //html Tooltip
          var tooltip = d3
            .select("#incomeVsExpTooltip")
            .append("div")
            .style("opacity", 0)
            .attr("class", "incomeVsExpTooltipInner")
            .style("background-color", "grey")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("position", "absolute");

          // Add dots
          g.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
              return x(d.YearsCodePro);
            })
            .attr("cy", function (d) {
              return y(d.Monthly_Sal_EUR);
            })
            .attr("r", () => {
              return 4.5;
            })
            .style("fill", "#69b3a2")
            .on("mousemove", (e, d) => {
              tooltip
                .html(
                  "Income: " +
                    formatter.format(d.Monthly_Sal_EUR) +
                    "<br> Experience: " +
                    parseInt(d.YearsCodePro) +
                    " Years"
                )
                .style("left", d3.pointer(e, this)[0] + 90 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style(
                  "top",
                  d3.pointer(e, this)[1] +
                    document.getElementById("incomeVsExpTooltip").offsetTop +
                    50 +
                    "px"
                );
            })

            .on("mouseleave", () => {
              tooltip.transition().duration(200).style("opacity", 0);
            })
            .on("mouseover", () => {
              tooltip.style("opacity", 1);
            });
        }
      }
    }, []);
  });

  if (error) {
    return (
      <MissingVisaulisationWrapper
        key="languages"
        title={`There is no  income - experience data  for ${country}`}
      />
    );
  } else {
    return (
      <VisaulisationWrapper
        title="Income in Euros per Month vs. Experience in Years"
        subTitle="Hover over graph points to see exact figures"
      >
        <div id="incomeVsExpTooltip">
          <svg className="svg-canvas-experience-vs-income" ref={ref}></svg>
        </div>
      </VisaulisationWrapper>
    );
  }
};

export default IncomeVsExperience;
