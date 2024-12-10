<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view class="indmsg">
      <view class="msg_Title" ref="msgTitle">
        <view class="msgImg" @click="ind_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="msg_text"> {{ indTitle }}信息 </view>
      </view>

      <view class="bg_left"></view>
      <view class="bg_right"></view>
      <view class="bg_center"></view>

      <view class="indivimsg_name">
        <img :src="indivimsg.avatar" alt="" />
        <view class="msg_text1" style="margin-top: 8rpx">
          {{ indivimsg.nickname }}
        </view>
        <view class="msg_text2" style="margin-top: 8rpx">
          ID:{{ indivimsg.id }}
        </view>
        <view class="textflex">
          <view class="msgtext3">
            {{ indivimsg.zx_classly_title }}
          </view>
          <view class="msgtext4">
            {{ indivimsg.age }}
          </view>
        </view>
      </view>

      <view class="worksmsg">
        <view class="uni-margin-border uni-common-mt">
          <uni-segmented-control
            class="ind_center"
            :current="current"
            :values="items"
            active-color="#5791F2"
            styleType="text"
            @clickItem="onClickItem"
          />
          <view class="indi_oper" v-if="current === 0"> </view>
          <view class="indi_oper1" v-if="current === 1"> </view>
        </view>
        <!-- AI -->
        <view class="AIlist" v-if="current === 0">
          <myhistList @change="goAIhistList" :histList="AIhistList" />
        </view>
        <!-- 老师 -->
        <view class="AIlist" v-if="current !== 0">
          <myhistList @change="goteacherhistList" :histList="teacherhistList" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onPageScroll } from '@dcloudio/uni-app'
import { getCurrentInstance, onMounted, ref } from 'vue'
import myhistList from '@/components/infolist/histList.vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  getHomeworkToReviewList,
  getHomeworkToCheckByAiList,
} from '@/utils/api'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const msgTitle = ref(null)
const indTitle = ref('')
const indivimsg = ref({})
const current = ref(0)
const items = ref(['AI检查', '老师审阅'])
// ai检查
const AIhistList = ref([
  {
    type: 'AI',
    img: 'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/fdef5ff762634f9f883ddd89c8af057a_mergeImage.png',
    title: '书法练习第一课',
    date: '2024-07-1',
  },
  {
    type: 'AI',
    img: 'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/e5923dca4d594da3abf115ee5a05cf14_mergeImage.png',
    title: '书法练习第二课',
    date: '2024-07-1',
  },
  {
    type: 'AI',
    img: 'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/e5923dca4d594da3abf115ee5a05cf14_mergeImage.png',
    title: '书法练习第三课',
    date: '2024-07-1',
  },
  {
    type: 'AI',
    img: 'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/fdef5ff762634f9f883ddd89c8af057a_mergeImage.png',
    title: '书法练习第四课',
    date: '2024-07-1',
  },
  {
    type: 'AI',
    img: 'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/fdef5ff762634f9f883ddd89c8af057a_mergeImage.png',
    title: '书法练习第一课',
    date: '2024-07-1',
  },
  {
    type: 'AI',
    img: 'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/e5923dca4d594da3abf115ee5a05cf14_mergeImage.png',
    title: '书法练习第二课',
    date: '2024-07-1',
  },
])
// 老师审阅
const teacherhistList = ref()
onPageScroll((scroll) => {
  msgTitle.value.$el.style =
    scroll.scrollTop === 0 ? '' : 'background-color:#FFFFFF;'
})
// 返回上一级
const ind_goback = () => {
  uni.navigateBack()
}
// ai与教师检查列表切换
const onClickItem = (e) => {
  if (current.value !== e.currentIndex) {
    current.value = e.currentIndex
  }
  if (current.value == 0) {
    loadHomeworkToCheckByAiList()
  } else {
    loadHomeworkToReviewList()
  }
}
const loadHomeworkToReviewList = async (e) => {
  const data = {
    page: 1,
    limit: 10,
    student_id: uni.getStorageSync('info').id,
  }
  let res = await getHomeworkToReviewList(data)
  console.log(res)
  teacherhistList.value = res.items
  console.log(teacherhistList.value)
}
const loadHomeworkToCheckByAiList = async (e) => {
  const data = {
    page: 1,
    limit: 10,
    // student_id: uni.getStorageSync('info').id,
    student_id: '17',
  }
  let res = await getHomeworkToCheckByAiList(data)
  console.log(res)
  AIhistList.value = res.items
  console.log(AIhistList.value)
}

