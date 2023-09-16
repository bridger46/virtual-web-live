<template>
    <div class="wrap">
        <div class="loginBox">
            <div class="form">
                <div class="">
                    <input type="text" placeholder="请输入登录账号" v-model="userPhone" @keyup="confirm">
                </div>

                <div class="">
                    <input type="password" placeholder="请输入登录密码" v-model="userPassword" style="margin-top: 24px;"
                        @keyup="confirm">
                </div>
                <el-checkbox v-model="rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>

                <button @click="confirm">确认登录</button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
import { setToken, getToken, removeToken } from "@/utils/auth.js";
import Cookies from "js-cookie";
const router = useRouter();
import {
    applogin,
    getUserInfo
} from '@/api/index'
import { encrypt, decrypt } from "@/utils/jsencrypt";
let userPhone = ref(null)
let userPassword = ref(null)
let rememberMe = ref(false)

const confirm = async (e) => {
    if (e.keyCode == 13 || !e.keyCode) {
        const phoneRegex =
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!phoneRegex.test(userPhone.value)) {
            ElMessage('请输入正确的手机号!')
            return
        }
        if (!userPassword.value) {
            ElMessage('请输入密码!')
            return
        }
        if (rememberMe.value) {
            Cookies.set("username", userPhone.value, { expires: 30 });
            Cookies.set("password", encrypt(userPassword.value), { expires: 30 });
            Cookies.set("rememberMe", rememberMe.value, { expires: 30 });
        } else {
            // 否则移除
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
        }

        const res = await applogin({
            username: userPhone.value,
            password: userPassword.value,
        });
        if (getToken()) {
            removeToken();
        }
        setToken(res.token);
        ElMessage({
            message: "登录成功!",
            type: "success",
        });
        const user = await getUserInfo();
        console.log(user, "user");
        localStorage.setItem("virtualUserInfo", JSON.stringify(user.user));
        router.push('/liveList')
    }
}

function getCookie() {
    const username = Cookies.get("username");
    const password = Cookies.get("password");
    const rememberMes = Cookies.get("rememberMe");
    userPhone.value = username === undefined ? '' : username
    userPassword.value = password === undefined ? '' : decrypt(password)
    rememberMe.value = rememberMes === undefined ? false : Boolean(rememberMes)
}

getCookie();
</script>

<style lang="scss" scoped>
.wrap {
    width: 100%;
    height: 100%;
    background: url('../../../assets/images/login_bg@2x.png') 0 0 no-repeat;
    background-size: 100% 100%;
    position: relative;

    .loginBox {
        width: 418px;
        height: 560px;
        position: absolute;
        top: calc(50% - 280px);
        right: 140px;
        background: url('../../../assets/images/img_login@2x.png') 0 0 no-repeat;
        background-size: 100% 100%;

        .form {
            padding: 208px 34px 0 34px;

            input {
                width: 350px;
                height: 48px;
                background: rgba(255, 255, 255, 0.46);
                border-radius: 4px 4px 4px 4px;
                opacity: 1;
                border: 2px solid #FFFFFF;
                padding: 0 24px;
                outline: none;
                font-size: 14px;
            }


        }

        button {
            width: 350px;
            height: 56px;
            background: #1765FF;
            border-radius: 4px 4px 4px 4px;
            color: #fff;
            margin-top: 87px;
            cursor: pointer;

            &:hover {
                background-color: rgba(23, 101, 255, 0.7);
            }

            &:active {
                background-color: #1765FF;
            }
        }
    }
}
</style>