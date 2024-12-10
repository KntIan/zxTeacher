<template>
  <view>
    <view :style="{ height: statusBarHeight + 5 + 'px' }"></view>
    <view>
      <view class="student_Title">
        <view class="studentImg" @click="student_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="student_text"> 我的学生 </view>
        <view class="student_text1" @click="setCourst"> 课程安排 </view>
      </view>

      <view class="student_input">
        <img
          src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng649b7bed867631d9ece9717881d1574011430d801560c32350acb68472c03b90"
          alt=""
        />
        <input
          type="text"
          v-model="studentValue"
          @input="searchStudent"
          class="student_input1"
          placeholder="请输入要查找的学生"
        />
      </view>

      <view class="studentmsg">
        <view class="uni-margin-border uni-common-mt" v-if="classTitle">
          <scroll-view class="scroll-view-custom" scroll-x>
            <uni-segmented-control
              style="display: flex; gap: 8px"
              class="uni_center"
              :style="segmentedControlStyle"
              :current="current"
              :values="items"
              active-color="#5791F2"
              styleType="text"
              @clickItem="onClickItem"
            />
          </scroll-view>
        </view>
        <view class="class_student">
          <classList :class_List="myClassList" v-if="myClassList.length" />
          <view style="text-align: center" v-else> 请添加学生 </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getMyStudentList } from '@/utils/api'
import classList from '@/components/mystudents/classList.vue'
import { onLoad } from '@dcloudio/uni-app'

const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const studentValue = ref('')
const classTitle = ref(true)
const current = ref(0)
const items = ref([]) //班级
const myClassList = ref([]) //当前班级学生列表
const students_List = ref([])

const segmentedControlStyle = computed(() => {
  const itemWidth = 100 // 每个子项的宽度
  const spacing = 20 // 每个子项的间距
  return {
    width: `${(itemWidth + spacing) * items.value.length + spacing}px`,
    padding: '20px', // 样式中的填充
  }
})

onMounted(async () => {
  try {
    await myClassStudentList() // 等待数据加载完成
    if (students_List.value.length) {
      current.value = 0 // 设置默认班级索引为0
      myClassList.value = students_List.value[current.value].students // 设置对应班级的学生列表
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
  }
})

// 班级选择
const onClickItem = (e) => {
  const newIndex = e.currentIndex
  if (current.value !== newIndex) {
    current.value = newIndex
    myClassList.value = students_List.value[current.value]?.students || []
  }
}

// 跳转到课程安排
const setCourst = () => {
  const currentClassId = students_List.value[current.value]?.classly_id
  if (currentClassId) {
    uni.navigateTo({
      url: `/pages/home/courstArrange?classly_id=${currentClassId}`,
    })
  }
}

// 返回上一级
const student_goback = () => {
  uni.navigateBack()
}

// 获取我的学生列表
const myClassStudentList = async () => {
  const params = {
    school_id: uni.getStorageSync('school_id'),
  }

  try {
    const res = await getMyStudentList(params)
    students_List.value = Array.isArray(res.items)
      ? res.items
      : Object.values(res.items)

    myClassList.value = students_List.value.map((obj) => ({
      ...obj,
      students: obj.students.map((student) => {
        const schoolTitleParts = student.school_title.split('-')
        return {
          ...student,
          school_title: schoolTitleParts[2]?.trim() || student.school_title,
        }
      }),
    }))

    items.value = students_List.value.map((item) => item.classly_title)
  } catch (error) {
    console.error('获取学生列表失败:', error)
  }
}

// 查找学生
const searchStudent = (e) => {
  const query = studentValue.value
  classTitle.value = !query
  myClassList.value = []

  if (query) {
    students_List.value.forEach((item) => {
      myClassList.value.push(
        ...item.students.filter((student) => student.nickname.includes(query))
      )
    })
  } else {
    myClassList.value = students_List.value[current.value]?.students || []
  }
}
</script>

<style>
.scroll-view-custom {
  overflow-x: hidden; /* 隐藏横向滚动条 */
}

.scroll-view-custom::-webkit-scrollbar {
  display: none; /* 隐藏所有Webkit内核浏览器中的滚动条 */
}

/* 对于其他浏览器的滚动条隐藏 */
.scroll-view-custom {
  -ms-overflow-style: none; /* Internet Explorer和Edge */
  scrollbar-width: none; /* Firefox */
}

.student_Title {
  /* position: fixed; */
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

.student_text1 {
  position: absolute;
  right: 20rpx;
  font-size: 26rpx;
  color: #1d56f9;
}

.student_input {
  padding: 80rpx 20rpx 20rpx 20rpx;
  padding-bottom: 0rpx;
  position: relative;
}

.student_input img {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  left: 50rpx;
  margin-top: 40rpx;
}

.student_input1 {
  height: 80rpx;
  padding-left: 90rpx;
  background: #eeeeee;
  border-radius: 40rpx;
  margin-top: 16rpx;
}

.uni-margin-border {
  width: 710rpx;
  margin: 0rpx 20rpx;
  border-bottom: 0.5rpx solid #eeeeee;
}

.uni-common-mt {
  margin-top: 20rpx;
}

.uni_center {
  width: 710rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.class_student {
  padding: 20rpx;
}
</style>
