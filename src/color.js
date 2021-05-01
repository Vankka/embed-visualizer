function extractRGB(i) {
  return {
    r: (i >> 16) & 0xff,
    g: (i >> 8) & 0xff,
    b: i & 0xff,
  };
}

function combineRGB(r, g, b) {
  if (g === undefined && b === undefined) {
    return (r.r << 16) | (r.g << 8) | r.b;
  }
  return (r << 16) | (g << 8) | b;
}

export { extractRGB, combineRGB };
