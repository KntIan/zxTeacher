<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view class="container">
      <view class="privacy-settings">
        <view
          v-for="(option, index) in options"
          :key="index"
          class="settings-item"
        >
          <label>{{ option.text }}</label>
          <checkbox-group @change="(e) => handleChange(e, index)">
            <label>
              <checkbox
                class="checkbox"
                :value="option.text"
                :checked="option.checked"
              />
            </label>
          </checkbox-group>
        </view>
      </view>
      <button class="save-button" @click="saveSettings">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

// 定义选项
const options = ref([
  { text: '是否对好友显示手机号码', checked: false },
  { text: '是否对好友显示家庭住址', checked: false },
  { text: '是否允许APP获取定位权限', checked: false },
  { text: '是否允许APP使用录音权限', checked: false },
  { text: '是否允许APP获取摄像头权限', checked: false },
])

// 处理复选框状态变化
const handleChange = (e, index) => {
  // 使用索引更新选中状态
  options.value[index].checked = e.detail.value.length > 0
  console.log(`选中的状态：${options.value[index].checked}`) // 打印当前选中的状态
}

// 保存设置并返回上一页
const saveSettings = () => {
  try {
    const selectedOptions = options.value.filter((option) => option.checked)

    if (!selectedOptions.length) {
      console.warn('未选择任何选项，无法保存设置。')
      return
    }

    console.log('选中的设置：', selectedOptions) // 打印选中的设置
    uni.setStorageSync('privacySettings', selectedOptions)
    uni.navigateBack() // 返回上一页
  } catch (error) {
    console.error('保存设置时发生错误：', error) // 捕获并打印错误信息
  }
}
</script>

<style scoped>
.container {
  padding: 28rpx;
  padding-top: 0;
}

.settings-item {
  font-size: 28rpx;
  padding: 20rpx 0;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-item /deep/.uni-checkbox-input {
  border-radius: 50% !important;
  width: 28rpx;
  height: 28rpx;
}

.save-button {
  position: absolute;
  width: 288rpx;
  font-size: 36rpx;
  color: #000000;
  background: #f4f5f9;
  border-radius: 40rpx;
  bottom: 264rpx;
  left: 0;
  right: 0;
}

.save-button::after {
  border: none;
}
</style>
