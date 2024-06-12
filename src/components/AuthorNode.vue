<script setup lang="ts">
import { NButton } from 'naive-ui'
import AuthorPopover from './AuthorPopover.vue'
import type { Author } from '@/types/author';
import { computed, ref, watch } from 'vue';
import { useAuthorStore } from '@/stores/author';
import type { FollowRelation } from '@/types/follow';
import type { Response } from '@/types/axios';
import { follow, cancelFollow, getFolloInfo } from '@/api/follow';

interface Props {
    author: Author
}

const authorStore = useAuthorStore()
const isLogin = computed(() => authorStore.isLogin)

watch(isLogin, (newValue) => {
    if (newValue) {
        getFolloInfo(authorStore.getAuthor.id, props.author.id).then((res: Response<FollowRelation>) => {
            if (res.code === '200' && res.data) {
                followRef.value = res.data
            }
        })
    } else {
        followRef.value = {
            follower: null,
            followee: null
        }
    }
})

const followRef = ref<FollowRelation>({
    follower: null,
    followee: null,
})

function handleFollow(followed: boolean) {
    if (followed) {
        followRef.value.followee = props.author.id
        follow(props.author.id)

    } else {
        followRef.value.followee = null
        cancelFollow(props.author.id)
    }
}

function handleShowChange(value: boolean) {
    if (value) {
        if (isLogin.value) {
            getFolloInfo(authorStore.getAuthor.id, props.author.id).then((res: Response<FollowRelation>) => {
                if (res.code === '200' && res.data) {
                    followRef.value = res.data
                }
            })
        }
    }
}
const props = defineProps<Props>()
</script>
<template>
    <div
        style="display: flex;justify-content: space-between;background: #ffffff; align-items: center;">
        <div style="display: flex;margin: 10px">
            <div>
                <AuthorPopover :author="author" :round="false"
                    :avatar-size="64"></AuthorPopover>
            </div>
            <div>
                <span
                    style="padding: 20px 0 20px 20px;font-weight: bold;font-size: larger;">{{
                        author.nickname
                    }}</span>
            </div>
        </div>
        <div style="margin-right: 20px;">
            <NButton strong secondary round type="success"
                v-if="isLogin && authorStore.authorId != author.id && followRef.followee != null"
                @click="handleFollow(false)">
                取关
            </NButton>
            <NButton strong secondary round type="success"
                v-if="!isLogin || (isLogin && authorStore.authorId != author.id && followRef.followee == null)"
                @click="handleFollow(true)">
                关注</NButton>
        </div>
    </div>
</template>
<style scoped></style>