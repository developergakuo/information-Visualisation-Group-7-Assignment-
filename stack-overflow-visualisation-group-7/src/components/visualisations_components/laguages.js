import * as d3 from "d3";
import React from "react";
import VisaulisationWrapper from "../ui_components/visualisationWrapper/visualisationWrapper";

function getTopData(dataset, n) {
    return d3.sort(dataset, (a, b) => (b.workedWithCount + b.desiredCount) - (a.workedWithCount + a.desiredCount)).slice(0, n);
}

function appendAxis(axis, svgEl, x, y) {
    svgEl.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + x +"," + y + ")")
        .call(axis)
}

const LanguagesVisualisation = ({countryLanguageWorkedWith, countryLanguageDesired}) => {
    const ref = React.useRef();

 
    React.useEffect(() =>{
        const h = 500;
        const w = 1000;
        const svg = d3.select(ref.current)

        let g = svg.append('g')
        .attr("transform", "translate(" + 0 +"," + 20 + ")")
        .attr('height', h - 50)

        g.selectAll('.svg-canvas').remove()

            let dataset = [];
            for (const language in countryLanguageWorkedWith) {
                if (countryLanguageDesired.hasOwnProperty(language)) {
                    dataset.push({
                        'language': language,
                        'workedWithCount': countryLanguageWorkedWith[language],
                        'desiredCount': countryLanguageDesired[language]
                    })
                }
            }
        
        const topData = getTopData(dataset, 15);
       
        const middleWidth = 100;
        const chartWidth = (w - middleWidth) / 2;
        const xPadding = 50;
        const xScaleRight = d3.scaleLinear()
            .domain([0, d3.max(topData, d => d.desiredCount)])
            .range([xPadding + chartWidth + middleWidth, w + xPadding])
            .nice();
        const xScaleLeft = d3.scaleLinear()
            .domain([0, d3.max(topData, d => d.workedWithCount)])
            .range([chartWidth + xPadding, xPadding])
            .nice();
        const xAxisRight = d3.axisTop(xScaleRight);
        const xAxisLeft = d3.axisTop(xScaleLeft);
        const yScale = d3.scaleBand()
            .domain(d3.range(topData.length))
            .rangeRound([0, h - 50])
            .paddingOuter(0.75)
            .paddingInner(0.25)
        g.attr("height", h)
            .attr("width", w + 2 * xPadding);
        const groups = g.selectAll("g")
            .data(topData)
            .enter()
            .append("g")
            .attr("class", "bar");

        //Title
        g.append('text')
            .attr("x", 30)
            .attr("y", -10)
            .text('Programming languages used')
            .classed('title', true)
        g.append('text')
            .attr("x", xPadding + chartWidth + middleWidth)
            .attr("y", -10)
            .text('Programming languages desired in future')
            .classed('title', true)

        svg.append("g")
            .attr("transform", "translate("+ ( xPadding + chartWidth + middleWidth / 2)  + "," + (h - 20) + ")")
            .append('text')
            .text("<--------------- Number of developers ---------------> ")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")

        // Create bars for bar chart on the right
        groups.append("rect")
            .attr("x", xPadding + chartWidth + middleWidth)
            .attr("y", (d, i) => yScale(i))
            .attr("width", d => xScaleRight(d.desiredCount) - xScaleRight(0))
            .attr("height", yScale.bandwidth())

        // Create bars for bar chart on the left
        groups.append("rect")
            .attr("x", d => xScaleLeft(d.workedWithCount))
            .attr("y", (d, i) => yScale(i))
            .attr("width", d => xScaleLeft(xScaleLeft.domain()[1] - d.workedWithCount) - xScaleLeft(xScaleLeft.domain()[1]))
            .attr("height", yScale.bandwidth())

        // Create text for labels in the middle
        groups.append("text")
            .text(d => d.language)
            .attr("x", xPadding + chartWidth + middleWidth / 2)
            .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
            .attr("class", "language-name")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")

        // Create axis
        appendAxis(xAxisRight, g, 0, 20);
        appendAxis(xAxisLeft, g, 0, 20);

        // Create data labels on right side
        const logScale = d3.scaleLog();
        groups.append("text")
            .text(d => d.desiredCount)
            .attr("x", d => d.desiredCount !== 0 ? xScaleRight(d.desiredCount) - (14 + Math.floor(logScale(d.desiredCount)) * 10) : 0)
            .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
            .attr("class", "bar-text")
            .attr("dominant-baseline", "middle")
            .style('fill', 'white')

        // Create data labels on left side
        groups.append("text")
            .text(d => d.workedWithCount)
            .attr("x", d => xScaleLeft(d.workedWithCount) + 10)
            .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
            .attr("class", "bar-text")
            .attr("dominant-baseline", "middle")
            .style('fill', 'white')
    }, [countryLanguageWorkedWith,countryLanguageDesired])

        return (
        <VisaulisationWrapper
        title="Developers' Languages-worked-with vs. Developers' Languages-Desired-to-work-with">
             <svg 
                className='svg-canvas'
                ref={ref}
                style={{
                height: 500,
                width: "100%",
                marginRight: "0px",
                marginLeft: "0px",
                }}
                >

            </svg> 
        </VisaulisationWrapper>
       
            
        )
    }

export default LanguagesVisualisation