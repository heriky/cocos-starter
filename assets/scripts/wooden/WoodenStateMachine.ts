import { Animation, AnimationClip, _decorator } from 'cc';
import { ENTITY_STATE, STATE_PARAMS_NAME, STATE_PARAMS_TYPE } from '../../enums';
// import { State } from '../../base/State';
import { StateMachine, getNumerInitValue, getTriggerInitValue } from '../../base/StateMachine';
import { IdleSubStateMachine } from './IdleSubStateMachine';

const { ccclass } = _decorator;

/**
 * 1. 参数列表。用于条件过渡
 * 2. 状态列表。用于执行具体的状态
 */

/**
 * 设计思路：
 * 1. 设计成员：参数列表、状态列表
 * 2. 初始化
 * 3. 触发状态机的执行
 */

@ccclass('WoodenStateMachine')
export class WoodenStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation);

    this.initParams();
    this.initState();

    await Promise.all(this.waitingList); // !调用init完成之前，一定要保证状态State内部的异步操作已经完成了，所以才设计了waitingList
  }

  initParams() {

    const triggerParamNames = [
      STATE_PARAMS_NAME.IDLE, 

    ];

    // 注册【触发器】类型参数
    triggerParamNames.forEach(param => {
      this.paramsMap.set(param, getTriggerInitValue());
    });


     // 注册【数字】类型参数
     this.paramsMap.set(STATE_PARAMS_NAME.DIRECTION, getNumerInitValue());
  }

  initState() {
    this.stateMap.set(ENTITY_STATE.IDLE, new IdleSubStateMachine(this));
  }

  run() {
    switch (this.currentState) {
      case this.stateMap.get(ENTITY_STATE.IDLE): {
       if (this.paramsMap.get(STATE_PARAMS_NAME.IDLE)?.value) {
          // 因为idle是常态，经常为true，因此需要写在最后，否则无法消除idle状态，扭转到其他动画
          this.currentState = this.stateMap.get(ENTITY_STATE.IDLE);
        } else {
          this.currentState = this.currentState; // 为了触发子状态机的run
        }

        break;
      }


      default:
        // !这里一定要给初始状态
        this.currentState = this.stateMap.get(STATE_PARAMS_NAME.IDLE);
        console.log('初始化', this.currentState, this.paramsMap.get(STATE_PARAMS_NAME.IDLE));
        break;
    }
  }
}
