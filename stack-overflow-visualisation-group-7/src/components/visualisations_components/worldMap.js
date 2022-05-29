import * as d3 from "d3";
import React, { useState } from "react";
import MissingVisaulisationWrapper from "../ui_components/missingVisualisationWrapper/missingVisualisationWrapper";
import Modal from "../ui_components/modal/modal";
import AgeVisualisation from "./ageVisualisation";
import EducationVsExperience from "./educationVsIncome";
import IncomeVsExperience from "./experienceVsIncome";
import LanguagesVisualisation from "./laguages";
import SatisfactionVisualisation from "./satisfaction";

//code reference => Bostock, M. (2021). D3.js - Data-Driven Documents. D3js.Org. https://d3js.org/
let visualisationcomponents = [];
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

let unavailableCountries = [];
let foundCountries = [];
let mapCountries = [];
let dataCountries = [];

const WorldMap = ({
  countriesMapData,
  width,
  height,
  year,
  salaries,
  extraData,
}) => {
  const [showModal, setModalStatus] = useState(false);
  const [countryName, setCountryName] = useState("");

  const closeModalHandler = () => {
    setModalStatus(false);
  };

  // prepare the map canvas
  const svg = React.useRef(null);

  React.useEffect(() => {
    const colourPicker = (salary) => {
      salary = parseFloat(salary);
      if (salary > 0 && salary <= 1000) {
        return "#edf8fb";
      } else if (salary > 1000 && salary <= 2000) {
        return "#ccece6";
      } else if (salary > 2000 && salary <= 3000) {
        return "#99d8c9";
      } else if (salary > 3000 && salary <= 4000) {
        return "#66c2a4";
      } else if (salary > 4000 && salary <= 5000) {
        return "#2ca25f";
      } else {
        return "#006d2c";
      }
    };

    const projection = d3
      .geoMercator()
      .scale(140)
      .translate([width / 2, height / 1.4]);

    const path = d3.geoPath(projection);
    const svgEl = d3.select(svg.current);
    const g = svgEl
      .append("g")
      .attr("transform", "translate(" + 50 + "," + 0 + ")");
    let tooltip = d3.select("#tooltip");
    // declare data map data and countries data loaded from json files
    var map = g
      .selectAll("path")
      .data(countriesMapData)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("name", (countryDataItem) => countryDataItem.properties.name)

      // react to mouse over and out events - Show a tool tip on the canvas topside
      .on("mouseover", (_, countryDataItem) => {
        tooltip.transition().style("visibility", "visible");

        let countryName = countryDataItem.properties.name;
        let countrySalaries = salaries[countryName];

        if (countrySalaries !== undefined) {
          let salary_year = countrySalaries[year];
          tooltip.text(countryName + ": " + formatter.format(salary_year));
        } else {
          tooltip.text(countryName + ":  NOT PROVIDED");
        }
      })
      .on("mouseout", (_) => {
        tooltip.transition().style("visibility", "hidden");
      })
      .on("click", (_, countryDataItem) => {
        setModalStatus(true);

        let countryName = countryDataItem.properties.name;

        setCountryName(countryName);

        if (
          extraData.languages != null &&
          extraData.desiredLanguages != null &&
          extraData.languages !== "Not Found" &&
          extraData.desiredLanguages !== "Not Found"
        ) {
          let languagesWorkedWith = extraData.languages[countryName];
          let languagesDesired = extraData.desiredLanguages[countryName];

          if (
            languagesWorkedWith !== undefined &&
            languagesDesired !== undefined
          ) {
            visualisationcomponents.push(
              <LanguagesVisualisation
                key="languages"
                countryLanguageWorkedWith={languagesWorkedWith}
                countryLanguageDesired={languagesDesired}
              />
            );
          } else {
            visualisationcomponents.push(
              <MissingVisaulisationWrapper
                key="languages"
                title={`There is no languages data for ${countryName}`}
              />
            );
          }
        }
        if (extraData.loadExperienceVsIncome) {
          visualisationcomponents.push(
            <IncomeVsExperience
              key="experienceVsIncome"
              country={countryName}
              year={year}
            />
          );
        }
        if (extraData.loadEducationVsIncome) {
          visualisationcomponents.push(
            <EducationVsExperience
              key="educationVsIncome"
              country={countryName}
              year={year}
            />
          );
        }
        if (extraData.age != null && extraData.age !== "Not Found") {
          let ageData = extraData.age[countryName];

          if (ageData !== undefined) {
            visualisationcomponents.push(
              <AgeVisualisation key="age" data={ageData} />
            );
          } else {
            visualisationcomponents.push(
              <MissingVisaulisationWrapper
                key="age"
                title={`There is no age data for ${countryName}`}
              />
            );
          }
        }
        if (
          extraData.satisfactionData != null &&
          extraData.satisfactionData !== "Not Found"
        ) {
          let satisfactionData = extraData.satisfactionData[countryName];

          if (satisfactionData !== undefined) {
            visualisationcomponents.push(
              <SatisfactionVisualisation
                key="satisfaction"
                countrySatisfactionObj={satisfactionData}
              />
            );
          } else {
            visualisationcomponents.push(
              <MissingVisaulisationWrapper
                key="satisfaction"
                title={`There is no satisfaction data for ${countryName}`}
              />
            );
          }
        }
      });

    map
      .transition()
      .style("fill", (countryDataItem) => {
        let countryName = countryDataItem.properties.name;
        let countrySalaries = salaries[countryName];
        dataCountries = Object.keys(salaries);
        mapCountries.push(countryName);

        if (countrySalaries !== undefined) {
          let yearSalary = countrySalaries[year];
          foundCountries.push(countryName);

          return colourPicker(yearSalary);
        } else {
          unavailableCountries.push(countryName);
          // console.warn('Country Not Found: ' + countryName)
          return "black";
        }
      })
      .duration(1000);

    let difference2 = dataCountries.filter((x) => !mapCountries.includes(x));

    console.warn(
      " Countries in Data not found in map topojson data ",
      difference2.sort((a, b) => a.localeCompare(b))
    );

    // Read the map topojson and countries data in nesteed promises
    // Todo - EFFICIENT VISUALISATIONS
    //  We might want to load some of this data in an efficient manner, eg only in reaction to a selection
    // Currently it is all loaded on page load or refresh
  }, [width, height, countriesMapData, salaries, extraData, year]); // Redraw chart if data changes

  let modal;
  if (showModal) {
    if (visualisationcomponents.length > 0) {
      modal = (
        <Modal
          title={` Developers' information for  ${countryName} - ${year}`}
          onclick={closeModalHandler}
        >
          {visualisationcomponents}
        </Modal>
      );
    } else {
      modal = (
        <Modal
          title={`Developers' information for ${countryName} - ${year}`}
          onclick={closeModalHandler}
        >
          <p>
            {" "}
            You have not checked any data to visualize or you have made a
            selection for which data is missing{" "}
          </p>
        </Modal>
      );
    }
  } else {
    modal = null;
    visualisationcomponents = [];
  }

  return (
    <div id="map-container">
      <h4> Developer monthly average income per country for year {year} </h4>

      {modal}
      <div id="tooltip" />

      <svg ref={svg} width={width} height={height}>
        <svg id="legend">
          <g>
            <rect x="10" y="0" width="40" height="40" fill="black"></rect>
            <text x="60" y="20" fill="black">
              Income data not provided
            </text>
          </g>
          <g>
            <rect x="10" y="40" width="40" height="40" fill="#edf8fb"></rect>
            <text x="60" y="60" fill="black">
              Less than € 1,000
            </text>
          </g>
          <g>
            <rect x="10" y="80" width="40" height="40" fill="#ccece6"></rect>
            <text x="60" y="100" fill="black">
              € 1,000 - € 2,000{" "}
            </text>
          </g>
          <g>
            <rect x="10" y="120" width="40" height="40" fill="#99d8c9"></rect>
            <text x="60" y="140" fill="black">
              € 2,000 to € 3,000{" "}
            </text>
          </g>
          <g>
            <rect x="10" y="160" width="40" height="40" fill="#66c2a4"></rect>
            <text x="60" y="180" fill="black">
              € 3,000 to € 4,000{" "}
            </text>
          </g>
          <g>
            <rect x="10" y="200" width="40" height="40" fill="#2ca25f"></rect>
            <text x="60" y="220" fill="black">
              € 4,000 to € 5,000{" "}
            </text>
          </g>

          <g>
            <rect x="10" y="240" width="40" height="40" fill="#006d2c"></rect>
            <text x="60" y="260" fill="black">
              more than € 5,000
            </text>
          </g>
        </svg>

        <text
          x="500"
          y={height - 20}
          fill="black"
          fontWeight="1000"
          fontSize="14"
        >
          {" "}
          Hover over country to see exact average income
        </text>
      </svg>
      {/*Dataset source*/}
      <br/>
      <a href="https://insights.stackoverflow.com/survey?_ga=2.93265432.465840662.1648566697-1822023714.1648566697"
      style={{color: 'white'}}>
        Datasets from Stack Overflow Annual Developer Survey: https://insights.stackoverflow.com/survey?_ga=2.93265432.465840662.1648566697-1822023714.1648566697
        </a>
    </div>
  );
};
export default WorldMap;
