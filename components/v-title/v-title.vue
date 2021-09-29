<template>
	<view class="v-title">
		<view class="sign" v-if="sign" :style="{ background: signColor }"></view>
		<view class="title" :style="{ fontSize: size + 'rpx', color }">{{ text }}</view>
		<view class="more" v-if="isMore" @click="click">
			<text class="u-font-24 u-type-info">查看更多</text>
			<u-icon name="arrow-right" color="#999"></u-icon>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		text: {
			type: String,
			default: ''
		},
		sign: {
			type: Boolean,
			default: false
		},
		signColor: {
			type: String,
			default: '#e54a48'
		},
		size: {
			type: [String, Number],
			default: '30'
		},
		color: {
			type: String,
			default: '#333'
		},
		isMore: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {}
	},
	methods: {
		click() {
			this.$emit('more')
		}
	}
}
</script>

<style lang="scss">
@import '../style.components.scss';
.v-title {
	@include vue-flex;
	.sign {
		width: 8rpx;
		height: 36rpx;
		margin-right: 16rpx;
	}
	.title {
		font-weight: bold;
	}
	.more {
		margin-left: auto;
	}
}
</style>
