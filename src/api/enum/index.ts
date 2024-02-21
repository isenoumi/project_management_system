import request from '@/utils/request';


/**
 * 项目类型
 *
 * @param params
 */
export function enumProjectType() {
    return request({
        url: '/oms-project/api/project/projectType',
        method: 'get',
    });
}
/**
 * 项目状态
 *
 * @param params
 */
export function enumProjectStatus() {
    return request({
        url: '/oms-project/api/project/projectStatus',
        method: 'get',
    });
}
/**
 * 项目优先级
 *
 * @param params
 */
export function enumProjectFirst() {
    return request({
        url: '/oms-project/api/project/projectPriority',
        method: 'get',
    });
}
/**
 * 招标状态
 *
 * @param params
 */
export function enumBiddingStatus() {
    return request({
        url: '/oms-project/api/project/biddingStatus',
        method: 'get',
    });
}
/**
 * 通知状态
 *
 * @param params
 */
export function enumNoticeStatus() {
    return request({
        url: '/oms-project/api/project/noticeStatus',
        method: 'get',
    });
}
/**
 * 通知状态
 *
 * @param params
 */
export function enumTaskNoticeStatus() {
    return request({
        url: '/oms-project/api/project/noticeType',
        method: 'get',
    });
}
/**
 * 项目资金来源
 *
 * @param params
 */
export function enumProjectSourceFundsStatus() {
    return request({
        url: '/oms-project/api/project/budgetPhase',
        method: 'get',
    });
}
/**
 * 项目执行经理
 *
 * @param params
 */
export function enumExecutiveProjectLeader() {
    return request({
        url: '/oms-project/api/project/projectHead',
        method: 'get',
    });
}
/**
 * 銷售
 *
 * @param params
 */
export function enumSalesperson() {
    return request({
        // url: '/oms-project/api/project/salesperson',
        url: '/oms-sys/api/depart/salesperson',
        method: 'get',
    });
}
/**
 * 所属业务线
 *
 * @param params
 */
export function enumBelongsToTheLineOfBusiness() {
    return request({
        url: '/oms-project/api/project/belongsToTheLineOfBusiness',
        method: 'get',
    });
}
/**
 * 所属部门
 *
 * @param params
 */
export function enumDepartment() {
    return request({
        url: '/oms-project/api/project/department',
        method: 'get',
    });
}
/**
 * 合同类型
 *
 * @param params
 */
export function contractTypeEnums() {
    return request({
        url: '/oms-project/api/contract/contractTypeEnums',
        method: 'get',
    });
}
/**
 * 所属项目id
 *
 * @param params
 */
export function belongsToTheProject() {
    return request({
        url: '/oms-project/api/contract/fuzzyQueryForTheProject',
        method: 'get',
    });
}
/**
 * 计划状态
 *
 * @param params
 */
export function enumPlanStatus(params: string) {
    return request({
        url: `/oms-project/api/t_project_plan/dict/${params}`,
        method: 'get',
    });
}
/**
 * 拜访字典
 *
 * @param params
 */
export function enumVisit(params: string) {
    return request({
        url: `/oms-project/api/client_visit/dict/${params}`,
        method: 'get',
    });
}

/**
 * 枚举接口
 *
 * @param params
 */
export function getEnums(params: string) {
    return request({
        url: `/oms-project/api/enums/selectEnum`,
        method: 'get',
        params,
    });
}

