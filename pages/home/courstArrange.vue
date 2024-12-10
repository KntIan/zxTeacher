<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="student_Title">
        <view class="studentImg" @click="courst_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="student_text">课程安排</view>
        <view class="student_text1" @click="showPopup">添加课程</view>
      </view>

      <view class="line_title">课程表</view>

      <timeline>
        <view
          class="line_list"
          v-for="(item, index) in infolist"
          :key="item.id || index"
          @click="showDelete(item.id)"
        >
          <timelineItem
            class="list_box_cour"
            :title="item.title"
            :room="item.classroom"
            color="#5791F2"
          >
            <view :class="item.isShow ? 'tips_active' : 'tips'">
              <view>主讲: {{ item.teacher_name }}</view>
              <view
                style="
                  font-weight: 400;
                  font-size: 24rpx;
                  color: #333333;
                  margin-top: 40rpx;
                "
              >
                {{ item.start_date }} {{ item.s_time }} - {{ item.e_time }}
              </view>
            </view>
          </timelineItem>
          <view
            class="line_img"
            v-show="item.isShow"
            @click.stop="deleteCourse(item.id)"
          >
            <img
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng7eb852bda7c4e73c6ed39cf59ffc9bc1b5a3702452afa66581da234b94130789"
              alt=""
            />
          </view>
        </view>
      </timeline>

      <uni-popup :mask-click="false" ref="inputDialog" type="dialog">
        <uni-popup-dialog
          ref="inputClose"
          mode="input"
          title="输入内容"
          placeholder="添加课程"
          :before-close="true"
          @confirm="dialogInputConfirm"
          @close="dialogclose"
        >
          <uni-datetime-picker
            v-model="datetimerange"
            type="datetimerange"
            rangeSeparator="至"
          />
          <input
            v-model="classRoom"
            type="text"
            :placeholder="classRoom ? '' : '输入教室'"
            @focus="handleFocus('classRoom')"
            @blur="handleBlur('classRoom')"
          />
          <input
            v-model="teacher_name"
            type="text"
            :placeholder="teacher_name ? '' : '输入授课老师'"
            @focus="handleFocus('teacher_name')"
            @blur="handleBlur('teacher_name')"
          />
          <view style="border-bottom: 1px solid #ccc" class="input">
            <picker
              class="pickerList"
              mode="multiSelector"
              :range="newCategotyDataList"
              :value="multiIndex"
              range-key="name"
              @change="bindPickerChange"
              @columnchange="pickerColumnchange"
            >
              <view class="">{{ select }}</view>
            </picker>
          </view>
        </uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue'
import timeline from '@/components/chenbin-timeline/timeLine.vue'
import timelineItem from '@/components/chenbin-timeline/timelineItem.vue'
import {
  getClassCourseTable,
  deleteClassCourseArrange,
  deleteStudentCourseArrange,
  getMyCourseChapterAll,
  addClassCourseArrange,
  getStudentCourseArrangeList,
  adjustStudentCourseArrange,
} from '@/utils/api'

