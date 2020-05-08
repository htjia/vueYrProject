/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function formatDig(num) {
  return num > 9 ? '' + num : '0' + num
}
export function formatDate(mill) {
  const y = new Date(mill)
  const raws = [
    y.getFullYear(),
    formatDig(y.getMonth() + 1),
    formatDig(y.getDate())
  ]
  const format = ['-', '-']
  return String.raw({ raw: raws }, ...format)
}
export function * createWeeks(year) {
  const ONE_DAY = 24 * 3600 * 1000
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  const firstDay = start.getDay() || 7
  const lastDay = end.getDay() || 7
  let startTime = +start
  let endTime = startTime + (7 - firstDay) * ONE_DAY
  const _endTime = end - (7 - lastDay) * ONE_DAY
  yield [startTime, endTime]
  startTime = endTime + ONE_DAY
  endTime = endTime + 7 * ONE_DAY
  while (endTime < _endTime) {
    yield [startTime, endTime]
    startTime = endTime + ONE_DAY
    endTime = endTime + 7 * ONE_DAY
  }
  yield [startTime, +end]
}
export function showWeeks(year, week) {
  const arr = []
  for (const i of createWeeks(year)) {
    const start = i[0]
    const end = i[1]
    arr.push(`${formatDate(start)} ${formatDate(end)}`)
  }
  const time = arr[week - 1]
  return time
}

// 周筛选变为开始时间和结束时间-----end

// 千位分隔符
export function numFormat(num) {
  num = num.toString().split('.') // 分隔小数点
  const arr = num[0].split('').reverse() // 转换成字符数组并且倒序排列
  let res = []
  for (let i = 0, len = arr.length; i < len; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(',') // 添加分隔符
    }
    res.push(arr[i])
  }
  res.reverse() // 再次倒序成为正确的顺序
  if (num[1]) { // 如果有小数的话添加小数部分
    res = res.join('').concat('.' + num[1])
  } else {
    res = res.join('')
  }
  return res
}

export function getMonthDateRange(year, month) {
  const startTime = year + '-' + month + '-01'
  let endTime = ''
  let nextMonthDay = ''
  if (month === 12 + '') {
    nextMonthDay = new Date((+year + 1) + '-01' + '-01').getTime()
  } else {
    nextMonthDay = new Date(year + '-' + (Number(month) + 1) + '-01').getTime()
  }
  const ends = nextMonthDay - 24 * 60 * 60 * 1000
  const yyyy = new Date(ends).getFullYear()
  const MM = (new Date(ends).getMonth() + 1) > 9 ? (new Date(ends).getMonth() + 1) : '0' + (new Date(ends).getMonth() + 1)
  const dd = new Date(ends).getFullYear() > 9 ? new Date(ends).getDate() : '0' + new Date(ends).getDate()
  endTime = yyyy + '-' + MM + '-' + dd

  return { start: startTime, end: endTime }
}

// 深拷贝
export function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]) // 递归复制
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}
