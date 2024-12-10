<template>
  <view>
    <view>
      <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
      <view style="background: #f4f5f9">
        <view class="homePage">
          <view class="titleHome">
            <view class="nameId">
              <view class="head">
                <image
                  style="width: 88rpx; height: 88rpx; border-radius: 50%"
                  :src="userinfo.avatar"
                  mode="aspectFit"
                />
              </view>
              <view class="name">
                <text class="textname">{{ userinfo.nickname }}</text>
                <text class="textid">ID:{{ userinfo.show_id }}</text>
              </view>
            </view>
            <view class="buttonImg">
              <view class="btnimg1" @click="btnscan">
                <img src="@/static/img/saoma.png" alt="" />
              </view>
            </view>
          </view>
          <view class="posit">
            <img src="@/static/img/add.png" alt="" />
            <select
              style="border: none; background: #f4f5f9; outline: none"
              v-model="selectedValue"
              @change="handleChange"
            >
              <option disabled value="请选择校区">请选择校区</option>
              <option
                v-for="option in options"
                :key="option.id"
                :value="option"
              >
                {{ option.nickname }}
              </option>
            </select>
            <!-- 提示信息 -->
          </view>
        </view>
        <!-- 学生 -->
        <view class="homebox">
          <view class="box_img">
            <view class="box_img1" @click="info('我的学生')">
              <view class="img_text">我的学生</view>
            </view>
            <view class="box_img2" @click="info('布置作业')">
              <view class="img_text">布置作业</view>
            </view>
            <view class="box_img3" @click="info('批改作业')">
              <view class="img_text">批改作业</view>
            </view>
          </view>

          <view class="box_fun">
            <view class="fun-text"> 常用功能 </view>

            <view class="fun_icon">
              <view
                class="fun_icon1"
                v-for="(item, index) in funIcon"
                :key="index"
                @click="navigateToClassGroup(item)"
              >
                <view class="fun_icon2">
                  <img style="margin-top: 28rpx" :src="item.icon" alt="" />
                </view>
                <text>{{ item.title }}</text>
              </view>
              <view class="fun_icon1" style="position: relative">
                <view class="fun_icon2">
                  <SearchMore
                    v-if="isPC || !searchingStatus"
                    class="search-more"
                    :searchType="global"
                  />
                </view>
                <text>创建班级群</text>
                <view
                  style="
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                  "
                >
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSchoolList } from '@/utils/api'
import { onLoad } from '@dcloudio/uni-app'
import SearchMore from '../../TUIKit/components/TUISearch/search-more/index1.vue'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const userinfo = ref('')
const funIcon = ref([
  {
    title: '消息通知',
    icon: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng2070e2650397670fd064ef74f734a78b6e6818e71bca68465681d1ab221703d0',
  },
  // {
  //   title: '创建班级群',
  //   icon: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngeece69715878345df0c6289d76bff4f340297c393014cb486eb566bf98b6e279',
  // },
  {
    title: '添加好友',
    icon: 'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng2fc0fcd1d76e6345881d7afd24f27a37db1903759ebeae571bec079de6d5eb8f',
  },
])
// 跳转到班级群的页面
const navigateToClassGroup = (item) => {
  if (item.title === '消息通知') {
    // 跳转到创建班级群的页面
    uni.switchTab({
      url: '/pages/message/message',
    })
  }
  if (item.title === '创建班级群') {
    // 跳转到创建班级群的页面
    uni.navigateTo({
      url: '/pages/home/CreateGroup',
    })
  }
  if (item.title === '添加好友') {
    // 跳转到创建班级群的页面
    uni.navigateTo({
      url: '/pages/message/search',
    })
  }
}
const options = ref([])
const selectedValue = ref(null)
const handleChange = (event) => {
  // 获取选择的校区
  const selectedOption = options.value.find((option) => {
    return option.nickname === selectedValue.value.nickname
  })
  console.log(selectedOption)
  if (selectedOption) {
    uni.setStorageSync('selectedOptionId', selectedOption.id)
    console.log('当前选择的校区 ID:', selectedOption.id) // 打印校区 ID
  }
}
onMounted(async () => {
  try {
    const res = await getSchoolList()
    options.value = res.items
    // 如果 options 不为空，设置 selectedValue 为第一个选项
    if (options.value.length > 0) {
      selectedValue.value = options.value[0]
    }
  } catch (error) {
    console.error('获取数据失败：', error)
  }

  uni.getStorage({
    key: 'userinfo',
    success: (res) => {
      userinfo.value = res.data
    },
    fail: (err) => {
      console.error('获取本地存储失败', err)
    },
  })
  // 打印当前显示项的id
  if (selectedValue.value) {
    uni.setStorageSync('school_id', selectedValue.value.id)
  }
})
const btnscan = () => {
  console.log('扫上了')
  uni.scanCode({
    success: function (res) {
      console.log('条码类型：' + res.scanType)
      console.log('条码内容：' + res.result)
    },
  })
}
const info = (item) => {
  if (item === '我的学生') {
    uni.navigateTo({
      url: '/pages/home/myStudents',
    })
  } else if (item === '布置作业') {
    uni.navigateTo({
      url: '/pages/home/layout',
    })
  } else if (item === '批改作业') {
    uni.navigateTo({
      url: '/pages/home/setWork',
    })
  }
}
const toSchoolData = () => {
  uni.navigateTo({
    url: '/pages/home/schoolData',
  })
}
</script>

