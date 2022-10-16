## TextMiddle

适用于移动端文字垂直居中的方案，提供 Canvas 与 SVG 两个版本

```jsx
import { TextMiddleCanvas, TextMiddleSVG } from 'text-middle';

const App = () => {
  return (
    <TextMiddleCanvas text="查看更多" color="deeppink" height={60} fontSize={30}/>
    <TextMiddleSVG text="查看更多" color="deeppink" height={60} fontSize={30}/>
  )
}

ReactDOM.createRoot(el).render(<App />);
```
