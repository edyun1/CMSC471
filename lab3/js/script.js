const margin = {top: 40, right: 40, bottom: 40, left: 60};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// The margin code above

// Create SVG
const svg = d3.select('#vis')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


const xScale = d3.scaleLinear() // a numeric / quantative scale
    .domain([0, 100]) // prefined data range
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 100]) // prefined data range
    .range([height, 0]);

const xAxis = d3.axisBottom(xScale);

svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

const yAxis = d3.axisLeft(yScale);

svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);


let currentData = []; // global variable

d3.json('data/data.json')
    //callback function
    .then(data => {
        console.log(data)
        currentData = data.points
        updateVis()
    })
    .catch(error => console.error('Error loading data:', error))

function updateVis(){  
    // Now, the class point is important. 
    // To make sure we can manipulate circles, we need to select all .point elements. 
    // And thus, all circles created should have this class name (see below).
    svg.selectAll('.point')
    // using the global variable
    .data(currentData)
    .join(
            function(enter){ 
                return  enter
                    .append('circle')
                    .attr('cx', d => xScale(d.x))
                    .attr('cy', d => yScale(d.y))
                    .attr('r', 5)
                    .style('fill', d => d.color)
                    // Important. All new circles should be associated with the point class
                    .attr('class', 'point')
            },
            function(update){ 
                return  update
                    .transition()
                    .attr('cx', d => xScale(d.x))
                    .attr('cy', d => yScale(d.y))
            }, 
            function(exit){ 
                return  exit.remove()
            }
    )
}

function addRandomPoint() {
    // make it easier for debugging
    console.log('add point')
    const newPoint = {
        x: Math.random() * 100,// finish the code, generate a number between 0 - 100
        y: Math.random() * 100,// finish the code, generate a number between 0 - 100
        color: 'red'
    };
    currentData.push(newPoint);
    // call to update visualization
    updateVis();
}

function removeRandomPoint() {
    // make it easier for debugging
    console.log('remove point')
    currentData.pop();
    // call to update visualization
    updateVis();
}

function updateRandomPoints() {
    // make it easier for debugging
    console.log('update points')
    currentData = currentData.map(d => ({
        id: currentData.length + 1,
        x: Math.max(0, Math.min(100, d.x + (Math.random() * 10 - 5))),
        y: Math.max(0, Math.min(100, d.y + (Math.random() * 10 - 5)))
    }));
    // call to update visualization
    updateVis();
}