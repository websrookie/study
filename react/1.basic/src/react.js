import { REACT_ELEMENT } from "./constants";
import { wrapToVdom } from "./util";
import Component from "./component";

function createElement(type, config, children) {
  let ref; // 用来获取真实 DOM 元素
  let key; // 用来获取 DOM-DIFF，高效快速进行比较

  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    delete config.ref;
    key = config.key;
    delete config.key;
  }

  let props = { ...config };

  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // 如果只有一个儿子，children 是对象或者字符串，如果没有儿子，就是undefined
    props.children = wrapToVdom(children);
  }

  return {
    $$typeof: REACT_ELEMENT,// 表示这是一个虚拟dom，也就是说这是一个 React 元素
    type, // 虚拟 DOM 元素的类型
    ref,
    key,
    props,
  }
};

const React = {
  createElement,
  Component,
};

export default React;