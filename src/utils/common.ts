import { ElMessage } from "element-plus";
/**
 * @description:  生成随机数
 * @return  随机数
 */
export function getUUID() {
    let s: any = [];
    let hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "";
    let uuid = s.join("")
    return uuid
}


/**
 * @description:  年月日转换时间戳
 * @param {*} timestamp 需要转换的内容
 * @return  转换数据格式
 */
export function timestampToTime(timestamp: any) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}


/**
 * @description:  根据时间戳转换年月日
 * @param {*} inserttime 需要转换的内容
 * @return  转换数据格式
 */
export function pastTime(inserttime: any) {
    const date = new Date().valueOf()
    const time = Math.trunc(date / 1000 - inserttime)
    if (time < 60) {
        return 'just'
    }
    if (time < 60 * 60) {
        return Math.trunc(time / 60) + ' minutes ago'
    }
    if (time < 60 * 60 * 24) {
        return Math.trunc(time / 3600) + ' hour ago'
    }
    if (time < 60 * 60 * 24 * 30) {
        return Math.trunc(time / (3600 * 24)) + ' day ago'
    }
    if (time > 60 * 60 * 24 * 30) {
        return specificDate(inserttime)
    }
}

/**
 * @description:  转换年月日
 * @param {*} time 需要转换的内容
 * @return  转换数据格式
 */
export function specificDate(time: any) {
    const date = new Date(time * 1000)
    const Y = date.getFullYear() + '-'
    const M =
        (date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1) :
            date.getMonth() + 1) + '-'
    const D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    const h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const strDate = Y + M + D + h + m
    return strDate
}

/**
 * @description:  复制文本
 * @param {*} val 需要复制的内容
 */
export function copyDomText(val: any) {
    // 获取需要复制的元素以及元素内的文本内容
    const text = val;
    // 添加一个input元素放置需要的文本内容
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    // 选中并复制文本到剪切板
    input.select();
    document.execCommand("copy");
    // 移除input元素
    document.body.removeChild(input);
    ElMessage({
        message: "复制成功",
        type: "success",
    });
}

/**
 * @description:  验证身份证归属地
 * @param {*} sId 传入身份证号码
 * @return  true 合法 false 不合法
 */
export function checkIdCard(sId: any) {
    const aCity: any = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
    var iSum = 0;
    if (!/^\d{17}(\d|X|x)$/i.test(sId)) return false;
    sId = sId.replace(/x$/i, "a");
    if (aCity[parseInt(sId.substr(0, 2))] == null) return false;
    var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    var d = new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return false;
    for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    if (iSum % 11 != 1) return false;
    // aCity[parseInt(sId.substr(0, 2))] + "," + sBirthday + "," + (sId.substr(16, 1) % 2 ? "男" : "女");//此次还可以判断出输入的身份证号的人性别
    return true;
}

/**
 * @description:  金额转换语文大写
 * @param {*} num 传入数字
 * @return  转换成功返回
 */
export function numberToChinese(num: any) {
    var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
    var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
    var a: any = ("" + num).replace(/(^0*)/g, "").split("."),
        k = 0,
        re = "";
    for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
            case 0:
                re = BB[7] + re;
                break;
            case 4:
                if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
                    .test(a[0]))
                    re = BB[4] + re;
                break;
            case 8:
                re = BB[5] + re;
                BB[7] = BB[5];
                k = 0;
                break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
            re = AA[0] + re;
        if (a[0].charAt(i) != 0)
            re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        k++;
    }

    if (a.length > 1) // 加上小数部分(如果有小数部分)
    {
        re += BB[6];
        for (var i = 0; i < a[1].length; i++)
            re += AA[a[1].charAt(i)];
    }
    if (re == '一十')
        re = "十";
    if (re.match(/^一/) && re.length == 3)
        re = re.replace("一", "");
    return re;
}

/**
 * @description:  验证手机号是否合格
 * @param {*} phoneStr  手机号
 * @return true 合格
 */
export function isPhone(phoneStr: any) {
    return /^1\d{10}$/.test(phoneStr)
}

/**
 * @description: 验证邮箱
 * @param {*} email 邮箱
 * @return true 合格
 */
export function checkEmail(email: any) {
    return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(
        email);
}

