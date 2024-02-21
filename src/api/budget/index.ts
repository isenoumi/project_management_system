import request from '@/utils/request';


/**
 * 项目预算一级列表
 *
 * @param params
 */
export function getProjectBudget(params: any) {
    return request({
        url: '/oms-project/api/ProjectBudget/budgetDtoListlistbyuse',
        method: 'get',
        params: params
    });
}

/**
 * 项目预算一级列表-下拉表格
 *
 * @param data
 */
export function getbyparentid(id: any) {
    return request({
        url: '/oms-project/api/ProjectBudget/' + id,
        method: 'get',
        // params: params
    });
}
/**
 * 获取项目预算查看弹框
 *
 * @param data 
 */
export function getProjectBudgetbyparentid(params: any) {
    return request({
        url: '/oms-project/api/ProjectBudget/byparentid',
        method: 'get',
        params: params
    });
}
/**
 * 删除项目信息列表
 *
 * @param data
 */
export function budgetSubject(id: any) {
    return request({
        url: '/oms-project/api/budgetSubject/' + id,
        method: 'delete',
        // data: data
    });
}

/**
 * 根据三级预算parentId找到一级二级预算名称
 *
 * @param data
 */

export function getitemname(id: string) {
    return request({
        url: '/oms-project/api/budgetSubject/getitemname?parentId=' + id,
        method: 'get',
        // params: id
    });
}
/**
 * 根据三级预算找到审批列表
 *
 * @param data
 */

export function getbudgetExamine(params: any) {
    return request({
        url: '/oms-project/api/budgetExamine/page',
        method: 'get',
        params: params
    });
}

/**
 * 新建接口根据三级预算得到导入文件中有数据的月份
 *
 * @param data
 */

export function getNotNullMonth(id: any) {
    return request({
        url: '/oms-project/api/budgetExamine/getNotNullMonth?budgetSubjectId=' + id,
        method: 'get',
        // params: params
    });
}

/**
 * 根据三级预算和所属月份得到可用金额
 *
 * @param data
 */

export function budgetExamine(params: any) {
    return request({
        url: '/oms-project/api/budgetExamine/getMonthBudget',
        method: 'get',
        params: params
    });
}
/**
 * 根新增审批数据
 *
 * @param data
 */

export function getinsert(data: any) {
    return request({
        url: '/oms-project/api/budgetExamine/insert',
        method: 'post',
        data: data
    });
}


/**
 * 根新增审批数据
 *
 * @param data
 */

export function getspLits(params: any) {
    return request({
        url: '/oms-project/api//budgetExamine/page',
        method: 'get',
        params: params
    });
}


/**
 * 根新增审批数据
 *
 * @param data
 */

export function getprojectselect(params: any) {
    return request({
        url: '/oms-project/api/project/projectDetails',
        method: 'get',
        params: params
    });
}

/**
 * 添加
 *
 * @param data
 */

// export function getprojectselect(params: any) {
//     return request({
//         url: '/oms-project/api/t_approva_instance',
//         method: 'get',
//         params: params
//     });
// }

/**
 * 导入
 *
 * @param data
 */

export function getSubPlanPage(data: any) {
    return request({
        url: `/oms-project/api/oms-project/api/budgetSubject/importExcel`,
        method: 'post',
        params: data
    });
}

/**
 * 飞书实例创建
 *
 * @param data
 */
export function getfeishuCreatesAnApproval(params: any) {
    return request({
        url: `/oms-project/api/Feishu/feishuCreatesAnApproval`,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data;'
        }
    });
}

/**
 * 飞书实例创建
 *
 * @param data
 */
export function gettApprovaInstance(data: any) {
    return request({
        url: `/oms-project/api/t_approva_instance`,
        method: 'post',
        data: data
    });
}

/**
 * 根据三级预算找到审批列表
 *
 * @param data
 */
export function getbudgetExaminepage(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/page`,
        method: 'get',
        params: data
    });
}


/**
 * 修改三级预算
 *
 * @param data
 */
export function getbudgetSubject(data: any) {
    return request({
        url: `/oms-project/api//budgetSubject/edite`,
        method: 'post',
        data: data
    });
}

/**
 * 新增三级预算
 *
 * @param data
 */
export function getaddbudgetSubject(data: any) {
    return request({
        url: `/oms-project/api/budgetSubject`,
        method: 'post',
        data: data
    });
}


/**
 * 项目优先级枚举
 *
 * @param data
 */
export function getemp2() {
    return request({
        url: `/oms-project/api/project/projectPriority`,
        method: 'get',
        // params: data
    });
}


/**
 * 项目状态枚举
 *
 * @param data
 */
export function getemp1() {
    return request({
        url: `/oms-project/api/project/projectStatus`,
        method: 'get',
        // params: data
    });
}


/**
 * 返回审批类型枚举
 *
 * @param data
 */
export function getselectExamineTypeEnums() {
    return request({
        url: `/oms-project/api/budgetExamine/selectExamineTypeEnums`,
        method: 'get',
        // params: data
    });
}

/**
 * 返回合同类型枚举
 *
 * @param data
 */
export function getselectContractTypeEnums() {
    return request({
        url: `/oms-project/api/budgetExamine/selectContractTypeEnums`,
        method: 'get',
        // params: data
    });
}


