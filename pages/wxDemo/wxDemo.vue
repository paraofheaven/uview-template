<template>
	<view>
		<u-cell-group>
			<u-cell-item icon="fingerprint" title="授权登录" @click="wxOauth">
				<view class="u-flex u-row-right" v-if="isLogin">
					<u-avatar :src="userInfo.avatarUrl"></u-avatar>
					<view class="u-m-l-24">{{ userInfo.nickname }}</view>
				</view>
			</u-cell-item>
			<u-cell-item icon="chat" title="消息提示" @click="showToast('我是一条随机消息提示', toastType[$u.random(0, 2)])"></u-cell-item>
			<u-cell-item icon="map" title="获取当前位置" @click="getLocation">
				<view class="u-flex u-row-right" v-if="location">
					<view>经度:{{ location.longitude.toFixed(6) }}</view>
					<view class="u-m-l-24">纬度:{{ location.latitude.toFixed(6) }}</view>
				</view>
			</u-cell-item>
			<u-cell-item icon="pushpin" title="打开当前位置(导航)" @click="openLocation"></u-cell-item>
			<u-cell-item icon="photo" title="选择图片" @click="chooseImage"></u-cell-item>
			<u-cell-item icon="shopping-cart" title="选择收货地址" @click="chooseAddress"></u-cell-item>
			<u-cell-item icon="share" title="设置自定义分享" @click="share"></u-cell-item>
			<u-cell-item icon="rmb-circle" title="微信支付" @click="wxpay"></u-cell-item>
			<u-cell-item icon="scan" title="扫码" @click="scanQRCode"></u-cell-item>
		</u-cell-group>
		<v-toast ref="vToast"></v-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			location: null,
			toastType: ['success', 'warning', 'error']
		}
	},
	onShow() {
		// if (!this.isLogin) this.$u.wx.wxOauth()
	},
	onLoad() {},
	methods: {
		wxOauth() {
			this.$u.wx.wxOauth()
		},
		getLocation() {
			this.$u.wx.getLocation(res => {
				this.location = res
			})
		},
		openLocation() {
			if (!this.location) return this.showToast('请先获取当前位置', 'warning')
			this.$u.wx.openLocation({
				name: '我的位置',
				address: '地址详细描述',
				latitude: this.location.latitude,
				longitude: this.location.longitude
			})
		},
		chooseImage() {
			this.$u.wx.chooseImage(res => {
				uni.showModal({
					content: JSON.stringify(res),
					showCancel: false
				})
			})
		},
		chooseAddress() {
			this.$u.wx.chooseAddress(res => {
				uni.showModal({
					content: JSON.stringify(res),
					showCancel: false
				})
			})
		},
		share() {
			if (!this.isLogin) return this.showToast('请先授权登录', 'warning')
			this.showToast('设置成功，请点击右上角转发给好友')
			this.$u.wx.share({
				title: this.userInfo.nickname + '邀请你参加XXX活动',
				desc: '缤纷好礼享不停，快来看看吧~',
				success: () => {
					uni.showModal({
						content: '分享成功,积分增加100',
						showCancel: false
					})
				}
			})
		},
		async wxpay() {
			if (!this.isLogin) return this.showToast('请先授权登录', 'warning')
			const res = await this.$u.api.createTestOrder()
			this.$u.wx.wxpay({
				data: { ...res.data },
				success: () => {
					this.showToast('支付成功')
				},
				fail: () => {
					this.showToast('取消支付', 'warning')
				}
			})
		},
		scanQRCode() {
			this.$u.wx.scanQRCode()
		},
		showToast(title, type = 'success') {
			this.$refs.vToast.show({ title, type })
		}
	}
}
</script>

<style lang="scss"></style>