/**
 * @description: 验证身份证号是否合格
 * @param {*} idCardStr 生份证号
 * @return true 说明合格
 */
export function isIdCard(idCardStr: any) {
    let idcardReg =
        /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    return idcardReg.test(idCardStr);
}

/**
 * @description:  验证字符串是否为空
 * @param {*} string 
 * @return ture 说明为空 false 说明不为空
 */
export function isEmptyString(string: any) {
    if (
        string == undefined ||
        typeof string == 'undefined' ||
        !string ||
        string == null ||
        string == '' ||
        /^\s+$/gi.test(string)
    ) {
        return true;
    } else {
        return false;
    }
}
/**
 * @description: 
 * @param {any} val - 基本类型数据或者引用类型数据
 * @return {string} - 可能返回的结果有，均为小写字符串 
 * number、boolean、string、null、undefined、array、object、function等
 */
export function getType(val: any) {
    //判断数据是 null 和 undefined 的情况
    if (val == null) {
        return val + "";
    }
    return typeof (val) === "object" ?
        Object.prototype.toString.call(val).slice(8, -1).toLowerCase() :
        typeof (val);
}

// 验证是否为数字
export function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// 是否为数组
export function isArray(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

//  是否为空数组
export function isArrayEmpty(val: any) {
    if (val && val instanceof Array && val.length > 0) {
        return false;
    } else {
        return true;
    }
}
/**
 * @description: 获取url参数字符串没有返回null
 * @param {*} name 路径
 */
export function getQueryString(name: any) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

/**
 * @description  函数防抖，用于将多次执行变为最后一次执行
 * @param {function} func - 需要使用函数防抖的被执行的函数。必传
 * @param {Number} wait - 多少毫秒之内触发，只执行第一次，默认1000ms。可以不传
 */
export function debounce(fn: any, delay: any) {
    delay = delay || 1000; //默认1s后执行
    let timer: any = null;
    return function () {
        let arg = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(arg);
        }, delay);
    };
}
/**
 * @description  节流函数, 用于将多次执行变为每隔一段时间执行
 * @param fn 事件触发的操作
 * @param delay 间隔多少毫秒需要触发一次事件
 */
export function throttle(fn: any, delay: any) {
    let timer: any = null;
    return () => {
        let args = arguments;
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(args);
                clearTimeout(timer);
            }, delay);
        }
    };
}

/**
 * @description:  将字符串时间转换为时间戳
 * @param {string} date 时间
 * @return {String} timestamp 时间戳
 */
export function getDateTime(date: any) {
    let timestamp: any = '';
    if (date) {
        date = date.substring(0, 19);
        date = date.replace(/-/g, '/'); //必须把日期'-'转为'/'
        timestamp = new Date(date).getTime();
    }
    return timestamp;
}


/**
 * @description:  获取当前日期前后多少天的日期，多少天前传正数，多少天后传负数，今天传0
 * @param {*} num 为传入的数字
 * @param {*} time 为传入的指定日期，如果time不传，则默认为当前时间
 */
