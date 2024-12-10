<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view class="codepage">
      <view class="code_titlebox">
        <view class="messImg" @click="goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="code_title"> 公告消息 </view>
      </view>

      <view class="adverbox" v-for="(item, index) in messList" :key="index">
        <view class="adver_time">
          <view
            class="adver_hour"
            style="
              text-align: center;
              font-weight: 400;
              font-size: 20rpx;
              color: #000000;
              margin: 28rpx 0 28rpx 0;
            "
          >
            <text>{{ item.createtime }}</text
            ><text style="margin-left: 20rpx">{{ item.hour }}</text>
          </view>

          <view class="adver_content">
            <view class="adver_text1">{{ item.title }}</view>
            <view class="adver_text2" v-html="item.content"></view>
            <view class="line">
              <img
                src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng754b004becd9b25a8ebdc9d2cb98f423d3fa6fdf022dd0a97d950d38fe548f62"
                alt=""
              />
            </view>
            <view class="adver_btn" @click="adverbtn(event, index)">
              查看详情
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { fetchNotice } from '@/utils/api'
export default {
  data() {
    return {
      messList: [],
      statusBarHeight: '',
    }
  },
  onLoad() {
    this.statusBarHeight = getApp().globalData.top
  },
  mounted() {
    this.fetchNotice()
  },
  methods: {
    async fetchNotice() {
      let data = {
        page: 1,
        limit: 10,
        school_id: uni.getStorageSync('school_id'),
      }
      let res = await fetchNotice(data)
      this.messList = res.rows
      console.log(this.messList)
    },
    goback() {
      uni.navigateBack()
    },
    adverbtn(event, index) {
      const item = this.messList[index] // 获取当前项
      uni.navigateTo({
        url: `/pages/message/adver_detail?item=${encodeURIComponent(
          JSON.stringify(item)
        )}`, // 将 item 转为 JSON 字符串并编码
      })
    },
    // mycode() {
    //   uni.navigateTo({
    //     url: "/pages/pagesall/home/mycode",
    //   });
    // },
  },
}
</script>

<style>
.codepage {
  width: 750rpx;
  min-height: 1624rpx;
  background-color: #eeeeee;
  padding-bottom: 60rpx;
}

.code_titlebox {
  position: relative;
  padding: 30rpx;
}

.messImg {
  position: absolute;
  background-color: ;
}

.code_title {
  text-align: center;
  font-weight: 500;
  font-size: 36rpx;
  color: #000;
}

.adver_content {
  width: 634rpx;
  height: fit-content;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
}

.adver_time {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.adver_text1 {
  margin-bottom: 16rpx;
  font-weight: 500;
  font-size: 32rpx;
  color: #000000;
}

.adver_text2 {
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.line {
  width: 100%;
  /* margin: 28rpx 0 28rpx 0; */
}

.line img {
  width: 636rpx;
}

.adver_btn {
  text-align: center;
  font-weight: 400;
  font-size: 28rpx;
  color: #5791f2;
}
</style>
