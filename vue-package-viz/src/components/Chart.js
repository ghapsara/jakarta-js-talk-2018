import * as d3 from 'd3';

export const WIDTH = window.innerWidth - 300;
export const HEIGHT = window.innerHeight;
const RADIUS_RANGE = [30, 100];
const CIRCLE_MARGIN = 5;
const TEXT_COLOR = 'white';
const TRACK_FONT_SIZE = 12;
export const MAIN_COLOR = '#fce000';

export const numberFormatter = num => {
  return d3.format('.2f')(num);
};

const Chart = (ref, data) => {
  const container = d3
    .select(ref)
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  const rScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map(d => d.approximateSize)))
    .range(RADIUS_RANGE);

  const isSingleDep = data.length === 1;

  const chartData = data.map(d => ({
    id: d.name,
    name: d.name,
    size: d.approximateSize,
    radius: rScale(d.approximateSize)
  }));

  const simulation = d3
    .forceSimulation(chartData)
    .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .force('collide', d3.forceCollide().radius(d => d.radius + CIRCLE_MARGIN))
    .stop();

  for (let index = 0; index < 120; index++) {
    simulation.tick();
  }

  const nodes = container.selectAll('.nodes').data(chartData);

  nodes.exit().remove();

  let cell = nodes
    .enter()
    .append('g')
    .attr('class', 'nodes');

  cell
    .append('circle')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .attr('r', 0);

  cell
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-weight', 'bold')
    .attr('fill', TEXT_COLOR)
    .attr('font-size', TRACK_FONT_SIZE)
    .attr('opacity', d => (d.radius > 50 || isSingleDep ? 1 : 0))
    .text(d => d.name)
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  // UPDATE
  cell = nodes.merge(cell);

  cell
    .select('circle')
    .transition()
    .duration(1000)
    .ease(d3.easeBackOut)
    .attr('r', d => (isSingleDep ? RADIUS_RANGE[1] : d.radius))
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  cell
    .select('text')
    .attr('opacity', d => (d.radius > 50 || isSingleDep ? 1 : 0))
    .text(d => d.name)
    .transition()
    .duration(1000)
    .ease(d3.easeBackOut)
    .attr('transform', d => `translate(${d.x}, ${d.y})`);
};

export default Chart;
