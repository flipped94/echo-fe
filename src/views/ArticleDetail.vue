<script setup lang="ts">
import { NIcon, NImage, NDivider, NInfiniteScroll, NResult } from 'naive-ui'
import { TimeOutline, ChatbubblesSharp, EyeOutline } from '@vicons/ionicons5'
import TheFavorite from '@/components/TheFavorite.vue'
import TheLike from '@/components/TheLike.vue'
import AuthorPopover from '@/components/AuthorPopover.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

import type { Article } from '@/types/article'
import type { Comment, CommentForQuery, Reply } from '@/types/comment'
import type { Response } from '@/types/axios'

import { getArticleById } from '@/api/article'
import { incrReadCount, like, cancelLike, collect, cancleCollect } from '@/api/interact'

import { formatTime } from '@/utils/date'
import CommentPopover from '@/components/CommentPopover.vue'
import { getMoreComments } from '@/api/comment'
import TheComment from '@/components/TheComment.vue'

const route = useRoute()

const articleId = route.params.id

const article = ref<Article>({
  id: '',
  cover: '',
  title: '',
  content: '',
  author: {
    id: '',
    nickname: '',
    avatar: ''
  },
  createTime: 0,
  updateTime: 0,
  readCount: 0,
  collectCount: 0,
  likeCount: 0,
  commentCount: 0,
  liked: false,
  collected: false
})

const mdEditorId = 'preview-only'
const scrollElement = document.documentElement

incrReadCount('article', articleId as string)

getArticleById(articleId as string).then((res: Response<Article>) => {
  if (res.code === '200') {
    article.value = res.data
  }
})

const comments = ref<Comment[]>([])

const commentQuery = ref<CommentForQuery>({
  biz: 'article',
  bizId: articleId as string,
  minCommentId: '9223372036854775807',
  limit: 4
})

const loading = ref(false)
const noMore = ref(false)

loadComments(commentQuery.value)

function loadComments(query: CommentForQuery) {
  if (loading.value || noMore.value) {
    return
  }
  loading.value = true
  getMoreComments(query).then((res: Response<Comment[]>) => {
    if (res.code === '200') {
      if (res.data.length > 0) {
        comments.value.push(...res.data)
        commentQuery.value.minCommentId = res.data[res.data.length - 1].id
      } else {
        noMore.value = true
      }

    }
  })
  loading.value = false
}

function handleLoadComments() {
  commentQuery.value.limit = 100
  loadComments(commentQuery.value)
}

function incrArticleLike() {
  article.value!.liked = !article.value!.liked
  if (article.value!.liked) {
    article.value!.likeCount++
    like('article', article.value.id)
  } else {
    article.value!.likeCount--
    cancelLike('article', article.value.id)
  }
}

function incrCommentLike(biz: string, bizId: string, c: Comment) {
  c.liked = !c.liked
  if (c.liked) {
    c.likeCount++
    like(biz, bizId)
  } else {
    c.likeCount--
    cancelLike(biz, bizId)
  }
}

function incrReplyLike(biz: string, bizId: string, r: Reply) {
  r.liked = !r.liked
  if (r.liked) {
    r.likeCount++
    like(biz, bizId)
  } else {
    r.likeCount--
    cancelLike(biz, bizId)
  }
}

function incrCollect() {
  article.value!!.collected = !article.value!.collected
  if (article.value!.collected) {
    article.value!.collectCount++
    collect('article', articleId as string)
  } else {
    article.value!.collectCount--
    cancleCollect('article', articleId as string)
  }
}

function createComment(comment: Comment) {
  comments.value.unshift(comment)
  article.value!.commentCount++
}



