// set margin
const margin = { top: 80, right: 60, bottom: 60, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// code for creating svg and g
const svg = d3.select('#vis')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

////// new code


const t = 1000; // 1000ms = 1 second
let allData = [];
let xVar = 'income', yVar = 'lifeExp', sizeVar = 'population', targetYear = 2000;
let xScale, yScale, sizeScale;
let path = "./data/gapminder_subset.csv";
const continents = ['Africa', 'Asia', 'Oceania', 'Americas', 'Europe']
const colorScale = d3.scaleOrdinal(continents, d3.schemeSet2); // d3.schemeSet2 is a set of predefined colors. 
const options = ['income', 'lifeExp', 'gdp', 'population', 'childDeaths']

function init(){
    d3.csv("./data/gapminder_subset.csv", d => ({ 
        country: d.country,
        continent: d.continent,
        year: +d.year, // using + to convert to numbers; same below
        lifeExp: +d.life_expectancy, 
        income: +d.income_per_person, 
        gdp: +d.gdp_per_capita,
        childDeaths: +d.number_of_child_deaths,
        // Your turn: 
        // convert d.population, and assign it to population
        population: +d.population
    }))
    .then(data => {
            console.log(data) // Check the structure in the console
            allData = data // Save the processed data
            // placeholder for building vis
            // placeholder for adding listerners
            setupSelector()
            updateAxes()
            updateVis()
            addLegend()
        })
    .catch(error => console.error('Error loading data:', error));
}
window.addEventListener('load', init);



function setupSelector(){
    // Handles UI changes (sliders, dropdowns)
    // Anytime the user tweaks something, this function reacts.
    // May need to call updateAxes() and updateVis() here when needed!
    let slider = d3
        .sliderHorizontal()
        .min(d3.min(allData.map(d => +d.year)))
        .max(d3.max(allData.map(d => +d.year)))
        .step(1)
        .width(width)  // widen the slider if needed
        .displayValue(false)
        .on('onchange', (val) => {
            targetYear = +val // update the year
            updateVis() // refresh the chart
        });

    d3.select('#slider')
        .append('svg')
        .attr('width', width)  // Adjust width if needed
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)')
        .call(slider);

    d3.selectAll('.variable')
    // loop over each dropdown button
        .each(function() {
            d3.select(this).selectAll('myOptions')
            .data(options)
            .enter()
            .append('option')
            .text(d => d) // The displayed text
            .attr("value",d => d) // The actual value used in the code
        })
        .on("change", function (event) {
            if (d3.select(this).property("id") === "xVariable") {
                xVar = d3.select(this).property("value")
            }
            if (d3.select(this).property("id") === "yVariable") {
                yVar = d3.select(this).property("value")
            }
            if (d3.select(this).property("id") === "sizeVariable") {
                sizeVar = d3.select(this).property("value")
            }
            updateAxes();
            updateVis();
    })
    d3.select('#xVariable').property('value', xVar)
    d3.select('#yVariable').property('value', yVar)
    d3.select('#sizeVariable').property('value', sizeVar)
  }
  
function updateAxes(){
    // Draws the x-axis and y-axis
    // Adds ticks, labels, and makes sure everything lines up nicely
    svg.selectAll('.axis').remove()
    svg.selectAll('.labels').remove()
    xScale = d3.scaleLinear()
        .domain([0, d3.max(allData, d => d[xVar])])
        .range([0, width]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(".2s"))

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`) // Position at the bottom
        .call(xAxis);
    // y axis
    yScale = d3.scaleLinear()
        .domain([0, d3.max(allData, d => d[yVar])])
        .range([height, 0]);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,0)`)
        .call(yAxis);

    // X-axis label
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 20)
    .attr("text-anchor", "middle")
    .text(xVar) // Displays the current x-axis variable
    .attr('class', 'labels')

    // Y-axis label (rotated)
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 40)
    .attr("text-anchor", "middle")
    .text(yVar) // Displays the current y-axis variable
    .attr('class', 'labels')
}
  
function updateVis(){
    // Draws (or updates) the bubbles
    sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(allData, d => d[sizeVar])]) // Largest bubble = largest data point 
        .range([5, 20]); // Feel free to tweak these values if you want bigger or smaller bubbles

    let currentData = allData.filter(d => d.year === targetYear)

    svg.selectAll('.points')
        .data(currentData, d => d.country)
        .join(
            // Enter: When new bubbles are added
                function (enter) {
                    return enter
                        .append('circle')
                        .attr('class', 'points')
                        .attr('cx', d => xScale(d[xVar]))
                        .attr('cy', d => yScale(d[yVar]))
                        .style('fill', d => colorScale(d.continent))
                        .style('opacity', .5)
                        .attr('r', 0) // before transition r = 0
            

                        .on('mouseover', function (event, d) {
                            // console.log(d) // See the data point in the console for debugging
                            d3.select(this) // Refers to the hovered circle
                                .style('stroke', 'black')
                                .style('stroke-width', '4px')
                            d3.select('#tooltip')
                                 // if you change opacity to hide it, you should also change opacity here
                                .style("display", 'block') // Make the tooltip visible
                                .html( // Change the html content of the <div> directly
                                `<strong>${d.country}</strong><br/>
                                Continent: ${d.continent}`)
                                .style("left", (event.pageX + 20) + "px")
                                .style("top", (event.pageY - 28) + "px");
                        })
                        .on("mouseout", function (event, d) {
                            d3.select(this)
                                .style('stroke', 'none');

                            d3.select('#tooltip')
                                .style('display', 'none');
                        })
                        .transition(t) // Apply transition to bubble size
                        .attr('r', d => sizeScale(d[sizeVar])) 
                        .transition(t) // Animate the transition
                        .attr('r', d => sizeScale(d[sizeVar])) // Expand to target size
                },
                // Update: When existing bubbles need to move or resize
                function (update) {
                    return update
                        // Smoothly move to new positions/sizes
                        .transition(t)
                        .attr('cx', d => xScale(d[xVar]))
                        .attr('cy', d => yScale(d[yVar]))
                        .attr('r', d => sizeScale(d[sizeVar]))

                },
                // Exit: When bubbles need to be removed
                function (exit) {
                    exit
                    .transition(t)
                    .attr('r', 0)  // Shrink to radius 0
                    .remove()  // Then remove the bubble
                }
        )
}
  
function addLegend(){
   // Adds a legend so users can decode colors
   let size = 10  // Size of the legend squares

   // Your turn, draw a set of rectangles using D3
   svg.selectAll('continentSquare')
   // data here should be "continents", which we've defined as a global variable
   // the rect's y could be  -margin.top/2, x could be based on i * (size + 100) + 100
   // i is the index in the continents array
   // use "colorScale" to fill them; colorScale is a global variable we defined, used in coloring bubbles
   .data(continents)
   .enter()
   .append('rect')
   .attr('y', -margin.top / 2)
   .attr('x', (d, i) => i * (size + 100) + 100)
   .attr('width', size)
   .attr('height', size)
   .style("fill", d => colorScale(d))

   .style("fill", d => colorScale(d))
   svg.selectAll("continentName")
   .data(continents)
   .enter()
   .append("text")
   .attr("y", -margin.top/2 + size) // Align vertically with the square
   .attr("x", (d, i) => i * (size + 100) + 120)  
   .style("fill", d => colorScale(d))  // Match text color to the square
   .text(d => d) // The actual continent name
   .attr("text-anchor", "left")
   .style('font-size', '13px')
}