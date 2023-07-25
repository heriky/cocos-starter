import { Singleton } from '../base/Singleton';
import { Level } from '../levels';
import { PlayerManager } from '../scripts/player/PlayerManager';
import { TileManager } from '../scripts/tile/TileManager';
import { WoodenManager } from '../scripts/wooden/WoodenManager';

export class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  mapInfo: Level['mapInfo'] = [];

  tileInfo: TileManager[][] = [];

  levelIndex = -1;

  player: PlayerManager = null!;
  enemies: WoodenManager[] = [];

  get columnCount() {
    return this.mapInfo[0]?.length ?? 0;
  }

  get rowCount() {
    return this.mapInfo.length;
  }

  reset() {
    this.mapInfo = [];
  }
}
