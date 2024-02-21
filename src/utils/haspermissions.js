export const hasPermission = {
    install(Vue) {
        //自定义指令v-has：
        Vue.directive('has', {
            mounted(el, binding, vnode) {
                if (!checkPermission(binding.value)) {
                    let tooltipNode = vnode.children.find((childrenCmpt) => childrenCmpt.component?.type.name == 'ElTooltip')
                    tooltipNode.component.props.disabled = false
                    el.querySelector("button").setAttribute("disabled", true)
                }
            },
        });
        //权限检查方法
        function checkPermission(value) {
            let isExist = false;
            let userlogin = JSON.parse(sessionStorage.getItem("btnList") || "[]");
            let buttonArr = userlogin.haspermissions
            //判断是否按钮有权限
            if (buttonArr.includes(value)) {
                isExist = true;
            }
            return isExist;
        }
    }
};
export default hasPermission;