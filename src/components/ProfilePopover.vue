<script setup lang="ts">
import { NAvatar, NIcon, NPopover, } from 'naive-ui'
import {
  PersonCircleOutline as UserIcon,
  LogOutOutline as LogoutIcon
} from '@vicons/ionicons5'

import type { Author } from '@/types/author'
import { useRouter } from 'vue-router'

import { useAuthorStore } from '@/stores/author'
import { useTokenStore } from '@/stores/token'

const router = useRouter()

const authorStore = useAuthorStore()
const tokenStore = useTokenStore()

interface Props {
  author?: Author
  avatarSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  avatarSize: 64
})

function handleSelect(key: string | number) {
  if (key === 'logout') {
    router.push({ path: '/' })
    authorStore.clear()
    tokenStore.clear()
  }
}

function handleClick(target: string) {
  if (target === 'profile') {
    router.push({ name: 'profile' })
  } else if (target === 'usercenter') {
    router.push({ name: 'usercenter' })
  } else if (target === 'logout') {
    authorStore.clear()
    tokenStore.clear()
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <NPopover trigger="click" placement="bottom" style="width: 120px;">
    <template #trigger>
      <NAvatar round :size="avatarSize" :src="author?.avatar"
        style="cursor: pointer;"> </NAvatar>
    </template>
    <template #header>
      <span style="cursor: pointer;" @click="handleClick('profile')">{{
        author?.nickname
        }}</span>
    </template>
    <div style="display: flex; flex-flow: column; gap: 30px;">
      <div style="display: flex; align-items: center;gap: 8px; cursor: pointer;"
        @click="handleClick('usercenter')">
        <NIcon>
          <UserIcon></UserIcon>
        </NIcon>
        <span>个人中心</span>
      </div>
      <!-- <div
        style="display: flex; align-items: center;gap: 8px;margin-bottom: 10px; cursor: pointer;">
        <NIcon>
          <EditIcon></EditIcon>
        </NIcon>
        <span>创作中心</span>
      </div> -->
    </div>
    <template #footer>
      <div style="display: flex; align-items: center;gap: 8px;cursor: pointer;"
        @click="handleSelect('logout')">
        <NIcon>
          <LogoutIcon></LogoutIcon>
        </NIcon>
        <span>退出登录</span>
      </div>
    </template>
  </NPopover>
</template>

<style lang="less" scoped></style>
