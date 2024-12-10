<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="aiComments_Title">
        <view class="aiCommentsImg" @click="aiComments_goback">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
            alt=""
          />
        </view>
        <view class="aiComments_text"> AI辅写评语 </view>
      </view>

      <view class="aiComments_box"> {{ aiContent }}</view>

      <view class="aiComments_tag">
        <view class="aiComments_SP">
          <text style="color: rgba(255, 0, 0, 1)">*</text>
          <text>关键词描述:</text>
        </view>

        <textarea
          v-model="content"
          type="text"
          class="aiComments_res"
          placeholder=" 请输入关键词"
        />
      </view>

      <view class="aiComments_tag1">
        <!-- <view class="aiComments_SP1">
        <view class="">
          <text style="color: rgba(255, 0, 0, 1); font-weight: 600">*</text>
          <text>效果</text>
        </view>
        <text>扩写</text>
      </view> -->

        <view class="aiComments_SP1">
          <view class="">
            <text style="color: rgba(255, 0, 0, 1); font-weight: 600">*</text>
            <text>话术风格</text>
          </view>
          <picker
            @change="bindPickerChange"
            @columnchange="onColumnChange"
            :value="selectedIndex"
            :range="items"
          >
            <view class="uni-input">{{
              selectedIndex >= 0 ? items[selectedIndex] : '请选择风格'
            }}</view>
          </picker>
        </view>

        <view class="aiComments_SP1">
          <view class="">
            <text style="color: rgba(255, 0, 0, 1); font-weight: 600">*</text>
            <text>字数</text>
          </view>
          <input
            style="text-align: right"
            placeholder="请输入字数至少80字"
            type="number"
            min="80"
            @input="handleInput"
            @blur="handleBlur"
            v-model="value"
          />
        </view>
      </view>

      <view class="aiComments-view">
        <uni-tag
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          class="unitag"
          :circle="true"
          text="取消"
          type="default"
          @click="aiComments_goback"
        />
        <uni-tag
          class="unitag"
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          :circle="true"
          text="开始生成"
          type="primary"
          :disabled="isGenerating"
          @click="aiComments_edit"
        />
        <uni-tag
          class="unitag"
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          :circle="true"
          text="应用"
          type="primary"
          :disabled="!aiContent"
          @click="applyAiContent"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getAiComment } from '@/utils/api'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const items = ref([
  '自然地',
  '专业的',
  '有趣的',
  '正式的',
  '热情的',
  '有信息量的',
  '诙谐的',
])
const content = ref('')
const aiContent = ref('')
const value = ref(null)
const isGenerating = ref(false) // 是否正在生成
const selectedIndex = ref(0) // 初始选中的索引
const bindPickerChange = (e) => {
  selectedIndex.value = e.detail.value
}
const onColumnChange = (e) => {
  console.log('Column changed:', e.detail.column, e.detail.value)
}
const handleInput = (e) => {
  console.log(e)
  const inputValue = parseInt(e.detail.value) // 尝试将输入值转换为整数
  value.value = inputValue // 设置为有效的数字
}

const handleBlur = (e) => {
  console.log(e)
  const inputValue = parseInt(e.detail.value) // 重新获取输入框的值
  if (isNaN(inputValue) || inputValue < 80) {
    // 如果不是有效的数字或小于 80
    uni.showToast({
      title: '输入的字数不能小于80',
      icon: 'none',
    })
    value.value = null // 设置为 null 以清空输入
    e.target.value = '' // 清空输入框
  }
}
// 返回上一级
const aiComments_goback = () => {
  uni.navigateBack()
}
const aiComments_edit = async () => {
  if (isGenerating.value) return // 正在生成时不执行
  isGenerating.value = true // 设置为正在生成状态
  console.log(value.value)

  // 检查字数是否有效
  if (!value.value || value.value < 80) {
    uni.showToast({
      title: '请输入至少80字',
      icon: 'none',
    })
    isGenerating.value = false // 请求结束，恢复状态
    return // 终止函数，避免执行后续请求
  }

  try {
    let res = await getAiComment({
      content: String(content.value),
      tone: String(items.value[selectedIndex.value]),
      word_num: String(value.value),
    })
    console.log(res)
    aiContent.value = res.data // 保存生成的内容
  } catch (error) {
    console.error('生成AI内容时发生错误:', error)
  } finally {
    isGenerating.value = false // 请求完成后恢复状态
  }
}
const applyAiContent = () => {
  // 将生成内容传递给上一页面，可以通过 uni.setStorage 或 uni.navigateBack 的参数来传值
  uni.navigateBack({
    delta: 1, // 返回上一个页面
    success: function (res) {
      // 在此可以把生成的内容传递给上一个页面
      // 假设上一个页面已经通过 getStorage 的方式接收数据
      uni.setStorage({
        key: 'aiGeneratedContent',
        data: aiContent.value, // 将生成内容保存为 storage
      })
    },
  })
}
</script>

<style>
.aiComments_Title {
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

.aiComments_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.aiComments_box {
  width: 670rpx;
  min-height: 348rpx;
  margin: 0 20rpx;
  margin-top: 80rpx;
  background: #f4f5f9;
  border-radius: 4rpx;
  padding: 20rpx;
}

.aiComments_tag {
  width: 710rpx;
  margin-left: 20rpx;
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.aiComments_SP {
  width: 710rpx;
  font-weight: 600;
}

.aiComments_res {
  width: 710rpx;
  height: 164rpx;
  background: #f1f1f1;
  border-radius: 8rpx;
  padding: 15rpx;
  margin-top: 15rpx;
  font-size: 28rpx;
}

.aiComments_tag1 {
  width: 710rpx;
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.aiComments_SP1 {
  width: 710rpx;
  padding: 30rpx 0;
  border-bottom: 0.5rpx solid #f1f1f1;
  display: flex;
  justify-content: space-between;
}

.aiComments-view {
  margin: 60rpx 0 0rpx 20rpx;
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
</style>
