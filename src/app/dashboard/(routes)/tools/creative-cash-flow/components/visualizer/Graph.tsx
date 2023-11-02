'use client';

import { useAtomValue } from 'jotai';
import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
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

// util
const formatDate = timeFormat("%b %d, '%y");
const tickLabelProps = {
  fill: tickLabelColor,
  fontSize: 12,
  fontFamily: 'sans-serif',
  textAnchor: 'middle',
} as const;

// accessors
const getDate = (data: VisualizeCcf) => new Date(data.range.start);
const bisectDate = bisector<VisualizeCcf, Date>((d) => new Date(d.range.start)).left;

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

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const scalePaddingX = 50;
    const scalePaddingY = 30;

    // accessors
    const getCcfValue = (data: VisualizeCcf) => {
      return !data ? 0 : data[dataKey];
    };

    // Adjust the scales to include padding
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left + scalePaddingX, innerWidth + margin.left - scalePaddingX],
          domain: extent(data, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left, data, scalePaddingX]
    );

    const ccfValueScale = useMemo(
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
        const x0 = dateScale.invert(x);
        const index = bisectDate(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: ccfValueScale(getCcfValue(d)),
        });
      },
      [showTooltip, ccfValueScale, dateScale, data]
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
          <GridRows
            left={margin.left}
            scale={ccfValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed<VisualizeCcf>
            data={data}
            x={(d) => dateScale(getDate(d)) ?? 0 + scalePaddingX}
            y={(d) => ccfValueScale(getCcfValue(d)) ?? 0 + scalePaddingY}
            yScale={ccfValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          <AxisLeft
            left={margin.left + scalePaddingX}
            scale={ccfValueScale}
            numTicks={numTicksForHeight(height)}
            stroke={axisColor}
            // tickStroke={axisColor}
            tickStroke="transparent"
            tickFormat={(d) =>
              dollarFormatter(d.valueOf(), {
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
            scale={dateScale}
            numTicks={numTicksForWidth(width)}
            stroke={axisColor}
            tickStroke={axisColor}
            tickLabelProps={() => tickLabelProps}
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
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 14}
              left={tooltipLeft}
              style={tooltipStyles}
            >
              {`$${getCcfValue(tooltipData)}`}
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
              {formatDate(getDate(tooltipData))}
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

export function Graph({ dataKey, height, width }: VisualizerResultsProps) {
  const data = useAtomValue(visualizeCcfAtom);

  return <Base data={data} dataKey={dataKey} width={width} height={height} />;
}
