import request from '@/utils/request';
import qs from 'qs'

/**
 * 项目信息列表
 *
 * @param params
 */
export function getProjectInfoPage(params: any) {
    return request({
        url: '/oms-project/api/project',
        method: 'get',
        params: params,
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        },
    });
}
/**
 * 项目信息列表
 *
 * @param params
 */
export function getMyProjectInfoPage(params: any) {
    return request({
        url: '/oms-project/api/project/myProjectMessage',
        method: 'get',
        params: params,
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        },
    });
}

/**
 * 获取项目信息列表
 *
 * @param data
 */
export function projectPost(data: any) {
    return request({
        url: '/oms-project/api/project',
        method: 'post',
        data: data
    });
}
/**
 * 编辑项目信息
 *
 * @param data
 */
export function projectPut(data: any) {
    return request({
        url: '/oms-project/api/project',
        method: 'put',
        data: data
    });
}
/**
 * 删除项目信息列表
 *
 * @param data
 */
export function projectDel(data: any) {
    return request({
        url: `/oms-project/api/project?id=${data}`,
        method: 'delete',
        // data: data
    });
}

/**
 * 获取项目详情
 *
 * @param data
 */
export function projectSelectPost(data: any) {
    return request({
        url: `/oms-project/api/project/projectDetails?id=${data}`,
        method: 'get',
        // param: data
    });
}


