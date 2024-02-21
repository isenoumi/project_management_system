import request from '@/utils/request';


/**
 * 项目信息列表
 *
 * @param params
 */
export function getBiddingPage(params: any) {
    return request({
        url: '/oms-project/api/Tenders',
        method: 'post',
        data: params
    });
}

/**
 * 招投标管理
 *
 * @param data
 */
export function biddingPost(data: any) {
    return request({
        url: '/oms-project/api/Tenders/bidding',
        method: 'post',
        data: data
    });
}
/**
 * 编辑招投标信息
 *
 * @param data
 */
export function biddingEdit(data: any) {
    return request({
        url: '/oms-project/api/Tenders/edit',
        method: 'post',
        data: data
    });
}

/**
 * 获取招投标操作记录
 *
 * @param data
 */
export function biddingSelect(data: any) {
    return request({
        url: `/oms-project/api/Tenders/details?id=${data}`,
        method: 'get',
        // param: data
    });
}