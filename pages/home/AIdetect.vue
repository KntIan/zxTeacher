<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>

    <view>
      <view class="aidetect_Title">
        <view class="aidetectImg" @click="aidetect_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="aidetect_text"> AI检测 </view>
        <view class="icon_2" @click="toRes">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngb255bf0a906b3962298b1e0d3bc697cf245010df5dfd6566cebca0d96c0b0e1e"
          />
        </view>
      </view>

      <view class="ai_box"> </view>

      <view class="ai_comment">
        <view class="score_box">
          <view class="score_box1">
            <view class="score_text"> 优 </view>
            <img
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng19801dd18fe3e924f8970e768847ad87b6aa7a506ed58080c039e2ab9a187f18"
              alt=""
            />
            <img
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng19801dd18fe3e924f8970e768847ad87b6aa7a506ed58080c039e2ab9a187f18"
              alt=""
            />
            <view class="score_text1">AI综合评分</view>
          </view>
          <view class="scoring_box">
            <view
              class="xingxing1"
              v-for="(item, index) in score_List"
              :key="index"
            >
              <view class="xingxing">
                {{ item.title }}
              </view>
              <uni-rate :readonly="true" size="20" :value="item.score" />
            </view>
          </view>
        </view>
      </view>
      <!-- 评测 -->
      <view class="aiDetect_tag">
        <view style="font-weight: 600; margin-right: 20rpx">
          <text>评测:</text>
        </view>
        <view>
          <uni-data-checkbox
            style="font-size: 20rpx"
            mode="tag"
            v-model="value"
            :localdata="range"
            @change="change"
          ></uni-data-checkbox>
        </view>
      </view>

      <view class="aiDetect_tag">
        <view class="aiDetect_SP">
          <text>老师评语：</text>
          <view class="aiDetect_tag1" @click="toComments"> AI评语 </view>
        </view>

        <textarea type="text" class="aiDetect_res" placeholder=" 请输入评语" />
      </view>

      <view class="aiDetect-view">
        <uni-tag
          @click="aiToggle('评测')"
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          class="unitag"
          :circle="true"
          text="评测"
          type="default"
        />
        <uni-tag
          @click="aiToggle('完成')"
          class="unitag"
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          :circle="true"
          text="完成"
          type="primary"
        />
      </view>

      <!-- 弹出层 -->
      <uni-popup ref="popup" background-color="#fff" @change="change">
        <view class="popup-content">
          <view class="box_9 flex-col">
            <view class="box_10 flex-col">
              <image
                class="image_3"
                referrerpolicy="no-referrer"
                src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng4dcd3bde9e7e544354f61909824f9cf506e3ffd38665ba57df643836b9c3bda1"
              />
              <view class="section_5 flex-col">
                <view class="section_6 flex-col">
                  <text class="text_36">永</text>
                  <image
                    class="image_4"
                    referrerpolicy="no-referrer"
                    src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng8a8b2151a4c3eb46c10ad04c65aa922738939b2eb4bcc9f86bb1bbd5b223b656"
                  />
                </view>
              </view>
            </view>
            <image
              class="image_5"
              referrerpolicy="no-referrer"
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng4348884c97cc74da91f7b6223dd31b4c3d27a5ab8b13c2b830d23a171b40c579"
            />
          </view>

          <view class="ai_comment">
            <view class="score_box">
              <view class="score_box1">
                <view class="score_text"> 优 </view>
                <img
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng19801dd18fe3e924f8970e768847ad87b6aa7a506ed58080c039e2ab9a187f18"
                  alt=""
                />
                <img
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng19801dd18fe3e924f8970e768847ad87b6aa7a506ed58080c039e2ab9a187f18"
                  alt=""
                />
                <view class="score_text1">AI综合评分</view>
              </view>
              <view class="scoring_box">
                <view
                  class="xingxing1"
                  v-for="(item, index) in score_List"
                  :key="index"
                >
                  <view class="xingxing">
                    {{ item.title }}
                  </view>
                  <uni-rate :readonly="true" size="20" :value="item.score" />
                </view>
              </view>
            </view>
          </view>

          <view class="popup_input">
            <view
              v-if="isShow"
              style="
                display: flex;
                position: relative;
                padding: 15rpx;
                align-items: center;
              "
            >
              <view class="popup_input_text">
                <img
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnga5c2a8d82b12c3b1ccf67337a50eac5458dbeec87d9349d9e9384eb4af6b9b58"
                  alt=""
                />
              </view>
              <view class="popup_input_text1"> AI大师点评 </view>
            </view>
            <textarea type="text" class="popup_res" placeholder=" 请输入评语" />
          </view>

          <view v-if="!isShow" class="popup_unitag"> 提交 </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const score_List = ref([
  {
    title: '重心',
    score: 5,
  },
  {
    title: '位置',
    score: 3,
  },
  {
    title: '形态',
    score: 2,
  },
  {
    title: '笔画',
    score: 4,
  },
  {
    title: '大小',
    score: 5,
  },
])
const range = ref([
  {
    value: 0,
    text: '优秀',
  },
  {
    value: 1,
    text: '良好',
  },
  {
    value: 2,
    text: '一般',
  },
])
const value = ref(0) //评测默认选择
const type = ref('center')
const isShow = ref(true)
const popup = ref(null) //获取弹出层dom
const aiToggle = ref(() => {}) //弹出层点击事件
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

// 返回上一级
const aidetect_goback = () => {
  uni.navigateBack()
}

// AI评语
const toComments = () => {
  uni.navigateTo({
    url: '/pages/home/aiComments',
  })
}

