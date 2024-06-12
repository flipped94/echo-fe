<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { ChatbubbleOutline } from '@vicons/ionicons5'
const props = defineProps({
  commentCount: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <NButton tertiary :bordered="false" class="clear-btn">
    <template #icon>
      <NIcon size="16">
        <ChatbubbleOutline />
      </NIcon>
    </template>
    <span>{{ props.commentCount }}</span>
  </NButton>
</template>

<style lang="less" scoped>
@import url('../assets/clearbtn.css');

button > :first-child {
  margin: 0;
}
</style>
