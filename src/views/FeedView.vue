<script setup lang="ts">
import { ref } from 'vue'
import ArticleAbstraction from '@/components/ArticleAbstraction.vue'
import type { ArticleAbstract } from '../types/article'
import { NGrid, NGi, NInfiniteScroll, NResult } from 'naive-ui'

import type { Response } from '@/types/axios'
import type { Feed, FeedEventRequest } from '@/types/feed'

import { findFeedEvents } from '@/api/feed'
import { cancleCollect, cancelLike, collect, like } from '@/api/interact'
import type { Author } from '@/types/author'

const items = ref<ArticleAbstract[]>([])

const eventRequest = ref<FeedEventRequest>({
  limit: 20,
  timestamp: Date.now(),
})

const loading = ref(false)
const noMore = ref(false)

const handleLoad = async () => {
  if (loading.value || noMore.value) {
    return
  }
  loading.value = true
  findFeedEvents(eventRequest.value).then((res: Response<Feed[]>) => {
    if (res.code === '200') {
      if (res.data.length == 0) {
        noMore.value = true
      } else {
        eventRequest.value.timestamp = res.data[res.data.length - 1].createTime
        res.data.forEach(e => {
          const s: string = JSON.stringify(e.ext)
          const obj: any = JSON.parse(s)
          // article.createTime = parseInt(article.createTime.toString())
          const author: Author = JSON.parse(obj.author)
          const tags: string[] = JSON.parse(obj.tags)
          items.value.push({
            id: obj.bizId,
            title: obj.title,
            cover: obj.cover,
            abstraction: obj.abstraction,
            collectCount: parseInt(obj.collectCount),
            likeCount: parseInt(obj.likeCount),
            commentCount: parseInt(obj.commentCount),
            readCount: parseInt(obj.readCount),
            liked: obj.liked === 'true' ? true : false,
            collected: obj.collected === 'true' ? true : false,
            createTime: parseInt(obj.createTime),
            updateTime: parseInt(obj.updateTime),
            tags: tags,
            author: author
          })
        })

      }
    }
  })

  loading.value = false
}

handleLoad()

function handleLike(article: ArticleAbstract) {

  if (article.liked) {
    article.likeCount--
    article.liked = false
    cancelLike('article', article.id)
  } else {
    article.likeCount++
    article.liked = true
    like('article', article.id)
  }
}

function handleCollect(article: ArticleAbstract) {
  if (article.collected) {
    article.collectCount--
    article.collected = false
    cancleCollect('article', article.id)
  } else {
    article.collectCount++
    article.collected = true
    collect('article', article.id)
  }
}
</script>

<template>
  <div class="article-view-wrapper">
    <NInfiniteScroll :distance="10" @load="handleLoad">
      <NGrid :x-gap="20" :y-gap="20" :cols="1">
        <NGi v-for="item in items" :key="item.id">
          <ArticleAbstraction :article="item" @like="handleLike"
            @collect="handleCollect">
          </ArticleAbstraction>
        </NGi>
      </NGrid>
      <div v-if="loading" class="text">Loading...</div>
      <NResult v-if="noMore" status="500" size="small" description="到底了"
        class="no-more">
      </NResult>
    </NInfiniteScroll>
  </div>
</template>

<style lang="less" scoped>
.article-view-wrapper {
  margin-top: 1%;
  margin-left: 15%;
  margin-right: 15%;
}

.text {
  text-align: center;
  margin: 1rem;
}

.no-more {
  margin: 1rem 0 0 0;
}
</style>
