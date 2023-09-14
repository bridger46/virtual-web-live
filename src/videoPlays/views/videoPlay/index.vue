<template>
    <div class="wrap">
        <div class="header">
            <div class="back" @click="goBack">
                <img src="../../../assets/images/back.png" alt="">
                <div class="">
                    返回
                </div>
            </div>
            <div class="title">
                <div class="name" style="color: #fff;">{{ route.query?.name }}</div>
                <div class="serial" style="color: #fff;"> 房间号:{{ route.query?.serial }}</div>
            </div>
            <img :src="userInfo.avatar" alt="" class="avatar" v-if="userInfo">
        </div>

        <div class="content">
            <vue3VideoPlay v-bind="liveOptions" @ended="videoEnd" />
            <div class="coverage"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { ElLoading, ElMessage } from 'element-plus'
import { useRoute, useRouter } from "vue-router";
import {
    getLiveVideoNext
} from "@/api/index"

let userInfo = ref(null)

const route = useRoute()
const router = useRouter()
let liveOptions = ref({
    width: "100%", //播放器高度
    height: "100%", //播放器高度
    color: "#409eff", //主题色
    title: "", //视频名称
    src: "", //视频源
    muted: false, //静音
    webFullScreen: false,
    speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
    autoPlay: false, //自动播放
    loop: false, //循环播放
    mirror: false, //镜像画面
    ligthOff: false, //关灯模式
    volume: 0.3, //默认音量大小
    control: false, //是否显示控制器
})
let videoPlayIndex = 0
let videoList = []



const videoEnd = () => {
    videoPlayIndex++
    if (videoPlayIndex == videoList.length) {
        ElMessage('直播已结束!')
        goBack()
        return
    }
    liveOptions.value.src = videoList[videoPlayIndex]
    getData(videoList[videoPlayIndex])
}

const goBack = () => {
    router.go(-1)
}

const getData = async (videoUrl, flag) => {
    let loading
    if (!videoUrl) {
        videoList = []
        videoPlayIndex = 0
        loading = ElLoading.service({
            lock: true,
            text: '直播准备中...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
    }
    const res = await getLiveVideoNext({
        id: route.query?.id,
        roomId: route.query?.serial,
        autoReply: route.query?.autoReply,
        videoUrl: videoUrl ? videoUrl : null,
        survey: route.query?.survey
    })
    if (res.data) {
        videoList.push(res.data)
    }
    if (!videoUrl) {
        liveOptions.value.src = videoList[videoPlayIndex]
        loading.close()
        getData(videoList[videoPlayIndex])
    }
    if (flag) {
        getData(videoUrl)
    }
}



onMounted(() => {
    getData()
})

</script>

<style lang="scss" scoped>
.wrap {
    width: 100%;
    height: 100%;
    user-select: none;

    .content {
        height: calc(100% - 60px);
        padding: 42px;
        position: relative;

        .coverage {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 99;
        }
    }

    .header {
        height: 60px;
        background: #29292D;
        box-shadow: 0px 5px 10px 0px rgba(41, 41, 45, 0.43);
        display: flex;
        align-items: center;
        justify-content: space-around;

        .avatar {
            width: 42px;
            height: 42px;
        }

        .title {
            display: flex;
            flex-direction: column;
            align-items: center;

            .name {
                font-size: 20px;
            }

            .serial {
                font-size: 14px;
            }
        }

        .back {
            display: flex;
            align-items: center;
            cursor: pointer;

            img {
                width: 22px;
                height: 22px;
            }

            div {
                font-size: 16px;
                color: #fff;
            }
        }
    }
}
</style>