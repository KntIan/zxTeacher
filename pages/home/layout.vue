<template>
  <view>
    <view>
      <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>

      <form action="" method="post">
        <view class="lay_tag">
          <view class="">
            <text style="color: red">*</text>
            <text>开始时间</text>
          </view>
          <view class="lay_img"> </view>
          <view style="width: 60%">
            <uni-datetime-picker
              type="daterange"
              v-model="single"
              @change="dateTime"
            >
            </uni-datetime-picker>
          </view>
        </view>

        <view class="lay_tag" style="margin-top: 20rpx">
          <view class="">
            <text style="color: red">*</text>
            <text>选择班级</text>
          </view>
          <view>
            <picker
              @change="bindPickerChange"
              :value="index"
              :range="items.map((item) => item.title)"
            >
              <view class="uni-input">{{
                index >= 0 ? items[index]?.title : '请选择班级'
              }}</view>
              <!-- 当 items[index] 是 undefined 时，输出默认文本 -->
            </picker>
          </view>
        </view>

        <view class="lay_tag" style="margin-top: 20rpx">
          <view class="">
            <text style="color: red">*</text>
            <text>选择课时</text>
          </view>
          <view>
            <picker
              @change="bindPickerChangekeshi"
              :value="index1"
              :range="
                homeworkList
                  .map((item) => item.content_title)
                  .filter((title) => title)
              "
            >
              <view class="uni-input">{{
                index1 >= 0 ? homeworkList[index1]?.content_title : '选择课时'
              }}</view>
            </picker>
          </view>
        </view>

        <!-- 作业内容 -->
        <view class="lay_tag1">
          <view class="">
            <text style="color: red">*</text>
            <text>作业内容</text>
          </view>

          <view class="textare">
            <textarea
              v-model="textValue"
              placeholder-style="background: #F4F5F9; width: 670rpx; height: 132rpx;"
            />
          </view>

          <!-- <view class="lay_tag1img" @click="chooseImage">
        <img
          style="width: 100%; height: 100%"
          src="https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/e5923dca4d594da3abf115ee5a05cf14_mergeImage.png"
          alt=""
        />
      </view> -->
        </view>

        <!-- 班级选择 -->
        <view class="lay_tag1">
          <view class="">
            <text style="color: red">*</text>
            <text>参考视频</text>
          </view>

          <view
            style="
              width: 710rpx;
              margin-top: 20rpx;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid #ebebeb;
              line-height: 60rpx;
              margin-left: 60rpx;
              text-indent: 30rpx;
            "
          >
            <picker
              @change="bindPickerChangeVideo"
              :value="index2"
              :range="videoTitle.map((item) => item.title)"
            >
              <view class="uni-input">{{
                index2 >= 0 ? videoTitle[index2]?.title : '请选择'
              }}</view>
              <!-- 当 items[index] 是 undefined 时，输出默认文本 -->
            </picker>
          </view>

          <!-- 搜索框 -->
          <uni-search-bar
            style="margin-top: 20rpx; width: 710rpx; height: 80rpx"
            radius="50"
            cancelButton="none"
            placeholder="请输入要查找的学生"
            @confirm="search"
            v-model="searchValue"
            @input="input"
            @cancel="cancel"
            @clear="clear"
            @blur="search({ value: searchValue })"
          >
          </uni-search-bar>

          <view class="myStudent">
            <view
              class="myStudent_list"
              v-for="(item, index) in filteredStudents"
              :key="index"
            >
              <view class="myStudent_img">
                <!-- <img :src="item.avatar" alt="" /> -->
                <image :src="item.avatar" alt="" />
                <view>
                  {{ item.nickname }}
                </view>
              </view>
              <view class="check_icon" @click="myStudent_toggle(item.id)">
                <view class="check_icon1" v-show="item.isToggle"> </view>
              </view>
            </view>
          </view>

          <!-- <view
        style="
          width: 710rpx;
          margin-top: 20rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <view class="lay_tag1text"> 田园路校区-{{ classText }} </view>

        <view class="check_icon" @click="toggle">
          <view class="check_icon1" v-show="isToggle"> </view>
        </view>
      </view> -->
        </view>
      </form>

      <view class="tag-view">
        <uni-tag
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          class="unitag"
          :circle="true"
          text="取消"
          type="default"
        />
        <uni-tag
          class="unitag"
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          :circle="true"
          text="布置作业"
          type="primary"
          @click="setHomeworkData"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  setHomework,
  getMyStudentList,
  getHomeworkList,
  getMyCourseChapterAll,
} from '@/utils/api'
import { onLoad } from '@dcloudio/uni-app'

