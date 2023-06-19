import { CONTORLLER_ENUM, ENTITY_DIRECTION } from '../enums';
import { DataManager } from '../runtime/DataManager';

export class BlockCheck {
  static willBlock(ctrl: CONTORLLER_ENUM, info: { x: number; y: number; direction: ENTITY_DIRECTION }) {
    if (ctrl === CONTORLLER_ENUM.TOP) return this.willBlockTop(info.x, info.y, info.direction);
    if (ctrl === CONTORLLER_ENUM.BOTTOM) return this.willBlockBottom(info.x, info.y, info.direction);
    if (ctrl === CONTORLLER_ENUM.LEFT) return this.willBlockLeft(info.x, info.y, info.direction);
    if (ctrl === CONTORLLER_ENUM.RIGHT) return this.willBlockRight(info.x, info.y, info.direction);
    if (ctrl === CONTORLLER_ENUM.TURN_LEFT) return this.willBlockTurnLeft(info.x, info.y, info.direction);
    if (ctrl === CONTORLLER_ENUM.TURN_RIGHT) return this.willBlockTurnRight(info.x, info.y, info.direction);

    return false;
  }

  private static willBlockTop(x: number, y: number, direction: ENTITY_DIRECTION) {
    // 在执行移动之前，targetX/targetY和x/y是相当的，由于xy可能为小数，因此这里用targetX,targetY
    const tileInfo = DataManager.instance.tileInfo;

    // 向上移动。与人物当前的方向有关系
    switch (direction) {
      case ENTITY_DIRECTION.TOP: {
        const weaponNextTile = tileInfo[x][y - 2];
        return !weaponNextTile?.turnable;
      }

      case ENTITY_DIRECTION.BOTTOM: {
        const playerNextTile = tileInfo[x][y - 1];
        return !playerNextTile?.movable;
      }

      case ENTITY_DIRECTION.LEFT: {
        const playerNextTile = tileInfo[x][y - 1];
        const weaponNextTile = tileInfo[x - 1][y - 1];
        return !playerNextTile?.movable || !weaponNextTile?.turnable;
      }

      case ENTITY_DIRECTION.RIGHT: {
        const playerNextTile = tileInfo[x][y - 1];
        const weaponNextTile = tileInfo[x + 1][y - 1];
        return !playerNextTile.movable || !weaponNextTile.turnable;
      }
    }
  }

  private static willBlockBottom(x: number, y: number, direction: ENTITY_DIRECTION) {
    const tileInfo = DataManager.instance.tileInfo;

    // 向上移动。与人物当前的方向有关系
    switch (direction) {
      case ENTITY_DIRECTION.TOP: {
        const playerNextTile = tileInfo[x][y + 1];
        return !playerNextTile?.movable;
      }

      case ENTITY_DIRECTION.BOTTOM: {
        const weaponNextTile = tileInfo[x][y + 2];
        return !weaponNextTile?.turnable;
      }

      case ENTITY_DIRECTION.LEFT: {
        const playerNextTile = tileInfo[x][y + 1];
        const weaponNextTile = tileInfo[x - 1][y + 1];
        return !playerNextTile?.movable || !weaponNextTile?.turnable;
      }

      case ENTITY_DIRECTION.RIGHT: {
        const playerNextTile = tileInfo[x][y + 1];
        const weaponNextTile = tileInfo[x + 1][y + 1];
        return !playerNextTile.movable || !weaponNextTile.turnable;
      }
    }
  }

  private static willBlockLeft(x: number, y: number, direction: ENTITY_DIRECTION) {
    const tileInfo = DataManager.instance.tileInfo;

    // 向上移动。与人物当前的方向有关系
    switch (direction) {
      case ENTITY_DIRECTION.TOP: {
        const playerNextTile = tileInfo[x - 1][y];
        const weaponNextTile = tileInfo[x - 1][y - 1];
        return !playerNextTile?.movable || !weaponNextTile.turnable;
      }

      case ENTITY_DIRECTION.BOTTOM: {
        const playerNextTile = tileInfo[x - 1][y];
        const weaponNextTile = tileInfo[x - 1][y + 1];
        return !playerNextTile?.movable || !weaponNextTile.turnable;
      }

      case ENTITY_DIRECTION.LEFT: {
        const weaponNextTile = tileInfo[x - 2][y];
        return !weaponNextTile.turnable;
      }

      case ENTITY_DIRECTION.RIGHT: {
        const playerNextTile = tileInfo[x - 1][y];
        return !playerNextTile.movable;
      }
    }
  }

