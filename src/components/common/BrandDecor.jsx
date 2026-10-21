/** Orange square grid echoing the Meridian globe mark — purely decorative. */
export function GlobePattern({ className }) {
  const cells = []
  for (let r = 0; r < 7; r += 1) {
    for (let c = 0; c < 7; c += 1) {
      const d = Math.hypot(c - 3, r - 3)
      if (d <= 3.4) cells.push(<rect key={`${r}-${c}`} x={c * 14} y={r * 14} width={10} height={10} rx={1.5} opacity={1 - d / 4.2} />)
    }
  }
  return (
    <svg viewBox="-4 -4 104 104" className={className} aria-hidden="true">
      <g fill="#F78D00">{cells}</g>
      <circle cx="47" cy="47" r="49" fill="none" stroke="#F78D00" strokeWidth="2" opacity="0.6" />
    </svg>
  )
}
