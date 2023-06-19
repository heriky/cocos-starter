import { Animation, Component, _decorator } from 'cc';
import { STATE_PARAMS_NAME, STATE_PARAMS_TYPE } from '../enums';
import { State } from '../base/State';
import { StateMachine } from './StateMachine';

type IParamsValue = boolean | number;
export type IParams = {
  value: IParamsValue;
  type: STATE_PARAMS_TYPE;
};

/**
 * 设计思路：
 * 1. 设计成员：参数列表、状态列表
 * 2. 初始化
 * 3. 触发状态机的执行
 */

export abstract class SubStateMachine {
  stateMap = new Map<string, State>(); // !注意这里的设计：stateMap的key值就是需要过渡到当前状态对应的参数的名称，和paramsMap中的key取值一样

  private _currentState: State | undefined;

  constructor(public fsm: StateMachine) {}

  get currentState() {
    return this._currentState;
  }

  set currentState(v) {
    this._currentState = v;
    this._currentState?.run(); // 播放动画
  }

  abstract run(): void;
}
