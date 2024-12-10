<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view class="courseCodepage">
      <view class="courseCode_titlebox">
        <view class="messImg" @click="goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="courseCode_title"> 分享二维码 </view>
      </view>

      <view class="courseCode_courseCodebox">
        <view class="courseCode_img">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngcd993bafb56f0fa9ca43f6a3a3f5885980722e955fcc6ed400fa9b64a364b72e"
            alt=""
          />
        </view>

        <view class="courseCode_titileimg">
          <view class="courseCode_name">
            <view
              style="
                font-weight: 600;
                font-size: 36rpx;
                color: #000000;
                margin-bottom: 10rpx;
              "
              >硬笔书法基础课程</view
            >
            <view class="courseCode_text4">共<text>16</text>节</view>
          </view>
        </view>

        <view class="courseCode_courseCodeimg">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngdec58e091c33964c716ceeb24df93a33629b032a848ee6ada66281e68aeaa069"
            alt=""
          />
        </view>
      </view>
      <view class="courseCode_baocun">
        <img
          src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng9a59d04dd68d6f6e64bba064a4e924dde82a716e686135bed44797c0e5df9310"
          alt=""
        />
        <text>保存到手机</text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 返回上级
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const goback = () => {
  uni.navigateBack()
}
</script>

<style>
.courseCodepage {
  background-color: rgba(244, 245, 249, 1);
  width: 750rpx;
  height: 100vh;
}

.courseCode_titlebox {
  position: relative;
  padding: 30rpx;
}

.messImg {
  position: absolute;
}

.courseCode_title {
  text-align: center;
  font-weight: 500;
  font-size: 36rpx;
  font-weight: 600;
}

.courseCode_courseCodebox {
  width: 556rpx;
  height: 640rpx;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng2f44e9201c59e30551b904da05df9e722aa6c7cb73f8bbacb51e09e0cd9aa9a8)
    100% no-repeat;
  background-size: 100% 100%;
  margin: 176rpx 0 0 98rpx;
  position: relative;
}

.courseCode_img {
  position: absolute;
  top: 23%;
  left: 50%;
  transform: translate(-50%);
}

.courseCode_baocun {
  background-color: rgba(29, 86, 249, 1);
  color: #ffffff;
  border-radius: 20px;
  height: 80rpx;
  width: 360rpx;
  margin: 128rpx 0 354rpx 196rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.courseCode_baocun img {
  margin-right: 10rpx;
}

.courseCode_titileimg {
  width: 400rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 5%;
  left: 13%;
}

.courseCode_name {
  margin-left: 15rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.courseCode_courseCodeimg {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}

.courseCode_courseCodeimg img {
  width: 450rpx;
  height: 450rpx;
}

.courseCode_text4 {
  width: 112rpx;
  height: 48rpx;
  background: rgba(29, 86, 249, 0.1);
  border-radius: 4rpx;
  color: rgba(29, 86, 249, 1);
  border: 0.5rpx solid rgba(29, 86, 249, 1);
  font-size: 20rpx;
  text-align: center;
  line-height: 48rpx;
}

.courseCode_text4 text {
  font-size: 32rpx;
  padding: 0 5rpx;
}
</style>
