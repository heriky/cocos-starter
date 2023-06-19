import { SpriteFrame, resources } from 'cc';
import { Singleton } from '../base/Singleton';

export class ResourceManager extends Singleton {
  static get instance() {
    return super.getInstance<ResourceManager>();
  }

  loadDirRes<T>(dir: string) {
    return new Promise<T[]>((resolve, reject) => {
      // !错误点：动态加载资源，只能从resources中读取，因此不需要写resources外部的路径
      // 错误❌： assets/resources/texture/tile/tile
      // 正确✅： texture/title/title
      resources.loadDir(dir, SpriteFrame, (err, res) => {
        if (err) return reject(err);
        return resolve(res as any);
      });
    });
  }
}
