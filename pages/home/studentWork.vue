<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <!-- <view class="studentWork_Title">
        <view class="studentWorkImg" @click="studentWork_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="studentWork_text"> 我的学生 </view>
      </view> -->
      <view class="studentWork_list">
        <classList :name="name" :class_List="studentWork_List1" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import classList from '@/components/mystudents/classList.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getHomeworkToCheckList } from '@/utils/api'

const statusBarHeight = ref()

const name = ref('studentWork')
const opt = ref()
const studentWork_List1 = ref([
  {
    complete: false, //是否已批改
    head: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳-田园路校区',
    class: '书法一班',
    age: '11岁',
    id: '0000001',
  },
  {
    complete: true,
    head: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳-田园路校区',
    class: '书法一班',
    age: '11岁',
    id: '0000002',
  },
  {
    complete: true,
    head: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳-田园路校区',
    class: '书法一班',
    age: '11岁',
    id: '0000003',
  },
  {
    complete: true,
    head: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳-田园路校区',
    class: '书法一班',
    age: '11岁',
    id: '0000004',
  },
])
// 返回上一级
const studentWork_goback = () => {
  uni.navigateBack()
}
const studentWork_ = async () => {
  try {
    let param = {
      addtime: opt.value,
    }
    let res = await getHomeworkToCheckList(param)
    console.log(res)
    studentWork_List1.value = res.items.map((item) => {
      // 修改 item 的 nickname 字段，只保留校区名称
      item.nickname = item.nickname.split('-').slice(-1)[0] // 取最后一部分
      item.delayedMinutes = 0
      return item
    })
    console.log(studentWork_List1.value)
  } catch (e) {}
}
onShow(() => {
  // if (getCurrentPages().length > 1) {
  // 确保当前页面是堆栈中的最新一页
  studentWork_() // 每次页面显示时请求数据
  // }
})
onLoad((options) => {
  console.log(options)
  studentWork_()
  opt.value = options.addtime
  statusBarHeight.value = getApp().globalData.top
})
onMounted(() => {
  studentWork_()
})
</script>

<style>
.studentWork_Title {
  /* position: fixed;
  top: 0; */
  background-color: #ffffff;
  width: 710rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  z-index: 999;
}

.studentWork_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.studentWork_list {
  padding: 20rpx 20rpx 0 20rpx;
}
</style>
