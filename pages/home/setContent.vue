<template>
  <view>
    <view :style="'height:' + (statusBarHeight + 5) + 'px;'"></view>
    <view class="box_content">
      <scroll-view id="myScrollView" scroll-y="true" @scroll="onScroll">
        <view style="width: 100%; height: 610px">
          <canvas
            ref="myCanvas"
            canvas-id="myCanvas"
            id="myCanvas"
            :style="{ width: '100vw', height: canvasHeight + 'px' }"
            @tap="handleCanvasClick"
          >
          </canvas>
        </view>
      </scroll-view>
    </view>

    <!-- <view class="box_content1">
      <text class="box_content_text"
        >使用下方放大缩小即可对单个字体进行修改</text
      >
      <view class="content_button">
        <button class="box_content_button" type="primary" plain="true">
          -
        </button>
        <button class="box_content_button" type="primary" plain="true">
          +
        </button>
      </view>
    </view> -->

    <view class="setContent-view">
      <uni-tag
        style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
        class="unitag"
        :circle="true"
        text="取消"
        type="default"
        @click="goback"
      />
      <uni-tag
        class="unitag"
        style="line-height: 80rpx; border-radius: 70rpx; font-size: 36rpx"
        :circle="true"
        text="完成"
        type="primary"
        @click="subback"
      />
    </view>
    <jp-cropper-watermark
      watermark=""
      :watermarkType="1"
      mode="free"
      :width="200"
      :height="140"
      :maxWidth="1024"
      :maxHeight="1024"
      :url="url"
      @cancel="oncancel"
      @ok="onok"
    ></jp-cropper-watermark>
    <!-- </scroll-view> -->
    <!-- 单字信息展示 -->
    <div
      v-show="isShowmark"
      style="
        position: fixed;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        z-index: 9999;
        background-color: rgba(0, 0, 0, 0.5); /* 蒙版背景 */
        display: flex; /* 使用 Flexbox 布局 */
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */
      "
      @click="closeWordInfo"
    >
      <div
        style="
          width: 600rpx; /* 设置的宽度 */
          /* height: 912rpx; 设置的高度 */
          background-color: white; /* 内部白色背景 */
          display: flex; /* 内部容器使用 Flexbox */
          flex-direction: column; /* 垂直布局 */
          align-items: center; /* 水平居中 */
          justify-content: center; /* 垂直居中 */
          padding: 28rpx; /* 内边距 */
          border-radius: 8px; /* 圆角 */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
        "
        @click.stop
      >
        <canvas
          ref="wordMask"
          canvas-id="wordMask"
          id="wordMask"
          style="
            width: 128px;
            height: 128px;
            border: 8rpx solid #f9b722;
            margin: 28rpx 0;
          "
        ></canvas>
        <view class="score_box">
          <view class="score_box1">
            <view class="score_text">
              {{ comprehensiveLevel }}
            </view>
            <img
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngfe293373ca510260bf25cf15905e96d33c640dc3b4be40d673f30a4860f69215"
              alt=""
            />
            <img
              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngfe293373ca510260bf25cf15905e96d33c640dc3b4be40d673f30a4860f69215"
              alt=""
            />
            <text style="font-size: 36rpx; color: #666666">AI综合评分</text>
          </view>
          <view class="scoring_box">
            <view
              class="xingxing1"
              v-for="(item, index) in score_List"
              :key="index"
            >
              <view class="xingxing">
                {{ item.title }}
              </view>
              <uni-rate :readonly="true" size="20" :value="item.score" />
            </view>
          </view>
        </view>
      </div>
    </div>
  </view>
</template>

<!-- <script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const ids = ref(null)
const st = ref(null)
const statusBarHeight = ref()
onLoad((option) => {
  console.log(option)
  ids.value = option.id
  st.value = option.status
  if (st.value === '1') {
    fetchAIReviewDetail(ids.value) // 调用请求方法
  }
  statusBarHeight.value = getApp().globalData.top
})

// 返回上一级
const contentSet_goback = () => {
  uni.navigateBack()
}
</script> -->
<script>
import { fetchHomeworkAIReviewDetail } from '@/utils/api'

