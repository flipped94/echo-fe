<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { TimeOutline } from '@vicons/ionicons5'
import { computed } from 'vue'
import { formatTime } from '../utils/date'
const props = defineProps({
  time: {
    type: Number,
    required: true
  },
  pattern: {
    type: String,
    default: 'yyyy-MM-dd',
    required: false
  }
})
const createTime = computed(() => formatTime(new Date(props.time), props.pattern))
</script>

<template>
  <NButton tertiary :bordered="false" class="clear-btn">
    <template #icon>
      <NIcon size="16">
        <TimeOutline />
      </NIcon>
    </template>
    <span>{{ createTime }}</span>
  </NButton>
</template>

<style lang="less" scoped>
@import url('../assets/clearbtn.css');

button > :first-child {
  margin: 0;
}
</style>
