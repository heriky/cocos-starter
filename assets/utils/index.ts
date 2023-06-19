import { Node, UITransform } from 'cc';

export function createUINode() {
  const node = new Node();
  const transform = node.addComponent(UITransform);
  transform.setAnchorPoint(0, 1);
  return node;
}

export function randRange(start: number, end: number) {
  return Math.floor(start + Math.random() * (end - start));
}
