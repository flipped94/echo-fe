<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { HeartOutline, HeartSharp } from '@vicons/ionicons5'
const props = defineProps({
  collected: {
    type: Boolean,
    default: false,
    required: true
  },
  collectCount: {
    type: Number,
    default: 0,
    required: true
  }
})

const emit = defineEmits(['collect'])
</script>

<template>
  <NButton tertiary :bordered="false" class="clear-btn" @click="() => emit('collect')">
    <template #icon>
      <NIcon size="16" v-if="!collected">
        <HeartOutline />
      </NIcon>
      <NIcon size="16" v-else color="red">
        <HeartSharp />
      </NIcon>
    </template>
    <span>{{ props.collectCount }}</span>
  </NButton>
</template>

<style lang="less" scoped>
@import url('../assets/clearbtn.css');

button > :first-child {
  margin: 0;
}
</style>
