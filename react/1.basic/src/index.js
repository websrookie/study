import React from './react';
// import ReactDOM from 'react-dom/client';
import ReactDom from './react-dom';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<h1>APP</h1>);

// let element = <h1 className='title' style={{ color: 'red' }} >hello</h1>

function FunctionComponent(props) {
  return <h1 className='title' style={{ color: 'red' }} >{ props.name }</h1>
}

let element = <FunctionComponent name="邵鹏" />

console.log(element);

// 把 虚拟 dom 变成真实 dom 添加到 root 这个真实的 DOM 容器中
// 最能体现 React 核心设计思路其实是 React16
// React17 fiber
// React18 加入优先级调度 并发执行
ReactDom.render(element, document.getElementById('root'));
