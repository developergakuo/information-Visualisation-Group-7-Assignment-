import * as d3 from "d3";
import React from "react";
import VisaulisationWrapper from "../ui_components/visualisationWrapper/visualisationWrapper";

function getTopData(dataset, n) {
    return d3.sort(dataset, (a, b) => (b.workedWithCount + b.desiredCount) - (a.workedWithCount + a.desiredCount)).slice(0, n);
}

function appendAxis(axis, svgEl, x, y, clss) {
    svgEl.append("g")
        .attr("class", `axis ${clss} `)
        .attr("transform", "translate(" + x +"," + y + ")")
        .call(axis)
}

const LanguagesVisualisation = ({countryLanguageWorkedWith, countryLanguageDesired}) => {
    const ref = React.useRef();

    const h = 600;
    const w = 1150;
    const xPadding = 50;

    React.useEffect(() =>{
        
        const svg = d3.select(ref.current)

        let g = svg.append('g')
        .attr("transform", "translate(" + 0 +"," + 40 + ")")
        .attr('height', h - 150)

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
        const desiredMax = d3.max(topData, d => d.desiredCount)
        let desiredTicks
        if (desiredMax < 10){
            desiredTicks = desiredMax
        }

        const workedWithMax =  d3.max(topData, d => d.workedWithCount)
        let workedWithTicks
        if (desiredMax < 10){
            workedWithTicks = workedWithMax
        }
        const xScaleRight = d3.scaleLinear()
            .domain([0, desiredMax])
            .range([xPadding + chartWidth + middleWidth + 50, w + xPadding])
            .nice()

        const xScaleLeft = d3.scaleLinear()
            .domain([0, workedWithMax])
            .range([chartWidth + xPadding, xPadding])
            .nice();
        const xAxisRight = d3.axisTop(xScaleRight)
        const xAxisLeft = d3.axisTop(xScaleLeft);

        if(desiredTicks){
            xAxisRight.ticks(desiredTicks)
        }
        
        if(workedWithTicks){
            xAxisLeft.ticks(workedWithTicks)
        }
        
        const yScale = d3.scaleBand()
            .domain(d3.range(topData.length))
            .rangeRound([20, h - 50])
            .paddingOuter(0.75)
            .paddingInner(0.25)
        g.attr("height", h)
            .attr("width", w + 2 * xPadding );
        const groups = g.selectAll("g")
            .data(topData)
            .enter()
            .append("g")
            .attr("class", "bar");

        //Title
        g.append('text')
            .attr("x", 30)
            .attr("y", -10)
            .attr('class', 'axis-label')
            .text('Programming languages used')
            .classed('title', true)
        g.append('text')
            .attr("x", xPadding + chartWidth + middleWidth + 50) 
            .attr('class', 'axis-label')
            .attr("y", -10)
            .text('Programming languages desired in future')
            .classed('title', true)

           const  XMiddleXLabelPos = ( xPadding + chartWidth + middleWidth / 2 + 50/2)
           const YmiddleXlabelPos = (h -10 )
        svg.append("g")
            .attr("transform", "translate("+ XMiddleXLabelPos  + "," +YmiddleXlabelPos  + ")")
            .attr('class', 'axis-label')
            .append('text')
            .text("Number of developers ")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr('textFont', '14px')

        svg.append("line")
            .attr("x1",XMiddleXLabelPos + 100)  
            .attr("y1",YmiddleXlabelPos)  
            .attr("x2",XMiddleXLabelPos + 400)  
            .attr("y2",YmiddleXlabelPos)  
            .attr("stroke","black")  
            .attr("stroke-width",2)  
            .attr("marker-end","url(#arrow)");

        svg.append("line")
            .attr("x1", (XMiddleXLabelPos - 100))  
            .attr("y1",YmiddleXlabelPos)  
            .attr("x2",XMiddleXLabelPos  - 400)  
            .attr("y2",YmiddleXlabelPos)  
            .attr("stroke","black")  
            .attr("stroke-width",2)  
            .attr("marker-end","url(#arrow)");
        
        // Create bars for bar chart on the right
        groups.append("rect")
            .attr("x", xPadding + chartWidth + middleWidth + 50 )
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
            .text(d =>  (d.language === 'Bash/Shell/PowerShell')? 'Bash/PowerS.': d.language )
            .attr("x", xPadding + chartWidth + middleWidth / 2 + 50/2)
            .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
            .attr("class", "language-name")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")

        // Create axis
        appendAxis(xAxisRight, g, 0, 40, 'xAxisRight');
        appendAxis(xAxisLeft, g, 0, 40, 'xAxisLeft');

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

            d3.selectAll('.xAxisRight text')
            .attr('transform', 'rotate(-45)')
            .attr('text-anchor', 'start')

            d3.selectAll('.xAxisLeft text')
            .attr('transform', 'rotate(45)')
            .attr('text-anchor', 'end')
    }, [countryLanguageWorkedWith,countryLanguageDesired])

        return (
        <VisaulisationWrapper
        title="Developers' Languages-worked-with vs. Developers' Languages-Desired-to-work-with">
             <svg 
                className='svg-canvas'
                ref={ref}
                style={{
                height: h,
                width: w + 2 * xPadding,
                marginRight: "0px",
                marginLeft: "0px",
                }}
                >

            </svg> 
        </VisaulisationWrapper>
       
            
        )
    }

export default LanguagesVisualisation