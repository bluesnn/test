<template>
  <header>
    我是标题
  </header>
  <div
    class="msg-refresh"
    :style="{ marginTop: downSlide + 'vw' }"
  >
    {{ downSlide > 13.4 ? '松开获取' : '下拉获取历史消息' }}
  </div>
  <ul
    ref="viewBox"
    class="list"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <li
      v-for="item in mockData"
      :key="item.id"
      :class="{active: item.userName === 'zhang'}"
    >
      <div class="avatar">
        <img :src="item.avatar" alt="头像">
      </div>
      <div class="bubble">
        <div class="tail"></div>
        <div class="message">
          {{ item.message }}
        </div>
      </div>
    </li>
  </ul>

  <div
    class="enter"
    :class="{ active: featuresShow }"
  >
    <div class="more" @click="handleFeatures">
      <img
        src="./assets/more_plus.png"
        alt="更多动能"
        :class="{ active: featuresShow }"
      >
    </div>
    <div class="message">
      <input
        type="text"
        placeholder="请输入"
        v-model="userMessage"
      >
    </div>
    <div
      class="send"
      @click="sendMsg"
    >
      发送
      <img src="./assets/send.png" alt="发送">
    </div>
  </div>
  <div
    v-show="featuresShow"
    class="features"
    :class="{ active: featuresShow }"
  >
    <ul>
      <li>
        <input id="upload" type="file" accept="image/*">
        <p>
          <img src="./assets/photo.png" alt="相册">
          <span>图片</span>
        </p>
      </li>
      <li>
        <input type="file" accept="image/*" capture="camera">
        <p>
          <img src="./assets/camera.png" alt="相机">
          <span>相机</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
import { data, historyData } from './mock'

// mock数据
const mockData = reactive(data)

// 发送消息
const userMessage = ref('')
const sendMsg = () => {
  if (userMessage.value === '') {
    return
  }
  mockData.push({
    id: Date.parse(new Date()),
    timestamp: Date.parse(new Date()) / 1000,
    message: userMessage.value,
    userName: 'zhang',
    avatar: 'https://picsum.photos/80'
  })
  userMessage.value = ''
  refresh()
}

const downSlide = ref(0)

// features功能调用
const featuresShow = ref(false)
const handleFeatures = () => {
  featuresShow.value = !featuresShow.value
}

const scrollTopDistance = ref(0)
const viewBox = ref(null)
const scrollType = ref('bottom')

onMounted(() => {
  // 监听滚动条
  viewBox.value.addEventListener('scroll', debounce(handleScroll, 300), true)
  const { scrollHeight, clientHeight } = viewBox.value
  viewBox.value.scrollTop = scrollHeight - clientHeight
})

// 监听滚动条
const handleScroll = () => {
  const { scrollHeight, clientHeight, scrollTop } = viewBox.value
  scrollTopDistance.value = scrollTop
  const position = scrollHeight - (clientHeight + scrollTop)
  if (position <= 30) {
    scrollType.value = 'bottom'
  } else {
    scrollType.value = 'unBottom'
  }
}

// 置底方法
const refresh = () => {
  setTimeout(() => {
    viewBox.value.scrollTop = viewBox.value.scrollHeight
  }, 80)
}

// touch起始位置
const touchYStart = ref(null)
const touchStart = event => {
  touchYStart.value = event.changedTouches[0].clientY
}

// touch路径
const touchMove = event => {
  if (scrollTopDistance.value === 0) {
    const touchYMove = event.changedTouches[0].clientY
    downSlide.value = (touchYMove - touchYStart.value) * 0.1333
  }
}

// touch结束位置， 判断请求历史消息
const touchEnd = event => {
  downSlide.value = 0
  const touchYEnd = event.changedTouches[0].clientY
  if ((touchYEnd - touchYStart.value) > 100 && scrollTopDistance.value === 0) {
    mockData.unshift(...historyData)
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
</script>

<style lang="scss" scoped>
$C13d2b0: #13d2b0;
$Cf1f1f1: #f1f1f1;

header {
  width: 100%;
  height: 88px;
  line-height: 88px;
  background-color: #17d5b2;
  font-size: 36px;
  text-align: center;
  color: white;
  position: relative;
  z-index: 2;
}
.list {
  height: 84vh;
  padding: 0 25px;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  li {
    display: flex;
    align-items: flex-start;
    margin-top: 5px;
    &:first-child {
      margin-top: 20px;
    }
    &:last-child {
      margin-bottom: 30px;
    }
    &.active {
      justify-content: flex-end;
      .avatar {
        order: 1;
      }
      .bubble {
        .tail {
          order: 1;
          border-bottom: 30px solid $C13d2b0;
          border-radius: 0 0 50px 0;
          margin-right: 10px;
        }
        .message {
          margin-right: 20px;
          background-color: $C13d2b0;
          color: #ffffff;
          right: 0;
          left: 66px;
        }
      }
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bubble {
      display: flex;
      margin-top: 20px;
      .tail {
        width: 50px;
        height: 50px;
        margin-left: 10px;
        border-bottom: 30px solid $Cf1f1f1;
        border-radius: 0 0 0 50px;
      }
      .message {
        position: relative;
        top: -10px;
        left: -55px;
        font-size: 26px;
        max-width: 400px;
        line-height: 42px;
        margin: 30px 0 0 20px;
        padding: 20px 30px;
        background-color: $Cf1f1f1;
        border-radius: 12px;
        color: #666666;
      }
    }
  }
}
.enter {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  transition: bottom 0.3s;
  display: flex;
  align-items: center;
  background-color: $Cf1f1f1;
  padding: 25px 0;
  &.active {
    bottom: 123px;
    transition: bottom 0.3s;
  }
  .more {
    width: 41px;
    height: 41px;
    margin-left: 25px;
    img {
      width: 100%;
      height: 100%;
      background-size: 100%;
      &.active {
        animation: featuresShake 0.3s;
        animation-fill-mode: forwards;
      }
    }
  }
  .message {
    width: 500px;
    margin: 0 20px;
    input {
      font-size: 26px;
      width: 470px;
      min-height: 50px;
      padding: 0 15px;
      background: none;
      border: none;
    }
  }
  .send {
    display: flex;
    align-items: center;
    font-size: 28px;
    color: #333333;
    img {
      margin-left: 15px;
      width: 40px;
      height: 36px;
      background-size: 100%;
    }
  }
}
.features {
  width: 100%;
  background-color: #ffffff;
  position: absolute;
  left: 0;
  &.active {
    animation: shakeIn 0.3s;
    animation-fill-mode: forwards;
    margin-top: -28px;
  }
  ul {
    display: flex;
    align-items: center;
    padding: 24px 0;
    li {
      display: flex;
      margin-left: 30px;
      position: relative;
      width: 54px;
      height: 75px;
      input {
        width: 54px;
        height: 75px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        opacity: 0;
      }
      p {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        img {
          width: 53px;
          height: 45px;
          background-size: 100%;
        }
        span {
          font-size: 18px;
          color: #666666;
          text-align: center;
          padding-top: 8px;
        }
      }
    }
  }
}
.msg-refresh {
  font-size: 24px;
  color: #979797;
  text-align: center;
  position: relative;
  top: -30px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0);
}

@keyframes shakeIn {
  0% {
    bottom: -123px;
  }
  100% {
    bottom: 0;
  }
}
@keyframes featuresShake {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(45deg);
  }
}
</style>
<style>
body, div, ul, li, h3, h4, h5, input, p, button, header {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
}

body {
  background-color: white;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
label,
input {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  outline: none;
  border: none;
}
</style>