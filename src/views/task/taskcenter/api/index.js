import request from '@/utils/request';


/**
 * 售前支持查询详情
 *
 * @param params
 */
export function getclientDetailsAbove(params) {
	return request({
		url: '/oms-project/api/project/clientDetailsAbove',
		method: 'get',
		params: params
	});
}
/**
 * 查询决策人
 *
 * @param params
 */
export function requestHandler(data) {
	return request({
		url: '/oms-project/api/project/requestHandler',
		method: 'get',
		params: data
	});
}
/**
 * 查询决策人
 *
 * @param params
 */
export function yesBuildProject(data) {
	return request({
		url: '/oms-project/api/project/yesBuildProject',
		method: 'post',
		data
	});
}
