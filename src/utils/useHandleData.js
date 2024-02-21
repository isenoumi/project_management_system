import {
    ElMessageBox,
    ElMessage,
    ElLoading
} from 'element-plus';

//全局loading效果
const openFullLoading = () => {
    const fullLoading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    return fullLoading
}

export const useHandleData = (api, params = {}, message = '删除', confirmType = 'warning') => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(`是否${message}此数据?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: confirmType,
            draggable: true
        }).then(async () => {
            try {
                openFullLoading()
                await api(params);
                ElMessage({
                    type: 'success',
                    message: `${message}成功!`
                });
            } finally {
                openFullLoading().close()
            }
            resolve(true);
        });
    });
};