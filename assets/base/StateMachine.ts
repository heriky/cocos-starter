import { Animation, Component, _decorator } from 'cc';
import { STATE_PARAMS_NAME, STATE_PARAMS_TYPE } from '../enums';
import { State } from '../base/State';
import { SubStateMachine } from './SubStateMachine';

const { ccclass } = _decorator;

/**
 * 1. 参数列表。用于条件过渡
 * 2. 状态列表。用于执行具体的状态
 */

type IParamsValue = boolean | number;
export type IParams = {
  value: IParamsValue;
  type: STATE_PARAMS_TYPE;
};

export const getTriggerInitValue = () => {
  return {
    type: STATE_PARAMS_TYPE.TRIGGER,
    value: false,
  };
};

export const getNumerInitValue = () => {
  return {
    type: STATE_PARAMS_TYPE.NUMBER,
    value: 0,
  };
};

/**
 * 设计思路：
 * 1. 设计成员：参数列表、状态列表
 * 2. 初始化
 * 3. 触发状态机的执行
 */

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  paramsMap = new Map<string, IParams>();
  stateMap = new Map<string, State | SubStateMachine>(); // !注意这里的设计：stateMap的key值就是需要过渡到当前状态对应的参数的名称，和paramsMap中的key取值一样

  animationComponent: Animation = null!;
  waitingList: Promise<any>[] = [];

  private _currentState: State | SubStateMachine | undefined;

  get currentState() {
    return this._currentState;
  }

  set currentState(v) {
    this._currentState = v;
    this._currentState?.run(); // 播放state的动画，或者启动子状态机subStateMachine
  }

  setParams(paramName: STATE_PARAMS_NAME, value: IParamsValue) {
    if (this.paramsMap.has(paramName)) {
      this.paramsMap.get(paramName)!.value = value;

      this.run();

      this.resetTrigger(); // 触发器类型，要进行复位操作。否则，按一下turn_left的按钮，就会一直出发turn_left
    }
  }

  getParams(paramName: STATE_PARAMS_NAME) {
    return this.paramsMap.get(paramName)?.value;
  }

  resetTrigger() {
    for (const [, param] of this.paramsMap) {
      if (param.type === STATE_PARAMS_TYPE.TRIGGER) {
        param.value = false;
      }
    }
  }

  abstract run(): void;
  abstract init(): void;
}
