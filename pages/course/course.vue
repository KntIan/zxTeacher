<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="code_titlebox">
        <view class="course_input" style="position: relative">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng649b7bed867631d9ece9717881d1574011430d801560c32350acb68472c03b90"
            alt=""
          />
          <input
            type="text"
            class="course_input1"
            placeholder="关键字搜索"
            v-model="searchText"
            @blur="searchclassRoomt"
          />
        </view>
        <view class="coursetag" @click="twoTeachers"> 自定义双师课 </view>
      </view>

      <view class="coures_box">
        <view class="coures_box1">
          <view class="coures_icon"> </view>
          <text class="coures_icon_text">我的课程</text>
        </view>
        <!-- <text class="coures_icon_text1">更多</text> -->
      </view>

      <view class="coures_list">
        <view
          class="coures_list_box"
          v-for="(item, index) in filteredCourses"
          :key="index"
          @click="toLearn(item.id)"
        >
          <view class="coures_list_img">
            <image
              style="width: 100%; height: 100%"
              :src="item.thumb"
              mode=""
            />
          </view>
          <view class="coures_list_text">
            <view class="coures_list_text1">
              {{ item.title }}
            </view>
            <view class="coures_list_text2">
              <text style="font-size: 24rpx">讲师：</text>
              <text style="font-size: 24rpx">{{ item.teacher }}</text>
            </view>
            <view class="coures_list_text3"
              >更新时间: {{ item.update_time }}</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyCourseList } from '@/utils/api'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
const searchText = ref('')
const filteredCourses = ref([]) // 用来存放过滤后的课程列表
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const couresList = ref([
  {
    title: '硬笔书法初级教程',
    banner:
      'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/dc816513af1f46db819e8f48418d6da6_mergeImage.png',
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng7d702a4e7da9b391635249b3c4735c03661d6a790e8202042194d9742b9ba84e',
    date: '2024.07.08',
  },
  {
    title: '硬笔书法初级教程',
    banner:
      'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/dc816513af1f46db819e8f48418d6da6_mergeImage.png',
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng7d702a4e7da9b391635249b3c4735c03661d6a790e8202042194d9742b9ba84e',
    date: '2024.07.08',
  },
  {
    title: '硬笔书法初级教程',
    banner:
      'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/dc816513af1f46db819e8f48418d6da6_mergeImage.png',
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng7d702a4e7da9b391635249b3c4735c03661d6a790e8202042194d9742b9ba84e',
    date: '2024.07.08',
  },
  {
    title: '硬笔书法初级教程',
    banner:
      'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/dc816513af1f46db819e8f48418d6da6_mergeImage.png',
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng7d702a4e7da9b391635249b3c4735c03661d6a790e8202042194d9742b9ba84e',
    date: '2024.07.08',
  },
  {
    title: '硬笔书法初级教程',
    banner:
      'https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/dc816513af1f46db819e8f48418d6da6_mergeImage.png',
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng7d702a4e7da9b391635249b3c4735c03661d6a790e8202042194d9742b9ba84e',
    date: '2024.07.08',
  },
])
// 双师课堂
const twoTeachers = () => {
  uni.navigateTo({
    url: '/pages/course/classRoom',
  })
}
// 教程详情
const toLearn = (id) => {
  uni.navigateTo({
    url: `/pages/course/go_learn?id=${id}`,
  })
}
// 获取课程列表
const getMyCourse = async () => {
  try {
    const res = await getMyCourseList()
    couresList.value = res.items
    filteredCourses.value = res.items // 初始化时将所有课程显示出来
  } catch (error) {
    console.error(error)
  }
}
// 搜索函数
const searchclassRoomt = () => {
  const keyword = searchText.value.toLowerCase() // 转为小写以便于匹配
  filteredCourses.value = couresList.value.filter((item) => {
    return item.title.toLowerCase().includes(keyword) // 过滤匹配标题
  })
}
onMounted(() => {
  getMyCourse()
})
</script>

<style>
.code_titlebox {
  top: 0;
  background-color: #ffffff;
  width: 710rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  z-index: 999;
}

.course_input1 {
  width: 360rpx;
  height: 80rpx;
  background: #eeeeee;
  border-radius: 50rpx;
  padding-left: 80rpx;
}

.course_input img {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  top: 25%;
  left: 6%;
}

.coursetag {
  width: 240rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  border-radius: 70rpx;
  font-size: 28rpx;
  background-color: rgba(29, 86, 249, 1);
  color: #ffffff;
}

.coures_box {
  /* margin-top: 120rpx; */
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.coures_box1 {
  display: flex;
}

.coures_icon {
  width: 40rpx;
  height: 40rpx;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngd6866acb0a78a88e49b71db6ebd908a0264b7877352425126b2662a089977371)
    100% no-repeat;
  background-size: 100% 100%;
  margin-top: 2rpx;
  margin-right: 16rpx;
}

.coures_icon_text {
  font-size: 32rpx;
  font-weight: 600;
}

.coures_icon_text1 {
  font-size: 24rpx;
  color: rgba(102, 102, 102, 1);
}

.coures_list_box {
  width: 600rpx;
  display: flex;
  margin: 20rpx;
}

.coures_list_img {
  width: 300rpx;
  height: 240rpx;
  margin-right: 20rpx;
}

.coures_list_text {
  display: grid;
  flex-wrap: wrap;
  align-content: space-around;
}

.coures_list_text1 {
  font-size: 32rpx;
  font-weight: 600;
}

.coures_list_text2 {
  /* width: 64rpx; */
  /* text-align: center; */
}

.coures_list_text2 img {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50rpx;
}

.coures_list_text3 {
  width: 100%;
  font-size: 24rpx;
}
</style>
