import * as d3 from "d3";
import React from "react";
import VisaulisationWrapper from "../ui_components/visualisationWrapper/visualisationWrapper";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

const IncomeVsExperience =({country}) => {
    const ref = React.useRef();
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    React.useEffect(() =>{
        const svg = d3.select(ref.current)
        svg.selectAll('.svg-canvas-experience-vs-income').remove()
    
        // set the dimensions and margins of the graph
       

        // append the svg object to the body of the page
        svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

       const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 


        const data_path = `/processed_data/salaries/${country}-2017-income_experience_per_country.csv`

        
        //Read the data
        d3.csv(data_path).then((data, error) => {
            let maxXaxis = d3.max(data, d => parseInt(d.YearsCodePro))
            let maxYaxis = d3.max(data, d =>parseFloat( d.Monthly_Sal_EUR))

            console.log(maxXaxis, maxYaxis)

            var x = d3.scaleLinear()
            .domain([0, maxXaxis]).nice()
            .range([0, width ]);
            const xAxisGroup = g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr('class', 'axis')
            .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
            .domain([0, maxYaxis]).nice()
            .range([ height, 0]);
            const yAxisGroup  = g.append("g")
            .attr('class', 'axis')
            .call(d3.axisLeft(y).ticks(10));

            g.append("g")
            .attr("transform", "translate("+ width/2 + "," + (height + 30) + ")")
            .append('text')
            .text("Experience in years")

            g.append("g")
            .attr("transform", "translate("+ -50 + "," + height/2 + ")")
            .append('text')
            .attr("transform", "rotate(-90)")
            .text("Number of developers")


            var tooltip = d3.select("#incomeVsExpTooltip")
            .append("div")
            .style("opacity", 0)
            .attr("class", "incomeVsExpTooltipInner")
            .style("background-color", "grey")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style('position', 'absolute')

                    // Add dots
            var scatter = g.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.YearsCodePro); } )
            .attr("cy", function (d) { return y(d.Monthly_Sal_EUR); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")
            .on("mousemove", (e,d) =>  {
                tooltip
                .html("Income: " + formatter.format(d.Monthly_Sal_EUR)  + "<br> Experience: " + parseInt(d.YearsCodePro) +  " Years")
                .style("left", (d3.pointer(e, this)[0]+ 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (d3.pointer(e, this)[1]) + document.getElementById("incomeVsExpTooltip").offsetTop + 50 + "px")
            })
          
            .on("mouseleave", () => {
                tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
            })
            .on('mouseover', () =>{
                tooltip.style("opacity", 1)
            })
        },[])

})

return(
    <VisaulisationWrapper
    title='Income vs. Experience '
    >
        <div id= "incomeVsExpTooltip"> 
        <svg 
            className='svg-canvas-experience-vs-income'
            ref={ref}
        >
        </svg> 
        </div>

    </VisaulisationWrapper>
)
}

export default IncomeVsExperience