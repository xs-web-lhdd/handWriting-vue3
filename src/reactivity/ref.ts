import { hasChance, isObject } from '../shared'
import { trackEffect, triggerEffect, isTracking } from './effect'
import { reactive } from './reactive'



class RefImpl {
  private _value: any
  dep: Set<unknown>
  private _rawValue: any
  public __v_isRef = true
  constructor(value) {
    // 没有处理过的值
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set() 
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    
    if(hasChance(this._rawValue, newVal)) {
      this._rawValue = newVal
      this._value = convert(newVal)
      triggerEffect(this.dep)
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref) {
  if(isTracking()) {
    trackEffect(ref.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, newVal) {
      if(isRef(target[key]) && !isRef(newVal)) {
        return target[key].value = newVal
        // return Reflect.set(target, key, ref(newVal))
      } else {
        return Reflect.set(target, key, newVal)
      }
    }
  })
}