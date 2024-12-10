<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="share_title">
        <img
          src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
          alt=""
          @click="back_share"
        />
        <view>课程分享</view>
      </view>

      <view class="share_box">
        <view
          class="share_list"
          v-for="(item, index) in shareList"
          :key="index"
        >
          <view class="share_img">
            <img :src="item.img" alt="" />
            <view class="">
              {{ item.title }}
            </view>
          </view>
          <view class="share_icon" @click="sharetoggle(item.id)">
            <view class="share_icon1" v-show="item.isShareTog"> </view>
          </view>
        </view>
      </view>

      <view class="share-view">
        <uni-tag
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          class="unitag"
          :circle="true"
          text="取消"
          type="default"
        />
        <uni-tag
          @click="isShare"
          class="unitag"
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          :circle="true"
          text="完成"
          type="primary"
        />
      </view>

      <!-- 提示信息弹窗 -->
      <uni-popup ref="message" type="message">
        <uni-popup-message
          style="margin-top: 80rpx; text-align: center"
          type="info"
          message="请选择要分享的班级"
          :duration="2000"
        ></uni-popup-message>
      </uni-popup>
    </view>
  </view>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const shareVideo = ref('') //要分享的视频
const message = ref(null)
const isShare = ref(() => {})
const shareList = ref([
  {
    id: 0,
    title: '田园路校区-书法一班',
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    isShareTog: false,
  },
  {
    id: 1,
    title: '田园路校区-书法二班',
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    isShareTog: false,
  },
  {
    id: 2,
    title: '田园路校区-书法三班',
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    isShareTog: false,
  },
])
// 返回上级
const back_share = () => {
  uni.navigateBack()
}
// 是否选中
const sharetoggle = (id) => {
  shareList.value.forEach((item) => {
    item.id === id ? (item.isShareTog = !item.isShareTog) : item.isShareTog
  })
}

onMounted(() => {
  // 获取传过来的视频参数
  getCurrentInstance()
    .proxy.getOpenerEventChannel()
    .on('toShare', function (data) {
      shareVideo.value = data.data
    })
  // 点击完成分享
  isShare.value = () => {
    // 要分享的班级
    const share = shareList.value.map((item) => {
      if (item.isShareTog) {
        console.log(item)
        return item
      }
    })
    // 未选择班级时的提示
    share.indexOf(undefined) === 0
      ? message.value.open()
      : message.value.close()
  }
})
</script>

<style>
.share_title {
  position: fixed;
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

.share_title view {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.share_box {
  padding: 20rpx;
  padding-top: 80rpx;
}

.share_list {
  margin-top: 20rpx;
  padding-bottom: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.5rpx solid rgba(244, 245, 249, 1);
}

.share_img {
  height: 88rpx;
  display: flex;
  align-items: center;
}

.share_img img {
  height: 88rpx;
  width: 88rpx;
  border-radius: 50rpx;
  margin-right: 20rpx;
}

.share_icon {
  width: 28rpx;
  height: 28rpx;
  border: 2rpx solid rgba(151, 151, 151, 1);
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.share_icon1 {
  width: 16rpx;
  height: 16rpx;
  background: rgba(151, 151, 151, 1);
  border-radius: 15rpx;
}

.share-view {
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
