<!--  -->
<template>
  <div class="permission">
    <div class="operate">
      <a-button class="margin-r-1" type="primary" @click="refresh()">刷新节点状态</a-button>
      <span class="margin-r-1">操作:</span>
      <a-select class="margin-r-1" v-model="action">
        <a-select-option value="0">创建并剪枝</a-select-option>
        <a-select-option value="1">创建</a-select-option>
        <a-select-option value="2">剪枝</a-select-option>
      </a-select>
      <a-button type="primary" @click="invokeAction()">执行操作</a-button>
    </div>
    <h1>administrative系统权限编码树{{ createdCount }}/{{ systemPermissionList.length }}</h1>
    <div class="system-permission">
      <ab-tree :data="systemPermissionTreeNodes" default-expand-all :height="400" class="tree">
        <template slot-scope="{ data }">
          <span>
            <span>{{ data.name }}</span>
            <span class="node-right">{{ isCreate(data) ? '' : '未创建' }}</span>
          </span>
        </template>
      </ab-tree>
    </div>
    <h1>待剪枝列表</h1>
    <div class="wait-delete">
      <ul>
        <li v-for="(item, key) in needDeleteList" :key="key">
          <span>菜单名称：{{ item.name }}</span>
          <span> 权限编码：{{ item.code }} </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { PERMISSION_CODE } from '@/common/permission/permission.code.enum.module'
import { PERMISSION_MAPPER } from '@/common/permission/permission.mapper/permission.mapper'
import AppApiObj from '@/api/app/app.api'
import { TreeUtils } from '@/common/permission/permission.treeUtil'
import PermissionApiObj from '@/api/permission/permission.api'
import { present } from '@/api/user/user.api'

