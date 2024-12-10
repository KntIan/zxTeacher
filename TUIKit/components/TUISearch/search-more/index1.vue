<template>
	<div ref="searchMoreRef" :class="['tui-search-more', !isPC && 'tui-search-more-h5']"
		v-for="(extension, index) in extensionList" :key="index">
		<!-- <div class="more" @click="toggleMore()"> -->
		<div class="more" @click="handleMenu(extension)">
			<!-- <Icon
        class="more-icon"
        :file="searchMoreSVG"
        :width="isPC ? '28px' : '34px'"
        :height="isPC ? '28px' : '34px'"
      /> -->
			<img style="width: 100%; height: 100%"
				src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngeece69715878345df0c6289d76bff4f340297c393014cb486eb566bf98b6e279" />
		</div>
		<!-- <ul v-if="isListShow" class="tui-search-more-list">
      <li
        v-for="(extension, index) in extensionList"
        :key="index"
        class="list-item"
        @click="handleMenu(extension)"
      >
        <Icon
          v-if="extension.icon"
          class="list-item-icon"
          :file="extension.icon"
        />
        <div class="list-item-title">
          {{ extension.text }}
        </div>
      </li>
    </ul> -->
	</div>
</template>
<script lang="ts" setup>
	import { ref, watch, onMounted } from 'vue'
	import { TUIStore, StoreName } from '@tencentcloud/chat-uikit-engine'
	import TUICore, { ExtensionInfo, TUIConstants } from '@tencentcloud/tui-core'
	import { outsideClick } from '@tencentcloud/universal-api'
	import Icon from '../../common/Icon.vue'
	import searchMoreSVG from '../../../assets/icon/search-more.svg'
	import { isPC, isUniFrameWork } from '../../../utils/env'

	const props = defineProps({
		searchType: {
			type: String,
			default: 'global', // "global" / "conversation"
			// validator(value: string) {
			//   return ['global', 'conversation'].includes(value)
			// },
		},
	})
	const searchType = 'global'
	const searchMoreRef = ref<HTMLElement | null>()
	const isListShow = ref<boolean>(false)
	const toggleMore = () => {
		isListShow.value = !isListShow.value
		if (!isUniFrameWork && isListShow.value) {
			outsideClick.listen({
				domRefs: searchMoreRef.value,
				handler: closeSearchMore,
			})
		}
	}
	const extensionList = ref<ExtensionInfo[]>([])

	const handleMenu = (item : ExtensionInfo) => {
		console.log(item)
		const { listener = { onClicked: () => { } } } = item
		listener?.onClicked?.(item)
		toggleMore()
	}

	const closeSearchMore = () => {
		isListShow.value = false
	}

	onMounted(() => {
		// 获取扩展列表
		const allExtensions = TUICore.getExtensionList(
			TUIConstants.TUISearch.EXTENSION.SEARCH_MORE.EXT_ID
		)

		// 过滤出与“发起群聊”相关的扩展项
		extensionList.value = allExtensions.filter((extension) =>
			extension.text.includes('发起群聊')
		)
		console.log(extensionList.value)
		// hide conversation header
		TUICore.callService({
			serviceName: TUIConstants.TUIConversation.SERVICE.NAME,
			method:
				TUIConstants.TUIConversation.SERVICE.METHOD.HIDE_CONVERSATION_HEADER,
			params: {},
		})
	})

	watch(
		() => isListShow.value,
		() => {
			if (isListShow.value) {
				TUIStore.update(StoreName.SEARCH, 'currentSearchingStatus', {
					isSearching: false,
					searchType: searchType,
				})
			}
		}
	)
</script>

<style lang="scss" scoped>
	.tui-search-more {
		display: flex;
		flex-direction: column;
		position: relative;
		align-items: center;

		height: 100%;
		justify-content: center;

		.more {
			width: 28px;
			height: 28px;
			margin-right: 6px;
		}

		&-list {
			margin: 10px 0;
			position: absolute;
			list-style: none;
			cursor: pointer;
			right: 6px;
			top: 20px;
			z-index: 1000;
			background: #fff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			padding: 0;
			box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px, rgba(0, 0, 0, 0.23) 0 3px 6px;

			.list-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				height: 40px;
				padding: 0 10px;

				&-icon {
					margin-right: 2px;
				}

				&-title {
					font-size: 14px;
					text-wrap: nowrap;
					word-break: keep-all;
				}
			}
		}
	}

	.tui-search-more-h5 {
		.more {
			width: 34px;
			height: 34px;
		}
	}
</style>