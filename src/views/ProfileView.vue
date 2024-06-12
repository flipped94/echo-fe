<script setup lang="ts">

import { edit } from "@/api/author"
import { useAuthorStore } from "@/stores/author"
import type { AuthorForUpdate } from "@/types/author"
import { formatTime } from "@/utils/date"
import type { Response } from "@/types/axios"
import {
    NAvatar,
    NButton,
    NDatePicker,
    NInput,
    NRadio,
    NSelect,
    type UploadCustomRequestOptions,
    NUpload,
    NUploadDragger,
    NIcon,
    useMessage
} from "naive-ui"
import { CloudUpload, TrashOutline } from '@vicons/ionicons5'
import { computed, ref } from "vue"
import PasswordPopover from "@/components/PasswordPopover.vue"

import { upload } from "@/api/oss"
import EmailPopover from "@/components/EmailPopover.vue"

const message = useMessage()

const authorStore = useAuthorStore()

const selected = ref('basic')

const isEdit = ref(false)

const author = ref<AuthorForUpdate>({
    avatar: authorStore.avatar,
    nickname: authorStore.nickname,
    profile: authorStore.profile,
    gender: authorStore.gender,
    career: authorStore.career,
    birthday: authorStore.birthday,
    degree: authorStore.degree,
})

const gender = computed(() => {
    if (author.value.gender === 1) {
        return '男'
    } else if (author.value.gender === 2) {
        return '女'
    }
    return '未知'
})

const degreeOptions = [
    {
        label: "专科以下",
        value: '专科以下',
    },
    {
        label: '专科',
        value: '专科'
    },
    {
        label: '本科',
        value: '本科'
    },
    {
        label: "硕士",
        value: '硕士',
    },
    {
        label: '博士及以上',
        value: '博士及以上'
    },
]


function cancelEdit() {
    isEdit.value = false
    author.value.avatar = authorStore.avatar
    author.value.nickname = authorStore.nickname
    author.value.gender = authorStore.gender
    author.value.profile = authorStore.profile
    author.value.career = authorStore.career
    author.value.birthday = authorStore.birthday
    author.value.degree = authorStore.degree
}

function handleEdit() {
    isEdit.value = true
}

function submitEdit() {
    isEdit.value = false
    edit(author.value).then((res: Response<null>) => {
        if (res.code === '200') {
            const authorId = authorStore.authorId as string
            authorStore.setAuthor({
                id: authorId,
                email: authorStore.email,
                nickname: author.value.nickname,
                avatar: author.value.avatar,
                profile: author.value.profile,
                gender: author.value.gender,
                career: author.value.career,
                birthday: author.value.birthday,
                degree: author.value.degree
            })
        }
    })
}

function handleGenderChange(e: Event) {
    author.value.gender = parseInt((e.target as HTMLInputElement).value)
}


const showPreviewRef = ref(false)

const showDelete = ref(false)

function onDelete() {
    showPreviewRef.value = false
}

function handleUpload({
    file
    // data,
    // headers,
    // withCredentials,
    // action,
    // onFinish,
    // onError,
    // onProgress
}: UploadCustomRequestOptions) {
    const formData: FormData = new FormData()
    formData.append('file', file.file as File)
    upload(formData)
        .then((res: Response<string>) => {
            if (res.code === '200') {
                // formValue.value.cover = res.data
                author.value.avatar = res.data
                showPreviewRef.value = true
            } else {
                message.error('上传失败')
                showPreviewRef.value = true
                setTimeout(() => {
                    showPreviewRef.value = false
                }, 0.1)
            }
        })
        .catch(() => {
            showPreviewRef.value = true
            message.error('上传失败')
            setTimeout(() => {
                showPreviewRef.value = false
            }, 0.1)
        })
}


