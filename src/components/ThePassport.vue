<script setup lang="ts">
import {
  NCard,
  NTabs,
  NTabPane,
  NForm,
  NButton,
  NFormItemRow,
  NInput,
  useMessage,
  type FormInst,
  type FormRules,
  type FormItemRule
} from 'naive-ui'
import { login, register } from '@/api/auth'
import { profile } from '@/api/author'
import { ref } from 'vue'
import { type Author, AuthorForLogin, AuthorForRegister } from '@/types/author'
import type { Token } from '@/types/token'
import type { Response } from '@/types/axios'
import { encrypt } from '@/utils/rsa'

import { useTokenStore } from '@/stores/token'
import { useAuthorStore } from '@/stores/author'

const emit = defineEmits(['closeAuthModal'])

const tokenStore = useTokenStore()
const authorStore = useAuthorStore()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const authorForLogin = ref(new AuthorForLogin('', ''))
const authorForRegister = ref(new AuthorForRegister('', '', ''))

const loginFormRef = ref<FormInst | null>(null)
const registerFormRef = ref<FormInst | null>(null)

const loginRules = {
  email: {
    required: true,
    validator: isEmail,
    message: '请输入正确的邮箱',
    trigger: ['blur']
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input']
  }
}

const registerRules: FormRules = {
  email: [
    {
      required: true,
      validator: isEmail,
      message: '请输入正确的邮箱',
      trigger: ['input']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input']
    }
  ],
  repeatPassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input']
    },
    {
      validator: validatePasswordSame,
      message: '请输入相同密码',
      trigger: ['input']
    }
  ]
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === authorForRegister.value.password
}

function isEmail(rule: FormItemRule, value: string): boolean {
  return emailRegex.test(value)
}

const message = useMessage()

function loginX(e: MouseEvent) {
  e.preventDefault()
  loginFormRef.value?.validate((errors) => {
    if (!errors) {
      authorForLogin.value.password = encrypt(authorForLogin.value.password)
      login(authorForLogin.value)
        .then((res: Response<Token>) => {
          if (res.code === '200') {
            const token = res.data
            tokenStore.setToken(token)
            profile().then((data: Response<Author>) => {
              if (data.code === '200') {
                const author = data.data
                authorStore.setAuthor(author)
                emit('closeAuthModal')
              } else {
                message.warning(data.message)
              }
            })
          } else {
            message.warning(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  })
}

function registerX(e: MouseEvent) {
  e.preventDefault()
  registerFormRef.value?.validate((errors) => {
    if (!errors) {
      authorForRegister.value.password = encrypt(authorForRegister.value.password)
      authorForRegister.value.repeatPassword = encrypt(authorForRegister.value.repeatPassword)
      const re = new AuthorForRegister(
        authorForRegister.value.email,
        authorForRegister.value.password,
        authorForRegister.value.repeatPassword
      )
      register(re)
        .then((res: Response<Token>) => {
          if (res.code === '200') {
            const token = res.data
            tokenStore.setToken(token)
            profile().then((data: Response<Author>) => {
              if (data.code === '200') {
                const author = data.data
                authorStore.setAuthor(author)
                emit('closeAuthModal')
              } else {
                message.warning(data.message)
              }
            })
          } else {
            message.warning(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  })
}
</script>

<template>
  <NCard size="medium" style="width: 500px; height: 500px" role="dialog">
    <NTabs class="card-tabs" default-value="signin" size="large"
      pane-wrapper-style="margin: 0 -4px" pane-style="box-sizing: border-box;">
      <NTabPane name="signin" tab="登录">
        <NForm ref="loginFormRef" :model="authorForLogin" :rules="loginRules">
          <NFormItemRow label="邮箱" path="email">
            <NInput placeholder="请输入邮箱" v-model:value="authorForLogin.email" />
          </NFormItemRow>
          <NFormItemRow label="密码" path="password">
            <NInput type="password" v-model:value="authorForLogin.password"
              show-password-on="click" placeholder="请输入密码" />
          </NFormItemRow>
        </NForm>
        <NButton class="paasport-btn" type="success" block @click="loginX"> 登录
        </NButton>
      </NTabPane>
      <NTabPane name="signup" tab="注册">
        <NForm ref="registerFormRef" :rules="registerRules"
          :model="authorForRegister">
          <NFormItemRow label="邮箱" path="email">
            <NInput v-model:value="authorForRegister.email"
              placeholder="请输入邮箱" />
          </NFormItemRow>
          <NFormItemRow label="密码" path="password">
            <NInput type="password" v-model:value="authorForRegister.password"
              show-password-on="click" placeholder="请输入密码" />
          </NFormItemRow>
          <NFormItemRow label="确认密码" path="repeatPassword">
            <NInput type="password"
              v-model:value="authorForRegister.repeatPassword"
              show-password-on="click" placeholder="请再次输入密码" />
          </NFormItemRow>
        </NForm>
        <NButton class="paasport-btn" type="success" block @click="registerX">
          注册 </NButton>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style lang="less" scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
  height: 500px;
}

.paasport-btn {
  position: absolute;
  bottom: 10%;
}

.card-tabs .n-tab-pane {
  position: relative;
  overflow: hidden;
  height: 400px;
}

.qr {
  margin-left: 14%;
  margin-right: 10%;
}
</style>
, type FormItemRule
