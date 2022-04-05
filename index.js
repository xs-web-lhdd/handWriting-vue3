

function isOk(arr) {
  var count = 0
  for(var i = 0; i < arr.length; i++) {
    var item = arr[i]
    if(item.length > 10) continue
    if(typeof item === 'number') continue
    let flag = true
    for(var j = 0; j < item.length; j++) {
      if(!isStr(item[j])) {
        flag = false
      }
    }
    if(flag) count++
  }

  return count
}

function isStr(s) {
  return s.charCodeAt() >= 'a'.charCodeAt() && s.charCodeAt() <= 'z'.charCodeAt() || s.charCodeAt() >= 'A'.charCodeAt() && s.charCodeAt() <= 'Z'.charCodeAt()
}

console.log(isOk(['BA', 'aOWVXARgUbJDG', 'OPPCSKNS', 'HFDJEEDA', 'ABBABBBBAABBBAABAAA', 1111, 'E_DEH', '$$$$$$$']));