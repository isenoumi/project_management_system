import request from '@/utils/request';


/**
 * 通知查询分页
 *
 * @param params
 */
export function getTaskNoticePage(params: any) {
    return request({
        url: '/oms-project/api/Message/list',
        method: 'get',
        params: params
    });
}
/**
 * 通知查询一个
 *
 * @param params
 */
export function getTaskNoticeOne(params: any) {
    return request({
        url: `/oms-project/api/Message`,
        method: 'get',
        params: params
    });
}
/**
 * 通过项目计划id查询详情
 *
 * @param params
 */
export function getTaskNoticeDetailsProject(params: any) {
    return request({
        url: `/oms-project/api/project_plan_item/particulars/${params}`,
        method: 'get',
        // params: params
    });
}
/**
 * 根据预算通知的预算id找到预算展示数据
 *
 * @param params
 */
export function getBudgetNoticeDetailsProject(params: any) {
    return request({
        url: `/oms-project/api/ProjectBudget/byhaveOne`,
        method: 'get',
        params: params
    });
}
/**
 * 根据预算通知的预算id找到预算展示数据
 *
 * @param params
 */
export function setReadStatus(params: any) {
    return request({
        url: `/oms-project/api/Message/updateStatus`,
        method: 'get',
        params: params
    });
}

