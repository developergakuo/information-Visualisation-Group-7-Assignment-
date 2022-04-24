// a link to the world map - topojson
let mapURl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// this is the map topological information used to draw the map 
let countriesFeatures 

// declare paths to data to be plotted  
let salariesDataPath = '../processed_data/salaries/average_montly_salary_in_Euros_per_country_per_year.json'
let satisfactionDataPath = '../processed_data/satisfaction/2020-satisfcation_count_per_country.json'
let genderDataPath = '../processed_data/gender/2020-gender_count_per_country.json'
let experienceDataPath= '../processed_data/experience/average_experience_per_country_per_year.json'
let ageDataPath = '../processed_data/age/2020-age_count_per_country.json'
let languagesDataPath = '../processed_data/languages/2020-LanguageWorkedWith_count_per_country.json'
let devTypesDataPath = '../processed_data/dev_types/2020-dev_types_count_per_country.json'

// prepare the map canvas 
const width = 1200
const height = 600
const svg = d3.select('body').append('svg')
                             .attr('width', width)
                             .attr('height', height)

const projection = d3.geoMercator().scale(140)
                                   .translate([width/2, height/1.4]) 

const path = d3.geoPath(projection)

const g = svg.append('g')
let tooltip = d3.select('#tooltip')

// declare data map data and countries data loaded from json files
let countriesMapData
let salariesData
let drawMap = () => {
  g.selectAll('path')
      .data(countriesMapData)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'country')
      .attr('name', (countryDataItem) =>  countryDataItem.properties.name )
       
      // TODO give attributes to each   countrry based on its data: 
      // 1. We should not confuse ordinal scales with categorical scales where colour is concerned  
      // 2. We might also want to load some of this data in an efficient manner, eg only in reaction to a selection
      .attr('fill', (countryDataItem) => {
        let countryName = countryDataItem.properties.name
        let countrySalaries = salariesData[countryName] 

        if (countrySalaries !== undefined){

            salary_2017 = countrySalaries[2017]
            
            if(salary_2017 <= 1000 ){
                return 'tomato'
            }else if(salary_2017 <= 3000){
                return 'orange'
            }else if(salary_2017 <= 4500){
                 return 'lightgreen'
            }else{
                return 'limegreen'
            }
          }else{
            // TODO Be sure that a country data is missing for sure
            // 1. Ensure that the topojson countryName has the same spelling as your country name in the data set
            // 2. Look at the different data sets - 2017, 2018, 2019,2020 & 2021 and ensure the country is consitently named 
            //     on the original datasets provided in by StackOverflow. The preprocessing can miss those. 
            //     It was tedious looking at each country individually across the years. 

            console.warn('Country Not Found: ' + countryName)
          return 'black'
        }
    })

    // react to mouse over and out events - Show a tool tip on the canvas topside 
    .on('mouseover', (countryDataItem)=> {
      tooltip.transition()
          .style('visibility', 'visible')

          let countryName = countryDataItem.properties.name
          let countrySalaries = salariesData[countryName] 

        if (countrySalaries !== undefined){

            salary_2017 = countrySalaries[2017]
            tooltip.text( countryName +  ': Average salary 2017:  €' +  salary_2017 )
  
          }else{
            tooltip.text( countryName +  ': Average salary 2017:  ' +  'NOT PROVIDED')
          }
          
      })

  .on('mouseout', (countyDataItem) => {
      tooltip.transition()
          .style('visibility', 'hidden')
  })
}

// Read the map topojson and countries data in nesteed promises
// Todo - EFFICIENT VISUALISATIONS 
//  We might want to load some of this data in an efficient manner, eg only in reaction to a selection
// Currently it is all loaded on page load or refresh
d3.json(mapURl)
  .then((data, error) =>{
      if (error){
          throw 'Error reading map data: ' + error 
      }else{
        countriesMapData = topojson.feature(data, data.objects.countries).features

        d3.json(salariesDataPath)
          .then((data, error)=>{
            if(error){
              throw 'Error reading salaries data: ' + error
            }else{
              salariesData = data
              // TODO (delete this)  - You can logo this to see your data ;) 
              //console.log(salariesData)
              drawMap()
            }
          })
        // TODO (delete this)  - You can logo this to see your data ;) 
        //console.log(countriesMapData)
       
     
      }
  })