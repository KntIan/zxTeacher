<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="container">
        <!-- <view class="header">
		<text class="title">创建班级群</text>
	  </view> -->

        <view class="form-group-input">
          <img
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng0ac4c131284679fa0f7412d62e239e026e1af50accd921fa8c94da8d9d529b26"
            alt=""
            class="btns_img"
          />
          <input
            type="text"
            placeholder="请输入要查找的学生"
            class="input1"
            prefix="search"
            @input="input_search"
          />
        </view>

        <view class="member-group">
          <text class="section-title">初始化成员</text>
          <view v-for="member in members" :key="member.id" class="member-item">
            <img :src="member.avatar" alt="" class="member-avatar" />

            <view class="member-info">
              <text class="member-name">{{ member.name }}</text>
              <view>
                <text class="member-class">班级: {{ member.class }}</text>
                <text class="member-age">年龄: {{ member.age }}</text>
              </view>
              <text class="member-id">ID: {{ member.id }}</text>
            </view>
            <checkbox
              class="checkbox"
              :value="member.checked"
              @change="(e) => (member.checked = e.detail.value)"
            />
          </view>
        </view>

        <view class="footer">
          <button class="cancel-btn">取消</button>
          <button class="confirm-btn">完成</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import EditableField from '@/components/EditableField/EditableField.vue'
import { onLoad } from '@dcloudio/uni-app'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const members = ref([
  {
    id: '00001',
    name: '刘易阳 - 田园路校区',
    age: '18',
    class: '1班',
    checked: false,
    avatar:
      'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng210a678caa6727ef5a40dea3ccabe6330c8f32c7a30df4d5c1390fc8b6c8bd8c',
  },
  {
    id: '00002',
    name: '刘易阳 - 田园路校区',
    age: '18',
    class: '1班',
    checked: false,
    avatar:
      'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng210a678caa6727ef5a40dea3ccabe6330c8f32c7a30df4d5c1390fc8b6c8bd8c',
  },
  {
    id: '00003',
    name: '刘易阳 - 田园路校区',
    age: '18',
    class: '1班',
    checked: false,
    avatar:
      'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng210a678caa6727ef5a40dea3ccabe6330c8f32c7a30df4d5c1390fc8b6c8bd8c',
  },
])
const handleSearch = (query) => {
  console.log('搜索内容:', query)
}
</script>

<style lang="less" scoped>
.container {
  padding: 28rpx;

  .header {
    text-align: center;
    margin-bottom: 20rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
    }
  }

  .search-box {
    margin-bottom: 20rpx;

    .search-input {
      width: 100%;
      padding: 10rpx;
      background: #f4f5f9;
      border-radius: 40rpx;
    }
  }

  .member-group {
    .member-item {
      display: flex;
      border-bottom: 2rpx solid #f4f5f9;
      height: 154rpx;
      margin-top: 30rpx;
      justify-content: space-between;

      /deep/ .uni-checkbox-input {
        border-radius: 50% !important;
        width: 28rpx;
        height: 28rpx;
      }

      .member-avatar {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        margin-right: 10rpx;
      }

      .member-info {
        margin-left: -240rpx;

        .member-name {
          font-weight: 500;
          font-size: 32rpx;
        }

        .member-class {
          font-size: 16rpx;
          color: #ffffff;
          background: #ff9e02;
          border-radius: 4rpx;
          padding: 4rpx;
        }

        .member-age {
          font-size: 16rpx;
          color: #ffffff;
          background: #1d56f9;
          border-radius: 4rpx;
          margin-left: 8rpx;
          padding: 4rpx;
        }

        .member-id {
          font-size: 24rpx;
          color: #333333;
        }
      }
    }
  }

  .form-group,
  .member-group {
    margin-bottom: 20rpx;

    .form-label,
    .section-title {
      margin-bottom: 10rpx;
      font-size: 28rpx;
      font-weight: bold;
    }

    .form-input {
      height: 80rpx;
      border-radius: 40rpx;
      background: #f0f0f0;
      font-size: 28rpx;
      color: #666666;
      margin: 28rpx 0;
      padding-left: 0.875rem;
    }

    .admin-list::-webkit-scrollbar,
    .member-list::-webkit-scrollbar {
      display: none;
    }

    .member-list {
      display: grid;
      grid-auto-columns: 230rpx;
      grid-auto-flow: column;
      overflow-x: auto;
      scrollbar-width: none;
      /* 隐藏滚动条（适用于 Firefox） */
      -ms-overflow-style: none;
      /* 隐藏滚动条（适用于 IE 和 Edge） */

      .admin-item {
        display: grid;
        justify-items: center;
        margin-right: 20rpx;

        .admin-avatar {
          width: 112rpx;
          height: 112rpx;
          border-radius: 16rpx;
          padding-bottom: 20rpx;
          padding-top: 28rpx;
          // margin-right: 10rpx;
        }

        .admin-name,
        .member-name,
        .member-id {
          font-size: 28rpx;
          color: #000000;
        }
      }
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;

    .cancel-btn,
    .confirm-btn {
      border-radius: 40rpx;
      background: rgba(29, 86, 249, 0.08);
      color: #1d56f9;
      text-align: center;
      border: 1rpx solid #1d56f9;
      line-height: 100rpx;
      font-size: 36rpx;
      padding: 0 108rpx;
    }

    .cancel-btn::after {
      border: none;
    }

    .cancel-btn {
      background: #f4f5f9;
      color: #000000;
      border: none;
    }
  }
}

.form-group-input {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 14rpx;
  margin-bottom: 48rpx;
}

.input1 {
  width: 100%;
  height: 80rpx;
  background: #eeeeee;
  border-radius: 40rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #666666;
  padding-left: 80rpx;
}

.btn {
  font-weight: 400;
  font-size: 28rpx;
  color: #666666;
  margin-left: 20rpx;
}

.btns_img {
  position: absolute;
  left: 5%;
}
</style>
