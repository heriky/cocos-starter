import { _decorator, Component, Input, input, Node } from 'cc';
import { TilemapManager } from '../tile/TilemapManager';
import { createUINode } from '../../utils';
import levels from '../../levels';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import { DataManager } from '../../runtime/DataManager';
import { EventManager } from '../../runtime/EventManager';
import { EventEnums } from '../../enums';
import { PlayerManager } from '../player/PlayerManager';

const { ccclass } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
  private stage: Node = null!;

  start() {
    // 生成舞台
    this.initStage();

    // 生成关卡数据
    this.initLevel();
  }

  onLoad() {
    EventManager.instance.on(EventEnums.NEXT_LEVEL, this.nextLevel, this);
  }

  onDestroy() {
    EventManager.instance.off(EventEnums.NEXT_LEVEL, this.nextLevel);
  }

  initLevel(index = 1) {
    const { mapInfo } = levels[`level${index}`];

    if (!mapInfo) return;
    DataManager.instance.reset();
    DataManager.instance.mapInfo = mapInfo;
    DataManager.instance.levelIndex = index;

    this.generateTileMap();
    this.generatePlayer();
  }

  nextLevel() {
    const nextLevelIndex = DataManager.instance.levelIndex + 1;
    this.clearLevel();
    this.initLevel(nextLevelIndex);
  }

  clearLevel() {
    this.stage.removeAllChildren();
  }

  initStage() {
    this.stage = createUINode();
    this.stage.parent = this.node;
  }

  generateTileMap() {
    // 舞台 -> 地图（TileMap）

    const tileMap = createUINode();
    tileMap.parent = this.stage;

    const tilemapManager = tileMap.addComponent(TilemapManager);
    tilemapManager.init();

    this.adjustStage();
  }

  generatePlayer() {
    const player = createUINode();
    // 这里一定要挂在stage上，而不是在canvas上，否则stage的偏移就无法应用了
    // !挂在stage上时，坐标的（0， 0）点就在stage的左上角
    player.parent = this.stage;

    const playerManager = player.addComponent(PlayerManager);
    playerManager.init();
  }

  private adjustStage() {
    const { rowCount, columnCount } = DataManager.instance;

    const disX = (rowCount * TILE_WIDTH) / 2;
    const disY = (columnCount * TILE_HEIGHT) / 2 + 80;
    this.stage.setPosition(-disX, disY);
  }
}
