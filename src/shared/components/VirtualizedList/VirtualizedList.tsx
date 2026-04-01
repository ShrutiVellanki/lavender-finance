import React, { useMemo, useRef, useState, UIEvent } from "react";
import type { VirtualizedListProps } from "./VirtualizedList.types";

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  overscan = 4,
  renderItem,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, height, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    setScrollTop(event.currentTarget.scrollTop);
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        width: "100%",
        minWidth: 200,
        height,
        overflowY: "auto",
        position: "relative",
        border: "1px solid var(--border)",
        borderRadius: 10,
      }}
      role="list"
      aria-label="Virtualized list"
    >
      <div
        style={{
          width: "100%",
          minWidth: 200,
          height: totalHeight,
          position: "relative",
        }}
      >
        {visibleItems.map((item, offset) => {
          const index = visibleRange.startIndex + offset;
          const top = index * itemHeight;

          return (
            <div
              key={index}
              role="listitem"
              style={{
                position: "absolute",
                top,
                left: 0,
                right: 0,
                height: itemHeight,
                boxSizing: "border-box",
              }}
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
