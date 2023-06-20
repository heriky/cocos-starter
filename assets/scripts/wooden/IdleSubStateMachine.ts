import { AnimationClip } from 'cc';
import { State } from '../../base/State';
import { StateMachine } from '../../base/StateMachine';
import { ENTITY_DIRECTION } from '../../enums';
import { DirectionStateMachine } from '../../base/DirectionStateMachine';

const BASE_URL = 'texture/woodenskeleton/idle';
export class IdleSubStateMachine extends DirectionStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm);

    this.stateMap.set(ENTITY_DIRECTION.TOP, new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Loop));
    this.stateMap.set(ENTITY_DIRECTION.BOTTOM, new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Loop));
    this.stateMap.set(ENTITY_DIRECTION.LEFT, new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Loop));
    this.stateMap.set(ENTITY_DIRECTION.RIGHT, new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Loop));
  }
}
