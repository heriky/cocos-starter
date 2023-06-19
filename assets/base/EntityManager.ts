import { AnimationClip, Component, Sprite, SpriteFrame, _decorator, Animation, animation, UITransform } from 'cc';
import { ENTITY_DIRECTION_ORDER, ENTITY_DIRECTION, ENTITY_STATE, STATE_PARAMS_NAME, EntityType } from '../enums';

import { IEntity } from '../enums';
import { PlayerStateMachine } from '../scripts/player/PlayerStateMachine';
import { TILE_HEIGHT, TILE_WIDTH } from '../scripts/tile/TileManager';

const { ccclass } = _decorator;

@ccclass('EntityManager')
export abstract class EntityManager extends Component {
  x = 0;
  y = 0;
  type: EntityType | null = null;

  private _state: ENTITY_STATE | null = null;
  private _direction: ENTITY_DIRECTION | null = null;

  abstract fsm: PlayerStateMachine | null;

  get state() {
    return this._state;
  }

  set state(v) {
    this._state = v;
    this.fsm?.setParams(v as any, true);
  }

  get direction() {
    return this._direction;
  }

  set direction(v) {
    this._direction = v;
    // @ts-ignore
    this.fsm?.setParams(STATE_PARAMS_NAME.DIRECTION, ENTITY_DIRECTION_ORDER[v]);
  }

  update(): void {
    this.node.setPosition((this.x - 1.5) * TILE_WIDTH, (-this.y + 1.5) * TILE_HEIGHT);
  }

  async init(params: IEntity) {
    // 设置sprite
    const sprite = this.node.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM; // ! 特别重要：这里先修改sprite的sizeMode，再通过UITransform组件设置大小

    const transform = this.node.getComponent(UITransform);
    transform?.setContentSize(4 * TILE_WIDTH, 4 * TILE_HEIGHT);

    // 设置位置和初始状态
    this.x = params.x;
    this.y = params.y;
    this.state = params.state;
    this.direction = params.direction;
    this.type = params.type;
  }
}
