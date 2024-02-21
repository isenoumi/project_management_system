import {
    enumProjectType,
    enumProjectStatus, contractTypeEnums,
    enumProjectFirst, enumSalesperson, enumDepartment,
    enumBiddingStatus, enumExecutiveProjectLeader, enumBelongsToTheLineOfBusiness,
    enumNoticeStatus, enumTaskNoticeStatus, enumPlanStatus, enumVisit, enumProjectSourceFundsStatus
} from '@/api/enum/index.ts'
if (localStorage.getItem('accessToken')) {


    if (!localStorage.getItem('typeOptions') || !localStorage.getItem('projectStatusOptions') || !localStorage.getItem('departmentOptions') || !localStorage.getItem('belongsToTheLineOfBusinessOptions')
        || !localStorage.getItem('priorityOptions') || !localStorage.getItem('biddingStatusOptions') || !localStorage.getItem('currentGenerationOptions') || !localStorage.getItem('planProjectStatusOptions')
        || !localStorage.getItem('noticeStatusOptions') || !localStorage.getItem('taskNoticeStatusOptions') || !localStorage.getItem('planStatusOptions') || !localStorage.getItem('contractTypeEnums')
        || !localStorage.getItem('planPriorityOptions') || !localStorage.getItem('projectSourceFundsOptions') || !localStorage.getItem('salespersonOptions')) {
        enumProjectType().then(({ data }) => {
            localStorage.setItem('typeOptions', JSON.stringify(data))
        });
        contractTypeEnums().then(({ data }) => {
            localStorage.setItem('contractTypeEnums', JSON.stringify(data))
        });
        enumProjectStatus().then(({ data }) => {
            localStorage.setItem('projectStatusOptions', JSON.stringify(data))
        });
        enumProjectFirst().then(({ data }) => {
            localStorage.setItem('priorityOptions', JSON.stringify(data))
        });
        enumBiddingStatus().then(({ data }) => {
            localStorage.setItem('biddingStatusOptions', JSON.stringify(data))
        });
        enumNoticeStatus().then(({ data }) => {
            localStorage.setItem('noticeStatusOptions', JSON.stringify(data))
        });
        enumTaskNoticeStatus().then(({ data }) => {
            localStorage.setItem('taskNoticeStatusOptions', JSON.stringify(data))
        });
        enumPlanStatus('PlanStatusEnums').then(({ data }) => {
            localStorage.setItem('planStatusOptions', JSON.stringify(data))
        });
        enumPlanStatus('PriorityEnums').then(({ data }) => {
            localStorage.setItem('planPriorityOptions', JSON.stringify(data))
        });
        enumPlanStatus('PriorityStatusEnums').then(({ data }) => {
            localStorage.setItem('planProjectStatusOptions', JSON.stringify(data))
        });
        enumVisit('VisitStageEnum').then(({ data }) => {
            localStorage.setItem('currentGenerationOptions', JSON.stringify(data))
        });
        enumVisit('VisitPersonnelEnum').then(({ data }) => {
            localStorage.setItem('visitPersonnelOptions', JSON.stringify(data))
        });
        enumProjectSourceFundsStatus().then(({ data }) => {
            localStorage.setItem('projectSourceFundsOptions', JSON.stringify(data))
        });
        enumExecutiveProjectLeader().then(({ data }) => {
            localStorage.setItem('executiveProjectLeaderOptions', JSON.stringify(data))
        });
        enumSalesperson().then(({ data }) => {
            localStorage.setItem('salespersonOptions', JSON.stringify(data))
        });
        enumDepartment().then(({ data }) => {
            localStorage.setItem('departmentOptions', JSON.stringify(data))
        });
        enumBelongsToTheLineOfBusiness().then(({ data }) => {
            localStorage.setItem('belongsToTheLineOfBusinessOptions', JSON.stringify(data))
        });
    }
}

