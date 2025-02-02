'use client';

import { useAtomValue } from 'jotai';
import React, { useMemo, useCallback } from 'react';
import { Line, Bar } from '@visx/shape';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from '@visx/vendor/d3-array';
import { timeFormat } from '@visx/vendor/d3-time-format';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { visualizeCcfAtom } from '../../atoms';
import type { VisualizeCcf, VisualizeCcfDataKey } from '../../types';

type TooltipData = VisualizeCcf;

const axisColor = '#fff';
const tickLabelColor = '#fff';
const background = '#3b6978';
const background2 = '#204051';
const accentColor = '#edffea';
const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

type Interval = 'weekly' | 'monthly';

function generateTestData(numberOfDataPoints: number, interval: Interval): VisualizeCcf[] {
  const testData: VisualizeCcf[] = [];
  for (let i = 0; i < numberOfDataPoints; i++) {
    const end = new Date();
    const start = new Date();
    if (interval === 'weekly') {
      start.setDate(end.getDate() - 7 * i);
    } else if (interval === 'monthly') {
      start.setMonth(end.getMonth() - i);
    }
    const collections = Math.floor(Math.random() * 10000);
    const waa = Math.floor(Math.random() * 8000);
    const balance = Math.floor(Math.random() * 10000);
    testData.push({ range: { start, end }, collections, waa, balance });
  }
  return testData;
}

// util
const formatDate = timeFormat("%b %d, '%y");
const tickLabelProps = {
  fill: tickLabelColor,
  fontSize: 12,
  fontFamily: 'sans-serif',
  textAnchor: 'middle',
} as const;

// accessors
const getDate = (data: VisualizeCcf) => formatDate(new Date(data.range.start));
const getFormattedDateRange = (data: VisualizeCcf) =>
  `${formatDate(data.range.start)} - ${formatDate(data.range.end)}`;

type AreaProps = {
  data: VisualizeCcf[];
  dataKey: VisualizeCcfDataKey;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const Base = withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    data,
    dataKey,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (!dataKey) {
      throw new Error('dataKey is required');
    }

    if (width < 10) return null;

    // const test_data = useMemo(() => {
    //   return generateTestData(30, 'monthly');
    // }, []);

    // data = test_data;

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const scalePaddingX = 55;
    const scalePaddingY = 30;
    const yMax = innerHeight - scalePaddingY;
    // accessors
    const getCcfValue = (data: VisualizeCcf) => {
      return !data ? 0 : data[dataKey];
    };

    // Adjust the scales to include padding
    const xScale = useMemo(
      () =>
        scaleBand({
          domain: data.map(getDate),
          range: [margin.left, width - margin.right - scalePaddingX],
          padding: 0.2,
        }),
      [innerWidth, margin.left, data, scalePaddingX]
    );

    const yScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top - scalePaddingY, margin.top + scalePaddingY],
          domain: [0, (max(data, getCcfValue) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight, data, scalePaddingY]
    );

    // Define the number of ticks for the axes
    const numTicksForHeight = (height: number) => {
      if (height <= 300) return 3;
      if (300 < height && height <= 600) return 5;
      return 6;
    };

    const numTicksForWidth = (width: number) => {
      if (width <= 300) return 3;
      if (300 < width && width <= 400) return 5;
      return 6;
    };

    // tooltip handler
    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const adjustedX = x - margin.left - scalePaddingX;
        const step = xScale.bandwidth() + xScale.step() * xScale.padding();
        const index = Math.round(adjustedX / step);
        const d = data[index];

        showTooltip({
          tooltipData: d,
          // tooltipLeft: (xScale(getDate(d)) ?? 0) + scalePaddingX,
          tooltipLeft: x + xScale.bandwidth() / 2,
          tooltipTop: yScale(getCcfValue(d)),
        });
      },
      [margin.left, scalePaddingX, xScale.bandwidth(), data, showTooltip, yScale, getCcfValue]
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
          <Group left={margin.left + scalePaddingX}>
            {data.map((d, index) => {
              const barWidth = xScale.bandwidth();
              const barHeight = yMax - (yScale(getCcfValue(d)) ?? 0);
              const barX = xScale(getDate(d)) ?? 0;
              const barY = yScale(getCcfValue(d)) ?? 0;
              return (
                <Bar
                  key={`bar-${index}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="rgba(23, 233, 217, .5)"
                />
              );
            })}
            <AxisLeft
              scale={yScale}
              numTicks={numTicksForHeight(height)}
              stroke={axisColor}
              // tickStroke={axisColor}
              tickStroke="transparent"
              tickFormat={(d, i) =>
                i === 0
                  ? ''
                  : dollarFormatter(d.valueOf(), {
                      maximumFractionDigits: 0,
                    })
              }
              tickLabelProps={(d) => ({
                ...tickLabelProps,
                dx: d.valueOf() >= 1000 ? -16 : -13,
                dy: 4,
              })}
            />
            <AxisBottom
              top={innerHeight + margin.top - scalePaddingY}
              scale={xScale}
              // tickFormat={(d) => timeFormat('%B')(new Date(d))}
              numTicks={numTicksForWidth(width)}
              stroke={axisColor}
              tickStroke={axisColor}
              tickLabelProps={() => tickLabelProps}
            />
          </Group>
          <Group>
            <Bar
              id="test"
              x={margin.left + scalePaddingX}
              y={margin.top + scalePaddingY}
              width={width - scalePaddingX}
              height={innerHeight - scalePaddingY * 2}
              fill="transparent"
              rx={14}
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />
            {tooltipData && (
              <g>
                <Line
                  from={{ x: tooltipLeft, y: margin.top }}
                  to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                  stroke={accentColorDark}
                  strokeWidth={2}
                  pointerEvents="none"
                  strokeDasharray="5,2"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop + 1}
                  r={4}
                  fill="black"
                  fillOpacity={0.1}
                  stroke="black"
                  strokeOpacity={0.1}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop}
                  r={4}
                  fill={accentColorDark}
                  stroke="white"
                  strokeWidth={2}
                  pointerEvents="none"
                />
              </g>
            )}
          </Group>
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 14}
              left={tooltipLeft}
              style={tooltipStyles}
            >
              {`${dollarFormatter(getCcfValue(tooltipData))}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {getFormattedDateRange(tooltipData)}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);

interface VisualizerResultsProps {
  dataKey: VisualizeCcfDataKey;
  height: number;
  width: number;
}

export function BarChart({ dataKey, height, width }: VisualizerResultsProps) {
  const data = useAtomValue(visualizeCcfAtom);

  return <Base data={data} dataKey={dataKey} width={width} height={height} />;
}
