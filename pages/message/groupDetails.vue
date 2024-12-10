<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view class="container" @click="handleContainerClick">
      <view class="header_bar">
        <img
          src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
          class="icon-image"
        />
        <text class="title">{{ groupName }}</text>
        <view class="icons">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnga32663f3ea0befd23647700f46f6bcf374e16d39f467d8237538a5b8ecaabe79"
            class="icon-image"
          />
          <img
            src="https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/b2428e90b04d4a01a6c1cd68cf075881_mergeImage.png"
            class="icon-image"
          />
        </view>
      </view>

      <view class="header">
        <template v-if="isEditing">
          <input v-model="groupName" class="group-name-input" @click.stop />
        </template>
        <template v-else>
          <text>{{ groupName }}</text>
          <button @click.stop="editGroupName">更改群名</button>
        </template>
      </view>

      <text class="students-title">学生详情</text>
      <view class="students">
        <view
          v-for="(admin, index) in admins"
          :key="index"
          class="student-card"
        >
          <image :src="admin" class="student-image" />
          <view class="admin-flag">
            <view class="admin-flag-line"></view>
          </view>
        </view>
        <view
          v-for="(member, index) in members"
          :key="index"
          class="student-card"
        >
          <image :src="member" class="student-image" />
        </view>
        <view class="add-student-card">
          <text class="add-student-text" @click="selectInviteFriends">+</text>
        </view>
      </view>

      <view class="footer">
        <button class="cancel-btn">取消</button>
        <button class="confirm-btn">完成</button>
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

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const options = uni.getLaunchOptionsSync()

let admins = []
let members = []
try {
  admins = JSON.parse(decodeURIComponent(options.query.admins)) || []
  members = JSON.parse(decodeURIComponent(options.query.members)) || []
} catch (error) {
  console.error('解析管理员或成员信息时出错:', error)
}

const groupName = ref(options.query.name || '默认群名')
const isEditing = ref(false)

const editGroupName = () => {
  isEditing.value = true
}

const confirmGroupName = () => {
  isEditing.value = false
  // 可以在这里添加保存服务端数据的逻辑
}

const handleContainerClick = () => {
  if (isEditing.value) {
    confirmGroupName()
  }
}

const selectInviteFriends = () => {
  uni.navigateTo({
    url: 'inviteFriends',
  })
}
</script>

<style lang="less" scoped>
.header uni-button {
  width: auto !important;
  margin-right: 0;
  line-height: 62rpx;
}
.container {
  padding: 28rpx;
}

.header_bar {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  align-items: center;
}

.title {
  font-weight: 500;
  font-size: 36rpx;
  text-align: center;
}

.icons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(32px, 1fr));
  justify-items: end;
}
.icons img {
  width: 32rpx;
  height: 32rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 56rpx 0 40rpx;
  border-bottom: 2rpx solid #f4f5f9;
  padding-bottom: 28rpx;
}
.header text {
  font-size: 36rpx;
  font-weight: 500;
}
.header button {
  width: 160rpx;
  height: 60rpx;
  font-size: 28rpx;
  background: #f4f5f9;
  border-radius: 8rpx;
  color: #000;
  font-weight: 500;
}

.students-title {
  font-weight: 500;
  font-size: 32rpx;
}
.students {
  display: grid;
  grid-template-columns: repeat(auto-fill, 112rpx);
  gap: 16rpx 30rpx;
  margin-bottom: 80rpx;
  margin-top: 28rpx;
}

.student-card {
  position: relative;
}

.student-image {
  width: 112rpx;
  height: 112rpx;
  border-radius: 16rpx;
}

.admin-flag {
  width: 32rpx;
  height: 32rpx;
  background: #ff0500;
  position: absolute;
  bottom: 4px;
  right: 0;
  border-radius: 50%;
}
.admin-flag-line {
  width: 20rpx;
  height: 4rpx;
  background: #fff;
  border-radius: 2rpx;
  margin: auto;
  margin-top: 14rpx;
}

.add-student-card {
  width: 112rpx;
  height: 112rpx;
  border-radius: 16rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d8d8d8;
  border: 1px dashed #ccc;
}
.add-student-text {
  font-size: 48rpx;
}

.footer {
  display: flex;
  justify-content: space-between;

  .cancel-btn,
  .confirm-btn {
    border-radius: 40rpx;
    background: rgba(29, 86, 249, 0.08);
    color: #1d56f9;
    text-align: center;
    border: 1rpx solid #1d56f9;
    line-height: 100rpx;
    font-size: 36rpx;
    padding: 0 108rpx;
  }
  .cancel-btn {
    background: #ccc;
    color: #000;
  }
}
</style>