export function getBeforeDate(num: any, time: any) {
    let n = num;
    let d: any = '';
    if (time) {
        d = new Date(time);
    } else {
        d = new Date();
    }
    let year = d.getFullYear();
    let mon = d.getMonth() + 1;
    let day = d.getDate();
    if (day <= n) {
        if (mon > 1) {
            mon = mon - 1;
        } else {
            year = year - 1;
            mon = 12;
        }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
}
/**
 * @description:  获取年-月-日
 * @param {String} data  时间戳
 */
export function getDates(data: any) {
    let timeObj = {};
    data = new Date(data);
    let y = data.getFullYear();
    let m =
        data.getMonth() + 1 < 10 ?
            '0' + (data.getMonth() + 1) :
            data.getMonth() + 1;
    let d = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
    let w = data.getDay();
    switch (w) {
        case 1:
            w = '星期一';
            break;
        case 2:
            w = '星期二';
            break;
        case 3:
            w = '星期三';
            break;
        case 4:
            w = '星期四';
            break;
        case 5:
            w = '星期五';
            break;
        case 6:
            w = '星期六';
            break;
        case 7:
            w = '星期日';
            break;
    }
    let h = data.getHours() < 10 ? '0' + data.getHours() : data.getHours();
    let mi = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();
    let s = data.getSeconds() < 10 ? '0' + data.getSeconds() : data.getSeconds();
    // 年月日 星期几 时分秒
    timeObj = {
        year: y + '',
        month: m + '',
        day: d + '',
        week: w + '',
        hour: h + '',
        minute: mi + '',
        second: s + ''
    };
    return timeObj;
}



/**
 * @description: 提取富文本中文字和图片
 * @param {String} htmlStr 富文本字符串
 * @returns 文字 图片路径
 */
export function plainTextContent(htmlStr: any) {
    const htmlTagsRegex = /<[^>]+>/g; // 匹配html标签的正则表达式
    const text = htmlStr.replace(htmlTagsRegex, ''); // 提取纯文本
    const urls = htmlStr.match(/(?<=src=")(.+?)(?=")/g);
    let url = null;
    urls && urls.length ? url = urls[0] : null
    return {
        text,
        url
    };
}

/**
 * @description: 数字转单位
 * @param {Number} value
 */
export function bigNumberTransform(value: any) {
    let param = '';
    let k = 10000,
        sizes = ['', 'W', '亿', '万亿'],
        i;
    if (value < k) {
        param = value
    } else {
        i = Math.floor(Math.log(value) / Math.log(k));
        param = ((value / Math.pow(k, i))).toFixed(2) + sizes[i];
    }
    return param;
}

/**
 * @description:  获取富文本纯文字长度
 * @param {String} str 带标签的字符串
 * @return {Number} 字符串长度
 */
export function strLength(str: String) {
    return str.replace(/<\/?[^>]*>/g, '').length
}

/**
 * @description:  搜索高亮关键字
 * @param {Array} keywords 返回的数组
 * @param {String} keyword 搜索的keyword
 */
export function drawCorrelativeKeyword(keywords: any, keyword: any) {
    var len = keywords.length,
        keywordArr = [];
    for (var i = 0; i < len; i++) {
        var row = keywords[i];
        var html = row[0].replace(keyword, "<span style='color: #EB645E;'>" + keyword + "</span>");
        html = '<div>' + html + '</div>';
        var tmpObj = {
            keyword: row[0],
            htmlStr: html
        };
        keywordArr.push(tmpObj)
    }
    return keywordArr;
}


/**
* 加密手机号码
* @param {Object} param 需要加密手机号码
*/
export function encryptPhone(param: any) {
    var param = param.toString();
    return param.substring(0, 3) + '****' + param.substring(7, 11);
}


/**
* 去字符串中所有空格
* @param {Object} str 需要去空格的字符串
*/
export function deleteSpaceAll(str: any) {
    str = str.toString();
    return str.replace(/\s/g, "");
}


/**
* 去字符串中左右两边的空格
* @param {Object} str 需要去空格的字符串
*/
export function deleteSpaceLR(str: any) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}


/**
* 判断是否为空
* @param {Object} str
*/
export function isNull(str: any) {
    if (typeof (str) == 'number') {
        str = str.toString();
    }
    if (str.replace(/(^s*)|(s*$)/g, "").length == 0) {
        return true;
    }
    return false;
}


/**
* 取得一个区间的随机整数
* @param {Object} n 开始数字
* @param {Object} m 结束数字
*/
export function rand(n: any, m: any) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
}


/**
* 公共输入金额格式化(保留小数0.01位)
* @param {Object} a 是需要被处理的值
*/
export function doubleFloat(a: any) {
    //先把非数字的都替换掉，除了数字和.
    a = a.replace(/[^\d\.]/g, '');
    //必须保证第一个为数字而不是.
    a = a.replace(/^\./g, '');
    //保证只有出现一个.而没有多个.
    a = a.replace(/\.{2,}/g, '.');
    //保证.只出现一次，而不能出现两次以上
    a = a.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    //只能输入两位小数
    a = a.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    return a;
}


/**
* 浮点型数据 乘法
* 例如: 696.9 = 555.6 + 141.3;
* return 696.9;
*/
export function NumberMul(arg1: any, arg2: any) {
    var m = 0;
    var s1 = arg1.toString();
    var s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) { }
    try {
        m += s2.split(".")[1].length;
    } catch (e) { }

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 验证车牌号是否合格
 * true--说明合格
 */
