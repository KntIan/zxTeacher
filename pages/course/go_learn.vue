<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view>
        <view class="learn_title">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
            @click="back_learn"
          />
          <view>硬笔书法初级教程</view>
        </view>
        <view>
          <!-- <video
            ref="isVideo"
            id="myVideo"
            class="learn_video"
            :muted="isMuted"
            :direction="-90"
            autoplay
            @click="dbclick"
            @pause="videoPause"
            @play="videoPlay"
            @timeupdate="timeup"
            :src="videoSrc"
          /> -->
          <video
            v-if="nowVideo.length > 0"
            @play="playAudio"
            @pause="pauseAudio"
            @ended="nextVideo"
            class="learn_video"
            :src="nowVideo[nowVideoIndex].video"
            muted="true"
          ></video>
          <view
            style="
              width: 100%;
              height: 450rpx;
              line-height: 450rpx;
              text-align: center;
              color: #000;
              font-size: 36rpx;
              background-color: #f5f5f5;
            "
            class="learn_video"
            v-else
          >
            <text>暂无视频信息</text>
          </view>
        </view>
        <view class="learn_text">
          <text>硬笔书法基础课程</text>
          <view class="learn_text1">
            <img
              @click="toShare"
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng6c84f4c91ccf1d188d37cc8bce66d442f4d92ff104bff97e2406056f9b89291d"
              alt=""
            />
            <img
              @click="toCode"
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng6657c2dc8ae58e01056d89c39e022c32f1279532a442d7023ec8401fc8979f2d"
              alt=""
            />
          </view>
        </view>

        <view class="learn_text3">
          <view class="learn_text4"
            >共<text>{{ nowVideoLen }}</text
            >节</view
          >
          <view class="learn_text5">
            <text
              style="
                color: rgba(29, 86, 249, 1);
                font-size: 32rpx;
                margin-right: 5rpx;
              "
              >{{ nowVideo[nowVideoIndex]?.views || 0 }}</text
            >
            <text>人学过</text>
          </view>
        </view>

        <view class="learn_text6">
          <view style="font-size: 36rpx; font-weight: 600; margin-left: 20rpx">
            课程目录
          </view>

          <view class="learn_text6_list">
            <uni-collapse
              ref="collapse"
              accordion
              v-model="value"
              @change="change"
            >
              <uni-collapse-item
                v-for="(item, index) in collapseList"
                :key="index"
                :title="item.title"
              >
                <view class="content">
                  <view
                    ref="playList"
                    class="content_text"
                    v-for="(arritem, arrindex) in item.content"
                    :key="arritem.id"
                    @click="isP(arritem.id)"
                  >
                    <view style="display: flex">
                      <text>{{ arritem.title }}</text>
                      <view class="content_text1" v-if="arritem.audition">
                        试听
                      </view>
                    </view>
                    <view class="">
                      <img
                        src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnga6b6e685e7581e92730a1656a09ee951c90e4d2447d8b3740690a52e1dd1d2b5"
                        alt=""
                      />
                    </view>
                  </view>
                </view>
              </uni-collapse-item>
            </uni-collapse>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onDeactivated, onMounted, ref, nextTick } from 'vue'