onMounted(() => {
  // AI评测弹窗
  aiToggle.value = (item) => {
    popup.value.open(type)
    console.log(item)
    if (item === '评测') {
      isShow.value = true
    }
    if (item === '完成') {
      isShow.value = false
    }
  }
})
// 分享
const toRes = () => {
  uni.navigateTo({
    url: '/pages/home/aiResult',
  })
}
</script>

<style>
.aidetect_Title {
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

.aidetect_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.icon_2 {
  position: absolute;
  right: 20rpx;
  font-size: 26rpx;
}

.ai_box {
  margin-top: 80rpx;
  width: 750rpx;
  height: 946rpx;
  background-color: gainsboro;
}

.ai_comment {
  margin: 20rpx;
  width: 620rpx;
}

.score_text {
  width: 128rpx;
  height: 180rpx;
  overflow-wrap: break-word;
  color: #1d56f9;
  font-size: 128rpx;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  line-height: 180rpx;
}

.score_text1 {
  font-size: 36rpx;
  color: rgba(102, 102, 102, 1);
  margin-top: 16rpx;
}

.score_box1 {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.score_box {
  display: flex;
  justify-content: space-between;
}

.xingxing1 {
  width: 284rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5rpx 0;
}

.xingxing {
  font-weight: 600;
  font-size: 28rpx;
  color: #000000;
  line-height: 48rpx;
  text-align: left;
}

.aiDetect_tag {
  width: 710rpx;
  margin-left: 20rpx;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.aiDetect_tag1 {
  width: 80rpx;
  height: 40rpx;
  font-weight: 400;
  background: #ff9e02;
  border-radius: 4rpx;
  font-size: 20rpx;
  text-align: center;
  line-height: 40rpx;
  color: #ffffff;
}

.aiDetect_SP {
  width: 710rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.aiDetect_res {
  width: 710rpx;
  height: 164rpx;
  background: #f1f1f1;
  border-radius: 8rpx;
  padding: 15rpx;
  margin-top: 15rpx;
  font-size: 28rpx;
}

.aiDetect-view {
  margin: 20rpx 0 0rpx 20rpx;
  width: 710rpx;
  padding-bottom: 60rpx;
  display: flex;
  justify-content: space-around;
}

.tag-view {
  margin-top: 180rpx;
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

.popup-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 710rpx;
  background-color: #fff;
  border-radius: 52rpx;
}

.box_9 {
  margin-top: 28rpx;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng139040b18b27e9a32b3e54502b3c45afeed758eac88fa7d095c8ba148be9c84f)
    0rpx 0rpx no-repeat;
  background-size: 230rpx 230rpx;
  align-self: center;
  width: 220rpx;
  position: relative;
  padding: 8rpx 8rpx 8rpx 8rpx;
}

.box_10 {
  background-color: rgba(255, 228, 63, 0.32);
  border-radius: 8px;
  position: relative;
  padding: 80rpx 0 98rpx 0;
}

.image_3 {
  width: 204rpx;
  height: 4rpx;
}

.section_5 {
  height: 186rpx;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng2e6578f3b67fce6bf3a4f7a5355d1b675f178cd2be0c729e863a63a5d1853cd6)
    0rpx -2rpx no-repeat;
  background-size: 188rpx 188rpx;
  width: 186rpx;
  position: absolute;
  left: 0rpx;
  top: 4rpx;
}

.section_6 {
  height: 196rpx;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng0eb9422361bcd9fa0dbc03f0a91efe0fdf527ea8c4aebd5e4eb3b7cccebc473e)
    0rpx -2rpx no-repeat;
  background-size: 196rpx 196rpx;
  width: 196rpx;
  position: relative;
  margin: 2rpx -2rpx -2rpx 2rpx;
}

.text_36 {
  width: 174rpx;
  height: 200rpx;
  overflow-wrap: break-word;
  color: rgba(243, 148, 117, 1);
  font-size: 180rpx;
  font-family: zexishuhua;
  font-weight: normal;
  text-align: left;
  white-space: nowrap;
  line-height: 200rpx;
  margin: -12rpx -8rpx -2rpx 20rpx;
}

.image_4 {
  position: absolute;
  left: 108rpx;
  top: 0rpx;
  width: 2rpx;
  height: 200rpx;
}

.image_5 {
  position: absolute;
  left: 35rpx;
  top: 10rpx;
  width: 202rpx;
  height: 202rpx;
}

.popup_input {
  width: 670rpx;
  background: #f1f1f1;
  border-radius: 8rpx;
  margin: 20rpx;
}

.popup_res {
  width: 640rpx;
  height: 164rpx;
  background: #f1f1f1;
  border-radius: 8rpx;
  padding: 15rpx;
  margin-top: 15rpx;
  font-size: 28rpx;
}

.popup_input_text {
  position: absolute;
  top: 10rpx;
  left: 15rpx;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50rpx;
  background-color: rgba(249, 183, 34, 1);
  border: 2rpx solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup_input_text1 {
  margin-top: 10rpx;
  margin-left: 20rpx;
  text-align: right;
  padding: 0 15rpx;
  width: 190rpx;
  height: 64rpx;
  background: rgba(249, 183, 34, 1);
  border-radius: 0rpx 200rpx 200rpx 0rpx;
  font-size: 22rpx;
  color: #fff;
  line-height: 64rpx;
}

.popup_unitag {
  width: 670rpx;
  margin: 20rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  border-radius: 70rpx;
  font-size: 28rpx;
  background-color: rgba(29, 86, 249, 1);
  color: #ffffff;
}
</style>
