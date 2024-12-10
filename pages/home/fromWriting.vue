<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="fromWriting_tag">
        <view class="fromWriting_SP">
          <text style="color: rgba(255, 0, 0, 1)">*</text>
          <text>历史收藏:</text>
        </view>
        <view
          class="fromWriting_icon"
          v-for="(item, index) in fromWritingList"
          :key="index"
        >
          <text>{{ item.content }}</text>
          <uni-icons
            :type="item.isFavorited ? 'star-filled' : 'star'"
            color="#1D56F9"
            size="25"
            @click="toggleFavorite(index)"
          />
        </view>
      </view>

      <view class="fromWriting-view">
        <uni-tag
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          class="unitag"
          :circle="true"
          text="取消"
          type="default"
          @click="fromWriting_goback"
        />
        <uni-tag
          @click="deleteFavorites"
          class="unitag"
          style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
          :circle="true"
          text="完成"
          type="primary"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCommentList, deleteComment } from '@/utils/api'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
const isFavorited = ref(false)
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const textareaValue = ref('')
const favoriteIds = ref([])
const clickCounts = ref({}) // 用于跟踪每个 ID 的点击次数
const fromWritingList = ref([
  {
    id: 0,
    title: '1.哇,今天进步很大哦,继续加油',
  },
  {
    id: 0,
    title: '1.哇,今天进步很大哦,继续加油',
  },
  {
    id: 0,
    title: '1.哇,今天进步很大哦,继续加油',
  },
  {
    id: 0,
    title: '1.哇,今天进步很大哦,继续加油',
  },
])
// 返回上一级
const fromWriting_goback = () => {
  uni.navigateBack()
}
const textValue = (e) => {
  textareaValue.value = e.detail.value
}
const addFromWriting = () => {
  console.log(textareaValue.value)
}
const CommentList = async () => {
  try {
    let res = await getCommentList()
    console.log(res) // 获取到的数据
    fromWritingList.value = res.data.items.map((item) => ({
      ...item,
      isFavorited: true,
    }))
  } catch (error) {}
}

const toggleFavorite = (index) => {
  const item = fromWritingList.value[index]
  item.isFavorited = !item.isFavorited // 切换对应项的是否收藏状态
  console.log('当前收藏状态:', item.isFavorited)
}
// 删除收藏的评论
// 删除收藏的评论
const deleteFavorites = async () => {
  try {
    // 获取所有被取消收藏的评论的 ID
    const idsToDelete = fromWritingList.value
      .filter((item) => item.isFavorited === false) // 筛选出未被收藏的项目
      .map((item) => item.id) // 提取 ID

    if (idsToDelete.length > 0) {
      const idString = idsToDelete.join(',') // 将 ID 数组拼接为字符串
      console.log(idString) // 输出拼接后的字符串
      let res = await deleteComment({ remark_ids: idString })
      if (res.code === 1) {
        uni.showToast({
          title: res.msg,
          icon: 'success',
          mask: true,
        })
        // 重新获取评论列表以更新状态
        CommentList()
        uni.navigateBack()
      }
    } else {
      uni.showToast({
        title: '没有需要删除的收藏',
        icon: 'none',
        mask: true,
      })
    }
  } catch (error) {
    console.error('删除收藏时发生错误:', error)
  }
}

onMounted(() => {
  CommentList()
})
</script>

<style>
.fromWriting_Title {
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

.fromWriting_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.fromWriting_tag {
  width: 710rpx;
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.fromWriting_tag1 {
  width: 80rpx;
  height: 40rpx;
  font-weight: 400;
  background: #ff9e02;
  border-radius: 4rpx;
  font-size: 20rpx;
  text-align: center;
  line-height: 40rpx;
  color: #ffffff;
}

.fromWriting_SP {
  width: 710rpx;
  font-weight: 600;
}

.fromWriting_res {
  width: 710rpx;
  height: 164rpx;
  background: #f1f1f1;
  border-radius: 8rpx;
  padding: 15rpx;
  margin-top: 15rpx;
  font-size: 28rpx;
}

.fromWriting_icon {
  width: 710rpx;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  padding: 0 24rpx;
}

.fromWriting-view {
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
