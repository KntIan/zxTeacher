<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view class="container">
      <view class="header">
        <view v-if="user" class="profile-info">
          <text class="name">{{ user?.nickname }}</text>
          <text class="id">ID: {{ user?.show_id }}</text>
          <view class="posit">
            <img src="../../static/img/add.png" alt="" />
            <text class="location">{{ user?.school_name }}</text>
          </view>

          <view class="QRcode">
            <img src="../../static/img/qrcode.png" alt="" @click="mycode" />
            <img
              style="margin-left: 16rpx"
              src="../../static/img/saoyisao.png"
              alt=""
              @click="btnscan"
            />
          </view>
        </view>
        <image class="profile-pic" :src="user?.avatar" mode="aspectFill" />
      </view>

      <view class="menu">
        <!-- <navigator url="privacy">
          <view class="menu-item">隐私</view>
        </navigator> -->
        <navigator url="complaint">
          <view class="menu-item">投诉意见</view>
        </navigator>
        <navigator url="contactUs">
          <view class="menu-item">联系我们</view>
        </navigator>
        <navigator url="aboutUs">
          <view class="menu-item">关于我们</view>
        </navigator>
      </view>

      <button class="logout-button" @click="logout1">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { logout } from '../../TUIKit/components/TUIChat/entry-chat-only'
const statusBarHeight = ref()
const user = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

// const teacher = ref({
//   name: '刘老师', // 这里可以通过外部传入的props来接收
//   id: '0000001', // 这里可以通过外部传入的props来接收
//   avatar:
//     'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng8a15c1ebc4e4cfb278d7a9f171eb4339fbf61b7a092afbc44c8e3a74201fb075', // 这里可以通过外部传入的props来接收
//   location: '湛江市-霞山区-京广路校区', // 这里可以通过外部传入的props来接收
// })

const mycode = () => {
  uni.navigateTo({ url: '../../pages/message/mycode' })
}

const btnscan = () => {
  uni.scanCode({
    success: (res) => {
      console.log('条码类型：', res.scanType)
      console.log('条码内容：', res.result)
    },
    fail: (err) => {
      console.error('扫码失败:', err)
      uni.showToast({
        title: '扫码失败，请重试',
        icon: 'none',
      })
    },
  })
}
const logout1 = () => {
  uni.clearStorageSync()

  uni.reLaunch({ url: '/pages/login/login' })
}
onMounted(() => {
  user.value = uni.getStorageSync('userinfo') || {}
  console.log(uni.getStorageSync('userinfo'))
})
</script>

<style scoped>
.header {
  background-color: #3366ff;
  padding: 40rpx;
  display: flex;
  height: 500rpx;
  justify-content: space-between;
  align-items: center;
}

.profile-info {
  color: white;
  display: grid;
}

.posit {
  display: flex;
  align-items: center;
  margin: 30rpx 0;
}

.posit img {
  width: 20rpx;
  height: 24rpx;
  padding-right: 16rpx;
  padding-top: 8rpx;
}

.name {
  font-weight: 500;
  font-size: 48rpx;
}

.id,
.location {
  font-size: 28rpx;
  margin-top: 8rpx;
}

.QRcode img {
  width: 32rpx;
  height: 32rpx;
}

.profile-pic {
  width: 268rpx;
  height: 288rpx;
}

.menu {
  background-color: white;
  margin-top: -32rpx;
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  padding: 0 30rpx;
}

.menu-item {
  line-height: 100rpx;
  font-size: 28rpx;
  border-bottom: 1px solid #eee;
}

.logout-button {
  position: absolute;
  width: 288rpx;
  font-size: 36rpx;
  color: #000000;
  background: #f4f5f9;
  border-radius: 40rpx;
  bottom: 64rpx;
  left: 0;
  right: 0;
}
.logout-button::after {
  border: none;
}
</style>
