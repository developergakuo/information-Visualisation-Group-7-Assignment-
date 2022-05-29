import "./App.css";
import * as topojson from "topojson";
import * as d3 from "d3";
import React from "react";
import salaries from "./processed_data/salaries/average_montly_salary_in_Euros_per_country_per_year.json";
import Checkbox from "./components/ui_components/checkbox/checkbox";
import WorldMap from "./components/visualisations_components/worldMap";

//Canvas dimensions
const width = 1200;
const height = 600;

function fetchJSONFile(dataPathDataSetter) {
  dataPathDataSetter.forEach(([path, dataSetter]) => {
    fetch(path, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status !== 404) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error("Not found");
        }
      })
      .then(function (data) {
        dataSetter(data);
      })
      .catch((eror) => {
        dataSetter("Not Found");
      });
  });
}

const handleCheckBoxChangeDataFethcer = (
  loadSateSetter,
  state,
  dataPathDataSetter
) => {
  if (!state) {
    fetchJSONFile(dataPathDataSetter, loadSateSetter);
  } else {
    dataPathDataSetter.forEach(([_, dataSetter]) => {
      dataSetter(null);
    });
  }
  loadSateSetter(!state);
};

const handleCheckBoxChange = (loadSateSetter, state) => {
  loadSateSetter(!state);
};

