export function getPlaceValue(n, place) {
  return Math.floor((n % (place * 10)) / place)
}