export function isVehicleNumber(vehicleNumber: any) {
    let xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    let creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
    if (vehicleNumber.length == 7) {
        return creg.test(vehicleNumber);
    } else if (vehicleNumber.length == 8) {
        return xreg.test(vehicleNumber);
    } else {
        return false;
    }
}

/*
* 生日转为年龄（精确到月份）
*/
export function birsdayToAge(birsday: any) {
    let aDate = new Date();
    let thisYear = aDate.getFullYear();
    let bDate = new Date(birsday);
    let brith = bDate.getFullYear();
    let age = thisYear - brith;
    if (aDate.getMonth() == bDate.getMonth()) {
        if (aDate.getDate() < bDate.getDate()) {
            age = age - 1;
        }
    } else {
        if (aDate.getMonth() < bDate.getMonth()) {
            age = age - 1;
        }
    }
    return age;
}


/*
 * 递归深拷贝
 */
export function deepCopy(obj: any) {
    let result: any = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = deepCopy(obj[key]);
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

/**
 * 去除参数空数据（用于向后台传递参数的时候）
 * @param {Object} obj [参数对象]
 */
export function filterEmptyData(obj: any) {
    for (let prop in obj) {
        obj[prop] === '' ? delete obj[prop] : obj[prop];
    }
    return obj;
}


// 数字四舍五入（保留n位小数）
export function round(number: any, n: any) {
    n = n ? parseInt(n) : 0
    if (n <= 0) return Math.round(number)
    number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
    return number
}


/*
 *时间增加或减少几天
 * date  当前日期 例： 2020-06-10
 * days  增加的天数 例： 30
 * return 增加后的天数
 */
export function addDate(date: any, days: any) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    var month: any = d.getMonth() + 1;
    var day: any = d.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    var val = d.getFullYear() + "-" + month + "-" + day;
    return val;
}

/*
 *数字每千位加逗号
 * 
 */
export function commafy(num: any) {
    return num && num.toString()
        .replace(/\d+/, function (s: any) {
            return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
        })
}


/**
* 字母大小写切换
* @param str 要处理的字符串
* @param type 1:首字母大写 2：首页母小写 3：大小写转换 4：全部大写 5：全部小写
*/
export function strChangeCase(str: any, type: any) {
    function ToggleCase(str: any) {
        var itemText = ""
        str.split("").forEach(
            function (item: any) {
                if (/^([a-z]+)/.test(item)) {
                    itemText += item.toUpperCase();
                } else if (/^([A-Z]+)/.test(item)) {
                    itemText += item.toLowerCase();
                } else {
                    itemText += item;
                }
            });
        return itemText;
    }

    switch (type) {
        case 1:
            return str.replace(/^(\w)(\w+)/, function (v: any, v1: any, v2: any) {
                return v1.toUpperCase() + v2.toLowerCase();
            });
        case 2:
            return str.replace(/^(\w)(\w+)/, function (v: any, v1: any, v2: any) {
                return v1.toLowerCase() + v2.toUpperCase();
            });
        case 3:
            return ToggleCase(str);
        case 4:
            return str.toUpperCase();
        case 5:
            return str.toLowerCase();
        default:
            return str;
    }
}


/**
* 检测密码强度
* @param str 字符串
* @returns 0:小于6位数字 1：密码弱 2：密码中等 3：密码强 4：密码很强
*/
export function checkPwd(str: any) {
    var nowLv = 0;
    if (str.length < 6) {
        return nowLv
    };
    if (/[0-9]/.test(str)) {
        nowLv++
    };
    if (/[a-z]/.test(str)) {
        nowLv++
    };
    if (/[A-Z]/.test(str)) {
        nowLv++
    };
    return nowLv;
}



/** 文件下载*/
export function downLoad(way: any, url: any, name: any, type: any) {
    var token = sessionStorage.getItem("account.token") || "";
    var xhr = new XMLHttpRequest();
    xhr.open(way, url, true);
    xhr.responseType = "blob";
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function () {
        if (this.status === 200) {
            var blob = this.response;
            var reader = new FileReader();
            reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
            reader.onload = function (e: any) {
                var a: any = document.createElement("a"); // 转换完成，创建一个a标签用于下载
                a.download = name + type;
                a.href = e.target.result;
                //   $("body").append(a); // 修复firefox中无法触发click
                a.click();
                //   $(a).remove();
            };
        }
    };
    xhr.send(); // 发送ajax请求
}


