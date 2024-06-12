<script setup lang="ts">
import type { AuthorForUpdateEmail } from '@/types/author';
import {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NInputGroup,
    NPopover,
    type FormInst,
    type FormRules,
    useMessage,
} from 'naive-ui';
import { ref } from 'vue';
import { updateEmail } from '@/api/auth';
import type { Response } from '@/types/axios';
import { getVerifyCode } from '@/api/mail';

const message = useMessage()

const authorForUpdateEmail = ref<AuthorForUpdateEmail>({
    code: '',
    email: '',
})

const passwordFormRef = ref<FormInst | null>(null)
const emailPopover = ref(null)

const passwordRules: FormRules = {
    code: [
        {
            required: true,
            message: '请输入验证码',
            trigger: ['input']
        }
    ],
    email: [
        {
            required: true,
            message: '请输入密码',
            trigger: ['input']
        }
    ]
}

var timerId: number
const count = ref(59);

function handleUpdateShow(show: boolean) {
    if (!show) {
        setTimerInitiValue()
    }
}


const isGetCode = ref(false)

function getCode(e: MouseEvent) {
    e.preventDefault()
    getVerifyCode('changemail').then((res: Response<null>) => {
        if (res.code === '200') {
            isGetCode.value = true
            timerId = setInterval(() => {
                if (count.value > 0) {
                    count.value--
                } else {
                    setTimerInitiValue()
                }
            }, 1000)
        }
    })
}

function cancelUpdate(e: MouseEvent) {
    e.preventDefault()
    clearValue()
    setTimerInitiValue()
    emailPopover.value.setShow(false)
}

function setTimerInitiValue() {
    if (timerId) {
        clearInterval(timerId)
    }
    isGetCode.value = false
    count.value = 59
}

function clearValue() {
    authorForUpdateEmail.value.code = ''
    authorForUpdateEmail.value.email = ''
}

function submitUpdate(e: MouseEvent) {
    e.preventDefault()
    setTimerInitiValue()
    passwordFormRef.value?.validate((errors) => {
        if (!errors) {
            updateEmail(authorForUpdateEmail.value).then((res: Response<null>) => {
                if (res.code === '200') {

                    message.warning('修改成功')
                } else {
                    message.warning(res.message)
                }
                clearValue()
                emailPopover.value.setShow(false)
            })
        }
    })
}

</script>
<template>
    <div>
        <NPopover ref="emailPopover" trigger="click" :show-arrow="false"
            placement="bottom" :width="400" :on-update-show="handleUpdateShow">
            <template #trigger>
                <NButton>更换</NButton>
            </template>
            <div style="margin: 30px;">
                <NForm ref="passwordFormRef" :rules="passwordRules"
                    :model="authorForUpdateEmail" label-placement="left">
                    <NFormItem label="验证码" path="code">
                        <NInputGroup>
                            <NInput v-model:value="authorForUpdateEmail.code"
                                placeholder="验证码" style="max-width: 200px;" />
                            <NButton type="primary" ghost @click="getCode"
                                style="width: 100px;">
                                {{ isGetCode ? count : '获取验证码' }}
                            </NButton>
                        </NInputGroup>
                    </NFormItem>
                    <NFormItem label="新邮箱" path="email">
                        <NInput type="password"
                            v-model:value="authorForUpdateEmail.email"
                            show-password-on="click" placeholder="请输入新邮箱"
                            clearable />
                    </NFormItem>
                </NForm>
                <div style="display: flex;justify-content: space-around;">
                    <NButton type="warning" @click="cancelUpdate">取消</NButton>
                    <NButton type="success" @click="submitUpdate">确认</NButton>
                </div>
            </div>
        </NPopover>
    </div>
</template>
<style scoped></style>