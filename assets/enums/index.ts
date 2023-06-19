export enum TILE_TYPE_ENUM {
  WALL_ROW = 'WALL_ROW',
  WALL_COLUMN = 'WALL_COLUMN',
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  CLIFF_CENTER = 'CLIFF_CENTER',
  CLIFF_LEFT = 'CLIFF_LEFT',
  CLIFF_RIGHT = 'CLIFF_RIGHT',
  FLOOR = 'FLOOR',
}

export enum EventEnums {
  NEXT_LEVEL = 'next_level',
  CTRL = 'CONTORLLER',
}

export enum CONTORLLER_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
}

export enum STATE_PARAMS_TYPE {
  TRIGGER = 'TRIGGER',
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
}

export enum STATE_PARAMS_NAME {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',

  DIRECTION = 'DIRECTION',
}

export enum ENTITY_STATE {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
}

export enum ENTITY_DIRECTION {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum ENTITY_DIRECTION_ORDER {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}

export enum EntityType {
  PLAYER = 'player',
}

export type IEntity = {
  x: number;
  y: number;
  type: EntityType;
  state: ENTITY_STATE;
  direction: ENTITY_DIRECTION;
};