/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
export function uniqueArray(array: any, key: any) {
    var result = [array[0]]
    for (var i = 1; i < array.length; i++) {
        var item = array[i]
        var repeat = false
        for (var j = 0; j < result.length; j++) {
            if (item[key] == result[j][key]) {
                repeat = true
                break
            }
        }
        if (!repeat) {
            result.push(item)
        }
    }
    return result
}



/**
 * 两个数组去重
 * @param {Array} originList 原始数组
 * @param {Array} currentList 当前数组
 * @param {String} sortKey 去重字段
 * @return {Array} 返回新数组中不重复的部分
 */
export function Duplicate(originList: any, currentList: any, sortKey: any) {
    const map: any = {}
    originList.forEach((e: any) => {
        map[e[sortKey]] = true
    })
    return currentList.filter((e: any) => !map[e[sortKey]])
}


// 数组包数组去重
export function unique(arr: any) {
    arr = arr.filter((item: any) => item.every((item: any) => item)) // 去除[0,0]
    for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = i + 1, len = arr.length; j < len; j++) {
            if (JSON.stringify(arr[i]) === JSON.stringify(arr[j])) {
                arr.splice(j, 1)
                j-- // 每删除一个数j的值就减1
                len-- // j值减小时len也要相应减1（减少循环次数，节省性能）
                // console.log(j,len)
            }
        }
    }
    return arr
}


/**
 * 数组元素为对象的去重方法 ES5方法
 * @param arr  原数组
 * @param type  根据元素的某个属性进行去重
 * @returns {Array} 返回去重后的新的数组
 */
export function Es5duplicate(arr: any, type: any) {
    var newArr = []
    var tArr = []
    if (arr.length == 0) {
        return arr
    } else {
        if (type) {
            for (var i = 0; i < arr.length; i++) {
                if (!tArr[arr[i][type]]) {
                    newArr.push(arr[i])
                    tArr[arr[i][type]] = true
                }
            }
            return newArr
        } else {
            for (var j = 0; j < arr.length; j++) {
                if (!tArr[arr[j]]) {
                    newArr.push(arr[j])
                    tArr[arr[j]] = true
                }
            }
            return newArr
        }
    }
}



/**
 * 数组元素为对象的去重方法 ES6方法
 * @param arr  原数组
 * @param type  根据元素的某个属性进行去重
 * @returns {Array} 返回去重后的新的数组
 */
export function Es6duplicate(arr: any, type: any) {
    var hash: any = {}
    return arr.reduce(function (item: any, next: any) {
        hash[next[type]] ? '' : hash[next[type]] = true && item.push(next)
        return item
    }, [])
}


/**
 * 合并两个map ,仅支持一层
 * @param {*} map1
 * @param {*} map2
 */
export function mergeMap(map1: any, map2: any) {
    for (const key in map2) {
        if (map1.hasOwnProperty(key)) {
            Object.assign(map1[key], map2[key])
        } else {
            map1[key] = map2[key]
        }
    }
    return map1
}


/**
 * 保留任意位小数
 * @param {*} num 实际数字
 * @param {*} decimal 保留位数
 */
export function keepAnyDecimal(num: any, decimal: any) {
    const level = Math.pow(10, decimal)
    var result = parseFloat(num)
    if (isNaN(result)) {
        return ''
    }
    result = Math.round(num * level) / level
    return result
}


/**
 * 根据身份证获取性别
 * @param {String} idCard 获取输入的身份证号码
 * @return {String} 返回性别 {男， 女}
 */
export function IDCardSex(idCard: any) {
    var sexMap: any = {
        0: '女',
        1: '男'
    }
    if (idCard && idCard.length === 15) {
        return sexMap[idCard.substring(14, 15) % 2]
    } else if (idCard && idCard.length === 18) {
        return sexMap[idCard.substring(16, 17) % 2]
    } else {
        // 不是15或者18,null
        return 'error'
    }
}



/**
 * 名称校验规则
 * @param {String} str 获取输入的名称
 * @return {Boolean} 返回是否校验通过  true为通过， false为不通过
 */
