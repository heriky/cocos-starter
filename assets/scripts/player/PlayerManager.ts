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
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../../base/EntityManager';
import { DataManager } from '../../runtime/DataManager';
import { BlockCheck } from '../../utils/BlockCheck';

const { ccclass } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  targetX = 0;
  targetY = 0;

  private readonly speed = 1 / 10; // 放在update中时，表示一帧移动 1/10个单位

  onLoad() {
    EventManager.instance.on(EventEnums.CTRL, this.inputHandler, this);
  }

  onDestroy() {
    EventManager.instance.off(EventEnums.CTRL, this.inputHandler);
  }

  update(): void {
    this.updateXY();
    super.update();
  }

  async init() {
    this.fsm = this.addComponent(PlayerStateMachine);
    await this.fsm?.init(); // !必须在初始化完成之后再调用，和状态机内部的waitingList挂钩。这里不能直接将逻辑构造函数中，而是用new的形式，也是这个原因导致的

    super.init({
      x: 2,
      y: 8,
      direction: ENTITY_DIRECTION.TOP,
      state: ENTITY_STATE.IDLE,
      type: EntityType.PLAYER,
    });

    this.targetX = this.x;
    this.targetY = this.y;
  }

  inputHandler(ctrl: CONTORLLER_ENUM) {
    if (BlockCheck.willBlock(ctrl, { x: this.targetX, y: this.targetY, direction: this.direction! })) {
      
      if (ctrl === CONTORLLER_ENUM.TOP) return this.state = ENTITY_STATE.BLOCK_FRONT;
      if (ctrl === CONTORLLER_ENUM.BOTTOM) return this.state = ENTITY_STATE.BLOCK_BACK;
      if (ctrl === CONTORLLER_ENUM.LEFT) return this.state = ENTITY_STATE.BLOCK_LEFT;
      if (ctrl === CONTORLLER_ENUM.RIGHT) return this.state = ENTITY_STATE.BLOCK_RIGHT;
      if (ctrl === CONTORLLER_ENUM.TURN_LEFT) return this.state = ENTITY_STATE.BLOCK_TURN_LEFT;
      if (ctrl === CONTORLLER_ENUM.TURN_RIGHT) return this.state = ENTITY_STATE.BLOCK_TRUN_RIGHT;

    }
    this.move(ctrl);
  }

  move(ctrl: CONTORLLER_ENUM) {
    switch (ctrl) {
      case CONTORLLER_ENUM.TOP:
        this.targetY -= 1;
        break;
      case CONTORLLER_ENUM.BOTTOM:
        this.targetY += 1;
        break;
      case CONTORLLER_ENUM.LEFT:
        this.targetX -= 1;
        break;
      case CONTORLLER_ENUM.RIGHT:
        this.targetX += 1;
        break;
      case CONTORLLER_ENUM.TURN_LEFT: {
        // direction 参数是专门用在子状态机的，父状态机的控制还是由turn_left参数进行控制
        if (this.direction === ENTITY_DIRECTION.TOP) {
          this.direction = ENTITY_DIRECTION.LEFT;
        } else if (this.direction === ENTITY_DIRECTION.LEFT) {
          this.direction = ENTITY_DIRECTION.BOTTOM;
        } else if (this.direction === ENTITY_DIRECTION.BOTTOM) {
          this.direction = ENTITY_DIRECTION.RIGHT;
        } else if (this.direction === ENTITY_DIRECTION.RIGHT) {
          this.direction = ENTITY_DIRECTION.TOP; // 属于子状态机内部状态
        }

        this.state = ENTITY_STATE.TURN_LEFT;
        break;

      }
        

      case CONTORLLER_ENUM.TURN_RIGHT: {

         // direction 参数是专门用在子状态机的，父状态机的控制还是由turn_left参数进行控制
         if (this.direction === ENTITY_DIRECTION.TOP) {
          this.direction = ENTITY_DIRECTION.RIGHT;
        } else if (this.direction === ENTITY_DIRECTION.RIGHT) {
          this.direction = ENTITY_DIRECTION.BOTTOM;
        } else if (this.direction === ENTITY_DIRECTION.BOTTOM) {
          this.direction = ENTITY_DIRECTION.LEFT;
        } else if (this.direction === ENTITY_DIRECTION.LEFT) {
          this.direction = ENTITY_DIRECTION.TOP; // 属于子状态机内部状态
        }

        this.state = ENTITY_STATE.TURN_RIGHT;
        break;
      }

      default:
        break;
    }
  }

  updateXY() {
    // !这个条件一定要有，否则就鬼畜了，这个是web开发和game开发的区别.
    // ! 一定不能加上相等的判断，否则鬼畜
    if (this.x < this.targetX) {
      this.x += this.speed;
    } else if (this.x > this.targetX) {
      this.x -= this.speed;
    }

    if (this.y < this.targetY) {
      this.y += this.speed;
    } else if (this.y > this.targetY) {
      this.y -= this.speed;
    }

    // 防止鬼畜。需要在接近时直接赋值
    const deltaX = Math.abs(this.x - this.targetX);
    if (deltaX <= 0.1 && deltaX > 0) {
      this.x = this.targetX;
      EventManager.instance.emit(EventEnums.ENEMY_FORWARD);
    }

    const deltaY = Math.abs(this.y - this.targetY);
    if (deltaY <= 0.1 && deltaY > 0) {
      this.y = this.targetY;
      EventManager.instance.emit(EventEnums.ENEMY_FORWARD);
    }
  }
}
