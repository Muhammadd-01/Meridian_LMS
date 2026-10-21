/**
 * Chart colours. The categorical order is fixed (never cycled) and was validated for
 * lightness band, chroma floor, colour-vision-deficiency separation and 3:1 contrast
 * against a light surface. Single-series charts use the brand primary.
 */
export const CHART_SERIES = ['#00829E', '#D97400', '#2F95C8', '#A33F72', '#5E8C1F', '#7A5CC8']
export const CHART_PRIMARY = '#2C5F6F'
export const CHART_ACCENT = '#D97400'
export const CHART_GRID = '#E2E8F0'
export const CHART_AXIS = '#64748B'

export const axisProps = {
  tick: { fill: CHART_AXIS, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: CHART_GRID },
}

export const tooltipProps = {
  cursor: { fill: 'rgba(44, 95, 111, 0.06)' },
  contentStyle: {
    borderRadius: 10,
    border: '1px solid #E2E8F0',
    boxShadow: '0 8px 24px -8px rgba(9,63,80,0.18)',
    fontSize: 13,
    color: '#17212B',
  },
  labelStyle: { fontWeight: 600, color: '#17212B', marginBottom: 4 },
}
