import './App.css';
import React from "react";
import salaries from './processed_data/salaries/average_montly_salary_in_Euros_per_country_per_year.json'
import Checkbox from './components/ui_components/checkbox/checkbox';
import WorldMap from './components/visualisations_components/worldMap';
//Canvas dimensions 
const width = 1200
const height = 600

function fetchJSONFile(dataPathDataSetter) {
  dataPathDataSetter.forEach(([path, dataSetter]) => {
      fetch(path, {headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }})
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        dataSetter(data);
      })
    });
}
const handleCheckBoxChangeDataFethcer = ( loadSateSetter, state, dataPathDataSetter) => {
    if(!state) {
      fetchJSONFile(dataPathDataSetter,loadSateSetter)
    }
    else{
      dataPathDataSetter.forEach(([_, dataSetter]) => {dataSetter(null)})
    }
    loadSateSetter(!state);
};

const handleCheckBoxChange = ( loadSateSetter, state) => {
    loadSateSetter(!state);
};

const App =  () => {

      const [year, setYear] = React.useState('2020');

      const languagesWorkedWithDataPath = `./processed_data/languages/${year}-LanguageWorkedWith_count_per_country.json`
      const languagesDesiredDataPath = `./processed_data/languages/${year}-df_LanguageDesireNextYear_count_per_country.json`
      const ageDataPath =`./processed_data/age/${year}-age_count_per_country.json`
      const satisfactionDataPath = `./processed_data/Satisfaction/${year}-satisfcation_count_per_country.json`

      const [loadLanguages, setLoadLanguages] = React.useState(false);
      const [languagesData, setLanguagesData] = React.useState(null)
      const [languagesdesiredData, setLanguagesDesiredData] = React.useState(null)

      const [loadAge, setLoadAge] = React.useState(false);
      const [ageData, setAgeData] = React.useState(null)

      const [loadExperienceVsIncome, setLoadExperienceVsIncome] = React.useState(false);
      const [loadEducationVsIncome, setLoadEducationVsIncome] = React.useState(false);

      const [loadSatisfaction, setLoadSatisfaction] = React.useState(false);
      const [satisfactionData, setSatisfactionData] = React.useState(null)

      var dataToShow = {
        languages: languagesData,
        desiredLanguages: languagesdesiredData,
        age: ageData,
        loadExperienceVsIncome,
        loadEducationVsIncome,
        satisfactionData,
      }

      return(
      <div>
          <h2>Choose a visualisation year</h2>
          <div className="radio-btn-container">
                <div
                  style={{float: 'left', marginRight: '20px'}}
                  className="radio-btn"
                  onClick={() => {
                    setYear("2017");
                  }}
                >
                  <input
                    type="radio"
                    value={year}
                    name="year"
                    checked={year === "2017"}
                  />
                  2017
                </div>
                  <div
                    style={{float: 'left', marginRight: '20px'}}
                    className="radio-btn"
                    onClick={() => {
                      setYear("2018");
                    }}
                  >
                    <input
                      type="radio"
                      value={year}
                      name="year"
                      checked={year === "2018"}
                    />
                    2018
                  </div>
                  <div
                    style={{float: 'left', marginRight: '20px'}}
                    className="radio-btn"
                    onClick={() => {
                      setYear("2019");
                    }}
                  >
                    <input
                      type="radio"
                      value={year}
                      name="year"
                      checked={year === "2019"}
                    />
                    2019
                  </div>
                  <div
                    style={{float: 'left', marginRight: '20px'}}
                    className="radio-btn"
                    onClick={() => {
                      setYear("2020");
                    }}
                  >
                    <input
                      type="radio"
                      value={year}
                      name="year"
                      checked={year === "2020"}
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
                      checked={year === "2021"}
                    />
                    2021
                  </div>
              </div>
          <WorldMap width={width} height={height} year={year} salaries={salaries} extraData={dataToShow}/>

          <h2> Check the box corresponding to the data you would like to visualise and click on a country</h2>

          <Checkbox
            style={{ marginRight: '20px'}}

            id="loadLanguages"
            label="Programming Languages"
            value={loadLanguages}
            onChange={(_) => handleCheckBoxChangeDataFethcer( setLoadLanguages, loadLanguages, [[languagesWorkedWithDataPath,setLanguagesData],[languagesDesiredDataPath, setLanguagesDesiredData]])}
          />
          <Checkbox
            id= "loadAge"
            label="Age"
            value={loadAge}
            onChange={(_) => handleCheckBoxChangeDataFethcer( setLoadAge, loadAge, [[ageDataPath, setAgeData]])}
          />

          <Checkbox
            id= "loadExpVsIncome"
            label="Experience vs Income"
            value={loadExperienceVsIncome}
            onChange={(_) => handleCheckBoxChange( setLoadExperienceVsIncome, loadExperienceVsIncome)}
          />

          <Checkbox
            id= "loadEducationVsIncome"
            label="Show Education vs Income"
            value={loadEducationVsIncome}
            onChange={(_) => handleCheckBoxChange( setLoadEducationVsIncome, loadEducationVsIncome)}
          />

        <Checkbox
            id= "satisfaction"
            label="satisfaction"
            value={loadSatisfaction}
            onChange={(_) => handleCheckBoxChangeDataFethcer( setLoadSatisfaction, loadSatisfaction, [[satisfactionDataPath,setSatisfactionData]])}
          />
      </div>
)
};
 
export default App;