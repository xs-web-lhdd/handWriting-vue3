import { extend } from '../shared'

const targetMap = new WeakMap()

let activeEffect
 
export function track(target, key) {
  let depMaps = targetMap.get(target)
  if(!depMaps) {
    targetMap.set(target, (depMaps = new Map()))
  }
  let dep = depMaps.get(key)
  if(!dep) {
    depMaps.set(key, (dep = new Set()))
  }

  if(!activeEffect)  return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)

}

export function trigger(target, key) {
  const depMaps = targetMap.get(target)
  const dep = depMaps.get(key)

  dep.forEach(effect => {
    // if(activeEffect !== effect) {
      if(effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    // }
  })
}


class ReactiveEffect {
  public scheduler: any
  private _fn: any
  deps: never[]
  active: boolean
  onStop: any
  
  constructor(fn, scheduler?) {
    this._fn = fn
    this.scheduler = scheduler
    this.deps = []
    this.active = true
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    // 添加状态 active ,防止多次清空浪费性能
    if(this.active) {
      cleanupEffect(this)
      // 执行 stop 后的回调函数
      if(this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => dep.delete(effect))
}

export function effect(fn, options: any = {}) {

  const _effect = new ReactiveEffect(fn, options.scheduler)

  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}