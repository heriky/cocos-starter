export class Singleton {
  protected static _instance: any = null;

  protected static getInstance<T>() {
    if (!this._instance) this._instance = new this(); // 通过super调用时，这里的this指向子类
    return this._instance as T;
  }
}
