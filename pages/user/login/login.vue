<template>
	<view>
		<u-navbar is-back :background="{ background: 'transparent' }" :border-bottom="false" title="授权登录" title-size="28"></u-navbar>
		<view class="content">
			<view class="logo u-flex"><image :src="logo"></image></view>
			<view class="name">{{ name }}</view>
			<view class="summary u-flex"><text>如需正常使用小程序的功能，请点击下方授权登录按钮，打开授权弹窗，并点击允许。</text></view>
			<view class="btn"><u-button type="primary" size="default" shape="circle" @click="wxLogin">授权登录</u-button></view>
		</view>
	</view>
</template>

<script>
import { name, logo } from '@/common/settings'
export default {
	data() {
		return {
			name,
			logo
		}
	},
	methods: {
		async wxLogin() {
			uni.showLoading({ title: '登录中...' })
			const user = await this.getUserProfile()
			const code = await this.getLoginCode()
			const loginInfo = {
				code,
				encrypted_data: user.encryptedData,
				iv: user.iv,
				raw_data: user.rawData,
				signature: user.signature
			}
			const { data } = await this.$u.api.wxappLogin(loginInfo)
			this.$u.vuex('userInfo', data.member)
			this.$u.vuex('isLogin', true)
			uni.hideLoading()
			this.$u.func.showToast({
				title: '登录成功',
				back: true
			})
		},
		getUserProfile() {
			return new Promise((reject, resolve) => {
				wx.getUserProfile({
					lang: 'zh_CN',
					desc: '用于完善会员资料',
					success: res => {
						reject(res)
					},
					fail: () => {
						uni.hideLoading()
						this.$u.func.showToast('请点击允许授权')
						resolve()
					}
				})
			})
		},
		getLoginCode() {
			return new Promise((reject, resolve) => {
				uni.login({
					provider: 'weixin',
					success: res => {
						reject(res.code)
					},
					fail: () => {
						uni.hideLoading()
						this.$u.func.showToast('授权登录失败')
						resolve()
					}
				})
			})
		}
	}
}
</script>

<style lang="scss">
page {
	background: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/50c93d50-a594-11ea-b997-9918a5dda011.png') no-repeat center / 100% 100%;
}
.content {
	margin-top: 200rpx;
	.logo {
		justify-content: center;
		image {
			width: 128rpx;
			height: 128rpx;
			border-radius: 64rpx;
		}
	}
	.name {
		margin-top: 20rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}
	.summary {
		justify-content: center;
		margin-top: 40rpx;
		margin-bottom: 60rpx;
		padding: 0 54rpx;
		color: #999;
		line-height: 48rpx;
		font-size: 28rpx;
		text {
			width: 100%;
		}
	}
	.btn {
		padding: 0 100rpx;
	}
}
</style>
