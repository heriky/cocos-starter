import { ENTITY_DIRECTION_ORDER, STATE_PARAMS_NAME } from '../enums';
import { SubStateMachine } from './SubStateMachine';

export class DirectionStateMachine extends SubStateMachine {
  run() {
    const value = this.fsm.getParams(STATE_PARAMS_NAME.DIRECTION) as number; // 取出来是数字
    const str = ENTITY_DIRECTION_ORDER[value];
    this.stateMap.get(str)?.run();
  }
}
