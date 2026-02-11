console.log('D3 Version:', d3.version);

const width = 600;
const height = 400;
const r = 50; // radius

const svg = d3.select('#vis')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    svg.append('circle')
    //center of the circle
    .attr('cx', width * .5)
    .attr('cy', height * .5)
    // radius of the circle
    .attr('r', r)
    // color of the circle
    .attr('stroke', 'steelblue')
    .style('fill', 'steelblue');

    svg.append('circle')
    //center of the circle
    .attr('cx', width * .25)
    .attr('cy', height * .5)
    // radius of the circle
    .attr('r', r)
    // color of the circle
    .attr('stroke', 'steelblue')
    .style('fill', 'red');

    svg.append('circle')
    //center of the circle
    .attr('cx', width * .75)
    .attr('cy', height * .5)
    // radius of the circle
    .attr('r', r)
    // color of the circle
    .attr('stroke', 'steelblue')
    .style('fill', 'yellow');

    svg.append('rect')
    .attr('x', width * .5 - 20)
    .attr('y', height * .5 - 20 - r * 2)
    .attr('width', 40)
    .attr('height', 40)
    .attr('stroke', 'steelblue')
    .attr('fill', 'steelblue');
