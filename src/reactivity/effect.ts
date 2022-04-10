import { extend } from '../shared'

const targetMap = new WeakMap()

let activeEffect
let shouldTrack

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}
 
export function track(target, key) {
  // if(!activeEffect)  return
  // if(!shouldTrack) return
  if(!isTracking()) return

  let depMaps = targetMap.get(target)
  if(!depMaps) {
    targetMap.set(target, (depMaps = new Map()))
  }
  let dep = depMaps.get(key)
  if(!dep) {
    depMaps.set(key, (dep = new Set()))
  }

  trackEffect(dep)

}

export function trackEffect(dep) {
  if(dep.has(effect)) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  const depMaps = targetMap.get(target)
  const dep = depMaps.get(key)

  triggerEffect(dep)
}

export function triggerEffect(dep) {
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

    // 执行这里说明是已经 stop 过了 effect 函数了然后是再次触发响应式的时候见，单侧的 obj.prop++ 案例
    if(!this.active) {
      return this._fn()
    }
    
    shouldTrack = true
    activeEffect = this
    const res = this._fn()
    shouldTrack = false
    
    return res
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
  // 删除完 dep，deps 置为空就行了 
  effect.deps.length = 0
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