let mapURl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const App = () => {
  const [year, setYear] = React.useState("2020");

  const languagesWorkedWithDataPath = `http://localhost:3000/processed_data/languages/${year}-LanguageWorkedWith_count_per_country.json`;
  const languagesDesiredDataPath = `http://localhost:3000/processed_data/languages/${year}-df_LanguageDesireNextYear_count_per_country.json`;
  const ageDataPath = `http://localhost:3000/processed_data/age/${year}-age_count_per_country.json`;
  const satisfactionDataPath = `http://localhost:3000/processed_data/Satisfaction/${year}-satisfcation_count_per_country.json`;

  const [mapFeatures, setMapFeatures] = React.useState(null);
  const [isDoneLoadingMap, setisDoneLoadingMap] = React.useState(false);

  const [loadLanguages, setLoadLanguages] = React.useState(false);
  const [languagesData, setLanguagesData] = React.useState(null);
  const [languagesdesiredData, setLanguagesDesiredData] = React.useState(null);

  const [loadAge, setLoadAge] = React.useState(false);
  const [ageData, setAgeData] = React.useState(null);

  const [loadExperienceVsIncome, setLoadExperienceVsIncome] =
    React.useState(false);
  const [loadEducationVsIncome, setLoadEducationVsIncome] =
    React.useState(false);

  const [loadSatisfaction, setLoadSatisfaction] = React.useState(false);
  const [satisfactionData, setSatisfactionData] = React.useState(null);

  // if the year changes and some data selections were made, collect data for the
  //next year to avoid showing data for a wrong year

  React.useEffect(() => {
    [
      [loadAge, [[ageDataPath, setAgeData]]],
      [
        loadLanguages,
        [
          [languagesWorkedWithDataPath, setLanguagesData],
          [languagesDesiredDataPath, setLanguagesDesiredData],
        ],
      ],
      [loadSatisfaction, [[satisfactionDataPath, setSatisfactionData]]],
    ].forEach(([l, s]) => {
      if (l) {
        fetchJSONFile(s);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]); // execute this code only when the year changes

  // avoid reading the map data on every render cycle
  React.useEffect(() => {
    async function fetchData() {
      const data = await d3.json(mapURl);
      setMapFeatures(topojson.feature(data, data.objects.countries).features);
      setisDoneLoadingMap(true);
    }
    fetchData();
  }, []); // Execute this code only when the app loads for the first time

  // Data object to use on the map
  var dataToShow = {
    languages: languagesData,
    desiredLanguages: languagesdesiredData,
    age: ageData,
    loadExperienceVsIncome,
    loadEducationVsIncome,
    satisfactionData,
  };

  // Display messages for missing data
  const [missingDataMessages, setMissingDataMessages] = React.useState([]);
  React.useEffect(() => {
    setMissingDataMessages([]);
    const missingData = [];
    [
      ["Satisfaction", satisfactionData],
      ["Age", ageData],
      ["Languages worked with", languagesData],
      ["Desired Languages", languagesdesiredData],
    ].forEach((data) => {
      if (data[1] === "Not Found") {
        missingData.push(
          <p key={data[0]} className="MissingData">
            {" "}
            '{data[0]}' data is missing for year {year} for all countries{" "}
          </p>
        );
      }
    });

    setMissingDataMessages((prev) => [...prev, ...missingData]);
  }, [satisfactionData, ageData, languagesData, languagesdesiredData, year]);
  // Warn where data is missing

  return (
    <div>
      <h2>Choose a visualisation year</h2>
      <div className="radio-btn-container">
        <div
          style={{ float: "left", marginRight: "20px" }}
          className="radio-btn"
          onClick={() => {
            setYear("2017");
          }}
        >
          <input
            type="radio"
            value={year}
            name="year"
            defaultChecked={year === "2017"}
          />
          2017
        </div>
        <div
          style={{ float: "left", marginRight: "20px" }}
          className="radio-btn"
          onClick={() => {
            setYear("2018");
          }}
        >
          <input
            type="radio"
            value={year}
            name="year"
            defaultChecked={year === "2018"}
          />
          2018
        </div>
        <div
          style={{ float: "left", marginRight: "20px" }}
          className="radio-btn"
          onClick={() => {
            setYear("2019");
          }}
        >
          <input
            type="radio"
            value={year}
            name="year"
            defaultChecked={year === "2019"}
          />
          2019
        </div>
        <div
          style={{ float: "left", marginRight: "20px" }}
          className="radio-btn"
          onClick={() => {
            setYear("2020");
          }}
        >
          <input
            type="radio"
            value={year}
            name="year"
            defaultChecked={year === "2020"}
          />
          2020
        </div>
        <div
          className="radio-btn"
          onClick={() => {
            setYear("2021");
          }}
        >
          <input
            type="radio"
            value={year}
            name="year"
            defaultChecked={year === "2021"}
          />
          2021
        </div>
      </div>
      <div className="MissingData">{missingDataMessages}</div>
      {isDoneLoadingMap && (
        <WorldMap
          countriesMapData={mapFeatures}
          width={width}
          height={height}
          year={year}
          salaries={salaries}
          extraData={dataToShow}
        />
      )}
      <h2>
        {" "}
        Check the box corresponding to the data you would like to visualise and
        click on a country
      </h2>

      <Checkbox
        style={{ marginRight: "20px" }}
        id="loadLanguages"
        label="Programming Languages"
        value={loadLanguages}
        onChange={(_) =>
          handleCheckBoxChangeDataFethcer(setLoadLanguages, loadLanguages, [
            [languagesWorkedWithDataPath, setLanguagesData],
            [languagesDesiredDataPath, setLanguagesDesiredData],
          ])
        }
      />
      <Checkbox
        id="loadAge"
        label="Age"
        value={loadAge}
        onChange={(_) =>
          handleCheckBoxChangeDataFethcer(setLoadAge, loadAge, [
            [ageDataPath, setAgeData],
          ])
        }
      />

      <Checkbox
        id="loadExpVsIncome"
        label="Experience vs Income"
        value={loadExperienceVsIncome}
        onChange={(_) =>
          handleCheckBoxChange(
            setLoadExperienceVsIncome,
            loadExperienceVsIncome
          )
        }
      />

      <Checkbox
        id="loadEducationVsIncome"
        label="Show Education vs Income"
        value={loadEducationVsIncome}
        onChange={(_) =>
          handleCheckBoxChange(setLoadEducationVsIncome, loadEducationVsIncome)
        }
      />

      <Checkbox
        id="satisfaction"
        label="satisfaction"
        value={loadSatisfaction}
        onChange={(_) =>
          handleCheckBoxChangeDataFethcer(
            setLoadSatisfaction,
            loadSatisfaction,
            [[satisfactionDataPath, setSatisfactionData]]
          )
        }
      />
    </div>
  );
};

export default App;
