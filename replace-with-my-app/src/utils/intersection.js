export default (a, b) => new Set([...a].filter(ai => b.has(ai)));
