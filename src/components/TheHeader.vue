<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { NButton, NInputGroup, NInput, NModal, NIcon } from 'naive-ui'
import ThePassport from './ThePassport.vue'
import { CaretUpCircle } from '@vicons/ionicons5'
import { useAuthorStore } from '@/stores/author'
import ProfilePopover from './ProfilePopover.vue'

const route = useRoute()
const router = useRouter()

const showModal = ref(false)

const authorStore = useAuthorStore()

const isLogin = computed(() => authorStore.isLogin)

const author = computed(() => authorStore.getAuthor)

function closeAuthModal() {
  showModal.value = false
}

const searchWords = ref('')
function handleSearch() {
  // router.replace({ name: "search", query: {} });
  router.push({
    name: 'search',
    query: {
      q: searchWords.value,
      type: route.query.type?.toString() || 'article',
      _t: Date.now(),
    }
  })
}
</script>

<template>
  <div class="nav">
    <div class="logo">
      <img src="/64.jpg" />
      <span>Echo</span>
    </div>
    <div style="display: flex; align-items: center; overflow: hidden">
      <div class="nav-men">

        <NButton tertiary class="article-btn" :bordered="false">
          <RouterLink class="router-link-none-style" to="/">全部</RouterLink>
        </NButton>
        <NButton tertiary class="article-btn" :bordered="false">
          <RouterLink class="router-link-none-style" to="/feed">关注
          </RouterLink>
        </NButton>
        <!-- <NButton tertiary class="qa-btn" :bordered="false">
          <RouterLink class="router-link-none-style" to="/qa">问答</RouterLink>
        </NButton> -->
      </div>
    </div>
    <div class="nav-end">
      <NInputGroup>
        <NInput :style="{ width: '100%' }" round placeholder="请输入关键字"
          v-model:value="searchWords" />
        <NButton type="primary" @click="handleSearch">搜索</NButton>
      </NInputGroup>
      <NButton type="success">
        <template #icon>
          <NIcon>
            <CaretUpCircle />
          </NIcon>
        </template>
        <RouterLink class="router-link-none-style" to="/articles/publish">创作
        </RouterLink>
      </NButton>
      <div style="padding-top: 10px" v-if="isLogin">
        <ProfilePopover :author="author" :avatar-size="32"> </ProfilePopover>
      </div>
      <NButton v-else type="success" @click="showModal = true">
        登录 | 注册</NButton>
      <NModal v-model:show="showModal">
        <ThePassport @closeAuthModal="closeAuthModal" />
      </NModal>
    </div>
  </div>
</template>

<style lang="less" scoped>
.router-link-none-style {
  text-decoration: none;
  color: inherit;
}

.article-btn {
  padding-left: 0;
  background-color: transparent;
}

.article-btn:hover {
  background-color: transparent;
}

.qa-btn {
  padding-left: 0;
  background-color: transparent;
}

.qa-btn:hover {
  background-color: transparent;
}

.nav {
  background: #ffffff;
  display: grid;
  grid-template-columns: 160px 1fr auto;
  grid-template-rows: 65px;
  padding: 0 32px;
}

.nav-menu {
  flex-grow: 0;
  flex-shrink: 1;
  overflow: hidden;
  padding-left: 36px;
}

.nav-end {
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: 10px;
}

.logo {
  cursor: pointer;
  display: flex;
  font-size: 18px;
  align-items: center;

  img {
    width: 64px;
    height: 64px;
  }

  span {
    font-size: 32px;
  }
}
</style>
