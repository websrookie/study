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
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    }
    return mountFunctionComponent(vdom);
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
  vdom.dom = dom;
  return dom;
}

function mountClassComponent (vdom) {
  let { type: classComponent, props } = vdom;
  let classInstance = new classComponent(props);
  let renderVdom = classInstance.render();
  // 先缓存一次渲染出来的 虚拟 vdom，放置在组件实例上
  classInstance.renderVdom = vdom.oldRenderVdom = renderVdom;
  let dom = createDOM(renderVdom);

  return dom;
}

function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props);
  vdom.oldRenderVdom = renderVdom;

  return createDOM(renderVdom);
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
    } else if (/^on[A-Z].*/.test(key)) {
      dom[key.toLowerCase()] = newProps[key];
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

/**
 * 从虚拟 dom 获取真实 dom
 * @param {*} vdom 原生的 div => 真实的 dom 节点
 * @returns
 */
export function findDOM(vdom) {
  if (!vdom) return null;

  if (vdom.dom) return vdom.dom

  let renderVdom = vdom.oldRenderVdom;

  return findDOM(renderVdom);
};

/**
 * 比较虚拟dom，更新真实dom
 * @param {*} parentDOM
 * @param {*} oldVdom
 * @param {*} newVdom
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom);
  let newDOM = createDOM(newVdom);
  parentDOM.replaceChild(newDOM, oldDOM);
};

const ReactDOM = {
  render,
};

export default ReactDOM;