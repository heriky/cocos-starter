import { DirectionStateMachine } from '../../base/DirectionStateMachine';
import { State } from '../../base/State';
import { StateMachine } from '../../base/StateMachine';
import { ENTITY_DIRECTION, ENTITY_STATE } from '../../enums';

const TURN_ANIM_BASE_URL: Record<string, string> = {
  [ENTITY_STATE.TURN_LEFT]: 'texture/player/turnleft',
  [ENTITY_STATE.TURN_RIGHT]: 'texture/player/turnright',
};

export class TurnSubStateMachine extends DirectionStateMachine {
  constructor(fsm: StateMachine, state: ENTITY_STATE = ENTITY_STATE.TURN_LEFT) {
    super(fsm);

    const BASE_URL = TURN_ANIM_BASE_URL[state];
    this.stateMap.set(ENTITY_DIRECTION.TOP, new State(fsm, `${BASE_URL}/top`));
    this.stateMap.set(ENTITY_DIRECTION.BOTTOM, new State(fsm, `${BASE_URL}/bottom`));
    this.stateMap.set(ENTITY_DIRECTION.LEFT, new State(fsm, `${BASE_URL}/left`));
    this.stateMap.set(ENTITY_DIRECTION.RIGHT, new State(fsm, `${BASE_URL}/right`));
  }
}
