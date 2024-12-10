<template>
  <view style="margin-top: 30rpx">
    <scroll-view id="myScrollView" scroll-y="true">
      <view v-for="(item, index) in score_List" :key="index">
        <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
        <view class="teacherSet">
          <view class="teacherSetImg" @click="teacherSet_goback">
            <img
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng427bd6433cc6e0a8e82f63b3174b2c817dc9c299bd0c4414c8d258f46cf46f94"
              alt=""
            />
          </view>
          <view class="teacherSet_text"> 批改作业 </view>

          <view class="icon_2" @click="toWriting">
            <img
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng5dd79465bdb7fb5ec7fb1eacfa162e17377fd7105109a9afa872286e1edea3a9"
            />
          </view>
        </view>

        <view class="teacherbox2">
          <view class="teacherbox_img">
            <image
              style="width: 88rpx; height: 88rpx; border-radius: 50%"
              :src="item.avatar"
              mode="aspectFit"
            />
          </view>
          <view class="teacherinter">
            <view class="teacherbox_text1"
              >{{ item.username }} - {{ item.school_name }}
            </view>
            <view class="teacherbox_text2"> ID: {{ item.uid }} </view>
          </view>
        </view>
        <!-- <canvas
          style="width: 100vw"
          canvas-id="myCanvas"
          id="myCanvas"
          ref="myCanvas"
        /> -->
        <view class="ai_box" @click="toContent">
          <view style="width: 100%; height: 100%" v-if="isShow">
            <image
              style="width: 100%; min-height: 946rpx"
              :src="item.sub_image"
              mode="aspectFit"
            />
          </view>

          <view v-else>
            <view style="width: 100%; height: 500px">
              <canvas
                ref="myCanvas"
                canvas-id="myCanvas"
                id="myCanvas"
                :style="{ width: '100vw', height: canvasHeight + 'px' }"
                @tap="handleCanvasClick"
              >
              </canvas>
            </view>
          </view>
        </view>

        <view class="teacherSet_tag">
          <view style="font-weight: 600; margin-right: 20rpx">
            <text>评测:</text>
          </view>
          <view>
            <input
              style="font-size: 28rpx"
              placeholder="请输入分数"
              type="number"
              v-model="value"
            />
            <!-- <uni-data-checkbox
            style="font-size: 20rpx"
            mode="tag"
            v-model="value"
            :localdata="range"
            @change="change"
          ></uni-data-checkbox> -->
          </view>
        </view>

        <view class="teacherSet_tag">
          <view class="teacherSet_SP">
            <text>老师评语:</text>
            <view class="teacherSet_tag1" @click="toComments"> AI评语 </view>
          </view>

          <view style="position: relative">
            <textarea
              type="text"
              class="teacherSet_res"
              placeholder=" 请输入评语"
              v-model="comments"
              :maxlength="200"
            />
            <view class="teacherSet_icons" @click="favoriteComments">
              <uni-icons
                v-if="isFavorited"
                type="star-filled"
                color="#1D56F9"
                size="25"
              />
              <uni-icons v-else type="star" color="#1D56F9" size="25" />
            </view>
          </view>
        </view>

        <view class="teacherSet-view">
          <uni-tag
            style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
            class="unitag"
            :circle="true"
            text="AI评测"
            type="default"
            @click="ceping"
          />
          <uni-tag
            class="unitag"
            style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
            :circle="true"
            text="完成"
            type="primary"
            @click="finishHomework_sub"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {
  checkHomework,
  finishHomework,
  collectComment,
  fetchHomeworkAIReviewDetail,
} from '@/utils/api'
import { onReady } from '@dcloudio/uni-app'

