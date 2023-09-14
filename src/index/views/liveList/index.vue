<template>
    <div class="wrap">
        <div class="header">
            <img :src="config.logoImg" :style="{
                width: config.logoWidth
            }" alt="">
            <img :src="userInfo.avatar" alt="" class="avatar" v-if="userInfo">
        </div>

        <div class="content">
            <div class="list">
                <div class="">
                    <div class="tabs">
                        <div class="">
                            创建历史
                        </div>
                        <div class="tabline"></div>
                    </div>
                    <div class="line"></div>
                </div>

                <div class="timeSelect">
                    <div class="timeBox">
                        <el-date-picker v-model="timeSelect" type="month" placeholder="请选择时间" size="default" clearable
                            format="YYYY-MM" value-format="YYYY-MM" @change="getData" />
                    </div>
                </div>

                <div class="livelist">
                    <div class="liveli" v-for="item in liveList" :key="item.id" @click="livePlay(item)">
                        <div class="list-name font-semibold">
                            {{ item.name }}
                        </div>

                        <div class="list-box w-full">
                            <div class="list-img" :style="{
                                background: `url(${item.icon}) 0 50% no-repeat`,
                                backgroundSize: '100% 170%'
                            }">

                            </div>
                            <img :src="item.icon" class="img-1" alt="" v-if="item.horizontal == 0">
                            <img :src="item.icon" class="img-2" alt="" v-else>
                        </div>

                        <div class="mt-3 text-xs flex items-center justify-between">
                            <div class="">
                                {{ item.createDate }}
                            </div>
                            <img src="../../../assets/images/icon_shanchu@2x.png" class="w-[23px] cursor-pointer h-[25px]"
                                alt="" @click.stop="delLive(item)">
                        </div>

                    </div>
                    <div class="empty" v-if="liveList.length == 0">
                        <el-empty description="暂无数据" />
                    </div>
                </div>

                <div class="page">
                    <el-pagination layout="prev, pager, next" :total="total" :page-size="8" :current-page="currentPage"
                        @current-change="getData" />
                </div>
            </div>
        </div>

        <el-dialog v-model="isPlay" title="开启直播" width="30%">
            <el-form :model="form" label-width="120px">
                <el-form-item label="自动回复">
                    <el-switch v-model="form.autoReply" active-text="开启" inactive-text="关闭" :active-value="1"
                        :inactive-value="0" />
                </el-form-item>
                <el-form-item label="房间号">
                    <el-input v-model="form.serial" placeholder="请输入房间号" />
                </el-form-item>
                <el-form-item label="平台">
                    <el-radio-group v-model="form.liveType">
                        <el-radio label="1" size="large">抖音</el-radio>
                        <el-radio label="2" size="large">快手</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="介绍">
                    <el-input v-model="form.survey" placeholder="请输入介绍" />
                </el-form-item>
            </el-form>
            <div class="footer">
                <el-button type="primary" @click="isPlay = false">取消</el-button>
                <el-button type="primary" @click="goLivePlay">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { WebviewWindow } from '@tauri-apps/api/window'
import { ElMessage } from 'element-plus'
const router = useRouter();
let userInfo = ref(null)
const timeSelect = ref(null)

import config from '@/config'

let total = ref(0)
let currentPage = ref(1)

const isPlay = ref(false)

const form = reactive({
    autoReply: 0,
    serial: '',
    survey: "",
    liveType: '1'
})

import {
    getLiveRecordList,
    liveSwitchremove
} from '@/api/index'

let liveList = ref([])

const getData = async (e) => {
    if (e) {
        currentPage.value = e
    }
    const res = await getLiveRecordList({
        pageNum: currentPage.value,
        pageSize: 8,
        date: timeSelect.value,
        state: 2
    })
    total.value = res.total
    console.log(res, '直播列表')
    liveList.value = res.rows || []
}
let temItem = null

const delLive = (item) => {
    liveSwitchremove({
        liveId: item.id
    }).then(res => {
        ElMessage({
            message: '删除成功!',
            type: 'success',
        })
        getData()
    })
}

const goLivePlay = async () => {
    const mainWindow = WebviewWindow.getByLabel('main')
    mainWindow?.hide()

    let webview
    if (temItem.horizontal == 1) {
        // // 开启新的窗口
        webview = new WebviewWindow('theUniqueLabel', {
            url: `videoPlay.html?id=${temItem.id}&serial=${form.serial}&autoReply=${form.autoReply}&survey=${form.survey}&liveType=${form.liveType}`,
            width: 507,
            height: 900,
            resizable: false,
            title: "昊轩数字人",
            label: "live",
            decorations: false
        })

    } else {
        webview = new WebviewWindow('theUniqueLabel', {
            url: `videoPlay.html?id=${temItem.id}&serial=${form.serial}&autoReply=${form.autoReply}&survey=${form.survey}&liveType=${form.liveType}`,
            width: 1200,
            height: 720,
            resizable: false,
            title: "昊轩数字人",
            label: "live",
            decorations: false
        })
    }
    isPlay.value = false
    webview.once('tauri://created', function () {
        // mainWindow?.close()
    })
    webview.once('tauri://error', function (e) {
    })


}

const livePlay = (item) => {
    temItem = item
    isPlay.value = true
}


onMounted(() => {
    userInfo.value = JSON.parse(localStorage.getItem('virtualUserInfo'))
    getData()
})
</script>

<style lang="scss" scoped>
.wrap {
    width: 100%;
    height: 100%;
    background: rgba(239, 243, 255, 1);
    user-select: none;
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
}

.content {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #EDF4FF;

    .list {
        width: 98%;
        height: 95%;
        border-radius: 16px;
        padding: 0 28px;

        .page {
            display: flex;
            justify-content: space-around;
        }

        .empty {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-around;
        }

        .livelist {
            height: calc(98% - 206px);
            display: flex;
            flex-wrap: wrap;
            padding-left: 14px;
            padding-top: 28px;
            margin-top: 28px;


            .liveli {
                width: 300px;
                height: 297px;
                background: #fff;
                border-radius: 8px;
                margin-right: 25px;
                padding: 12px;
                cursor: pointer;

                .list-name {
                    font-size: 16px;
                }

                .list-box {
                    position: relative;
                    margin-top: 12px;
                    border: 1px dashed #29292D;
                    border-radius: 2px;
                    height: 200px;
                }

                .list-img {
                    width: 100%;
                    height: 100%;
                    filter: blur(8px);
                }

                .img-1 {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                }

                .img-2 {
                    height: 100%;
                    width: auto;
                    position: absolute;
                    left: 50%;
                    top: 0;
                    transform: translateX(-50%);
                }
            }
        }

        .timeSelect {
            display: flex;
            align-items: center;
            justify-content: space-around;

            .timeBox {
                display: flex;
                align-items: center;
                margin-top: 32px;
            }

        }

        .tabs {
            padding: 20px 0;
            position: relative;

            div {
                font-size: 20px;
                font-weight: 600;
                cursor: pointer;
            }

            .tabline {
                width: 32px;
                height: 4px;
                background: #964DFF;
                position: absolute;
                left: 15px;
                bottom: 0px;
            }
        }

        .line {
            width: 100%;
            height: 1px;
            background-color: #D8D8D8;
        }
    }
}

.footer {
    padding: 20px;
    padding-top: 10px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>