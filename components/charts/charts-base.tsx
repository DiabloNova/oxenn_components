"use client";

import type { TooltipProps } from "recharts";
import type { Props as LegendContentProps } from "recharts/types/component/DefaultLegendContent";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { Props as DotProps } from "recharts/types/shape/Dot";
import styles from "./charts.module.css";
import { cx } from "./cx";

/**
 * Selects evenly spaced items from an array. Useful when a chart needs to
 * display a fixed number of representative axis labels.
 */
export const selectEvenlySpacedItems = <T extends readonly unknown[]>(
  dataArray: T,
  count: number,
): Array<T[number]> => {
  if (!dataArray || dataArray.length === 0 || count <= 0) return [];
  if (count === 1) return [dataArray[0]];

  const selectedItems: Array<T[number]> = [];
  if (dataArray.length === 1) {
    for (let index = 0; index < count; index += 1) selectedItems.push(dataArray[0]);
    return selectedItems;
  }

  for (let index = 0; index < count; index += 1) {
    const targetIndex = Math.round((index * (dataArray.length - 1)) / (count - 1));
    selectedItems.push(dataArray[Math.max(0, Math.min(targetIndex, dataArray.length - 1))]);
  }
  return selectedItems;
};

export const ChartLegendContent = ({
  reversed,
  payload,
  align = "left",
  layout = "horizontal",
  className,
}: LegendContentProps & {
  /** Reverse entries to match the visual order of a stacked chart. */
  reversed?: boolean;
  /** Additional class applied to the legend list. */
  className?: string;
}) => {
  const entries = reversed && payload ? [...payload].reverse() : payload;

  return (
    <ul className={cx(styles.legend, layout === "vertical" ? styles.legendVertical : styles.legendHorizontal, align === "right" ? styles.legendRight : align === "center" ? styles.legendCenter : styles.legendLeft, className)}>
      {entries?.map((entry, index) => (
        <li className={styles.legendItem} key={`${String(entry.value)}-${index}`}>
          <span className={cx(styles.legendDot, (entry.payload as { className?: string })?.className)} />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

interface ChartTooltipContentProps extends TooltipProps<ValueType, NameType> {
  isRadialChart?: boolean;
  isPieChart?: boolean;
  label?: string;
  // Recharts' Tooltip payload is typed inconsistently across chart variants.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export const ChartTooltipContent = ({
  active,
  payload,
  label,
  isRadialChart,
  isPieChart,
  formatter,
  labelFormatter,
}: ChartTooltipContentProps) => {
  if (!active || !payload?.length) return null;

  const isSingleDataPoint = payload.length === 1;
  let title = isSingleDataPoint ? payload[0].value : label;
  let secondaryTitle = isSingleDataPoint
    ? isRadialChart || isPieChart
      ? payload[0].payload?.name ?? payload[0].name
      : label
    : payload;

  title =
    isSingleDataPoint && formatter
      ? formatter(title, payload[0].name || label, payload[0], 0, payload)
      : labelFormatter
        ? labelFormatter(title, payload)
        : title;
  secondaryTitle =
    isSingleDataPoint && labelFormatter
      ? labelFormatter(secondaryTitle, payload)
      : secondaryTitle;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTitle}>{title}</p>
      {!secondaryTitle ? null : Array.isArray(secondaryTitle) ? (
        <div>
          {secondaryTitle.map((entry, index) => (
            <p className={styles.tooltipSupporting} key={`${String(entry.name)}-${index}`}>
              {`${entry.name}: ${formatter ? formatter(entry.value, entry.name, entry, index, entry.payload) : entry.value}`}
            </p>
          ))}
        </div>
      ) : (
        <p className={styles.tooltipSupporting}>{secondaryTitle}</p>
      )}
    </div>
  );
};

interface ChartActiveDotProps extends DotProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export const ChartActiveDot = ({ cx: x = 0, cy: y = 0 }: ChartActiveDotProps) => {
  const size = 12;
  return (
    <svg x={x - size / 2} y={y - size / 2} width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="8" height="8" rx="4" className={styles.activeDot} strokeWidth="2" />
    </svg>
  );
};
