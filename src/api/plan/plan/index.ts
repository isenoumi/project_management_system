import request from '@/utils/request';


/**
 * 项目计划查询全部
 *
 * @param params
 */
export function getPlanPage(params: any) {
    return request({
        url: '/oms-project/api/t_project_plan',
        method: 'get',
        params: params,
    });
}
/**
 * 项目计划查询一个
 *
 * @param params
 */
export function getPlanOne(params: any) {
    return request({
        url: `/oms-project/api/t_project_plan/${params}`,
        method: 'get',
        // params: params
    });
}
/**
 * 项目计划跟新一个
 *
 * @param params
 */
export function putPlanOne(params: any) {
    return request({
        url: `/oms-project/api/t_project_plan`,
        method: 'post',
        data: params
    });
}

/**
 * 通过id查询下级子任务
 *
 * @param data
 */
export function getSubtaskById(data: any) {
    return request({
        url: `/oms-project/api/project_plan_item/${data}/list`,
        method: 'get',
        // data: data
    });
}
/**
 * 分页查询一级计划
 *
 * @param data
 */
export function getSubPlanPage(data: any) {
    return request({
        url: `/oms-project/api/project_plan_item`,
        method: 'get',
        params: data
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
        url: `/oms-project/api/project_plan_item/${data}`,
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
        url: `/oms-project/api/project_plan_item`,
        method: 'post',
        data: data
    });
}
/**
 * 批量更新
 *
 * @param data
 */
export function subTaskUpdateList(data: any) {
    return request({
        url: `/oms-project/api/project_plan_item/updateList`,
        method: 'post',
        data: data
    });
}
