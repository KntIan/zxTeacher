<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="classRoom_Title">
        <view class="classRoomImg" @click="classRoom_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="classRoom_text"> 双师课堂 </view>
      </view>

      <view class="classRoom_input">
        <img
          src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng649b7bed867631d9ece9717881d1574011430d801560c32350acb68472c03b90"
          alt=""
        />
        <input
          type="text"
          @blur="searchclassRoomt"
          class="classRoom_input1"
          placeholder="请输入单字"
          maxlength="1"
          v-model="searchText"
        />
      </view>
      <view class="classRoom_box">
        <view class="classRoom_box1">
          <text class="classRoom_icon_text">视频列表</text>
        </view>
        <view style="height: 200rpx">
          <view v-for="(item, index) in videoList" :key="index">
            <button
              style="width: fit-content; margin: 10px"
              @click="addToSelectedVideos(item)"
            >
              {{ item.handout }}
            </button>
          </view>
        </view>

        <view class="classRoom_box">
          <view class="classRoom_box1">
            <text class="classRoom_icon_text">已选视频列表</text>
          </view>

          <view class="classRoom_box2">
            <view class="videoNone" v-if="selectedVideos.length === 0"> </view>
            <view
              class="videohas"
              v-for="(item, index) in selectedVideos"
              :key="index"
            >
              {{ item.handout }}
              <view class="">
                <img
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnga6b6e685e7581e92730a1656a09ee951c90e4d2447d8b3740690a52e1dd1d2b5"
                  alt=""
                />
              </view>
            </view>
          </view>
        </view>

        <view class="classRoom-view">
          <uni-tag
            style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
            class="unitag"
            :circle="true"
            text="取消"
            type="default"
            @click="classRoom_goback"
          />
          <uni-tag
            class="unitag"
            style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
            :circle="true"
            text="完成"
            type="primary"
            @click="submit"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { searchRelatedVideo, submitDoubleClassHomework } from '@/utils/api'
const statusBarHeight = ref()
const searchText = ref('')

const selectedVideos = ref([]) // 选中的视频
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const videoList = ref([])
// 返回上级
const classRoom_goback = () => {
  uni.navigateBack()
}

// 选择视频
// const addVideo = () => {
//   uni.chooseVideo({
//     sourceType: ['album', 'camera'],
//     success: (res) => {
//       console.log(res)
//     },
//     fail: () => {
//       console.log('上传失败')
//     },
//   })
// }
// 添加视频到已选列表
const addToSelectedVideos = (item) => {
  if (!selectedVideos.value.includes(item)) {
    selectedVideos.value.push(item)
  } else {
    uni.showToast({
      title: '该视频已在已选列表中',
      icon: 'none',
      duration: 5000,
    })
  }
}
const toBase64 = (str) => {
  try {
    return btoa(unescape(encodeURIComponent(str)))
  } catch (e) {
    console.error('转换为Base64失败:', e)
    return null // 返回 null 表示转换失败
  }
}

const searchclassRoomt = async () => {
  if (searchText.value === '') return
  try {
    const base64String = toBase64(searchText.value)
    const data = {
      fonts: base64String,
    }
    let res = await searchRelatedVideo(data)
    // console.log(res)
    videoList.value = res.items
  } catch (error) {}
}
const submit = async () => {
  // 提取 selectedVideos 中所有视频的 ID
  const videoIds = selectedVideos.value.map((video) => video.id).join(',')

  try {
    let res = await submitDoubleClassHomework({ fonts_id: videoIds })
    if (res.code === 1) {
      uni.showToast({
        title: res.msg,
        icon: 'success',
        mask: true,
      })
      uni.navigateBack()
    } else {
      uni.showToast({
        title: res.msg,
        icon: 'error',
        mask: true,
      })
    }
  } catch (error) {}
}
</script>

<style>
.classRoom_Title {
  /* position: fixed; */
  top: 0;
  background-color: #ffffff;
  width: 710rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  z-index: 999;
}

.classRoom_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.classRoom_input {
  padding: 20rpx;
  /* padding-top: 80rpx; */
  padding-bottom: 0rpx;
  position: relative;
}

.classRoom_input img {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  top: 50%;
  left: 50rpx;
}

.classRoom_input1 {
  height: 80rpx;
  padding-left: 90rpx;
  background: #eeeeee;
  border-radius: 50rpx;
  margin-top: 16rpx;
}

.classRoom_box {
  margin-top: 20rpx;
  padding: 20rpx;
}

.classRoom_icon_text {
  font-size: 32rpx;
  font-weight: 600;
}

.classRoom_box2 {
  margin-top: 20rpx;
  width: 670rpx;
  height: 500rpx;
  background: #f4f5f9;
  border-radius: 4rpx;
}

.videoNone {
  width: 710rpx;
  height: 500rpx;
  color: rgba(102, 102, 102, 1);
  text-align: center;
  line-height: 500rpx;
}

.videohas {
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  border-bottom: rgba(102, 102, 102, 1) solid 0.5rpx;
}

.classRoom-view {
  margin: 40rpx 0 0rpx 20rpx;
  width: 710rpx;
  padding-bottom: 60rpx;
  display: flex;
  justify-content: space-around;
}

.tag-view {
  margin-bottom: 60rpx;
  width: 710rpx;
  display: flex;
  justify-content: space-around;
}

.unitag {
  width: 288rpx;
  height: 80rpx;
  text-align: center;
}
</style>
