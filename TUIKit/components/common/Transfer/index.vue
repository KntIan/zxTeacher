<template>
  <div
    class="transfer"
    :class="[!isPC ? 'transfer-h5' : '', isWeChat ? 'transfer-h5-wechat' : '']"
  >
    <header v-if="!isPC" class="transfer-header transfer-h5-header">
      <div v-if="!props.isHiddenBackIcon" @click="cancel1">
        <Icon class="icon" :file="backIcon" :width="'18px'" :height="'18px'" />
      </div>
      <span class="title">{{ transferTitle }}</span>
      <span class="space" />
    </header>
    <main class="main">
      <div class="left">
        <header class="transfer-header">
          <!-- PC triggers @keyup.enter -->
          <!-- <input
            v-if="isPC && isTransferSearch"
            type="text"
            :value="searchValue"
            :placeholder="TUITranslateService.t('component.请输入userID')"
            enterkeyhint="search"
            :class="[isUniFrameWork ? 'left-uniapp-input' : '']"
            @keyup.enter="handleInput"
          /> -->
          <!-- not PC triggers blur -->
          <!-- <input
            v-if="!isPC && isTransferSearch"
            type="text"
            :placeholder="TUITranslateService.t('component.请输入userID')"
            enterkeyhint="search"
            :value="searchValue"
            :class="[isUniFrameWork ? 'left-uniapp-input' : '']"
            @blur="handleInput"
            @confirm="handleInput"
          /> -->
        </header>
        <main class="transfer-left-main">
          <view>
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

                <!-- <view class="form-group">
                  <text class="form-label">班级群名称</text>
                  <input
                    v-model="groupName"
                    type="text"
                    placeholder="请输入班级名称"
                    class="form-input"
                  />
                </view> -->

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
                      <checkbox-group @change="selected(member)">
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
                <div>
                  <SelectFriend />
                </div>
                <!-- <view class="footer">
                  <button class="cancel-btn">取消</button>
                  <button class="confirm-btn" @click="navigateToGroupDetail">
                    完成
                  </button>
                </view> -->
              </view>
            </view>
          </view>
          <!-- <ul class="transfer-list">
            <li
              v-if="optional.length > 1 && !isRadio"
              class="transfer-list-item"
              @click="selectedAll"
            >
              <Icon
                v-if="transferSelectedList.length === optional.length"
                :file="selectedIcon"
                :width="'18px'"
                :height="'18px'"
              />
              <i v-else class="icon-unselected" />
              <span class="select-all">{{
                TUITranslateService.t('component.全选')
              }}</span>
            </li>
            <li
              v-for="item in transferList"
              :key="item.userID"
              class="transfer-list-item"
              @click="selected(item)"
            >
              <Icon
                v-if="transferSelectedList.indexOf(item) > -1"
                :file="selectedIcon"
                :class="[item.isDisabled && 'disabled']"
                :width="'18px'"
                :height="'18px'"
              />
              <i
                v-else
                :class="[item.isDisabled && 'disabled', 'icon-unselected']"
              />
              <template v-if="!isTransferCustomItem">
                <img
                  class="avatar"
                  :src="
                    item.avatar ||
                    'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'
                  "
                  onerror="this.onerror=null;this.src='https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                />
                <span class="name">{{ item.nick || item.userID }}</span>
                <span v-if="item.isDisabled"
                  >（{{ TUITranslateService.t('component.已在群中') }}）</span
                >
              </template>
              <template v-else>
                <slot name="left" :data="item" />
              </template>
            </li>
            <li
              v-if="transferTotal > transferList.length"
              class="transfer-list-item more"
              @click="getMore"
            >
              {{ TUITranslateService.t('component.查看更多') }}
            </li>
          </ul> -->
        </main>
      </div>
      <div class="right">
        <header v-if="isPC" class="transfer-header">
          {{ transferTitle }}
        </header>
        <!-- <ul v-if="resultShow" class="transfer-list">
          <p
            v-if="transferSelectedList.length > 0 && isPC"
            class="transfer-text"
          >
            {{ TUITranslateService.t('component.已选中')
            }}{{ transferSelectedList.length
            }}{{ TUITranslateService.t('component.人') }}
          </p>
          <li
            v-for="(item, index) in transferSelectedList"
            :key="index"
            class="transfer-list-item space-between"
          >
            <aside class="transfer-list-item-content">
              <template v-if="!isTransferCustomItem">
                <img
                  class="avatar"
                  :src="
                    item.avatar ||
                    'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'
                  "
                  onerror="this.onerror=null;this.src='https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                />
                <span v-if="isPC" class="name">{{
                  item.nick || item.userID
                }}</span>
              </template>
              <template v-else>
                <slot name="right" :data="item" />
              </template>
            </aside>
            <span v-if="isPC" @click="selected(item)">
              <Icon :file="cancelIcon" :width="'18px'" :height="'18px'" />
            </span>
          </li>
        </ul> -->
        <footer class="transfer-right-footer">
          <button class="btn btn-cancel" @click="cancel1">
            {{ TUITranslateService.t('component.取消') }}
          </button>
          <button
            v-if="transferSelectedList.length > 0"
            class="btn"
            @click="submit"
          >
            {{ TUITranslateService.t('component.完成') }}
          </button>
          <button v-else class="btn btn-no" @click="submit">
            {{ TUITranslateService.t('component.完成') }}
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, computed, onMounted } from 'vue'
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine'
import { ITransferListItem } from '../../../interface'
import Icon from '../Icon.vue'
import selectedIcon from '../../../assets/icon/selected.svg'
import backIcon from '../../../assets/icon/back.svg'
import cancelIcon from '../../../assets/icon/cancel.svg'
import { isPC, isUniFrameWork, isWeChat } from '../../../utils/env'
import { getMyClassList, getMyStudent } from '../../../../utils/api'
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  selectedList: {
    type: Array,
    default: () => [],
  },
  isSearch: {
    type: Boolean,
    default: true,
  },
  isRadio: {
    type: Boolean,
    default: false,
  },
  isCustomItem: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  resultShow: {
    type: Boolean,
    default: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  isHiddenBackIcon: {
    type: Boolean,
    default: false,
  },
})

