import { Node, SpriteFrame, UITransform } from 'cc';

export function createUINode() {
  const node = new Node();
  const transform = node.addComponent(UITransform);
  transform.setAnchorPoint(0, 1);
  return node;
}

export function randRange(start: number, end: number) {
  return Math.floor(start + Math.random() * (end - start));
}

const REG = /(\(\d+\))/;

const parseNum = (str: string) => parseInt(str.match(REG)?.[1] ?? '0');
export function orderSpriteFrames(sprites: SpriteFrame[]) {
  return sprites.sort((a, b) => parseNum(a.name) - parseNum(b.name));
}

export function throttle(fn: Function, delay = 300, context: any) {

  let timer = 0;
  let isFirst = true;
  return function(...args: any[]) {
    if(isFirst) {
      isFirst = false;
      fn.call(context, ...args);
      return;
    }

    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(context, ...args);
      clearTimeout(timer);
      timer = 0;
    }, delay);
  }
}