export default {
  data() {
    return {
      infolist: [],
      classId: null,
      classRoom: '输入教室',
      teacher_name: '输入授课老师',
      multiIndex: [0, 0, 0],
      newCategotyDataList: [[], [], []],
      categoryArr: [],
      select: '请选择课程',
      matchedContent: null,
      datetimerange: [],
      isLoading: false,
      currentPage: 1,
      student_id: '',
      statusBarHeight: '',
      isStudentCourse: false,
    }
  },
  onLoad(options) {
    console.log(options)
    this.student_id = options.student_id
    this.classId = options.classly_id
    this.isStudentCourse = !!this.student_id
    this.statusBarHeight = getApp().globalData.top
  },
  onPullDownRefresh() {
    this.refreshData()
  },
  onReachBottom() {
    this.loadMoreData()
  },
  mounted() {
    this.loadData()
  },
  watch: {
    datetimerange(newval) {
      this.startTimestamp = new Date(newval[0]).getTime()
      this.endTimestamp = new Date(newval[1]).getTime()
    },
  },
  methods: {
    isStudent(item) {
      // 根据给定的条件，判断当前课程是班级课程还是学生课程
      // 假设您的数据中有一个字段可以帮助判断
      return !!item.student_id // 如果课程有 student_id，认为是学生课程
    },
    async refreshData() {
      this.currentPage = 1
      this.infolist = [] // 清空数据列表
      await this.loadData()
      uni.stopPullDownRefresh()
    },
    async loadMoreData() {
      if (this.isLoading) {
        uni.showToast({
          title: '没有更多数据了',
          icon: 'error',
          duration: 2000,
        })
      }
      if (this.isLoading) return

      this.isLoading = true
      this.currentPage++
      await this.loadData()
    },

    async loadData() {
      if (this.classId) {
        await this.loadClassCourse()
      } else {
        await this.loadStudentCourse()
      }
    },
    async loadClassCourse() {
      try {
        let res = await getClassCourseTable({
          page: this.currentPage,
          limit: 10,
          classly_id: this.classId,
        })
        // 去重逻辑
        const uniqueItems = res.items.filter((item) => {
          return !this.infolist.some(
            (existingItem) => existingItem.id === item.id
          )
        })
        this.infolist = this.infolist.concat(uniqueItems)
        this.isLoading = this.infolist.length >= res.total
      } catch (error) {
        console.error('加载班级课程失败:', error)
      }
    },
    async loadStudentCourse() {
      // if (!this.student_id) {
      //   uni.showToast({ title: '学生ID无效', icon: 'none' })
      //   return
      // }
      try {
        let res = await getStudentCourseArrangeList({
          page: this.currentPage,
          limit: 10,
          student_id: this.student_id,
        })
        // 去重逻辑
        const uniqueItems = res.items.filter((item) => {
          return !this.infolist.some(
            (existingItem) => existingItem.id === item.id
          )
        })
        this.infolist = this.infolist.concat(uniqueItems)
        this.isLoading = this.infolist.length >= res.total
      } catch (error) {
        console.error('加载学生课程失败:', error)
      }
    },

    handleFocus(fieldName) {
      this[fieldName] = ''
    },
    handleBlur(fieldName) {
      if (!this[fieldName]) this[fieldName] = this[fieldName]
    },
    async getMyCourseChapterAll() {
      try {
        const res = await getMyCourseChapterAll()
        this.categoryArr = res.items || []
        this.initPickerData()
      } catch (error) {
        console.error('获取课程章节失败:', error)
      }
    },
    initPickerData() {
      this.newCategotyDataList[0] = this.categoryArr.map((item) => item.title)
      this.updatePickerData()
    },
    updatePickerData() {
      const firstUnit = this.categoryArr[this.multiIndex[0]]?.unit || []
      this.newCategotyDataList[1] = firstUnit.map((item) => item.title)
      const secondUnit = firstUnit[this.multiIndex[1]]?.content || []
      this.newCategotyDataList[2] = secondUnit.map((item) => item.title)
    },
    pickerColumnchange(e) {
      if (e.detail.column === 0) {
        this.multiIndex[0] = e.detail.value
        this.updatePickerData()
      }
      if (e.detail.column === 1) {
        this.multiIndex[1] = e.detail.value
        this.updatePickerData()
      }
      if (e.detail.column === 2) {
        this.multiIndex[2] = e.detail.value
      }
    },
    bindPickerChange(e) {
      this.multiIndex = e.detail.value
      this.select = this.newCategotyDataList[2][this.multiIndex[2]]
      console.log(this.select)
      this.selectObj = this.newCategotyDataList[2][this.multiIndex[2]]
      this.findSelectedId()
    },
    findSelectedId() {
      const selectedTitle = this.select
      for (const category of this.categoryArr) {
        for (const unit of category.unit) {
          this.matchedContent = unit.content.find(
            (content) => content.title === selectedTitle
          )
          console.log(this.matchedContent, '++55')
          if (this.matchedContent) {
            return
          }
        }
      }

      this.matchedContent = null
    },
    async dialogInputConfirm() {
      if (!this.validateInput()) return

      const params = this.constructParams()
      const action = this.classId
        ? addClassCourseArrange
        : adjustStudentCourseArrange
      try {
        const response = await action(params)
        uni.showToast({ title: response.msg, icon: 'success' })
        // 添加课程成功后，调用刷新数据的方法
        await this.refreshData() // 刷新课程列表
        this.resetInputFields()
        this.$refs.inputDialog.close()
      } catch (error) {
        console.error('添加课程失败:', error)
        uni.showToast({ title: '课程添加失败', icon: 'none' })
      }
    },
    validateInput() {
      if (!this.datetimerange.length) {
        uni.showToast({ title: '请选择日期', icon: 'none' })
        return false
      }
      if (!this.classRoom || this.classRoom === '输入教室') {
        uni.showToast({ title: '请输入教室', icon: 'none' })
        return false
      }
      if (!this.teacher_name || this.teacher_name === '输入授课老师') {
        uni.showToast({ title: '请输入授课老师', icon: 'none' })
        return false
      }
      if (!this.selectObj) {
        uni.showToast({ title: '请选择课程', icon: 'none' })
        return false
      }
      return true
    },
    constructParams() {
      return {
        classly_id: this.classId ? this.classId : undefined,
        student_id: !this.classId ? this.student_id : undefined,
        s_time: this.startTimestamp / 1000,
        e_time: this.endTimestamp / 1000,
        classroom: this.classRoom,
        lesson_unit_content_id: this.matchedContent.id,
      }
    },
    resetInputFields() {
      this.datetimerange = []
      this.classRoom = '输入教室'
      this.teacher_name = '输入授课老师'
      this.select = '请选择课程'
    },
    showDelete(id) {
      this.infolist = this.infolist.map((item) =>
        item.id === id ? { ...item, isShow: !item.isShow } : item
      )
    },
    async deleteCourse(id) {
      const courseToDelete = this.infolist.find((item) => item.id === id)
      if (!courseToDelete) return // 如果找不到课程，直接返回

      const res = await uni.showModal({
        title: '确认删除',
        content: `确定要删除课程 "${courseToDelete.title}" 吗？`,
      })

      if (res.confirm) {
        try {
          let deleteAction = this.isStudentCourse
            ? deleteStudentCourseArrange
            : deleteClassCourseArrange
          let params = this.isStudentCourse
            ? { student_id: this.student_id, timetable_id: id }
            : { classly_id: this.classId, timetable_id: id }

          await deleteAction(params)
          // 从 infolist 中移除已删除的课程
          this.infolist = this.infolist.filter((item) => item.id !== id)
          console.log('课程删除成功')

          // 直接调用加载数据的方法，进行无感刷新
          await this.loadData() // 刷新课程列表
        } catch (error) {
          console.error('删除课程失败:', error)
          uni.showToast({ title: '删除课程失败', icon: 'none' }) // 提示用户
        }
      }
    },

    courst_goback() {
      uni.navigateBack()
    },
    showPopup() {
      this.$refs.inputDialog.open()
      this.getMyCourseChapterAll()
    },
    dialogclose() {
      this.$refs.inputDialog.close()
    },
  },
  components: {
    timeline,
    timelineItem,
  },
}
</script>

