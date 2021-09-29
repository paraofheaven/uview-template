<template>
	<view class="submit-page">
		<u-cell-group>
			<u-cell-item title="1000 1010 00028" :arrow="false">
			</u-cell-item>
		</u-cell-group>
		<u-table class="page-table">
			<u-tr>
				<u-td class="large" width="30%">设备安装地址</u-td>
				<u-td class="large" width="70%">广东省深圳市宝安区兴东社区稻兴环球科创中心B座1408</u-td>
			</u-tr>
			<u-tr>
				<u-td width="30%">安装时间</u-td>
				<u-td width="70%">2021年8月15日 16:00</u-td>
			</u-tr>
			<u-tr>
				<u-td width="30%">启动时间</u-td>
				<u-td width="70%">2021年8月17日 16:00</u-td>
			</u-tr>
			<u-tr>
				<u-td width="30%">本次隔离结束时间</u-td>
				<u-td width="70%">2021年8月20日 16:00</u-td>
			</u-tr>
			<u-tr>
				<u-td width="30%">当前状态</u-td>
				<u-td width="70%">关</u-td>
			</u-tr>
			<u-tr>
				<u-td width="30%">最新更改状态时间</u-td>
				<u-td width="70%">2021年8月21日 16:00</u-td>
			</u-tr>
		</u-table>
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

<style lang="scss">
	.page-table{
		.u-td{
			height: 41px;
		}
		.large{
			height: 51px;
		}
	}
</style>
