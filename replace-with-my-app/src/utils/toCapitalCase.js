export default function toCapitalCase(string) {
  if (!string) return null;
  return string
    .toLowerCase()
    .replace(/(^|[^a-zA-Z\u00C0-\u017F'])([a-zA-Z\u00C0-\u017F])/g, function(
      m
    ) {
      return m.toUpperCase();
    });
}

export let capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1);
