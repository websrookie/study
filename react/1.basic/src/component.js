import { findDOM, compareTwoVdom } from "./react-dom";

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
    this.updateComponent();
  }

  updateComponent() {
    const { classInstance, pendingStates } = this;

    if (pendingStates.length > 0) {
      // 表示有将要进行的更新
      shouldUpdate(classInstance, this.getState());
    }
  }

  shouldUpdate() {}

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