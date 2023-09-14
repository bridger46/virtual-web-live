<template>
  <div class="wrap">
    <div class="content" id="content">
      <img src="https://img.fcios.net/virtual/close.png" alt="" @click="handleWinClose" class="close" title="关闭">
      <img src="https://img.fcios.net/virtual/tuodong.png" alt="" class="close tuo" title="拖动" data-tauri-drag-region>
    </div>
  </div>
</template>

<script setup>
import {
  ref, onMounted, reactive, watch
} from 'vue';
import { ElLoading } from 'element-plus'
import { WebviewWindow } from '@tauri-apps/api/window'
import { appWindow } from '@tauri-apps/api/window'
import {
  getLiveVideoNext,
  getLiveVideoNextksLive
} from "@/api/index"

const mainWindow = WebviewWindow.getByLabel('main')
const urlParams = new URLSearchParams(window.location.search);

// 获取上一页的参数
const id = urlParams.get('id');
const serial = urlParams.get('serial');
const autoReply = urlParams.get('autoReply');
const survey = urlParams.get('survey');
// 获取平台
const liveType = urlParams.get('liveType');
let videoPlayIndex = ref(0)


// 关闭事件
const handleWinClose = async () => {
  appWindow.close()
  mainWindow?.show()
}

// 监听视频播放变化
watch(videoPlayIndex, (newVal, oldVal) => {
  handleVideo(videoPlay.videoList[newVal].url)
})

// 处理视频逻辑
const handleVideo = (url) => {
  getData(url)
  videoPlay.videoList[videoPlayIndex.value].video.play()
  videoPlay.videoList[videoPlayIndex.value].video.style.display = 'block'
  // 监听播放结束
  videoPlay.videoList[videoPlayIndex.value].video.addEventListener('ended', () => {
    videoPlay.videoList[videoPlayIndex.value].video.style.display = 'none'
    videoPlay.videoList[videoPlayIndex.value].video.pause()
    let obj = {
      liveId: id,
      videoUrl: videoPlay.videoList[videoPlayIndex.value].url,
      sign: 1
    }
    socket.send(JSON.stringify(obj));
    videoPlayIndex.value++
  })

  // 监听视频播放错误事件
  videoPlay.videoList[videoPlayIndex.value].video.addEventListener('error', function (event) {
    videoError()
  });
}

let videoPlay = reactive({
  videoList: []
})

let isSocketOpen = false
let socket = null

const videoError = () => {
  videoPlay.videoList = []
  videoPlayIndex.value = 0
  getData()
}

const getData = async (videoUrl, flag) => {
  let loading
  if (!videoUrl) {
    videoPlay.videoList = []
    videoPlayIndex.value = 0
    loading = ElLoading.service({
      lock: true,
      text: '直播准备中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  let res;
  if (liveType == 1) {
    res = await getLiveVideoNext({
      id,
      roomId: serial,
      autoReply: autoReply,
      videoUrl: videoUrl ? videoUrl : null,
      survey: survey
    })
  }

  if (liveType == 2) {
    res = await getLiveVideoNextksLive({
      id,
      roomId: serial,
      autoReply: autoReply,
      videoUrl: videoUrl ? videoUrl : null,
      survey: survey
    })
  }

  if (res.data) {
    let content = document.getElementById('content')
    const video = document.createElement('video');
    video.src = res.data;
    video.preload = 'auto'; // 使用 'auto' 来告诉浏览器立即开始预加载视频
    video.load(); // 手动调用 load() 方法开始加载
    video.style.display = 'none';
    videoPlay.videoList.push({
      video: video,
      url: res.data
    })
    // 当视频加载完成后，你可以将它添加到页面上
    video.addEventListener('loadeddata', () => {
      content.appendChild(video);

      // 判断当刚进入页面
      if (!videoUrl) {
        handleVideo(res.data)
        loading.close()
      }
    });
  }
  if (!isSocketOpen) {
    socketInit()
  }
  if (flag) {
    getData(videoUrl)
  }
}

let timer;


const socketInit = () => {
  let socketUrl;
  if (liveType == 1) {
    socketUrl = `wss://api.fcios.net/websocket/liveOpen/${id}`
  }

  if (liveType == 2) {
    socketUrl = `wss://api.fcios.net/websocket/ksLiveOpen/${id}`
  }
  socket = new WebSocket(socketUrl);
  socket.onopen = () => {
    console.log('WebSocket connection established.');
    isSocketOpen = true;
    sendMessage()
  };
  socket.onmessage = (event) => {
    console.log('Received message:', event.data);
  };

  socket.onclose = () => {
    isSocketOpen = false;
    console.log('WebSocket connection closed.');
  };

  const sendMessage = () => {
    let obj = {
      liveId: id,
      videoUrl: videoPlay.videoList[videoPlayIndex.value].url
    }
    socket.send(JSON.stringify(obj));
  };

  if (liveType == 1) {
    timer = setInterval(() => {
      sendMessage()
    }, 1000 * 10);
  }
}

onMounted(() => {
  getData()
});

// const liveWebview = WebviewWindow.getByLabel('live')

// // 监听liveWebview关闭
// liveWebview.on('close', () => {
//   socket.close()
//   clearInterval(timer)
//   mainWindow?.show()
// })

</script>

<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
}

.wrap {
  width: 100%;
  height: 100%;
  user-select: none;
  overflow: hidden;

  /* 自定义滚动条样式 */
  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  .content {
    width: 100%;
    height: 100%;
    position: relative;

    &:hover img {
      display: block;
    }

    .close {
      width: 32px;
      height: 32px;
      position: absolute;
      right: 32px;
      top: 32px;
      z-index: 999;
      cursor: pointer;
      display: none;
    }

    .tuo {
      left: 32px;
      right: 0;
    }
  }
}
</style>