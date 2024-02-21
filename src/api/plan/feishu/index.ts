import request from '@/utils/request';


/**
 * 查询给定审批详情
 *
 * @param params
 */
export function getFeishuApprovalDetails(params: any) {
    return request({
        url: `/oms-project/api/Feishu/approvalDetails/${params}`,
        method: 'get',
        params: params
    });
}
/**
 * 飞书实例创建
 *
 * @param params
 */
export function createFeishuApproval(params: any) {
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
 * 飞书实例创建
 *
 * @param params
 */
export function createFeishuUpload(params: any) {
    return request({
        url: '/oms-project/api/Feishu/upload',
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    });
}
/**
 * 获取飞书状态字典列表
 *
 * @param params
 */
export function getFeishuApprovalDictionary(params: any) {
    return request({
        url: '/oms-project/api/Feishu/feishuApprovalDictionary',
        method: 'get',
        params: params
    });
}
/**
 * 获取飞书状态字典列表
 *
 * @param params
 */
export function getApprovaInstance(params: any) {
    return request({
        url: '/oms-project/api/t_approva_instance',
        method: 'get',
        params: params
    });
}
/**
 * 添加飞书审批
 *
 * @param params
 */
export function postApprovaInstance(params: any) {
    return request({
        url: '/oms-project/api/t_approva_instance',
        method: 'post',
        data: params
    });
}
/**
 * 查询给定审批详情
 *
 * @param params
 */
export function getApprovalDetails(params: any) {
    return request({
        url: `/oms-project/api/Feishu/approvalDetails/${params}`,
        method: 'get',
        // data: params
    });
}
/**
 * 查询给定审批详情
 *
 * @param params
 */
export function downloadFile(params: any) {
    return request({
        url: `/oms-project/api/file/download`,
        method: 'post',
        data: params,
        responseType: 'blob',// 表明返回服务器返回的数据类型
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    });
}