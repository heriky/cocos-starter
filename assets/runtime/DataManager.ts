import { Singleton } from '../base/Singleton';
import { Level } from '../levels';
import { TileManager } from '../scripts/tile/TileManager';

export class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  mapInfo: Level['mapInfo'] = [];

  tileInfo: TileManager[][] = [];

  levelIndex = -1;

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
