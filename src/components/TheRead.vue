<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { EyeOutline } from '@vicons/ionicons5'
const props = defineProps({
  readCount: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <NButton tertiary :bordered="false" class="clear-btn">
    <template #icon>
      <NIcon size="16">
        <EyeOutline />
      </NIcon>
    </template>
    <span>{{ props.readCount }}</span>
  </NButton>
</template>

<style lang="less" scoped>
@import url('../assets/clearbtn.css');

button > :first-child {
  margin: 0;
}
</style>
