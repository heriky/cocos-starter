import { Singleton } from '../base/Singleton';
import { EventEnums } from '../enums';

export class EventManager extends Singleton {
  static get instance() {
    return super.getInstance<EventManager>();
  }

  eventMap: Map<string, ((...args: any[]) => any)[]> = new Map();

  on(eventName: EventEnums, callback: (...args: any) => any, ctx?: unknown) {
    const cbs = this.eventMap.get(eventName);
    if (Array.isArray(cbs)) cbs.push(callback.bind(ctx));
    else {
      this.eventMap.set(eventName, [callback.bind(ctx)]);
    }
  }
  off(eventName: string, callback: (...args: any) => any) {
    const rs = this.eventMap.get(eventName);
    const index = rs?.findIndex(item => item === callback) ?? -1;
    if (index !== -1) {
      rs?.splice(index, 1);
    }
  }
  emit(eventName: string, ...data: any[]) {
    const funcs = this.eventMap.get(eventName) ?? [];
    funcs.forEach(fn => {
      fn(...data);
    });
  }
  clear() {
    this.eventMap.clear();
  }
}
