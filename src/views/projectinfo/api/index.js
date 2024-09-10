import request from '@/utils/request';


/**
 * 飞书实例创建
 *
 * @param params
 */
export function createFeishuApproval(params) {
	return request({
		url: '/oms-project/api/Feishu/feishuCreatesAnApproval',
		method: 'post',
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data;'
		}
	});
}
/**
 * 添加飞书审批
 *
 * @param params
 */
export function postApprovaInstance(params) {
	return request({
		url: '/oms-project/api/t_approva_instance',
		method: 'post',
		data: params
	});
}
/**
 * 进场
 *
 * @param params
 */
export function addMobilization(params) {
	return request({
		url: '/oms-project/api/haveMobilization/haveMobilizationInsert',
		method: 'post',
		data: params
	});
}
/**
 * 获取进场信息
 *
 * @param params
 */
export function getMobilization(params) {
	return request({
		url: '/oms-project/api/haveMobilization/selectHaveMobilizationOne',
		method: 'get',
		params
	});
}
