<script setup lang="ts">
import { NIcon, NPopover, NAvatar, NMenu } from 'naive-ui'
import { TimeOutline, ChatbubblesSharp, EyeOutline } from '@vicons/ionicons5'
</script>

<template>
  <div class="card">
    <div class="article-info">
      <div class="article-info-left">
        <div class="article-title">How To Get Started Tutorial</div>
        <div class="article-statics">
          <span class="static">
            <NIcon size="16" color="#14bbba">
              <TimeOutline />
            </NIcon>
            <span>2021-01-01</span>
          </span>
          <span class="static">
            <NIcon size="16" color="#14bbba">
              <ChatbubblesSharp />
            </NIcon>
            <span>4</span>
          </span>
          <span class="static">
            <NIcon size="16" color="#14bbba">
              <EyeOutline />
            </NIcon>
            <span>2021-01-01</span>
          </span>
        </div>
      </div>
      <div class="article-info-right">
        <NPopover trigger="click">
          <template #trigger>
            <NAvatar
              round
              :size="64"
              src="https://freya.primevue.org/demo/images/avatar/circle/avatar-f-2.png"
            >
            </NAvatar>
            <NMenu></NMenu>
          </template>
        </NPopover>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card {
  background: #ffffff;
  box-sizing: border-box;
  padding: 2rem;
  margin: 2rem;
  box-shadow: 0px 10px 40px rgba(41, 50, 65, 0.06);
  border-radius: 24px;
}

.article-info {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.article-title {
  margin-top: -1rem;
  margin-bottom: 1.5rem;
  padding-right: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: left;
  color: #293241;
}

.article-statics {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 1rem;
}

.static {
  border: solid 1px;
  border-radius: 10px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  align-items: center;
  font-weight: 500;
  display: inline-flex;
  border-color: #dee2e6;
}

.article-info-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