const single = ref([])
const start = ref(Date.now()) //开始时间
const end = ref(Date.now() + 300000000) //结束时间
const value = ref(0) //选择班级默认选中
const classText = ref('')
const dateValue = ref(0) //开始时间默认选中
const textValue = ref(' ')
const isToggle = ref(true) //是否勾选
const searchValue = ref('') //搜索框内容
const sex = ref([
  {
    value: 0,
  },
])
const range = ref([
  {
    value: 0,
    text: '书法一班',
  },
  {
    value: 1,
    text: '书法二班',
  },
  {
    value: 2,
    text: '书法三班',
  },
  {
    value: 2,
    text: '书法三班',
  },
  {
    value: 2,
    text: '书法三班',
  },
  {
    value: 2,
    text: '书法三班',
  },
  {
    value: 2,
    text: '书法三班',
  },
  {
    value: 2,
    text: '书法三班',
  },
])
const dateRange = ref([
  {
    value: 0,
    text: '',
  },
  {
    value: 1,
    text: '',
  },
])
const mystudents = ref([
  {
    id: 0,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳',
    isToggle: true,
  },
  {
    id: 1,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳',
    isToggle: true,
  },
  {
    id: 2,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳',
    isToggle: true,
  },
  {
    id: 3,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳',
    isToggle: true,
  },
  {
    id: 4,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳',
    isToggle: true,
  },
  {
    id: 5,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '王五',
    isToggle: false,
  },
  {
    id: 6,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '张三',
    isToggle: false,
  },
  {
    id: 7,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '李四',
    isToggle: false,
  },
  {
    id: 8,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '二麻子',
    isToggle: false,
  },
  {
    id: 9,
    img: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c05227c15cc3e583fbe8af777d512ad3c5dd22f9540376effbda59a5f162710',
    name: '刘易阳',
    isToggle: true,
  },
])
const items = ref([]) //班级
const myClassList = ref([]) //当前班级学生列表
const filteredStudents = ref([]) //过滤后的
const students_List = ref([])
const index = ref(-1)
const index1 = ref(-1)
const index2 = ref(-1)
const ketangId = ref(null)
const stuId = ref(null)
const font_ids = ref(null)
//课堂列表
const homeworkList = ref([])
//视频标题
const videoTitle = ref([])

const selectedIds = [] // 新增数组用于存储选中的 id
const selectedIdsString = [] // 新增数组用于存储选中的 id
// 返回上一级
const layout_goback = () => {
  uni.navigateBack()
}
// 班级选择框事件
const change = (e) => {
  if (e) {
    range.value.forEach((item, index) => {
      if (item.value === e.detail.value) {
        classText.value = item.text
      }
    })
  } else {
    classText.value = range.value[0].text
  }
}
// 时间选择框事件
const dateChange = (e) => {
  //在日历中展示开始时间与结束时间
  single.value = [dateRange.value[0].text, dateRange.value[1].text]
}
//日历
const dateTime = (e) => {
  if (e) {
    single.value = e
  }
  //日历的开始时间与结束时间在页面显示
  dateRange.value[0].text = single.value[0]
  dateRange.value[1].text = single.value[1]
}
// 是否为选中状态
const toggle = () => {
  isToggle.value = !isToggle.value
}

const myStudent_toggle = (id) => {
  myClassList.value.forEach((item, index) => {
    if (item.id === id) {
      item.isToggle = !item.isToggle
      stuId.value = item.id
      console.log('xuanzhongxueh', stuId.value)

      // 如果当前项被选中，添加到数组中；否则从数组中移除
      if (item.isToggle) {
        if (!selectedIds.includes(item.id)) {
          selectedIds.push(item.id)
        }
      } else {
        const idIndex = selectedIds.indexOf(item.id)
        if (idIndex > -1) {
          selectedIds.splice(idIndex, 1)
        }
      }
    }
  })
  console.log('Selected IDs:', selectedIds) // 打印当前选中的 id 数组
  // 将选中的 id 以逗号拼接成字符串
  selectedIdsString.value = selectedIds.join(',')
  console.log('Selected IDs:', selectedIdsString) // 打印拼接后的字符串
}

