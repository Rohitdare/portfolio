'use client';

import { useState, useEffect } from 'react';
import { ContributionData, ContributionDay } from '@/types/portfolio';

const COLORS = ['#DDD5C5', '#F5B5B8', '#EE7B83', '#E63946', '#B5232F'];

export default function HeatmapGrid() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [totalCount, setTotalCount] = useState<string>('101 contributions in the last year');
  const [monthLabels, setMonthLabels] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadContributions() {
      let loadedData: ContributionData | null = null;

      // 1. Live GitHub contributions API
      try {
        const res = await fetch('https://github-contributions-api.jogruber.de/v4/Rohitdare?y=last', {
          signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(3500) : undefined,
        });
        if (res.ok) {
          loadedData = await res.json();
        }
      } catch {
        // Fall back to local json
      }

      // 2. Local fallback
      if (!loadedData?.contributions) {
        try {
          const localRes = await fetch('/data/github-contributions.json');
          if (localRes.ok) {
            loadedData = await localRes.json();
          }
        } catch {
          // Both failed
        }
      }

      if (!isMounted) return;

      if (loadedData?.contributions) {
        setData(loadedData);

        const total = loadedData.total?.lastYear ??
          (typeof loadedData.total === 'object' ? Object.values(loadedData.total)[0] : 101);
        setTotalCount(`${Number(total).toLocaleString()} contributions in the last year`);

        // Compute month labels
        const activeMonths: string[] = [];
        let lastMonth = -1;
        loadedData.contributions.forEach((c) => {
          const m = new Date(c.date + 'T00:00:00').getMonth();
          if (m !== lastMonth) {
            activeMonths.push(new Date(c.date + 'T00:00:00').toLocaleString('en-US', { month: 'short' }).toUpperCase());
            lastMonth = m;
          }
        });
        setMonthLabels(activeMonths);
      }
    }

    loadContributions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Split into weeks of 7
  const weeks: (ContributionDay | null)[][] = [];
  if (data?.contributions) {
    for (let i = 0; i < data.contributions.length; i += 7) {
      const week: (ContributionDay | null)[] = data.contributions.slice(i, i + 7);
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }
  } else {
    // Fallback 52 weeks of 7 days
    for (let w = 0; w < 52; w++) {
      weeks.push(new Array(7).fill(null));
    }
  }

  const handleCellClick = (date?: string) => {
    if (date) {
      window.open(`https://github.com/Rohitdare?tab=overview&from=${date}&to=${date}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="heatmap-panel">
      <div className="heatmap-header">
        <div className="heatmap-title-group">
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--vermilion)' }}>
            commit
          </span>
          <span className="heatmap-title">CONTRIBUTION MATRIX // @Rohitdare</span>
        </div>
        <span id="heatmap-total-count" className="heatmap-count">
          {totalCount}
        </span>
      </div>

      {/* Month Labels */}
      <div id="heatmap-months-row" className="heatmap-months-row">
        {monthLabels.length > 0 ? (
          monthLabels.map((name, idx) => <span key={`${name}-${idx}`}>{name}</span>)
        ) : (
          ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'].map((m, idx) => (
            <span key={`${m}-${idx}`}>{m}</span>
          ))
        )}
      </div>

      {/* 52-Week Dot Canvas Grid */}
      <div className="heatmap-scroll-area">
        <div id="heatmap-grid" className="heatmap-grid">
          {weeks.map((week, colIdx) => (
            <div key={`col-${colIdx}`} className="heatmap-col">
              {week.map((day, rowIdx) => {
                if (day) {
                  const count = day.count || 0;
                  const level = Math.min(4, Math.max(0, day.level || 0));
                  const dateObj = new Date(day.date + 'T00:00:00');
                  const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const title = `${count} contribution${count === 1 ? '' : 's'} on ${formattedDate}`;
                  return (
                    <span
                      key={day.date}
                      className="heatmap-cell"
                      style={{ backgroundColor: COLORS[level] }}
                      title={title}
                      data-date={day.date}
                      data-commits={count}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCellClick(day.date)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCellClick(day.date)}
                    />
                  );
                }
                return (
                  <span
                    key={`empty-${colIdx}-${rowIdx}`}
                    className="heatmap-cell"
                    style={{ backgroundColor: data ? undefined : COLORS[0], visibility: data ? 'hidden' : 'visible' }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Barcode Stamp */}
      <div className="heatmap-footer">
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-swatches">
            {COLORS.map((c, i) => (
              <span key={i} className="legend-pip" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span>More</span>
        </div>

        <div className="barcode-stamp">
          <div className="barcode-bars">
            <span className="barcode-bar" style={{ width: '2px' }} />
            <span className="barcode-bar" style={{ width: '1px' }} />
            <span className="barcode-bar" style={{ width: '3px' }} />
            <span className="barcode-bar" style={{ width: '1.5px' }} />
            <span className="barcode-bar" style={{ width: '4px' }} />
            <span className="barcode-bar" style={{ width: '1px' }} />
            <span className="barcode-bar" style={{ width: '2px' }} />
          </div>
          <span className="barcode-label">AUTH_COMMIT_LOG</span>
        </div>
      </div>
    </div>
  );
}