export function nameRexp(str: any, required = true) {
    if (!required) {
        return {
            status: true
        }
    }
    if (!str) {
        return {
            message: '用户名不能为空',
            status: false
        }
    }
    str = str.trim()
    // 校验特殊字符
    // let special = /[^~!@#$%\^&*+|}{"：:<>?\/;''\[\]\\=`]$/;
    // let special = partyPersonNameNewReg;
    // if (!special.test(str)) {
    //   return {
    //     message: "录入结果应不包含特殊字符，请重新录入。",
    //     status: false
    //   };
    // }
    str = str.replace(/[\r\n]/g, '')
    if (strLength(str) < 3) {
        return {
            message: '请输入3个字节以上的长度',
            status: false
        }
    }
    // 判断是否含有数字,有数字  校验拦截
    const Num = /[0-9]/
    if (Num.test(str)) {
        return {
            message: '名称不允许含有数字',
            status: false
        }
    }
    // 校验是否为全中文
    const ZH = new RegExp('[\\u4E00-\\u9FFF]+$', 'g')
    if (ZH.test(str)) {
        // 当输入值为全中文时，校验是否有空格
        if (str.indexOf(' ') != -1) {
            return {
                message: '名称为全中文时中间不允许含有空格',
                status: false
            }
        } // 有空格
    }
    return {
        status: true
    }
}


// 检查特殊字符
export function specialCharactersCheck(str: any) {
    const pattern = new RegExp(
        "[`%~!@#$^&=|{}':'\\[\\].<>/?~！@#￥\\\\……&——|{}【】‘：”“'。、？,* 》.]"
    )
    if (!str) return false
    const flag = Array.from(str).some((item: any) => pattern.test(item))
    if (flag) return false
    return true
}


// 下划线转换驼峰
export function toHump(name: any) {
    return name.replace(/\_(\w)/g, function (all: any, letter: any) {
        return letter.toUpperCase()
    })
}


// 驼峰转换下划线
export function toLine(name: any) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}


// 判断两个对象的值是否相等
export function diffObject(obj1: any, obj2: any) {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
        return false
    } else {
        for (const key in obj1) {
            if (!obj2.hasOwnProperty(key)) {
                return false
            }
            // 类型相同
            if (typeof obj1[key] === typeof obj2[key]) {
                // 同为引用类型
                if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                    if (obj1[key] !== null && obj2[key] !== null) {
                        const equal = diffObject(obj1[key], obj2[key])
                        if (!equal) {
                            return false
                        }
                    }
                }
                // 同为基础数据类型
                if (
                    typeof obj1[key] !== 'object' &&
                    typeof obj2[key] !== 'object' &&
                    obj1[key] !== obj2[key]
                ) {
                    return false
                }
            } else {
                if (
                    (obj1[key] === null && obj2[key] === undefined) ||
                    (obj2[key] === null && obj1[key] === undefined)
                ) {
                    // 如果值为null和undefind则认为是相等的
                    return true
                }
                return false
            }
        }
    }
    return true
}


/**
 *
 * 数据字典接口返回的是对象
 * 将对象转为数组[{code: '', value: []}] 结构
 */
export function objTransArray(obj: any) {
    const arr = []
    if (typeof (obj) !== 'object') {
        return false
    } else {
        for (const [key, value] of Object.entries(obj)) {
            arr.push({ code: key, name: value })
        }
        return arr
    }
}


/**
 * 数组根据某个属性分组
 * @param {*} list 需要分组的数组
 * @param {*} groupId 需要分组的数组的属性
 * @return {Array} list
 */
export function arrayGroupBy(list: any, groupId: any) {
    const sorted = groupBy(list, function (item: any) {
        return [item[groupId]]
    })
    return sorted
}
export function groupBy(arr: any, fn: any) {
    const groups: any = {}
    arr.forEach(function (val: any) {
        var group = JSON.stringify(fn(val))
        groups[group] = groups[group] || []
        groups[group].push(val)
    })
    return Object.keys(groups).map(function (group) {
        return groups[group]
    })
}



/**
  *获取当前日期
  * @param {*} type 返回数据的类型 是否包含 具体哪一天
  */
