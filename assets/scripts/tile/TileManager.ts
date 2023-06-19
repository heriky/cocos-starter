import { _decorator, Component, Layers, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../../enums';
const { ccclass } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM | null = null;
  movable = false; // 是否可以放置人
  turnable = false; // 是否可以放置武器

  init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
    // 1. 设置图片 2. 设置位置和大小 3. 设置可见性
    const sprite = this.node.addComponent(Sprite);
    sprite.spriteFrame = spriteFrame;

    const transform = this.node.getComponent(UITransform);

    transform?.setContentSize(TILE_WIDTH, TILE_HEIGHT);
    this.node.setPosition(TILE_WIDTH * i, -TILE_HEIGHT * j);

    // !这个非常重要，否则就怕Tile不可见
    this.node.layer = Layers.Enum.UI_2D;

    this.type = type;

    this.genTileInfo();
  }

  genTileInfo() {
    if (this.type?.includes('WALL')) {
      this.movable = false;
      this.turnable = false;
    } else if (this.type?.includes('CLIFF')) {
      this.movable = false;
      this.turnable = true;
    } else if (this.type === 'FLOOR') {
      this.movable = true;
      this.turnable = true;
    }
  }
}