export default {
  data() {
    return {
      statusBarHeight: null,
      isFavorited: false,
      score_List: [
        {
          title: '重心',
          score: 5,
        },
        {
          title: '位置',
          score: 4,
        },
        {
          title: '形态',
          score: 3,
        },
        {
          title: '笔画',
          score: 2,
        },
        {
          title: '大小',
          score: 1,
        },
      ],
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
      url: null,
      path: '',
      isShowmark: false,
    }
  },

  onLoad(options) {
    // console.log(options.id)
    // console.log(options.status)
    this.opt = options.id
    this.st = options.status
    this.isShowmark = false
    // 检查状态，如果状态为1则请求AI评审详情

    if (this.st === '1') {
      this.isShow = false
      this.fetchAIReviewDetail(this.opt) // 调用请求方法
    }
    const systemInfo = uni.getSystemInfoSync()
    this.canvasWidth = systemInfo.windowWidth
  },

  methods: {
    goback() {
      uni.navigateBack()
    },
    subback() {
      uni.navigateBack()
    },
    closeWordInfo() {
      // 将相关显示状态设置为关闭
      this.isShowmark = false // 或者设置适当的状态来控制显示
    },
    score() {
      let scoreText = this.evaluationDesc

      if (scoreText) {
        // 使用正则表达式提取分数
        const scores = {
          综合得分: null,
          重心得分: null,
          形态得分: null,
          大小得分: null,
          位置得分: null,
          笔画得分: null,
        }

        const regex =
          /(综合得分|重心得分|形态得分|大小得分|位置得分|笔画得分)[^\d]*(\d+)/g
        let match
        while ((match = regex.exec(scoreText)) !== null) {
          const scoreType = match[1] // 得分类型
          const scoreValue = parseInt(match[2], 10) // 将得分值转换为整数
          if (scores.hasOwnProperty(scoreType)) {
            scores[scoreType] = scoreValue // 存储得分
          }
        }

        const getComprehensiveLevel = (score) => {
          return score >= 60 ? '优' : '差' // 60分及以上为优
        }

        if (scores.综合得分 !== null) {
          this.comprehensiveLevel = getComprehensiveLevel(scores.综合得分)
        }

        const getOtherLevel = (score) => {
          if (score >= 80) return 5 // 80-100 -> 等级5
          if (score >= 60) return 4 // 60-79 -> 等级4
          if (score >= 40) return 3 // 40-59 -> 等级3
          if (score >= 20) return 2 // 20-39 -> 等级2
          return 1 // 0-19 -> 等级1
        }

        const scoreMap = {
          重心: scores.重心得分,
          位置: scores.位置得分,
          形态: scores.形态得分,
          笔画: scores.笔画得分,
          大小: scores.大小得分,
        }

        this.score_List.forEach((item) => {
          const score = scoreMap[item.title]
          if (score !== undefined) {
            item.score = getOtherLevel(score) // 将等级赋值给对应的项
          }
        })
      }
    },
    onok(ev) {
      this.url = ''

      //#ifdef APP-PLUS
      if (typeof plus !== 'undefined') {
        var p = plus.io.convertLocalFileSystemURL(ev.path)
      } else {
        console.error('plus is not defined')
      }

      let imagePath = 'file://' + p
      //#endif
      uni.getImageInfo({
        src: imagePath,
        success: (image) => {
          // console.log('image width', image.width)
          // console.log('image height', image.height)

          this.chooseImageWidth = image.width
          this.chooseImageHeight = image.height

          const aspectRatio = this.chooseImageHeight / this.chooseImageWidth // 计算图片宽高比
          this.canvasHeight = this.canvasWidth * aspectRatio
          this.imagePath = imagePath
          this.uploadFile()
          // console.log(this.imagePath)
          setTimeout(() => {
            this.drawImage()
            // this.drawImageWithData()
          })
        },
      })
    },
    oncancel() {
      // url设置为空，隐藏控件
      this.url = ''
    },
    changeCanvasSize(delta) {
      // 调整 Canvas 尺寸
      this.canvasWidth += delta // 修改宽度
      this.canvasHeight += delta * (this.canvasHeight / this.canvasWidth) // 保持比例
      this.drawImage() // 重新绘制
      this.drawImageWithData()
    },
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

    async fetchAIReviewDetail(homeworkId) {
      try {
        const data = {
          homework_id: homeworkId,
        }
        const res = await fetchHomeworkAIReviewDetail(data)
        // console.log(res)
        this.pageMark = JSON.parse(res.items[0].content).pageMark
        this.ocrResults = JSON.parse(res.items[0].content).ocrResults
        this.wordMarks = JSON.parse(res.items[0].content).wordMarks
        const imagePath = res.items[0].origin_img // 使用可选链操作符避免未定义的错误
        const ctx = uni.createCanvasContext('myCanvas')
        // console.log(imagePath)

        uni.getImageInfo({
          src: imagePath,
          success: (image) => {
            // console.log('image width', image.width)
            // console.log('image height', image.height)

            this.chooseImageWidth = image.width
            this.chooseImageHeight = image.height

            const aspectRatio = this.chooseImageHeight / this.chooseImageWidth // 计算图片宽高比
            this.canvasHeight = this.canvasWidth * aspectRatio
            this.imagePath = imagePath
            this.url = imagePath
            // console.log(this.imagePath)
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
    // async checkHomework_data() {
    //   try {
    //     const data = {
    //       homework_id: this.opt, // 作业ID
    //     }
    //     let res = await checkHomework(data)
    //     console.log(res.items[0].sub_image, '++++')
    //     const imagePa = res.items[0].sub_image
    //     const ctx = uni.createCanvasContext('myCanvas')
    //     uni.getImageInfo({
    //       src: imagePa,
    //       success: (e) => {
    //         // console.log(image)
    //         this.chooseImageWidth = e.width
    //         this.chooseImageHeight = e.height

    //         const aspectRatio = this.chooseImageHeight / this.chooseImageWidth // 计算图片宽高比
    //         this.canvasHeight = this.canvasWidth * aspectRatio

    //         console.log(this.canvasHeight)
    //         this.imagePath = e.path

    //         // this.drawImageWithData()
    //       },
    //     })
    //     this.score_List = res.items.map((item) => {
    //       item.school_name = item.school_name.split('-').slice(-1)[0] // 取最后一部分
    //       item.delayedMinutes = 0
    //       return item
    //     })
    //   } catch (error) {}
    // },
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
    onScroll(event) {
      this.scrollTop = event.detail.scrollTop // 获取 scrollTop
    },
    handleCanvasClick(event) {
      this.isShowmark = true
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
          // const base64Label = btoa(unescape(encodeURIComponent(ocr.label)))
          //   const encoder = new TextEncoder()
          //   const encodedData = encoder.encode(ocr.label) // 将文本转换为 Uint8Array
          //   const base64Label = btoa(String.fromCharCode(...encodedData)) // 转换为 Base64
          // console.log(
          //   `你点击了文字 "${ocr.label}"，分数: ${word.mark}，Base64格式: ${base64Label}`
          // )
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
      this.score()
      // console.log(this.evaluationDesc)
      // const store = useStore()
      // store.setEvaluationDesc(this.evaluationDesc)
    },
  },
  mounted() {
    // this.checkHomework_data()
    this.getToken() // 根据需要调用获取token
  },
  created() {
    // const option = this.$route.params // 如果使用vue-router
  },
}
</script>
<style>
.contentSet_Title {
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

.contentSet_text {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  text-align: center;
}

.box_content {
  /* margin-top: 80rpx; */
  width: 750rpx;
  height: 72vh;
  overflow: hidden;
  background-color: gainsboro;
}

.box_content1 {
  margin-top: 40rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.box_content_text {
  font-size: 24rpx;
}

.content_button {
  width: 500rpx;
  margin-top: 60rpx;
  display: flex;
  justify-content: space-around;
}

.box_content_button {
  width: 70rpx;
  height: 70rpx;
  font-size: 50rpx;
  line-height: 65rpx;
  padding: 0;
  text-align: center;
}

.setContent-view {
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
.score_text {
  width: 128rpx;
  height: 180rpx;
  overflow-wrap: break-word;
  color: rgba(219, 1, 12, 1);
  font-size: 128rpx;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  line-height: 180rpx;
}

.score_box1 {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.score_box {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.xingxing1 {
  width: 284rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5rpx 0;
}

.xingxing {
  font-weight: 600;
  font-size: 28rpx;
  color: #000000;
  line-height: 48rpx;
  text-align: left;
}
</style>
