import request from '@/utils/request';


/**
 * 售前支持查询详情
 *
 * @param params
 */
export function getclientDetailsAbove(params: any) {
    return request({
        url: '/oms-project/api/project/clientDetailsAbove',
        method: 'get',
        params: params
    });
}



/**
 * 新增售前支持
 *
 * @param params
 */
export function getpreSalesSupportInsert(data: any) {
    return request({
        url: '/oms-project/api/preSalesSupport/preSalesSupportInsert',
        method: 'post',
        data: data
    });
}

/**
 * 重新提起售前支持
 *
 * @param params
 */
export function getpreSalesSupportEdite(data: any) {
    return request({
        url: '/oms-project/api/preSalesSupport/restartPreSalesSupport',
        method: 'post',
        data: data
    });
}


/**
 * 查询决策人
 *
 * @param params
 */
export function requestHandler(data: any) {
    return request({
        url: '/oms-project/api/project/requestHandler',
        method: 'get',
        params:data
    });
}



/**
 * 查询决策人
 *
 * @param params
 */
export function getpreSalesSupport(data: any) {
    return request({
        url: '/oms-project/api/preSalesSupport/page',
        method: 'get',
        params:data
    });
}



/**
 * 查询决策人
 *
 * @param params
 */
export function getPreid(data: any) {
    return request({
        url: `/oms-project/api/preSalesSupport/${data}`,
        method: 'get'
    });
}




/**
 * 完结售前状态
 *
 * @param params
 */
export function gettheEnd(data: any) {
    return request({
        url: `/oms-project/api/preSalesSupport/theEnd`,
        method: 'get',
        params:data
    });
}




/**
 * 财务报表分页
 *
 * @param params
 */
export function getprjectList(data: any) {
    return request({
        url: `/oms-project/api/preSalesSupport/prjectList`,
        method: 'get',
        params:data
    });
}

/**
 * 导出
 *
 * @param params
 */
export function exportDailyPaper(params: any) {
    return request({
        url: '/oms-project/api/preSalesSupport/export',
        method: 'get',
        params,
        responseType: 'blob',
    });
}