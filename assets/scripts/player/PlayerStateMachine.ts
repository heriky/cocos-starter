import { Animation, AnimationClip, _decorator } from 'cc';
import { ENTITY_STATE, STATE_PARAMS_NAME, STATE_PARAMS_TYPE } from '../../enums';
// import { State } from '../../base/State';
import { StateMachine, getNumerInitValue, getTriggerInitValue } from '../../base/StateMachine';
import { IdleSubStateMachine } from './IdleSubStateMachine';
import { TurnSubStateMachine } from './TurnSubStateMachine';
import { BlockSubStateMachine } from './BlockSubStateMachine';
import { PlayerManager } from './PlayerManager';

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

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation);

    this.initParams();
    this.initState();
    this.initAnimationEvent();

    await Promise.all(this.waitingList); // !调用init完成之前，一定要保证状态State内部的异步操作已经完成了，所以才设计了waitingList
  }

  initParams() {

    const triggerParamNames = [
      STATE_PARAMS_NAME.IDLE, 

      STATE_PARAMS_NAME.TURN_LEFT,
      STATE_PARAMS_NAME.TURN_RIGHT,

      STATE_PARAMS_NAME.BLOCK_FRONT, 
      STATE_PARAMS_NAME.BLOCK_BACK,
      STATE_PARAMS_NAME.BLOCK_LEFT,
      STATE_PARAMS_NAME.BLOCK_RIGHT,
      STATE_PARAMS_NAME.BLOCK_TURN_LEFT,
      STATE_PARAMS_NAME.BLOCK_TRUN_RIGHT,
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

    // 注册turn状态机
    const turnMachine = [ENTITY_STATE.TURN_LEFT, ENTITY_STATE.TURN_RIGHT];
    turnMachine.forEach(stateName => {
      this.stateMap.set(stateName, new TurnSubStateMachine(this, stateName));
    });


    // 注册block状态机
    const blockMachine = [
      ENTITY_STATE.BLOCK_FRONT,
      ENTITY_STATE.BLOCK_BACK,
      ENTITY_STATE.BLOCK_LEFT,
      ENTITY_STATE.BLOCK_RIGHT,
      ENTITY_STATE.BLOCK_TURN_LEFT,
      ENTITY_STATE.BLOCK_TRUN_RIGHT,
    ];
    blockMachine.forEach(stateName => {
      this.stateMap.set(stateName, new BlockSubStateMachine(this, stateName));
    });

  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      // 如果发现不是idle，则恢复到idle状态
      const name = this.animationComponent.defaultClip?.name;
      const whiteList = ['turn', 'block'];
      if (whiteList.some(item => name?.includes(item))) {
        // this.setParams(STATE_PARAMS_NAME.IDLE, true);

        //@ts-ignore
        this.getComponent(PlayerManager).state = STATE_PARAMS_NAME.IDLE;
      }
    });
  }

  run() {
    switch (this.currentState) {
      case this.stateMap.get(ENTITY_STATE.IDLE):

      case this.stateMap.get(ENTITY_STATE.TURN_LEFT):
      case this.stateMap.get(ENTITY_STATE.TURN_RIGHT):

      case this.stateMap.get(ENTITY_STATE.BLOCK_FRONT):
      case this.stateMap.get(ENTITY_STATE.BLOCK_BACK):
      case this.stateMap.get(ENTITY_STATE.BLOCK_LEFT):
      case this.stateMap.get(ENTITY_STATE.BLOCK_RIGHT):
      case this.stateMap.get(ENTITY_STATE.BLOCK_TURN_LEFT):
      case this.stateMap.get(ENTITY_STATE.BLOCK_TRUN_RIGHT): {

        // case是当前状态，params是下一个状态
        if(this.paramsMap.get(STATE_PARAMS_NAME.BLOCK_FRONT)?.value) {
          this.currentState = this.stateMap.get(ENTITY_STATE.BLOCK_FRONT);

        } else if(this.paramsMap.get(STATE_PARAMS_NAME.BLOCK_BACK)?.value) {
          this.currentState = this.stateMap.get(ENTITY_STATE.BLOCK_BACK);

        }  else if(this.paramsMap.get(STATE_PARAMS_NAME.BLOCK_LEFT)?.value) {
          this.currentState = this.stateMap.get(ENTITY_STATE.BLOCK_LEFT);

        } else if(this.paramsMap.get(STATE_PARAMS_NAME.BLOCK_RIGHT)?.value) {
          this.currentState = this.stateMap.get(ENTITY_STATE.BLOCK_RIGHT);

        } else if(this.paramsMap.get(STATE_PARAMS_NAME.BLOCK_TURN_LEFT)?.value) {
          this.currentState = this.stateMap.get(ENTITY_STATE.BLOCK_TURN_LEFT);

        } else if(this.paramsMap.get(STATE_PARAMS_NAME.BLOCK_TRUN_RIGHT)?.value) {
          this.currentState = this.stateMap.get(ENTITY_STATE.BLOCK_TRUN_RIGHT);

        } else if (this.paramsMap.get(STATE_PARAMS_NAME.TURN_LEFT)?.value) {
          
          // 不要把状态本身的play方法放到这里执行，本函数只管理状态机的运行
          this.currentState = this.stateMap.get(ENTITY_STATE.TURN_LEFT);
        } else if (this.paramsMap.get(STATE_PARAMS_NAME.TURN_RIGHT)?.value) {

          this.currentState = this.stateMap.get(ENTITY_STATE.TURN_RIGHT);
        } else if (this.paramsMap.get(STATE_PARAMS_NAME.IDLE)?.value) {
         
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