<style scoped>
::v-deep.cc_area_view {
  z-index: 186 !important;
}
::v-deep.cc_area_mask {
  z-index: 185 !important;
}

.add-course-popup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.input-group input {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-right: 10px;
}
.student_Title {
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

.line_title {
  font-size: 36rpx;
  line-height: 50rpx;
  margin-top: 96rpx;
  margin-left: 20rpx;
  font-weight: 600;
}

.timeline {
  padding: 30rpx !important;
}

.tips {
  height: 134rpx;
  font-weight: 500;
  font-size: 28rpx;
  color: #000000;
  /* margin-left: 315rpx; */
}

.tips_active {
  height: 134rpx;
  font-weight: 500;
  font-size: 28rpx;
  color: #000000;
  /* margin-left: 220rpx; */
  width: fit-content;
}

.line_list {
  position: relative;
  /* display: flex; */
}

.class_room {
  width: 95%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 5%;
  bottom: 45%;
}

.class_room_active {
  width: 78%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 5%;
  bottom: 45%;
}

.line_img {
  position: absolute;
  top: 3%;
  right: -30rpx;
  width: 94rpx;
  height: 92rpx;
  background: #e60909;
  text-align: center;
  line-height: 112rpx;
}
::v-deep.uni-dialog-content {
  display: grid !important;
  justify-content: unset !important;
  gap: 40rpx;
}
.uni-dialog-content uni-input {
  border-bottom: 1px solid #ccc !important;
}
::v-deep input,
.pickerList {
  color: #999 !important; /* 选择你想要的颜色 */
  opacity: 1; /* 确保不透明度为 1 */
  font-size: 28rpx !important;
}
</style>
