<script setup lang="ts">
import { ref } from 'vue'
import ArticleAbstraction from '@/components/ArticleAbstraction.vue'
import type { ArticleAbstract } from '../types/article'
import { NGrid, NGi, NInfiniteScroll, NResult } from 'naive-ui'

import type { PageResult, Response } from '@/types/axios'

import { readerPubList } from '@/api/article'
import { cancleCollect, cancelLike, collect, like } from '@/api/interact'

const items = ref<ArticleAbstract[]>([])

const readerPageRef = ref(1)

const loading = ref(false)
const noMore = ref(false)

const handleLoad = async () => {
  if (loading.value || noMore.value) {
    return
  }
  loading.value = true

  readerPubList(readerPageRef.value, 20).then((res: Response<PageResult<ArticleAbstract>>) => {
    if (res.code === '200') {
      if (res.data.data.length == 0) {
        noMore.value = true
      }
      res.data.data.forEach((e) => {
        items.value.push(e)
      })
      readerPageRef.value++
    }
  })

  loading.value = false
}

handleLoad()

function handleLike(biz: string, bizId: string) {
  items.value.forEach((e) => {
    if (e.id === bizId) {
      if (e.liked) {
        e.likeCount--
        e.liked = false
        cancelLike(biz, bizId)
      } else {
        e.likeCount++
        e.liked = true
        like(biz, bizId)
      }
    }
  })
}

function handleCollect(biz: string, bizId: string) {
  items.value.forEach((e) => {
    if (e.id === bizId) {
      if (e.collected) {
        e.collectCount--
        e.collected = false
        cancleCollect(biz, bizId)
      } else {
        e.collectCount++
        e.collected = true
        collect(biz, bizId)
      }
    }
  })
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
