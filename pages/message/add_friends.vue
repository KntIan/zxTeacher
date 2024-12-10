<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="friend_goback" @click="navigateBack">
        <img
          src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
          alt=""
        />
      </view>

      <view class="friend_name">
        <img :src="friend_heard" alt="" />
        <view class="fri_text1" style="margin-top: 8rpx">
          {{ friend_name }}
        </view>
        <view class="fri_text2" style="margin-top: 8rpx">
          ID: {{ friend_id }}
        </view>
      </view>

      <view class="test_verify">
        <view class="verify_text">验证信息:</view>
        <view class="verify_input">
          <input
            type="text"
            v-model.trim="verificationMessage"
            placeholder="书法一班刘易阳"
          />
        </view>
      </view>

      <view class="centerbox">
        <view class="friend_btn" @click="addFriend">
          <text style="font-weight: 500; font-size: 28rpx; color: #ffffff">
            添加好友
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

// 接收外部传入的 props
const props = defineProps({
  friend_heard: {
    type: String,
    required: true,
  },
  friend_name: {
    type: String,
    required: true,
  },
  friend_id: {
    type: String,
    required: true,
  },
})

const verificationMessage = ref('')

const navigateBack = () => {
  uni.navigateBack()
}

const addFriend = () => {
  if (!verificationMessage.value) {
    return uni.showToast({
      title: '请输入验证信息',
      icon: 'none',
    })
  }

  // 此处可以添加发送验证信息的逻辑
  console.log('发送验证信息:', verificationMessage.value)
  navigateBack()
}
</script>

<style>
.friend_goback {
  padding: 30rpx;
}

.friend_name {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 140rpx;
  margin-bottom: 128rpx;
}

.friend_name img {
  width: 176rpx;
  height: 176rpx;
}

.fri_text1 {
  font-weight: 500;
  font-size: 36rpx;
  color: #000000;
}

.fri_text2 {
  font-weight: 400;
  font-size: 24rpx;
  color: #000000;
}

.verify_text {
  margin-left: 64rpx;
  margin-bottom: 48rpx;
  font-weight: 500;
  font-size: 36rpx;
  color: #000000;
}

.verify_input {
  display: flex;
  justify-content: center;
}

.verify_input input {
  width: 580rpx;
  height: 80rpx;
  padding: 0 40rpx;
  background: #eeeeee;
  border-radius: 40rpx;
}

.friend_btn {
  width: 662rpx;
  height: 80rpx;
  background: #5791f2;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.centerbox {
  display: flex;
  justify-content: center;
  margin-top: 180rpx;
}
</style>
