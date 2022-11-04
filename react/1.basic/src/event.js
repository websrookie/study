import { updateQueue } from "./component";

/**
 * 给 dom 节点绑定事件
 * @param {*} dom 真实的 DOM 节点
 * @param {*} eventType 事件类型
 * @param {*} handler 原始的事件处理函数
 */
export function addEvent(dom, eventType, handler) {
  const store = dom.store || (dom.store = {}); // 保证 DOM 节点上有一个自定义的属性对象
  store[eventType] = handler; // 把处理函数保存到真实的 DOM 节点上有一个自定义的属性对象

  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
};

function dispatchEvent(event) {
  updateQueue.isBatchUpdate = true; // 再事件函数执行前，批量更新标签置为 true
  let { target, type } = event;
  let eventType = `on${type}`;
  const { store } = target;
  let handler = store && store[eventType];
  handler && handler(event);
  updateQueue.batchUpdate();
}
