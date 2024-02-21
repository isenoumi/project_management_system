import request from '@/utils/request';
import qs from 'qs'

/**
 * 合同列表分页获取
 *
 * @param params
 */
export function getContractPage(params: any) {
    return request({
        url: '/oms-project/api/contract/page',
        method: 'get',
        params: params,
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        },
    });
}

/**
 * 删除合同
 *
 * @param data
 */
export function contractDel(data: any) {
    return request({
        url: `/oms-project/api/contract/${data}`,
        method: 'delete',
        // data: data
    });
}

/**
 * 新建合同
 *
 * @param data
 */
export function createContractPost(params: any) {
    return request({
        url: `/oms-project/api/contract/contractInsert`,
        method: 'post',
        data: params
    });
}
/**
 * 一级科目
 *
 * @param data
 */
export function levelOneSubjects(params: any) {
    return request({
        url: `/oms-project/api/contract/level1Subjects`,
        method: 'get',
        params
    });
}
/**
 * 二级科目
 *
 * @param data
 */
export function levelTwoSubjects(params: any) {
    return request({
        url: `/oms-project/api/contract/level2Subjects`,
        method: 'get',
        params
    });
}
/**
 * 三级科目(新增)
 *
 * @param data
 */
export function levelThreeSubjects(params: any) {
    return request({
        // url: `/oms-project/api/contract/level3Subjects`,
        url: `/oms-project/api/contract/updatelevel3Subjects`,
        method: 'get',
        params
    });
}
/**
 * 三级科目(变更)
 *
 * @param data
 */
export function levelThreeSubjectsChange(params: any) {
    return request({
        url: `/oms-project/api/contract/updatelevel3Subjects`,
        method: 'get',
        params
    });
}
/**
 * 查询合同详情
 *
 * @param data
 */
export function getContractInfo(params: any) {
    return request({
        url: `/oms-project/api/contract/${params}`,
        method: 'get',
    });
}
/**
 * 新增变更合同
 *
 * @param data
 */
export function createChangeContract(params: any) {
    return request({
        url: `/oms-project/api/contract/contractupdate`,
        method: 'post',
        data: params,
    });
}
/**
 * 查询变更合同
 *
 * @param data
 */
export function getChangeContract(params: any) {
    return request({
        url: `/oms-project/api/contract/selectSonContract`,
        method: 'get',
        params,
    });
}


