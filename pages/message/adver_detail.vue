<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view class="code_page">
      <view class="code_titlebox">
        <view class="messImg" @click="goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="code_title">
          {{ list.title }}
        </view>
      </view>

      <view class="detail_title">
        <text style="font-weight: 500; font-size: 32rpx; color: #000000">{{
          list.description
        }}</text>
        <view class="detail_time">
          <view class="time_1">
            {{ list.createtime }}
          </view>
        </view>
      </view>
      <view class="detail_box" v-html="list.content"> </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: null,
    }
  },
  onLoad(options) {
    if (options.item) {
      this.list = JSON.parse(decodeURIComponent(options.item)) // 解码并解析 JSON 字符串
      console.log(this.list) // 现在可以使用这个对象
    }
    this.statusBarHeight = getApp().globalData.top
  },
  methods: {
    goback() {
      uni.navigateBack()
    },
  },
}
</script>

<style scoped>
.detail_box img {
  width: 100%;
  float: left;
}
.code_page {
  width: 750rpx;
  height: 1624rpx;
}

.code_titlebox {
  position: relative;
  padding: 30rpx;
}

.messImg {
  position: absolute;
  margin-top: 7rpx;
}

.code_title {
  text-align: left;
  font-weight: 500;
  font-size: 36rpx;
  color: #000;
  padding: 0 30rpx;
}

.detail_title {
  padding: 30rpx;
  display: grid;
  justify-content: space-between;
  align-items: center;
}

.detail_time {
  display: flex;
  flex-direction: row-reverse;
}

.time_1 {
  margin-right: 10rpx;
  font-weight: 400;
  font-size: 20rpx;
  color: #000000;
}

.time_2 {
  font-weight: 400;
  font-size: 20rpx;
  color: #000000;
}

.detail_box {
  text-indent: 2em;
  padding: 0 30rpx 0 30rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
}
</style>
