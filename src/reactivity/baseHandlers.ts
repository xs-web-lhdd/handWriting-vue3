import { track, trigger } from './effect'
import {  reactive, readonly , ReactiveFlags} from './reactive'
import { extend, isObject } from '../shared'

// 提出来做到缓存效果，起到性能优化作用
const get = createGetter()
const set = createSetter()
const readonlyGetter = createGetter(true)
const shallowReadonlyGetter = createGetter(true, true)

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    if(key === ReactiveFlags.IS_REACTIVE) return !isReadonly
    else if(key === ReactiveFlags.IS_READONLY) return isReadonly

    const res = Reflect.get(target, key)

    if(isShallow) return res

    if(isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGetter
})