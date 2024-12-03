

function getFontSizeToFit(text, fontFace, maxWidth) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `1px ${fontFace}`;
    return maxWidth / ctx.measureText(text).width;
}

export {
    getFontSizeToFit
}