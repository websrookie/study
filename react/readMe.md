### 创建项目
- create-react-app name

### 什么是 JSX
- 是一种 JS 和 HTML 混合的语法，将组件的结构、数据甚至样式都聚合到一起的写法

### 什么是元素
- JSX 其实只是一种语法糖，最终会通过 babel.js 转译成 React.createElement 语法
- React.createElement 语法会返回一个 React 元素
- React 元素事实上是普通的 JS 对象，用来描述你在屏幕上看到的内容
- ReactDom 来确保浏览器中的真实 DOM 数据和 React 元素保持一致