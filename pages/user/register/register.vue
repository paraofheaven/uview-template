<template>
	<view>
		<!-- <u-navbar is-back :background="{ background: 'transparent' }" :border-bottom="false" title="授权登录" title-size="28"></u-navbar> -->
		<view class="content">
			<view class="i18n-change">
				<text>EN</text>
				<u-switch v-model="i18nEN" size="30" @change="changeI18NLang"></u-switch>
			</view>
			<u-form :model="form" ref="uForm">
				<u-form-item :label="i18n.account" prop="mobile" label-width="120">
					<u-input v-model="form.mobile" :placeholder="i18n.accountPlaceholder1" />
					<u-verification-code :seconds="seconds" :start-text="i18n.sendSmsCode"
						:change-text="i18n.smsChangeText" :end-text="i18n.reAcquire" ref="uCode" @change="codeChange">
					</u-verification-code>
					<u-button @tap="sendScode">{{tips}}</u-button>
				</u-form-item>
				<u-form-item :label="i18n.smsCode" prop="scode" label-width="120">
					<u-input v-model="form.scode" :placeholder="i18n.smsCodePlaceholder1"></u-input>
				</u-form-item>
				<u-form-item :label="i18n.password" prop="password" label-width="120">
					<u-input v-model="form.password" :placeholder="i18n.passwordPlaceholder1"></u-input>
				</u-form-item>
				<u-form-item :label="i18n.dpassword" prop="dpassword" label-width="120">
					<u-input v-model="form.dpassword" :placeholder="i18n.dpasswordPlaceholder1"></u-input>
				</u-form-item>
			</u-form>
			<!-- <view class="logo u-flex"><image :src="logo"></image></view> -->
			<!-- <view class="name">{{ name }}</view> -->
			<!-- <view class="summary u-flex"><text>如需正常使用小程序的功能，请点击下方授权登录按钮，打开授权弹窗，并点击允许。</text></view> -->
			<view class="btn">
				<u-button type="primary" size="default" shape="circle" @click="register">{{i18n.register}}</u-button>
			</view>
			<v-toast ref="vToast"></v-toast>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				i18nEN: false,
				tips: '',
				seconds: 60,
				form: {
					mobile: '',
					scode: '',
					password: '',
					dpassword: ''
				},
				rules: {
					mobile: [{
						required: true,
						message: this.$t('messages.accountPlaceholder1'),
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}, {
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// this.$u.test.mobile()就是返回true或者false的
							return this.$u.test.mobile(value);
						},
						message: this.$t('messages.accountPlaceholder2'),
						// 触发器可以同时用blur和change
						trigger: ['change'],
					}],
					scode: [{
						required: true,
						message: this.$t('messages.smsCodePlaceholder1'),
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						message: this.$t('messages.passwordPlaceholder1'),
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}, {
						min: 6,
						max: 20,
						message: this.$t('messages.passwordPlaceholder2'),
						trigger: ['change'],
					}],
					dpassword: [{
						required: true,
						message: this.$t('messages.dpasswordPlaceholder1'),
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}, {
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							return value === this.form.password;
						},
						message: this.$t('messages.dpasswordPlaceholder2'),
						// 触发器可以同时用blur和change
						trigger: ['change'],
					}]
				}
			}
		},
		computed: {
			i18n() {
				return this.$t('messages')
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: this.$t('messages.title')
			});
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			changeI18NLang(value) {
				this.$i18n.locale = value ? 'en' : 'cn'
			},
			showToast(title, type = 'success') {
				this.$refs.vToast.show({
					title,
					type
				})
			},
			codeChange(text) {
				this.tips = text;
			},
			async sendScode() {
				if (!this.$u.test.mobile(this.form.mobile)) {
					this.showToast(this.$t('messages.accountPlaceholder2'), 'error')
					return
				}
				if (this.$refs.uCode.canGetCode) {
					try {
						this.$refs.uCode.start();
						await this.$u.api.userSendScode({
							mobile: this.form.mobile
						})
					} catch (e) {
						console.error(e)
					}
				}
			},
			register() {
				this.$refs.uForm.validate(async (valid) => {
					if (!valid) {
						return
					}
					const params = {
						mobile: this.form.mobile,
						scode: this.form.scode,
						password: this.form.password
					}
					uni.showLoading({
						title: '注册中...'
					})
					try {
						await this.$u.api.userRegister(params)
						uni.hideLoading()
					} catch (e) {
						uni.hideLoading()
						console.error(e)
					}
					this.$u.func.showToast({
						title: '注册成功',
						back: true
					})
					setTimeout(() => {
						this.$u.route('/pages/submit/submit')
					}, 2000)

				});
			},
			async wxLogin() {
				uni.showLoading({
					title: '登录中...'
				})
				const user = await this.getUserProfile()
				const code = await this.getLoginCode()
				const loginInfo = {
					code,
					encrypted_data: user.encryptedData,
					iv: user.iv,
					raw_data: user.rawData,
					signature: user.signature
				}
				const {
					data
				} = await this.$u.api.wxappLogin(loginInfo)
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
		margin: 140rpx 20rpx 0;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 0 20rpx;

		.i18n-change {
			display: flex;
			align-items: center;
			padding: 0 0 30rpx;
			justify-content: flex-end;

			.u-switch {
				margin-left: 10rpx;
			}
		}

		.btn {
			margin-top: 60rpx;
			padding: 0 100rpx;
		}
	}
</style>
