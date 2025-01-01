import { getKeyByValue } from '@/common/toolFun/util'
import { PERMISSION_MAPPER, PERMISSION_MAPPER_KEY } from './permission.mapper/permission.mapper'
import { PERMISSION_CODE } from './permission.code.enum.module'

// 检测PERMISSION_CODE 和 PERMISSION_MAPPER的函数,检测内容如下注释!!!!!!
const checkMapper = (permissions: any) => {
  const nodes = Object.keys(permissions).reduce((acc, permission) => {
    permission.split('_').forEach((node) => {
      acc.add(node)
    })
    return acc
  }, new Set<string>())

  // PERMISSION_MAPPER 中缺失的 需要在nodes 中使用 key 值,即少配的
  const needAddMapper = [...nodes].filter((node) => !(PERMISSION_MAPPER as any)[node])
  if (needAddMapper.length > 0) {
    setTimeout(() => {
      console.error(
        `以下权限码节点未匹配到映射关系，请在【 PERMISSION_MAPPER 】中添加->
             ${needAddMapper.join('、')}`
      )
    })
    const objectStr = needAddMapper.reduce((acc, item) => {
      acc += `${item}='',`
      return acc
    }, '')
    console.log(objectStr)
  }
  //PERMISSION_MAPPER 中没有在nodes中使用到的 key 值,即多配的
  const notUsedMapper = Object.keys(PERMISSION_MAPPER).filter((key) => !nodes.has(key) && key !== 'S_NAME')
  if (notUsedMapper.length > 0) {
    console.error('notUsedMapper', notUsedMapper)
  }
  //PERMISSION_MAPPER 检测第二个key的value与第一个key的value 相同, 即重复配的
  Object.keys(PERMISSION_MAPPER).some((key) => {

    const result = getKeyByValue(PERMISSION_MAPPER, (PERMISSION_MAPPER as any)[key])
    if (result !== key) {
      console.error(`【PERMISSION_MAPPER.${key}】与【PERMISSION_MAPPER.${result}】重复`)
      return true
    }
    return false
  })
}

const runTesting = () => {
  console.time('checkMapper')
  checkMapper(PERMISSION_CODE)
  console.timeEnd('checkMapper')
}

export default runTesting