export default {
  data() {
    return {
      statusBarHeight: null,
      isFavorited: false,
      score_List: [],
      range: [
        { value: 0, text: '优秀' },
        { value: 1, text: '良好' },
        { value: 2, text: '一般' },
      ],
      value: null,
      opt: null,
      imagePath: '',
      comments: null,
      aiGeneratedContent: '',
      token: null,
      chooseImageWidth: null,
      chooseImageHeight: null,
      canvasHeight: null,
      canvasWidth: null,
      comprehensiveLevel: '',
      token: null,
      pageMark: 0, // 卷面分
      canvasWidth: 0, // canvas 的宽度
      canvasHeight: 0, // canvas 的高度，根据图片比例动态设置
      chooseImageWidth: 0, // px
      chooseImageHeight: 0, // px
      ocrResults: null,
      wordMarks: null,
      scrollTop: 0,
      mouseX: 0,
      mouseY: 0,
      evaluationDesc: '',
      statusBarHeight: '',
      historyAi_id: '',
      originImg: null,
      userInfo: null,
      isShow: true,
      st: null,
    }
  },
  onShow() {
    if (uni.getStorageSync('aiGeneratedContent')) {
      this.comments = uni.getStorageSync('aiGeneratedContent') // 如果有值，赋值给 comments
    } else {
      this.comments = ''
    }
  },

  onLoad(options) {
    this.opt = options.id
    this.st = options.status
    // 检查状态，如果状态为1则请求AI评审详情

    if (this.st === '1') {
      this.isShow = false
      this.fetchAIReviewDetail(this.opt) // 调用请求方法
    }
    const systemInfo = uni.getSystemInfoSync()
    this.canvasWidth = systemInfo.windowWidth
  },

  methods: {
    change(newValue) {
      this.value = newValue.detail.value // 更新 checkbox 的值
    },
    teacherSet_goback() {
      uni.navigateBack()
    },
    toWriting() {
      uni.navigateTo({ url: '/pages/home/fromWriting' })
    },
    // toContent() {
    //   uni.navigateTo({ url: '/pages/home/setContent' })
    // },
    toComments() {
      uni.navigateTo({ url: '/pages/home/aiComments' })
    },
    async favoriteComments() {
      try {
        if (!this.comments) {
          uni.showToast({
            title: '评语不能为空',
            icon: 'error',
            mask: true,
          })
          return // 如果为空，直接返回
        }
        // 切换收藏状态
        this.isFavorited = !this.isFavorited

        if (this.isFavorited) {
          let res = await collectComment({ content: this.comments })
        }
      } catch (error) {
        console.error('发生错误:', error)
      }
    },
    async fetchAIReviewDetail(homeworkId) {
      try {
        const data = {
          homework_id: homeworkId,
        }
        const res = await fetchHomeworkAIReviewDetail(data)

        this.pageMark = JSON.parse(res.items[0].content).pageMark
        this.ocrResults = JSON.parse(res.items[0].content).ocrResults
        this.wordMarks = JSON.parse(res.items[0].content).wordMarks
        const imagePath = res.items[0].origin_img // 使用可选链操作符避免未定义的错误
        const ctx = uni.createCanvasContext('myCanvas')

        uni.getImageInfo({
          src: imagePath,
          success: (image) => {
            this.chooseImageWidth = image.width
            this.chooseImageHeight = image.height

            const aspectRatio = this.chooseImageHeight / this.chooseImageWidth // 计算图片宽高比
            this.canvasHeight = this.canvasWidth * aspectRatio
            this.imagePath = imagePath

            setTimeout(() => {
              this.drawImage()
              this.drawImageWithData()
            })
          },
        })
      } catch (error) {
        console.error('请求AI评审详情失败:', error)
      }
    },
    async finishHomework_sub() {
      try {
        const data = {
          homework_id: this.opt,
          mark: this.value,
          remark: this.comments,
        }
        const res = await finishHomework(data)
        if (res.code === 1) {
          uni.showToast({
            title: res.msg,
            icon: 'success',
            mask: true,
          })
          uni.navigateBack()
          // 清空存储中键值为 aiGeneratedContent 的内容
          uni.removeStorageSync('aiGeneratedContent')

          // 可以选择清空 comments
          this.comments = ''
        }

        // 点击完成时，如果是收藏状态则发送收藏请求
        if (this.isFavorited) {
          let collectRes = await collectComment({ content: this.comments })
        } else {
          console.log('取消收藏，不请求接口')
        }
      } catch (error) {}
    },
    async checkHomework_data() {
      try {
        const data = {
          homework_id: this.opt, // 作业ID
        }
        let res = await checkHomework(data)

        const imagePa = res.items[0].sub_image
        const ctx = uni.createCanvasContext('myCanvas')
        uni.getImageInfo({
          src: imagePa,
          success: (e) => {
            this.chooseImageWidth = e.width
            this.chooseImageHeight = e.height

            const aspectRatio = this.chooseImageHeight / this.chooseImageWidth // 计算图片宽高比
            this.canvasHeight = this.canvasWidth * aspectRatio

            this.imagePath = e.path

            // this.drawImageWithData()
          },
        })
        this.score_List = res.items.map((item) => {
          item.school_name = item.school_name.split('-').slice(-1)[0] // 取最后一部分
          item.delayedMinutes = 0
          return item
        })
      } catch (error) {}
    },
    getToken() {
      uni.getStorage({
        key: 'token',
        success: (res) => {
          this.token = res.data // 将获取的 token 存储到 data 属性中
        },
        fail: (err) => {
          console.error('获取 token 失败:', err)
        },
      })
    },
    async ceping() {
      this.isShow = false
      setTimeout(() => {
        this.drawImage()
      }, 100)
      this.uploadFile()
      // 下载文件
      // let fileUrl = this.imagePath
      // uni.downloadFile({
      //   url: fileUrl,
      //   success: (downloadFileRes) => {
      //     console.log(downloadFileRes, '++56')
      //     if (downloadFileRes.statusCode === 200) {
      //       // 下载成功，开始上传
      //       this.imagePath = downloadFileRes.tempFilePath // tempFilePath 是临时文件路径

      //       this.uploadFile()
      //     } else {
      //       // console.error('文件下载失败：', downloadFileRes)
      //       // uni.showToast({
      //       //   title: '文件下载失败',
      //       //   icon: 'none',
      //       // })
      //     }
      //   },
      //   fail: (err) => {
      //     console.error('下载请求失败：', err)
      //     uni.showToast({
      //       title: '下载请求失败',
      //       icon: 'none',
      //     })
      //   },
      // })
    },
    // 上传文件的方法
    uploadFile() {
      uni.uploadFile({
        url: 'http://admin.zexishuhua.com/api/common/detecthomework',
        filePath: this.imagePath,
        name: 'file',
        header: {
          token: `${this.token}`,
        },
        formData: {
          sdk: 'WordEvaluation',
          device_id: 'test_device_id', // 随便填
          isCheckExamNum: 'false',
          font: 0,
        },
        success: (uploadFileRes) => {
          const response = JSON.parse(uploadFileRes.data)
          if (response.code == 0) {
            this.pageMark = response.data.pageMark
            this.ocrResults = response.data.ocrResults
            this.wordMarks = response.data.wordMarks
            this.drawImageWithData()
          }
        },
        fail: (err) => {
          console.error('提交失败：', err)
          uni.showToast({
            title: '提交失败',
            icon: 'none',
          })
        },
      })
    },
    drawImage() {
      const ctx = uni.createCanvasContext('myCanvas')
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      ctx.drawImage(this.imagePath, 0, 0, this.canvasWidth, this.canvasHeight) // 按比例绘制图片

      ctx.draw(false, () => {
        console.log('draw image success')
      })
    },

    handleCanvasClick(event) {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('#myScrollView')
        .scrollOffset((data) => {
          const x = event.detail.x - event.target.offsetLeft
          const y = event.detail.y - event.target.offsetTop

          this.mouseX = x
          this.mouseY = y + data.scrollTop
          this.drawImageWithData()
        })
        .exec()
    },
    drawImageWithData() {
      const ctx = uni.createCanvasContext('myCanvas')
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      ctx.drawImage(this.imagePath, 0, 0, this.canvasWidth, this.canvasHeight) // 按比例绘制图片

      if (!this.ocrResults && !this.wordMarks) {
        return
      }

      const aspectRatio = this.chooseImageHeight / this.chooseImageWidth // 计算图片宽高比
      const scale = this.canvasWidth / this.chooseImageWidth

      this.ocrResults.forEach((ocr, i) => {
        const word = this.wordMarks[i]
        let x = ocr.points[0] * scale
        let y = ocr.points[1] * scale
        let width = (ocr.points[4] - ocr.points[0]) * scale
        let height = (ocr.points[5] - ocr.points[1]) * scale

        // 创建一个变量来存储显示的文本
        let displayText

        if (word.mark > 80) {
          displayText = '优' // 如果分数大于80，设置显示文本为"优"
        } else if (word.mark >= 70) {
          displayText = '良' // 如果分数在60到80之间，设置显示文本为"良"
        } else {
          displayText = '学习' // 如果分数低于60，设置显示文本为"去学习"
        }

        if (
          this.mouseX >= x &&
          this.mouseX <= x + width &&
          this.mouseY >= y &&
          this.mouseY <= y + height
        ) {
          ctx.strokeStyle = 'blue'
          ctx.fillStyle = 'blue'
          ctx.strokeRect(x, y, width, height)
          // ctx.fillText(`${word.mark.toFixed(0)}`, x, y + 25);
          ctx.fillText(displayText, x, y + 25)

          this.drawMask('wordMask', ocr.label, word.base64Mark)
          this.showWordsInfo(ocr, word)
          // 将点击的文字转化为 Base64 格式
          // 将点击的文字转化为 Base64 格式
          const base64Label = btoa(unescape(encodeURIComponent(ocr.label)))
          //   const encoder = new TextEncoder()
          //   const encodedData = encoder.encode(ocr.label) // 将文本转换为 Uint8Array
          //   const base64Label = btoa(String.fromCharCode(...encodedData)) // 转换为 Base64
          // console.log(
          //   `你点击了文字 "${ocr.label}"，分数: ${word.mark}，Base64格式: ${base64Label}`
          // )

          uni.navigateTo({
            url: `/pages/home/setContent?id=${this.opt}&status=${this.st}`,
          })
          // if (displayText === '学习') {
          //   let params = {
          //     fonts: base64Label,
          //   }
          //   goStudy(params)
          //     .then((res) => {
          //       console.log(res) // 打印响应
          //       if (res.code === 1) {
          //         uni.navigateTo({
          //           url: '/pages/pagesall/course/go_learn', // 替换为实际的页面路径
          //         })
          //       } else {
          //         uni.showToast({
          //           title: res.msg,
          //           icon: 'error',
          //         })
          //       }
          //     })
          //     .catch((error) => {
          //       console.error('请求发生错误:', error) // 打印错误信息
          //       uni.showToast({
          //         title: '请求失败，请稍后重试。',
          //         icon: 'error',
          //       })
          //     })
          // }
        } else {
          // 低分用不同颜色
          if (word.mark < 70) {
            ctx.strokeStyle = 'red'
            ctx.fillStyle = 'red'
          } else {
            ctx.strokeStyle = '#2e8b57'
            ctx.fillStyle = '#2e8b57'
          }
          ctx.strokeRect(x, y, width, height)
          ctx.fillText(displayText, x, y + 25)

          // ctx.fillText(`${word.mark.toFixed(0)}`, x, y + 25);
        }
      })

      if (this.mouseX == 0 && this.mouseY == 0 && this.ocrResults.length > 0) {
        this.drawMask(
          'wordMask',
          this.ocrResults[0].label,
          this.wordMarks[0].base64Mark
        )
        this.showWordsInfo(this.ocrResults[0], this.wordMarks[0])
      }

      ctx.draw(false, () => {
        console.log('draw image success')
      })
    },
    drawMask(canvasId, label, base64String) {
      const ctx = uni.createCanvasContext('wordMask', this)

      ctx.clearRect(0, 0, 128, 128)
      ctx.setFillStyle('#ffffff')
      ctx.fillRect(0, 0, 128, 128)

      // 标准字
      const x = 128 / 2
      const y = 128 / 2
      ctx.setFillStyle('#FF5733')
      ctx.font = '106px simkai'
      ctx.setFontSize(106)

      ctx.setTextAlign('center')
      ctx.setTextBaseline('middle')
      ctx.fillText(label, x, y)

      const binaryData = atob(base64String)
      const byteArray = new Uint8Array(binaryData.length)
      for (var i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i)
      }

      // Draw the image from the binary data
      function draw() {
        let bits = displayBits(byteArray)
        drawBinaryImage(bits)

        function drawBinaryImage(bits) {
          for (let i = 0; i < 128; ++i) {
            for (let j = 0; j < 128; ++j) {
              let bit = bits[128 * i + j]
              if (bit === 0) {
                const colorValue = bit === 0 ? 0 : 255
                ctx.setFillStyle(
                  `rgb(${colorValue}, ${colorValue}, ${colorValue})`
                )
                ctx.fillRect(j, i, 1, 1)
              }
            }
          }
        }

        function displayBits(uint8Array) {
          const bitValues = []
          for (let i = 0; i < uint8Array.length; i++) {
            for (let j = 7; j >= 0; j--) {
              const bit = (uint8Array[i] >> j) & 1
              bitValues.push(bit)
            }
          }
          return bitValues
        }
      }
      draw()

      ctx.draw(false, () => {
        console.log('draw mask success')
        // const store = useStore()
        // const canvasElement = this.$refs.aiBox // 获取 canvas 元素
      })
    },

    showWordsInfo(ocrResult, wordMark) {
      // 构建文本信息
      let sb = []
      sb.push(ocrResult.label + '\n')
      if (wordMark.mark <= 0) {
        sb.push('暂无识别字的评测数据\n')
      }
      sb.push('综合得分 ' + wordMark.mark + '\n')
      sb.push('重心得分 ' + wordMark.centerMark)

      if (wordMark.centerInfo === 0) {
        sb.push('良好')
      } else if (wordMark.centerInfo === 1) {
        sb.push('偏上')
      } else if (wordMark.centerInfo === 2) {
        sb.push('偏下')
      } else if (wordMark.centerInfo === 3) {
        sb.push('偏左')
      } else if (wordMark.centerInfo === 4) {
        sb.push('偏右')
      }
      sb.push('\n')

      sb.push('形态得分 ' + wordMark.rateMark)
      if (wordMark.rateInfo === 0) {
        sb.push('良好')
      } else if (wordMark.rateInfo === 1) {
        sb.push('太宽')
      } else if (wordMark.rateInfo === 2) {
        sb.push('太瘦')
      }
      sb.push('\n')

      sb.push('大小得分 ' + wordMark.areaMark)
      if (wordMark.areaInfo === 0) {
        sb.push('良好')
      } else if (wordMark.areaInfo === 1) {
        sb.push('太小')
      } else if (wordMark.areaInfo === 2) {
        sb.push('太大')
      }
      sb.push('\n')

      sb.push('位置得分 ' + wordMark.posMark)
      if (wordMark.posInfo === 0) {
        sb.push('良好')
      } else if (wordMark.posInfo === 1) {
        sb.push('偏上')
      } else if (wordMark.posInfo === 2) {
        sb.push('偏下')
      } else if (wordMark.posInfo === 3) {
        sb.push('偏左')
      } else if (wordMark.posInfo === 4) {
        sb.push('偏右')
      }
      sb.push('\n')

      sb.push('笔画得分 ' + wordMark.conFMark)
      if (wordMark.conFInfo === 0) {
        sb.push('良好')
      } else if (wordMark.conFInfo === 1) {
        sb.push('不良')
      }
      sb.push('\n')

      this.evaluationDesc = sb.join('')
      // this.score()
      // console.log(this.evaluationDesc)
      // const store = useStore()
      // store.setEvaluationDesc(this.evaluationDesc)
    },
  },
  mounted() {
    this.checkHomework_data()
    this.getToken() // 根据需要调用获取token
  },
  created() {
    // const option = this.$route.params // 如果使用vue-router
  },
}
</script>

