

function getFontSizeToFit(text, fontFace, maxWidth) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `1px ${fontFace}`;
    return maxWidth / ctx.measureText(text).width;
}
function getUniqueIntegers(n, min, max) {
  if (max - min + 1 < n) return "Range too small";
  const nums = new Set();
  while (nums.size < n) {
    nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...nums];
}
function extractDateFromFilename(filename) {
  const match = filename.match(/IMG_(\d{4})(\d{2})(\d{2})_\d{6}\.jpg/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return null;
}
export {
    getFontSizeToFit,
    getUniqueIntegers,
    extractDateFromFilename
}