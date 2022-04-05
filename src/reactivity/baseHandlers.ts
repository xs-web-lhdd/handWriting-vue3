import { track, trigger } from './effect'
import {  ReactiveFlags} from './reactive'

// 提出来做到缓存效果，起到性能优化作用
const get = createGetter()
const set = createSetter()
const readonlyGetter = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key) {
    if(key === ReactiveFlags.IS_REACTIVE) return !isReadonly
    else if(key === ReactiveFlags.IS_READONLY) return isReadonly

    const res = Reflect.get(target, key)
    if(!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}


export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGetter,
  set(target, key, value) {
    console.warn(`
      key: ${key} set 失败，因为 target: ${target} 是 readonly
    `)
    return true
  }
}