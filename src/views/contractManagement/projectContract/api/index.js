import request from '@/utils/request';


/**
 * 合同列表
 *
 * @param params
 */
export function projectContractListGET(params) {
	return request({
		url: '/oms-project/api/contract/projectContractList',
		method: 'get',
		params: params
	});
}
/**
 * 合同签订
 *
 * @param params
 */
export function editProjectContract(params) {
	return request({
		url: '/oms-project/api/contract/editProjectContract',
		method: 'post',
		data: params
	});
}
/**
 * 项目详情
 *
 * @param params
 */
export function getProjectInfo(params) {
	return request({
		url: '/oms-project/api/contract/getProjectContract',
		method: 'get',
		params
	});
}
