<template>
	<view class="v-bottom-menu">
		<u-gap :height="height"></u-gap>
		<view class="menu" :style="{ height: height + 'rpx' }"><slot></slot></view>
	</view>
</template>

<script>
export default {
	props: {
		gap: {
			type: Boolean,
			default: true
		},
		height: {
			type: [Number, String],
			default: 120
		}
	},
	data() {
		return {}
	}
}
</script>

<style lang="scss">
.v-bottom-menu {
	.menu {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 750rpx;
		padding: 0 24rpx;
		background: #fff;
		box-shadow: -2rpx -6rpx 16rpx 0rpx rgba(53, 53, 53, 0.1);
		z-index: 1000;
	}
}
</style>
