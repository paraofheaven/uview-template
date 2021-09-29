// 此处没有使用传入的params参数
// 小程序授权登录
const wxappLogin = (params = {}) => uni.$u.get('/Index/wxappLogin', params);

// 公众号授权登录
const wechatLogin = (params = {}) => uni.$u.get('Wechatoauth/accesstoken', params);

// 公众号获取签名
const getSign = (params = {}) => uni.$u.get('WechatScript/getSignPackage', params);

// 获取用户信息
const getUserInfo = (params = {}) => uni.$u.get('/Index/getUserInfo', params);

// 一言
const getYiyan = (params = {}) => uni.$u.get('/Index/Yiyan', params);

export default {
	wxappLogin,
	wechatLogin,
	getSign,
	getUserInfo,
	getYiyan
}