const bindPickerChange = (e) => {
  index.value = e.detail.value
  if (items.value && items.value[index.value]) {
    const selectedClassId = items.value[index.value].id // 获取选中班级 ID
    console.log('选中班级的 ID:', selectedClassId)
    getHomeworkListData(selectedClassId)
  } else {
    console.error('选中的班级无效或未定义')
  }
}
const bindPickerChangekeshi = (e) => {
  index1.value = e.detail.value
  if (homeworkList.value && homeworkList.value[index.value]) {
    ketangId.value = homeworkList.value[index1.value].id // 获取选中班级 ID
    console.log('选中班级的 ID:', ketangId.value)
    // getHomeworkListData(selectedClassId)
  } else {
    console.error('选中的班级无效或未定义')
  }
}
const bindPickerChangeVideo = (e) => {
  index2.value = e.detail.value
  if (videoTitle.value && videoTitle.value[index.value]) {
    font_ids.value = videoTitle.value[index2.value].id // 获取选中班级 ID
    console.log('选中shipin ID:', font_ids.value)
    // getHomeworkListData(selectedClassId)
  } else {
    console.error('选中的班级无效或未定义')
  }
}
const videoGroup = async () => {
  try {
    let videoGro = await getMyCourseChapterAll() // Fetch the data
    // console.log(videoGro) // Check the structure
    // Extract the titles and IDs
    const titlesAndIds = videoGro.items.flatMap((item) =>
      item.unit.flatMap((unit) =>
        unit.content.map((content) => ({
          id: content.font_ids,
          title: content.title,
        }))
      )
    )
    videoTitle.value = titlesAndIds
    // console.log('Content IDs and Titles:', titlesAndIds) // Output extracted data
  } catch (error) {
    console.error('Failed to get course chapters:', error)
  }
}
const myClassStudentList = async () => {
  //   return  new Promise((resolve, reject) => {
  let params = {
    school_id: uni.getStorageSync('school_id'),
  }
  // 调用 API
  let res = await getMyStudentList(params)
  //   .then((res) => {
  students_List.value = Array.isArray(res.items)
    ? res.items
    : Object.values(res.items) // 确保转换为数组
  myClassList.value = students_List.value.flatMap((obj) =>
    obj.students.map((student) => ({
      ...student, // 保持原有学生信息
      isToggle: false, // 新增属性并设置为 false
    }))
  )
  items.value = students_List.value.map((item) => ({
    id: item.classly_id, // 班级 ID
    title: item.classly_title, // 班级标题
  })) // 直接获取 classly_title 数组
  filteredStudents.value = [...myClassList.value]
  //   console.log(items.value, myClassList.value)
}
//课堂列表请求
const getHomeworkListData = async (classId) => {
  const param = {
    page: 1,
    limit: 10,
    classly_id: classId,
  }
  try {
    let res = await getHomeworkList(param)
    console.log(res)
    if (res && Array.isArray(res.items)) {
      homeworkList.value = res.items // 将项赋给 homeworkList
      console.log(homeworkList.value) // 输出 homeworkList 的值
    } else {
      console.error('返回的结果中没有有效的 items:', res) // 处理未包含 items 的情形
    }
  } catch (error) {
    console.error('获取作业列表失败:', error) // 错误处理
  }
}

