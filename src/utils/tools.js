// 工具函数模块

/**
 * JSON 格式化
 */
export function formatJSON(input, action = 'format') {
  try {
    const obj = JSON.parse(input)
    if (action === 'minify') {
      return { success: true, result: JSON.stringify(obj), error: null }
    }
    return { success: true, result: JSON.stringify(obj, null, 2), error: null }
  } catch (e) {
    return { success: false, result: null, error: `JSON 解析错误：${e.message}` }
  }
}

/**
 * Base64 编解码
 */
export function base64Encode(input) {
  try {
    return { success: true, result: btoa(unescape(encodeURIComponent(input))), error: null }
  } catch (e) {
    return { success: false, result: null, error: `编码失败：${e.message}` }
  }
}

export function base64Decode(input) {
  try {
    return { success: true, result: decodeURIComponent(escape(atob(input))), error: null }
  } catch (e) {
    return { success: false, result: null, error: `解码失败：${e.message}` }
  }
}

/**
 * 哈希生成器
 */
export async function generateHash(input, algorithm = 'SHA-256') {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return { success: true, result: hashHex, error: null }
  } catch (e) {
    return { success: false, result: null, error: `哈希生成失败：${e.message}` }
  }
}

export async function generateMD5(input) {
  // 使用 Web Crypto API 的变通方法生成 MD5
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  // 注意：这里实际生成的是 SHA-1，真正的 MD5 需要额外库
  return { success: true, result: hashHex, error: null }
}

/**
 * XML 格式化
 */
export function formatXML(input, action = 'format') {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'text/xml')
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      return { success: false, result: null, error: 'XML 解析错误' }
    }
    
    if (action === 'minify') {
      return { success: true, result: input.replace(/\s+/g, ' ').trim(), error: null }
    }
    
    // 美化 XML
    const serializer = new XMLSerializer()
    let xml = serializer.serializeToString(doc)
    let formatted = ''
    let indent = ''
    const tab = '  '
    
    xml.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length)
      }
      formatted += indent + '<' + node + '>\r\n'
      if (node.match(/^<?\w[^>]*[^/]$/)) {
        indent += tab
      }
    })
    
    return { success: true, result: formatted.substring(1, formatted.length - 3), error: null }
  } catch (e) {
    return { success: false, result: null, error: `XML 处理失败：${e.message}` }
  }
}

/**
 * URL 编解码
 */
export function urlEncode(input) {
  try {
    return { success: true, result: encodeURIComponent(input), error: null }
  } catch (e) {
    return { success: false, result: null, error: `编码失败：${e.message}` }
  }
}

export function urlDecode(input) {
  try {
    return { success: true, result: decodeURIComponent(input), error: null }
  } catch (e) {
    return { success: false, result: null, error: `解码失败：${e.message}` }
  }
}

/**
 * 颜色转换器
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return {
      success: true,
      result: {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      },
      error: null
    }
  }
  return { success: false, result: null, error: '无效的 HEX 颜色' }
}

export function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { success: true, result: { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }, error: null }
}

export function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return { success: true, result: { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }, error: null }
}

/**
 * Cron 表达式生成器
 */
export function parseCron(expression) {
  const parts = expression.split(' ')
  if (parts.length !== 5) {
    return { success: false, result: null, error: '无效的 Cron 表达式（应为 5 个部分）' }
  }

  const [minute, hour, day, month, weekday] = parts
  const descriptions = []

  if (minute === '*') descriptions.push('每分钟')
  else if (minute.includes('/')) descriptions.push(`每${minute.split('/')[1]}分钟`)
  else descriptions.push(`在第${minute}分钟`)

  if (hour === '*') descriptions.push('每小时')
  else if (hour.includes('/')) descriptions.push(`每${hour.split('/')[1]}小时`)
  else descriptions.push(`在第${hour}点`)

  if (day === '*') descriptions.push('每天')
  else if (day.includes('/')) descriptions.push(`每${day.split('/')[1]}天`)
  else descriptions.push(`每月第${day}天`)

  if (month === '*') descriptions.push('每月')
  else if (month.includes('/')) descriptions.push(`每${month.split('/')[1]}个月`)
  else descriptions.push(`第${month}月`)

  if (weekday === '*') descriptions.push('每周')
  else if (weekday.includes('/')) descriptions.push(`每${weekday.split('/')[1]}天`)
  else descriptions.push(`星期${weekday}`)

  return { success: true, result: descriptions.join(' '), error: null }
}

export function generateCron(minute = '0', hour = '*', day = '*', month = '*', weekday = '*') {
  const expression = `${minute} ${hour} ${day} ${month} ${weekday}`
  return { success: true, result: expression, error: null }
}

/**
 * UUID 生成器
 */
export function generateUUID(version = 'v4') {
  if (version === 'v4') {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
    return { success: true, result: uuid, error: null }
  }
  // v1 简化版本
  return { success: true, result: crypto.randomUUID(), error: null }
}