  private static willBlockRight(x: number, y: number, direction: ENTITY_DIRECTION) {
    const tileInfo = DataManager.instance.tileInfo;

    // 向上移动。与人物当前的方向有关系
    switch (direction) {
      case ENTITY_DIRECTION.TOP: {
        const playerNextTile = tileInfo[x + 1][y];
        const weaponNextTile = tileInfo[x + 1][y - 1];
        return !playerNextTile?.movable || !weaponNextTile.turnable;
      }

      case ENTITY_DIRECTION.BOTTOM: {
        const playerNextTile = tileInfo[x + 1][y];
        const weaponNextTile = tileInfo[x + 1][y + 1];
        return !playerNextTile?.movable || !weaponNextTile.turnable;
      }

      case ENTITY_DIRECTION.LEFT: {
        const playerNextTile = tileInfo[x + 1][y];
        return !playerNextTile.movable;
      }

      case ENTITY_DIRECTION.RIGHT: {
        const weaponNextTile = tileInfo[x + 2][y];
        return !weaponNextTile.turnable;
      }
    }
  }

  private static willBlockTurnLeft(x: number, y: number, direction: ENTITY_DIRECTION) {
    const tileInfo = DataManager.instance.tileInfo;

    let nextX = x;
    let nextY = y;
    switch (direction) {
      // 只需要对枪头进行判断，判断对角线和左侧，如果都可以容纳枪，则可以左转
      case ENTITY_DIRECTION.TOP: {
        nextX = x - 1;
        nextY = y - 1;
        return !tileInfo[nextX][nextY]?.turnable || !tileInfo[nextX][y]?.turnable;
      }
      case ENTITY_DIRECTION.BOTTOM: {
        nextX = x + 1;
        nextY = y + 1;
        return !tileInfo[nextX][nextY]?.turnable || !tileInfo[nextX][y]?.turnable;
      }
      case ENTITY_DIRECTION.LEFT: {
        nextX = x - 1;
        nextY = y + 1;
        return !tileInfo[nextX][nextY]?.turnable || !tileInfo[x][nextY]?.turnable;
      }
      case ENTITY_DIRECTION.RIGHT: {
        nextX = x + 1;
        nextY = y - 1;
        return !tileInfo[nextX][nextY]?.turnable || !tileInfo[x][nextY]?.turnable;
      }
    }
  }

  private static willBlockTurnRight(x: number, y: number, direction: ENTITY_DIRECTION) {
    const tileInfo = DataManager.instance.tileInfo;

    let nextX = x;
    let nextY = y;
    switch (direction) {
      // 只需要对枪头进行判断，判断对角线和左侧，如果都可以容纳枪，则可以左转
      case ENTITY_DIRECTION.TOP: {
        nextX = x + 1;
        nextY = y - 1;
        return !tileInfo[nextX][nextY].turnable || !tileInfo[nextX][y].turnable;
      }
      case ENTITY_DIRECTION.BOTTOM: {
        nextX = x - 1;
        nextY = y + 1;
        return !tileInfo[nextX][nextY].turnable || !tileInfo[nextX][y].turnable;
      }
      case ENTITY_DIRECTION.LEFT: {
        nextX = x - 1;
        nextY = y - 1;
        return !tileInfo[nextX][nextY].turnable || !tileInfo[x][nextY].turnable;
      }
      case ENTITY_DIRECTION.RIGHT: {
        nextX = x + 1;
        nextY = y + 1;
        return !tileInfo[nextX][nextY].turnable || !tileInfo[x][nextY].turnable;
      }
    }
  }
}
