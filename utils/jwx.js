// 微信SDK官方文档： https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
const jweixin = require('./wx-jssdk');
import {
	wechatAppId,
	wechatScope,
} from '@/common/settings'
// 微信SDK全局方法
const install = (Vue, vm) => {
	// 微信授权登录，不需要初始化微信SDK
	const wxOauth = async () => {
		// 非静默授权，第一次有弹框
		const local = window.location.href; // 获取页面url
		const code = getUrlCode().code; // 截取code
		// 获取之前的code 。 避免出现新旧code
		const oldCode = uni.getStorageSync('wechatCode')
		if (code == null || code == '' || code == 'undefined' || code == oldCode) {
			// 如果没有code，就去请求获取code
			console.log('当前没有code，进入授权页面')
			const uri = encodeURIComponent(local)
			// 设置旧的code为0，避免死循环
			uni.setStorageSync('wechatCode', 0)
			window.location.href =
				`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatAppId}&redirect_uri=${uri}&response_type=code&scope=${wechatScope}&state=123#wechat_redirect`
		} else {
			console.log('存在code，使用code登录')
			// 保存最新code
			uni.setStorageSync('wechatCode', code)
			const res = await vm.$u.api.wechatLogin({
				code
			})
			console.log(res)
			// 登录成功
			vm.$u.vuex('userInfo', res.data)
			vm.$u.vuex('isLogin', true)
		}
	}

	// 判断是否是微信客户端
	const isWechat = () => {
		// true是微信客户端，false不是微信客户端
		const ua = window.navigator.userAgent.toLowerCase()
		return ua.match(/micromessenger/i) == 'micromessenger'
	}

	// 初始化SDK
	const init = async (callback) => {
		// 记录进入app时的url
		if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
			window.entryUrl = location.href.split('#')[0]
		}
		const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
		// 进行签名的时候  Android 不用使用之前的链接， ios 需要
		const signLink = isiOS ? window.entryUrl : location.href.split('#')[0]
		//获取当前url然后传递给后台获取授权和签名信息，后台需要解码才能使用
		const url = encodeURIComponent(signLink);
		//服务端进行签名
		const res = await vm.$u.api.getSign({
			url
		})
		// 注意此处的返回值
		// console.log(res)
		jweixin.config({
			debug: false,
			appId: res.data.appId,
			timestamp: res.data.timestamp,
			nonceStr: res.data.nonceStr,
			signature: res.data.signature,
			jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData',
				'editAddress', 'chooseImage',
				'onMenuShareAppMessage', 'onMenuShareTimeline',
				'chooseImage','scanQRCode',
				'previewImage', 'uploadImage',
				'downloadImage', 'chooseWXPay',
				'getLocation', 'openLocation'
			]
		});
		jweixin.ready(() => {
			console.log('config注入成功')
			// window.alert('签名的URL：'+ signLink)
			callback && callback()
		})
	}

	// 获取当前位置
	const getLocation = callback => {
		vm.$u.wx.init(() => {
			jweixin.getLocation({
				type: 'gcj02',
				success: (res) => {
					callback && callback(res)
				},
			})
		})
	}

	// 打开位置， 参数 { lat:40.042542,lng:116.397128 }
	const openLocation = params => {
		vm.$u.wx.init(() => {
			jweixin.openLocation({ //根据传入的坐标打开地图
				latitude: params.latitude, // 纬度，浮点数，范围为90 ~ -90
				longitude: params.longitude, // 经度，浮点数，范围为180 ~ -180。
				name: params.name || '', // 位置名
				address: params.address || '', // 地址详情说明
				scale: params.scale || 20, // 地图缩放级别,整型值,范围从1~28。默认为最大
				infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
			})
		})
	}

	// 选择图片
	const chooseImage = (callback) => {
		vm.$u.wx.init(() => {
			jweixin.chooseImage({
				count: 9,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					callback && callback(res)
				}
			})
		})
	}

	// 微信支付
	const wxpay = (params = {}) => {
		vm.$u.wx.init(() => {
			jweixin.chooseWXPay({
				timestamp: params.data
					.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符  
				nonceStr: params.data.nonceStr, // 支付签名随机串，不长于 32 位  
				package: params.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）  
				signType: params.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
				paySign: params.data.paySign, // 支付签名  
				success: (res) => {
					// console.log('微信JSAPI返回支付成功')
					params?.success(res)
				},
				cancel: (err) => {
					params.fail && params.fail(err)
					// console.log('微信JSAPI返回支付失败')
				},
			})
		})
	}

	// 自定义分享
	const share = (params = {}) => {
		vm.$u.wx.init(() => {
			const shareData = {
				title: params?.title || '默认标题',
				desc: params?.desc || '默认描述',
				link: params?.link || window.location.href,
				imgUrl: params?.imgUrl ||
					'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/d724aa70-eac6-11ea-b680-7980c8a877b8.jpg',
				success: (res) => {
					//用户点击分享后的回调，这里可以进行统计，例如分享送金币之类的
					params?.success()
				},
			}
			//分享给朋友接口  
			jweixin.onMenuShareAppMessage(shareData)
			//分享到朋友圈接口  
			jweixin.onMenuShareTimeline(shareData)
		})
	}

	// 选择通讯地址，一般选择收货地址时用
	const chooseAddress = (callback) => {
		vm.$u.wx.init(() => {
			jweixin.openAddress({
				success: (res) => {
					callback && callback(res)
				}
			})
		})
	}

	// 扫码
	const scanQRCode = (callback) => {
		vm.$u.wx.init(() => {
			jweixin.scanQRCode({
				needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				success: (res) => {
					callback && callback(res)
				}
			})
		})
	}

	// 截取url中的code
	const getUrlCode = () => {
		// 截取url中的code方法
		const url = location.search
		const theRequest = new Object()
		if (url.indexOf('?') != -1) {
			let str = url.substr(1)
			let strs = str.split('&')
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
			}
		}
		return theRequest
	}

	Vue.prototype.$u.wx = {
		wxOauth,
		isWechat,
		init,
		getLocation,
		openLocation,
		chooseImage,
		wxpay,
		share,
		chooseAddress,
		scanQRCode
	}
	// 将各个定义的方法，统一放进对象挂载到vm.$u.wx(因为vm就是this，也即this.$u.wx)下
}
export default {
	install
}