const transferList = ref<ITransferListItem[]>([])
const transferTotal = ref<number>(0)
const transferSelectedList = ref<ITransferListItem[]>([])
const isTransferSearch = ref(true)
const isTransferCustomItem = ref(false)
const transferTitle = ref('')
const searchValue = ref('')

watchEffect(() => {
  if (props.isCustomItem) {
    for (let index = 0; index < props.list.length; index++) {
      if (
        (props.list[index] as any).conversationID.indexOf('@TIM#SYSTEM') > -1
      ) {
        // eslint-disable-next-line vue/no-mutating-props
        props.list.splice(index, 1)
      }
      transferList.value = props.list as ITransferListItem[]
    }
  } else {
    transferList.value = props.list as ITransferListItem[]
  }
  transferTotal.value = props.total ? props.total : props.list.length
  transferSelectedList.value = (
    props.selectedList && props.selectedList.length > 0
      ? props.selectedList
      : transferSelectedList.value
  ) as any
  isTransferSearch.value = props.isSearch
  isTransferCustomItem.value = props.isCustomItem
  transferTitle.value = props.title
})

const emit = defineEmits(['search', 'submit', 'cancel', 'getMore'])

const optional = computed(() =>
  transferList.value.filter((item: any) => !item.isDisabled)
)

const handleInput = (e: any) => {
  searchValue.value = e.target.value || e.detail.value
  emit('search', searchValue.value)
}

//选中
const selected = (item: any) => {
  console.log(item)
  if (item.isDisabled) {
    return
  }
  let list: ITransferListItem[] = transferSelectedList.value
  const index: number = list.indexOf(item)
  if (index > -1) {
    return transferSelectedList.value.splice(index, 1)
  }
  if (props.isRadio) {
    list = []
  }
  list.push(item)
  transferSelectedList.value = list
  console.log(transferSelectedList.value)
  uni.setStorageSync('transferSelectedList', transferSelectedList.value)
}

const selectedAll = () => {
  if (transferSelectedList.value.length === optional.value.length) {
    transferSelectedList.value = []
  } else {
    transferSelectedList.value = [...optional.value]
  }
}

const cancel = () => {
  emit('cancel')
  searchValue.value = ''
}

const getMore = () => {
  emit('getMore')
}

// ------------------------------
const statusBarHeight = ref()
// onLoad(() => {
//   statusBarHeight.value = getApp().globalData.top
// })

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

  // emit('search', members.value)
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
const submit = () => {
  console.log(111)
  emit('submit', transferSelectedList.value)
  searchValue.value = ''
}
const navigateToGroupDetail = () => {
  const selectedMembers = members.value.filter((member) => member.checked) // 筛选已选中的成员

  const groupDetails = {
    name: groupName.value, // 群组名称
    // admins: adminList.value.map((admin) => admin.avatar), // 管理员的头像
    members: selectedMembers.map((member) => member.id), // 想要传递的成员头像
  }
  uni.setStorageSync('groupDetails', groupDetails)
  console.log('群详情:', groupDetails)

  // 使用uni.navigateTo进行跳转并传递参数
  // uni.navigateTo({
  //   url: `/pages/message/groupDetails?name=${encodeURIComponent(
  //     groupDetails.name
  //   )}&admins=${encodeURIComponent(
  //     JSON.stringify(groupDetails.admins)
  //   )}&members=${encodeURIComponent(JSON.stringify(groupDetails.members))}`,
  // })
}
const cancel1 = () => {
  uni.switchTab({
    url: '/pages/home/home', // 路径需根据你的实际页面路径进行修改
  })
}
onMounted(() => {
  loadMyClassList()
})
</script>

<style lang="scss" scoped src="./style/transfer.scss"></style>
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
  //   width: 100%;
  height: 80rpx;
  background: #eeeeee;
  border-radius: 40rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #666666;
  padding: 0 80rpx;
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
.dialog-h5 .dialog-main-content {
  text-align: left !important;
}
</style>
