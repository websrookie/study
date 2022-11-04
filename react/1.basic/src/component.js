import { findDOM, compareTwoVdom } from "./react-dom";

export let updateQueue = {
  isBatchUpdate: false, // 是否是批量更新, 如果是 true，就是批量的 异步的，如果是 false 就是非批量的
  updaters: new Set(),
  batchUpdate() {
    updateQueue.isBatchUpdate = false;

    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }

    updateQueue.updaters.clear();
  },
};
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
  }

  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate()
  }

  emitUpdate() {
    if (updateQueue.isBatchUpdate) { // 如果是批量
      updateQueue.updaters.add(this); // 就把当前的 updater 添加到 set 里保存
    } else {
      this.updateComponent();
    }
  }

  updateComponent() {
    const { classInstance, pendingStates } = this;

    if (pendingStates.length > 0) {
      // 表示有将要进行的更新
      shouldUpdate(classInstance, this.getState());
    }
  }

  getState() {
    const { classInstance, pendingStates } = this;
    let state = classInstance;
    pendingStates.forEach((newState) => {
      state = {
        ...state, ...newState
      }
    });

    pendingStates.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState;
  classInstance.forceUpdate();
}

class Component {
  static isReactComponent = true;

  constructor(props) {
    this.props = props;
    this.state = {};
    // 每个类组件的实例都配有一个自己的 Updater 更新器
    this.updater = new Updater(this);
    this.oldRenderVdom = null;
  }

  setState(partialState) {
    this.updater.addState(partialState);
  }

  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom;
    let oldDom = findDOM(oldRenderVdom);
    let newRenderVdom = this.render(); // 渲染出新的虚拟 dom
    compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
  }
}

export default Component;