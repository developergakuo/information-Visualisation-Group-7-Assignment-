d3.json('./Data/age/2018-age_count_per_country.json')
          .then((data, error) =>{
            if(error){
              throw 'Error reading age data: ' + error
            }else{

                Object.entries(data).forEach(([country, value_one]) => {
                    var country_name = country
                    var data_range = []
                  Object.entries(value_one).forEach(([key,value]) =>{
                      data_range.push({age_range:key, count:value})
                      

                  })
                  //console.log(data_range)

                    

                    /*var data_range = [{age_range:"From_18_to_24", count:a},
                                      {age_range:"From_25_to_34", count:a},
                                      {age_range:"From_35_to_44", count:a},
                                      {age_range:"From_45_to_54", count:a},
                                      {age_range:"From_55_to_64", count:a},
                                      {age_range:"Undere_18_years_old", count:a},
                                      {age_range:"Above_65", count:a}
                                     ];
                    */
                // create svg to hold my bar chart
                var margin = { top: 50, bottom: 50, left: 50, right: 50}
                var width = 800;
                var height = 500;

                var svg = d3.select('#d3-container')
                    .append('svg')
                    .attr('height', height - margin.top - margin.bottom + 200) 
                    .attr('width', width - margin.left - margin.right)
                    .attr('viewBox', [0, 0, width, height])
                    .style("background", "white");

                    //svg.append("text").text(function(d,i){return d.country})

                // create the scales of our chart
                var x = d3.scaleBand()
                   .domain(d3.range(data_range.length))
                   .range([margin.left, width - margin.right])
                   .padding(0.2);

                /*var y = d3.scaleBand()
                    .domain(d3.range(data_range.length))
                    .range([height - margin.bottom, margin.top])
                    .padding(0.2);
                    */
                  

                var y =  d3.scaleLinear()
                
                  .domain([0, d3.max(data_range, d => d.count)])
                  //.range([400 + margin.bottom, margin.top])
                  
                  .range([height - margin.bottom, margin.top]);
                  

                svg.append("text")
                   .attr("transform", "translate(100,0)")
                   .attr("x", 50)
                   .attr("y", 40)
                   .attr("font-size", "24px")
                   //.text("XYZ")
                   .text(country_name)
                   

                

                svg 
                  .append('g')
                  .attr('fill', 'royalblue')
                  .selectAll('rect')
                  .data(data_range.sort((a, b) => d3.ascending(a.count, b.count)))
                  .join('rect')
                   .attr('x', (d, i) => x(i))
                   .attr('y', (d) => y(d.count))
                   .attr('height', d => y(0) - y(d.count))
                   .attr('width', x.bandwidth())
                   .attr('class', 'rectangle')
                   



                function xAxis(g){
                    
                     g.attr('transform', `translate(0, ${height - margin.bottom})`)
                     g.call(d3.axisBottom(x).tickFormat(i => data_range[i].age_range))
                      .selectAll("text")
                      .attr("dx", "-5em")
                      .attr("dy", "1em")
                      //.attr("transform", "rotate(-90)")
                      .attr("transform", "rotate(-40)")
                      .attr('font-size', '18px')

                

                }

                function yAxis(g){
                    g.attr('transform', `translate(${margin.left}, 0)`)

                    //check here in case of nothing on y-axis
                    .call(d3.axisLeft(y).ticks(null, data_range.format))


                    .attr('font-size', '18px')
                  
                }

                svg.append('g').call(yAxis)
                svg.append('g').call(xAxis)
                  
                svg.append("text")
                   .attr("transform", "rotate(-90)")
                   //.attr("x", -100)
                   //.attr("y", height - 490)
                   .attr("x", -(height/2))
                   .attr("y", 10)
                   .text("count")
                   //.attr('fill','white')
                   .attr('font-size', '20px')
                   

                svg.append("text")
                   .attr("x", width - 100)
                   .attr("y", height - 10)
                   .text("age range")
                   //.attr('fill','white')
                   .attr('font-size', '20px')
                    
                
                                
                svg.node();
                
                    


                })
            }
        })
        