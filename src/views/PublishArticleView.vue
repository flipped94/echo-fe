<script setup lang="ts">
import {
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NCard,
  NForm,
  NInput,
  type FormInst,
  NFormItem,
  NButton,
  NDynamicTags,
  NTag,
  useMessage,
  type UploadCustomRequestOptions
} from 'naive-ui'
import { ArchiveOutline as ArchiveIcon, TrashOutline, CaretUpCircle, Save } from '@vicons/ionicons5'
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

import { publish, save } from '@/api/article'
import type { ArticleForCreate } from '@/types/article'
import type { Response } from '@/types/axios'
import { upload } from '@/api/oss'

const router = useRouter()

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const size = ref<'small' | 'medium' | 'large'>('medium')

const formValue = ref<ArticleForCreate>({
  id: null,
  title: '',
  content: '',
  cover: '',
  tags: [],
  abstraction: ''
})

const coverUrlRef = ref<string>('')

const rules = {
  title: {
    required: true,
    message: '请输入标题',
    trigger: ['input']
  },
  content: {
    required: true,
    message: '请输入内容',
    trigger: ['input']
  }
}

function handlePublish(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      formValue.value.cover = coverUrlRef.value
      publish(formValue.value).then((res: Response<string>) => {
        if (res.code === '200') {
          message.success('发布成功')
          router.push(`/articles/${res.data}`)
        }
      })
    } else {
      const e = errors[0][0]
      message.warning(e.message!)
    }
  })
}

function handleSave(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      save(formValue.value).then((res) => {
        if (res.code === '200') {
          message.success('保存成功')
          router.push(`/articles/${res.data}`)
        }
      })
    } else {
      const e = errors[0][0]
      message.warning(e.message!)
    }
  })
}

function renderTag(tag: string, index: number) {
  return h(
    NTag,
    {
      type: 'success',
      disabled: index > 3,
      closable: true,
      onClose: () => {
        formValue.value.tags.splice(index, 1)
      }
    },
    {
      default: () => tag
    }
  )
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
        coverUrlRef.value = res.data
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

const onUploadImg = async (files: Array<File>, callback: (url: string[]) => void) => {
  await files.forEach(async (file) => {
    const formData: FormData = new FormData()
    formData.append('file', file)
    await upload(formData).then((res: Response<string>) => {
      if (res.code === '200') {
        callback([res.data])
      } else {
        message.error('上传失败')
      }
    })
  })
}
</script>

<template>
  <div class="publish-article-wrapper">
    <span class="new-article">新文章</span>
    <div v-if="!showPreviewRef" style="margin-bottom: 10px">
      <NUpload directory-dnd response-type="json" :disabled="false" :on-error="() => {
        onDelete()
      }
        " action="http://localhost:8079/oss/upload/webook-oss"
        trigger-style="height:100%;" :show-file-list="false"
        :custom-request="handleUpload" :max="1">
        <NUploadDragger style="border-radius: 12px">
          <div style="margin: 100px 0 0 0">
            <NIcon size="48" :depth="3">
              <ArchiveIcon />
            </NIcon>
          </div>
          <NText style="display: block; font-size: 16px; margin-bottom: 100px">
            Click or drag a file to this area to upload
          </NText>
        </NUploadDragger>
      </NUpload>
    </div>
    <div v-else style="position: relative" @mouseover="showDelete = true"
      @mouseout="showDelete = false">
      <img :src="coverUrlRef" :style="{ opacity: showDelete ? 0.5 : 1 }"
        alt="示例图片" width="100%" height="100%" />
      <NIcon :size="32" class="delte-cover"
        :style="{ opacity: showDelete ? 1 : 0 }" @click="onDelete">
        <TrashOutline />
      </NIcon>
    </div>
    <NForm ref="formRef" :label-width="80" :model="formValue" :rules="rules"
      :size="size">
      <NFormItem label="标题" path="title">
        <NInput style="border-radius: 8px" v-model:value="formValue.title"
          placeholder="标题">
        </NInput>
      </NFormItem>
      <NFormItem label="内容" path="content">
        <MdEditor v-model="formValue.content" style="border-radius: 8px"
          @on-upload-img="onUploadImg" />
      </NFormItem>
      <NFormItem path="tags">
        <NCard title="标签" style="border-radius: 2%; height: 6rem"
          header-style="padding: 8px;height:3rem" content-style="padding: 10px;"
          :segmented="{
            content: true
          }">
          <NDynamicTags v-model:value="formValue.tags" :render-tag="renderTag">
          </NDynamicTags>
        </NCard>
      </NFormItem>
      <NFormItem>
        <NCard title="摘要" style="border-radius: 2%; height: 10rem"
          header-style="padding: 8px;height:3rem" content-style="padding: 10px;"
          :segmented="{
            content: true
          }">
          <div>
            <NInput v-model:value="formValue.abstraction" type="textarea"
              placeholder="摘要">
            </NInput>
          </div>
        </NCard>
      </NFormItem>
    </NForm>

    <div style="display: flex; justify-content: space-around">
      <NButton type="error">
        <template #icon>
          <NIcon>
            <TrashOutline />
          </NIcon>
        </template>
        丢弃
      </NButton>
      <NButton type="info" @click="handleSave">
        <template #icon>
          <NIcon>
            <Save />
          </NIcon>
        </template>
        保存
      </NButton>
      <NButton type="success" @click="handlePublish">
        <template #icon>
          <NIcon>
            <CaretUpCircle />
          </NIcon>
        </template>
        发表
      </NButton>
    </div>
  </div>
</template>

<style lang="less" scoped>
.new-article {
  display: block;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #293241;
}

.publish-article-wrapper {
  margin: 20px 20%;
  padding: 2rem;
  background: #ffffff;
  border-radius: 24px;
  font-weight: 700;
}

.delte-cover {
  position: absolute;
  cursor: pointer;
  top: 50%;
  left: 50%;
}
</style>
function callback(arg0: any) { throw new Error('Function not implemented.') }