const goAIhistList = (e) => {
  console.log(e)
  uni.navigateTo({
    url: `/pages/home/aiResult?homework_id=${e}`, // 使用模板字符串传入变量
  })
}
const goteacherhistList = (e) => {
  console.log(e)
  uni.navigateTo({
    url: `/pages/home/teacherSet?id=${e}`, // 使用模板字符串传入变量
  })
}
onMounted(() => {
  loadHomeworkToCheckByAiList()
  // 获取传过来的个人信息
  getCurrentInstance()
    .proxy.getOpenerEventChannel()
    .on('getInfo', function (data) {
      indivimsg.value = data.data
      // 将个人信息存储
      uni.setStorage({
        key: 'info',
        data: indivimsg.value,
        success: (res) => {
          console.log(res)
        },
      })
    })
  // 刷新时获取存储的信息
  indivimsg.value =
    JSON.stringify(indivimsg.value) === '{}'
      ? JSON.parse(localStorage.info).data
      : indivimsg.value
  // 标题名称
  indTitle.value = indivimsg.value.nickname.split('-')[0]
})
</script>

<style>
.indmsg {
  padding-top: 80rpx;
  background: linear-gradient(180deg, #e5eafc 0%, #f4f5f9 48%, #f4f5f9 100%);
}

.bg_left {
  width: 250rpx;
  height: 424rpx;
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngec785e609e1d528e62d2b34a33cf177d7d25a89a759f7b364a3c51049b070b92)
    100% no-repeat;
  background-size: 100% 100%;
}

.bg_right {
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng535865731072ef451bfdfd4b5c84d1229aff109062f3a9105a1ec7a62a15a02a)
    100% no-repeat;
  width: 250rpx;
  height: 424rpx;
  position: absolute;
  top: 136rpx;
  right: 0;
  background-size: 100% 100%;
}

.bg_center {
  width: 50rpx;
  height: 50rpx;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngf29ca8122eaff0fe2a3b8f7a7f15bea056d87f410d157b01f69a1475983ef885)
    100% no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 366rpx;
  left: 210rpx;
}

.msg_Title {
  /* position: fixed; */
  top: 0;
  width: 710rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  z-index: 999;
}

.msg_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.indivimsg_name {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28rpx;
  margin-bottom: 48rpx;
}

.indivimsg_name img {
  width: 176rpx;
  height: 176rpx;
}

.msg_text1 {
  font-weight: 500;
  font-size: 36rpx;
  color: #000000;
}

.msg_text2 {
  font-weight: 400;
  font-size: 24rpx;
  color: #000000;
}

.textflex {
  display: flex;
  margin-top: 16rpx;
}

.msgtext3 {
  padding: 2rpx 8rpx 2rpx 8rpx;
  background: #ff9e02;
  border-radius: 4rpx;
  margin-right: 8rpx;
  font-size: 16rpx;
  color: #ffffff;
}

.msgtext4 {
  padding: 2rpx 8rpx 2rpx 8rpx;
  background: #5791f2;
  border-radius: 4rpx;
  margin-right: 8rpx;
  font-size: 16rpx;
  color: #ffffff;
}

.worksmsg {
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  background: #ffffff;
}

.uni-margin-border {
  width: 710rpx;
  margin: 0rpx 20rpx;
  border-bottom: 0.5rpx solid #eeeeee;
}

.uni-common-mt {
  margin-top: 2rpx;
}

.indi_oper {
  width: 48rpx;
  height: 8rpx;
  background-color: #1d56f9;
  position: absolute;
  top: 41%;
  left: 5.5%;
  border-radius: 30rpx;
}

.indi_oper1 {
  width: 48rpx;
  height: 8rpx;
  background-color: #1d56f9;
  position: absolute;
  top: 41%;
  left: 47%;
  border-radius: 30rpx;
}

.ind_center {
  width: 420rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep .segmented-control__item {
  flex: none !important;
}

:deep .segmented-control__item--text {
  border-bottom: 0rpx !important;
}
</style>
