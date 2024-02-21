import request from '@/utils/request';


/**
 * 日历计划信息查询
 *
 * @param params
 */
export function getFullCalendarPlan(params: any) {
    return request({
        url: '/oms-project/api/project_plan_item/list/calendar',
        method: 'get',
        params
    });
}
/**
 * 日历计划信息查询
 *
 * @param params
 */
export function getFullCalendarPlanAll(params: any) {
    return request({
        url: '/oms-project/api/project_plan_item/list/project/calendar',
        method: 'get',
        params
    });
}
/**
 * 全参分页查询
 *
 * @param params
 */
export function getDailyPaper(params: any) {
    Object.assign(params, { pageSize: 9999 })
    return request({
        url: '/oms-project/api/daily_paper',
        method: 'get',
        params
    });
}
/**
 * 新增日报
 *
 * @param params
 */
export function postDailyPaper(params: any) {
    return request({
        url: '/oms-project/api/daily_paper',
        method: 'post',
        data: params,
    });
}
/**
 * 编辑日报
 *
 * @param params
 */
export function putDailyPaper(params: any) {
    return request({
        url: '/oms-project/api/daily_paper',
        method: 'put',
        params
    });
}
/**
 * 编辑日报
 *
 * @param params
 */
export function getUserList() {
    return request({
        url: '/oms-sys/api/user/userDepartmentList',
        method: 'get',
    });
}


/**
 * 添加日报评论
 *
 * @param params
 */
export function postDailyRemark(params: any) {
    return request({
        url: '/oms-project/api/dailyComment/dailyCommentInsert',
        method: 'post',
        data: params,
    });
}

/**
 * 查询日报评论
 *
 * @param params
 */
export function getDailyRemark(params: any) {
    return request({
        url: '/oms-project/api/dailyComment/page',
        method: 'get',
        params,
    });
}
/**
 * 查询日报评论
 *
 * @param params
 */
export function getDailyRemarkById(params: any) {
    return request({
        url: `/oms-project/api/dailyComment/${params}`,
        method: 'get',
    });
}
/**
 * 查询部门
 *
 * @param params
 */
export function getDepartment() {
    return request({
        url: '/oms-sys/api/depart/tree',
        method: 'get',
    });
}
/**
 * 查询部门下的人员
 *
 * @param params
 */
export function getDepartmentPerson(params: any) {
    return request({
        url: '/oms-sys/api/depart/getUser',
        method: 'get',
        params,
    });
}
/**
 * 查询部门下的人员
 *
 * @param params
 */
export function exportDailyPaper(params: any) {
    return request({
        url: 'oms-project/api/daily_paper/outExcel',
        method: 'post',
        params,
        responseType: 'blob',
    });
}