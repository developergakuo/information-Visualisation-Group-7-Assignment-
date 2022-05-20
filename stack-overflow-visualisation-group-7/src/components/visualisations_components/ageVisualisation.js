// select the svg container first
import * as d3 from "d3";
import React from "react";
import VisaulisationWrapper from "../ui_components/visualisationWrapper/visualisationWrapper";


const AgeVisualisation = ({data}) => {
    const ref = React.useRef();
 

    React.useEffect(() =>{
        var margin = {top: 5, right: 30, bottom: 30, left: 60},
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;
        const svg = d3.select(ref.current)

        svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        
        
          const graph = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

        // create axes groups
        const xAxisGroup = graph.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .attr('class', 'axis')


        const yAxisGroup = graph.append('g')
        .attr('class', 'axis')

        const y = d3.scaleLinear()
            .domain([0, d3.max(Object.values(data)) + 10])
            .range([height - 50 , 0]);


        
        const sortedXDomin =   [
                'Under 18 years old',
                '18-24 years old',
                '25-34 years old',
                '35-44 years old',
                '45-54 years old',
                '55-64 years old',
                '65 years or older',
                'Prefer not to say',
                ]

        const sortXDomain = (arr) => {
            let zip = arr.map(element => {
                return [element,sortedXDomin.indexOf(element)]
            });

            let sortedZip = zip.sort((a,b) =>  a[1] - b[1] )
            return sortedZip.map(a=> a[0])

        }

        console.log('sorted', sortXDomain(Object.keys(data)))
        const x = d3.scaleBand()
            .domain(sortXDomain(Object.keys(data)))
            .range([0, width])
            .paddingInner(0.2)
            .paddingOuter(0.2);

        const rectsData = Object.entries(data)
        
        // join the data to circs
        const rects = graph.selectAll('rect')
                .data(rectsData);

        // add attrs to circs already in the DOM
        rects.attr('width', x.bandwidth)
        .attr("height", d => height - y(d[1]) - 50)
        .attr('x', d => x(d[0]))
        .attr('y', d => y(d[1]))
       
        .on('mouseover', function() {
            d3.select(this)
                .attr('fill', 'orange');
        })
        .on('mouseout', function(_, d) {
            d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "rgb(225, 0, " + (d[1] * 10) + ")");
        });

        // append the enter selection to the DOM
        rects.enter()
        .append('rect')
            .attr('width', x.bandwidth)
            .attr("height", d => height - y(d[1]) - 50)
            .attr('x', d => x(d[0]))
            .attr('y', d => y(d[1]))
            .attr('fill', 'black')
            //On mouseover
            .on('mouseover', function() {
                d3.select(this)
                    .attr('fill', 'orange');
            })
            .on('mouseout', function(_, d) {
                d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("fill", "black");
            });



        //Create labels

        var layer3 = svg.append('g');

        var labels = layer3.selectAll(".labels")
                     .data(rectsData)


           //add attributes to text on dom 
           labels
           
            .attr("text-anchor", "middle")
            .attr("x", function(d) {
                return x(d[0]) + x.bandwidth() * 1.5 ;
            })
            .attr("y", function(d) {
                    console.log(d[1], )
                    if ( (height - y(d[1])) > 60){
                    return y(d[1]) + 10  
                    }
                    else{
                        return y(d[1]) - 14
                    }
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", function(d) {
                    if ( (height - y(d[1])) > 60){
                    return "white"  
                    }
                    else{
                        return "black"
                    }
            })
            .attr("class", "labels")
            .attr('position', 'absolute')
            .attr("dominant-baseline", "middle")

            graph.append("g")
                                .attr("transform", "translate("+ width/2 + "," + (height + 20) + ")")
                                .append('text')
                                .text("Age")

             graph.append("g")
                                .attr("transform", "translate("+ -50 + "," + height/2 + ")")
                                .append('text')
                                .attr("transform", "rotate(-90)")
                                .text("Number of developers")

        //Enter…
        labels.enter()
            .append("text")
            .text(function(d) {
                console.log((d[1]) )
                return d[1];
            })
            .attr("text-anchor", "middle")
            .attr("x", function(d) {
                return x(d[0]) + x.bandwidth() * 1.5 ;
            })
            .attr("y", function(d) {
                console.log(d[1], height - y(d[1]) )

                if ( (height - y(d[1])) > 60){
                    return y(d[1]) + 14 
                    }
                    else{
                        return y(d[1]) - 5
                    }
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("class", "labels")
            .attr('position', 'absolute')
            .attr("fill", function(d) {
                if ( (height - y(d[1])) > 60){
                return "white"  
                }
                else{
                    return "black"
                }
             })
            .attr("dominant-baseline", "middle")


        // create & call axesit
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y)
       

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        xAxisGroup.selectAll('text')
        .attr('fill', 'white')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
}, [data])

return(
    <VisaulisationWrapper
     title="Developers' Age Distribution"
     >
         <svg 
        className='svg-Age'
        ref={ref}
     />

    </VisaulisationWrapper>
   
)
}
    
export default AgeVisualisation