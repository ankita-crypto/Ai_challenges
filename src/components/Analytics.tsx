import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Info,
  Activity
} from 'lucide-react';
import type { MoodLog } from '../types/wellness';
import { TRIGGER_LABELS } from '../utils/wellnessData';

interface AnalyticsProps {
  moodLogs: MoodLog[];
}

const MOOD_RATINGS: Record<number, string> = {
  5: '🌿 Calm',
  4: '⚡ Energized',
  3: '🌫️ Uncertain',
  2: '😰 Stressed',
  1: '🔋 Burned Out'
};

export const Analytics: React.FC<AnalyticsProps> = ({ moodLogs }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (moodLogs.length < 2) {
    return (
      <div className="analytics-empty glass-panel slide-in">
        <BarChart2 size={64} className="empty-chart-icon" />
        <h2>Not Enough Data Yet</h2>
        <p>We need at least 2 check-in entries to generate trend lines and trigger correlation analyses.</p>
        <span className="empty-sub">Head over to the Check-In tab to log how you are feeling right now!</span>
      </div>
    );
  }

  // Sort logs chronologically
  const sortedLogs = [...moodLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Take up to last 10 logs for readability on smaller charts
  const displayLogs = sortedLogs.slice(-10);

  // 1. Calculate general statistics
  const totalLogs = moodLogs.length;
  const avgRating = moodLogs.reduce((acc, curr) => acc + curr.rating, 0) / totalLogs;

  // Calculate trigger occurrences
  const triggerCounts: Record<string, number> = {};
  moodLogs.forEach(log => {
    if (log.triggers && Array.isArray(log.triggers)) {
      log.triggers.forEach((t: string) => {
        triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      });
    }
  });

  const sortedTriggers = Object.entries(triggerCounts)
    .map(([id, count]) => ({
      id,
      name: TRIGGER_LABELS[id as keyof typeof TRIGGER_LABELS] || 'Recorded trigger',
      count,
      percentage: Math.round((count / totalLogs) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  const topTriggerObj = sortedTriggers[0];
  const topTriggerText = topTriggerObj ? `${topTriggerObj.name} (${topTriggerObj.count} times)` : 'None recorded';

  // 2. Custom SVG Chart Dimensions
  const chartWidth = 600;
  const chartHeight = 250;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  // Coordinate mapper helper
  // rating values are 1 to 5. We map 1 -> bottom, 5 -> top
  const getCoordinates = (index: number, rating: number) => {
    const x = paddingLeft + (index / (displayLogs.length - 1)) * graphWidth;
    const y = paddingTop + graphHeight - ((rating - 1) / 4) * graphHeight;
    return { x, y };
  };

  // Generate SVG path string
  let pathD = '';
  let areaD = '';
  const points: { x: number; y: number; date: string; rating: number; mood: string }[] = [];

  displayLogs.forEach((log, idx) => {
    const coords = getCoordinates(idx, log.rating);
    const dateFormatted = new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    points.push({
      x: coords.x,
      y: coords.y,
      date: dateFormatted,
      rating: log.rating,
      mood: MOOD_RATINGS[log.rating] || log.mood
    });

    if (idx === 0) {
      pathD = `M ${coords.x} ${coords.y}`;
      areaD = `M ${coords.x} ${paddingTop + graphHeight} L ${coords.x} ${coords.y}`;
    } else {
      pathD += ` L ${coords.x} ${coords.y}`;
      areaD += ` L ${coords.x} ${coords.y}`;
    }

    if (idx === displayLogs.length - 1) {
      areaD += ` L ${coords.x} ${paddingTop + graphHeight} Z`;
    }
  });

  return (
    <div className="analytics-layout slide-in">
      {/* Stats Summary Grid */}
      <section className="grid-3 stats-summary-cards">
        <div className="analytics-card glass-panel">
          <span className="card-label">Average Wellness Index</span>
          <span className="card-value">{avgRating.toFixed(1)} / 5.0</span>
          <span className="card-sub">{avgRating >= 4.0 ? '🌿 Doing Great!' : avgRating >= 3.0 ? '🌫️ Fair' : '😰 Highly Stressed'}</span>
        </div>
        
        <div className="analytics-card glass-panel">
          <span className="card-label">Top Stress Trigger</span>
          <span className="card-value top-trigger-val">{topTriggerObj ? topTriggerObj.name : 'N/A'}</span>
          <span className="card-sub">{topTriggerText}</span>
        </div>

        <div className="analytics-card glass-panel">
          <span className="card-label font-title">Total Records</span>
          <span className="card-value">{totalLogs} Entries</span>
          <span className="card-sub">Tracking consistency active</span>
        </div>
      </section>

      <div className="grid-2 main-analytics-grid">
        {/* SVG Trend Chart */}
        <section className="chart-panel glass-panel">
          <div className="panel-header">
            <TrendingUp size={20} className="header-icon primary-color" />
            <h3>Mood Trend (Last 10 entries)</h3>
          </div>
          <div className="svg-container">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="trend-svg" role="img" aria-label="Mood trend chart for recent check-ins">
              <defs>
                <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines and Y axis labels */}
              {[1, 2, 3, 4, 5].map((level) => {
                const y = paddingTop + graphHeight - ((level - 1) / 4) * graphHeight;
                return (
                  <g key={level} className="grid-line-group">
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={chartWidth - paddingRight} 
                      y2={y} 
                      stroke="var(--glass-border)" 
                      strokeDasharray="4 4"
                    />
                    <text 
                      x={paddingLeft - 12} 
                      y={y + 4} 
                      className="y-axis-label" 
                      textAnchor="end"
                    >
                      {level}
                    </text>
                  </g>
                );
              })}

              {/* X axis labels */}
              {points.map((pt, idx) => (
                <text 
                  key={idx} 
                  x={pt.x} 
                  y={paddingTop + graphHeight + 24} 
                  className="x-axis-label"
                  textAnchor="middle"
                >
                  {pt.date}
                </text>
              ))}

              {/* Chart Gradient Area */}
              <path d={areaD} fill="url(#chartAreaGradient)" />

              {/* Chart Main Trend Line */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="var(--color-primary)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Interactive Circle Nodes */}
              {points.map((pt, idx) => (
                <g 
                  key={idx}
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer glow ring on hover */}
                  {hoveredPoint === idx && (
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="9" 
                      fill="var(--color-primary-glow)" 
                      stroke="var(--color-primary)" 
                      strokeWidth="1.5"
                    />
                  )}
                  {/* Main dot node */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="5" 
                    fill={hoveredPoint === idx ? 'var(--color-secondary)' : 'var(--color-primary)'} 
                    stroke="var(--text-primary)" 
                    strokeWidth="1.5"
                    tabIndex={0}
                    aria-label={`${pt.date}: ${pt.mood}, wellness index ${pt.rating} out of 5`}
                    onFocus={() => setHoveredPoint(idx)}
                    onBlur={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint !== null && (
              <div 
                className="chart-tooltip glass-panel"
                style={{
                  left: `${(points[hoveredPoint].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredPoint].y / chartHeight) * 100 - 32}%`
                }}
              >
                <span className="tooltip-date">{points[hoveredPoint].date}</span>
                <span className="tooltip-mood">Mood: {points[hoveredPoint].mood}</span>
                <span className="tooltip-rating">Index: {points[hoveredPoint].rating}/5</span>
              </div>
            )}
          </div>
          <div className="chart-legend-info">
            <Info size={14} />
            <span>Score Mapping: 5 = Calm & Focused, 1 = Exhausted. Hover dots to see details.</span>
          </div>
        </section>

        {/* Triggers Breakdown */}
        <section className="triggers-panel glass-panel">
          <div className="panel-header">
            <Activity size={20} className="header-icon secondary-color" />
            <h3>Stress Trigger Prevalence</h3>
          </div>
          <div className="triggers-chart-list">
            {sortedTriggers.length === 0 ? (
              <div className="empty-triggers">
                <p>No triggers recorded in your logs yet.</p>
              </div>
            ) : (
              sortedTriggers.map((trg) => (
                <div key={trg.id} className="trigger-bar-row">
                  <div className="trigger-bar-meta">
                    <span className="trigger-bar-name">{trg.name}</span>
                    <span className="trigger-bar-pct">{trg.count} times ({trg.percentage}%)</span>
                  </div>
                  <div className="trigger-bar-container">
                    <div 
                      className="trigger-bar-fill" 
                      style={{ width: `${trg.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style>{`
        .analytics-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .analytics-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 64px 32px;
          gap: 16px;
        }

        .empty-chart-icon {
          color: var(--glass-border);
        }

        .empty-sub {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .stats-summary-cards {
          margin-bottom: 8px;
        }

        .analytics-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .card-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .card-value {
          font-family: var(--font-header);
          font-size: 1.8rem;
          font-weight: 800;
        }

        .top-trigger-val {
          font-size: 1.4rem;
          line-height: 1.25;
        }

        .card-sub {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 10px;
        }

        .header-icon.primary-color {
          color: var(--color-primary);
        }

        .header-icon.secondary-color {
          color: var(--color-secondary);
        }

        /* SVG Trend Chart Styles */
        .svg-container {
          position: relative;
          width: 100%;
        }

        .trend-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .grid-line-group line {
          stroke: var(--glass-border);
        }

        .y-axis-label, .x-axis-label {
          fill: var(--text-muted);
          font-size: 0.75rem;
          font-family: var(--font-body);
        }

        .chart-tooltip {
          position: absolute;
          transform: translate(-50%, -100%);
          padding: 8px 12px;
          border-radius: 8px;
          pointer-events: none;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(15, 14, 30, 0.9);
          border: 1px solid var(--color-primary);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        .tooltip-date {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .tooltip-mood {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .tooltip-rating {
          font-size: 0.8rem;
          color: var(--color-secondary);
        }

        .chart-legend-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 0.75rem;
          margin-top: 14px;
        }

        /* Triggers Panel Styles */
        .triggers-chart-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trigger-bar-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .trigger-bar-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .trigger-bar-name {
          font-weight: 500;
        }

        .trigger-bar-pct {
          color: var(--text-muted);
        }

        .trigger-bar-container {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .trigger-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-secondary) 0%, #14b8a6 100%);
          border-radius: 4px;
          box-shadow: 0 0 8px var(--color-secondary-glow);
          transition: width 0.8s ease-out;
        }

        .empty-triggers {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
