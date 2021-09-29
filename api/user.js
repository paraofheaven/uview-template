// 用户发送验证码
const userSendScode = (params = {}) => uni.$u.post('/user/sendScode', params);

// 用户注册
const userRegister = (params = {}) => uni.$u.post('/user/register', params);

export default {
	userSendScode,
	userRegister,
}
