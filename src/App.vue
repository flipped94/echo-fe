<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import { NBackTop, NIcon, NMessageProvider } from 'naive-ui'
import CopyRight from '@/components/CopyRight.vue'
import { Rocket } from '@vicons/ionicons5'
</script>

<template>
  <NMessageProvider>
    <div style="display:grid;grid-template-rows:auto 13.9fr 0.01fr">
      <TheHeader class="header"></TheHeader>
      <RouterView></RouterView>
      <CopyRight class="footer"></CopyRight>
      <NBackTop :right="40" :bottom="60" :style="{
        transition: 'all .3s cubic-bezier(.4, 0, .2, 1)'
      }">
        <NIcon size="24">
          <Rocket style="transform: rotate(-45deg)" />
        </NIcon>
      </NBackTop>
    </div>
  </NMessageProvider>
</template>
<style scoped>
* {
  background: #f2f4f6;
}

.header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 99;
}

.footer {
  text-align: center;
  background: #ffffff;
  margin-top: 10px;
  line-height: 50px;
  border-radius: 24px;
  align-items: center;
}
</style>