export default {
  data() {
    return {
      allowedUsers: ['admin'],
      /**
       * 操作类型
       */
      action: '0',
      /**
       * 已创建数量
       */
      createdCount: 0,
      /**
       * 系统中权限列表
       */
      systemPermissionList: [],
      /**
       * 系统中权限树
       */
      systemPermissionTreeNodes: [],
      /**
       * admin系统设置权限
       */
      appPermissions: [],
      /**
       * admin中系统信息
       */
      systemInfo: '',
      /**
       * 需要剪枝的权限
       */
      needDeleteList: [],
      /**
       * 权限和id映射关系 创建权限时需要
       */
      permissionIdMapper: {},
      /**
       * admin权限树
       */
      appPermissionsTree: [],
      /**
       * 重试次数
       */
      retryCount: 5,
    }
  },
  async created() {
    const userInfo = await present()

    if (!this.allowedUsers.includes(userInfo.username)) {
      return this.$router.push({ path: '/' })
    }
    this.refresh()
  },
  methods: {
    /**
     * 初始化权限树
     */
    systemTreeInit() {
      //通过权限枚举获取权限列表
      this.systemPermissionList = [this.permissionConvertCode('S')]
      Object.keys(PERMISSION_CODE)
        .filter((key) => key.startsWith('S_'))
        .forEach((key) => {
          const permission = this.permissionConvertCode(key)
          if (!this.systemPermissionList.find((item) => item.fullCode === permission.fullCode)) {
            this.systemPermissionList.push(permission)
          }
        })
      const findNoParentPermission = () => {
        return this.systemPermissionList.find(
          (item) =>
            !this.systemPermissionList.some((permission) => item.parentCode === permission.fullCode) &&
            item.fullCode !== PERMISSION_MAPPER.S
        )
      }
      let noParentPermission = findNoParentPermission()
      //给没有父节点的权限生成一个父节点
      while (noParentPermission) {
        const node = noParentPermission.permission.split('_')
        node.pop()
        this.systemPermissionList.push(this.permissionConvertCode(node.join('_')))
        noParentPermission = findNoParentPermission()
      }
      //获取权限编码树结构
      this.systemPermissionTreeNodes = this.systemPermissionList
        .map((parent) => {
          this.systemPermissionList.forEach((child) => {
            if (parent.fullCode === child.parentCode) {
              parent.children.push(child)
              parent.isLeaf = false
            }
          })
          return parent
        })
        .filter((item) => item.parentCode === '')
      console.log('systemPermissionList', this.systemPermissionList)
      console.log('systemPermissionTreeNodes', this.systemPermissionTreeNodes)
    },

    /**
     * 权限转换为权限编码
     * @param permission
     * @returns
     */
    permissionConvertCode(permission) {
      const item = permission.split('_')
      const name = this.last(item) === 'S' ? PERMISSION_MAPPER.S_NAME : this.last(item)
      const code = PERMISSION_MAPPER[this.last(item)]
      const fullCode = item.map((permissionName) => PERMISSION_MAPPER[permissionName]).join(':')
      item.pop()
      const parentCode = item.map((permissionName) => PERMISSION_MAPPER[permissionName]).join(':')
      return { name, code, fullCode, parentCode, children: [], isLeaf: true, expanded: true, permission }
    },
    /**
     * 获取业务系统
     * @param isCreate
     * @returns
     */
    async getBusinessSystem(isCreate = false) {
      const response = await AppApiObj.list(
        {
          columns: [
            {
              filterOperatorCode: 5,
              name: 'code',
              type: 'string',
              value: 'administrative',
            },
          ],
          paging: {
            currentPage: 1,
            pageSize: 50,
            sortField: '',
            sortWay: 'asc',
            totalCount: 0,
          },
          sortList: [],
        },
        '0'
      )
      this.systemInfo = response.data[0]
      if (this.systemInfo) {
        await this.getPermissions()
      }
      if (!this.systemInfo && isCreate) {
        await AppApiObj.create({
          name: PERMISSION_MAPPER.S_NAME,
          code: PERMISSION_MAPPER.S,
          description: '',
        })
        return this.getBusinessSystem()
      }
    },

    /**
     * 获取admin业务系统权限编码
     */
    async getPermissions() {
      const res = await AppApiObj.permissions(this.systemInfo.id)
      this.appPermissionsTree = res.result
      this.appPermissions = []
      this.needDeleteList = []
      this.permissionIdMapper = {}
      TreeUtils.depthFirstSearch(this.appPermissionsTree, (permission) => {
        this.permissionIdMapper[permission.code] = permission.id
        this.appPermissions.push(permission)
        if (!this.systemPermissionList.find((item) => item.fullCode === permission.code)) {
          this.needDeleteList.push(permission)
        }
      })
    },

    /**
     * 检查权限是否创建
     * @param data
     * @returns
     */
    isCreate(data) {
      if (!this.systemInfo) {
        return false
      }
      if (data.fullCode === PERMISSION_MAPPER.S) {
        return true
      }
      return this.appPermissions.find((item) => item.code === data.fullCode)
    },
    /**
     * 获取数组最后一项
     * @param array
     * @returns
     */
    last(array) {
      if (Array.isArray(array) && array.length > 0) {
        return array[array.length - 1]
      }
      return null
    },
    //刷新节点状态
    async refresh() {
      this.systemTreeInit()
      await this.getBusinessSystem()
      this.createdCount = 0
      this.systemPermissionList.forEach((permission) => {
        if (this.isCreate(permission)) {
          this.createdCount++
        }
      })
    },

    /**
     * 执行操作
     * @returns
     */
    async invokeAction() {
      // await this.confirm.warning(`请确认要操作的系统，防止对其他业务系统误操作
      // 操作的系统名称为:${PERMISSION_MAPPER.S_NAME}
      // 操作的系统编码为:${PERMISSION_MAPPER.S}`)
      try {
        await this.refresh()
        if (this.action === '0') {
          await this.create()
          await this.prune()
        } else if (this.action === '1') {
          await this.create()
        } else if (this.action === '2') {
          await this.prune()
        }
        await this.refresh()
      } catch (error) {
        console.log(error)
        if (this.retryCount > 0) {
          this.retryCount--
          //   this.notify.info('操作失败', '正在重试！！')
          return this.invokeAction()
        }
        // this.notify.error('操作失败', '重试达到次数上限，请联系管理员')
      }
    },

    /**
     * 创建权限
     */
    async create() {
      const createQueue = []
      TreeUtils.depthFirstSearch(this.systemPermissionTreeNodes, (permission) => {
        if (!this.isCreate(permission)) {
          createQueue.push(permission)
        }
      })
      while (createQueue.length > 0) {
        const currentPermission = createQueue.shift()
        if (currentPermission.fullCode === PERMISSION_MAPPER.S) {
          await this.getBusinessSystem(true)
        } else {
          const id = await PermissionApiObj.create({
            appId: this.systemInfo.id,
            backendUris: [],
            code: currentPermission.fullCode,
            controlType: 1,
            name: currentPermission.name,
            parentPermissionId:
              currentPermission.parentCode === PERMISSION_MAPPER.S
                ? '0'
                : this.permissionIdMapper[currentPermission.parentCode]?.result ||
                  this.permissionIdMapper[currentPermission.parentCode],
          })
          this.permissionIdMapper[currentPermission.fullCode] = id
        }
      }
    },

    /**
     * 剪枝
     */
    async prune() {
      //   const value = await this.confirm.warning(`确认进行剪枝操作？`, {
      //     cancelIsReject: false,
      //   })
      const value = true
      while (this.needDeleteList.length > 0 && value) {
        const deletePermission = this.needDeleteList.pop()
        await PermissionApiObj.delete(deletePermission.id)
      }
    },
  },
}
</script>
<style scoped lang="less">
.tree {
  width: 500px;
}
.node-right {
  margin-left: 250px;
}
.permission {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  .system-permission {
    overflow: hidden scroll;
    flex: 2;
  }
  .wait-delete {
    overflow: hidden scroll;
    flex: 1;
  }
}
.operate {
  display: flex;
  align-items: center;
}
.margin-r-1 {
  margin-right: 8px;
}
</style>