export const myDict = (form) => {
    if (form.projectType && typeof form.projectType == 'object') {
        if (form.projectType.length > 0) {
            let result = ''
            JSON.parse(localStorage.getItem('typeOptions')).forEach((item) => {
                form.projectType.forEach((item2, index) => {
                    if (item.value == item2) {
                        result += ' ' + item.label;
                    }
                });

            });
            form.projectType = result;
        } else form.projectType = ''
    }
    if (form.projectFirstLevel) {
        JSON.parse(localStorage.getItem('priorityOptions')).forEach((item) => {
            if (item.value == form.projectFirstLevel) {
                form.projectFirstLevel = item.label
            }
        });
    }
    if (form.department) {
        JSON.parse(localStorage.getItem('departmentOptions')).forEach((item) => {
            if (item.value == form.department) {
                form.department = item.label
            }
        });
    }
    if (form.lineOfBusiness && typeof form.lineOfBusiness == 'object') {
        if (form.lineOfBusiness.length > 0) {
            let result = ''
            JSON.parse(localStorage.getItem('belongsToTheLineOfBusinessOptions')).forEach((item) => {
                form.lineOfBusiness.forEach((item2, index) => {
                    if (item.value == item2) {
                        result += ' ' + item.label;
                    }
                });

            });
            form.lineOfBusiness = result;
        } else form.lineOfBusiness = '';
    }
    if (form.projectStatus) {
        JSON.parse(localStorage.getItem('projectStatusOptions')).forEach((item) => {
            if (item.value == form.projectStatus) {
                form.projectStatus = item.label
            }
        });
    }
    if (form.biddingStatus) {
        JSON.parse(localStorage.getItem('biddingStatusOptions')).forEach((item) => {
            if (item.value == form.biddingStatus) {
                form.biddingStatus = item.label
            }
        });
    }
    if (form.projectSourceFunds) {
        JSON.parse(localStorage.getItem('projectSourceFundsOptions')).forEach((item) => {
            if (item.value == form.projectSourceFunds) {
                form.projectSourceFunds = item.label
            }
        });
    }
    // if (form.salesperson) {
    //     JSON.parse(localStorage.getItem('salespersonOptions')).forEach((item) => {
    //         if (item.value == form.salesperson) {
    //             form.salesperson = item.label
    //         }
    //     });
    // }
    if (form.currentGeneration) {
        JSON.parse(localStorage.getItem('currentGenerationOptions')).forEach((item) => {
            if (item.value == form.currentGeneration) {
                form.currentGeneration = item.label
            }
        });
    }
    if (form.theStageToWhichItBelongs) {
        let temp = ''
        if (form.theStageToWhichItBelongs.length > 0) {
            JSON.parse(localStorage.getItem('currentGenerationOptions')).forEach((item) => {
                form.theStageToWhichItBelongs.forEach(element => {
                    if (item.value == element) {
                        temp += item.label + ' '
                    }
                });

            });
            form.theStageToWhichItBelongs = temp
        } else form.theStageToWhichItBelongs = ''
    }
    if (form.executiveProjectLeader) {
        JSON.parse(localStorage.getItem('executiveProjectLeaderOptions')).forEach((item) => {
            if (item.value == form.executiveProjectLeader) {
                form.executiveProjectLeader = item.label
            }
        });
    }
    if (form.area) {
        if (typeof form.area == 'string') {
            let temp = ''
            form.area.split(',').forEach(item => {
                temp += item
            });
            form.area = temp
        } else if (typeof form.area == 'object') {
            if (form.area.length > 0) {
                let temp = ''
                form.area.forEach(item => {
                    temp += item
                });
                form.area = temp
            } else form.area = ''
        }


    }
    if (form.address) {
        if (typeof form.address == 'string') {
            let temp = ''
            form.address.split(',').forEach(item => {
                temp += item
            });
            form.address = temp
        } else if (typeof form.address == 'object') {
            if (form.address.length > 0) {
                let temp = ''
                form.address.forEach(item => {
                    temp += item
                });
                form.address = temp
            }
        }


    }
    return form
}
