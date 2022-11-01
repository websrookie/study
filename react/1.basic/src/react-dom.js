import { REACT_TEXT } from "./util";

/**
 * 需要把虚拟 DOM 转换成真实 DOM 并且插入到容器中
 * @param {*} vdom 虚拟 DOM
 * @param {*} container 容器
 */
function render (vdom, container) {
  mount(vdom, container);
};

function mount (vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
};


function createDOM(vdom) {
  let { type, props } = vdom;
  let dom;

  if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else {
    dom = document.createElement(type);
  }

  if (props) {
    // 更新属性 DOM 老属性对象 新属性对象
    updateProps(dom, {}, props);
    if (typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }

  return dom;
}

function reconcileChildren(children, parentDOM) {
  for (let i = 0; i < children.length; i++) {
    mount(children[i], parentDOM);
  }
}

function updateProps(dom, oldProps = {}, newProps = {}) {
  for (let key in newProps) {
    if (key === 'children') {
      continue;
    } else if (key === 'style') {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else {
      // 虚拟 DOM 属性一般来说刚好和 dom 的属性相同，都是驼峰命名
      dom[key] = newProps[key];
    }
  }
  for (let key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;