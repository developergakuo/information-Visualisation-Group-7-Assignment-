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

const EducationVsExperience = ({ country, year }) => {
  const [error, setError] = React.useState(false);
  const ref = React.useRef();
  var margin = { top: 10, right: 30, bottom: 30, left: 150 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  React.useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll(".svg-canvas-experience-vs-income").remove();

    const data_path = `http://localhost:3000/processed_data/salaries/${country}-${year}-income_education_per_country.csv`;

    //Read the data
    d3.csv(data_path).then((data, error) => {
      let maxYaxis = d3.max(data, (d) => parseFloat(d.Monthly_Sal_EUR));
      if (error) {
        setError(true);
      } else {
        if (data.columns.includes("<!DOCTYPE html>")) {
          setError(true);
        } else {
          // set the dimensions and margins of the graph

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

          const bandDomain = [
            "No formal education",
            "I prefer not to answer",
            "Something else",
            "Primary/elementary school",
            "Secondary school",
            "college/university without bachelor's degree",
            "Bachelor's degree",
            "Professional degree",
            "Associate degree",
            "Master's degree",
            "Doctoral degree",
          ];
          const sortXDomain = (arr) => {
            let zip = arr.map((element) => {
              return [element, bandDomain.indexOf(element)];
            });

            let sortedZip = zip.sort((a, b) => a[1] - b[1]);
            return sortedZip.map((a) => a[0]);
          };

          var x = d3
            .scaleBand()
            .rangeRound([0, width])
            .padding(1.0)
            .domain(
              sortXDomain(
                data.map(function (d) {
                  return d.EdLevel;
                })
              )
            )
            .range([0, width]);
          const xAxisGroup = g
            .append("g")
            .attr("transform", "translate(0," + (height - 100) + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(x));

          g.append("g")
            .attr(
              "transform",
              "translate(" + width / 2 + "," + (height + 0) + ")"
            )
            .attr("class", "axis-label")
            .append("text")
            .text("Education");

          g.append("g")
            .attr("transform", "translate(" + -70 + "," + height / 2 + ")")
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .text("Income (Euros per Month)");

          // Add Y axis
          var y = d3
            .scaleLinear()
            .domain([0, maxYaxis])
            .nice()
            .range([height - 100, 0]);
          g.append("g").call(d3.axisLeft(y).ticks(10)).attr("class", "axis");

          // Add dots
          g.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
              return x(d.EdLevel);
            })
            .attr("cy", function (d) {
              return y(d.Monthly_Sal_EUR);
            })
            .attr("r", () => {
              return 3.5;
            })
            .style("fill", "#69b3a2")
            .on("mousemove", (e, d) => {
              tooltip
                .html(
                  "Income: " +
                    formatter.format(d.Monthly_Sal_EUR) +
                    "<br> Education: " +
                    d.EdLevel
                )
                .style("left", d3.pointer(e, this)[0] + 90 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style(
                  "top",
                  d3.pointer(e, this)[1] +
                    document.getElementById("educationVsIncomeToolTip")
                      .offsetTop +
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

          xAxisGroup
            .selectAll("text")
            .attr("fill", "white")
            .attr("transform", "rotate(-15)")
            .attr("text-anchor", "end");

          var tooltip = d3
            .select("#educationVsIncomeToolTip")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "grey")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("position", "absolute");

          d3.selectAll(".axis line").style("stroke", "black");

          d3.selectAll(".axis text").style("fill", "black");

          d3.selectAll(".axis path").style("stroke", "black");
        }
      }
    }, []);
  });
  if (error) {
    return (
      <MissingVisaulisationWrapper
        key="languages"
        title={`There is no income - education data  for ${country}`}
      />
    );
  } else {
    return (
      <VisaulisationWrapper
        title="Income in Euros per Month vs. Education Level"
        subTitle="Hover over graph points to see exact figures"
      >
        <div id="educationVsIncomeToolTip">
          <svg className="svg-canvas-experience-vs-income" ref={ref}></svg>
        </div>
      </VisaulisationWrapper>
    );
  }
};

export default EducationVsExperience;
