import React, { useEffect, useRef } from "react";

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const getTextLength = (text, fontSize) => {
  ctx.font= `${fontSize}px normal`;
  const metrics = ctx.measureText(text);
  return parseInt('' + metrics.width);
}

const isIos = /ipad|iphone|macintosh/gim.test(window.navigator.userAgent);

const TextMiddle = props => {
  const { height, fontSize, color, text, className = '', style = {} } = props;
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

    const svg = `
      <svg width="${actualWidth}" height="${actualHeight}" viewBox="0 0 ${actualWidth} ${actualHeight}">
        <text
          font-size="${actualFontSize}"
          fill="currentColor"
          dominant-baseline="central" y="${actualHeight / 2}"
        >
          ${actualText}
        </text>
      </svg>
    `;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // 进入视口时
        if (entry.isIntersecting) {
          container.current.innerHTML = svg;
          observer.unobserve(container.current);
        }
      })
    }, {
      // 视口范围向下扩大 500px，提前加载
      rootMargin: '0px 0px 500px 0px'
    });
    observer.observe(container.current);
  }, [text, color, height, fontSize]);

  return (
    <div ref={container} className={className} style={actualStyle}>
      {text}
    </div>
  )
}

export default TextMiddle;