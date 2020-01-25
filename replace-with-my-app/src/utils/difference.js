let difference = (a, b) => new Set([...a].filter(ai => !b.has(ai)));

export default difference;
