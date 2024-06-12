<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { ThumbsUpOutline, ThumbsUpSharp } from '@vicons/ionicons5'
const props = defineProps({
  liked: Boolean,
  likeCount: Number,
  bordered: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['like'])

function handleLike() {
  emit('like')
}
</script>

<template>
  <NButton tertiary :bordered="props.bordered" class="clear-btn" @click="handleLike">
    <template #icon>
      <NIcon size="16" v-if="!liked">
        <ThumbsUpOutline />
      </NIcon>
      <NIcon size="16" v-else color="red">
        <ThumbsUpSharp />
      </NIcon>
    </template>
    <span>{{ props.likeCount }}</span>
  </NButton>
</template>

<style lang="less" scoped>
@import url('../assets/clearbtn.css');

button > :first-child {
  margin: 0;
}
</style>
