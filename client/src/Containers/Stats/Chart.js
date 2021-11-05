import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Axis from './Axis';
import Line from './Line';
import classes from './stats.css';

const margin = { top: 10, right: 10, bottom: 40, left: 50 };

const Chart = ({ state }) => {
  const {
    lines,
    units,
    maxY,
    durationDisplay = 0,
    startDateF,
    endDateF,
  } = state;
  const [[height, width], setDimensions] = useState([0, 0]);
  const graph = useRef(null);
  const x = useCallback(
    d3
      .scaleLinear()
      .domain([0, durationDisplay])
      .range([0, width])
      .nice(),
    [durationDisplay, width]
  );
  const y = useCallback(
    d3
      .scaleLinear()
      .domain([0, maxY])
      .range([height, 0])
      .nice(),
    [durationDisplay, height, maxY]
  );

  useEffect(() => {
    if (graph.current) {
      const {
        width: updatedWidth,
        height: updatedHeight,
      } = graph.current.getBoundingClientRect();
      setDimensions([
        updatedHeight - margin.top - margin.bottom,
        updatedWidth - margin.left - margin.right,
      ]);
    }
  }, []);
  // console.log({ xAxis: d3.axisBottom(x), y, lines });
  // console.log(lines.length > 0, x.domain().length, y.domain().length);
  return (
    <div className={classes.Graph} ref={graph} data-testid="chart">
      {lines.length > 0 &&
      x.domain().length === 2 &&
      y.domain().length === 2 ? (
        <svg height="100%" width="100%" className={classes.svgContainer}>
          <Axis
            isXAxis
            scale={x}
            height={height}
            width={width}
            left={margin.left}
          />
          <Axis
            isXAxis={false}
            left={margin.left}
            scale={y}
            width={width}
            height={height}
          />
          {lines.map((line, index) => (
            <Line
              key={line.color + String(index)} // Through various flukes, sometimes users can have the same color
              leftMargin={margin.left}
              data={line.data}
              color={line.color}
              x={x}
              y={y}
            />
          ))}
          {/* <path
              className={classes.line}
              d={linePath}
              transform={`translate(${margin.left}, 0)`}
            /> */}
          <text transform={`translate(${width / 2}, ${height + 40})`}>
            Time ({units})
          </text>
          <text transform={`rotate(-90) translate(${(height + 40) / -2}, 12)`}>
            # of events
          </text>
          <text
            className={classes.ChartDate}
            transform={`translate(${0}, ${height + 40})`}
          >
            {startDateF}
          </text>
          <text
            className={classes.ChartDate}
            transform={`translate(${width - 65}, ${height + 40})`}
          >
            {endDateF}
          </text>
        </svg>
      ) : null}
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.shape({}),
  state: PropTypes.shape({}).isRequired,
};

Chart.defaultProps = {
  data: null,
};

export default Chart;
