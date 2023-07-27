import { AnimationClip } from 'cc';
import { State } from '../../base/State';
import { StateMachine } from '../../base/StateMachine';
import { ENTITY_DIRECTION } from '../../enums';
import { DirectionStateMachine } from '../../base/DirectionStateMachine';

const BASE_URL = 'texture/woodenskeleton/attack';
export class AttackSubStateMachine extends DirectionStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm);

    this.stateMap.set(ENTITY_DIRECTION.TOP, new State(fsm, `${BASE_URL}/top`));
    this.stateMap.set(ENTITY_DIRECTION.BOTTOM, new State(fsm, `${BASE_URL}/bottom`));
    this.stateMap.set(ENTITY_DIRECTION.LEFT, new State(fsm, `${BASE_URL}/left`));
    this.stateMap.set(ENTITY_DIRECTION.RIGHT, new State(fsm, `${BASE_URL}/right`));
  }
}
