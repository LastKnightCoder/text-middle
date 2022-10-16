import React, { useEffect, useRef } from "react";

const isIos = /ipad|iphone|macintosh/gim.test(window.navigator.userAgent);

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const getTextLength = (text, fontSize) => {
  ctx.font= `${fontSize}px normal`;
  const metrics = ctx.measureText(text);
  return parseInt('' + metrics.width);
}

const TextMiddle = props => {
  const { text, color, height, fontSize, className = '', style = {} } = props;
  const container = useRef();

  const actualStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    ...style,
    height: `${height / 100}rem`,
    lineHeight: `${height / 100}rem`,
    fontSize: `${fontSize / 100}rem`,
    color
  };

  useEffect(() => {
    if (isIos) {
      return;
    }

    const computedStyle = window.getComputedStyle(container.current);
    const actualHeight = parseFloat(computedStyle.height);
    const actualFontSize = parseFloat(computedStyle.fontSize);
    const actualWidth = parseInt(computedStyle.width) + 1;
    
    // 高分屏模糊处理
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.width = actualWidth + 'px';
    canvas.style.height = actualHeight + 'px';
    const dpr = window.devicePixelRatio;
    canvas.width = actualWidth * dpr;
    canvas.height = actualHeight * dpr;
    ctx.scale(dpr, dpr);

    // 文字超出处理
    const textLength = getTextLength(text, actualFontSize);
    let actualText = text;
    if (textLength > actualWidth) {
      actualText = text.slice(0, 1) + '...';
      for (let i = 1; i < text.length; i++) {
        const adjustText = text.slice(0, i) + '...';
        const adjustWidth = getTextLength(adjustText, actualFontSize);
        if (adjustWidth > actualWidth) {
          break;
        }
        actualText = adjustText;
      }
    }

    ctx.font = `${actualFontSize}px normal`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'bottom';
    ctx.fillText(actualText, 0, (canvas.height / dpr + 1.15 * actualFontSize) / 2);

    // 性能优化
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          container.current.removeChild(container.current.firstChild);
          container.current.append(canvas);
          observer.unobserve(container.current);
        }
      });
    }, {
      rootMargin: '0px 0px 500px 0px'
    });
    observer.observe(container.current);
  }, [text, color]);

  return (
    <div ref={container} className={className} style={actualStyle}>{text}</div>
  )
}

export default TextMiddle;