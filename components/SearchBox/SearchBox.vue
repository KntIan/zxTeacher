<template>
	<div class="search-box">
		<!-- 如果有图片，则显示图片 -->
		<img v-if="imageUrl" :src="imageUrl" alt="Search Icon" class="search-icon" />
		<!-- 输入框 -->
		<input type="text" v-model="searchText" @input="handleInput" placeholder="请输入搜索内容" class="search-input" />
	</div>
</template>

<script>
	import {
		ref
	} from 'vue';

	export default {
		name: 'SearchBox',
		props: {
			imageUrl: {
				type: String,
				default: ''
			}
		},
		setup(props, {
			emit
		}) {
			const searchText = ref('');

			const handleInput = () => {
				emit('search', searchText.value);
			};

			return {
				searchText,
				handleInput
			};
		}
	};
</script>

<style scoped>
	.search-box {
		display: flex;
		align-items: center;
		border: 1px solid #ccc;
		padding: 5px;
		border-radius: 4px;
	}

	.search-icon {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}

	.search-input {
		border: none;
		outline: none;
		flex: 1;
	}
</style>