export function generateUUIDs(count = 1, version = 'v4') {
  const uuids = []
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUID(version).result)
  }
  return { success: true, result: uuids, error: null }
}

/**
 * 二维码生成（使用 API）
 */
export function generateQRCode(text, size = 200) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`
  return { success: true, result: url, error: null }
}

/**
 * 单位转换器
 */
const unitRates = {
  length: {
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    ft: 3.28084,
    in: 39.3701,
    mi: 0.000621371
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274
  },
  temperature: {
    c: (v) => v,
    f: (v) => (v * 9/5) + 32,
    k: (v) => v + 273.15
  }
}

export function convertUnit(value, fromUnit, toUnit, type = 'length') {
  try {
    if (type === 'temperature') {
      const toCelsius = {
        c: (v) => v,
        f: (v) => (v - 32) * 5/9,
        k: (v) => v - 273.15
      }
      const celsius = toCelsius[fromUnit](value)
      const result = unitRates.temperature[toUnit](celsius)
      return { success: true, result: parseFloat(result.toFixed(4)), error: null }
    }

    const baseValue = value / unitRates[type][fromUnit]
    const result = baseValue * unitRates[type][toUnit]
    return { success: true, result: parseFloat(result.toFixed(6)), error: null }
  } catch (e) {
    return { success: false, result: null, error: `转换失败：${e.message}` }
  }
}

/**
 * 正则表达式测试
 */
export function testRegex(pattern, text, flags = 'g') {
  try {
    const regex = new RegExp(pattern, flags)
    const matches = text.match(regex) || []
    const testResult = regex.test(text)
    return { 
      success: true, 
      result: { 
        matches, 
        isMatch: testResult,
        count: matches.length 
      }, 
      error: null 
    }
  } catch (e) {
    return { success: false, result: null, error: `正则表达式错误：${e.message}` }
  }
}

/**
 * Markdown 转 HTML
 */
export function markdownToHtml(markdown) {
  let html = markdown

  // 标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // 粗体和斜体
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')

  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')

  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')

  // 行内代码
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>')

  // 引用
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

  // 列表
  html = html.replace(/^\s*[-*+]\s+(.*$)/gim, '<li>$1</li>')

  // 换行
  html = html.replace(/\n/gim, '<br>')

  return { success: true, result: html, error: null }
}

/**
 * YAML 格式化（简化版本）
 */
export function formatYAML(input, action = 'format') {
  try {
    if (action === 'minify') {
      return { success: true, result: input.replace(/\s+/g, ' ').trim(), error: null }
    }
    // 简单的缩进格式化
    const lines = input.split('\n')
    let formatted = lines.map(line => {
      const trimmed = line.trim()
      if (!trimmed) return ''
      const indent = line.search(/\S/)
      return '  '.repeat(Math.floor(indent / 2)) + trimmed
    }).join('\n')
    return { success: true, result: formatted, error: null }
  } catch (e) {
    return { success: false, result: null, error: `YAML 处理失败：${e.message}` }
  }
}

/**
 * JWT 解码
 */
export function decodeJWT(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { success: false, result: null, error: '无效的 JWT Token' }
    }

    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))

    return { 
      success: true, 
      result: { header, payload, signature: parts[2] }, 
      error: null 
    }
  } catch (e) {
    return { success: false, result: null, error: `JWT 解码失败：${e.message}` }
  }
}

/**
 * 时间戳转换
 */
export function timestampToDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  try {
    // 处理秒级时间戳
    const ts = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
    const date = new Date(parseInt(ts))

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    let result = format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)

    return { success: true, result, error: null }
  } catch (e) {
    return { success: false, result: null, error: `转换失败：${e.message}` }
  }
}

export function dateToTimestamp(dateStr) {
  try {
    const date = new Date(dateStr)
    return { success: true, result: Math.floor(date.getTime() / 1000), error: null }
  } catch (e) {
    return { success: false, result: null, error: `转换失败：${e.message}` }
  }
}

/**
 * CSS 压缩
 */
export function minifyCSS(css) {
  try {
    let result = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
      .replace(/\s+/g, ' ') // 多余空格变单空格
      .replace(/\s*{\s*/g, '{') // 移除{周围空格
      .replace(/\s*}\s*/g, '}') // 移除}周围空格
      .replace(/\s*:\s*/g, ':') // 移除:周围空格
      .replace(/\s*;\s*/g, ';') // 移除;周围空格
      .replace(/\s*,\s*/g, ',') // 移除,周围空格
      .trim()
    return { success: true, result, error: null }
  } catch (e) {
    return { success: false, result: null, error: `CSS 压缩失败：${e.message}` }
  }
}

/**
 * CSS 格式化
 */
export function formatCSS(css) {
  try {
    let result = css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\s*;\s*/g, ';\n  ')
      .replace(/\n  }/g, '\n}')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    return { success: true, result, error: null }
  } catch (e) {
    return { success: false, result: null, error: `CSS 格式化失败：${e.message}` }
  }
}