/**
 * 返回支付方式枚举
 *
 * @param data
 */
export function getselectPaymentWayEnums() {
    return request({
        url: `/oms-project/api/budgetExamine/selectPaymentWayEnums`,
        method: 'get',
        // params: data
    });
}


/**
 * 返回报销类型枚举
 *
 * @param data
 */
export function getselectReimbursementTypeEnums() {
    return request({
        url: `/oms-project/api/budgetExamine/selectReimbursementTypeEnums`,
        method: 'get',
        // params: data
    });
}



/**
 * 根据审批id找到分页查询所有报销明细数据
 *
 * @param data
 */
export function getpagebyExamineId(data: any) {
    return request({
        url: `/oms-project/api/budgetReimbursement/pagebyExamineId`,
        method: 'get',
        params: data
    });
}


/**
 *设置预算上限
 * @param data
 */
export function getisupperLimit(data: any) {
    return request({
        url: `/oms-project/api/ProjectBudget/isupperLimit`,
        method: 'post',
        params: data
    });
}

/**
 *一级科目下拉
 * @param data
 */
export function getlevel1Subjects(data: any) {
    return request({
        url: `/oms-project/api/contract/level1Subjects`,
        method: 'get',
        params: data
    });
}

/**
 *二级科目下拉
 * @param data
 */
export function getlevel2Subjects(data: any) {
    return request({
        url: `/oms-project/api/contract/level2Subjects`,
        method: 'get',
        params: data
    });
}

/**
 *三级科目下拉
 * @param data
 */
export function getlevel3Subjects(data: any) {
    return request({
        url: `/oms-project/api/contract/level2Subjects`,
        method: 'get',
        params: data
    });
}
/**
 *分页查询付款审批记录
 * @param data
 */
export function getlistExamineRecord(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/listExamineRecord`,
        method: 'get',
        params: data
    });
}

/**
 *查询费用报销表格
 * @param data
 */
export function getbudpage(data: any) {
    return request({
        url: `/oms-project/api/budgetSubject/${data.id}`,
        method: 'get',
        // params: data
    });
}


/**
 *发起费用报销
 * @param data
 */
export function getsubmitFeeApply(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/submitFeeApply`,
        method: 'post',
        data: data
    });
}
/**
 *发起备用金
 * @param data
 */
export function postReimbursementOfReserves(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/reimbursementOfReserves`,
        method: 'post',
        data: data
    });
}


/**
 *发起非合同付款申请
 * @param data
 */
export function getsubmitNonContractualFeeApply(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/submitNonContractualFeeApply`,
        method: 'post',
        data: data
    });
}

/**
 *获取预算科目统计
 * @param data
 */
export function getSubjectStatistic(data: any) {
    return request({
        url: `/oms-project/api/budgetSubject/getSubjectStatistic`,
        method: 'get',
        params: data
    });
}



/**
 *新增三级预算
 * @param data
 */
export function getbudgetSubjects(data: any) {
    return request({
        url: `/oms-project/api/budgetSubject`,
        method: 'post',
        data: data
    });
}

/**
 *编辑三级科目金额
 * @param data
 */
export function getupdateSubjectPrice(data: any) {
    return request({
        url: `/oms-project/api/budgetSubject/updateSubjectPrice`,
        method: 'post',
        data: data
    });
}



/**
 *查询项目下所有三级科目
 * @param data
 */
export function getlevelAllThreeSubjects(data: any) {
    return request({
        url: `/oms-project/api/budgetSubject/levelAllThreeSubjects`,
        method: 'get',
        params: data
    });
}


/**
 *查询项目下的合同列表
 * @param data
 */
export function getlistContractByProjectId(data: any) {
    return request({
        url: `/oms-project/api/contract/listContractByProjectId`,
        method: 'get',
        params: data
    });
}


/**
 *根据合同ID获取科目列表
 * @param data
 */
export function getlistSubjectByContractId(data: any) {
    return request({
        url: `/oms-project/api/budgetSubject/listSubjectByContractId`,
        method: 'get',
        params: data
    });
}


/**
 *发起合同付款申请
 * @param data
 */
export function getsubmitContractualFeeApply(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/submitContractualFeeApply`,
        method: 'post',
        data: data
    });
}



/**
 *获取新操作预算列表
 * @param data
 */
export function getheOperationRecordIsDisplayed(params: any) {
    return request({
        url: `/oms-project/api/budgetExamine/theOperationRecordIsDisplayed`,
        method: 'get',
        params
    });
}


/**
 *新增操作记录
 * @param data
 */
export function getaccountAmountModification(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/accountAmountModification`,
        method: 'get',
        params: data
    });
}



/**
 *新操作列表
 * @param data
 */
export function getqueryAccountInformation(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/queryAccountInformation`,
        method: 'get',
        params: data
    });
}



/**
 *新操作列表
 * @param data
 */
export function getgetId(data: any) {
    return request({
        url: `oms-project/api/budgetExamine/getId?id=${data}`,
        method: 'get'
    });
}


/**
 *结束付款申请
 * @param data
 */
export function gettheEndExamine(data: any) {
    return request({
        url: `/oms-project/api/budgetExamine/theEndExamine?id=${data}`,
        method: 'post',
        // data:data
    });
}
//