import request from '@/utils/request';
import qs from 'qs'

/**
 * 拜访信息列表
 *
 * @param params
 */
export function getVisitInfoPage(params: any) {
    return request({
        url: '/oms-project/api/client_visit/listView',
        method: 'get',
        params: params,
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        },
    });
}

/**
 * 获取拜访信息列表
 *
 * @param data
 */
export function visitPost(data: any) {
    return request({
        url: '/oms-project/api/client_visit',
        method: 'post',
        data: data,
    });
}
/**
 * 获取拜访信息列表
 *
 * @param data
 */
export function customerVisitRecordsPost(data: any,) {
    return request({
        url: `/oms-project/api/client_visit/customerVisitRecords`,
        method: 'post',
        data,
    });
}
/**
 * 编辑拜访信息
 *
 * @param data
 */
export function customerVisitRecordsPut(data: any) {
    return request({
        url: '/oms-project/api/client_visit/updateCustomerVisitLog',
        method: 'post',
        data,
        // paramsSerializer: function (data) {
        //     return qs.stringify(data, { arrayFormat: 'repeat' })
        // },
    });
}
/**
 * 删除拜访信息列表
 *
 * @param data
 */
export function visitDel(data: any) {
    return request({
        url: `/oms-project/api/client_visit/deleteTheCustomerRecord?id=${data}`,
        method: 'delete',
        // data: data
    });
}

/**
 * 获取拜访详情
 *
 * @param data
 */
// export function visitInfoGet(data: any) {
//     return request({
//         url: `/oms-project/api/client_visit/listView?id=${data}`,
//         method: 'get',
//         // param: data
//     });
// }
/**
 * 获取拜访记录
 *
 * @param data
 */
export function visitInfoGet(data: any) {
    return request({
        url: `/oms-project/api/visit_log`,
        method: 'get',
        params: data
    });
}
/**
 * 新增拜访记录
 *
 * @param data
 */
export function visitRecordsPost(data: any) {
    return request({
        url: `/oms-project/api/visit_log`,
        method: 'post',
        data: data
    });
}
/**
 * 查询所有
 *
 * @param data
 */
export function customerVisitIdGet(data: any) {
    return request({
        url: `/oms-project/api/client_visit/checkAllByCustomerVisitId`,
        method: 'get',
        params: data
    });
}
/**
 * 查询子表
 *
 * @param data
 */
export function getprojectTableDataApi(data: any) {
    return request({
        url: `/oms-project/api/project/customerProfilePagination`,
        method: 'get',
        params: data
    });
}
/**
 * 立项
 *
 * @param data
 */
export function projectEstablishment(data: any) {
    return request({
        url: `/oms-project/api/project/buildProject`,
        method: 'get',
        params: data
    });
}
/**
 * 招投标
 *
 * @param data
 */
export function bidding(data: any) {
    return request({
        url: `/oms-project/api/project/tender`,
        method: 'get',
        params: data
    });
}

/**
 * 客户跟进记录获取
 *
 * @param data
 */
export function getClientDetailsApi(data: any) {
    return request({
        url: `/oms-project/api/project/clientDetailsDown`,
        method: 'get',
        params: data
    });
}
/**
 * 获取经办人
 *
 * @param data
 */
export function getLinkManApi(data: any) {
    return request({
        url: `/oms-project/api/project/requestHandler`,
        method: 'get',
        params: data
    });
}

/**
 * 获取经办人
 *
 * @param data
 */
export function exportExcelApi(params: any) {
    return request({
        url: `/oms-project/api/project/customerProfileImport`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    });
}


