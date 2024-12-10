<template>
  <view>
    <view
      class="student"
      v-for="(item, index) in props.class_List"
      :key="index"
    >
      <view class="studentbox">
        <view class="studentbox2">
          <view class="studentbox_img">
            <!-- <img :src="item.head" alt="" /> -->
            <image :src="item.avatar" mode="" />
          </view>
          <view class="studentinter">
            <view class="studentbox_text1">
              {{ item.nickname }}-{{ item.school_title }}
            </view>
            <view class="studentbox_textcenter">
              <!-- 
						name:区分页面
						item.complete:判断学生作业是否已批改
						 -->
              <view
                :class="
                  props.name == 'studentWork'
                    ? !item.status
                      ? 'student_default'
                      : 'student_red'
                    : 'textcenter1'
                "
              >
                {{
                  props.name == 'studentWork'
                    ? !item.status
                      ? '已完成'
                      : '未完成'
                    : item.zx_classly_title
                }}
              </view>
              <view
                :class="item.status ? 'textcenter2_default' : 'textcenter2'"
              >
                {{
                  props.name == 'studentWork'
                    ? item.delayedMinutes
                    : item.age + '岁'
                }}
              </view>
            </view>
            <view class="studentbox_text2"> ID:{{ item.id }} </view>
          </view>
        </view>

        <view>
          <text
            class="studentbox_text3"
            @click="getInfo(item)"
            v-if="props.name != 'studentWork'"
            >查看信息</text
          >
          <text
            style="border: 0.5rpx solid #f59a23; color: #f59a23"
            class="studentbox_text3"
            @click="getInfo1(item.id)"
            v-if="props.name != 'studentWork'"
            >课程调整</text
          >
        </view>

        <view class="studentWork_box" v-if="props.name == 'studentWork'">
          <view
            :class="item.status ? 'studentWork_box1_ac' : 'studentWork_box1'"
            @click="isSet(item.id, item.status)"
          >
            {{ item.status ? '已批改' : '批改' }}
          </view>
          <view
            :class="!item.status ? 'studentWork_box1_ac' : 'studentWork_box2'"
          >
            <text @click="addDelay(item)">延迟 10 分钟</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { delayHomework } from '@/utils/api'
const props = defineProps({
  name: {
    type: String,
  },
  class_List: {
    type: Array,
    default: [],
  },
})

// 为每个学生添加延迟分钟数的属性
props.class_List.forEach((item) => {
  item.delayedMinutes = item.delayedMinutes || 0 // 初始化
  console.log(props.class_List)
})

const addDelay = (item) => {
  delayHomework({ homework_id: item.id }).then((res) => {
    if (res.code === 1) {
      item.delayedMinutes += 10 // 只增加点击项的延迟分钟数
    } else {
      uni.showToast({
        title: res.msg,
        icon: 'none',
        mask: true,
      })
    }
  })
}
const getInfo = (item) => {
  console.log(item)
  // 跳转并传参
  uni.navigateTo({
    url: '/pages/home/individualmsg',
    success: (res) => {
      res.eventChannel.emit('getInfo', { data: item })
    },
  })
}
const getInfo1 = (id) => {
  console.log(id)
  // 跳转并传参
  uni.navigateTo({
    url: `/pages/home/courstArrange?student_id=${id}`,
  })
}
const isSet = (id, status) => {
  console.log(id)
  if (id) {
    uni.navigateTo({
      url: `/pages/home/teacherSet?id=${id}&status=${status}`,
    })
  }
}
</script>

<style>
.studentbox_img {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.studentbox_img image {
  width: 88rpx;
  height: 88rpx;
}

.studentbox {
  padding: 28rpx 0rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.studentbox_text1 {
  font-weight: 500;
  font-size: 28rpx;
  color: #000000;
}

.studentbox_text2 {
  font-weight: 400;
  font-size: 16rpx;
  color: #000000;
}

.studentWork_box {
}

.studentWork_box1 {
  width: 200rpx;
  height: 64rpx;
  background-color: #1d56f9;
  border-radius: 8rpx;
  font-weight: 500;
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.studentWork_box1_ac {
  width: 200rpx;
  height: 64rpx;
  background-color: rgba(244, 245, 249, 1);
  border-radius: 8rpx;
  font-weight: 500;
  font-size: 28rpx;
  margin-bottom: 8rpx;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.studentWork_box2 {
  width: 200rpx;
  height: 64rpx;
  margin-top: 8rpx;
  border: 0.5rpx solid #1d56f9;
  border-radius: 8rpx;
  font-weight: 500;
  font-size: 28rpx;
  color: #1d56f9;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.studentbox_text3 {
  width: 160rpx;
  height: 40rpx;
  border: 0.5rpx solid #1d56f9;
  border-radius: 8rpx;
  font-weight: 500;
  font-size: 28rpx;
  color: #1d56f9;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rpx;
}

.studentbox2 {
  display: flex;
  align-items: center;
}

.studentinter {
  margin-left: 28rpx;
}

.student {
  border-bottom: 0.5rpx solid #f4f5f9;
}

.studentbox_textcenter {
  display: flex;
  margin: 8rpx 0rpx;
}

.student_red {
  height: 33rpx;
  background-color: red;
  border-radius: 4rpx;
  font-size: 16rpx;
  color: #ffffff;
  line-height: 33rpx;
  padding: 0rpx 8rpx;
  margin-right: 8rpx;
}

.student_default {
  height: 33rpx;
  background-color: rgba(244, 245, 249, 1);
  border-radius: 4rpx;
  font-size: 16rpx;
  line-height: 33rpx;
  padding: 0rpx 8rpx;
  margin-right: 8rpx;
}

.textcenter1 {
  height: 33rpx;
  background: #ff9e02;
  border-radius: 4rpx;
  font-size: 16rpx;
  color: #ffffff;
  line-height: 33rpx;
  padding: 0rpx 8rpx;
  margin-right: 8rpx;
}

.textcenter2 {
  height: 33rpx;
  width: 50rpx;
  background: #1d56f9;
  border-radius: 4rpx;
  font-size: 16rpx;
  color: #ffffff;
  line-height: 33rpx;
  text-align: center;
}

.textcenter2_default {
  height: 33rpx;
  width: 50rpx;
  background: rgba(244, 245, 249, 1);
  border-radius: 4rpx;
  font-size: 16rpx;
  line-height: 33rpx;
  text-align: center;
}
</style>
