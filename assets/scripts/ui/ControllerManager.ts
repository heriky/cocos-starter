import { _decorator, Component, Node } from 'cc';
import { EventManager } from '../../runtime/EventManager';
import { CONTORLLER_ENUM, EventEnums } from '../../enums';
const { ccclass, property } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  start() {}

  handleCtrl(event: TouchEvent, data: CONTORLLER_ENUM) {
    EventManager.instance.emit(EventEnums.CTRL, data);
  }
}
// 通过冒泡的形式
