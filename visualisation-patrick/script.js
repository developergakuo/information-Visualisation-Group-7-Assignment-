let mapURl = 'world_map_with_USA_states.json'

let countriesMapData
let countriesDeveleoperData

const width = 1200
const height = 600
const svg = d3.select('body').append('svg')
                             .attr('width', width)
                             .attr('height', height)

const projection = d3.geoMercator().scale(140)
                                   .translate([width/2, height/1.4]) 

const path = d3.geoPath(projection)

const g = svg.append('g')

d3.json(mapURl)
  .then((data, error) =>{
      if (error){
          console.log(error)
      }else{
        countriesMapData = topojson.feature(data, data.objects.combined)

        //filter out United States, it will be replaced by its 52 states
        countriesFeatures = countriesMapData.features.filter(feature => feature.properties.name != 'United States')

        g.selectAll('path').data(countriesFeatures).enter().append('path')
                                                                .attr('class', 'country')
                                                                .attr('d', path)
                                                                .onClick()
                                                            
      }
  })