/* eslint-disable no-prototype-builtins */
/**
 * 全局的 公用函数
 */
import _moment from 'moment'
import { saveAs } from 'file-saver'
import permissionService from '@/common/permission/permission.service'
import { MicroUtils } from '@/common/toolFun/micro-utils'
import Big from 'big.js'
import { acceptFileType } from '@/common/enums/accept.enum'

/**
 * 深克隆 */
export function deepClone(source: { [x: string]: any; constructor?: any }) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments')
  }
  const targetObj: any = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

const concatArrayBuffer = (arrayBufferArray: Array<any>) => {
  let totalLength = 0
  arrayBufferArray.forEach((arrayBuffer: any) => {
    totalLength += arrayBuffer.byteLength
  })
  const result = new Uint8Array(totalLength)
  let offset = 0
  arrayBufferArray.forEach((arrayBuffer: any) => {
    result.set(new Uint8Array(arrayBuffer), offset)
    offset += arrayBuffer.byteLength
  })
  return result
}

/**
 * 文件保存
 * @param data 含有Blob对象的响应体 后续可能需要支持minio url地址下载
 * @param fileName 保存的文件名称 优先于响应名称
 */
export const saveFile = (data: any, fileName?: string) => {
  let fileNameText = fileName
  const operatingData = data?.body?.data || data?.data || data

  if (operatingData instanceof Array) {
    const result = concatArrayBuffer(data)
    const blob = new Blob([result], { type: 'application/octet-stream' })
    const a: any = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileNameText
    a.click()
  } else if (typeof operatingData === 'string') {
    // console.error('saveFile 暂不支持url格式下载', data)
    const elink: any = document.createElement('a')
    elink.download = fileNameText
    elink.style.display = 'none'
    elink.href = operatingData
    elink.click()
  }
  // Blob下载
  else if (operatingData instanceof Blob) {
    const headerFileName = data?.headers?.['content-disposition']?.split(';')[1]?.split('filename=')[1] || 'export.zip'
    fileNameText = fileNameText || decodeURIComponent(headerFileName)
    // 非分块下载
    saveAs(operatingData, fileNameText)
  } else {
    console.error('saveFile 数据格式异常')
  }
}

/**
 * 通过值 value 获取对象键 key
 * @param obj
 * @param value
 * @returns
 */
export const getKeyByValue = (obj: { [x: string]: any }, value: any) => {
  return Object.keys(obj).find((key) => obj[key] === value)
}
/**
 * 文件转流
 * @param theBlob
 * @param filename
 * @returns
 */
export const blobToFile = (theBlob: BlobPart, filename: string) => {
  return new window.File([theBlob], filename)
}

export const generateUUID = () => {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() //use high-precision timer if available
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid.replace(/-/g, '')
}
// 获取浏览器中url参数
export const getUrlParams = (url?: string) => {
  // 不传name返回所有值，否则返回对应值
  url = url || location.href
  const arr = url.split('?')
  const params = arr[1].split('&')
  const obj: any = {}
  for (let i = 0; i < params.length; i++) {
    const param = params[i].split('=')
    obj[param[0]] = decodeURLRecursively(param[1])
  }
  return obj
}

// 返回解码参数
export const decodeURLRecursively = function (str: string): any {
  if (str.indexOf('%') != -1) {
    return decodeURLRecursively(decodeURIComponent(str))
  }

  return str
}

// 防抖 函数
export const debounce = function (fn: any, timeout: number | undefined) {
  let timer: string | number | any | null | undefined = null
  return (...args: any) =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        resolve(fn(...args))
      }, timeout || 0)
    })
}
/**
 * 格式化时间
 * @param date
 * @param typeFormat
 * @returns
 */
export const formatDate = (date: Date, typeFormat?: any) => {
  return _moment(date).format((typeFormat || 'YYYY-MM-DD').toLocaleUpperCase())
}

/**
 * 遍历树中是否存在某个节点
 * @param nodes
 * @param id
 * @returns
 */
export const findNodeById: any = (nodes: any, id: string) => {
  for (let node of nodes) {
    if (node.value === id) {
      return node
    }
    if (node.children) {
      const foundInChildren = findNodeById(node.children, id)
      if (foundInChildren) {
        return foundInChildren
      }
    }
  }
  return null
}

/**
 * 鉴权
 * @param code
 * @returns
 */
export const isHasPermission = (code: string) => {
  return permissionService.check(code)
}
export const generateRandomString = (length: number) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}

// 生成一个随机几位字符串const randomString = generateRandomString(4);

/**
 * 数字转字符
 * @param value
 * @returns
 */
export const getNumberByString = (value: any) => {
  if (typeof value === 'string') {
    return value
  } else if (typeof value === 'number') {
    return value.toString()
  } else if (!value) {
    return ''
  }
}

/**
 * 关闭页签
 * @param data
 * @returns
 */
export const closePageTab = (data: any) => {
  MicroUtils.openMicroTab({ ...data, manual: 'delete' })
}

export const isJSON = (str: any) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

/**
 * 单位机构数组遍历
 * @param data
 * @returns
 */
export const mapUnitTree = (data: any) => {
  return data.map((item: any) => {
    if (item.children) {
      item.children = mapUnitTree(item.children)
    }
    if (item.dataList) {
      item.children = [
        ...item.dataList.map((unit: any) => ({
          ...unit,
          disabled: false,
          title: unit.unitName,
          key: unit.unitCode,
          value: unit.unitCode,
        })),
        ...item.children,
      ]
    }
    return {
      ...item,
      title: item.name,
      key: item.code,
      value: item.code,
      disabled: true,
    }
  })
}
// 金额、浮点数加法合计eg:[1,2,3]
export const plus = (data: any) => {
  if (!data) return 0
  let amounts = data
  let total = new Big(0)
  amounts.forEach((amount: any) => {
    total = total.plus(new Big(amount))
  })
  return total.toString()
}

export const beforeUploadChange = (file: any, fileList: any, currentList: any, callback: any) => {
  const type = '.' + file.name.split('.').pop()
  if (acceptFileType.includes(type)) {
    callback(true)
  } else {
    callback(false)
  }
}
