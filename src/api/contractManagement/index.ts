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