</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-content">
      <div
        style="background: #ffffff; padding: 15px; border-radius: 24px; margin: 0">
        <div class="article-info">
          <div class="article-info-left">
            <div class="article-title">{{ article?.title }}</div>
            <div class="article-statics">
              <span class="static">
                <NIcon size="16" color="#14bbba">
                  <TimeOutline />
                </NIcon>
                <span>{{
                  formatTime(new Date(article?.createTime ?? Date.now()),
                    'YYYY-MM-DD')
                }}</span>
              </span>
              <span class="static">
                <NIcon size="16" color="#14bbba">
                  <ChatbubblesSharp />
                </NIcon>
                <span>{{ article?.commentCount ?? 0 }}</span>
              </span>
              <span class="static">
                <NIcon size="16" color="#14bbba">
                  <EyeOutline />
                </NIcon>
                <span>{{ article?.readCount || 0 }}</span>
              </span>
            </div>
          </div>
          <div class="article-info-right">
            <AuthorPopover :author="article!.author"></AuthorPopover>
            <span class="author-name">{{ article?.author.nickname }}</span>
          </div>
        </div>
        <div class="article-conver-wrapper">
          <NImage object-fit="cover" width="100%" class="article-cover"
            :src="article?.cover">
          </NImage>
        </div>
        <MdPreview :editorId="mdEditorId" :modelValue="article?.content" />
      </div>
      <!-- 评论 -->
      <div class="comments-wrapper">
        <div class="comments-nav">
          <span class="comments-header">评论</span>
          <span class="comments-count">{{ article?.commentCount }}</span>
          <div style="position: absolute; right: 0">
            <CommentPopover biz="article" :biz-id="article!.id" type="comment"
              label="评论" @createComment="createComment">
            </CommentPopover>
          </div>
        </div>
        <NInfiniteScroll :distance="10" @load="handleLoadComments">
          <div v-for="item in comments" :key="item.id" class="comment-list">
            <div style="grid-row: 1; display: flex">
              <AuthorPopover class="comment-author" :author="item.author">
              </AuthorPopover>
              <div style="padding-left: 10px">
                <span
                  style="font-weight: 700; text-align: center; color: #293241">{{
                    item.author.nickname
                  }}</span>
                <p style="
                  margin: 0rem;
                  font-size: 0.875rem;
                  font-weight: 600;
                  color: #606162;
                  line-height: 1.5;
                ">
                  {{ formatTime(new Date(item.createTime), 'yyyy/MM/DD') }}
                </p>
              </div>
            </div>
            <NDivider style="margin: 5px 0 3px 0"></NDivider>

            <div id="md-comment-privew"
              style="display: flex; position: relative; flex-flow: column">
              <MdPreview :editorId="`editor-id-${item.id}`" style="margin: 0"
                :modelValue="item.content" />

              <!-- 回复 -->
              <div style="margin-left: 3rem; display: flex; flex-flow: column">
                <div v-for="reply in item.replies" :key="reply.id"
                  class="comment-list">
                  <div style="display: flex;justify-content: space-between;">
                    <!-- author -->
                    <div
                      style=" display: flex;flex-flow: row;justify-content: space-between;">
                      <div style="grid-row: 1; display: flex">
                        <AuthorPopover class="comment-author"
                          :author="reply.author">
                        </AuthorPopover>
                        <div style="padding-left: 10px">
                          <span
                            style="font-weight: 700; text-align: center; color: #293241">{{
                              reply.author.nickname
                            }}</span>
                          <p style="
                  margin: 0rem;
                  font-size: 0.875rem;
                  font-weight: 600;
                  color: #606162;
                  line-height: 1.5;
                ">
                            {{ formatTime(new Date(reply.createTime),
                              'yyyy/MM/DD')
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <!-- replyto -->
                    <div v-if="reply.type === 'reply'"
                      style="grid-row: 1; display: flex">
                      <AuthorPopover class="comment-author"
                        :author="reply.replyTo">
                      </AuthorPopover>
                      <div style="padding-left: 10px">
                        <span
                          style="font-weight: 700; text-align: center; color: #293241">{{
                            reply.author.nickname
                          }}</span>
                      </div>
                    </div>
                  </div>
                  <NDivider style="margin: 5px 0 3px 0"></NDivider>

                  <div id="md-comment-privew"
                    style="display: flex; position: relative">
                    <MdPreview :editorId="`editor-id-${reply.id}`"
                      style="margin: 0" :modelValue="reply.content" />
                    <div
                      style="display: flex; position: absolute; bottom: 0; right: 0">
                      <TheLike :bordered="true" :liked="reply.liked"
                        biz="article" :bizId="article!.id"
                        :likeCount="reply.likeCount"
                        @like="incrReplyLike('comment', reply.id, reply)">
                      </TheLike>
                      <CommentPopover biz="article" :biz-id="article!.id"
                        type="reply" label="回复" @createComment="createComment">
                      </CommentPopover>
                    </div>

                  </div>
                </div>
              </div>

              <div
                style="display: flex;justify-content: end;align-items:center;">
                <TheLike :bordered="true" :liked="item.liked" biz="article"
                  :bizId="article!.id" :likeCount="item.likeCount"
                  @like="incrCommentLike('comment', item.id, item)">
                </TheLike>
                <TheComment :commentCount="item.totalReplies"></TheComment>
                <CommentPopover biz="article" :biz-id="article!.id"
                  type="comment" label="回复" @createComment="createComment">
                </CommentPopover>
              </div>
            </div>
          </div>
          <div v-if="loading" class="text">Loading...</div>
          <NResult v-if="noMore && article.commentCount != 0" status="500"
            size="small" description="到底了" class="no-more">
          </NResult>
        </NInfiniteScroll>
      </div>
    </div>

    <!-- 目录 -->
    <div class="detail-catalog">
      <div style="position: fixed; width: 20rem">
        <div style="background: #ffffff">
          <MdCatalog :editorId="mdEditorId" :scrollElement="scrollElement" />
        </div>
        <div class="article-statics">
          <TheFavorite :collected="article?.collected ?? false"
            :collectCount="article?.collectCount" @collect="incrCollect">
          </TheFavorite>
          <TheLike :liked="article?.liked ?? false" biz="article"
            :bizId="article!.id" :likeCount="article?.likeCount ?? 0"
            @like="incrArticleLike">
          </TheLike>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.detail-wrapper {
  position: relative;
  display: flex;
  flex-grow: 0.9 0.1;
  margin-left: 5%;
  flex-flow: row;
  margin-right: 30%;
  overflow: visible;
}

.detail-catalog {
  position: relative;
  margin-top: 20px;
}

.detail-content {
  box-sizing: border-box;
  padding: 1rem 2rem 0 2rem;
  margin-bottom: 2rem;
  border-radius: 24px;
  display: grid;
  gap: 10px;
}

.article-info {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.article-title {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  padding-right: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: left;
  color: #293241;
}

.article-statics {
  margin-top: 10px;
  background: #ffffff;
  display: flex;
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

.author-name {
  margin-top: 1rem;
  white-space: nowrap;
  font-weight: 700;
  text-align: center;
  color: #293241;
}

.article-conver-wrapper {
  text-align: center;
}

.article-cover {
  width: 100%;
  margin-top: 1rem;
  // margin-bottom: 3rem;
}

#preview-only> :first-child {
  padding: 0px;
}

#md-comment-privew> :first-child> :first-child {
  padding: 0px;
}

.commentscroll {
  height: 60rem;
}

.comments-wrapper {
  background: #ffffff;
  padding: 15px;
  border-radius: 24px;
}

.comments-nav {
  position: relative;
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  font-weight: 700;
}

.comments-header {
  margin-right: 1rem;
  font-size: 1.25rem;
  color: #293241;
}

.comments-count {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  border-radius: 10px;
  border-width: 1px;
  border-style: solid;
  align-items: center;
  justify-content: center;
  border-color: #dee2e6;
}

.comment-wrapper {
  position: relative;
  display: flex;
  margin-bottom: 1rem;
  padding: 1rem;
  border: solid 1px;
  border-radius: 10px;
  border-color: #dee2e6;
}

.comment-list {
  display: grid;
  margin-bottom: 10px;
  border: solid 1px;
  border-radius: 10px;
  border-color: #dee2e6;
  padding: 10px;
}

.comment-author {
  height: 3rem;
  width: 3rem;
  margin-right: 1rem;
  flex-shrink: 0;
}


.text {
  text-align: center;
  margin: 1rem;
}
</style>
