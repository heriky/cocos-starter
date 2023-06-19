import { AnimationClip, Sprite, SpriteFrame, animation } from 'cc';
import { ResourceManager } from '../runtime/ResourceManager';
import { StateMachine } from './StateMachine';

/**
 * 1. 需要拥有动画（State内部加载）
 * 2. 需要拥有播放动画的能力（来自于fsm提供，在fsm中添加公用动画组件）
 */

// 每秒8帧
const FRAME_INTERVAL = 1 / 8;

export class State {
  clip: AnimationClip | null = null;

  constructor(
    private fsm: StateMachine,
    private animPath: string,
    private animWrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    this.init();
  }

  async init() {
    const pm = ResourceManager.instance.loadDirRes<SpriteFrame>(this.animPath);
    this.fsm.waitingList.push(pm);
    const spriteFrames = await pm;

    const clip = new AnimationClip();
    this.clip = clip;
    const track = new animation.ObjectTrack();
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame'); // !toComponent中不能写字符串
    track.channel.curve.assignSorted(spriteFrames.map((sp, index) => [index * FRAME_INTERVAL, sp])); // !数组中第二个参数不是{ value: sp }，而是sp

    clip.name = this.animPath;
    clip.addTrack(track);
    clip.duration = FRAME_INTERVAL * spriteFrames.length;
    clip.wrapMode = this.animWrapMode;
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.clip;
    this.fsm.animationComponent.play();
  }
}
