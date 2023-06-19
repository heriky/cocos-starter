import { DirectionStateMachine } from '../../base/DirectionStateMachine';
import { State } from '../../base/State';
import { StateMachine } from '../../base/StateMachine';
import { ENTITY_DIRECTION, ENTITY_STATE } from '../../enums';

const TURN_ANIM_BASE_URL: { [key: string]: string } = {
  [ENTITY_STATE.BLOCK_FRONT]: 'texture/player/blockfront',
  [ENTITY_STATE.BLOCK_BACK]: 'texture/player/blockback',
  [ENTITY_STATE.BLOCK_LEFT]: 'texture/player/blockleft',
  [ENTITY_STATE.BLOCK_RIGHT]: 'texture/player/blockright',
  [ENTITY_STATE.BLOCK_TURN_LEFT]: 'texture/player/blockturnleft',
  [ENTITY_STATE.BLOCK_TRUN_RIGHT]: 'texture/player/blockturnright'

};

export class BlockFrontStateMachine extends DirectionStateMachine {
  constructor(fsm: StateMachine, state: ENTITY_STATE = ENTITY_STATE.BLOCK_FRONT) {
    super(fsm);

    const BASE_URL = TURN_ANIM_BASE_URL[state];
    this.stateMap.set(ENTITY_DIRECTION.TOP, new State(fsm, `${BASE_URL}/top`));
    this.stateMap.set(ENTITY_DIRECTION.BOTTOM, new State(fsm, `${BASE_URL}/bottom`));
    this.stateMap.set(ENTITY_DIRECTION.LEFT, new State(fsm, `${BASE_URL}/left`));
    this.stateMap.set(ENTITY_DIRECTION.RIGHT, new State(fsm, `${BASE_URL}/right`));
  }
}
