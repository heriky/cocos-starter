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
import { DataManager } from '../../runtime/DataManager';

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

    EventManager.instance.on(EventEnums.PLAYER_MOVE_END, this.moveEnd, this);
    EventManager.instance.on(EventEnums.ENEMY_ATTACK, this.attack, this);

  }

  moveEnd() {
    this.forwardToPlayer();
    this.attack();
  }

  forwardToPlayer() {

    const { x: playerX, y: playerY } = DataManager.instance.player;
    const deltaX = playerX - this.x;
    const deltaY = playerY - this.y;

    if(deltaX === deltaY) return; // 如果距离相等，则不进行处理


    if(playerX >= this.x && playerY <= this.y) {
      
      // 第一象限
      this.direction = deltaX < deltaY ? ENTITY_DIRECTION.RIGHT : ENTITY_DIRECTION.TOP;
      
    } else if(playerX <= this.x && playerY <= this.y) {

      // 第二象限
      this.direction = deltaX < deltaY ? ENTITY_DIRECTION.LEFT : ENTITY_DIRECTION.TOP;


    } else if(playerX <= this.x && playerY >= this.y) {
      // 第三象限
      this.direction = deltaX < deltaY ? ENTITY_DIRECTION.LEFT : ENTITY_DIRECTION.BOTTOM;

    } else  if(playerX >= this.x && playerY >= this.y) {
     
      // 第四象限
      this.direction = deltaX < deltaY ? ENTITY_DIRECTION.RIGHT : ENTITY_DIRECTION.BOTTOM;

    }
  }


  attack() {
    const { x: playerX, y: playerY } = DataManager.instance.player;

    //判定附近
    if(playerX === this.x && (playerY === this.y - 1 || playerY === this.y + 1)) {

      this.state = ENTITY_STATE.ATTACK;
      EventManager.instance.emit(EventEnums.PLAYER_DIE);

    } else if(playerY === this.y && (playerX === this.x - 1 || playerX === this.x + 1)) {

      this.state = ENTITY_STATE.ATTACK;
      EventManager.instance.emit(EventEnums.PLAYER_DIE);

    }
  }
}
