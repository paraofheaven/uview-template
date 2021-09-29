// 生成测试订单
const createTestOrder = (params = {}) => uni.$u.post('/Order/createTestOrder', params);

export default {
	createTestOrder,
}
