<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NFlex, NTag } from 'naive-ui'
import TheFavorite from './TheFavorite.vue'
import TheLike from './TheLike.vue'
import TheComment from './TheComment.vue'
import TheRead from './TheRead.vue'
import TheTime from './TheTime.vue'
import type { ArticleAbstract } from '@/types/article'
import AuthorPopover from './AuthorPopover.vue'

interface Props {
  article: ArticleAbstract
}

const props = defineProps<Props>()

const url = computed(() => {
  return '/articles/' + props.article?.id
})

const emits = defineEmits(['like', 'collect'])

function handleLike() {
  emits('like', 'article', props.article.id)
}

function handleCollect() {
  emits('collect', 'article', props.article.id)
}
</script>

<template>
  <a class="article-wrapper">
    <NCard :title="article.title" style="border-radius: 2%" hoverable
      header-style="padding: 8px;cursor: pointer;"
      content-style="padding: 10px;" footer-style="padding: 5px;" :segmented="{
        content: true,
        footer: true,
        action: true
      }">
      <template #cover>
        <RouterLink :to="url">
          <img :src="article.cover" />
        </RouterLink>
      </template>
      <template #header-extra>
        <AuthorPopover :author="article.author" :avatar-size="32">
        </AuthorPopover>
      </template>
      <RouterLink :to="url"
        style="text-decoration: none; color: black; cursor: pointer">
        {{ article.abstraction }}
      </RouterLink>
      <template #footer>
        <div class="article-statics">
          <TheFavorite :collected="article.collected"
            :collectCount="article.collectCount" @click="handleCollect">
          </TheFavorite>
          <TheLike :liked="article.liked" :likeCount="article.likeCount"
            @click="handleLike">
          </TheLike>
          <!-- <TheComment :commentCount="article.commentCount"></TheComment> -->
          <TheComment :commentCount="article.commentCount"></TheComment>
          <TheRead :readCount="article.readCount"></TheRead>
          <TheTime :time="article.createTime" pattern="yyyy/MM/DD"></TheTime>
        </div>
      </template>
      <template #action>
        <NFlex justify="start">
          <NTag v-for="(item, index) in article.tags" :key="index">{{ item }}
          </NTag>
        </NFlex>
      </template>
    </NCard>
  </a>
</template>

<style scoped>
.article-statics {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

:root {
  --n-card-action-color: #ffffff;
}
</style>
