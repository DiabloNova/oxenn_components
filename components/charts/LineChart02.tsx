"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartLegendContent, ChartTooltipContent } from "./charts-base";
import styles from "./charts.module.css";
import { cx } from "./cx";

const lineData = [
  { date: new Date(2026, 0, 1), A: 600, B: 400, C: 100 },
  { date: new Date(2026, 1, 1), A: 620, B: 405, C: 160 },
  { date: new Date(2026, 2, 1), A: 630, B: 400, C: 170 },
  { date: new Date(2026, 3, 1), A: 650, B: 410, C: 190 },
  { date: new Date(2026, 4, 1), A: 600, B: 320, C: 200 },
  { date: new Date(2026, 5, 1), A: 650, B: 430, C: 230 },
  { date: new Date(2026, 6, 1), A: 620, B: 400, C: 200 },
  { date: new Date(2026, 7, 1), A: 750, B: 540, C: 300 },
  { date: new Date(2026, 8, 1), A: 780, B: 490, C: 390 },
  { date: new Date(2026, 9, 1), A: 750, B: 450, C: 300 },
  { date: new Date(2026, 10, 1), A: 780, B: 480, C: 340 },
  { date: new Date(2026, 11, 1), A: 820, B: 500, C: 450 },
];

export function LineChart02() {
  const gradientId = useId().replace(/:/g, "");

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={lineData}
          className={styles.chartSvg}
          margin={{ left: 5, right: 8, top: 12, bottom: 8 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b7bb4" stopOpacity="0.58" />
              <stop offset="95%" stopColor="#8b7bb4" stopOpacity="0" />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#e7e4ec" />
          <Legend
            verticalAlign="top"
            align="right"
            layout="horizontal"
            content={<ChartLegendContent className={styles.chartLegend} />}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tickFormatter={(value: Date) => value.toLocaleDateString(undefined, { month: "short" })}
            padding={{ left: 10, right: 10 }}
            tick={{ fill: "#85818e", fontSize: 11 }}
          >
            <Label value="Month" fill="#85818e" position="insideBottom" offset={-4} className={styles.axisLabel} />
          </XAxis>
          <YAxis
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tickFormatter={(value: number) => Number(value).toLocaleString()}
            tick={{ fill: "#85818e", fontSize: 11 }}
          >
            <Label
              value="Active users"
              fill="#85818e"
              className={styles.axisLabel}
              style={{ textAnchor: "middle" }}
              angle={-90}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip
            content={<ChartTooltipContent />}
            formatter={(value: number) => Number(value).toLocaleString()}
            labelFormatter={(value: Date) => value.toLocaleDateString(undefined, { month: "short", year: "numeric" })}
            cursor={{ stroke: "#8b7bb4", strokeWidth: 1.5 }}
          />
          <Area
            isAnimationActive={false}
            className={cx(styles.seriesA, styles.areaOffset)}
            dataKey="A"
            name="Series 1"
            type="monotone"
            stroke="#8b7bb4"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            fillOpacity={0.14}
            activeDot={{ className: styles.activeDotShape }}
          />
          <Area
            isAnimationActive={false}
            className={cx(styles.seriesB, styles.areaOffset)}
            dataKey="B"
            name="Series 2"
            type="monotone"
            stroke="#b4a8cf"
            strokeWidth={2}
            fill="none"
            strokeDasharray="0.1 8"
            strokeLinecap="round"
            activeDot={{ className: styles.activeDotShape }}
          />
          <Area
            isAnimationActive={false}
            className={cx(styles.seriesC, styles.areaOffset)}
            dataKey="C"
            name="Series 3"
            type="monotone"
            stroke="#70618f"
            strokeWidth={2}
            fill="none"
            strokeDasharray="0.1 8"
            strokeLinecap="round"
            activeDot={{ className: styles.activeDotShape }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