export function currentDate(type = 'yearMonth') {
    var myDate = new Date()
    var tYear = myDate.getFullYear()
    var tMonth = myDate.getMonth()
    var m: any = tMonth + 1
    if (m.toString().length == 1) {
        m = '0' + m
    }
    if (type === 'yearMonth') {
        return tYear + '-' + m
    }
    if (type === 'yearMonthDay') {
        var tDay: any = myDate.getDate()
        if (tDay.toString().length == 1) {
            tDay = '0' + tDay
        }
        return tYear + '-' + m + '-' + tDay
    }
}


/**
 * 获取两个时间日期之间所有的日期
 * @param stime  开始日期
 * @param etime  结束日期
 * @returns {Array} 返回所有时间组成的数组
 */
export function getdiffdate(stime: any, etime: any) {
    // 初始化日期列表，数组
    const diffdate = []
    let i = 0
    // 开始日期小于等于结束日期,并循环
    while (stime <= etime) {
        diffdate[i] = stime
        // 获取开始日期时间戳
        const stime_ts = new Date(stime).getTime()
        // console.log('当前日期：' + stime + '当前时间戳：' + stime_ts)
        // 增加一天时间戳后的日期
        const next_date = stime_ts + (24 * 60 * 60 * 1000)
        // 拼接年月日，这里的月份会返回（0-11），所以要+1
        const next_dates_y = new Date(next_date).getFullYear() + '-'
        const next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-'
        const next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate()
        stime = next_dates_y + next_dates_m + next_dates_d
        // 增加数组key
        i++
    }
    return diffdate
}


/**
 * 获取该日期在当年第几周
 * @param date  测算时间
 * @returns {Number} 返回当年的第几周
 */
export function weekOfYear(date: any) {
    const year = date.split('-')[0]
    const month = date.split('-')[1]
    const day = date.split('-')[2]
    let date1: any = new Date(year, 0, 1)
    let date2: any = new Date(year, month - 1, day, 1)
    const dayMS = 24 * 60 * 60 * 1000
    // 每周从周一开始 8
    const firstDay = (8 - date1.getDay()) * dayMS
    const weekMS = 7 * dayMS
    date1 = date1.getTime()
    date2 = date2.getTime()
    return Math.ceil((date2 - date1 - firstDay) / weekMS) + 1
}


/**
 * 获取当前日期前后N天的日期
 * @param dayCount  前后的天数
 * @returns {String} 返回具体的日期
 */
export function getDateStr(dayCount: any) {
    var today = new Date()
    today.setDate(today.getDate() + Number(dayCount)) // 获取AddDayCount天后的日期
    var y = today.getFullYear()
    var m = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1) // 获取当前月份的日期，不足10补0
    var d = today.getDate() < 10 ? '0' + today.getDate() : today.getDate() // 获取当前几号，不足10补0
    return y + '-' + m + '-' + d
}


/**
 * 月份转换 数字<=>英文缩写
 * @param val  需要转换的月份值
 * @param type  转换成的类型
 * @returns {String} 转换成对应的月份格式
 */
export function translateMonth(val: any, type: any) {
    const enMonth: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const numMonth: any = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' }
    switch (type) {
        case 'toEn': // 转换成英文缩写
            return `${enMonth[+val - 1]}`
        case 'toNum': // 转换成数字月份
            return `${numMonth[val]}`
    }
}


/**
 * 元素为对象的数组根据元素对象某个属性排序
 * @param arr  原数组
 * @param prop  原数组的元素的某个属性
 * @param orderByType  按倒序还是顺序
 * @returns {Array} 返回排好序的数组
 */
export function arrayObjSort(arr: any, prop: any, orderByType: any) {
    return arr.sort(compare(prop, orderByType))
}
export function compare(prop: any, orderByType: any) {
    return function (obj1: any, obj2: any) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1)
            val2 = Number(val2)
        }
        switch (orderByType) {
            // 倒序
            case 'desc':
                if (val1 > val2) {
                    return -1
                } else if (val1 < val2) {
                    return 1
                } else {
                    return 0
                }
            // 升序
            case 'asc':
                if (val1 < val2) {
                    return -1
                } else if (val1 > val2) {
                    return 1
                } else {
                    return 0
                }
        }
    }
}


