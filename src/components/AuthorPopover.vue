<script setup lang="ts">
import { NPopover, NAvatar, NCard, NFlex, NButton, } from 'naive-ui'


import type { Author } from '@/types/author'
import { computed, ref, watch } from 'vue';

import { useAuthorStore } from '@/stores/author';
import type { FollowRelation } from '@/types/follow';
import { cancelFollow, follow, getFolloInfo } from '@/api/follow';
import type { Response } from '@/types/axios';

interface Props {
  author: Author
  avatarSize?: number
  round: boolean
}

const props = withDefaults(defineProps<Props>(), {
  avatarSize: 32,
  round: true
})

const authorStore = useAuthorStore()

const isLogin = computed(() => authorStore.isLogin)



watch(isLogin, (newValue) => {
  if (newValue) {
    getFolloInfo(authorStore.getAuthor.id, props.author.id).then((res: Response<FollowRelation>) => {
      if (res.code === '200' && res.data) {
        followRef.value = res.data
      }
    })
  } else {
    followRef.value = {
      follower: null,
      followee: null
    }
  }
})

const followRef = ref<FollowRelation>({
  follower: null,
  followee: null,
})

function handleFollow(followed: boolean) {
  if (followed) {
    followRef.value.followee = props.author.id
    follow(props.author.id)

  } else {
    followRef.value.followee = null
    cancelFollow(props.author.id)
  }
}

function handleShowChange(value: boolean) {
  if (value) {
    if (isLogin.value) {
      getFolloInfo(authorStore.getAuthor.id, props.author.id).then((res: Response<FollowRelation>) => {
        if (res.code === '200' && res.data) {
          followRef.value = res.data
        }
      })
    }
  }
}

</script>

<template>
  <NPopover trigger="click" :on-update:show="handleShowChange">
    <template #trigger>
      <NAvatar :round="round" :size="avatarSize" :src="author?.avatar">
      </NAvatar>
    </template>
    <NCard :title="author.nickname" :segmented="{
      content: true,
      // footer: 'soft'
    }">
      <template #header-extra>
        <NAvatar :round="round" :size="avatarSize" :src="author?.avatar">
        </NAvatar>
      </template>
      <template #footer>
        <NFlex>
          <NButton strong secondary round type="success"
            v-if="isLogin && authorStore.authorId != author.id && followRef.followee != null"
            @click="handleFollow(false)">
            取关
          </NButton>
          <NButton strong secondary round type="success"
            v-if="!isLogin || (isLogin && authorStore.authorId != author.id && followRef.followee == null)"
            @click="handleFollow(true)">
            关注</NButton>
          <NButton strong secondary round type="info"
            v-if="authorStore.authorId != author.id">私信</NButton>
        </NFlex>
      </template>
    </NCard>
  </NPopover>
</template>

<style lang="less" scoped></style>
