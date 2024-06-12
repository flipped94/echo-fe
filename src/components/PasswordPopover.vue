<script setup lang="ts">
import type { AuthorForUpdatePassword } from '@/types/author';
import {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NInputGroup,
    NPopover,
    type FormInst,
    type FormItemRule,
    type FormRules,
    useMessage
} from 'naive-ui';
import { ref } from 'vue';
import { encrypt } from '@/utils/rsa'
import { updatePass } from '@/api/auth';
import type { Response } from '@/types/axios';
import { getVerifyCode } from '@/api/mail';

const message = useMessage()

const authorForUpdatePassowrd = ref<AuthorForUpdatePassword>({
    code: '',
    password: '',
    repeatPassword: ''
})

const passwordFormRef = ref<FormInst | null>(null)
const passwordPopover = ref(null)

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
    return value === authorForUpdatePassowrd.value.password
}

const passwordRules: FormRules = {
    code: [
        {
            required: true,
            message: '请输入验证码',
            trigger: ['input']
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: ['input']
        }
    ],
    repeatPassword: [
        {
            required: true,
            message: '请输入密码',
            trigger: ['input']
        },
        {
            validator: validatePasswordSame,
            message: '请输入相同密码',
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
    getVerifyCode('changepassword').then((res: Response<null>) => {
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
    passwordPopover.value.setShow(false)

}

function setTimerInitiValue() {
    if (timerId) {
        clearInterval(timerId)
    }
    isGetCode.value = false
    count.value = 59
}

function clearValue() {
    authorForUpdatePassowrd.value.code = ''
    authorForUpdatePassowrd.value.password = ''
    authorForUpdatePassowrd.value.repeatPassword = ''
}

function submitUpdate(e: MouseEvent) {
    e.preventDefault()
    setTimerInitiValue()
    passwordFormRef.value?.validate((errors) => {
        if (!errors) {
            authorForUpdatePassowrd.value.password = encrypt(authorForUpdatePassowrd.value.password)
            authorForUpdatePassowrd.value.repeatPassword = encrypt(authorForUpdatePassowrd.value.repeatPassword)
            updatePass(authorForUpdatePassowrd.value).then((res: Response<null>) => {
                if (res.code === '200') {

                    message.warning('修改成功')
                } else {
                    message.warning(res.message)
                }
                clearValue()
                passwordPopover.value.setShow(false)
            })
        }
    })
}

</script>
<template>
    <div>
        <NPopover ref="passwordPopover" trigger="click" :show-arrow="false"
            placement="bottom" :width="400" :on-update-show="handleUpdateShow">
            <template #trigger>
                <NButton>修改</NButton>
            </template>
            <div style="margin: 30px;">
                <NForm ref="passwordFormRef" :rules="passwordRules"
                    :model="authorForUpdatePassowrd" label-placement="left">
                    <NFormItem label="验证码" path="code" label-width="80">
                        <NInputGroup>
                            <NInput v-model:value="authorForUpdatePassowrd.code"
                                placeholder="验证码" />
                            <NButton type="primary" ghost @click="getCode"
                                style="width: 100px;">
                                {{ isGetCode ? count : '获取验证码' }}
                            </NButton>
                        </NInputGroup>
                    </NFormItem>
                    <NFormItem label="密码" path="password" label-width="80">
                        <NInput type="password"
                            v-model:value="authorForUpdatePassowrd.password"
                            show-password-on="click" placeholder="请输入密码"
                            clearable />
                    </NFormItem>
                    <NFormItem label="确认密码" path="repeatPassword"
                        label-width="80">
                        <NInput type="password"
                            v-model:value="authorForUpdatePassowrd.repeatPassword"
                            show-password-on="click" placeholder="请再次输入密码" />
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