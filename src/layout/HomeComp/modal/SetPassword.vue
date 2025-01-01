<template>
  <a-modal title="重置密码" :visible="show" :maskClosable="false" @cancel="onCancel">
    <!-- 新建一个业务系统 -->
    <a-form-model
      ref="resetPasswordForm"
      :model="dataSource"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item class="col--label col--label--right" label="原密码" prop="oldPassword">
        <a-input placeholder="请输入原密码" v-model="dataSource.oldPassword" autocomplete="off" max="20" min="8" />
      </a-form-model-item>

      <a-form-model-item class="col--label col--label--right" label="新密码" prop="newPassword">
        <a-input placeholder="请输入新密码" v-model="dataSource.newPassword" autocomplete="off" max="20" min="8" />
      </a-form-model-item>

      <a-form-model-item class="col--label col--label--right" label="再次输入" prop="confirmPassword">
        <a-input
          placeholder="重再次输入新密码"
          v-model="dataSource.confirmPassword"
          autocomplete="off"
          max="20"
          min="8"
        />
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button @click="onCancel"> 取消 </a-button>
      <a-button type="primary" @click="onSave"> 确认 </a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import adminApi from '@/api/admin/admin.api'
import * as CryptoJS from 'crypto-js'
import { message } from 'ant-design-vue'

import { Vue, Component, PropSync, Watch, Ref } from 'vue-property-decorator'

import { FormModel } from 'ant-design-vue'

@Component({})
export default class SetInformation extends Vue {
  @PropSync('visible', { type: Boolean }) show!: boolean

  @Ref('resetPasswordForm') readonly resetPasswordForm!: FormModel

  resetPasswordRules = {
    oldPassword: [{ trigger: 'change', required: true }],
    newPassword: [
      {
        required: true,
        max: 20,
        min: 8,
        pattern: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[*?!&￥$%^#,./@";:><[\]}{\-=+_\\|》《。，、？’‘“”~ `]).*$/,
        trigger: 'change',
      },
    ],
    confirmPassword: [{ required: true, max: 50, trigger: 'change' }],
  }
  labelCol = { span: 6 }
  wrapperCol = { span: 16 }
  dataSource = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  get rules() {
    // 密码格式校验
    const regX = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}', 'g')

    let oldPassword = (rule: any, value: string, callback: (arg0: Error | undefined) => void) => {
      if (value === '') {
        callback(new Error('请输入正确的旧密码'))
      } else if (value.length < 8 || value.length > 20) {
        callback(new Error('密码长度为8~20'))
      } else if (!regX.exec(value)) {
        callback(new Error('密码包含大小写字母 、数字 、特殊字符 , 且长度为8~20'))
      } else {
        if (this.dataSource.oldPassword !== '') {
          this.resetPasswordForm.validateField('oldPassword', (errorMessage) => {
            console.log(errorMessage)
          })
        }
        callback(undefined)
      }
    }

    let newPassword = (rule: any, value: string, callback: (arg0: Error | undefined) => void) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 8 || value.length > 20) {
        callback(new Error('密码长度为8~20'))
      } else if (value === this.dataSource.oldPassword) {
        callback(new Error('新密码和旧密码不能一样'))
      } else if (!regX.exec(value)) {
        callback(new Error('密码包含大小写字母 、数字 、特殊字符 , 且长度为8~20'))
      } else {
        if (this.dataSource.newPassword !== '') {
          this.resetPasswordForm.validateField('newPassword', (errorMessage) => {
            console.log(errorMessage)
          })
        }
        callback(undefined)
      }
    }

    let confirmPassword = (rule: any, value: string, callback: (arg0: Error | undefined) => void) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.dataSource.newPassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback(undefined)
      }
    }
    return {
      oldPassword: [
        {
          ...this.resetPasswordRules.oldPassword[0],
          validator: oldPassword,
        },
      ],
      newPassword: [{ ...this.resetPasswordRules.newPassword[0], validator: newPassword }],
      confirmPassword: [{ ...this.resetPasswordRules.confirmPassword[0], validator: confirmPassword }],
    }
  }

  onCancel() {
    this.resetPasswordForm.resetFields()
    this.show = false
  }
  async onSave() {
    this.resetPasswordForm.validate(async (valid: any) => {
      if (valid) {
        await adminApi.getChangePassword({
          oldPassword: this.encrypt(this.dataSource.oldPassword),
          newPassword: this.encrypt(this.dataSource.newPassword),
          userId: JSON.parse(window.sessionStorage.getItem('administrativeUserInfo') || '{}')?.id || '',
        })
        message.success('密码修改成功！')
        this.onCancel()
      }
    })
  }
  /**
   * 加密方式 -- AES
   * @param word
   * @returns
   */
  encrypt(word: string) {
    let key = CryptoJS.enc.Utf8.parse('UDDjuXcjfIp2suIP')
    let srcs = CryptoJS.enc.Utf8.parse(word)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
  }
}
</script>
