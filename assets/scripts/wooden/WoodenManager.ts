import { AnimationClip, Component, Sprite, SpriteFrame, _decorator, Animation, animation, UITransform } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import {
  CONTORLLER_ENUM,
  ENTITY_DIRECTION_ORDER,
  ENTITY_DIRECTION,
  ENTITY_STATE,
  EventEnums,
  STATE_PARAMS_NAME,
  EntityType,
} from '../../enums';
import { EventManager } from '../../runtime/EventManager';
import { WoodenStateMachine } from './WoodenStateMachine';
import { EntityManager } from '../../base/EntityManager';

const { ccclass } = _decorator;

@ccclass('WoodenManager')
export class WoodenManager extends EntityManager {


  async init() {
    this.fsm = this.addComponent(WoodenStateMachine);
    await this.fsm?.init(); // !必须在初始化完成之后再调用，和状态机内部的waitingList挂钩。这里不能直接将逻辑构造函数中，而是用new的形式，也是这个原因导致的

    super.init({
      x: 7,
      y: 7,
      direction: ENTITY_DIRECTION.LEFT,
      state: ENTITY_STATE.IDLE,
      type: EntityType.PLAYER,
    });

  }

  
}