<style scoped>
.teacherSet {
  background-color: #ffffff;
  width: 710rpx;
  height: 80rpx;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 30rpx;
  /* z-index: 999; */
}

.teacherSet_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.icon_2 {
  position: absolute;
  right: 20rpx;
  font-size: 26rpx;
}

.ai_box {
  width: 750rpx;
  min-height: 946rpx;
  overflow: hidden;
  background-color: gainsboro;
}

.teacherSet_tag {
  width: 710rpx;
  margin-left: 20rpx;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.teacherSet_tag1 {
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

.teacherSet_SP {
  width: 710rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.teacherSet_res {
  width: 680rpx;
  min-height: 164rpx;
  background: #f1f1f1;
  border-radius: 8rpx;
  padding: 15rpx;
  margin-top: 15rpx;
  font-size: 28rpx;
}

.teacherSet-view {
  margin: 20rpx 0 0rpx 20rpx;
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

.teacherbox2 {
  padding: 30rpx 20rpx 20rpx 20rpx;
  display: flex;
  align-items: center;
}

.teacherbox_img {
  width: 88rpx;
  height: 88rpx;
  margin-right: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.teacherbox_text1 {
  font-weight: 600;
  font-size: 32rpx;
  color: #000000;
}

.teacherbox_text2 {
  font-weight: 400;
  font-size: 16rpx;
  color: #000000;
}

.teacherSet_icons {
  position: absolute;

  left: 2%;
  bottom: 8rpx;
}
</style>