</script>
<template>
    <div class="profile-wrapper">
        <div class=" menu-left">
            <div
                style="display: flex;flex-flow: column;align-items: center;background-image: url('/header-bg.png'); padding-top: 10px;">
                <NAvatar :src="authorStore.avatar" :size="96" round></NAvatar>
                <span style="font-size: 20px;padding: 20px 0;">{{
                    authorStore.nickname }}</span>
            </div>
            <div class="menu-item-list">
                <div class="menu-item"
                    :class="{ selected: selected === 'basic' }"
                    @click="() => selected = 'basic'">
                    基本信息
                </div>
                <!-- <div class="menu-item"
                    :class="{ selected: selected === 'detail' }"
                    @click="selected = 'detail'">详细信息</div> -->
                <div class="menu-item"
                    :class="{ selected: selected === 'setting' }"
                    @click="() => selected = 'setting'">账号设置</div>
            </div>
        </div>
        <div class="content-right">
            <div v-if="selected === 'basic'" style="margin: 5% 1%">
                <div style="display: flex;flex-flow: column; gap: 30px;">
                    <div
                        style="display: flex;flex-flow: row;align-items: center;">
                        <div
                            style="margin-right: 40px;font-size: 18px;display: flex;flex-direction: row-reverse;flex-grow: 0;flex-shrink: 0;flex-basis: 176px;">
                            头像
                        </div>
                        <div>
                            <NAvatar v-if="!isEdit" :src="authorStore.avatar"
                                :size="64" round>
                            </NAvatar>
                            <div v-if="isEdit && !showPreviewRef"
                                style="margin-bottom: 10px" width="100px;">
                                <NUpload directory-dnd response-type="json"
                                    :disabled="false"
                                    :on-error="() => { onDelete() }"
                                    action="http://localhost:8079/oss/upload/webook-oss"
                                    trigger-style="height:100%;"
                                    :show-file-list="false"
                                    :custom-request="handleUpload" :max="1">
                                    <NUploadDragger
                                        style="border-radius: 12px;width: 80px;height: 80px;">
                                        <NIcon size="32" :depth="3">
                                            <CloudUpload />
                                        </NIcon>
                                    </NUploadDragger>
                                </NUpload>
                            </div>
                            <div v-if="isEdit && showPreviewRef"
                                style="position: relative"
                                @mouseover="showDelete = true"
                                @mouseout="showDelete = false">
                                <NAvatar round :size="64" :src="author.avatar"
                                    :style="{ opacity: showDelete ? 0.5 : 1 }"
                                    alt="示例图片" />
                                <NIcon :size="16" class="delte-cover"
                                    style="position: absolute;right: 40%;top: 30%;"
                                    :style="{ opacity: showDelete ? 1 : 0 }"
                                    @click="onDelete">
                                    <TrashOutline />
                                </NIcon>
                            </div>
                        </div>
                    </div>
                    <div
                        style="display: flex;flex-flow: row;align-items: center;">
                        <div
                            style="margin-right: 40px;font-size: 18px;display: flex;flex-direction: row-reverse;flex-grow: 0;flex-shrink: 0;flex-basis: 176px;">
                            昵称
                        </div>
                        <div v-if="!isEdit">{{ author.nickname }}</div>
                        <NInput v-else placeholder="昵称" maxlength="20"
                            show-count v-model:value="author.nickname"
                            style="max-width: 60%;" clearable />
                    </div>
                    <div
                        style="display: flex;flex-flow: row;align-items: center;">
                        <div
                            style="margin-right: 40px;font-size: 18px;display: flex;flex-direction: row-reverse;flex-grow: 0;flex-shrink: 0;flex-basis: 176px;">
                            性别
                        </div>
                        <div v-if="!isEdit">{{ gender }}</div>
                        <div v-else>
                            <NRadio name="gender" value="1"
                                :checked="author.gender === 1"
                                @change="handleGenderChange">男</NRadio>
                            <NRadio name="gender" value="2"
                                :checked="author.gender === 2"
                                @change="handleGenderChange">女</NRadio>
                        </div>
                    </div>
                    <div
                        style="display: flex;flex-flow: row;align-items: center;">
                        <div
                            style="margin-right: 40px;font-size: 18px;display: flex;flex-direction: row-reverse;flex-grow: 0;flex-shrink: 0;flex-basis: 176px;">
                            简介
                        </div>
                        <div v-if="!isEdit">
                            {{ author.profile ? author.profile : '未设置' }}</div>
                        <NInput v-else placeholder="一句话介绍自己" :maxlength="50"
                            show-count v-model:value="author.profile"
                            style="max-width: 60%;" clearable />
                    </div>
                    <div
                        style="display: flex;flex-flow: row;align-items: center;">
                        <div
                            style="margin-right: 40px;font-size: 18px;display: flex;flex-direction: row-reverse;flex-grow: 0;flex-shrink: 0;flex-basis: 176px;">
                            生日
                        </div>
                        <div v-if="!isEdit">{{ author.birthday ? formatTime(new
                            Date(author.birthday), 'yyyy-MM-DD') : '未设置' }}
                        </div>
                        <NDatePicker placeholder="选择生日" v-else type="date"
                            v-model:value="author.birthday"
                            style="max-width: 50%;" clearable>
                        </NDatePicker>
                    </div>
                    <div
                        style="display: flex;flex-flow: row;align-items: center;">
                        <div
                            style="margin-right: 40px;font-size: 18px;display: flex;flex-direction: row-reverse;flex-grow: 0;flex-shrink: 0;flex-basis: 176px;">
                            学历
                        </div>
                        <div v-if="!isEdit">{{ author.degree ? author.degree :
                            '未设置'
                            }}</div>
                        <NSelect v-else placeholder="选择学历"
                            :options="degreeOptions" style="max-width: 15%;"
                            v-model:value="author.degree" clearable></NSelect>
                    </div>
                    <div
                        style="font-size: 18px;display: flex;justify-content: start;margin-left: 40%;gap: 10%;">
                        <NButton v-if="isEdit" @click="cancelEdit"
                            type="warning">取消</NButton>
                        <NButton v-if="!isEdit" @click="handleEdit"
                            type="success">
                            编辑</NButton>
                        <NButton v-if="isEdit" @click="submitEdit"
                            type="success">确认</NButton>
                    </div>
                </div>
            </div>
            <div v-if="selected === 'setting'" style="margin: 5% 1%">
                <div
                    style="display: flex;flex-flow: row;justify-content: space-between;margin-left: 10%;margin-right: 30%">
                    <div
                        style="display: flex;flex-flow: column;margin-bottom: 5%;">
                        <div
                            style="display: block;font-weight: bolder;font-size: 24px;;">
                            登录密码</div>
                        <div style="display: block;">******</div>
                    </div>
                    <div>
                        <PasswordPopover></PasswordPopover>
                    </div>
                </div>
                <div
                    style="display: flex;flex-flow: row;justify-content: space-between;margin-left: 10%;margin-right: 30%">
                    <div
                        style="display: flex;flex-flow: column;margin-bottom: 5%;">
                        <div
                            style="display: block;font-weight: bolder;font-size: 24px;;">
                            登录邮箱</div>
                        <div style="display: block;">{{ authorStore.email }}
                        </div>
                    </div>
                    <div>
                        <EmailPopover></EmailPopover>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.profile-wrapper {
    display: flex;
    flex-flow: row;
    margin: 3% 15% 5% 15%;
}

.menu-left {
    background: #ffffff;
    width: 200px;
    height: 100%;
}

.menu-item-list {
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 20px 0;
    gap: 10px;
    cursor: pointer;
}

.menu-item {
    position: relative;
    font-size: 18px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
}

.selected {
    background: #fff9f2;
    font-weight: 500;
    color: #fa8919;
}

.selected:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: calc(50% - 15px);
    width: 3px;
    height: 30px;
    background: #fa8919;
    border-radius: 0 4px 4px 0;
    pointer-events: none;
}

.content-right {
    width: 80%;
    background: #ffffff;
    margin-left: 3%;
    border-radius: 8px;
}
</style>