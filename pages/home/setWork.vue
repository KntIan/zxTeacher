<template>
  <view>
    <view>
      <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
      <!-- <view class="student_Title">
        <view class="studentImg" @click="setWork_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="student_text"> 批改作业 </view>
      </view> -->

      <view class="setWorkmsg">
        <view class="uni-margin-border uni-common-mt">
          <uni-segmented-control
            class="uni_center"
            :current="current"
            :values="items.map((item) => item.classly_title)"
            active-color="#5791F2"
            styleType="text"
            @clickItem="onClickItem"
          />
          <!-- <view class="setWork_oper" v-if="current === 0"> </view>
        <view class="setWork_oper1" v-if="current === 1"> </view>
        <view class="setWork_oper2" v-if="current === 2"> </view> -->
        </view>
        <view v-for="(item, index) in homework_List" :key="index">
          <view class="classWork" @click="set_work(item.addtime)">
            <view>
              <image
                style="width: 710rpx; height: 240rpx"
                :src="item.sub_image"
                mode="aspectFill"
              />
            </view>
            <view style="padding: 16rpx; font-size: 36rpx">
              {{ item.content }}
            </view>

            <view class="class_text">
              <view
                >完成进度:<text style="color: red">{{ item.finished }}</text
                >/{{ item.total }}</view
              >
              <view style="display: flex; align-items: center">
                距离结束剩余:
                <uni-countdown
                  :hour="item.hours"
                  :minute="item.minutes"
                  :second="item.seconds"
                  color="#FFFFFF"
                  background-color="#007AFF"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHomeworkClassList, getHomeworkToBeCheckedList } from '@/utils/api'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const current = ref(0)
const selectedClassId = ref()
const items = ref(['书法一班', '书法二班', '书法三班']) //班级
const homework_List = ref([]) //班级+学生所有
const hours = ref(0) // 示例：当前页面
const minutes = ref(0) // 示例：每页数据条数
const seconds = ref(0) // 示例：是否是首页数据
const intervalId = ref(null)
const param = ref({
  limit: 10,
  page: 1,
})

// 返回上一级
const setWork_goback = () => {
  uni.navigateBack()
}
// 选择班级

const onClickItem = (index) => {
  selectedClassId.value = items.value[index.currentIndex].classly_id // 获取选中班级的 ID
  console.log('选中班级的 ID:', selectedClassId.value)
  waitHW(selectedClassId.value)
  // 根据需求使用 selectedClassId，例如加载对应班级的作业
  // getHomeworkListData(selectedClassId);
}
// 跳转到我的学生
const set_work = (addtime) => {
  uni.navigateTo({
    url: `/pages/home/studentWork?addtime=${addtime}`,
  })
}
const waitHW = async (id) => {
  param.value.classly_id = id
  // 获取待批改作业列表
  let res = await getHomeworkToBeCheckedList(param.value)
  //   console.log(res)
  homework_List.value = res.items.map((item) => ({
    ...item, // 保留原有信息
    timerId: null, //用于存储定时器ID
    hours: 0, // 增加时字段，初始化为0
    minutes: 0, // 增加分字段，初始化为0
    seconds: 0, // 增加秒字段，初始化为0
  }))
}
// 获取我的学生列表
const homeworkClassList = async () => {
  //   return  new Promise((resolve, reject) => {
  let params = {
    limit: 999,
    page: 1,
    school_id: uni.getStorageSync('school_id'),
  }
  // 调用 API
  let res = await getHomeworkClassList(params)
  items.value = res.items
  if (items.value.length > 0) {
    selectedClassId.value = items.value[current.value].classly_id // 获取初始选中的班级 ID
    console.log('初始选中班级的 ID:', selectedClassId.value)
  }
  waitHW(selectedClassId.value)
}
const updateCountdown = () => {
  const currentDateTimestampInMilliseconds = new Date().getTime()
  const now = Math.floor(currentDateTimestampInMilliseconds / 1000)

  homework_List.value.forEach((item) => {
    // const newItem = { ...item };
    if (!isNaN(item.finish_time)) {
      const timeDiff = item.finish_time - now

      if (timeDiff > 0) {
        item.hours = Math.floor(timeDiff / 3600)

        item.minutes = Math.floor((timeDiff % 3600) / 60)

        item.seconds = timeDiff % 60

        // 如果没有设置定时器ID，设置一个定时器
        if (!item.timerId) {
          item.timerId = setInterval(() => {
            updateCountdown() // 定时更新
          }, 1000)
        }
      } else {
        item.hours = item.minutes = item.seconds = 0 // 时间到达
        clearTimer(item) // 清除定时器
      }
      // console.log('Updated time for item:', item.hours, item.minutes, item.seconds);
    } else {
      item.hours = item.minutes = item.seconds = 0 // 处理无效时间
    }
    // console.log('Updated time:', item.hours, item.minutes, item.seconds);
    // return newItem;
  })
}
// 清除特定活动的定时器
const clearTimer = (item) => {
  //   console.log(item)
  if (item.timerId) {
    clearInterval(item.timerId) // 停止其他活动定时器
    item.timerId = null // 清除定时器ID
    console.log(`活动 ${item.id} 的定时器已清除，时间到达。`)
  }
}

// 启动计时的函数
const startCountdown = () => {
  updateCountdown() // 初始化倒计时
  intervalId.value = setInterval(updateCountdown, 1000) // 每秒更新一次
}
onMounted(() => {
  homeworkClassList()
  startCountdown()
  // 加载完成后，选择第一个班级的 ID
})
</script>

<style>
.student_Title {
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

.student_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.setWorkmsg {
  /* margin-top: 100rpx; */
  border-radius: 32rpx 32rpx 0rpx 0rpx;
  background: #ffffff;
}

.uni-margin-border {
  width: 710rpx;
  margin: 0rpx 20rpx;
  border-bottom: 0.5rpx solid #eeeeee;
}

/* .uni-common-mt {
  margin-top: 20rpx;
} */

.setWork_oper {
  width: 48rpx;
  height: 8rpx;
  background-color: #1d56f9;
  position: absolute;
  top: 5%;
  left: 7.5%;
  border-radius: 30rpx;
}

.setWork_oper1 {
  width: 48rpx;
  height: 8rpx;
  background-color: #1d56f9;
  position: absolute;
  top: 5%;
  left: 47%;
  border-radius: 30rpx;
}

.setWork_oper2 {
  width: 48rpx;
  height: 8rpx;
  background-color: #1d56f9;
  position: absolute;
  top: 5%;
  right: 7.5%;
  border-radius: 30rpx;
}

.uni_center {
  width: 710rpx;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
}
::v-deep.segmented-control__item {
  padding: 10px;
}
.classWork {
  width: 710rpx;
  margin: 20rpx;
  /* height: 376rpx; */
  background: #ffffff;
  box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(0, 0, 0, 0.08);
  border-radius: 8rpx;
}

.class_text {
  display: flex;
  justify-content: space-between;
  margin-left: 16rpx;
  margin-right: 16rpx;
  font-size: 20rpx;
}

.class_text1 {
  width: 32rpx;
  height: 32rpx;
  background: #f53c38;
  border-radius: 4rpx;
  color: #ffffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}

:deep .segmented-control__item[data-v-86aa1171] {
  flex: none !important;
}
:deep .segmented-control {
  overflow-x: scroll !important;
  scrollbar-width: none;
}

:deep .segmented-control__item--text {
  border-bottom: 0rpx !important;
}
</style>
