/** Convert degrees to radians */
function toRad(deg: number) { return (deg * Math.PI) / 180 }
/** Convert radians to degrees */
function toDeg(rad: number) { return (rad * 180) / Math.PI }

/**
 * Returns polygon points (as [lat,lng] pairs) for a wind cone sector.
 * center: [lat, lng], bearingDeg: direction wind blows TOWARD,
 * radiusM: cone length in meters, halfAngleDeg: half-angle of sector
 */
export function sectorPolygon(
  center: [number, number],
  bearingDeg: number,
  radiusM: number,
  halfAngleDeg: number = 30,
  steps: number = 16,
): [number, number][] {
  const [lat, lng] = center
  const R = 6371000 // Earth radius in metres
  const d = radiusM / R

  const points: [number, number][] = [[lat, lng]]

  const startAngle = bearingDeg - halfAngleDeg
  const endAngle = bearingDeg + halfAngleDeg

  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + (i / steps) * (endAngle - startAngle)
    const bearing = toRad(angle)
    const latR = toRad(lat)
    const lngR = toRad(lng)

    const newLat = Math.asin(
      Math.sin(latR) * Math.cos(d) +
      Math.cos(latR) * Math.sin(d) * Math.cos(bearing)
    )
    const newLng = lngR + Math.atan2(
      Math.sin(bearing) * Math.sin(d) * Math.cos(latR),
      Math.cos(d) - Math.sin(latR) * Math.sin(newLat)
    )

    points.push([toDeg(newLat), toDeg(newLng)])
  }

  points.push([lat, lng])
  return points
}