import {
  getMyCourseChapterList,
  getMyCourseSectionList,
  uploadCourseChapterMaterial,
} from '@/utils/api'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const value = ref('0')
const currentTime = ref(0) //是否试听,为0时正常播放
const isMuted = ref(true) //是否禁音
const videoType = ref(true) //是否播放
const currentVideoIndex = ref(0) //双击
const videoSrc = ref('') //视频源
const playList = ref(null) //课程目录列表
const audioContext = ref(null) //  // 用于存储音频上下文的引用
const videoContext = ref(null) //  // 用于存储音频上下文的引用
const isPlay = ref(() => {}) //点击列表播放
const timer = ref(null)
const courseId = ref('')
//章节
const collapseList = ref()
const nowVideo = ref([])
const nowVideoLen = ref([])
const nowVideoIndex = ref(0)
// 返回上级
const back_learn = () => {
  uni.navigateBack()
}
// 分享
const toShare = () => {
  // 通过navigateto跳转并传参
  uni.navigateTo({
    url: '/pages/course/courseShare',
    success: (res) => {
      res.eventChannel.emit('toShare', { data: videoSrc.value })
    },
  })
}
// 分享二维码
const toCode = () => {
  uni.navigateTo({
    url: '/pages/course/courseCode',
  })
}
const change = (e) => {
  // console.log(e)
  currentVideoIndex.value = e
  // console.log(collapseList.value[e].content[0].video)
}
const isP = (e) => {
  // console.log(e)
  const currentCollapse = collapseList.value[currentVideoIndex.value]

  // 确保 currentCollapse 中的 content 是数组
  if (currentCollapse && Array.isArray(currentCollapse.content)) {
    currentCollapse.content.forEach((item) => {
      if (item.id === e) {
        // console.log(item.fonts)
        nowVideo.value = item.fonts || [] // 确保即使 item.fonts 为 undefined 也设置为空数组
      }
    })
  } else {
    console.error('当前索引没有找到有效的内容数组:', currentCollapse)
  }
}
const playCurrentVideo = () => {
  if (nowVideoIndex.value >= 0 && nowVideoIndex.value < nowVideo.value.length) {
    const currentVideo = nowVideo.value[nowVideoIndex.value]
    if (currentVideo) {
      const videoSrc = currentVideo.video // 访问 video 属性
      console.log('播放视频:', videoSrc)
      // 进行播放逻辑
    } else {
      console.error('当前视频对象不存在:', currentVideo)
    }
  } else {
    console.error('当前的视频索引不在范围内:', nowVideoIndex.value)
  }
}
const nextVideo = () => {
  if (Array.isArray(nowVideo.value) && nowVideo.value.length > 0) {
    if (nowVideoIndex.value < nowVideo.value.length - 1) {
      nowVideoIndex.value++ // 切换到下一个视频
    } else {
      nowVideoIndex.value = 0 // 如果达到最后一个，则跳回第一部
    }

    // 打印当前视频的 src
    const currentVideo = nowVideo.value[nowVideoIndex.value]
    if (currentVideo) {
      console.log('当前视频:', currentVideo.video)
    } else {
      console.error('当前视频对象不存在')
    }
  } else {
    console.error('当前没有视频可播放:', nowVideo.value)
  }
}
const playAudio = () => {
  audioContext.value.play() // 播放音频
}
const pauseAudio = () => {
  audioContext.value.pause() // 暂停音频
}
const stopAudio = () => {
  audioContext.value.stop() // 停止音频
}
// 双击播放|暂停
const dbclick = () => {
  db.value++
  timer.value = setTimeout(() => {
    if (db.value === 2) {
      if (videoType.value) {
        videoContext.pause()
      } else {
        videoContext.play()
      }
      db.value = 0
      clearTimeout(timer.value)
      timer.value = null
    } else {
      db.value = 0
      clearTimeout(timer.value)
      timer.value = null
    }
  }, 300)
}

// 试听超时暂停播放
const timeup = (event) => {
  if (event.detail.currentTime > currentTime.value && currentTime.value !== 0) {
    videoType.value = false
    videoContext.pause()
  }
}
onLoad((options) => {
  courseId.value = options.id
})
onMounted(() => {
  // 获取课程章节列表
  let params = { lesson_id: courseId.value }
  uploadCourseChapterMaterial(params)
    .then((chapters) => {
      collapseList.value = chapters.items

      // 初始化 nowVideo，确保内容存在
      if (collapseList.value.length > 0 && collapseList.value[0].content) {
        nowVideo.value = collapseList.value[0].content
          .map((item) => item.fonts)
          .flat() // 初始化 nowVideo
        nowVideoLen.value = nowVideo.value.length
        console.log('视频列表:', nowVideo.value)
      }
    })
    .catch((error) => {
      console.error(error)
    })
})

onDeactivated(() => {
  clearTimeout(timer.value)
  timer.value = null
})
</script>

<style>
.learn_title {
  background-color: #ffffff;
  width: 710rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  z-index: 999;
}

.learn_title view {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.learn_video {
  margin-top: 80rpx;
  width: 100%;
}

.learn_text {
  width: 710rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx;
}

.learn_text1 {
  display: flex;
  align-items: center;
}

.learn_text1 img {
  margin-left: 16rpx;
}

.learn_text text {
  font-weight: 600;
  font-size: 36rpx;
  color: #000000;
}

.learn_text3 {
  width: 710rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx;
}

.learn_text4 {
  width: 112rpx;
  height: 48rpx;
  background: #1d56f9;
  border-radius: 4rpx;
  color: rgba(255, 255, 255, 1);
  font-size: 20rpx;
  text-align: center;
  line-height: 48rpx;
}

.learn_text4 text {
  font-size: 32rpx;
  padding: 0 5rpx;
}

.learn_text5 {
  font-size: 20rpx;
}

.learn_text6 {
}

.learn_text6_list {
}

.content {
  /* background-color: rgba(244, 245, 249, 1); */
}

.content_text {
  padding: 20rpx;
  background-color: rgba(244, 245, 249, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.5rpx solid rgba(232, 232, 232, 1);
  text-indent: 40rpx;
}

.content_text_active {
  background-color: rgba(244, 245, 249, 0.6);
}

.content_text1 {
  width: 80rpx;
  height: 36rpx;
  background: rgba(29, 86, 249, 0.08);
  border-radius: 4rpx;
  border: 2rpx solid #1d56f9;
  text-align: center;
  line-height: 36rpx;
  font-size: 20rpx;
  color: rgba(29, 86, 249, 1);
  margin-left: 16rpx;
}

:deep .uni-collapse-item__title-box {
  padding: 20rpx !important;
}

:deep .uni-collapse-item__title-arrow {
  margin-right: 20rpx !important;
}
</style>
