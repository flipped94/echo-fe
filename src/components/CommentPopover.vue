<script setup lang="ts">
import { NPopover, NButton, NFlex } from 'naive-ui'
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { addComment } from '@/api/comment'
import type { Response } from '@/types/axios'
import type { Comment } from '@/types/comment'

import { useAuthorStore } from '@/stores/author'

const authorStore = useAuthorStore()

const props = defineProps({
  biz: {
    type: String,
    required: true
  },
  bizId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['createComment'])

const mode = 'default' // 或 'simple'
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return

  editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor: Editor) => {
  console.log('created', editor)
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor: Editor) => {
  console.log('change:', editor.getHtml())
}
const handleDestroyed = (editor: Editor) => {
  console.log('destroyed', editor)
}
const handleFocus = (editor: Editor) => {
  console.log('focus', editor)
}
const handleBlur = (editor: Editor) => {
  console.log('blur', editor)
}
const customAlert = (info: any, type: any) => {
  alert(`【自定义提示】${type} - ${info}`)
}
const customPaste = (editor: Editor, event: any, callback: any) => {
  console.log('ClipboardEvent 粘贴事件对象', event)

  // 自定义插入内容
  const text = event.clipboardData.getData('text/plain')
  editor.insertText(text)

  // 返回值（注意，vue 事件的返回值，不能用 return）
  callback(false) // 返回 false ，阻止默认粘贴行为
  // callback(true) // 返回 true ，继续默认的粘贴行为
}

const showPopoverRef = ref(false)

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
  if (showPopoverRef.value) {
    showPopoverRef.value = false
  } else {
    showPopoverRef.value = true
  }
}

const handleAddComment = (e: MouseEvent) => {
  e.preventDefault()
  addComment({
    biz: props.biz,
    bizId: props.bizId,
    content: valueHtml.value,
    type: props.type
  }).then((res: Response<string>) => {
    if (res.code === '200' && res.data) {
      showPopoverRef.value = false
      const c: Comment = {
        id: res.data,
        // 评论者
        author: authorStore.getAuthor,
        // 评论对象
        biz: props.biz,
        bizId: props.bizId,
        // 评论内容
        content: valueHtml.value,
        replies: [],
        totalReplies: 0,
        createTime: Date.now(),
        updateTime: Date.now(),
        readCount: 0,
        collectCount: 0,
        likeCount: 0,
        commentCount: 0,
        liked: false,
        collected: false
      }
      emits('createComment', c)
      valueHtml.value = ''
    }
  })
}
const cancel = (e: MouseEvent) => {
  e.preventDefault()
  showPopoverRef.value = false
  valueHtml.value = ''
}
</script>

<template>
  <span class="comment-trigger" @click="handleClick">{{ props.label }}</span>
  <NPopover :overlap="true" :show="showPopoverRef" :x="900" :y="300"
    trigger="manual">
    <div>
      <div style="border: 1px solid #ccc; margin-top: 10px">
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
          style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml"
          style="height: 400px; overflow-y: hidden" @onCreated="handleCreated"
          @onChange="handleChange" @onDestroyed="handleDestroyed"
          @onFocus="handleFocus" @onBlur="handleBlur" @customAlert="customAlert"
          @customPaste="customPaste" />
      </div>
      <NFlex style="margin: 1% 0">
        <!-- <button @click="insertText">确认</button> -->
        <NButton type="success" @click="handleAddComment">确认</NButton>
        <NButton type="error" @click="cancel">取消</NButton>
      </NFlex>
    </div>
  </NPopover>
</template>

<style lang="less" scoped>
.comment-trigger {
  display: inline-flex;
  cursor: pointer;
  height: 2rem;
  width: 5rem;
  border-radius: 10px;
  border-width: 1px;
  border-style: solid;
  align-items: center;
  justify-content: center;
  border-color: #dee2e6;
}
</style>
