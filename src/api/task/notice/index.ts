import request from '@/utils/request';


/**
 * 通知查询分页
 *
 * @param params
 */
export function getNoticePage(params: any) {
    return request({
        url: '/oms-project/api/notice/list',
        method: 'post',
        data: params
    });
}
/**
 * 通知保存
 *
 * @param params
 */
export function saveNotice(params: any) {
    return request({
        url: `/oms-project/api/notice`,
        method: 'post',
        data: params
    });
}
/**
 * 通知查询一个
 *
 * @param params
 */
export function getNoticeOne(params: any) {
    return request({
        url: `/oms-project/api/notice/details`,
        method: 'get',
        params: params
    });
}

/**
 * 通知删除
 *
 * @param params
 */
export function delNotice(params: any) {
    return request({
        url: `/oms-project/api/notice`,
        method: 'delete',
        params: params
    });
}
/**
 * 通知发布
 *
 * @param data
 */
export function releaseNotice(data: any) {
    return request({
        url: `/oms-project/api/notice/publish`,
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
 * 删除树结构数据
 *
 * @param data
 */
export function delPlan(data: any) {
    return request({
        url: `/oms-bidding/api/project_plan_item/${data}`,
        method: 'delete',
        // data: data
    });
}
/**
 * 添加子任务
 *
 * @param data
 */
export function addSubtask(data: any) {
    return request({
        url: `/oms-bidding/api/project_plan_item`,
        method: 'post',
        data: data
    });
}

/**
 * 获取项目详情
 *
 * @param data
 */
export function biddingSelectPost(data: any) {
    return request({
        url: `/oms-bidding/api/bidding/select?id=${data}`,
        method: 'get',
        // param: data
    });
}