const setHomeworkData = async () => {
  //提交作业数据对象
  let subHomework = {
    uids: selectedIdsString.value,
    content: textValue.value,
    finish_time: new Date(single.value[1]).getTime() / 1000,
    lesson_classly_record_id: ketangId.value,
  }
  // 校验内容和必要字段
  console.log(selectedIdsString.value, '+++++')
  if (!selectedIdsString.value) {
    uni.showToast({
      title: '请选择学生',
      icon: 'none',
    })
    return // 阻止提交
  }

  if (!textValue.value || textValue.value.trim().length === 0) {
    uni.showToast({
      title: '作业内容不能为空',
      icon: 'none',
    })
    return // 阻止提交
  }

  if (!ketangId.value) {
    uni.showToast({
      title: '请选择课时',
      icon: 'none',
    })
    return // 阻止提交
  }
  try {
    let res = await setHomework(subHomework)
    console.log(res)
    if (res.code === 1) {
      uni.showToast({
        title: res.msg,
        icon: 'success',
      })
      uni.navigateBack()
    } else {
      uni.showToast({
        title: res.msg,
        icon: 'error',
      })
    }
  } catch (error) {}
}
onLoad(() => {})
onMounted(() => {
  myClassStudentList()
  videoGroup()
  change()
  //初始化页面时间
  dateTime()
  dateChange()
})

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      console.log(JSON.stringify(res.tempFilePaths))
    },
  })
}
// 输入框
const search = (res) => {
  if (res.value) {
    uni.showToast({
      title: '搜索：' + res.value,
      icon: 'none',
    })
    // 实现查找逻辑，如过滤学生数组
    // e.g. const filteredStudents = mystudents.value.filter(student => student.name.includes(res.value));
    filteredStudents.value = myClassList.value.filter((student) =>
      student.nickname.includes(res.value)
    )
    console.log(filteredStudents.value)
  } else {
    uni.showToast({
      title: '请输入学生姓名',
      icon: 'none',
    })
    filteredStudents.value = [...myClassList.value]
  }
}
const input = (res) => {
  console.log('----input:', res)

  // 检查 res.value 是否为空
  if (!res.value || res.value.trim() === '') {
    // 当输入为空时，重新赋值 filteredStudents 为 myClassList 的副本
    filteredStudents.value = [...myClassList.value]
  }
}
const clear = (res) => {
  uni.showToast({
    title: 'clear事件，清除值为：' + res.value,
    icon: 'none',
  })
}
const cancel = (res) => {
  uni.showToast({
    title: '点击取消，输入值为：' + res.value,
    icon: 'none',
  })
}
</script>

<style>
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

.lay_tag {
  width: 710rpx;
  margin-left: 20rpx;
  margin-top: 106rpx;
  padding-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.5rpx solid #f4f5f9;
}

.lay_tag1 {
  width: 710rpx;
  margin-left: 20rpx;
  margin-top: 28rpx;
  padding-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.lay_img {
  width: 14rpx;
  height: 4rpx;
  background: #000000;
  border-radius: 2rpx;
  position: absolute;
  top: 2.5%;
  right: 31%;
}

.textare {
  margin-top: 20rpx;
  width: 710rpx;
  height: 172rpx;
  background: #f4f5f9;
  padding: 20rpx;
}

.lay_tag1img {
  width: 710rpx;
  height: 360rpx;
  background: #f4f5f9;
  margin-top: 16rpx;
}

.lay_tag1text {
  width: 640rpx;
  height: 112rpx;
  background: #f4f5f9;
  border-radius: 16rpx;
  font-size: 32rpx;
  line-height: 112rpx;
  text-align: center;
  margin-right: 26rpx;
}

.check_icon {
  width: 28rpx;
  height: 28rpx;
  border: 2rpx solid #1d56f9;
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.check_icon1 {
  width: 16rpx;
  height: 16rpx;
  background: #1d56f9;
  border-radius: 15rpx;
}

.layout_input1 {
  height: 80rpx;
  padding-left: 36rpx;
  background: #eeeeee;
  border-radius: 40rpx;
  margin-top: 16rpx;
}

.layout_input1 image {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  top: 0%;
}

.myStudent {
  margin-top: 20rpx;
  margin-left: -12rpx;
  width: 722rpx;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}

.myStudent_list {
  display: flex;
  margin-bottom: 20rpx;
  margin-left: 12rpx;
}

.myStudent_img {
  width: 100rpx;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.myStudent_img image {
  width: 88rpx;
  height: 88rpx;
}

.tag-view {
  margin: 20rpx;
  margin-top: 160rpx;
  padding-bottom: 60rpx;
  width: 710rpx;
  display: flex;
  justify-content: space-around;
}

.unitag {
  width: 288rpx;
  height: 80rpx;
  text-align: center;
}

:deep .uni-searchbar[data-v-f07ef577] {
  padding: 0rpx !important;
}

:deep .checklist-box.is--tag.is-chcked {
  background-color: #f4f5f9 !important;
}

:deep
  .uni-data-checklist
  .checklist-group
  .checklist-box.is--tag[data-v-2f788efd] {
  margin-right: 0rpx !important;
  margin-left: 16rpx !important;
}

:deep .is-checked[data-v-2f788efd] {
  background-color: rgba(29, 86, 249, 0.08) !important;
  color: #2979ff !important;
}

:deep .uni-data-checklist .checklist-group[data-v-2f788efd] {
  justify-content: space-between !important;
}

:deep .is-checked .checklist-text[data-v-2f788efd] {
  color: #2979ff !important;
}
</style>
