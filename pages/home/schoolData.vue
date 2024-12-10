<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="schoolData_Title">
        <view class="schoolDataImg" @click="schoolData_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="schoolData_text"> 校区资料 </view>
      </view>
      <view class="schoolData_box">
        <view class="schoolData_list">
          <view class="schoolData_img"> </view>
          <view class="schoolData_list_text">
            <text style="font-size: 32rpx; font-weight: 600">校区历史</text>
            <view class="schoolData_list_text1">
              <text>更新时间: 2024.07.08</text>
              <view>
                <img
                  style="margin-right: 38rpx"
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng68257836f64d5d8c2d5d79098fb97a463fdfc17f1e5d3b8ca5660486cf729a9f"
                  alt=""
                />
                <img
                  @click="down"
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngbd0e9c606284610bd64d97095e69390e50fbc0c68b5273aba73352bf0790d49e"
                  alt=""
                />
              </view>
            </view>
          </view>
        </view>
        <view class="schoolData_list">
          <view class="schoolData_img"> </view>
          <view class="schoolData_list_text">
            <text style="font-size: 32rpx; font-weight: 600">校区历史</text>
            <view class="schoolData_list_text1">
              <text>更新时间: 2024.07.08</text>
              <view>
                <img
                  style="margin-right: 38rpx"
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng68257836f64d5d8c2d5d79098fb97a463fdfc17f1e5d3b8ca5660486cf729a9f"
                  alt=""
                />
                <img
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngbd0e9c606284610bd64d97095e69390e50fbc0c68b5273aba73352bf0790d49e"
                  alt=""
                />
              </view>
            </view>
          </view>
        </view>
        <view class="schoolData_list">
          <view class="schoolData_img"> </view>
          <view class="schoolData_list_text">
            <text style="font-size: 32rpx; font-weight: 600">校区历史</text>
            <view class="schoolData_list_text1">
              <text>更新时间: 2024.07.08</text>
              <view>
                <img
                  style="margin-right: 38rpx"
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng68257836f64d5d8c2d5d79098fb97a463fdfc17f1e5d3b8ca5660486cf729a9f"
                  alt=""
                />
                <img
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngbd0e9c606284610bd64d97095e69390e50fbc0c68b5273aba73352bf0790d49e"
                  alt=""
                />
              </view>
            </view>
          </view>
        </view>
      </view>

      <uni-popup ref="inputDialog" type="dialog">
        <uni-popup-dialog
          type="center"
          cancelText="关闭"
          confirmText="同意"
          content="是否同意下载"
          @confirm="dialogConfirm"
          @close="dialogClose"
        />
      </uni-popup>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const downPopup = ref(false)
const inputDialog = ref(null)
const down = ref(() => {})
const dialogClose = ref(() => {})
// 返回上一级
const schoolData_goback = () => {
  uni.navigateBack()
}
// 下载
onMounted(() => {
  //打开弹窗
  down.value = () => {
    inputDialog.value.open('dialog')
  }
  // 关闭弹窗
  dialogClose.value = () => {
    inputDialog.value.close()
  }
})
// 确认下载
const dialogConfirm = () => {
  uni.downloadFile({
    url: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng68257836f64d5d8c2d5d79098fb97a463fdfc17f1e5d3b8ca5660486cf729a9f', //仅为示例，并非真实的资源
    success: (res) => {
      if (res.statusCode === 200) {
        console.log('下载成功')
      }
    },
  })
}
</script>

<style>
.schoolData_Title {
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

.schoolData_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.schoolData_box {
  padding: 100rpx 20rpx 20rpx 20rpx;
}

.schoolData_list {
  width: 710rpx;
  height: 160rpx;
  display: flex;
  margin-top: 20rpx;
}

.schoolData_img {
  width: 160rpx;
  height: 160rpx;
  background-color: rgba(216, 216, 216, 1);
  margin-right: 20rpx;
}

.schoolData_list_text {
  padding-top: 18rpx;
}

.schoolData_list_text1 {
  width: 530rpx;
  margin-top: 54rpx;
  display: flex;
  font-size: 24rpx;
  justify-content: space-between;
  align-items: center;
}
</style>
