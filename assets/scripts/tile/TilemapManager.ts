import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import levels from '../../levels';
import { createUINode, randRange } from '../../utils';
import { TileManager } from './TileManager';
import { ResourceManager } from '../../runtime/ResourceManager';
import { DataManager } from '../../runtime/DataManager';
const { ccclass } = _decorator;

@ccclass('TilemapManager')
export class TilemapManager extends Component {
  async init() {
    // 按照关卡内容生成地图
    const { mapInfo } = DataManager.instance; // 数据和UI分离的思想，这里不加载数据，只提供数据
    const sprites = await ResourceManager.instance.loadDirRes<SpriteFrame>('texture/tile/tile');

    for (let i = 0; i < mapInfo.length; i++) {
      const row = mapInfo[i];
      DataManager.instance.tileInfo[i] = [];

      for (let j = 0; j < row.length; j++) {
        const tileData = row[j];
        if (tileData.src === null || tileData.type === null) {
          continue;
        }

        let num = tileData.src;
        if (i % 2 === 0 && j % 2 === 0 && (num === 1 || num === 5 || num === 9)) {
          num += randRange(0, 3);
        }

        const spriteFrame = sprites.find(s => s.name === `tile (${num})`) ?? sprites[0];

        const node = createUINode();
        const tileManager = node.addComponent(TileManager);
        tileManager.init(tileData.type, spriteFrame, i, j);

        node.parent = this.node;

        DataManager.instance.tileInfo[i][j] = tileManager;
      }
    }
  }
}