<style>
.homePage {
  /* position: fixed; */
  top: 0;
  left: 0;
  background: #f4f5f9;
  height: 150rpx;
  width: 710rpx;
  padding: 15rpx 20rpx 15rpx 20rpx;
}

.titleHome {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.nameId {
  width: 40%;
  display: flex;
  align-items: flex-start;
}

.timetextbox {
  display: flex;
  margin-top: 10rpx;
}

.timetextbox text {
  display: block;
  background-color: #f53c38;
  margin-right: 4rpx;
  color: #fff;
}

.name {
  display: grid;
  /* flex-direction: column; */
  margin-left: 16rpx;
  margin-right: 16rpx;
  height: 88rpx;
  align-content: space-evenly;
}

.buttonImg {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.textname {
  font-size: 28rpx;
}

.textid {
  font-size: 16rpx;
}

.posit {
  display: flex;
  align-items: center;
}

.postext {
  font-size: 16rpx;
}

.homebox {
  width: 710rpx;
  /* margin-top: 175rpx; */
  background: #ffffff;
  border-radius: 96rpx 0rpx 0rpx 0rpx;
  padding: 20rpx;
}

.box_img {
  width: 710rpx;
  display: grid;
  justify-items: center;
  gap: 40rpx;
  padding: 40rpx 0;
}

.box_img1 {
  width: 220rpx;
  height: 176rpx;
  background-image: url(https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/c2f2945a8c314207a53961a5d52f85b3_mergeImage.png);
  border-radius: 64rpx 16rpx 16rpx 16rpx;
  background-repeat: no-repeat;
}

.box_img2 {
  width: 220rpx;
  height: 176rpx;
  background-image: url(https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/a3d1689b40644d6c913973f4ce2f34eb_mergeImage.png);
  border-radius: 16rpx;
  background-repeat: no-repeat;
}

.box_img3 {
  width: 220rpx;
  height: 176rpx;
  background-image: url(https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/384562f39e2745e7b6e444317471b699_mergeImage.png);
  border-radius: 16rpx;
  background-repeat: no-repeat;
}

.img_text {
  width: 220rpx;
  text-align: center;
  color: #ffffff;
  margin-top: 18rpx;
}

.box_fun {
  width: 710rpx;
  margin-top: 28rpx;
  height: 280rpx;
  background: #f4f5f9;
  border-radius: 80rpx 16rpx 16rpx 16rpx;
}

.fun-text {
  font-size: 32rpx;
  line-height: 44rpx;
  padding: 20rpx 48rpx;
  font-weight: 600;
}

.fun_icon {
  width: 614rpx;
  height: 164rpx;
  margin-left: 48rpx;
  display: flex;
  justify-content: space-between;
}

.fun_icon1 {
  width: 128rpx;
  height: 164rpx;
  text-align: center;
}

.fun_icon2 {
  width: 128rpx;
  height: 122rpx;
  background: #e8ecfd;
  border-radius: 16rpx;
}

.fun_icon1 text {
  font-size: 24rpx;
}

.box_school {
  width: 710rpx;
  padding-bottom: 28rpx;
  margin-top: 48rpx;
  background: #f4f5f9;
  border-radius: 80rpx 16rpx 16rpx 16rpx;
}

.school_list {
  width: 614rpx;
  height: 240rpx;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 14rpx 0rpx rgba(0, 0, 0, 0.08);
  border-radius: 16rpx;
  margin-left: 48rpx;
  margin-top: 28rpx;
  display: flex;
}

.school_img {
  width: 320rpx;
  height: 240rpx;
  margin-right: 32rpx;
}

.school_text1 {
  font-size: 32rpx;
  line-height: 44rpx;
  margin-top: 18rpx;
}

.school_text2 {
  font-size: 24rpx;
  line-height: 34rpx;
  margin-top: 12rpx;
}

.school_text3 {
  width: 232rpx;
  height: 64rpx;
  background: rgba(29, 86, 249, 0.08);
  border-radius: 8rpx;
  border: 2rpx solid #1d56f9;
  margin-top: 48rpx;
  text-align: center;
  line-height: 64rpx;
  color: #1d56f9;
}
</style>
