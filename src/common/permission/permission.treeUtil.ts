/**
 * 遍历树节点参数
 */
export interface TreeSearchOptions {
  /**
   * 查询的key 默认children
   */
  key?: string

  /**
   * 是否在节点上挂载父节点节点
   */
  isAddParentNode?: boolean

  /**
   * 是否删除父节点
   */
  isDeleteParentNode?: boolean

  /**
   * 挂载父节点的key
   */
  addParentKey?: string
}

export class TreeUtils {
  /**
   * 深度优先遍历
   * @param node 遍历树节点
   * @param callback 接收一个回调 回调能收到每个节点的信息 返回true终止遍历
   * @param key 要遍历的key 默认为 children
   * @returns {void}
   */
  public static depthFirstSearch<T = any>(
    node: any,
    callback: (currentNode: T) => any,
    {
      key = 'children',
      isAddParentNode = false,
      isDeleteParentNode = false,
      addParentKey = '_parentNode',
    }: TreeSearchOptions = {}
  ): void {
    const historyList: any[] = []
    const stack: any[] = []
    if (Array.isArray(node)) {
      for (let i = node.length - 1; i >= 0; i--) {
        stack.push(node[i])
      }
    } else {
      stack.push(node)
    }
    while (stack.length > 0) {
      const currentNode = stack.pop()
      historyList.push(currentNode)
      const result = callback(currentNode)
      if (result) {
        TreeUtils.deleteParentNode(historyList, isDeleteParentNode, addParentKey)
        TreeUtils.deleteParentNode(stack, isDeleteParentNode, addParentKey)
        return result
      }
      if (Array.isArray(currentNode[key])) {
        for (let i = currentNode[key].length - 1; i >= 0; i--) {
          if (isAddParentNode) {
            //压入队列前将父节点挂载到子节点上 使callback能够获取到父节点
            currentNode[key][i][addParentKey] = currentNode
          }
          stack.push(currentNode[key][i])
        }
      }
    }
    TreeUtils.deleteParentNode(historyList, isDeleteParentNode, addParentKey)
  }

  /**
   * 广度优先遍历
   * @param node 遍历树节点
   * @param callback 接收一个回调 回调能收到每个节点的信息 返回true终止遍历
   * @param key 要遍历的key 默认为 children
   * @returns
   */
  public static breadthFirstSearch<T = any>(
    node: any,
    callback: (currentNode: T) => any,
    {
      key = 'children',
      isAddParentNode = false,
      isDeleteParentNode = false,
      addParentKey = '_parentNode',
    }: TreeSearchOptions = {}
  ) {
    const historyList: any[] = []
    const queue: any[] = []
    if (Array.isArray(node)) {
      queue.push(...node)
    } else {
      queue.push(node)
    }
    while (queue.length > 0) {
      const currentNode = queue.shift()
      historyList.push(currentNode)
      const result = callback(currentNode)
      if (result) {
        TreeUtils.deleteParentNode(historyList, isDeleteParentNode, addParentKey)
        TreeUtils.deleteParentNode(queue, isDeleteParentNode, addParentKey)
        return result
      }
      currentNode[key] = currentNode[key] || []
      for (let i = 0; i < currentNode[key].length; i++) {
        if (isAddParentNode) {
          //压入队列前将父节点挂载到子节点上 使callback能够获取到父节点
          currentNode[key][i][addParentKey] = currentNode
        }
        queue.push(currentNode[key][i])
      }
    }
    TreeUtils.deleteParentNode(historyList, isDeleteParentNode, addParentKey)
  }
  /**
   * 删除多个树节点的指定属性
   * @param list 树节点列表
   * @param isDeleteParentNode 是否删除父节点
   * @returns {void}
   */
  private static deleteParentNode(list: { _parentNode: any }[], isDeleteParentNode = true, addParentKey: any): void {
    if (!isDeleteParentNode) {
      return
    }
    list.forEach((node: any) => {
      if (node?.[addParentKey]) {
        delete node[addParentKey]
      }
    })
  }
}
