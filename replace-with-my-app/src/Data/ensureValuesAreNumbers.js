export default function ensureValuesAreNumbers(object) {
  let transformed = {};
  Object.entries(object).forEach(([key, value]) => {
    transformed[key] = typeof value === 'string' ? parseInt(value, 10) : value;
  });
  return transformed;
}
