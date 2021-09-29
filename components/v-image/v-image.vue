<template>
	<view class="v-image" :style="[wrapStyle]" @click="imgClick"><image :src="src" :mode="mode" :lazy-load="lazyLoad"></image></view>
</template>

<script>
export default {
	props: {
		src: {
			type: String,
			default: ''
		},
		width: {
			type: [String, Number],
			default: 120
		},
		height: {
			type: [String, Number],
			default: 120
		},
		borderRadius: {
			type: [String, Number],
			default: 0
		},
		lazyLoad: {
			type: Boolean,
			default: true
		},
		mode: {
			type: String,
			default: ''
		},
		// 是否开启点击预览图片（大图）
		preview: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {}
	},
	methods: {
		imgClick() {
			this.$emit('click')
			if (this.preview) {
				uni.previewImage({
					urls: [this.src]
				})
			}
		}
	},
	computed: {
		wrapStyle() {
			let style = {}
			// 通过调用addUnit()方法，如果有单位，如百分比，px单位等，直接返回，如果是纯粹的数值，则加上rpx单位
			style.width = this.$u.addUnit(this.width)
			style.height = this.$u.addUnit(this.height)
			if (this.mode == 'width') style.height = 'auto'
			// 如果是配置了圆形，设置50%的圆角，否则按照默认的配置值
			style.borderRadius = this.shape == 'circle' ? '50%' : this.$u.addUnit(this.borderRadius)
			// 如果设置圆角，必须要有hidden，否则可能圆角无效
			style.overflow = this.borderRadius > 0 ? 'hidden' : 'visible'
			return style
		}
	}
}
</script>

<style lang="scss" scoped>
.v-image {
	position: relative;
	image {
		width: 100%;
		height: 100%;
	}
}
</style>
