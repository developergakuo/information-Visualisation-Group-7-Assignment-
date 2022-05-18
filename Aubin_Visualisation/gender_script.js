/*
//  specify the SVG
var width = 500, height = 400;

// specify some predefined set of colors offered by d3.js
var colors = d3.scaleOrdinal(d3.schemeDark2);
    var svg = d3.select("body").append("svg")
                .attr("width", width).attr("height", height)
                .style("background", "pink"); 

// create a strcture to represent the details of each country/gender: array of objects
var details = [{gender:"Male", count:value.Male}, {gender:"Female", count:value.Female}];

// pie generator function
var data = d3.pie().sort(null).value(function(d){return d.count})(details);

//console.log(data);

// Definition of the arc of our pie chart here
var segments = d3.arc()
                 .innerRadius(0)
                 .outerRadius(150)
                 .padAngle(.05)
                 .padRadius(50);

// path elements for the segments
var sections = svg.append("g").attr("transform", "translate(250, 250)")
                    .selectAll("path").data(data);

//append path elements and specify colors for each section
sections.enter().append("path").attr("d",segments).attr("fill", function(d){return colors(d.data.count);});




//Give a legend for the different color codes

var legends = svg.append("g").attr("transform", "translate(300,100)")
                    .selectAll(".legends").data(data);

//added seperate g elements within our svg
var legend = legends.enter().append("g").classed("legends",
 true).attr("transform", function(d,i){return "translate(0," + (i+1)*30 + ")";});

 //add rectangles and labels within our legend
 legend.append("rect").attr("width", 20).attr("height", 20).attr("fill",
 function(d){return colors(d.data.count);});
 legend.append("text").classed("label", true).text(function(d){return d.data.gender;})
        .attr("fill", function(d){return colors(d.data.count);})
        .attr("X", 30)
        .attr("y", 20);
*/

d3.json('./Data/Gender/2017-gender_count_per_country.json')
          .then((data, error) =>{
            if(error){
              throw 'Error reading gender data: ' + error
            }else{

                Object.entries(data).forEach(([key, value]) => {
                
                let country = key
                let male = value.Male
                let female = value.Female
                let other = value.Other

                if(male == undefined){
                    male = 0

                }
                if(female == undefined){
                    female = 0

                }

                //visualise here
            //console.log(country, male, female)
            //  specify the SVG
let width = 850, height = 400;

// specify some predefined set of colors offered by d3.js
let colors = d3.scaleOrdinal(d3.schemeDark2);
    let svg = d3.select("body").append("svg")
                .attr("width", width).attr("height", height)
                .style("background", "white"); 

                svg.append("text")
                .attr("transform", "translate(100,0)")
                .attr("x", 50)
                .attr("y", 40)
                .attr("font-size", "24px")
                //.text("XYZ")
                .text(country)

// create a strcture to represent the details of each country/gender: array of objects
var figure_structure = [{gender:"Male", count:male}, {gender:"Female", count:female}, {gender:"Other", count:other}];

// pie generator function
var data = d3.pie().sort(null).value(function(d){return d.count})(figure_structure);

//console.log(data);

// Definition of the arc of our pie chart here
var segments = d3.arc()
                 .innerRadius(0)
                 .outerRadius(140)
                 .padAngle(.05)
                 .padRadius(50);

// path elements for the segments
var sections = svg.append("g").attr("transform", "translate(250, 250)")
                    .selectAll("path").data(data);

//append path elements and specify colors for each section
sections.enter().append("path").attr("d",segments).attr("fill", function(d){return colors(d.data.count);});




//Give a legend for the different color codes

var color_names = svg.append("g").attr("transform", "translate(500,100)")
                    .selectAll(".legends").data(data);

//added seperate g elements within our svg
var color_name = color_names.enter().append("g").classed("legends",
 true).attr("transform", function(d,i){return "translate(0," + (i+1)*30 + ")";});

 //add rectangles and labels within our legend
 color_name.append("rect").attr("width", 20).attr("height", 20).attr("fill",
 function(d){return colors(d.data.count);});
 color_name.append("text").classed("label", true).text(function(d){return d.data.gender;})
        .attr("fill", function(d){return colors(d.data.count);})
        .attr("x", 30)
        .attr("y", 20);

                })
            }
        })
        
                
              
        