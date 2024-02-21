import request from '@/utils/request';


/**
 * 主表列表
 *
 * @param param
 */
export function paymentInsert(params: any) {
    return request({
        url: '/oms-unify/api/payment/paymentInsert',
        method: 'post',
        data: params,
    });
}
/**
 * 主表列表
 *
 * @param param
 */
export function paymentEdit(params: any) {
    return request({
        url: '/oms-unify/api/payment/paymentEdite',
        method: 'put',
        data: params,
    });
}
/**
 * 主表列表
 *
 * @param param
 */
export function paymentDelete(params: any) {
    return request({
        url: `/oms-unify/api/payment/${params}`,
        method: 'delete',
    });
}

/**
 * 新增表格数据
 *
 * @param param
 */
export function paymentPage(params: any) {
    return request({
        url: '/oms-unify/api/payment/page',
        method: 'get',
        params,
    });
}
/**
 * 新增表格数据
 *
 * @param param
 */
export function getRecoveryPoint(params: any) {
    return request({
        url: '/oms-unify/api/recoveryPoint/recoveryPointsItem',
        method: 'get',
        params,
    });
}



/**
 * 查支付管理表格数据
 *
 * @param param
 */
export function getstatusPage(params: any) {
    return request({
        url: '/oms-project/api/budgetExamine/statusPage',
        method: 'get',
        params,
    });
}



/**
 * 查审批类型枚举
 *
 * @param param
 */
export function getexamineTypeEnums() {
    return request({
        url: '/oms-project/api/budgetExamine/examineTypeEnums',
        method: 'get',
    });
}



/**
 * 查审批类型枚举
 *
 * @param param
 */
export function getediteMoney(params: any) {
    return request({
        url: '/oms-project/api/budgetSubject/editeMoney',
        method: 'get',
        params
    });
}




/**
 * 获取视频
 *
 * @param param
 */
export function getHKData(params: any) {
    return request({
        url: '/jeecg-boot/test/jeecgDemo/HKData',
        method: 'get',
        params
    });
}
