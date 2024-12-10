<template>
  <!-- <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view>
      <view class="container">
        <view class="form-group-input">
          <picker
            @change="bindPickerChange"
            @columnchange="onColumnChange"
            :value="selectedIndex"
            :range="class_List_title"
          >
            <view class="input1">{{
              selectedIndex >= 0
                ? class_List[selectedIndex].classly_title
                : '请选择班级'
            }}</view>
          </picker>
        </view>

        <view class="form-group">
          <text class="form-label">班级群名称</text>
          <input
            v-model="groupName"
            type="text"
            placeholder="请输入班级名称"
            class="form-input"
          />
        </view>

        <view class="member-group">
          <text class="section-title">初始化成员</text>
          <view v-if="members.length > 0">
            <view
              v-for="member in members"
              :key="member.id"
              class="member-item"
            >
              <img :src="member.avatar" alt="" class="member-avatar" />
              <view class="member-info">
                <text class="member-name"
                  >{{ member.username }}-{{ member.school_title }}</text
                >
                <view>
                  <text class="member-class"
                    >班级: {{ member.classly_title }}</text
                  >
                  <text class="member-age">年龄: {{ member.age }}</text>
                </view>
                <text class="member-id">ID: {{ member.id }}</text>
              </view>
              <checkbox-group @change="onCheckboxChange(member)">
                <label>
                  <checkbox
                    class="checkbox"
                    :value="member.id"
                    :checked="member.checked"
                  />
                </label>
              </checkbox-group>
            </view>
          </view>
          <view v-else class="no-data"> 暂无学生，请选择班级 </view>
        </view>

        <view class="footer">
          <button class="cancel-btn">取消</button>
          <button class="confirm-btn" @click="navigateToGroupDetail">
            完成
          </button>
        </view>
      </view>
    </view>
  </view> -->
  <!-- <SelectFriend /> -->
  <TUIChat_t />
</template>

<script setup>
import TUIChat_t from '../../TUIKit/components/TUIConversation/index2.vue'
import TUICore, { TUIConstants } from '@tencentcloud/tui-core'
import TUIChatEngine, {
  TUITranslateService,
  TUIGroupService,
  TUIStore,
  StoreName,
} from '@tencentcloud/chat-uikit-engine'
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMyClassList, getMyStudent } from '@/utils/api'
import SelectFriend from '../../TUIKit/components/TUIContact/select-friend/index.vue'
const statusBarHeight = ref()
onLoad(() => {
  statusBarHeight.value = getApp().globalData.top
})

const groupName = ref('')
const adminList = ref([
  {
    id: '001',
    name: '教师主任徐天理',
    avatar:
      'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng4934646faef315a7f7b48a2f43caf65a5cf6317294752f2fd5c054dcc0ec6940',
  },
  {
    id: '002',
    name: '教育主任刘天空',
    avatar:
      'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng9ad507ff3bb15e034e8a145c1a2a0da57f3e19cdd72880174ace28e3979ee6da',
  },
  {
    id: '003',
    name: '校长张瞻洋',
    avatar:
      'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng210a678caa6727ef5a40dea3ccabe6330c8f32c7a30df4d5c1390fc8b6c8bd8c',
  },
  {
    id: '004',
    name: '校长张瞻洋',
    avatar:
      'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng210a678caa6727ef5a40dea3ccabe6330c8f32c7a30df4d5c1390fc8b6c8bd8c',
  },
])

const members = ref([])
const selectedIndex = ref(-1) // 初始选中的索引
const class_List = ref(null) //
const class_List_title = ref(null) //
const selectedClassId = ref(null) //
const input_search = (event) => {
  const query = event.detail.value.trim()
  console.log('搜索内容:', query)
}
const selectOptions = ref({
  isRadio: false,
  isNeedSearch: false,
  title: '',
})

const bindPickerChange = async (e) => {
  selectedIndex.value = e.detail.value
  const selectedClass = class_List.value[selectedIndex.value] // 获取选中的班级对象
  if (selectedClass) {
    selectedClassId.value = selectedClass.classly_id // 获取班级的ID
  }
  const stu_data = {
    classly_id: selectedClassId.value,
    school_id: uni.getStorageSync('school_id'),
  }
  let readonlyClassList = await getMyStudent(stu_data)

  readonlyClassList.items.forEach((item) => {
    // 将 "花园路校区" 从完整的 school_title 截取出来
    const segments = item.school_title.split('-')
    item.school_title = segments[segments.length - 1]
  })
  members.value = readonlyClassList.items
}
const onColumnChange = (e) => {
  console.log('Column changed:', e.detail.column, e.detail.value)
}
const onCheckboxChange = (member) => {
  if (!member) {
    console.error('未找到成员，无法更新选中状态')
    return
  }
  member.checked = !member.checked // 切换选中状态
  console.log(`选中的状态：${member.checked}`) // 打印当前选中的状态
  //执行getSelectedMembers
  getSelectedMembers()
}

//获取选中成员的头像
const getSelectedMembers = () => {
  const selectedMembers = members.value.filter((member) => member.checked)
  console.log('选中的成员:', selectedMembers)
  return selectedMembers.map((member) => member.id)
}

const loadMyClassList = async () => {
  try {
    const data = {
      school_id: uni.getStorageSync('school_id'),
    }

    let res = await getMyClassList(data)

    console.log(res)
    class_List.value = res.items
    class_List_title.value = res.items.map((item) => item.classly_title)
  } catch (e) {}
}

const navigateToGroupDetail = () => {
  const selectedMembers = members.value.filter((member) => member.checked) // 筛选已选中的成员

  const groupDetails = {
    type: 'TencentCloudChat.TYPES.GRP_PUBLIC',
    name: groupName.value, // 群组名称
    // admins: adminList.value.map((admin) => admin.avatar), // 管理员的头像
    members: selectedMembers.map((member) => member.id), // 想要传递的成员头像
  }
  uni.setStorageSync('groupDetails', groupDetails)
  console.log('群详情:', groupDetails)
  // 创建好友工作群
  // TUICore.callService({
  //   serviceName: TUIConstants.TUIGroup.SERVICE.NAME,
  //   method: TUIConstants.TUIGroup.SERVICE.METHOD.CREATE_GROUP,
  //   params: {
  //     title: TUITranslateService.t('TUIConversation.发起群聊'),
  //     groupDetails,
  //   },
  // })
  // 使用uni.navigateTo进行跳转并传递参数
  // uni.navigateTo({
  //   url: `/pages/message/groupDetails?name=${encodeURIComponent(
  //     groupDetails.name
  //   )}&admins=${encodeURIComponent(
  //     JSON.stringify(groupDetails.admins)
  //   )}&members=${encodeURIComponent(JSON.stringify(groupDetails.members))}`,
  // })
}

onMounted(() => {
  loadMyClassList()
})
</script>

<style lang="less" scoped>
.container {
  padding: 28rpx;

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
  .admin-group,
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

    .admin-list,
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
  // justify-content: center;
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
  line-height: 80rpx;
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
.uni-input {
  border: 1px solid;
}
</style>
