"use strict";
/**
 * Created by QianQi on 2017/1/18.
 */
if(!Array.prototype.indexOf){
    /**
     * @widoc Array.pro.indexOf
     * @namespace prop
     * @des 从 from 位置开始，返回首次出现 elt 的索引位置，未找到返回 -1
     * @type function
     * @param {*} elt 要判断是否在数组中的对象
     * @param {int=} from 搜索起始索引，0 到 length-1，默认为 0
     * @return {int} * 从 from 位置开始，返回首次出现 elt 的索引位置，未找到返回 -1
     */
    Array.prototype.indexOf = function(elt, from){
        var len = this.length >>> 0;// 用于确保 this.length 是可运算的数值
        from = Number(from) || 0;
        if(from < 0 || from >= len) return -1;
        for(; from < len; from++){
            if(this[from] === elt) return from;
        }
        return -1;
    };
}
/**
 * @widoc String.pro.trim
 * @namespace prop
 * @des 字符串去除首尾空格
 * @type function
 * @return {string} * 去除首尾空格后的字符串
 */
if(!String.prototype.trim){
    String.prototype.trim = function(){
        return this.replace(/(^\s+)|(\s+$)/g, '');
    };
}
/**
 * @widoc Date.pro.format
 * @namespace prop
 * @des 日期格式化（原型扩展或重载）
 * @type function
 * @param {string} formatStr 格式模版
 *  - YYYY/yyyy/YY/yy 表示年份
 *  - MM/M 月份
 *  - W/w 星期
 *  - dd/DD/d/D 日期
 *  - hh/HH/h/H 时间
 *  - mm/m 分钟
 *  - ss/SS/s/S 秒
 * @return {string} * 格式化后的日期字符串
 */
Date.prototype.format = function(formatStr){
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, '' + this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
    str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, this.getMonth() + 1);
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());
    return str;
};
/**
 * @widoc Date.pro.add
 * @namespace prop
 * @des 日期计算（原型扩展或重载）
 * @type function
 * @param {string} interval 日期计算的单位
 *  - y,Y 年
 *  - M 月
 *  - q,Q 季度
 *  - w,W 周
 *  - d,D 日
 *  - h,H 时
 *  - m 分
 *  - s,S 秒
 * @param {number} number 数量
 * @return {Date} * 计算后的日期对象
 */
Date.prototype.add = function(interval, number){
    var oldDate = this,
        nOldTime = oldDate.getTime();// 原始日期的毫秒数
    // 新的日期因超出当月自动化为下月（如 2017/02/29 -> 2017/03/01），设为当月最后一天
    var fChargeDate = function(date){
        if(date.getDate() !== oldDate.getDate()){
            date.setDate(0);
        }
        return date;
    };
    switch(interval){
        case 'S':
        case 's':
            return new Date(nOldTime + (1000 * number));
        case 'm':
            return new Date(nOldTime + (60000 * number));
        case 'H':
        case 'h':
            return new Date(nOldTime + (3600000 * number));
        case 'D':
        case 'd':
            return new Date(nOldTime + (86400000 * number));
        case 'W':
        case 'w':
            return new Date(nOldTime + ((86400000 * 7) * number));
        case 'Q':
        case 'q':
            return fChargeDate(
                new Date(new Date(nOldTime).setMonth(oldDate.getMonth() + number * 3))
            );
        case 'M':
            return fChargeDate(
                new Date(new Date(nOldTime).setMonth(oldDate.getMonth() + number))
            );
        case 'Y':
        case 'y':
            return fChargeDate(
                new Date(new Date(nOldTime).setFullYear(oldDate.getFullYear() + number))
            );
    }
};
/** jquery 扩展 **/
(function($){
    /**
     * AJAX请求前将CSRFToken值放入header中
     */
    var _ajaxBeforeSendFun = function(xhr){
        var CSRFToken = $("meta[name='_csrf']").attr("content");
        xhr.setRequestHeader("CSRFToken", CSRFToken);
    };
    $.ajaxSetup({
        type: 'POST',
        beforeSend: _ajaxBeforeSendFun
    });
    /** ================ 定义 $ 及 $.fn 扩展方法 ================ **/
    var WICONF = {
    scrollsize: 17// 滚动条尺寸
};
/**
 * @widoc $.setWiConf
 * @namespace comp
 * @des 修改组件默认配置，在初始化任何组件对象前调用，具体可配置的属性参见各组件中的描述
 * @type function
 * @param {string} name 标识
 * @param {*|object} val 值或扩展对象
 */
$.setWiConf = function(name, val){
    if(name && typeof WICONF[name] != 'undefined'){// 允许修改的配置
        if(typeof val == 'object'){
            $.extend(WICONF[name], val);
        }
        else{// 覆写简单类型配置
            WICONF[name] = val;
        }
    }
};
/**
 * @widoc $.resizeListener
 * @namespace aux
 * @des 提供接口，可以对元素的尺寸变化绑定/解绑监听事件。
 * @type object
 * @demo resizeListener/demo 容器尺寸变化
 * @attr {function} fBind(el,fn) 对 el 添加 resize 监听
 * - el {object} 要监听的容器，jquery 对象
 * - fn {function} resize 时的回调方法 function()
 * @attr {function} fUnBind(el,fn) 对 el 移除 resize 监听
 * - el {object} 监听的容器，jquery 对象
 * - fn {function=} 要移除的监听事件 function()，默认移除全部事件
 * @attr {function} fResetSize(el) 手动触发尺寸重算，尺寸变化则触发回调
 * - el {object} 监听的容器，jquery 对象
 */
$.resizeListener = (function(){
    var api;
    // IE9 以下所有元素都支持 resize 事件，而其他多数浏览器中，只有窗体类的元素（window, frame）才支持 resize 事件
    var bSupportResize = navigator.appName == "Microsoft Internet Explorer" &&
        parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE","")) < 9;
    // resize, scroll 事件均会频繁触发，_fRaf 用于限制事件触发频率
    var _fRaf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){
            return window.setTimeout(fn, 20);
        };
    var _fCancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
        window.clearTimeout;
    var fRafHandlerFac,// 用于生成 resize 事件触发时真正执行回调的方法（触发频率受 _fRaf 限制）
        fResetTriggers;// 不支持 resize 的浏览器中，重置 wi-resizelistener 内元素的尺寸位置
    // resize, scroll 事件触发时的处理函数
    var fOnResize = function(e){
        var dom = this,
            el = $(dom),
            oWiResizeData = el.data('wiResize');
        if(oWiResizeData){
            fResetTriggers && fResetTriggers(el);// 不支持 resize 的浏览器，需要在此重置 wi-resizelistener 内的元素尺寸位置
            if(oWiResizeData.fRaf){
                _fCancel(oWiResizeData.fRaf);
            }
            oWiResizeData.fRaf = _fRaf(fRafHandlerFac(el, dom, oWiResizeData));
        }
    };

    if(bSupportResize){
        fRafHandlerFac = function(el, dom, oWiResizeData){
            return function(){
                $.each(oWiResizeData.listeners, function(i, fn){
                    fn.call(dom);
                });
            };
        };
    }
    else{
        // 重置 resize 相关元素样式，根据当前状态调整，以便及时引起 scroll
        fResetTriggers = function(el){
            el.children('.wi-resizelistener').children().each(function(i, dom){
                var dChild;
                if(i == 0){
                    dChild = dom.firstElementChild;
                    dChild.style.width = dom.offsetWidth + 1 + 'px';
                    dChild.style.height = dom.offsetHeight + 1 + 'px';
                }
                dom.scrollLeft = dom.scrollWidth;
                dom.scrollTop = dom.scrollHeight;
            });
        };
        fRafHandlerFac = function(el, dom, oWiResizeData){
            return function(){
                var newW = el.innerWidth(),// el 当前尺寸
                    newH = el.innerHeight();
                if(newW != oWiResizeData.width || newH != oWiResizeData.height){
                    $.extend(oWiResizeData, {
                        width: newW,
                        height: newH
                    });
                    $.each(oWiResizeData.listeners, function(i, fn){
                        fn.call(dom);
                    });
                }
            };
        };
    }
    // 手动触发 resize 事件
    var fResetSize = function(el){
        if(el.data('wiResize')){
            fOnResize.call(el[0]);
        }
    };
    /**
     * 对指定元素添加 resize 监听
     * @param el {object} 要监听的容器，jquery 对象
     * @param fn {function} resize 时的回调方法
     */
    var fBind = function(el, fn){
        var oWiResizeData = el.data('wiResize'),// 记录 el 上是否已绑定监听
            aListeners;
        if(!fn){
            return;
        }
        if(oWiResizeData){// el 上已经绑定过 wiResize 监听，只需调整 listeners 监听事件数组
            aListeners = oWiResizeData.listeners;
            // fn 是已经绑定过的事件，不需重复绑定，直接返回；未绑定过的事件，加入 listeners 数组
            if(aListeners.indexOf(fn) == -1){
                aListeners.push(fn);
            }
        }
        else{// 未绑定过 wiResize 监听
            aListeners = [fn];
            if(bSupportResize){// IE9 以下
                el.data('wiResize', {
                    listeners: aListeners,
                    fRaf: null// 在 fOnResize() 触发时赋值
                });
                el.off('resize.wiResize')
                  .on('resize.wiResize', fOnResize)
            }
            else{
                if(el.css('position') == 'static'){
                    el.css('position', 'relative');// 设置为定位元素
                }
                el.append('<div class="wi-resizelistener">' +
                    '<div class="wi-resizelistener-in1"><div></div></div>' +
                    '<div class="wi-resizelistener-in2"></div>' +
                    '</div>');
                el.data('wiResize', {
                    width: -1,
                    height: -1,
                    listeners: aListeners,
                    fRaf: null// 在 fOnResize() 触发时赋值
                });
                // scroll 不支持冒泡，必须在捕获阶段绑定事件 - fResetTriggers 中的 dom 操作会在事件绑定完成后渲染，因此可能会导致初始化时默认执行一次回调
                el.get(0).addEventListener('scroll', fOnResize, true);
            }
            fResetSize(el);// 第一次绑定 wiResize 监听时，强制调用（不支持 resize 时必须，通过 fResetSize 调用 fResetTriggers 设置 wi-resizelistener 内元素的尺寸位置；支持时，调用此方法，仅为使不同浏览器效果一致）
        }
    };
    /**
     * 对指定元素移除 resize 监听
     * @param el {object} 监听的容器，jquery 对象
     * @param fn {function=} 要移除的监听事件，默认移除全部事件
     */
    var fUnbind = function(el, fn){
        var oWiResizeData = el.data('wiResize');
        var aListener, fnIdx;
        if(oWiResizeData){
            aListener = oWiResizeData.listeners;
            if(fn){
                fnIdx = aListener.indexOf(fn);
                if(fnIdx == -1){
                    return;
                }
                else{
                    aListener.splice(fnIdx, 1);
                }
            }
            else{// 全部移除
                aListener.length = 0;
            }

            if(aListener.length == 0){// 所有事件都被移除，销毁监听
                if(bSupportResize){// IE11 以下
                    el.off('resize.wiResize');
                }
                else{
                    el.get(0).removeEventListener('scroll', fOnResize, true);
                    el.children('.wi-resizelistener').remove();
                    _fCancel(oWiResizeData.fRaf);
                }
                el.removeData('wiResize');
            }
        }
    };
    api = {
        fBind: fBind,
        fUnBind: fUnbind,
        fResetSize: fResetSize// 初始化时可能由于元素隐藏或祖先元素隐藏，导致 .wi-resizelistener 的元素尺寸位置异常，此时允许用户手动调用此方法触发 resize 回调
    };
    return api;
})();
/**
 * @widoc $.fn.setKeyEnter
 * @namespace aux
 * @des 当前元素上回车时触发指定的回调
 * @type function
 * @param {object} opts
 * @param {function} opts.callback 回车时的回调方法
 */
$.fn.setKeyEnter=function(opts) {
    var el=$(this),api;
    opts= $.extend({
        callback: $.noop
    },opts);
    // 取消事件监听
    var fCancel=function(){
        el.off('keydown.keyEnter');
    };
    var fInit=function(){
        el.off('keydown.keyEnter')
          .on('keydown.keyEnter',function(e){
              if(e.keyCode == 13) {
                  opts.callback();
                  return false;
              }
          });
    };
    api={
        fCancel:fCancel
    };
    fInit();
    return api;
};
/**
 * @widoc $.browser
 * @namespace aux
 * @des 浏览器版本信息
 * @type object
 * @attr {object} versions 各浏览器版本判断，是则为 true。
 * @attr {boolean} versions.ie 浏览器判断，是ie则为 true。
 * @attr {boolean} versions.firefox 浏览器判断，是firefox则为 true。
 * @attr {boolean} versions.chrome 浏览器判断，是chrome则为 true。
 * @attr {boolean} versions.opera 浏览器判断，是opera则为 true。
 * @attr {boolean} versions.webkit 浏览器判断，是webkit则为 true。
 * @attr {boolean} versions.ie8 浏览器判断，是ie8则为 true。
 * @attr {boolean} versions.ie9 浏览器判断，是ie9则为 true。
 * @attr {string} language 浏览器语言
 */
$.browser={
    versions: function() {
        var browserName=navigator.userAgent.toLowerCase(),
            version=navigator.appVersion;
        return {// 浏览器版本信息
            ie:/msie/i.test(browserName) && !/opera/.test(browserName),
            firefox:/firefox/i.test(browserName),
            chrome:/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName),
            opera:/opera/i.test(browserName),
            webkit:/webkit/i.test(browserName) &&!(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)),
            ie8:/msie/i.test(browserName) && !/opera/.test(browserName) && !!version.match(/8./i),
            ie9:/msie/i.test(browserName) && !/opera/.test(browserName) && !!version.match(/9./i)
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
WICONF.getBasePath = {
    iptName: 'BASEPATH'// <body> 下存放 basepath 的直接隐藏域 name
};
/**
 * @widoc $.getBasePath
 * @namespace aux
 * @des 获取当前项目的 basePath，优先由 <body> 下的直接隐藏域获取，若未找到或值为 ''，则通过当前页面路径获取"协议(http:)//主机名:端口/项目名/"
 * 组件配置，在使用组件前调用：
 <pre class="des-conf"> $.setWiConf('getBasePath',{
    iptName: 'BASEPATH'// <body> 下存放 basepath 的直接隐藏域 name
 });</pre>
 * @type function
 * @return {string} str 当前项目的 basePath
 */
$.getBasePath = function(){
    var iptName = WICONF.getBasePath.iptName,
        jqBasePath = $('body').children('input[type="hidden"][name="' + iptName + '"]'),// 查找 <body> 下存放 basepath 的直接隐藏域
        prjMatch,// 路径匹配结果数组
        sBasePath;
    if(jqBasePath.length){
        sBasePath = jqBasePath.val();
    }
    if(!sBasePath){// 未获得有意义的值，则通过访问路径获取
        prjMatch = location.pathname.match(/^\/?([^\/]+\/)/);
        sBasePath = location.protocol + '//' + location.host + '/' + (prjMatch ? prjMatch[1] : '');
    }
    return sBasePath;
};
/**
 * @widoc $.getUrlParams
 * @namespace aux
 * @des 获取url中的参数集合
 * @type function
 * @return {Object} obj 返回对象 以键(string)值(string)对组成的对象存储参数
 */
$.getUrlParams = function(){
    var strArr = window.location.search.substring(1).split('&')
        , params = {};
    for(var i = 0, arr; i < strArr.length; i++){
        arr = strArr[i].split('=');
        if(!arr[0]) continue;
        params[arr[0]] = arr.length > 1 ? decodeURIComponent(arr[1]) : '';
    }
    return params;
};
/**
 * @widoc $.getHideParams
 * @namespace aux
 * @des 获取 body 直接子隐藏域保存的参数集合（以 name 标识）
 * @type function
 * @return {Object} obj 返回对象 以键(name)值(value)对组成的对象存储参数
 */
$.getHideParams=function(){
    var params={};
    $('body').children('input[type="hidden"]').each(function(){
        var jqCur=$(this),
            name=jqCur.attr('name');
        if(name){
            params[name]=jqCur.val();
        }
    });
    return params;
};
/* 验证规则定义 */
/**
 * @widoc $.validator
 * @namespace aux
 * @des 验证规则接口。若定义了 data-notrim 属性（此属性暂只允许添加在文本框上，与 serializeObject() 匹配），则前后空格也参与验证。
 * @type object
 * @attr {object} messages 验证不通过时的提示
 *      'required': '此字段必填'，当文本框上定义了 data-notrim，则功能与 requiredNoTirm 相同
 *      'requiredNoTrim': '此字段必填'，允许只填写空格（兼容之前的版本，推荐使用 required 配合 data-notrim 实现）
 *      'number': '此字段必须为数字'
 *      'numberRange': '此字段的数字范围是：{0}-{1}'
 *      'int': '此字段必须为整数'
 *      'maxlength': '此字段值最多{0}个字符'
 *      'length': '此字段值为{0}个字符'
 *      'ZhStrMaxLength': '此字段最多{0}个字符（中文计为2个字符）'
 *      'ZhStrRangeLength': '此字段限制{0}-{1}个字符（中文计为2个字符）'
 *      'isPhone': '电话号码格式错误'
 *      'isCardNo': '身份证号格式错误'
 *      'regularName':'此字段只能由字母、数字、下划线组成'
 *      'email':'电子邮件格式不正确'
 *      'postalCode':'邮政编码格式不正确'
 * @attr {object} methods 验证规则时的操作
 * @attr {function} add 添加自定义验证规则
 *   function(ruleName,ruleMethod,msg)
 */
$.validator={
    messages: {
        'required': '此字段必填'
        ,'requiredNoTrim': '此字段必填'
        ,'number': '此字段必须为数字'
        ,'numberRange': '此字段必须为数字，范围：{0}~{1}'
        ,'int': '此字段必须为整数'
        ,'maxlength': '此字段值最多{0}个字符'
        ,'length': '此字段值为{0}个字符'
        ,'ZhStrMaxLength': '此字段最多{0}个字符（中文计为2个字符）'
        ,'ZhStrRangeLength': '此字段限制{0}-{1}个字符（中文计为2个字符）'
        ,'isPhone': '电话号码格式错误'
        ,'isCardNo': '身份证号格式错误'
        ,'regularName':'此字段只能由字母、数字、下划线组成'
        ,'email':'电子邮件格式不正确'
        ,'postalCode':'邮政编码格式不正确'
    },
    // 验证通过时返回 true，不通过时返回 false
    methods: {
        'required': function(limit, el) {
            if(limit){
                var val = el.val();
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return val && val.length > 0;
            }
            return true;
        }
        // 必填，允许只填写空格
        ,'requiredNoTrim': function(limit, el) {
            if(limit){
                var val = el.val();
                return val && val.length > 0;
            }
            return true;
        }
        ,'number': function(limit, el) {
            if(limit){
                var val = el.val();
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(val);
            }
            return true;
        }
        // 数字范围验证，值必须为数字
        ,'numberRange': function(limit, el){
            if(limit.constructor==Array){
                var val = el.val(),
                    min = limit[0],
                    max = limit[1];
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                if(val){
                    if(typeof min == 'undefined'){
                        limit[0] = '不限';
                    }
                    if(typeof max == 'undefined'){
                        limit[1] = '不限';
                    }
                    if(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(val)){// 非空，首先验证数字，同 number 的规则
                        val = Number(val);// 转换为数字
                        if(typeof min != 'undefined' && val < min ||// 定义了最小值，但不符合
                            typeof max != 'undefined' && val > max){// 定义了最大值，但不符合
                            return false;
                        }
                    }else{// 有值，但是非数字
                        return false;
                    }
                }
            }
            return true;
        }
        ,'int': function(limit, el) {
            if(limit){
                var val = el.val();
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || /^-?\d+$/.test(val);
            }
            return true;
        }
        ,'maxlength': function(limit, el) {
            if(typeof limit=='number'){
                var val = el.val();
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || val.length <= limit;
            }
            return true;
        }
        ,'length': function(limit, el) {
            if(typeof limit=='number'){
                var val = el.val();
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || val.length == limit;
            }
            return true;
        }
        // 字符最大长度验证（一个中文字符长度为2）
        ,'ZhStrMaxLength': function(limit, el){
            if(typeof limit=='number'){
                var val = el.val();
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || $.getZhStrLength(val)<=limit;
            }
            return true;
        }
        // 字符长度区间验证（一个中文字符长度为2）不能在用class属性定义验证规则时使用,取不到区间的值
        ,'ZhStrRangeLength': function(limit, el){
            if(limit.constructor==Array){
                var val = el.val()
                    ,length = $.getZhStrLength(val);
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || (length >=limit[0] && length <= limit[1]);
            }
            return true;
        }
        // 联系电话(手机/电话皆可)验证
        ,'isPhone': function(limit, el){
            if(limit){
                var val = el.val()
                    ,mobileRex = /^1\d{10}$/
                    ,telRex = /^(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || (telRex.test(val) || (val.length == 11 && mobileRex.test(val)));
            }
            return true;
        }
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        ,'isCardNo':function(limit, el){
            var _cardNoVali=function(idcard){
                idcard = idcard.toString().toUpperCase();// 将末位的x装换成X
                // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(idcard))) return false;
                var paritybit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];// 校验位取值
                var power_list = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];// 加权因子

                var fifteenToEighteen=function(str){
                    var s = 0;
                    var newid = str.substring(0,6) + "19" + str.substring(6,str.length);
                    for (var i=0;i < newid.length;i++ ){
                        s += parseInt(newid.substring(i,i+1),10)*power_list[i];
                    }
                    return newid+paritybit[s%11];
                };
                /**验证1位校验码（18位）*/
                var checkcodeValidation=function(str){
                    for (var i=0,s=0;i < str.length-1;i++ ){
                        s += parseInt(str[i],10)*power_list[i];
                    }
                    return paritybit[s % 11] == str[17];
                };
                /**验证6位地址码（前6位）? 2位*/
                var locationValidation=function(str){
                    var provincesAndCities=['11','12','13','14','15','21','22',
                        '23','31','32','33','34','35','36',
                        '37','41','42','43','44','45','46',
                        '50','51','52','53','54','61','62',
                        '63','64','65','71','81','82','91'];/**省、直辖市代码*/
                    return provincesAndCities.indexOf(str)!=-1;
                };
                /**验证8位生日数字（7到14位）*/
                var birthdayValidation=function(str){
                    var year = str.substring(0,4);
                    var month = str.substring(4,6);
                    var day = str.substring(6,8);
                    var birthday =  year+"/"+month+"/"+day;
                    //var date = new Date(year,parseInt(month,10)-1,day);// ie8 下 parseInt() 默认基数为8， 08,09 会变成 0
                    var date = new Date(birthday);
                    /**大于等于当前日期 或 小于1900年1月1日*/
                    if(date >= new Date() || date <= new Date(1900,0,1)) return false;
                    return date.format( "yyyy/MM/dd")==birthday;
                };
                if(15 == idcard.length){// 15位转18位
                    idcard = fifteenToEighteen(idcard);
                }
                return (locationValidation(idcard.substring(0,2))// 验证6位地址码（前6位）? 2位
                && birthdayValidation(idcard.substring(6,14))// 验证8位生日数字（7到14位）
                && checkcodeValidation(idcard));// 验证1位校验码（18位）
            };
            if(limit){
                var val = el.val();
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || _cardNoVali(val);
            }
            return true;
        }
        ,'regularName':function(limit, el){
            if(limit){
                var val = el.val()
                    ,cardNoRex = /(^[\da-zA-Z_]+$)/;
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || cardNoRex.test(val);
            }
            return true;
        }
        // 电子邮件
        ,'email':function(limit, el) {
            if (limit) {
                var val = el.val(),
                    //email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                    email = /^[a-zA-Z\d][-\.\w]*@(?:[-\w]+\.)+(?:[a-zA-Z])+$/;// 20170713 modified by qq from taobao
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || email.test(val);
            }
            return true;
        }
        // 邮政编码
        ,'postalCode':function(limit, el) {
            if (limit) {
                var val = el.val(),
                    PostalCode = /^\d{6}$/;
                if(typeof el.attr('data-notrim')=='undefined'){// 若定义了 data-notrim 属性，则前后空格参与验证
                    val = val.trim();
                }
                return !val || PostalCode.test(val);
            }
            return true;
        }
    },
    /**
     * 扩展验证对象
     * @param ruleName {string} 规则名
     * @param ruleMethod {function} 验证方法
     * @param msg {string} 默认提示信息
     */
    add:function(ruleName,ruleMethod,msg){
        $.validator.messages[ruleName]=msg;
        $.validator.methods[ruleName]=ruleMethod;
    }
};
/*"validate","initValidator",*/
/* 验证辅助方法 */
var _formatMsg = function(src, args){
    if(args.constructor != Array){
        args = [args];
    }
    $.each(args, function(i, n){
        src = src.replace(new RegExp('\\{' + i + '\\}', 'g'), n);
    });
    return src;
};
/**
 * @widoc $.fn.validate
 * @namespace aux
 * @des 验证当前元素
 * @type function
 * @param {object} rules 要验证的表单元素的验证规则，键值对
 *     rules.key: 验证规则名称
 *     rules.value: 验证规则对应的参数
 * @param {object=} messages 自定义提示
 *     messages.key: 验证规则名称
 *     messages.value: 对应规则验证不通过时显示的自定义提示，若为 false，则不会提示验证信息
 * @param {function=} cb 验证不通过时再次点击元素时的回调函数
 * @param {boolean=} bindBlur 是否绑定失焦验证的事件，默认为 true，非特殊情况不需定义此属性
 * @return {boolean} 是否通过验证
 */
$.fn.validate = function(rules, messages, cb, bindBlur){// el 要添加danger样式的元素
    var el = $(this);
    var _errCls = 'dangerI'
        , _blurValEv = 'blur._validate'
        , _clickValEv = 'click._valiTip';
    el.off(_blurValEv)
      .off(_clickValEv);
    if(bindBlur != false){
        el.on(_blurValEv, function(){// 失焦时根据规则校验-暂只考虑文本框
            el.validate(rules, messages, cb);
        });
    }
    var errorRule = '';
    for(var rule in rules){// 逐个验证 rules
        if(rules.hasOwnProperty(rule)){
            var method = $.validator.methods[rule];
            if(method && !method(rules[rule], el)){// 定义了该验证方法且验证结果为 false
                errorRule || (errorRule = rule);
                break;
            }
        }
    }
    if(errorRule == ''){
        el.removeClass(_errCls);
        el.off(_blurValEv)// 自定义验证规则时，可能会重新加上这些 class，慎重考虑是否可以删除
          .off(_clickValEv);
        return true;
    }
    else{
        el.addClass(_errCls);
        // 2017.05.19 支持 message 设为 false，此时点击不显示提示信息
        //var msg=(messages && messages[errorRule]) ?
        //    messages[errorRule]:
        //$.validator.messages[errorRule]||'校验未通过';
        var msg;
        if(messages){// 先从用户自定义属性中获取配置
            msg = messages[errorRule];
        }
        if(!msg && msg !== false){// 若为 false 不需修改
            msg = $.validator.messages[errorRule];
        }
        if(!msg && msg !== false){// 若为 false 不需修改
            msg = '校验未通过';
        }
        msg = _formatMsg(msg, rules[errorRule]);
        if(msg !== false){// 需要显示验证提示
            el.on(_clickValEv, (function(msg){
                return function(){
                    if(cb){
                        cb(el, msg);
                    }
                    else $.showValiTip(el, msg);// TODO 显示验证信息
                };
            })(msg));
        }
        return false;
    }
};
/**
 * @widoc $.fn.initValidator
 * @namespace aux
 * @des 对元素子孙元素中的表单元素初始化验证条件。验证触发后，验证不通过时将对该表单元素的 class 添加 "dangerI"
 * @type function
 * @param options
 * @param {object} options.rules 验证规则，键值对
 *      key: 要验证的表单元素的 name 属性的值
 *      value {object}: 要验证的表单元素的验证规则，键值对
 *          key: 验证规则名称
 *          value: 验证规则对应的参数
 * @param {object=} options.messages 自定义验证信息，键值对
 *      key: 要验证的表单元素的 name 属性的值
 *      value {object}: 验证不通过时显示的自定义提示
 * @param {function} options.callback(el,msg) 自定义提示方法
 *      el {string} 验证失败的元素
 *      msg {string} 该元素上的提示信息
 * @param {boolean} options.autoScroll 验证失败时，是否自动滚动到第一个验证失败的元素，默认为 true
 * @return {object|undefined} returnObj 接口对象
 * @rtn {function} returnObj.validateAll() 手动触发当前元素内表单验证的方法
 * @rtn {function} returnObj.resetAllRules() 恢复所有元素的验证规则
 * @rtn {function} returnObj.removeAllRules(validate) 移除所有元素的验证规则
 *      validate {boolean=} 移除部分规则后，是否立即重新验证该元素，默认为 true
 * @rtn {function} returnObj.removeRules(name,rules,validate) 移除指定name的元素的验证规则
 *      name {string} 要移除验证规则的元素的 name，也对应初始化时 options.rules 及 options.messages 中的key
 *      rules {Array=} 要移除的规则名数组，若未定义则移除全部规则
 *      validate {boolean=} 移除部分规则后，是否立即重新验证该元素，默认为 true
 * @rtn {function} returnObj.addRules(addopts,validate) 移除指定name的元素的验证规则
 *      addopts {object} 同初始化时的 options（但不含 callback）
 *      validate {boolean=} 移除部分规则后，是否立即重新验证全部元素，默认为 true
 * @rtn {function} returnObj.resetValStat() 恢复所有验证状态
 */
$.fn.initValidator = function(options){
    if(!options || !options.rules) return;
    options = $.extend({
        autoScroll: true// valiadateAll() 验证失败时，是否自动滚动到第一个验证失败的元素
    }, options);
    var rules, messages,
        form = $(this);
    var _errCls = 'dangerI',
        _blurValEv = 'blur._validate',
        _clickValEv = 'click._valiTip';// 与 $.fn.validate 一致
    var _validate = function(name){
        var rulesOnEl = rules[name];
        if(!rulesOnEl) return true;// 此元素上未定义规则，验证通过
        var messagesOnEl = messages ? messages[name] : undefined;
        var curEl = form.find('[name="' + name + '"]');
        return !curEl.length || curEl.validate(rulesOnEl, messagesOnEl, options.callback, false);
    };
    var _validateAll = function(){
        var status = true;
        for(var name in rules){
            if(rules.hasOwnProperty(name)){
                if(_validate(name) == false){// 对此元素定义了规则且验证未通过
                    status = false;
                }
            }
        }
        if(!status && options.autoScroll){
            form.find('.dangerI')[0].scrollIntoView();// 将第一个验证失败的元素滚动到视图内
        }
        return status;
    };
    var _init = function(){
        form
            .off(_blurValEv)
            .on(_blurValEv, '[data-validate="true"]', function(){// 失焦时根据规则校验-暂只考虑文本框
                _validate($(this).attr('name'));
            })
            .off('submit.vali')
            .on('submit.vali', _validateAll);
        _resetAllRules(options.rules, options.messages);
    };
    var _removeAllRules = function(){
        for(var name in rules){
            if(rules.hasOwnProperty(name)){
                _removeRules(name);
            }
        }
    };
    var _resetAllRules = function(_rules, _msgs){
        _removeAllRules();
        if(!_rules) return;
        rules = _rules;
        messages = _msgs;
        for(var name in rules){
            if(rules.hasOwnProperty(name)){// 设置需要验证的表单元素的属性
                form.find('[name="' + name + '"]').attr('data-validate', 'true');
            }
        }
    };
    /**
     * 移除指定name的元素的验证规则
     * @param name {string} 要移除验证规则的元素的 name，也对应初始化时 options.rules 及 options.messages 中的key
     * @param removeRules {Array=} 要移除的规则名数组，若未定义则移除全部规则
     * @param validate {boolean=} 移除部分规则后，是否立即重新验证该元素，默认为 true
     * @private
     */
    var _removeRules = function(name, removeRules, validate){
        var el = form.find('[name="' + name + '"]');
        var rulesOnEl = rules[name];
        var hasProp = false;// 标记移除部分规则后是否还存在验证规则
        if(rulesOnEl && removeRules && removeRules.length){// 解绑指定规则
            for(var i = 0, len = removeRules.length; i < len; i++){
                delete rulesOnEl[removeRules[i]];
            }
            for(var rName in rulesOnEl){
                hasProp = true;// 存在验证规则
                break;
            }
        }
        else{// 解绑全部规则
            rulesOnEl = undefined;
        }
        el.removeClass(_errCls);// 删除原验证状态
        el.off(_clickValEv);
        if(!hasProp){
            el.removeAttr('data-validate');
            delete rules[name];
        }
        else if(validate != false){// 有规则，并定义了立即重新验证
            _validate(name);
        }
    };
    /**
     * 移除指定name的元素的验证规则
     * @param addOpts {object} 同初始化时的 options（但不含 callback）
     * @param validate {boolean=} 移除部分规则后，是否立即重新验证全部元素，默认为 true
     * @private
     */
    var _addRules = function(addOpts, validate){
        var _rules = addOpts.rules
            , _messages = addOpts.messages;
        for(var name in _rules){
            if(_rules.hasOwnProperty(name)){// 设置需要验证的表单元素的属性
                var el = form.find('[name="' + name + '"]');
                el.attr('data-validate', 'true');
                rules[name] = rules[name] ?
                    $.extend(rules[name], _rules[name]) : _rules[name];
                if(validate == false){// 不立即验证，取消之前的验证结果
                    el.removeClass(_errCls);// 删除原验证状态，与 $.fn.validate 中一致
                    el.off(_clickValEv);// 与 $.fn.validate 中一致
                }
            }
        }
        if(_messages){
            if(_messages.hasOwnProperty(name)){
                messages[name] = messages[name] ?
                    $.extend(messages[name], _messages[name]) : _messages[name];
            }
        }
        if(validate != false){// 立即验证全部
            _validateAll();
        }
    };
    /**
     * 恢复所有验证状态
     * @private
     */
    var _resetValStat = function(){
        form.find('[data-validate="true"]')
            .removeClass(_errCls)// 与 $.fn.validate 中一致
            .off(_clickValEv);// 与 $.fn.validate 中一致
    };
    var _returnObj = {
        el: form,
        validateAll: _validateAll,
        resetAllRules: _resetAllRules,
        removeAllRules: _removeAllRules,
        removeRules: _removeRules,
        addRules: _addRules,
        resetValStat: _resetValStat
    };
    _init();
    return _returnObj;
};
/**
 * @widoc $.showValiTip
 * @namespace aux
 * @des 显示 el 上验证提示信息 msg
 * @type function
 * @param {*} el 弹出 tip 的参照元素，支持选择器
 * @param {string} sMsg 提示信息
 * @param {object=} opts layer.tips 的参数扩展
 */
$.showValiTip=function(el,sMsg,opts){
    if(window.layer){//当window下有layer对象时，调用layer.tips()
        var bShadeClose;
        var nIndex=layer.tips(sMsg,el,$.extend({
            tips: [1, '#FF9901'],//提示框背景颜色
            time: 1000//提示显示时间
        },opts));
        if(opts){
            bShadeClose = opts.shadeClose;
        }
        $(document).off('click.hideTip');
        bShadeClose&&$(document).on('click.hideTip',function(e){
            if(!$(e.target).closest('#layui-layer'+nIndex).length && !$(e.target).closest(el).length){
                layer.close(nIndex);
                $(document).off('click.hideTip');
            }
        });
    }else{
        alert(sMsg);
    }
};
/**
 * @widoc $.showConfirm
 * @namespace aux
 * @des 显示 confirm 弹框
 * @type function
 * @param {string} sMsg 提示信息
 * @param {function=} fCbyes 点击确认时的回调函数
 * @param {function=} fCbno 点击取消时的回调函数
 * @param {object=} oWin 弹框时参照的 window 对象，默认为当前 window。
 */
$.showConfirm=function(sMsg,fCbyes,fCbno,oWin){
    if(!oWin){//如果没有传递oWin值，则将window值赋给oWin
        oWin = window;
    }
    if(oWin.layer){//当window下有layer对象时，调用layer.confirm()
        oWin.layer.confirm(sMsg,{
            title: false,//不显示标题
            closeBtn:0,//不显示关闭按钮
            btn:['确定','取消']
        },function(index){
            fCbyes&&fCbyes();
            oWin.layer.close(index);
        },function(index){
            fCbno&&fCbno();
            oWin.layer.close(index);
        })
    }else if(confirm(sMsg)){
        fCbyes&&fCbyes();
    }else{
        fCbno&&fCbno();
    }
};
/**
 * @widoc $.showAlert
 * @namespace aux
 * @des 显示 alert 弹框
 * @type function
 * @param {string} sMsg 提示信息
 * @param {function=} fCb 关闭提示信息时的回调函数
 * @param {object=} oWin 弹框时参照的 window 对象，默认为当前 window。
 */
$.showAlert=function(sMsg,fCb,oWin){// TODO return index 供关闭，考虑 oWin
    if(!oWin){//如果没有传递oWin值，则将window值赋给oWin
        oWin = window;
    }
    if(oWin.layer){//当window下有layer对象时，调用layer.alert()
        var keyEnterApi,sCurIndex;
        var jqActive = $(document.activeElement);
        var fCloseAlert = function(){
            fCb&&fCb();
            oWin.layer.close(sCurIndex);
            keyEnterApi.fCancel();
            jqActive.focus();
        };
        jqActive.blur();
        oWin.layer.alert(sMsg,{
            title: false, //不显示标题
            closeBtn:0,    //无关闭按钮
            success: function(layero, index){
                sCurIndex = index;
                keyEnterApi = $(document).setKeyEnter({// 回车触发关闭layer
                    callback:fCloseAlert
                });
            }
        },fCloseAlert);
    }else{//否则输出警告框
        alert(sMsg);
        fCb&&fCb();
    }
};
/**
 * @widoc $.showMsg
 * @namespace aux
 * @des 显示 msg 弹框
 * @type function
 * @param {string} sMsg 提示信息
 * @param {function=} fCb 关闭时的回调函数
 * @param {object=} oWin 弹框时参照的 window 对象，默认为当前 window。
 */
$.showMsg=function(sMsg,fCb,oWin){
    if(!oWin){//如果没有传递oWin值，则将window值赋给oWin
        oWin = window;
    }
    if(oWin.layer){//当window下有layer对象时，调用layer.msg()
        oWin.layer.msg(sMsg,{
            shade: 0.3,//提示框背部的阴影程度
            time:1000,//提示框的显示时间
            end:fCb   //关闭时的回调函数
        });
    }else{//否则输出警告框
        alert(sMsg);
        fCb&&fCb();
    }
};
WICONF.loading = {
    duration: 500,// 动画最短持续时间，避免闪屏，单位 ms
    content: ''
    //fInRender: $.noop// function({content}) 绘制加载容器内容的函数
};
(function(){
    var nStartTime = -1,// 记录开始时间（1970 年 1 月 1 日至今的毫秒数）
        timerLoading,// 避免闪屏的定时器
        aLoadingKey = [],// 储存所有key的顺序，show的时候添加，hide的时候删除对应key
        aLoadingNokey = [],// 储存没有传key的顺序，show的时候添加，hide的时候删除对应key
        oLoadingIn = {};// 储存key和对应显示内容sIn，show的时候添加，remove时候清空
    /**
     * @widoc $.showLoading
     * @namespace aux
     * @des 显示 loading 动画。<span class="t_red">注意：$.showLoading() 和 $.hideLoading() 应该成对使用。</span>
     * 显示说明：多次使用 showloading，显示第一次的内容，当第一次的 loading 被 hide 时，显示下一个未被 hide 的 loading 的内容；开启相同 key 值的 loading 将会被忽略;
     * 关闭说明：若传入的 key 值不存在，则不操作；若不传，则优先关闭第一个未传 key 值的 loading，无未传 key 值的 loading，则不操作。
     * 组件配置，在使用组件前调用：
     <pre class="des-conf"> $.setWiConf('loading',{
    duration:500,// 动画最短持续时间，避免闪屏
    content: ''
    //fInRender: $.noop// function({content}) 绘制加载容器内容的函数
 });</pre>
     * @demo loading/demo0 loading 动画
     * @demo loading/demo1 模拟多个异步操作的加载条的切换（查看时，请打开控制台）
     * @type function
     * @param {object} opts 配置
     * @param {string} opts.key 每个 loading 唯一的 key 值<span class="t_gray80">，为支持旧版本，此字段允许省略，但将无法控制 hide 时的顺序，不推荐省略</span>。
     * @param {string=} opts.content 文本内容
     * @param {function=} opts.fInRender 加载内容绘制函数，返回值：{string}，function(obj)
     *  - obj.content 初始化时传入的 opts.content
     * @return {object} obj 返回对象
     * @rtn {string} obj.key 返回当前 loading 的 key 值
     */
    $.showLoading = function(opts){
        var conf = WICONF.loading, api;
        var jqLoading = $('body>.loadingdata');
        opts = $.extend({
            //key: ,// 没有传入key，默认储存当前时间戳
            content: conf.content,// 配置项
            fInRender: conf.fInRender// function({content}) 绘制加载容器内容的函数
        }, opts);
        var fInit = function(){
            var fInRender = opts.fInRender,
                sKey = opts.key || $.generateGuid('key'),// 记录当前key值，没有生成唯一键
                sIn;// 显示内容
            if(aLoadingKey.indexOf(sKey) > -1){// key重复 忽略不处理
                return false;
            }
            !opts.key && aLoadingNokey.push(sKey);// 没有传key,将key值存在aLoadingNokey
            aLoadingKey.push(sKey);// key储存在aLoadingKey中 记录顺序
            sIn = fInRender ?
                fInRender({// 根据用户绘制函数绘制内容
                    content: opts.content
                }) :
            '<div class="loadingdata-in">' + opts.content + '</div>';
            oLoadingIn[sKey] = sIn;// 将内容储存在oLoadingIn
            // 若aLoadingIn只有一项，则需要更新显示内容
            if(aLoadingKey.length == 1){
                // 若aLoadingIn只有一项，且无定时器，则为第一次showloading，显示loading动画
                if(!timerLoading){
                    jqLoading = $('<div class="loadingdata">' + sIn + '</div>');
                    $('body').append(jqLoading);
                    nStartTime = new Date().getTime();// 返回 1970 年 1 月 1 日至今的毫秒数。
                }
                else{// 若aLoadingIn只有一项，且有定时器，则仅需更新显示内容
                    clearTimeout(timerLoading);// 清除防闪屏定时器
                    timerLoading = null;
                    jqLoading.html(sIn);
                }
            }
            api.key = sKey;
        };
        api = {
            //key: sKey// 在 fInit() 中赋值，未传 opts.key 时需要在组件中生成
        };
        fInit();
        return api;
    };
    /**
     * @widoc $.hideLoading
     * @namespace aux
     * @des 隐藏 loading 动画。详情参考 $.showLoading()
     * @type function
     * @param {object} opts 配置
     * @param {string} opts.key 每个 loading 唯一的 key 值，与 $.showLoading() 时传入的 key 对应<span class="t_gray80">，为支持旧版本，此字段允许省略，但将无法控制 hide 时的顺序，不推荐省略</span>。
     */
    $.hideLoading = function(opts){
        var jqLoading = $('body>.loadingdata');
        opts = $.extend({
            //key:// 删除对应的key 如果没有key 则删除第一个（最早显示的）未定义key的项
        }, opts);
        var sKey,// 要删除的key
            nKey,// sKey在aLoadingKey中的序号
            nDiff;// 当前距离最早结束时间剩余的毫秒数
        // 要删除的key判断顺序 传入的key > 未传key数组第一项
        sKey = opts.key || aLoadingNokey[0];
        nKey = aLoadingKey.indexOf(sKey);
        if(nKey == -1){// 如果传入的key不存在 则不操作
            return false;
        }
        var fRemove = function(){
            timerLoading = null;
            nStartTime = -1;// 将开始时间归零
            jqLoading.remove();
            oLoadingIn = {};// 清空储存的显示内容sIn
        };
        var fUpdata = function(){
            var nNoKey = aLoadingNokey.indexOf(sKey);
            // 删除对应的key
            aLoadingKey.splice(nKey, 1);
            if(nNoKey !== -1){
                aLoadingNokey.splice(nNoKey, 1);
            }
            if(nKey == 0 && aLoadingKey[0]){// 若删除的为当前显示项（第一项），则更新dom显示内容 如果无显示内容（最后一项被hide） 则不修改
                jqLoading.html(oLoadingIn[aLoadingKey[0]]);
            }
        };
        fUpdata();// 更新数据和显示内容
        if(aLoadingKey.length == 0){// 所有loading都已hide，则删除loading
            if(nStartTime > -1){// 记录了开始时间
                nDiff = nStartTime + WICONF.loading.duration - new Date().getTime();
                if(nDiff <= 0){// 已经超过最早结束时间
                    fRemove();
                }
                else{
                    timerLoading = setTimeout(fRemove, nDiff);
                }
            }
            else{
                fRemove();
            }
        }
    };
})();
WICONF.initCusLayer = {
    win: window
};
/**
 * @widoc $.initCusLayer
 * @namespace comp
 * @des 初始化弹出框
 * <span class="t_red">ps:一般情况推荐使用 $.initWiLayer，该接口封装了更常用的方法</span>
 * 组件配置，在使用组件前调用：
 <pre class="des-conf"> $.setWiConf('initCusLayer',{
    win:window// 默认生成弹框的窗口
 });</pre>
 * @type function
 * @param {function} callback 弹框中的页面可调用的回调函数（不再关闭弹框，关闭需调用 parent.closeLayer['..']()）
 *  - callback(args)
 *    args: {object|undefined} 弹框页面传回主页面的值
 * @param {string} apiName 当前组件对应的选中事件方法名，供弹出的 iframe 页面中调用，避免多个 layer 组件冲突
 * 开放 window.cusLayer 接口供 iframe 调用
 *  - window.cusLayer[apiName](args,w)
 *    args: {object|undefined} 弹框页面传回主页面的值
 *    w: 是否用弹框中的值覆盖原始值，仅当其为 true 时，会调用 callback(args)
 * - window.closeLayer[apiName]() 关闭当前弹窗
 * @param {object=} win 弹框时参照的 window对象，默认为当前 window。
 *    注：win指向的页面依赖外部组件1.2.3 layer，且以同一个win为弹框参照的cusLayer的apiName不得相同
 * @return {object|undefined} obj 返回对象
 * @rtn {function} obj.show(opts) 显示弹框
 *  - opts.content {string} 必须项，弹框页面 url
 *  - opts.title {string=} 弹框标题，默认不显示标题
 *  - opts.area {Array=} 弹框大小，默认为：['400px', '90%']
 */
$.initCusLayer = function(callback, apiName, win){
    if(!win) win = window;
    if(!win.layer) return;
    var curLayerIdx;// 记录当前弹窗索引，用于关闭
    if(!win.cusLayer) win.cusLayer = {};
    if(!win.closeLayer) win.closeLayer = {};
    win.cusLayer[apiName] = function(arg){
        callback && callback(arg);
    };
    win.closeLayer[apiName] = function(){
        win.layer.close(curLayerIdx);
    };
    return {
        show: function(showOpts){
            curLayerIdx = win.layer.open($.extend({// 扩展 layer.open 属性
                type: 2,
                title: false,
                //shadeClose: true,// 允许点遮罩层关闭
                shade: 0.5,// 遮罩层透明度
                area: ['400px', '90%'],
                cancel: win.closeLayer[apiName]
            }, showOpts));
            return curLayerIdx;
        }
    };
};
/**
 * @widoc $.initWiLayer
 * @namespace comp
 * @des 初始化弹出框
 * 注意：弹出页面中若需在弹框后执行操作，则应定义 window.initPage=function(name,data)
 * <span class="t_red">ps:一般情况推荐使用 $.initWiLayer，该接口封装了更常用的方法</span>
 * 组件配置，在使用组件前调用：
 <pre class="des-conf"> $.setWiConf('initCusLayer',{
    win:window// 默认生成弹框的窗口
 });</pre>
 * 弹出页必须定义 window.initPage 方法，弹出后将由组件自动调用，示例：
 <pre class="des-conf"> window.initPage = function(name, data, win){
    // win {object} 发起弹框的 window 对象（不一定是 window.parent，可能由子页面在 window.top 弹出）
    // name {string} win 中初始化弹框时传入的 opts.name
    // data {object} win 中传递的用户自定义参数
    // -------------
    // 关闭弹框：win.closeLayer[name]();
    // 调用 win 的回调：win.cusLayer[name](args); 其中 args 可以弹框页面的回调方法 callback 中获取
 };</pre>
 * @demo initWiLayer/demo 弹出框中显示页面
 * @type function
 * @param {object} opts 设置参数
 * @param {string} opts.name 弹出框的名称，必须保证当前页面中所有弹框名称的唯一性
 * @param {object} opts.layerOpts layer 的配置属性
 * @param {function=} opts.callback 开放给弹框页面的回调方法
 *  - function(args) 在子页面中通过 win.cusLayer[name](args) 触发
 * @return {object} obj 返回对象
 * @rtn {function} obj.show(showOpts) 显示弹框;
 *  - showOpts {object=} 与初始化参数 opts 类似，用于在初始化配置基础上进行修改
 *  -  showOpts.data {object=} 传递到弹框页面的参数，将在弹框页中 window.initPage(layerNmae,data,fromWin)
 *  -  showOpts.layerOpts {object=}
 *  -  showOpts.callback {function=}
 */
$.initWiLayer = function(opts){
    opts = $.extend({
        name: '',
        win: WICONF.initCusLayer.win,// 实际弹框的窗口
        //layerOpts:{content,title,area}
        callback: $.noop
    }, opts);
    var api;
    var win,// 实际弹框的窗口
        fromWin;// 触发弹框的窗口，不一定是弹窗的父窗口
    var oLayerOpts,// 初始化时传入的 layer 配置
        sApiName,// 弹框标识
        curLayerIdx;// 记录当前弹窗索引，用于关闭
    var fLayerCb;// fromeWin 开放给弹框的回调方法
    // 成功显示弹框后的回调
    var fSuccessHandler = function(userSuccess, data){
        return function(layero, index){
            var layerWin = win.frames['layui-layer-iframe' + index].window;
            layerWin.initPage && layerWin.initPage(sApiName, $.extend(undefined, data), fromWin);// 弹出子窗口后，初始化子窗口页面
            userSuccess && userSuccess(layero, index);
        };
    };
    // 弹框关闭时的回调
    var fCancelHandler = function(userCancel){
        return function(index, layero){
            userCancel && userCancel(index, layero);
            fromWin.closeLayer[sApiName]();
        }
    };
    // 显示弹框
    var fShow = function(showOpts){
        var fSuccessCb,fCancelCb,// 用户自定义的 success, cancel（opts.layerOpts 或 showOpts.layerOpts 中）
            layerOpts;
        if(!showOpts){
            showOpts = {};// 避免之后的处理报错
        }
        layerOpts = showOpts.layerOpts || {};// 同上
        fLayerCb = showOpts.callback || opts.callback;// fromeWin 开放给弹框的回调方法
        fSuccessCb = layerOpts.success || oLayerOpts.success;
        fCancelCb = layerOpts.cancel || oLayerOpts.cancel;
        delete layerOpts.success;// 将通过 fSuccessHandler() 封装，此处可从 layerOpts 中移除
        delete layerOpts.cancel;
        /* 弹框 */
        curLayerIdx = win.layer.open(
            $.extend({
                    type: 2,
                    title: false,
                    //area: ['400px', '90%'],
                    //shadeClose: true,// 允许点遮罩层关闭
                    shade: 0.5// 遮罩层透明度
                },
                oLayerOpts,// 初始化时的弹框配置
                layerOpts,// show 时传入的弹框配置
                {
                    content: showOpts.content,// TODO content 仅为支持旧版本，可等价于 showOpts.layerOpts.content
                    success: fSuccessHandler(fSuccessCb, showOpts.data),// 显示弹框后的回调，参数为：用户自定义的 layerOpts.success；弹框时传入的交互数据
                    cancel: fCancelHandler(fCancelCb)
                })
        );
        return curLayerIdx;
    };
    var fPreInit = function(){
        if(!fromWin.cusLayer){//不存在 fromWin.cusLayer,则创建此对象
            fromWin.cusLayer = {};
        }
        if(!fromWin.closeLayer){//不存在 fromWin.closeLayer,则创建此对象
            fromWin.closeLayer = {};
        }
    };
    var fInit = function(){
        win = opts.win;// 实际弹框的窗口
        fromWin = window;// 触发弹框的窗口，不一定是弹窗的父窗口
        if(!win.layer){// 未定义 layer 配置，或不支持 layer，将不执行有意义的操作
            api.show = $.noop;
            return;
        }
        fPreInit();
        /* 预处理完成，执行真正的初始化 */
        sApiName = opts.name;// 弹框标识
        oLayerOpts = opts.layerOpts;// 弹框配置
        fromWin.cusLayer[sApiName] = function(data){
            return fLayerCb(data);// 由于 show 时可能改变 fLayerCb 的引用，因此不能直接 fromWin.cusLayer[sApiName] = fLayerCb;
        };
        fromWin.closeLayer[sApiName] = function(){
            win.layer.close(curLayerIdx);// curLayerIdx 将在 show 之后才能确定
        };
    };
    api = {
        show: fShow
    };
    fInit();
    return api;
};
/**
 * @widoc $.getZhStrLength
 * @namespace aux
 * @des 计算包含中英文字符混合的字符串的长度
 * @type function
 * @param {string} str 要计算长度的字符串
 * @return {int} int 返回计算后的长度
 */
$.getZhStrLength=function(str){
    var totalLength = 0;
    if(!!str) {
        var list = str.split('');// 拆分字符
        for(var i = 0; i < list.length; i++) {
            var s = list[i];
            if (s.match(/[\u0000-\u00ff]/g)) {//半角
                totalLength += 1;
            } else if (s.match(/[\u4e00-\u9fa5]/g)) {//中文
                totalLength += 2;
            } else if (s.match(/[\uff00-\uffff]/g)) {//全角
                totalLength += 2;
            }
        }
    }
    return totalLength;
};
/**
 * @widoc $.subByteString
 * @namespace aux
 * @des 根据字节长度截断字符串
 * @type function
 * @param {string} str 原始字符串
 * @param {int} length 截断的长度（实际，字符为1，中文为2）
 * @return {string} 截断后的字符串
 */
$.subByteString = function(str, length){
    if(!str) return;
    for(var i = 0, len = str.length, byteLen = 0; i < len; i++){
        byteLen += str.charCodeAt(i) > 127 ? 2 : 1;
        if(byteLen > length) break;
    }
    return str.substring(0, i) + (i != len ? '..' : '');
};
/**
 * @widoc $.adaptElement
 * @namespace aux
 * @des 弹出位置计算
 * @type function
 * @param {object} elBCR 参照元素的 BCR
 * @param {int} viewW 视图范围的宽
 * @param {int} viewH 视图范围的高
 * @param {int} targetElWidth 弹出项的宽
 * @param {int} targetElHeight 弹出项的高
 * @param {string} positionStr 定位方向: 'p-p'，可能的值：top,left,right,bottom,center。
 * @param {boolean=} adjust 是否允许调整弹出方向
 * @param {object=} appendToEl 以参照元素计算定位，未定义则以窗口为参照(.overlay)
 * @return {Array} rObj 返回数组
 * @rtn {object} rObj[0] {top,bottom,left,right} 各字段对应的值为字符串。如：'100px' 或 ''
 * @rtn {string} rObj[1] 实际弹出方向。如：'top-right'
 */
$.adaptElement=function(elBCR, viewW, viewH, targetElWidth, targetElHeight, positionStr, adjust, appendToEl){
    var elTop=elBCR.top
        ,elLeft=elBCR.left
        ,elBot=elBCR.bottom
        ,elRight=elBCR.right;
    var positionStrParts = typeof positionStr=='string' ? positionStr.split('-') : [];
    var pos0= positionStrParts[0] || 'bottom'
        ,pos1= positionStrParts[1] || 'left';
    var cssObj={};
    if(adjust) {// 允许调整方向
        /**
         * 返回是否需要反向
         * @param nowS - 当前空间尺寸
         * @param otherS - 备选空间尺寸
         * @param targetS - 需要的空间尺寸
         */
        var shouldChange = function (nowS, otherS, targetS) {
            var nowLess = nowS < targetS,
                targetLess = otherS < targetS;
            return nowLess && (!targetLess || targetLess && otherS > nowS);//当前空间不足时，反向空间足够，或反向虽然不够，但比当前大，返回 true，即需要反向
        };
        // 确定 pos0，若当前空间不足且备选空间足够，或都不足但备选空间较大，则反向
        switch (pos0) {
            case 'left':
                shouldChange(elLeft, viewW - elRight, targetElWidth) && (pos0 = 'right');
                break;
            case 'right':
                shouldChange(viewW - elRight, elLeft, targetElWidth) && (pos0 = 'left');
                break;
            case 'top':
                shouldChange(elTop, viewH - elBot, targetElHeight) && (pos0 = 'bottom');
                break;
            default :
                pos0 = 'bottom';
                shouldChange(viewH - elBot, elTop, targetElHeight) && (pos0 = 'top');
        }
        // 确定 pos1
        switch (pos1) {
            case 'center':
                break;
            case 'top' :
                shouldChange(viewH - elTop, elBot, targetElHeight) && (pos1 = 'bottom');
                break;
            case 'bottom':
                shouldChange(elBot, viewH - elTop, targetElHeight) && (pos1 = 'top');
                break;
            case 'right':
                shouldChange(elRight, viewW - elLeft, targetElWidth) && (pos1 = 'left');
                break;
            default :
                pos1 = 'left';
                shouldChange(viewW - elLeft, elRight, targetElWidth) && (pos1 = 'right');
        }
    }
    if(appendToEl){
        // 一级位置已确定，通过返回方向由 class 名控制，不需计算
        // 二级方向位置确定，单向空间不足时，向右/下贴边
        switch(pos1){
            case 'center':
                if(['left', 'right'].indexOf(pos0) >= 0){
                    cssObj.top = Math.floor((elBot-elTop - targetElHeight)/2) + 'px';
                }
                else{
                    cssObj.left = Math.floor((elRight-elLeft - targetElWidth)/2) + 'px';
                }
                break;
            case 'top' :
                if(adjust != false && viewH - elTop < targetElHeight)
                    cssObj.top = viewH - elTop - targetElHeight + 'px';
                break;
            case 'bottom':
                if(adjust != false && elBot < targetElHeight)
                    cssObj.bottom = elBot - viewH + 'px';
                break;
            case 'right':
                if(adjust != false && elRight < targetElWidth)
                    cssObj.right = elRight - viewW + 'px';
                break;
            default:
                pos1 = 'left';
                if(adjust != false && viewW - elLeft < targetElWidth)
                    cssObj.left = viewW - elLeft - targetElWidth + 'px';
        }
    }else{
        // 根据参照元素的文档位置，计算弹出项的文档位置
        switch(pos0){
            case 'left':
                cssObj.left = elLeft - targetElWidth + 'px';
                break;
            case 'right':
                cssObj.left = elRight + 'px';
                break;
            case 'top':
                cssObj.top = elTop - targetElHeight + 'px';
                break;
            default :
                pos0 = 'bottom';
                cssObj.top = elBot + 'px';
        }
        // 二级方向位置确定，单向空间不足时，向右/下贴边
        switch(pos1){
            case 'center':
                if(['left', 'right'].indexOf(pos0) >= 0){
                    cssObj.top = elTop + Math.floor((elBot - elTop - targetElHeight)/2) + 'px';
                }
                else{
                    cssObj.left = elLeft + Math.floor((elRight - elLeft - targetElWidth)/2) + 'px';
                }
                break;
            case 'top':
                if(adjust && viewH - elTop < targetElHeight)
                    cssObj.top = viewH - targetElHeight + 'px';// 贴边
                else
                    cssObj.top = elTop + 'px';
                break;
            case 'bottom':
                if(adjust && elBot < targetElHeight)
                    cssObj.top = viewH - targetElHeight + 'px';// 贴边
                else
                    cssObj.top = elBot - targetElHeight + 'px';
                break;
            case 'right':
                if(adjust && elRight < targetElWidth)
                    cssObj.left = elLeft - elLeft + viewW - targetElWidth + 'px';
                else
                    cssObj.left = elRight - targetElWidth + 'px';
                break;
            default :
                pos1 = 'left';
                if(adjust && viewW - elLeft < targetElWidth)
                    cssObj.left = elLeft - elLeft + viewW - targetElWidth + 'px';
                else
                    cssObj.left = elLeft + 'px';
        }
    }
    return [{
        'top': cssObj.top ? cssObj.top : ''
        ,'bottom': cssObj.bottom ? cssObj.bottom : ''
        ,'left': cssObj.left ? cssObj.left : ''
        ,'right': cssObj.right ? cssObj.right : ''
    }, pos0 + '-' + pos1];
};
/**
 * @widoc $.pureClone
 * @namespace aux
 * @des 根据源对象深度拷贝数据，并删除 __ 开头的组件属性
 * @type function
 * @param {Array|object} src 拷贝参照的对象
 * @return {Array|object}
 */
$.pureClone=function(src){
    // 基本类型及 function
    if(typeof src !== 'object' || src===null) return src;
    var dst = Object.prototype.toString.call(src) === '[object Array]' ? [] : {};//判断参数的类型,定义要拷贝的对象的数据类型
    for(var i in src){
        if(src.hasOwnProperty(i) && !/^__/.test(i)){
            dst[i] = typeof src[i] === 'object' && src ? $.pureClone(src[i]) : src[i];
        }
    }
    return dst;
};
/**
 * @widoc $.generateGuid
 * @namespace aux
 * @des 生成唯一键 guid
 * @type function
 * @param {object} key guid 的前缀
 * @return {string} str 返回生成的字符串
 */
$.generateGuid=function(key){
    var guid='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return (key||'')+guid;
};
/**
 * @widoc $.makePyArr
 * @namespace aux
 * @des 根据 zhStr 的拼音，生成所有可能的拼音首字母字符串，并返回字符串组成的数组。
 * @type function
 * @param zhStr {string} 中文字符串
 * @return {Array} 所有可能的拼音首字母串数组
 */
$.makePyArr=function(zhStr){
    var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
    //此处收了375个多音字
    var oMultiDiff={"19969":"DZ","19975":"WM","19988":"QJ","20048":"YL","20056":"SC","20060":"NM","20094":"QG","20127":"QJ","20167":"QC","20193":"YG","20250":"KH","20256":"ZC","20282":"SC","20285":"QJG","20291":"TD","20314":"YD","20340":"NE","20375":"TD","20389":"YJ","20391":"CZ","20415":"PB","20446":"YS","20447":"SQ","20504":"TC","20608":"KG","20854":"QJ","20857":"ZC","20911":"PF","20985":"AW","21032":"PB","21048":"XQ","21049":"SC","21089":"YS","21119":"JC","21242":"SB","21273":"SC","21305":"YP","21306":"QO","21330":"ZC","21333":"SDC","21345":"QK","21378":"CA","21397":"SC","21414":"XS","21442":"SC","21477":"JG","21480":"TD","21484":"ZS","21494":"YX","21505":"YX","21512":"HG","21523":"XH","21537":"PB","21542":"PF","21549":"KH","21571":"E","21574":"DA","21588":"TD","21589":"O","21618":"ZC","21621":"KHA","21632":"ZJ","21654":"KG","21679":"LKG","21683":"KH","21710":"A","21719":"YH","21734":"WOE","21769":"A","21780":"WN","21804":"XH","21834":"A","21899":"ZD","21903":"RN","21908":"WO","21939":"ZC","21956":"SA","21964":"YA","21970":"TD","22003":"A","22031":"JG","22040":"XS","22060":"ZC","22066":"ZC","22079":"MH","22129":"XJ","22179":"XA","22237":"NJ","22244":"TD","22280":"JQ","22300":"YH","22313":"XW","22331":"YQ","22343":"YJ","22351":"PH","22395":"DC","22412":"TD","22484":"PB","22500":"PB","22534":"ZD","22549":"DH","22561":"PB","22612":"TD","22771":"KQ","22831":"HB","22841":"JG","22855":"QJ","22865":"XQ","23013":"ML","23081":"WM","23487":"SX","23558":"QJ","23561":"YW","23586":"YW","23614":"YW","23615":"SN","23631":"PB","23646":"ZS","23663":"ZT","23673":"YG","23762":"TD","23769":"ZS","23780":"QJ","23884":"QK","24055":"XH","24113":"DC","24162":"ZC","24191":"GA","24273":"QJ","24324":"NL","24377":"TD","24378":"QJ","24439":"PF","24554":"ZS","24683":"TD","24694":"WE","24733":"LK","24925":"TN","25094":"ZG","25100":"XQ","25103":"XH","25153":"PB","25170":"PB","25179":"KG","25203":"PB","25240":"ZS","25282":"FB","25303":"NA","25324":"KG","25341":"ZY","25373":"WZ","25375":"XJ","25384":"A","25457":"A","25528":"SD","25530":"SC","25552":"TD","25774":"ZC","25874":"ZC","26044":"YW","26080":"WM","26292":"PB","26333":"PB","26355":"ZY","26366":"CZ","26397":"ZC","26399":"QJ","26415":"ZS","26451":"SB","26526":"ZC","26552":"JG","26561":"TD","26588":"JG","26597":"CZ","26629":"ZS","26638":"YL","26646":"XQ","26653":"KG","26657":"XJ","26727":"HG","26894":"ZC","26937":"ZS","26946":"ZC","26999":"KJ","27099":"KJ","27449":"YQ","27481":"XS","27542":"ZS","27663":"ZS","27748":"TS","27784":"SC","27788":"ZD","27795":"TD","27812":"O","27850":"PB","27852":"MB","27895":"SL","27898":"PL","27973":"QJ","27981":"KH","27986":"HX","27994":"XJ","28044":"YC","28065":"WG","28177":"SM","28267":"QJ","28291":"KH","28337":"ZQ","28463":"TL","28548":"DC","28601":"TD","28689":"PB","28805":"JG","28820":"QG","28846":"PB","28952":"TD","28975":"ZC","29100":"A","29325":"QJ","29575":"SL","29602":"FB","30010":"TD","30044":"CX","30058":"PF","30091":"YSP","30111":"YN","30229":"XJ","30427":"SC","30465":"SX","30631":"YQ","30655":"QJ","30684":"QJG","30707":"SD","30729":"XH","30796":"LG","30917":"PB","31074":"NM","31085":"JZ","31109":"SC","31181":"ZC","31192":"MLB","31293":"JQ","31400":"YX","31584":"YJ","31896":"ZN","31909":"ZY","31995":"XJ","32321":"PF","32327":"ZY","32418":"HG","32420":"XQ","32421":"HG","32438":"LG","32473":"GJ","32488":"TD","32521":"QJ","32527":"PB","32562":"ZSQ","32564":"JZ","32735":"ZD","32793":"PB","33071":"PF","33098":"XL","33100":"YA","33152":"PB","33261":"CX","33324":"BP","33333":"TD","33406":"YA","33426":"WM","33432":"PB","33445":"JG","33486":"ZN","33493":"TS","33507":"QJ","33540":"QJ","33544":"ZC","33564":"XQ","33617":"YT","33632":"QJ","33636":"XH","33637":"YX","33694":"WG","33705":"PF","33728":"YW","33882":"SR","34067":"WM","34074":"YW","34121":"QJ","34255":"ZC","34259":"XL","34425":"JH","34430":"XH","34485":"KH","34503":"YS","34532":"HG","34552":"XS","34558":"YE","34593":"ZL","34660":"YQ","34892":"XH","34928":"SC","34999":"QJ","35048":"PB","35059":"SC","35098":"ZC","35203":"TQ","35265":"JX","35299":"JX","35782":"SZ","35828":"YS","35830":"E","35843":"TD","35895":"YG","35977":"MH","36158":"JG","36228":"QJ","36426":"XQ","36466":"DC","36710":"JC","36711":"ZYG","36767":"PB","36866":"SK","36951":"YW","37034":"YX","37063":"XH","37218":"ZC","37325":"ZC","38063":"PB","38079":"TD","38085":"QY","38107":"DC","38116":"TD","38123":"YD","38224":"HG","38241":"XTC","38271":"ZC","38415":"YE","38426":"KH","38461":"YD","38463":"AE","38466":"PB","38477":"XJ","38518":"YT","38551":"WK","38585":"ZC","38704":"XS","38739":"LJ","38761":"GJ","38808":"SQ","39048":"JG","39049":"XJ","39052":"HG","39076":"CZ","39271":"XT","39534":"TD","39552":"TD","39584":"PB","39647":"SB","39730":"LG","39748":"TPB","40109":"ZQ","40479":"ND","40516":"HG","40536":"HG","40583":"QJ","40765":"YQ","40784":"QJ","40840":"YK","40863":"QJG"};
    /**
     * 获取当前字符的拼音首字母
     * @param ch {string} 字符串
     * @return {*}
     */
    var checkCh=function(ch){
        var uni = ch.charCodeAt(0);
        if(uni > 40869 || uni < 19968) return ch;// 不在汉字范围内,返回原字符
        return (oMultiDiff[uni] ? oMultiDiff[uni] : strChineseFirstPY.charAt(uni-19968));// 多音字处理,否则在 strChineseFirstPY 字符串中找对应的首字母
    };
    /**
     * @param arr 逐个字符处理的结果数组
     * @return {string[]} 返回所有可能的拼音首字母串数组
     */
    var mkRslt=function(arr){
        var arrRslt = [''];
        for(var i=0,len=arr.length;i<len;i++){
            var str = arr[i];
            var strlen = str.length;
            if(strlen == 1){
                for(var k=0;k<arrRslt.length;k++){
                    arrRslt[k] += str;
                }
            }else{
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                for(k=0;k<strlen;k++){
                    var tmp = tmpArr.slice(0);// 复制一个相同的arrRslt
                    //把当前字符str[k]添加到每个元素末尾
                    for(var j=0;j<tmp.length;j++){
                        tmp[j] += str.charAt(k);
                    }
                    //把复制并修改后的数组连接到arrRslt上
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        return arrRslt;
    };
    var arrResult = []; //保存中间结果的数组
    for(var i=0,len=zhStr.length;i<len;i++){
        var ch = zhStr.charAt(i);//获得unicode码
        // 检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
        arrResult.push(checkCh(ch));
    }
    //处理arrResult,返回所有可能的拼音首字母串数组
    return mkRslt(arrResult);
};
// 十六进制数组
var _hexArray=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
/**
 * @widoc $.encodeJavascript
 * @namespace aux
 * @des 预防XSS，输出到事件或脚本时使用
 * 使用"\"对特殊字符进行转义，
 * 除数字字母之外，小于127使用16进制"\xHH"的方式进行编码，
 * 大于127使用unicode
 * 参考：http://www.cnblogs.com/lovesong/p/5211667.html
 * @type function
 * @param {string} str 源字符串
 * @return {string} str 返回处理后的字符串
 */
$.encodeJavascript = function(str){
    // 非字符串不处理
    if ('string' != typeof(str)) return str;
    var preEscape = str;// 处理前
    var escaped = "";// 处理后
    for (var i = 0; i < preEscape.length; i++) {
        escaped = escaped + encodeCharx(preEscape.charAt(i));
    }
    return escaped;

    // 字符编码
    function encodeCharx(original) {
        var theChar = original.charAt(0);// 字符
        var theUnicode = original.charCodeAt(0);// 字符的unicode值
        // 特殊字符转义
        switch (theChar) {
            case '\n': return "\\n";
            case '\r': return "\\r";
            case '\'': return "\\'";
            case '"': return "\\\"";
            case '\&': return "\\&";
            case '\\': return "\\\\";
            case '\t': return "\\t";
            case '\b': return "\\b";
            case '\f': return "\\f";
            case '/': return "\\x2F";
            case '<': return "\\x3C";
            case '>': return "\\x3E";
            default: return normalChar();
        }
        // 其它字符处理
        function normalChar() {
            if ((theUnicode > 47 && theUnicode < 58)// 数字
                || (theUnicode > 64 && theUnicode < 91)// 大写字母
                || (theUnicode > 96 && theUnicode < 123)) {// 小写字母
                return original;
            }
            if (theUnicode > 127) {// 大于127使用unicode
                var c = theUnicode;
                var a4 = c % 16;
                c = Math.floor(c / 16);
                var a3 = c % 16;
                c = Math.floor(c / 16);
                var a2 = c % 16;
                c = Math.floor(c / 16);
                var a1 = c % 16;
                return "\\u" + _hexArray[a1] + _hexArray[a2] + _hexArray[a3] + _hexArray[a4] + "";
            }
            // 16进制
            return "\\x" + original.charCodeAt(0).toString(16);
        }
    }
};
/**
 * @widoc $.encodeHtml
 * @namespace aux
 * @des 预防XSS，输出到HTML内容或者属性
 * 将字符转换成HTMLEntites
 * 参考：http://www.cnblogs.com/lovesong/p/5211667.htm
 * @type function
 * @param {string} str 源字符串
 * @return {string} str 返回处理后的字符串
 */
$.encodeHtml =function(str){
    // 非字符串不处理
    if ('string' != typeof(str)) return str;
    var preEscape = str;// 处理前
    var escaped = "";// 处理后
    for (var i = 0; i < preEscape.length; i++) {
        var p = preEscape.charAt(i);
        escaped = escaped + encodeCharx(p);
    }
    return escaped;

    // 字符编码
    function encodeCharx(original){
        var thechar = original.charCodeAt(0);// 字符
        switch(thechar){
            case 10: return "<br/>";//newline
            case 32: return "&nbsp;";//space
            case 34: return "&quot;";//"
            case 38: return "&amp;";//&
            case 39: return "&#x27;";//'
            case 47: return "&#x2F;";// /
            case 60: return "&lt;";//<
            case 62: return "&gt;";//>
            case 198: return "&AElig;";
            case 193: return "&Aacute;";
            case 194: return "&Acirc;";
            case 192: return "&Agrave;";
            case 197: return "&Aring;";
            case 195: return "&Atilde;";
            case 196: return "&Auml;";
            case 199: return "&Ccedil;";
            case 208: return "&ETH;";
            case 201: return "&Eacute;";
            case 202: return "&Ecirc;";
            case 200: return "&Egrave;";
            case 203: return "&Euml;";
            case 205: return "&Iacute;";
            case 206: return "&Icirc;";
            case 204: return "&Igrave;";
            case 207: return "&Iuml;";
            case 209: return "&Ntilde;";
            case 211: return "&Oacute;";
            case 212: return "&Ocirc;";
            case 210: return "&Ograve;";
            case 216: return "&Oslash;";
            case 213: return "&Otilde;";
            case 214: return "&Ouml;";
            case 222: return "&THORN;";
            case 218: return "&Uacute;";
            case 219: return "&Ucirc;";
            case 217: return "&Ugrave;";
            case 220: return "&Uuml;";
            case 221: return "&Yacute;";
            case 225: return "&aacute;";
            case 226: return "&acirc;";
            case 230: return "&aelig;";
            case 224: return "&agrave;";
            case 229: return "&aring;";
            case 227: return "&atilde;";
            case 228: return "&auml;";
            case 231: return "&ccedil;";
            case 233: return "&eacute;";
            case 234: return "&ecirc;";
            case 232: return "&egrave;";
            case 240: return "&eth;";
            case 235: return "&euml;";
            case 237: return "&iacute;";
            case 238: return "&icirc;";
            case 236: return "&igrave;";
            case 239: return "&iuml;";
            case 241: return "&ntilde;";
            case 243: return "&oacute;";
            case 244: return "&ocirc;";
            case 242: return "&ograve;";
            case 248: return "&oslash;";
            case 245: return "&otilde;";
            case 246: return "&ouml;";
            case 223: return "&szlig;";
            case 254: return "&thorn;";
            case 250: return "&uacute;";
            case 251: return "&ucirc;";
            case 249: return "&ugrave;";
            case 252: return "&uuml;";
            case 253: return "&yacute;";
            case 255: return "&yuml;";
            case 162: return "&cent;";
            case '\r': break;
            default: return normalChar();
        }
        // 其它字符处理
        function normalChar() {
            if (thechar > 127) {
                var c = thechar;
                var a4 = c % 16;
                c = Math.floor(c / 16);
                var a3 = c % 16;
                c = Math.floor(c / 16);
                var a2 = c % 16;
                c = Math.floor(c / 16);
                var a1 = c % 16;
                return "&#x" + _hexArray[a1] + _hexArray[a2] + _hexArray[a3] + _hexArray[a4] + ";";
            }
            else return original;
        }
    }
};
WICONF.request = {
    showloading: false,
    errorMsg: '网络异常，请稍后再试!'
};
/**
 * @widoc $.request
 * @namespace aux
 * @des 请求数据，要求后台返回的数据结构：
 *   - success {boolean}
 *   - msg {string} success=false 时的错误提示
 *   - data 将作为 onSuccess 的参数
 * 组件配置，在使用组件前调用：
 <pre class="des-conf"> $.setWiConf('request',{
    showloading: false,
    errorMsg: '网络异常，请稍后再试!'
 });</pre>
 * @demo request/demo 发起 ajax 请求获取交互数据
 * @type function
 * @param {object} opts
 * @param {object} opts.ajaxOpts 调用 $.ajax() 请求时的自定义配置，详情参考 jQuery API。
 *   常用属性如下：
 *   - opts.ajaxOpts.url {string} 请求地址
 *   - opts.ajaxOpts.data {object|string} 请求参数，简单参数传 object，复杂参数应先 JSON.stringify()
 * @param {function=} opts.onSuccess(data) 成功回调(参数：数据集合 result.data)，请求成功且 request.success=true 时触发。
 * @param {function=} opts.onError(oErrInfo) 异常回调，请求失败或 request.success!=true 时触发。
 *   - oErrInfo {object}
 *   oErrInfo.type = 'success' 时，oErrInfo 中还包含：msg, result, textStatus, jqXHR
 *   oErrInfo.type = 'error' 时，oErrInfo 中还包含：msg, errorThrown, textStatus, jqXHR
 * @param {boolean|object=} opts.showloading 请求时是否显示 loading 动画，值为 object 时，作为 $.showLoading(opts) 的参数。默认值通过 $.setWiConf() 配置
 * @param {boolean=} opts.argToJson 请求时是否传递复杂参数，设为 true 时附加属性 contentType:"application/json"，并将请求参数格式化为 JSON 字符串，默认为 false。
 * @param {string=} opts.errorMsg 该请求默认的错误提示信息，默认值通过 $.setWiConf() 配置。
 * @return {object} jqXHR 实现了 promise 接口的 jqXHR 对象，详见 jQuery API
 */
$.request = function(opts){
    var CONF = WICONF.request;// 全局配置
    opts = $.extend({
        ajaxOpts: {},
        onSuccess: $.noop,
        //onError: function(oErrInfo),// 未定义时需使用默认操作，故不应设置默认值，在 fHandleErr() 中判断
        showloading: CONF.showloading,
        argToJson: false,
        errorMsg: CONF.errorMsg
    }, opts);

    var oAjaxOpts,// 用户自定义的 $.ajax() 配置
        fSucCus, fErrCus;// success, error 将在组件中重写，因此需要缓存用户自定义的实现

    // 异常处理函数
    var fHandleErr = function(oErrInfo){
        // oErrInfo.type = 'success' 时，oErrInfo 中还包含：msg, result, textStatus, jqXHR
        // oErrInfo.type = 'error' 时，oErrInfo 中还包含：msg, errorThrown, textStatus, jqXHR
        var fOnError = opts.onError,
            sMsg = oErrInfo.msg;
        if(fOnError){
            fOnError(oErrInfo);
        }
        else{
            sMsg && $.showAlert(sMsg);
        }
    };

    // 发起请求
    var fRequest = function(){
        var oShowloading = opts.showloading,
            sLoadingKey;// showLoading() 时生成的 loading 对应的 key
        var fSuccess = function(result, textStatus, jqXHR){
            sLoadingKey && $.hideLoading({key: sLoadingKey});// 传入 key，关闭对应的 loading
            if(result.success){
                opts.onSuccess(result.data);
            }
            else{
                fHandleErr({
                    type: 'success',
                    msg: result.msg || opts.errorMsg,
                    result: result,
                    textStatus: textStatus,
                    jqXHR: jqXHR
                });
            }
            fSucCus && fSucCus(result, textStatus, jqXHR);
        };
        var fError = function(jqXHR, textStatus, errorThrown){
            sLoadingKey && $.hideLoading({key: sLoadingKey});// 传入 key，关闭对应的 loading
            fHandleErr({
                type: 'error',
                msg: opts.errorMsg,
                errorThrown: errorThrown,
                textStatus: textStatus,
                jqXHR: jqXHR
            });
            fErrCus && fErrCus(jqXHR, textStatus, errorThrown);
        };

        // 开启 loading 动画
        if(oShowloading){
            sLoadingKey = $.showLoading(oShowloading).key;// 记录 key，以关闭对应的 loading
        }
        return $.ajax($.extend({
            success: fSuccess,
            error: fError,
            type: 'post',
            dataType: 'json'
        }, oAjaxOpts));
    };

    var fInit = function(){
        var ajaxData;
        oAjaxOpts = opts.ajaxOpts;
        if(opts.argToJson){
            oAjaxOpts.contentType = "application/json";
            ajaxData = oAjaxOpts.data;// 复杂参数需要格式化
            if(typeof ajaxData == 'object'){
                oAjaxOpts.data = JSON.stringify(ajaxData);
            }
        }
        fSucCus = oAjaxOpts.success;
        fErrCus = oAjaxOpts.error;
        delete oAjaxOpts.success;
        delete oAjaxOpts.error;
    };

    fInit();
    return fRequest();// 返回实现了 promise 接口的 jqXHR 对象
};

// TODO del 兼容旧版本，现改为 $.request(opts)
$.fn.request = function(opts, fOnSuccessCus, args, showloading, argToJson){
    var _this = this,
        oReqOpts = {};// $.request(oReqOpts)
    var fOnErrorCus;// 用户自定义的 onError 处理函数
    /* 参数处理 */
    if(Object.prototype.toString.call(opts) === '[object String]'){
        oReqOpts = {
            ajaxOpts: {
                url: opts,
                data: args
            },
            showloading: showloading,
            argToJson: argToJson
            // errorMsg: 旧版本中不支持此属性的设置，故忽略
            // onSuccess: 因为旧版本中回调的 this 需指向 _this，因此在调用 $.request() 前才处理
            // onError: 旧版本中不支持此属性的设置，故忽略
        };
    }
    else if(opts){
        oReqOpts = {
            ajaxOpts: opts.ajaxOpts,
            showloading: opts.showloading,
            argToJson: opts.argToJson,
            errorMsg: opts.errorMsg
            // onSuccess: 同上
            // onError: 因为旧版本中 onError 接收的参数不同，因此需要单独处理
        };
        fOnSuccessCus = opts.drawDomFn;// 旧版本中接口为 opts.drawDomFn，对应新版本中 onSuccess
        fOnErrorCus = opts.onError;
        if(fOnErrorCus){
            oReqOpts.onError = function(oErrInfo){
                switch(oErrInfo.type){
                    case 'success':
                        fOnErrorCus(oErrInfo.result, oErrInfo.msg);
                        break;
                    case 'error':
                        fOnErrorCus(oErrInfo.jqXHR, oErrInfo.textStatus, oErrInfo.errorThrown, oErrInfo.msg);
                        break;
                }
            };
        }
    }
    if(fOnSuccessCus){
        oReqOpts.onSuccess = function(data){
            fOnSuccessCus.call(_this, data);
        };
    }
    $.request(oReqOpts);

    return _this;
};
WICONF.initPageBar = {
    visiblePages: 5,// 页码数量
    percount: 20,// 每页显示的数据条数
    toolTxts: ['首页', '上页', '下页', '末页']
};
/**
 * @widoc $.fn.initPageBar
 * @namespace comp
 * @des 分页：对象为 pageBar 容器 class="manu"
 * 组件配置，在使用组件前调用：
 <pre class="des-conf"> $.setWiConf('initPageBar',{
visiblePages:5,// 页码数量（奇数）
percount:20// 每页显示的数据条数
toolTxts:['首页','上页','下页','末页']
});</pre>
 * @type function
 * @demo initPageBar/demo 普通分页(后台分页)，后台返回数据为 {success:true,msg:'错误提示',data:{totalcount:100,retlist:[]}}
 * @demo initPageBar/demo_front 前台分页，后台返回数据为 {success:true,msg:'错误提示',data:[]}
 * @demo initPageBar/demo_cus 自定义分页条 dom
 * @param {object} opts 配置参数
 * @param {int=} opts.percount 每页显示的数据条数，默认为 20，若定义了 opts.perList，opts.percount 必须为其中之一，否则默认为 opts.perList[0]
 * @param {int=} opts.per <span class="t_gray80">请用 opts.percount 替代。</span>
 * @param {Array=} opts.perList 可选择的每页页码列表，若未定义则不可切换
 * @param {object=} opts.render 自定义 dom 结构配置对象。自定义事件绑定请参考 opts.callback.render。默认为:
 <pre class="des-conf">render:{
    left: ['total', 'per', 'go'],
    center: [],
    right: ['prev', 'page', 'next']
} </pre>
 * @param {Array=} opts.render.left 左侧 dom 结构定义
 * - opts.render.left[i] {string|function} 依次指定绘制的内容
 * 类型为 string 时，绘制组件内部默认的项，对应关系如下：
 * total: 共x页x条; per: perList+每页几条; go: 页码跳转;
 * prev: 首页+上一页; next: 下一页+末页; page: 页码主体
 * 类型为 function 时，function(oPageInApi, api){}，返回 string 作为绘制内容，绘制的元素中严禁使用 data-wi-* 属性
 * - oPageInApi {object} 当前的分页信息，包含 percount, totalpage, curpage, totalcount
 * - api {object} 初始化完成后返回的组件 api
 * @param {Array=} opts.render.right 右侧 dom 结构定义，同上
 * @param {Array=} opts.render.center 中侧 dom 结构定义，同上
 * @param {object=} opts.callback 自定义事件绑定。
 * @param {object=} opts.callback.render 对 opts.render 中通过 function 设置的自定义内容定义事件。
 <pre class="des-conf">render:{
    name:{// 对应自定义绘制内容中的元素上的 data-manu 属性值
        evtype:function(e){...} // evtype 为绑定的事件类型，如：clikc；e 为触发事件的 event 对象
    }
}</pre>
 * @param {int=} opts.autoPage 数据源变更后首次跳转的页码（从 1 开始），之后此属性会重设为 1，可以在重置数据源时重新传入。默认为 1
 * @param {Array=} opts.toolTxts 长度为4的数组，页码中首页、上页、下页、末页显示的内容，文本或dom字符串
 * @param {Array=} opts.data 前台分页时的数据源，优先级高于 opts.url
 * @param {string=} opts.url 后台分页时的请求 url。opts.data 定义时此属性失效
 * @param {object=} opts.args 后台分页时发送到 opts.url 的请求参数
 * @param {boolean=} opts.showloading 后台分页请求时是否显示加载动画，默认 false
 * @param {boolean=} opts.requestOpts 后台分页时，自定义的请求配置，其中 onSuccess,showloading,ajaxOpts.url,ajaxOpts.data 失效，请用其他属性实现
 * @param {function=} opts.afterFlip 每次翻页后的回调函数 function(datalist,pageObj,data)
 *   - datalist {Array} 请求页所有数据
 *   - pageObj {object} 分页对象
 *       pageObj.totalpage 总页数
 *       pageObj.curpage 当前页码（从1开始）
 *       pageObj.percount 每页数据条数
 *       pageObj.totalcount 总数据数
 *   - data {object} 后台分页时，每次分页请求到的后台数据的 data 部分；前台分页时，所有数据的集合
 * @return {object|undefined} obj 接口对象
 * @rtn {object} obj.page 获得分页信息
 *   - {int} obj.page.percount 每页条数
 *   - {int} obj.page.totalpage 总页数
 *   - {int} obj.page.curpage 当前页码
 *   - {int} obj.page.totalcount 总数据条数
 * @rtn {function} obj.fReset(cusOpts) 重设组件配置
 *   - {object} cusOpts 参考初始化参数。注意：不支持 <span class="t_gray80">per</span>，请用 percount 替代。
 * @rtn {function} obj.reset(cusOpts) <span class="t_gray80">请用 obj.fReset() 替代。</span>
 * @rtn {function} obj.goPage(i) 跳转到第 i 页，i 从 1 开始
 * @rtn {function} obj.fGetCurData() 获取当前页的数据
 * @rtn {function} obj.fGetData() 获取全部页的数据（后台分页时，与 fGetCurData() 的返回值相同）
 * @rtn {function} obj.destroy() 销毁。<span class="t_gray80">组件内部 $.fn.initGrid 依赖此方法，项目中不需使用。</span>
 */
$.fn.initPageBar = function(opts){
    var el = $(this), api,
        CONF = WICONF.initPageBar;// 全局配置
    opts = $.extend({
        //per: CONF.per,// 兼容旧版本，同 percount
        percount: CONF.percount,// 每页显示的数据条数
        perList: [],// 可选择的每页页码列表，若未定义则不可切换
        render: {// 自定义 dom 结构配置对象
            left: ['total', 'per', 'go'],
            center: [],
            right: ['prev', 'page', 'next']
        },
        //callback: {},// 自定义事件绑定
        autoPage: 1,// 数据源变更后首次跳转的页码（从 1 开始），之后此属性会重设为 1，可以在重置数据源时重新传入
        toolTxts: CONF.toolTxts,// 长度为4的数组，页码中首页、上页、下页、末页显示的内容，文本或dom字符串
        //data:[],// 前台分页时的数据源
        //url:'',// 后台分页时请求的 url
        //args: {},// 后台分页时的参数
        showloading: false,// 后台分页请求时是否显示加载动画
        requestOpts: {},// $.reuqest 时需要扩展的配置，其中 onSuccess,showloading,ajaxOpts.url,ajaxOpts.data 失效，请用其他属性实现
        afterFlip: $.noop// function(aCurData, oPageInApi, oriData) 转页后的回调函数。aCurData:当前页数据;oPageInApi:当前分页信息;oriData:前台分页为全部数据，后台分页为后台请求返回的原始数据
    }, opts);
    var aPerList, oPageInApi = {},
        nPer,// 每页显示的条数 - 数据处理前定义的临时值，若不能正常跳页，则不会作用到 oPageInApi
        aAllData, aCurData,// 全部数据（前台分页时才有意义），当前页数据 - 这两个变量需要与 dom 绘制同步
        oReqOpts, oReqAjaxOpts,// 请求时使用的用户自定义配置
        aLeftRender,// 左侧 dom 结构定义
        aRightRender,// 右侧 dom 结构定义
        aCenterRender,// 中间 dom 结构定义
        oRenderCb;// 对 opts.render 中自定义内容绑定的事件定义
    // 翻页按钮点击事件
    var fChangeGoClick = function(){
        fGoPage(el.find('.manu-txt').val());
    };
    // 页码点击事件
    var fChangePageClick = function(){
        fGoPage($(this).attr('data-page'));
    };
    // 切换 perList 选项时的回调
    var fOnPerListChange = function(){
        nPer = parseInt($(this).val(), 10);// 不应同步到 opts，修改 opts 应该通过 fReset 接口实现
        fGoPage(1);
    };
    // 获取当前页的数据
    var fGetCurData = function(){
        return aCurData;
    };
    // 获取全部页的数据（后台分页时，与 fGetCurData() 的返回值相同）
    var fGetData = function(){
        return aAllData || aCurData;// 后台分页时 aAllData 为 undefined，此时返回当前页数据
    };
    // 绘制分页条 dom，并触发用户回调
    var fDrawDom = function(){
        var nTotalcount = oPageInApi.totalcount,
            nTotalpage = oPageInApi.totalpage,
            nPercount = oPageInApi.percount,
            nCurpage = oPageInApi.curpage;
        var toolTxts = opts.toolTxts,// 首页、上页、下页、末页
            oDrawFunctions;// 储存默认绘制方法的变量
        var i, str = '';// 临时变量
        /* 组件中默认的 dom 结构绘制 */
        // 绘制共几页几条
        var fDrawTotalPage = function(){
            return '<div class="manu-item">共 ' + nTotalpage + ' 页 ' + nTotalcount + ' 条</div>';
        };
        // 绘制每页几条
        var fDrawPerList = function(){
            var len, str;
            if(nTotalcount){
                len = aPerList && aPerList.length;
                if(len){// 定义了每页显示条数列表
                    str = '<select class="manu-sel" data-wi-manu="per">';
                    for(var i = 0; i < len; i++){
                        str += '<option' + (aPerList[i] == nPercount ? ' selected' : '') + '>' + aPerList[i] + '</option>';
                    }
                    str += '</select>';
                }
                else{
                    str = nPercount;
                }
                return '<div class="manu-item">每页 ' + str + ' 条</div>';
            }
        };
        // 绘制跳转第几页
        var fDrawGoPage = function(){
            if(nTotalcount){
                return '<div class="manu-item">' +
                    '<input class="manu-txt" type="text"> 页 <input type="button" class="manu-btn" value="跳转" data-wi-manu="go">' +
                    '</div>';
            }
        };
        // 绘制首页、上一页
        var fDrawPrevious = function(){
            var str;
            if(nTotalcount){
                if(nCurpage == 1){
                    str = '<span class="manu-lnk manu-lnk-0">' + toolTxts[0] + '</span>' +
                        '<span class="manu-lnk">' + toolTxts[1] + '</span>';
                }
                else{
                    str = '<a href="javascript:void(0)" class="manu-lnk manu-lnk-0" data-page="1" data-wi-manu="page">' +
                        toolTxts[0] + '</a>' +
                        '<a href="javascript:void(0)" class="manu-lnk" data-page="' + (nCurpage - 1) + '" data-wi-manu="page">' +
                        toolTxts[1] + '</a>';
                }
                return '<div class="manu-item manu-pagebefore">' + str + '</div>';
            }
        };
        // 绘制下一页、末页
        var fDrawNext = function(){
            var str;
            if(nTotalcount){
                if(nCurpage >= nTotalpage){
                    str = '<span class="manu-lnk">' + toolTxts[2] + '</span>' +
                        '<span class="manu-lnk manu-lnk-x">' + toolTxts[3] + '</span>';
                }
                else{
                    str = '<a href="javascript:void(0)" class="manu-lnk" data-page="' + (nCurpage + 1) + '" data-wi-manu="page">' +
                        toolTxts[2] + '</a>' +
                        '<a href="javascript:void(0)" class="manu-lnk manu-lnk-x" data-page="' + nTotalpage + '" data-wi-manu="page">' +
                        toolTxts[3] + '</a>';
                }
                return '<div class="manu-item manu-pageafter">' + str + '</div>';
            }
        };
        // 绘制页码
        var fDrawPageNum = function(){
            var visiblePages,// 最多显示几个页码
                before, after,// 当前页码前、后显示的页码数
                pStart, pEnd;// 页码中的显示的第一页、最后一页
            var str = '';
            if(nTotalcount){
                // 预处理显示页码
                visiblePages = CONF.visiblePages;
                before = Math.floor(visiblePages / 2);
                after = visiblePages - before - 1;
                if(nCurpage - before > 0 && nCurpage + after <= nTotalpage){
                    pStart = nCurpage - before;
                    pEnd = nCurpage + after;
                }
                else if(nCurpage - before <= 0){
                    pStart = 1;
                    pEnd = Math.min(visiblePages, nTotalpage);
                }
                else{
                    pStart = Math.max(1, nTotalpage - visiblePages + 1);
                    pEnd = nTotalpage;
                }
                // dom 字符串
                for(var i = pStart; i <= pEnd; i++){
                    if(i == nCurpage){
                        str += '<span class="manu-lnk manu-lnk-i">' + i + '</span>';
                    }
                    else{
                        str += '<a class="manu-lnk" href="javascript:void(0)" data-page="' + i + '" data-wi-manu="page">' + i + '</a>';
                    }
                }
                return '<div class="manu-item manu-page">' + str + '</div>';
            }
        };
        // 根据内容排序数组，转换成对应字符串
        var fGetRenderStr = function(aRender){
            var len = aRender && aRender.length,
                str = '', sCus;
            if(len){// 根据内容排序数组，转换成对应字符串
                for(var i = 0, item; i < len; i++){
                    item = aRender[i];
                    if(typeof item == 'string'){
                        str += oDrawFunctions[item]() || '';
                    }
                    else{// 自定义内容中的 inline-block 的元素需要修改 vertical-align 才能垂直对齐
                        sCus = item(oPageInApi, api);
                        str += '<div class="manu-item manu-cus">' + sCus + '</div>';
                    }
                }
            }
            return str;
        };
        // 储存默认绘制方法的变量
        oDrawFunctions = {
            total: fDrawTotalPage,
            per: fDrawPerList,
            go: fDrawGoPage,
            prev: fDrawPrevious,
            next: fDrawNext,
            page: fDrawPageNum
        };
        str += '<div class="manu-l">' + fGetRenderStr(aLeftRender) + '</div>' +// manu-l
            '<div class="manu-r">' + fGetRenderStr(aRightRender) + '</div>' +// manu-r
            '<div class="manu-c">' + fGetRenderStr(aCenterRender) + '</div>';// manu-c
        el.html(str);
    };
    // toPage {number|string} 转到第 toPage(从1起) 页
    // bReset {boolean} 是否来自 fReset()，true 时，若 toPage 不合法将强制转至第1页
    var fGoPage = function(toPage, bReset){
        var aStatData = opts.data,// 前台分页数据源
            nStatCurIdx,// 前台分页临时参数：当前页第一条数据的索引
            nTotalcount, nTotalpage;// 全部数据条数，总页数
        // 数据处理
        var fDataHandler = function(oriData){
            // 绘制 dom 前将临时变量应用到 oPageInApi
            oPageInApi.totalcount = nTotalcount;
            oPageInApi.totalpage = nTotalpage;
            oPageInApi.curpage = toPage;
            oPageInApi.percount = nPer;
            fDrawDom();// 根据 oPageInApi 绘制 dom
            opts.afterFlip(aCurData, oPageInApi, oriData);// 转页后的回调函数
        };
        toPage = parseInt(toPage, 10);// 格式化为数字
        // 每页条数可能通过 reset 或"每页条数下拉框"修改，因此需要重算总页数
        if(aStatData){// 前台分页，可以直接获得数据总数
            nTotalcount = aStatData.length;
            nTotalpage = Math.ceil(nTotalcount / nPer);// 根据数据总数计算总页码
        }
        else if(!bReset){// 后台分页，非 reset，获取上次同源请求的数据总数，用于在请求前做初步判断
            nTotalcount = oPageInApi.totalcount;
            nTotalpage = Math.ceil(nTotalcount / nPer);// 根据数据总数计算总页码
        }
        // 判断 toPage 是否合法：reset 时不合法则改为 1，非 reset 时不合法则提示
        if(bReset){
            if(isNaN(toPage)
                || toPage < 1
                || nTotalpage && toPage > nTotalpage){
                toPage = 1;
            }
        }
        else{
            if(isNaN(toPage)){// 非数字
                $.showAlert('页码必须为数字!');
                return;
            }
            if(toPage < 1
                || nTotalpage && toPage > nTotalpage){
                $.showAlert('页码超过范围!');
                return;
            }
        }
        // 数据处理
        if(aStatData){// 静态数据
            nStatCurIdx = (toPage - 1) * nPer;
            // 配置同步全局变量
            aAllData = aStatData;
            aCurData = aAllData.slice(nStatCurIdx, Math.min(nTotalcount, nStatCurIdx + nPer));
            fDataHandler(aAllData);
        }
        else{
            $.request($.extend({}, oReqOpts, {
                onSuccess: function(data){
                    nTotalcount = data.totalcount;// 后台数据发生变化时可能与上次请求的数据总数不同
                    nTotalpage = Math.ceil(nTotalcount / nPer);// 重算总页码
                    // 页码超出数据范围
                    if(nTotalpage && toPage > nTotalpage){
                        //if(bReset){// autoPage 可能超出实际范围
                        //    fGoPage(1);
                        //    return;
                        //}
                        //else{// 非 reset，转页前后台数据源总页数减少
                        //    $.showConfirm('数据已更新，无法转到第' + toPage + '页，是否转到第1页?', function(){
                        //        fGoPage(1);
                        //    });
                        //    return;
                        //}
                        $.showMsg('页码超出范围，将跳转到第' + nTotalpage + '页!', function(){
                            fGoPage(nTotalpage);
                        })
                    }
                    // 配置同步全局变量
                    aAllData = undefined;
                    aCurData = data.retlist;
                    fDataHandler(data);
                },
                showloading: opts.showloading,
                ajaxOpts: $.extend({}, oReqAjaxOpts, {
                    url: opts.url,
                    data: $.extend({
                        curpage: toPage,// 从1开始
                        percount: nPer
                    }, opts.args)
                })
            }));
        }
    };
    // 销毁
    var fDestroy = function(){
        // 解绑组件默认事件
        el.off('change.wiManu')
          .off('click.wiManuGo')
          .off('click.wiManuPage');
        fUnbindCbEvent();// 解绑组件自定义事件
        el.remove();
        for(var key in api){
            delete api[key];
        }
    };
    // 事件解绑
    var fUnbindCbEvent = function(){
        var oCurRenderCb;// 循环时记录 oRenderCb 中的项
        if(oRenderCb){// 解绑自定义事件
            for(var name in oRenderCb){
                if(oRenderCb.hasOwnProperty(name)){
                    oCurRenderCb = oRenderCb[name];
                    for(var eType in oCurRenderCb){
                        if(oCurRenderCb.hasOwnProperty(eType)){
                            el.off(eType + '.wiManuCus_' + name);
                        }
                    }
                }
            }
        }
    };
    // 事件绑定
    var fBindCbEvent = function(){
        var oCurRenderCb;// 循环时记录 oRenderCb 中的项
        // 记录 oRenderCb
        oRenderCb = undefined;
        if(opts.callback){
            oRenderCb = opts.callback.render;
        }
        // 绑定自定义事件
        if(oRenderCb){
            for(var name in oRenderCb){
                if(oRenderCb.hasOwnProperty(name)){
                    oCurRenderCb = oRenderCb[name];
                    for(var eType in oCurRenderCb){
                        if(oCurRenderCb.hasOwnProperty(eType)){
                            el.on(eType + '.wiManuCus_' + name, '[data-manu="' + name + '"]', oCurRenderCb[eType]);
                        }
                    }
                }
            }
        }
    };
    var fResetRender = function(){
        var oRender = opts.render;// 自定义dom结构顺序，重置 opts.render 后只需修改对应全局变量，效果会在下次绘制时生效
        // 判断 opts.render 中各部分是否包含默认模块的定义
        var fRenderHasItem = function(str){
            return aLeftRender.indexOf(str) != -1 || aRightRender.indexOf(str) != -1 || aCenterRender.indexOf(str) != -1;
        };
        aLeftRender = oRender.left || [];// 左侧dom结构顺序 未定义则为 []
        aRightRender = oRender.right || [];// 右侧dom结构顺序 未定义则为 []
        aCenterRender = oRender.center || [];// 中间dom结构顺序 未定义则为 []
        // render 的变化可能需要引起默认事件改变
        if(fRenderHasItem('go')){
            el.off('click.wiManuGo')
              .on('click.wiManuGo', '[data-wi-manu="go"]', fChangeGoClick);// 翻页按钮点击事件
        }
        if(fRenderHasItem('page') || fRenderHasItem('prev') || fRenderHasItem('next')){
            el.off('click.wiManuPage')
              .on('click.wiManuPage', '[data-wi-manu="page"]', fChangePageClick);// 页码跳转事件
        }
        if(fRenderHasItem('per')){
            el.off('change.wiManu')
              .on('change.wiManu', '[data-wi-manu="per"]', fOnPerListChange);// 绑定 perList 下拉框改变事件
        }
    };

    // 重设配置
    var fReset = function(cusOpts){
        if(cusOpts){
            $.extend(opts, cusOpts);
            if(cusOpts.data){// 重设了 data，将 url 置空
                opts.url = undefined;
            }
            else if(cusOpts.url){// 重设了 url，将 data 置空
                opts.data = undefined;
            }
            if(cusOpts.render){
                fResetRender();
            }
            if(cusOpts.callback){// 重绑自定义事件
                fUnbindCbEvent();
                fBindCbEvent();
            }
        }
        else{// 初始化时，处理 opts
            if(opts.data){
                opts.url = undefined;
            }
            /* 旧版本兼容 begin */
            if(typeof opts.per != 'undefined'){// 旧版本 fReset 中不支持 per 的修改，此处不需做 cusOpts 的兼容
                opts.percount = opts.per;
                delete opts.per;
            }
            /* 旧版本兼容 end */
            fResetRender();
            fBindCbEvent();// 绑定自定义事件
        }
        /* 应用配置 */
        // 预先处理每页条数
        nPer = opts.percount;// 每页显示条数
        aPerList = opts.perList;
        if(aPerList.length && aPerList.indexOf(nPer) == -1){// 定义了每页显示条数列表，且 percount 不在 aPerList 中
            nPer = aPerList[0];
        }
        // 请求配置处理
        oReqOpts = $.extend({}, opts.requestOpts);// 其中除 ajaxOpts 外无有用的复杂类型，可以浅拷贝
        oReqAjaxOpts = $.extend({}, oReqOpts.ajaxOpts);// 记录 ajaxOpts 缓存时再处理
        delete oReqOpts.ajaxOpts;
        if(oReqAjaxOpts){
            delete oReqAjaxOpts.url;// 由 opts.url 定义
            delete oReqAjaxOpts.data;// 由 opts.args 定义
        }
        delete oReqOpts.showloading;// 由 opts.showloading 定义
        /* 数据绘制 */
        if(opts.data || opts.url){// 只在定义了数据源时绘制，用于支持初始化时不带入数据
            fGoPage(opts.autoPage, true);
            opts.autoPage = 1;// 数据源变更后首次跳转的页码（从 1 开始），之后此属性会重设为 1，可以在重置数据源时重新传入
        }
    };
    // 初始化
    var fInit = function(){
        el.addClass('manu clearf');
        fReset();
    };
    api = {
        page: oPageInApi,
        destroy: fDestroy,
        fReset: fReset,
        reset: fReset,// 兼容旧版本
        goPage: fGoPage,
        fGetCurData: fGetCurData,// 获取当前页的数据
        fGetData: fGetData// 获取全部页的数据（后台分页时，与 fGetCurData() 的返回值相同）
    };// 返回的接口对象
    fInit();
    return api;
};
/*"setFormData","setDisabled","setFormTxtData","serializeObject"*/
/**
 * @widoc $.fn.setFormData
 * @namespace aux
 * @des 将当前元素中定义了 name 的元素根据 jsonValue 赋值
 * 支持文本框、文本域、单选框、复选框（数组或以“;”分隔的字符串）、下拉框
 * 注：jsonValue 中未指定的数据不会更改，即如需清空，需要指定所有 name 并赋空值''
 * @type function
 * @param {object} jsonValue 以 name-val 键值对形式保存的元素值，name 对应表单元素的 name
 */
$.fn.setFormData=function(jsonValue){
    var el = $(this),
        jqControl,type;// 表单元素，表单元素的 type
    $.each(jsonValue, function(name, ival){
        jqControl = el.find("[name=" + name + "]");
        type=jqControl.attr("type");
        if(typeof ival!='undefined'){
            if(type=='checkbox'){
                jqControl.prop('checked',false);// 取消所有选中
                if(typeof ival=='string'){
                    ival=ival.split(';');
                }
                for(var i= 0,len=ival.length;i<len;i++){
                    jqControl.filter('[value="'+ ival[i] +'"]').prop('checked',true);
                }
            }else if(type=='radio'){
                jqControl.prop('checked',false);
                jqControl.filter('[value="'+ ival +'"]').prop('checked',true);
            }else{
                jqControl.val(ival);
            }
        }
    })
};
/**
 * @widoc $.fn.setDisabled
 * @namespace aux
 * @des 将当前元素中的 input、textarea、select、button 设为只读
 * @type function
 * @param {boolean=} disabled 是否设为 disabled，默认为 true
 */
$.fn.setDisabled=function(disabled){
    var el=$(this);
    disabled = disabled!==false;
    el.find('input,textarea,select,button').prop('disabled',disabled);
};
/**
 * @widoc $.fn.setFormTxtData
 * @namespace aux
 * @des 将当前元素中定义了 name 的元素根据 jsonValue 填充（.html(...)）
 * 将覆盖对应 name 的子元素的内容
 * 注：jsonValue 中未指定的数据不会更改，即如需清空，需要指定所有 name 并赋空值 ''
 * @type function
 * @param {object} jsonValue 以 name-val 键值对形式保存的元素值
 */
$.fn.setFormTxtData=function(jsonValue){
    var el = $(this);
    $.each(jsonValue, function(name, ival){
        el.find("[name=" + name + "]").html(ival);
    });
};
/**
 * @widoc $.fn.serializeObject
 * @namespace aux
 * @des 获取元素中定义了 name 属性的 input、textarea、select 元素的 value。其中若文本框元素上，定义了 data-notrim 属性，则取值时会保留前后空格。
 * @return {Object} obj 返回对象 键值对name-value
 */
$.fn.serializeObject=function(){
    var el=$(this),
        oRes = {};
    var jq,name,type,val,
        jqIpts=el.find('[name]');// 只处理有 name 属性的元素
    // input
    $.each(jqIpts.filter('input'),function(){
        jq=$(this);
        name=jq.attr('name');
        type=jq.attr('type');
        val=jq.val();
        if(type=="checkbox"){
            // 复选框 - 数组形式，无选中项不添加到结果中
            if(jq.prop('checked')){
                if (oRes[name]== undefined){
                    oRes[name]=[];
                }
                oRes[name].push(val);
            }
        }else if(type=="radio"){
            // 单选框
            if(jq.prop('checked')){
                oRes[name]=val;
            }
        }else if(type=='text' || typeof type=='undefined'){
            // 文本框 - 若定义了 data-notrim 属性，则会保留前后空格
            oRes[name] = typeof jq.attr('data-notrim')=='undefined' ?
                val.trim() :
                val;
        }else{
            // 普通文本域、日期框组件
            oRes[name]=val;
        }
    });
    // textarea
    $.each(jqIpts.filter('textarea'),function(){
        jq=$(this);
        oRes[jq.attr('name')]=jq.val();
    });
    // select
    $.each(jqIpts.filter('select'),function(){
        jq=$(this);
        oRes[jq.attr('name')]=jq.val();
    });
    return oRes;
};
WICONF.initZTree={
    nNodeH:30,// 每个节点的高度，与 css 中 .ztree li>a 一致
    view:{
        showLine:true,// 显示树线
        showIcon:true// 显示节点图标
    }
};
/**
 * @widoc $.fn.initZTree
 * @namespace comp
 * @des 初始化 tree。用于初始化的元素必须为 &lt;ul&gt;&lt;/ul&gt;，如果需要在过滤时将匹配节点滚动至可视区，需要令滚动条出现在初始化元素上（即：有一定高度，且 overflow-y:auto）。此组件在 zTree 基础上扩展，未做扩展的接口请查看：http://www.treejs.cn/v3/api.php
 * 组件配置，在使用组件前调用：
 <pre class="des-conf"> $.setWiConf('initZTree',{
    nNodeH:30,// 每个节点的高度，与 css 种 .ztree li>a 一致
    view:{
        showLine:true,// 显示树线
        showIcon:true// 显示节点图标
    }
 });</pre>
 * @type function
 * @demo initZTree/demo0 静态树
 * @demo initZTree/demo1 动态树、过滤
 * @param {object} _opts 用户配置
 * @param {boolean=} _opts.multi 是否多选，默认为 false。
 * @param {Array=} _opts.data 树数据源，若定义，则 opts.url 及 opts.urlArgs 失效
 * @param {string=} _opts.url 树数据源请求地址，若定义了 opts.data，此属性失效
 * @param {object=} _opts.urlArgs 树数据源请求时向后台传递的参数，若定义了 opts.data，此属性失效
 * @param {Array=} _opts.selParams 指定加载完成后选中项条件[key,value]，复选时，value 支持数组
 * @param {object} _opts.filterEl 过滤文本框对象
 * @param {object} _opts.filter 过滤功能配置，仅当定义了 filterEl 时生效
 * @param {string|Array} _opts.filter.fields 参与过滤的列的属性名，默认与 opts.key.name 相同
 * @param {boolean} _opts.filter.pySupport 是否支持拼音首字过滤，开启过滤时，默认为 true
 * @param {boolean} _opts.filter.hide 是否隐藏不符合过滤条件的节点，默认为 true，复选时此属性无效
 * @param {boolean=} _opts.initSelect 初始化时若没有选中项，是否选中第一个可选项，默认为 true，复选时失效。
 * @param {function=} _opts.selector(node) 选择时的过滤条件，节点可选时返回 true。
 * @param {object=} _opts.async ztree 初始化时的 setting.async
 * @param {object=} _opts.check ztree 初始化时的 setting.check。默认值：
 *        enable 复选为 true，单选为 false（非特殊情况请勿覆写）
 *        chkboxType 为 { "Y": "ps", "N": "ps" }，即级联选中（可覆写）
 * @param {object=} _opts.callback ztree 初始化时的 setting.callback
 * @param {object=} _opts.edit ztree 初始化时的 setting.edit
 * @param {object=} _opts.view ztree 初始化时的 setting.view。默认值：
 *        fontCss: function (treeId, treeNode) {// 高亮（过滤）
 *            return (!!treeNode.__hlight) ? {color: "#A60000", "font-weight": "bold"} : {color: "#333", "font-weight": "normal"};
 *        }
 *        selectedMulti: 复选为true，单选为false（非特殊情况请勿覆写）
 * @param {object=} _opts.key ztree 初始化时的 setting.data.key
 * @param {object=} _opts.simpleData ztree 初始化时的 setting.data.simpleData（opts.simple.enable: false 使用/不使用 简单数据模式，默认为树形结构）
 * @param {function=} _opts.afterInit 完成初始化后调用的方法
 *        treeObj {object} $.fn.initZTree() 返回的接口
 * @param {function=} _opts.onSelect 设置选中项后的回调函数。触发时机：初始化完成后，obj.setSel(selParams,clear)，onClick(单选)/onCheck(复选)
 *        selnodes {object|Array} 单选时为选中节点，复选时为选中节点数组
 *        treeObj {object} $.fn.initZTree() 返回的接口
 * @return {object|undefined} obj 接口对象
 * @rtn {object} obj.treeObj ztree初始化完成后获得的树对象
 * @rtn {string} obj.treeId 当前树 id
 * @rtn {object} obj.setting ztree 初始化时使用的 setting
 * @rtn {function} obj.setSel(selParams,clear) 设置选中项
 *        selParams {Array=} 指定要选中的项的条件[key,value]，复选时 value 支持数组
 *        clear {boolean=} 是否先清空原有选中项，默认为 true
 * @rtn {function} obj.reset(url,urlArgs,selParams): 重新请求数据源,若未定义参数，则使用初始化时的配置重新请求
 *        url {string=} 重新请求的地址，未定义则使用上一次指定的url
 *        urlArgs {object=} 重新请求时向后台传递的参数
 *        selParams {Array=} 重新请求时，加载完成后选中项条件[key,value]
 * @rtn {function} obj.reset(data,selParams): 重置数据源，若未定义参数，则使用初始化时的配置重新初始化树
 *        data{Array=} 重置的树数据源
 *        obj.reset(undefined,selParams) 与 obj.reset(undefined,undefined,,selParams) 相当于 obj.setSel(selParams,true)
 * @rtn {function} obj.getNodeById(tId) 根据 tid 获取节点，返回值 {object} 节点数据
 *        tId {string} ztree 中的节点标识 tid
 * @rtn {function} obj.getSelectedNodes() 单选返回选中项，无则返回 undefined；复选返回选中项数组（含半选），无则返回[]
 * @rtn {function} obj.getSelectedNodesNoHalf() 单选同obj.getSelectedNodes()；复选返回选中项数组（不含半选），无则返回[]
 */
$.fn.initZTree=function(_opts){
    //if(!_opts || (!_opts.data && !_opts.url)) return;// 未定义数据源且未定义数据源请求url
    var el=$(this);
    var treeId = el.attr('id'); // 树控件 id
    if(!treeId){
        treeId= $.generateGuid('zTree');
        el.attr('id',treeId);
    }
    el.addClass('ztree');
    var opts= $.extend({
        multi: false// 默认单选
        //        ,data:[]
        //        ,url:''
        //        ,urlArgs:{}
        //        ,selParams:[key,val]
        ,initSelect:true
        //        ,filterEl
        ,filter:{}
        //        ,selector:function(node)
        //        ,async,check,callback,edit,view,key,simpleData
        //        ,afterInit:function(_returnObj)
        //        ,onSelect:function(selnodes,_returnObj)
    },_opts);
    var _conf={// 辅助参数
        filterRemains: 0// 搜索关键字时修改节点高亮属性及展开父节点（会造成延时）的剩余操作总数
        ,scrollNode: undefined// 要移入视图的节点
        ,filtering: false
        ,filterList: []// 高亮节点列表 / 隐藏节点列表
        ,initing: false// 标记是否处于初始化过程，避免初始化时展开选中节点的祖先的操作进入 _afterFilterOpt 导致无法完成初始化及触发用户回调
        ,selChanging: false// 是否正在调整选中项，_afterFilterOpt 中触发 onSelect 事件
    };
    var _treeObj // ztree 初始化完成后返回的接口对象，在 initTree() 中赋值
        ,arrayNodes // 数组型节点数据源，在 initTree() 中赋值
        ,multi = _opts.multi
        ,selNode;// 单选时初始化时选中的节点，若存在将在 _afterFilterOpt 中触发点击
    var _filterObj;
    var _returnObj={
        'treeId':treeId
        // 根据用户配置初始化 zTree setting
        ,'setting':(function(opts,multi){
            var setting={
                async:opts.async || {},
                callback: opts.callback || {},
                check: $.extend({
                    enable: multi // 是否显示复选框
                    ,chkboxType: { "Y": "ps", "N": "ps" } // 禁止级联 TODO 此配置实际为允许级联
                },opts.check),
                data: {
                    key: opts.key,
                    simpleData: opts.simpleData
                },
                edit:opts.edit || {},
                view: $.extend({// 根据 treeNode.__hlight 设置节点样式
                    fontCss: function (treeId, treeNode) {
                        return (!!treeNode.__hlight) ? {color: "#A60000", "font-weight": "bold"} : {color: "#333", "font-weight": "normal"};
                    }
                    ,selectedMulti: multi
                },WICONF.initZTree.view,opts.view)
            };
            /* 封装默认的回调方法 */
            // 因为聚焦元素时会展开节点（异步），所以要加入默认操作
            setting.callback.onExpand=(function(_onExtend){
                return function(event, treeId, node){
                    if (_conf.filtering){// 过滤时展开完成，操作总数-1，不执行用户操作
                        _conf.filterRemains--;
                        _afterFilterOpt();
                    }else{
                        _onExtend(event, treeId, node);
                    }
                }
            })(setting.callback.onCheck || $.noop);
            // 设置选中项后的回调函数
            if(opts.onSelect){
                if(multi){// 复选
                    setting.callback.onCheck=(function(_onCheck){
                        return function(event, treeId, treeNode){
                            _onCheck(event, treeId, treeNode);
                            opts.onSelect(_getSelectedNodesNoHalf(),_returnObj);
                        }
                    })(setting.callback.onCheck || $.noop);
                }
                else{
                    setting.callback.onClick=(function(_onClick){
                        return function(event, treeId, treeNode, clickFlag){
                            _onClick(event, treeId, treeNode, clickFlag);
                            opts.onSelect(_getSelectedNodesNoHalf(),_returnObj);
                        }
                    })(setting.callback.onClick || $.noop);
                }
            }
            // 单选定义了选择时的过滤条件（复选在初始化时对数据源 nocheck 属性设置隐藏复选框）
            if(!multi && opts.selector){
                setting.callback.beforeClick=(function(_beforeClick){
                    return _beforeClick ? function(treeId, node, flag){
                        return opts.selector(node) && _beforeClick(treeId, node, flag) ;
                    } : function(treeId, node, flag) {
                        return opts.selector(node);
                    }
                })(setting.callback.beforeClick);
            }
            return setting;
        })(opts,multi)
    };
    // 过滤完成后，显示结果
    var _filterNodes=function(selNodes,keyword) {
        if(!_filterObj) return;// 过滤组件初始化过程中，关键字为 ''，不执行过滤，否则将清空点击状态
        _conf.filtering = true;
        if(opts.filter.hide){
            if(!_conf.initing){// 非初始化的过滤才将原选中项取消，否则导致 _filterObj.resetData() 时将默认选中项清空
                _treeObj.cancelSelectedNode(_getSelectedNodes());
            }
            showFilter(selNodes,keyword);// 显示过滤结果
        }else{
            highlight(_conf.filterList,false);
            if(keyword){
                _conf.filterList=selNodes;
                selNodes && selNodes.length && highlight(selNodes,true);
            }
        }
    };
    // 初始化过滤支持，必须在数据加载完成后调用
    var _initFilter=function(){
        if(!opts.filterEl) return;
        if(_filterObj){// 更新过滤组件数据源
            _filterObj.setData(arrayNodes);
        }else{
            var filter=opts.filter;
            if(!filter.fields && opts.key && opts.key.name) filter.fields=opts.key.name;
            filter.hide = !opts.multi&&filter.hide!=false ;// 只有单选且允许隐藏时为 true，多选禁止隐藏
            var filterOpts={
                fields:filter.fields
                ,data:arrayNodes
                ,afterFilter:_filterNodes
            };
            if(filter.pySupport!=undefined) filterOpts.pySupport=filter.pySupport;
            _filterObj=opts.filterEl.initFilter(filterOpts);
        }
    };
    var _scrollTo=function(node){
        if(node){
            _conf.filtering=true;
            _conf.filterRemains++;
            _conf.scrollNode=node;
            _expandAncestors(node);
        }else if(_conf.scrollNode){// 不定义滚动项时默认滚动到 _conf.scrollNode
            var nodeId = _conf.scrollNode.tId.replace(/\s/g,'_');
            var _treeDom=document.getElementById(treeId);
            var _treeBCR=_treeDom.getBoundingClientRect(),
                _nodeBCR=document.getElementById(nodeId).getBoundingClientRect(),
                nNodeH=WICONF.initZTree.nNodeH;
            if(_nodeBCR.top + nNodeH > _treeBCR.bottom){
                _treeDom.scrollTop+=_nodeBCR.top + nNodeH-_treeBCR.bottom;
            }else if(_nodeBCR.top < _treeBCR.top){
                _treeDom.scrollTop+=_nodeBCR.top-_treeBCR.top;
            }
            //document.getElementById(nodeId).scrollIntoView();// 此方法会将过滤节点滚动到最顶，即时它原本就在可视区。网上说安卓中的浏览器对此方法支持不好
            _conf.scrollNode=undefined;
        }
    };
    /**
     * 搜索到的所有节点的祖先节点及属性修改完成后，将 _conf.scrollNode 对应的节点滚入视图
     */
    var _afterFilterOpt=function(){
        if(_conf.filtering && _conf.filterRemains==0){// 所有节点操作完成，使第一个高亮节点进入视图
            if(_conf.initing){// 在初始化过程中
                _initFilter();
                _conf.initing=false;// 必须在 _initFilter 之后，否则会被清空选中项
                opts.afterInit && opts.afterInit(_returnObj);
            }
            if(_conf.selChanging){// 正在修改选中项
                _conf.selChanging=false;
                if(selNode){// selNode 存在：单选且有选中项
                    $('#'+selNode.tId+'_a').click();// 点击要选中的项，onClick 事件中会触发 onSelect
                    selNode=undefined;
                }else{// 复选或无选中项
                    opts.onSelect && opts.onSelect(_getSelectedNodesNoHalf(),_returnObj);
                }
            }
            _scrollTo();
            _conf.filtering=false;
        }
    };
    /**
     * 选中指定项
     * @param selParams {Array=} 指定加载完成后选中项条件[key,value]，复选时，value支持数组
     * @param clear {boolean=} 是否要清除原有选中项，默认为 true，初始化时失效
     * @private
     */
    var _setSel=function(selParams,clear){
        clear = clear!=false;
        var len=arrayNodes.length;
        _conf.scrollNode=undefined;
        _conf.filtering=true;
        _conf.selChanging=true;// 正在改变选中值
        if(len>0){
            var key,val;
            if(selParams){// 默认选中项
                key=selParams[0];
                val=selParams[1];
            }
            var firstEnableNode;// 第一个可选节点
            var i,node;// 循环临时变量
            var selectedNodes=_getSelectedNodes();// 原来选中的项
            if(multi){
                if(key && Object.prototype.toString.call(val) !== '[object Array]'){// 复选时，将 val 统一为数组
                    val = [val];
                }
                if(clear){// 清除原有选中项
                    for(i=0;i<selectedNodes.length;i++){
                        _treeObj.checkNode(selectedNodes[i],false);
                    }
                }
                if(_conf.initing){
                    for(i= 0;i<len;i++){// 根据 selParams 及 selector 勾选，并隐藏不可选的节点的勾选框
                        node=arrayNodes[i];
                        if(!opts.selector || opts.selector(node)){// 未定义 selector，或符合 selector
                            if(!firstEnableNode) firstEnableNode=node;
                            if(key && val.indexOf(node[key])>-1){// 符合 selParams
                                _treeObj.checkNode(node, true, false);// 因为可能存在由数据源决定的选中状态，故最后统一处理级联
                            }
                        }else{// 不可选的节点隐藏复选框
                            node['nocheck']=true;
                            _treeObj.updateNode(node);
                        }
                    }
                    // 统一处理级联，根据选中的项设置级联父子节点
                    if(_returnObj.setting.check.chkboxType['Y']){// 允许级联，手动选中各项，以触发级联选中
                        selectedNodes=_returnObj.getSelectedNodes();// 获取当前勾选项集合（初始化时均未级联）
                        for(i=0,len = selectedNodes.length; i<len; i++) {
                            _treeObj.checkNode(selectedNodes[i], true, true);
                        }
                    }
                }else{
                    for(i= 0;i<len;i++){// 根据 selParams 及 selector 勾选，并隐藏不可选的节点的勾选框
                        node=arrayNodes[i];
                        if(!opts.selector || opts.selector(node)){// 未定义 selector，或符合 selector
                            if(key && val.indexOf(node[key])>-1){// 符合 selParams
                                _treeObj.checkNode(node, true, true);
                            }
                        }
                    }
                }
                selectedNodes=_getSelectedNodesNoHalf();// 获取最终的选中集合（不含半选项）
                len = selectedNodes.length;
                if(len){// 有选中项
                    _conf.filterRemains += len;
                    for(i=0;i<len;i++){// 展开所有选中项
                        node=selectedNodes[i];
                        !_conf.scrollNode && (_conf.scrollNode=node);// 记录第一项过滤层级的节点（非半选项）
                        _expandAncestors(node);
                    }
                }else if(_conf.initing && firstEnableNode){// 展开第一个可选项
                    _conf.filterRemains ++;
                    _conf.scrollNode=firstEnableNode;
                    _expandAncestors(firstEnableNode);
                }
            }
            else{
                if(clear && selectedNodes){// 清除原有选中项
                    _treeObj.cancelSelectedNode(selectedNodes);
                }
                for(i= 0;i<len;i++){// 根据 selParams 及 selector 勾选
                    node=arrayNodes[i];
                    if(!opts.selector || opts.selector(node)){// 未定义 selector，或符合 selector
                        if(!firstEnableNode) firstEnableNode=node;
                        if(key && val==node[key]) {// 符合 selParams
                            selNode=node;
                            break;
                        }
                    }
                }
                if(_conf.initing && !selNode){// 初始化且没有选中项，将第一个可选项滚入视图
                    _conf.scrollNode = firstEnableNode;
                    if(opts.initSelect){// 选中第一个可选项，在 _afterFilterOpt 中触发点击。
                        selNode = firstEnableNode;
                    }
                }else{
                    _conf.scrollNode = selNode;
                }
                if(_conf.scrollNode){
                    _conf.filterRemains ++;
                    _expandAncestors(_conf.scrollNode);
                }
            }
        }
        _afterFilterOpt();
    };
    var _initTree=function(data){
        if(typeof(data)=='string') data=JSON.parse(data);
        _treeObj && _treeObj.destroy(treeId);
        _conf.filterList.length=0;
        _treeObj = _returnObj.treeObj = $.fn.zTree.init($("#"+treeId), _returnObj.setting, data);
        arrayNodes=_treeObj.transformToArray(_treeObj.getNodes());
        _conf.initing = true;// 标识正在进行初始化，完成后在 _afterFilterOpt() 中处理初始化回调
        _setSel(opts.selParams,false);
    };
    var _init=function(){
        if(opts.url){
            opts.data = undefined;
            $.ajax({// 请求数据初始化树
                type: "post",
                dataType: "json",
                url: opts.url,
                data: opts.urlArgs || {},
                success: function (result) {
                    if(!result.success){
                        result.msg && $.showAlert(result['msg']);
                        return;
                    }
                    _initTree(result.data);
                }
            });
        }else{
            if(!opts.data){
                opts.data = [];
            }
            opts.url=undefined;
            _initTree(opts.data);
        }
        //if(opts.data){
        //    opts.url=undefined;
        //    _initTree(opts.data);
        //}else{
        //    $.ajax({// 请求数据初始化树
        //        type: "post",
        //        dataType: "json",
        //        url: opts.url,
        //        data: opts.urlArgs || {},
        //        success: function (result) {
        //            if(!result.success){
        //                result.msg && $.showAlert(result['msg']);
        //                return;
        //            }
        //            _initTree(result.data);
        //        }
        //    });
        //}
    };
    /**
     * 展开指定节点的所有祖先
     * @param node {object} 树中的节点对象
     * @private
     */
    function _expandAncestors(node){
        var level=node['level']
            ,pnode=node;
        while(level>0){
            pnode=pnode.getParentNode();
            if(pnode.open==false) {
                _conf.filterRemains ++;// 新增一个父节点操作
                /* 展开父节点，完成后触发 onExpand */
                _treeObj.expandNode(pnode, true, false, false, true);
                break;// expandNode 操作会展开父级节点
            }
            level--;
        }
        _conf.filterRemains--;
        _afterFilterOpt();
    }

    function showFilter(nodeList,keyword){
        _conf.filtering = true;
        var nodes=_treeObj.getNodes();
        var childrenField=_treeObj.setting.data.key.children;
        /**
         * @return {boolean} nodes 中是否存在需要显示的节点
         */
        var chargeNodes=function(nodes){
            if(!nodes || !nodes.length) return false;
            var show=false;
            for(var i= 0,node,children,nodeShow=false;i<nodes.length;i++){
                node=nodes[i];
                children=node[childrenField];
                nodeShow=chargeNodes(children);// 先判断子孙中是否有匹配的节点
                if(!keyword){
                    node.__hlight=false;
                    nodeShow=true;
                }else if(nodeList.indexOf(node)>-1){// 当前节点匹配
                    node.__hlight=true;
                    nodeShow=true;
                }else{
                    node.__hlight=false;
                }
                if(nodeShow){
                    _treeObj.showNode(node);
                }else{
                    _treeObj.hideNode(node);
                    _conf.filterList.push(node);
                }
                _treeObj.updateNode(node);// 更新节点状态
                show = show || nodeShow;
            }
            return show;// 没有匹配的子节点
        };
        _conf.filterList.length=0;
        chargeNodes(nodes);
        if(keyword) _treeObj.expandAll(true);// 搜索结果全部展开
    }
    function highlight(nodeList,highlight) {
        if(!nodeList) return;
        var i,node;// 循环临时变量
        if(highlight){// 开启高亮
            var scrollNode;
            _conf.filterRemains=nodeList.length;// 等待完成的节点操作总数，初始时为搜索到的节点总数（展开节点会产生延迟）
            for (i = 0; i < nodeList.length; i++) {
                node=nodeList[i];
                !scrollNode && (!multi || !node.getCheckStatus.half) && (scrollNode=_conf.scrollNode=node);// 记录第一项过滤层级的节点（非半选项）
                node.__hlight = true;
                _treeObj.updateNode(node);
                _expandAncestors(node);// 展开所有高亮节点的祖先
            }
        }else{// 取消高亮
            for (i = 0; i < nodeList.length; i++) {
                node=nodeList[i];
                node.__hlight = false;
                _treeObj.updateNode(node);
            }
        }
    }
    /**
     * 更新数据源，重新初始化树 reset(url,urlArgs,selParams);reset(data,selParams)
     * @param url {string|Array=}
     * @param urlArgs {object|Array=}
     * @param selParams {Array=} 默认选中项条件 [key,value]
     */
    var _reset=function(url,urlArgs,selParams){
        var _data,_url,_urlArgs,_selParams;
        if(typeof url=='string'){
            _url=url;
            opts.urlArgs=undefined;// 重置数据源，原默认选中项置空
            opts.selParams=undefined;// 重置数据源，原默认选中项置空
        }else if(Object.prototype.toString.call(url) === '[object Array]'){
            _data=url;
            opts.selParams=undefined;// 重置数据源，原默认选中项置空
        }
        if(Object.prototype.toString.call(urlArgs) === '[object Array]'){
            _selParams=urlArgs;
        }else if(urlArgs){
            _urlArgs=urlArgs
        }
        if(selParams) _selParams=selParams;
        if(_urlArgs) opts.urlArgs=_urlArgs;
        if(_selParams) opts.selParams=_selParams;
        if(_data){
            opts.data=_data;
            opts.url=undefined;
        }else if(_url){
            opts.url=_url;
            opts.data=undefined;
        }
        _data || _url || _urlArgs ? _init() : _setSel(opts.selParams, true);
    };
    var _getSelectedNodes=function(){
        return multi ? _treeObj.getCheckedNodes(true) : _treeObj.getSelectedNodes(true)[0];
    };
    var _getSelectedNodesNoHalf=function(){
        var selNodes=_getSelectedNodes();
        if(multi){
            var result=[];
            for(var i= 0,len=selNodes.length,node;i<len;i++){
                node=selNodes[i];
                !node.getCheckStatus().half && result.push(node);// 只保留非半选的节点
            }
            return result;
        }
        return selNodes;
    };
    _returnObj.setSel=_setSel;
    _returnObj.reset=_reset;// 更新数据源
    _returnObj.getNodeById=function(tId){// _treeObj 直接获取可能还未完成初始化
        return _treeObj.getNodeByTId(tId);
    };
    _returnObj.getSelectedNodes=_getSelectedNodes;// 复选时，含半选项
    _returnObj.getSelectedNodesNoHalf=_getSelectedNodesNoHalf;// 复选时，不含半选项
    _init();
    return _returnObj;
};
WICONF.initGrid = {
    tableHBorderW: 1,// .表格设置的宽度与实际显示的宽度的差值，可能因为边框与单元格合并，实际宽度产生误差，此值需要随 css 调整
    defaultColWidth: 80// 未定义宽度的列的最小宽度
};
/**
 * @widoc $.fn.initGrid
 * @namespace comp
 * @des 初始化数据列表表格
 * 组件配置，在使用组件前调用：
 <pre class="des-conf"> $.setWiConf('initGrid',{
    tableHBorderW: 1,// table 设置会因为边框与单元格合并，实际宽度产生误差，此值需要随 css 调整，只在 opts.staticSize = false 时生效
    defaultColWidth: 80// 未定义宽度的列的最小宽度，只在 opts.staticSize = false 时生效
 });</pre>
 * @type function
 * @demo initGrid/demo 分页列表（前台+后台），后台返回数据为 {success:true,msg:'错误提示',data:{totalcount:100,retlist:[]}}
 * @demo initGrid/demo_nopage 不分页列表（前台+后台），后台返回数据为 {success:true,msg:'错误提示',data:[]}
 * @demo initGrid/demo_merge 合并单元格
 * @param {object} opts 配置参数
 * @param {number=} opts.defaultColWidth 未定义宽度的列的最小宽度，默认为 80。只在 opts.staticSize = false 时生效。
 * @param {number=} opts.tableHBorderW 表格设置的宽度与实际显示的宽度的差值（与 css 相关），默认为 1。只在 opts.staticSize = false 时生效。
 * @param {boolean=} opts.staticSize 组件是否是静态尺寸，设为 false 将根据容器动态调整尺寸，性能降低，默认为 true。
 * @param {Array} opts.cols 列定义 [{field,...}]
 * @param {string=} opts.cols[i].field 该列对应的属性名
 * @param {string=} opts.cols[i].name 该列的唯一标识，不允许与其他列的 name 相同，默认与 field 相同，若未定义 field，则 name 必须。除 type='no'(组件内默认 name='__no')，type='chk'(组件内默认 name='__checked')时可省略 name。
 * @param {string=} opts.cols[i].title 该列显示的标题文本
 * @param {boolean=} opts.cols[i].showTip 该列鼠标悬停时是否显示完整的内容，默认为 false
 * @param {string=} opts.cols[i].type 该列显示的数据类型，默认为：'string'，可选值：'number','string','no'(序号列，唯一),'chk'(选择列，唯一)
 * @param {string=} opts.cols[i].cls 该列自定义 class 名。
 * @param {string=} opts.cols[i].width 该列宽度，需带单位 'px' 或 '%'。
 *  - opts.staticSize=false 时，% 将以 el 容器宽度作为计算基数。若所有列都定义了 width，表格宽度为所有列实际宽度之和，可能小于 el 宽，或出现滚动条。若希望表格撑满容器，请保留至少一列不定义 width
 *  - opts.staticSize=true 时，% 与 px 混用时，列宽会由表格自动分配，实际显示与定义可能不同。
 * @param {string=} opts.cols[i].align 对齐方式，可选值：'center','left','right'。不指定时，type='string'时为'left'，type='number'时为'right'，type='no'时为'center'，type='chk'时为'center'
 * @param {boolean=} opts.cols[i].sort 该列是否允许排序，默认 false TODO 功能待实现
 * @param {function=} opts.cols[i].render 该列的渲染函数 render(val,row,i,grid) val 单元格值，row 行数据，i 当前行索引（相对当前页），grid 接口对象；返回 dom 字符串
 * @param {function=} opts.cols[i].hrender 该列标题部分的渲染函数 hrender(name,title) 当前列的 name 及 title
 * @param {boolean=} opts.showHead 是否显示表头，默认为 true
 * @param {boolean=} opts.showno <span class="t_gray80">通过在 opts.cols 中添加列定义 {type:'no'} 实现</span>
 * @param {boolean=} opts.singleChk 若定义为 true，则只能进行单选。默认为 false。
 * @param {boolean|string=} opts.chkField opts.cols 中未添加 type='chk' 的列时，若将此属性定义为 string，则将以此字段作为标识选中状态的 field。若值为 true，或虽未定义，但 opts.singleChk=true，则该字段为 '__checked'。
 *  - 推荐的使用场景：单选，但不希望显示选择列。其他情况：<span class="t_gray80">请通过在 opts.cols 中添加列定义 {type:'chk'} 或 {type:'chk',field:'...'} 实现其他情况：设置了此属性，且未修改 opts.singleChk，则显示复选框。</span>
 * @param {object=} opts.filterEl 过滤文本框对象，后台分页时不支持过滤。
 * @param {object=} opts.filter 过滤功能配置，仅当定义了 filterEl 时生效。
 * @param {string|Array=} opts.filter.fields 参与过滤的列的属性名，对应 cols[i].field。
 * @param {boolean=} opts.filter.pySupport 是否支持拼音首字过滤，开启过滤时，默认为 true。
 * @param {boolean=} opts.filter.hide 是否隐藏不符合过滤条件的行，默认为 true，复选时此属性无效。
 * @param {boolean=} opts.prompt 无数据时是否显示提示，默认为 true。
 * @param {function=} opts.rowClser 行自定义class函数。function(row,i){...} 参数参考 opts.cols[i].render。
 * @param {object=} opts.callback 回调函数定义。
 * @param {object=} opts.callback.cell 单元格事件。
 <pre class="des-conf">cell:{
    ctrl:{// 对应 cols 中定义的 opts.cols[i].name
       // this 指向当前单元格 dom 对象
       // 参数参考 opts.cols[i].render，e 为触发事件的 event 对象
       click:function(e,val,row,i){...}
    }
 }</pre>
 * @param {object=} opts.callback.row 行事件。
 <pre class="des-conf">row:{
    // this 指向当前行 dom 对象，参数参考 opts.callback.cell
    click:function(e,row,i){...}
 }</pre>
 * @param {function=} opts.callback.afterShowData 显示完数据的回调函数。
 *          function(grid){...}
 * @param {function=} opts.callback.onCheckRow 选中行时的回调函数。
 *          function(row,i,el){...} 参数依次是：行数据，行索引，行对应的tr对象
 * @param {function=} opts.callback.onUnCheckRow 取消行选中时的回调函数。
 *          function(row,i,el){...} 参数依次是：行数据，行索引，行对应的tr对象
 * @param {Array=} opts.data 静态数据，优先级高于 opts.url。
 * @param {string=} opts.url 数据请求路径。
 * @param {object=} opts.args 请求参数的键值对，只在 opts.url 有意义时生效。
 * @param {boolean=} opts.showloading 向后台请求数据时的 showloading 配置，参考 $.request(opts) 中的 opts.showloading。
 * @param {boolean|object=} opts.page 分页配置，默认为 false，即不分页。设置为对象时，作为初始化分页条的参数，参考 $.fn.initPageBar()。
 * @return {object} obj 接口对象
 * @rtn {object} obj.el 获取当前 grid 对应的 el。
 * @rtn {function} obj.fResetSize() 初始化时可能由于元素隐藏或祖先元素隐藏，导致无法在容器变化时重算尺寸，此时可手动调用此方法触发进行尺寸重算。opts.staticSize 为 false 时生效。
 * @rtn {function} obj.fReset(cusOpts) 扩展初始化时的配置，重新请求数据（分页）。
 *   - {object} cusOpts 参考初始化参数。
 *   - 支持重置的属性：staticSize, cols, filter, prompt, rowClser, callback, data, url, args, showloading, page
 *   - 复杂属性中，会直接用新配置直接替换原有对象的属性：cols, filter, callback；会在原有对象基础上扩展的属性：page
 * @rtn {function} obj.resetData(cusOpts) <span class="t_gray80">请用 obj.fReset() 替代。</span>
 * @rtn {function} obj.getData() 返回整个表格的的数据列表 {Array}，后台分页且未过滤时，同 obj.getCurData() 的结果。
 * @rtn {function} obj.getCurData() 返回当前显示（分页时为当前页数据，过滤时为过滤后当前页数据）的数据列表 {Array}。
 * @rtn {function} obj.setCurData(data) 重置当前显示的数据列表，不会影响 obj.getData() 的结果。
 *   - {Array} data 新的列表数据。
 * @rtn {function} obj.setData(data) <span class="t_gray80">请用 obj.setCurData() 替代。</span>
 * @rtn {object} obj.findCol(key,name) 根据条件查找所有符合的 cols[i].key=val 的列定义对象集合，未找到则为 []
 * @rtn {function} obj.findRow(field,val) 根据条件查找所有符合的 data[i].field=val 的行对象集合，未找到则为 []
 * @rtn {function} obj.getCheckedIdx() 获取当前列表所有选中行索引，返回选中行索引数组，未找到则为 []
 * @rtn {function} obj.getCheckedRows() 获取当前列表所有选中行，返回选中行数据数组，未找到则为 []
 * @rtn {function} obj.checkRow(row,chk) 修改指定行的选中状态
 *   - {object|Array} row 要选中的行对应的数据，必须为当前 grid 中的数据对象，支持多条数据组成的数组
 *   - {boolean=} chk 设为 true 将 row 选中，false 将 row 取消选中，默认为 true
 * @rtn {function} obj.getPage() 返回当前的分页信息，返回值 {percount,totalpage,curpage,totalcount}
 * @rtn {function} obj.getPageApi() 返回当前分页接口 api
 * @rtn {function} obj.getPageObj() <span class="t_gray80">请用 obj.getPageApi() 替代。</span>
 * @rtn {function} obj.merge(merges) 合并单元格
 *   - merges {Array} 要合并的单元格信息
 *       merges[i].rowI {int} 要合并的单元格在当前页的索引
 *       merges[i].name {string} 要合并的单元格所在列对应的 name
 *       merges[i].rowspan {int} 合并几行
 *       merges[i].colspan {int} 合并几列
 * @rtn {function} obj.destroy() <span class="t_red">销毁 grid。暂无应用场景，已取消支持。</span>
 * @rtn {function} obj.getOpts() 获取当前列表配置（为扩展编辑表格等功能添加此接口）
 */
$.fn.initGrid = function(opts){
    var el = $(this),
        api,
        CONF = WICONF.initGrid;// 全局配置
    opts = $.extend({
        defaultColWidth: CONF.defaultColWidth,
        tableHBorderW: CONF.tableHBorderW,
        staticSize: true,// 组件是否是静态尺寸，设为 true 将不会监听尺寸变化，提高效率
        cols: [],
        showHead: true,
        showno: false,// TODO del 兼容旧版本，现通过在 opts.cols 中添加列定义 {type:'no'} 实现
        singleChk: false,
        chkField: false,// 推荐仅在单选且不显示选择列时使用
        //filterEl,
        filter: {},
        prompt: true,
        //rowClser:function(curdata,i),
        //callback:{},
        //data:[],
        //url:'',
        //args:{},
        showloading: false,
        page: false
    }, opts);
    var oPageOpts,
        sNoName,// 序号列 name
        sChkName, sChkField,// 选择列 name，选择列 field，fDrawDom() 时赋值
        aColsDef,// 列定义
        _cb,// 回调配置
        _data,// 全部数据
        _curData; // 记录当前页数据
    var oPagebarApi,
        _pageObj,// initPageBar 中绘制分页信息时回传的 oPagebarApi.page 更实时
        oFilterApi;
    var nElWidth,// 记录 el 容器尺寸，以便判断是否需要重新计算列宽
        aInitColsW = [], // 记录用户初始化时定义的列宽
        aAdaptCols = []; // 未指定宽度的列索引
    // 根据条件查找所有符合的 cols[i].key=val 的列
    // @return {Array} 所有符合的列定义对象集合，未找到则为 []
    var fFindCol = function(key, val){
        var idxArr = [];
        for(var i = 0; i < aColsDef.length; i++){
            var col = aColsDef[i];
            if(col[key] == val){
                idxArr.push(col);
            }
        }
        return idxArr;
    };
    // 根据条件查找所有符合的 data[i].field=val 的行
    // @return {Array} 所有符合的行对象集合，未找到则为 []
    var fFindRow = function(field, val){
        var rows = [];
        for(var i = 0; i < _data.length; i++){
            var row = _data[i];
            if(row[field] == val){
                rows.push(row);
            }
        }
        return rows;
    };
    // 改变指定行的选中状态
    // row {object|Array} 要选中的行对应的数据，必须为当前 grid 中的数据对象
    // chk {boolean=} true 时改为选中，false 改为不选中，默认为 true
    var fCheckRow = function(row, chk){
        if(!sChkField || !row) return;// 未定义可选中
        var bSingle = opts.singleChk,// 是否单选
            chkStats = chk !== false,// 默认为 true
            i;
        var applyRow = function(r, rChk){
            var oldChk = !!r[sChkField];// 修改前的选中状态
            if(oldChk != rChk){
                r[sChkField] = rChk;
                var i = _curData.indexOf(r);// 当前页中的索引
                if(i != -1){
                    var rowEl = el.find('tbody>tr[data-i="' + i + '"]');
                    rChk ? rowEl.addClass('trchk') : rowEl.removeClass('trchk');
                    rowEl.find('>td[data-name="' + sChkName + '"]>input').prop('checked', rChk);
                }
                if(_cb){
                    if(rChk){
                        _cb.onCheckRow && _cb.onCheckRow(r, i, rowEl, api);// 选中回调
                    }
                    else{
                        _cb.onUnCheckRow && _cb.onUnCheckRow(r, i, rowEl, api);// 取消选中回调
                    }
                }
            }
        };
        // 单选情况下选中，先将所有行取消选中
        if(bSingle && chkStats == true){
            var idxs = fGetCheckedIdx();
            for(i = 0; i < idxs.length; i++){
                applyRow(_data[idxs[i]], false);
            }
        }
        if(Object.prototype.toString.call(row) === '[object Array]'){// 修改数组中的行的选中状态
            if(bSingle && chkStats == true){// 单选情况下选中，只选中第一项
                applyRow(row[0], chkStats);
            }
            else{
                for(i = 0; i < row.length; i++){
                    applyRow(row[i], chkStats);
                }
            }
        }
        else{
            applyRow(row, chkStats);
        }
    };
    // 获取行绘制字符串。curdata 当前行数据，i 在当前页的索引，pi 分页数据中的第几条
    var fGetTrStr = function(curdata, i, pi){
        var str = '',
            rowCls = '';// 行样式字符串
        if(opts.rowClser){
            rowCls = opts.rowClser(curdata, i) || '';
        }
        if(sChkField && curdata[sChkField]){// 当前行选中
            rowCls += ' trchk';
        }
        str += '<tr data-i="' + i + '" class="' + rowCls + '">';
        for(var j = 0, col, aCls; j < aColsDef.length; j++){
            col = aColsDef[j];
            aCls = [];
            if(col.cls){
                aCls.push(col.cls);
            }
            if(col.align){// 对齐方式
                aCls.push(col.align);
            }
            if(j == 0 && col.type == 'no'){// 序号在第一列
                aCls.push('ctrltd');
            }
            str += '<td data-name="' + col.name + '"' +
                (aCls.length ? ' class="' + aCls.join(' ') + '"' : '') +
                (col.showTip ? ' title="' + (curdata[col.field] == undefined ? '' : curdata[col.field]) + '"' : '') + '>';
            if(col.type == 'no'){
                str += pi;
            }
            else if(col.type == 'chk'){
                str += '<input class="listtable-chkipt" type="checkbox"' + (curdata[col.field] ? ' checked' : '') + ' />';
            }
            else{
                str += '<div class="listtable-item">' +
                    (col.render ? col.render(curdata[col.field], curdata, i, api) : (curdata[col.field] == undefined ? '' : $.encodeHtml(curdata[col.field]))) +
                    '</div>';
            }
            str += '</td>';
        }
        str += '</tr>';
        return str;
    };
    // 根据请求获取的数据绘制表格内容
    // {object} datalist 数据列表
    var fSetCurData = function(datalist){
        var startNo = 1,
            dataStr = '';
        if(_pageObj){
            startNo = (_pageObj.curpage - 1) * _pageObj.percount + 1 || 1;// 根据分页对象获得第一条的序号
        }
        _curData = datalist;
        if(datalist && datalist.length > 0){
            // 绘制当前页数据
            for(var i = 0; i < datalist.length; i++){
                dataStr += fGetTrStr(datalist[i], i, startNo + i);
            }
        }
        else if(opts.prompt != false){
            dataStr = '<tr><td class="nodata" colspan="' + aColsDef.length + '">未查询到符合条件的数据!</td></tr>'
        }
        el.find('tbody').html(dataStr);
        el.find('thead>tr>[data-name="' + sChkName + '"] input').prop('checked', false);// 避免全部删除后仍选中 TODO 应根据选中项判断
        _cb && _cb.afterShowData && _cb.afterShowData(api);
    };
    // 获取当前列表所有选中行索引集合
    var fGetCheckedIdx = function(){
        var sels = [];
        if(sChkField && _data){
            for(var i = 0; i < _data.length; i++){
                if(_data[i][sChkField]){
                    sels.push(i);
                }
            }
        }
        return sels;
    };
    // 获取当前所有选中行的数据列表
    var fGetCheckedRows = function(){
        var chks = fGetCheckedIdx();
        var rows = [];
        for(var i = 0; i < chks.length; i++){
            rows.push(_data[chks[i]]);
        }
        return rows;
    };
    /**
     * 合并指定单元格
     * @param merges {Array} 要合并的单元格信息
     *   merges[i].rowI {int} 要合并的单元格在当前页的索引
     *   merges[i].name {string} 要合并的单元格所在列对应的 name
     *   merges[i].rowspan {int} 合并几行
     *   merges[i].colspan {int} 合并几列
     */
    var fMerge = function(merges){
        if(!merges || !merges.length) return;
        var _adjustMerge = function(mergeItem){
            var rowI = mergeItem['rowI'], colI = -1
                , name = mergeItem['name']
                , rowspan = mergeItem['rowspan']
                , colspan = mergeItem['colspan'];
            var cellEl = el.find('tbody>tr[data-i="' + rowI + '"]>td[data-name="' + name + '"]')
                , rowEl;
            if(!cellEl.length) return;
            for(var i = 0, len = aColsDef.length; i < len; i++){// 获取当前列定义索引，由于判断过 cellEl，所以 colI 必有意义
                if(name == aColsDef[i]['name']){
                    colI = i;
                    break;
                }
            }
            rowspan && cellEl.attr('rowspan', rowspan);
            colspan && cellEl.attr('colspan', colspan);
            /* 调整受影响的单元格 */
            rowspan = parseInt(cellEl.attr('rowspan'), 10) || 1;
            colspan = parseInt(cellEl.attr('colspan'), 10) || 1;
            for(var j = 0; j < rowspan; j++){
                rowEl = el.find('tbody>tr[data-i="' + (rowI + j) + '"]');
                for(var k = 0; k < colspan; k++){
                    if(j == 0 && k == 0) continue;// 保留当前单元格
                    rowEl.find('>td[data-name="' + aColsDef[colI + k]['name'] + '"]').remove();
                }
            }
        };
        for(var i = 0, len = merges.length; i < len; i++){
            _adjustMerge(merges[i]);
        }
    };
    // 尺寸重算，仅支持动态尺寸表格
    var fResetSize = function(){
        if(!opts.staticSize){// 动态尺寸表格需要通过 resizeListener 重算尺寸
            $.resizeListener.fResetSize(el);
        }
    };

    // 获取当前列表配置 opts（为扩展编辑表格添加此接口）
    var fGetOpts = function(){
        return opts;
    };
    // 返回整个表格的的数据列表，后台分页且未过滤时，同 fGetCurData() 的结果
    var fGetData = function(){
        return $.extend([], _data);// 避免用户直接操作返回的数组，导致 _data 发生变化，但要注意的是，数组中的每一项并非副本，修改也将污染组件数据
    };
    // 返回当前页的数据列表
    var fGetCurData = function(){
        return $.extend([], _curData);// 避免用户直接操作返回的数组，导致 _data 发生变化，但要注意的是，数组中的每一项并非副本，修改也将污染组件数据
    };
    // 返回当前的分页信息
    var fGetPage = function(){
        return _pageObj;
    };
    // 返回当前分页接口 api
    var fGetPageApi = function(){
        return oPagebarApi;
    };

    // 请求数据（分页）并绘制到 DOM
    var fBindData = function(){
        var jqManu, oNewPageOpts,// 分页元素，分页配置
            optsData = opts.data;// 配置的前台数据源
        // 数据绑定前先清空原有的数据源
        _data = null;
        _curData = null;
        oPagebarApi && oPagebarApi.destroy();// 销毁分页对象
        oPagebarApi = null;
        _pageObj = null;
        if(!optsData && !opts.url) return;// 没有定义数据源时不进行数据部分绘制，用于支持初始化时不带入数据
        // 记录全部数据，bFilter = true 时允许将数据同步到过滤组件
        var fSetData = function(newData, bFilter){
            _data = newData;
            if(bFilter && oFilterApi){
                oFilterApi.setData(_data);// 关键字清空，不触发过滤回调
            }
        };
        if(oPageOpts){
            jqManu = el.next('.manu');
            if(!jqManu.length){
                jqManu = $('<div class="manu"></div>');
                el.after(jqManu);
            }
            oNewPageOpts = {};
            // 前台分页
            if(optsData){
                fSetData(optsData, true);// 设置 _data，支持过滤
                $.extend(oNewPageOpts, oPageOpts, {
                    data: optsData,
                    afterFlip: function(datalist, pageObj, data){
                        _pageObj = pageObj;
                        fSetCurData(datalist);
                    }
                });
            }
            // 后台分页
            else{
                $.extend(oNewPageOpts, oPageOpts, {
                    url: opts.url,// 后台分页时请求的url
                    args: opts.args,
                    showloading: opts.showloading,
                    afterFlip: function(datalist, pageObj, data){
                        fSetData(datalist, false);// 设置 _data，不支持过滤
                        _pageObj = pageObj;
                        fSetCurData(datalist);
                    }
                });
            }
            oPagebarApi = jqManu.initPageBar(oNewPageOpts);// 分页组件初始化
            delete oPageOpts.autoPage;// 数据完成重绘，autoPage 还原
        }
        else{
            // 前台不分页
            if(optsData){
                fSetData(optsData, true);// 设置 _data，支持过滤
                fSetCurData(optsData);
            }
            // 后台不分页
            else{
                $.request({
                    onSuccess: function(data){
                        fSetData(data, true);// 设置 _data，支持过滤
                        fSetCurData(data);
                    },
                    showloading: opts.showloading,
                    ajaxOpts: {
                        url: opts.url,
                        data: opts.args
                    }
                });
            }
        }
    };

    // 过滤组件回调事件
    var fAfterFilter = function(newData, keyword){
        if(oPageOpts){// 分页
            if(opts.data){// 前台
                oPagebarApi && oPagebarApi.fReset({
                    data: newData// 仅会改变 _curData
                });
            }
        }
        else{// 不分页 - 前台/后台
            fSetCurData(newData);// 仅会改变 _curData
        }
    };
    // 初始化或重置过滤组件
    var fInitFilter = function(){
        var filter, filterOpts;
        if(opts.filterEl){
            // 后台分页时不支持过滤
            filter = opts.filter;
            filter.hide = opts.singleChk && filter.hide != false;// 只有单选且允许隐藏时为 true，多选禁止隐藏
            filterOpts = {
                fields: filter.fields,
                afterFilter: fAfterFilter
            };
            if(filter.pySupport != undefined){
                filterOpts.pySupport = filter.pySupport;
            }
            // 初始化或重置过滤组件
            if(oFilterApi){
                oFilterApi.fReset(filterOpts);
            }
            else{
                oFilterApi = opts.filterEl.initFilter(filterOpts);
            }
        }
    };

    // 绑定行事件
    var fBindRowEvent = function(){
        var eType;// 临时变量
        // 行事件
        var cbRow = _cb.row;
        if(typeof cbRow == 'object'){
            var cbRowHandle = function(handle){
                return function(e){
                    var el = $(this),
                        i = parseInt(el.attr('data-i'), 10);
                    handle.call(this, e, _curData[i], i, api);
                };
            };
            for(eType in cbRow){
                if(cbRow.hasOwnProperty(eType))
                    el.off(eType + '.row')// TODO del 兼容旧版本的写法，不合逻辑（错误地对同一个 el 初始化时，可能会导致不需要触发的行事件因为无法解绑导致触发）
                      .on(eType + '.row', 'tbody>tr', cbRowHandle(cbRow[eType]));
            }
        }
    };
    // 解绑行事件
    var fUnbindRowEvent = function(){
        var eType;// 临时变量
        // 行事件
        var cbRow = _cb.row;
        if(typeof cbRow == 'object'){
            for(eType in cbRow){
                if(cbRow.hasOwnProperty(eType))
                    el.off(eType + '.row');
            }
        }
    };
    // 绑定单元格事件
    var fBindColEvent = function(){
        var name, eType;// 临时变量
        // 单元格事件
        var cbCell = _cb.cell;
        if(typeof cbCell == 'object'){
            var cbCellHandle = function(handle, name){
                var col = fFindCol('name', name)[0];
                return function(e){
                    var el = $(this)
                        , i = parseInt(el.parent().attr('data-i'), 10)
                        , row = _curData[i];
                    handle.call(this, e, row ? row[col.field] : undefined, row, i, api);
                };
            };
            for(name in cbCell){
                if(cbCell.hasOwnProperty(name))
                    for(eType in cbCell[name]){
                        if(cbCell[name].hasOwnProperty(eType)){
                            el.off(eType + '.cell_' + name)// TODO del 兼容旧版本的写法，不合逻辑（错误地对同一个 el 初始化时，可能会导致重名但不需要绑定事件的列上事件无法被解绑，导致错误触发）
                              .on(eType + '.cell_' + name, 'tbody>*>td[data-name="' + name + '"]', cbCellHandle(cbCell[name][eType], name));
                        }
                    }
            }
        }
    };
    // 解绑单元格事件
    var fUnbindColEvent = function(){
        var name, eType;// 临时变量
        var cbCell = _cb.cell;
        if(typeof cbCell == 'object'){
            for(name in cbCell){
                if(cbCell.hasOwnProperty(name))
                    for(eType in cbCell[name]){
                        if(cbCell[name].hasOwnProperty(eType)){
                            el.off(eType + '.cell_' + name);
                        }
                    }
            }
        }
    };

    // 事件绑定
    var fBindEvent = function(){
        _cb = opts.callback;
        if(_cb){
            fBindRowEvent();// 行事件
            fBindColEvent();// 单元格事件
        }
    };
    // 事件解绑
    var fUnbindEvent = function(){
        if(_cb){
            fUnbindRowEvent();
            fUnbindColEvent();
        }
    };
    // 绑定选中事件 - 必须在 cols 定义完成之后
    var fBindCheckEvent = function(){
        var bShowChk = !!fFindCol('type', 'chk').length;// 是否显示选择列
        // 先解绑
        el.off('click._row')
          .off('click.chk')
          .off('click.chkAll');
        // 不可选择或存在选择列时，绑定行点击变色事件。反之，可选且不存在选择列时，点击行应执行选中行操作
        if(!sChkField || bShowChk){
            el.on('click._row', 'tbody>tr[data-i]', function(){
                var tr = $(this);
                if(tr.hasClass('now')) return;
                tr.siblings('.now').removeClass('now');
                tr.addClass('now');
            });
        }
        // 允许选中，绑定行选中事件
        if(sChkField){
            if(bShowChk){// 显示选择列 - 无论单选/多选，事件添加在选择列单元格
                el.on('click.chk', 'tbody>tr>td[data-name="' + sChkName + '"]', function(){
                    var td = $(this),
                        rowI = parseInt(td.parent().attr('data-i'), 10),
                        stat = _curData[rowI][sChkField];
                    fCheckRow(_curData[rowI], !stat);
                });
                if(opts.singleChk === false){// 复选，绑定全选/全不选事件
                    el.on('click.chkAll', 'thead>tr>[data-name="' + sChkName + '"]', function(e){
                        var stat, input;
                        input = $(this).children('input');
                        if(e.target.tagName.toLocaleLowerCase() == 'input'){// 事件源是 input
                            stat = input.prop('checked');
                        }
                        else{
                            stat = !input.prop('checked');
                        }
                        input.prop('checked', stat);
                        fCheckRow(_curData, stat);
                    });
                }
            }
            else{// 不显示选择列，一定是单选，点击行选中
                el.on('click.chk', 'tbody>tr[data-i]', function(){
                    var tr = $(this),
                        rowI = parseInt(tr.attr('data-i'), 10),
                        stat = _curData[rowI][sChkField];
                    fCheckRow(_curData[rowI], true);// 选中点击行
                });
            }
        }
    };

    // 需要动态计算尺寸时的尺寸处理函数 - 根据当前容器宽度，计算每个 <col /> 的实际像素，并添加样式
    var fCaculateDyn = function(bInit){
        var nOutWidth = nElWidth - opts.tableHBorderW;// table 中 td 的总尺寸，减去 <table> 横向边框
        var defaultColWidth = opts.defaultColWidth,// 默认列宽,未指定列宽时最小的列宽
            avgColWidth,// 未指定列宽列的平均宽度
            allCols = 0,// 列宽（含border）总和
        //preCols = 0,// 非用户自定义列的列（序号、复选框）宽总和，若显示，总在表格最左侧
            unAsignedCols; // 组件可见区域中可分配的宽度
        var jqCols = el.find('col');
        // 处理列宽，计算已定义的列宽总和
        $.each(aColsDef, function(index, col){
            // 初始化，将用户定义的列宽存入 aInitColsW，将未设置列宽的列索引存入 aAdaptCols 以便之后的计算
            if(bInit){
                var initColW = col.width;
                if(typeof initColW == 'number'){// 数字
                    aInitColsW.push(initColW);
                }
                else if(typeof initColW == 'string'){
                    if(/^\s*\d+\.?\d*%\s*$/.test(initColW)){// 合法的 % 数
                        aInitColsW.push(initColW);
                    }
                    else if(/^\s*\d+\.?\d*(?:px)?\s*$/.test(initColW)){// 合法 number 像素值
                        initColW = parseFloat(initColW);
                        aInitColsW.push(initColW);
                    }
                    else{// 标记为未定义列宽
                        initColW = undefined;
                        aInitColsW.push(initColW);
                        aAdaptCols.push(index);
                    }
                }
                else{// 标记为未定义列宽
                    initColW = undefined;
                    aInitColsW.push(initColW);
                    aAdaptCols.push(index);
                }
            }
            // 为用户初始化定义列宽的列确定宽度 - 全部转换为数字
            var colW = aInitColsW[index];
            if(typeof colW == 'string'){// 已定义的 % 列
                colW = Math.round(nOutWidth * parseFloat(colW.replace('%', '')) / 100);
            }
            if(typeof colW != 'undefined'){// 已定义的列
                col.width = colW;
                allCols += colW;// 累加到列宽总和

                jqCols.eq(index).css('width', colW + 'px');// 绘制到 dom
            }
        });
        //scope.multiselect && (preCols += dgConf.leftColWidth);// 允许多选
        //scope.showno && (preCols += dgConf.leftColWidth);// 显示序号
        //allCols += preCols;

        //剩余列宽总和 = datagrid 内容部分总宽度 - 纵向滚动条（始终存在）- 已经给定的列宽总和
        unAsignedCols = nOutWidth - allCols;
        avgColWidth = Math.floor(unAsignedCols / aAdaptCols.length);
        if(avgColWidth < defaultColWidth){ //如果计算出出平均列宽小于默认列宽，直接定义为默认列宽
            $.each(aAdaptCols, function(m, index){
                aColsDef[index].width = defaultColWidth;
                allCols += defaultColWidth;
                unAsignedCols -= defaultColWidth;
                jqCols.eq(index).css('width', defaultColWidth + 'px');// 绘制到 dom
            });
        }
        else{
            $.each(aAdaptCols, function(m, index){
                if(m == aAdaptCols.length - 1){
                    aColsDef[index].width = unAsignedCols;
                    allCols += unAsignedCols;
                    unAsignedCols = 0;
                }
                else{
                    aColsDef[index].width = avgColWidth;
                    allCols += avgColWidth;
                    unAsignedCols -= avgColWidth;
                }
                jqCols.eq(index).css('width', aColsDef[index].width + 'px');// 绘制到 dom
            });
        }
        el.find('.listtable').css('width', allCols);// 修改 table 宽度
    };
    // 不需动态计算尺寸时的尺寸处理函数 - 直接根据列宽定义为 <col /> 添加样式
    var fCaculateStat = function(bInit){
        var jqCols = el.find('col');
        $.each(aColsDef, function(index, col){
            var initColW = col.width || '';
            jqCols.eq(index).css('width', initColW);// 绘制到 dom
        });
        el.find('.listtable').css('width', '100%');// 修改 table 宽度
    };

    // 实际列宽计算 - 未定义列宽的列，根据剩余尺寸计算平均值，若平均值 < opts.defaultColWidth，则以 opts.defaultColWidth 显示
    var fComputeColsW = function(bInit){
        var fCaculate = opts.staticSize ? fCaculateStat : fCaculateDyn;
        // 将 bInit 规范为布尔值，$.resizeListener 中调用时，不排除以后需要传递 event 对象，因此保留这一步
        bInit = bInit === true;
        if(bInit){
            // 初始化表格内容部分宽度和高度
            nElWidth = el.innerWidth();
            // 计算列宽等
            fCaculate(bInit);
        }
        else{
            var curWidth = el.innerWidth();
            if(nElWidth !== curWidth){// 容器宽度发生变化，需要重新计算列宽
                nElWidth = curWidth;
                fCaculate(bInit);
            }
        }
    };

    // 重置列定义
    var fResetColsDef = function(){
        /* 绘制基础 dom，确定表头，清空数据部分 */
        var colAlignArr = ['center', 'left', 'right'];// col.align 合法值
        var jqTable = el.children('.listtable');
        var tableStr = '<table class="listtable" cellspacing="0" cellpadding="0">',
            sCols = '',
            sThs = '';
        var bShowHead = opts.showHead,
            bShowNo, bShowChk;// 是否定义了序号列、选择框列
        var i, oStr, len, curCol;// 临时变量，遍历用
        var aPreCol = [];
        var sDefaultChkField = typeof opts.chkField == 'string' ? opts.chkField : '__checked';
        var fGetColStrObj = function(col){
            var sCol = '',
                sTh = '';
            var sName = col.name,
                sTitle = col.title,
                sThIn;
            if(!sName){// name 未定义时，与 field 相同
                sName = col.name = col.field;
            }
            // 序号列，只允许有一列
            if(col.type == 'no'){
                if(bShowNo){
                    delete col.type;// 改为普通列
                }
                else{
                    bShowNo = true;
                    if(!sName){
                        sName = col.name = '__no';// 序号列应根据数据计算，不需要有 field
                    }
                    sNoName = sName;
                    if(typeof sTitle == 'undefined'){
                        sTitle = col.title = '序号';
                    }
                }
            }
            // 选择框列，只允许有一列
            if(col.type == 'chk'){
                if(bShowChk){
                    delete col.type;// 改为普通列
                }
                else{
                    bShowChk = true;
                    if(!col.field){// 未定义时，设为默认字段
                        col.field = sDefaultChkField
                    }
                    sChkField = col.field;// cols 中定义的 field 优先级最高
                    if(!sName){
                        sName = col.name = sChkField;
                    }
                    sChkName = sName;
                    // 全选/全不选有关联事件，因此选择列暂不支持自定义表头
                    sTitle = col.title = opts.singleChk ? '' : '<input class="listtable-chkipt" type="checkbox" />';
                    delete col.hrender;
                }
            }
            // 水平对齐方式
            if(!col.align || colAlignArr.indexOf(col.align) == -1){// 未指定合法的 align
                if(col.type == 'number'){// 未指定 align，且为数字，默认居右
                    col.align = 'right';
                }
                else if(col.type == 'no' || col.type == 'chk'){// 序号或复选框列，默认居中
                    col.align = 'center';
                }
                else{// 移除不合法的 align
                    delete col.align;
                }
            }
            // 拼接字符串
            sCol += '<col data-name="' + col.name + '" />';
            if(bShowHead){// 显示 thead
                sThIn = col.hrender ? col.hrender(sName, sTitle) : sTitle;
                sTh += '<th data-name="' + sName + '">' + (sThIn || '&nbsp;') + '</th>';
            }
            return {
                col: sCol,
                th: sTh
            }
        };

        // fReset 可能修改列配置，先重置相关全局变量
        aColsDef = opts.cols;
        aInitColsW.length = 0;
        aAdaptCols.length = 0;
        sNoName = sChkName = sChkField = undefined;
        // 先处理 opts.cols 定义的列
        for(i = 0, len = aColsDef.length; i < len; i++){
            oStr = fGetColStrObj(aColsDef[i]);
            sCols += oStr.col;
            sThs += oStr.th;
        }
        /* 兼容代码 start TODO del 兼容旧版本的写法，opts.cols 处理完成后，判断是否有旧版本的序号列、选择列 */
        if(!bShowNo && opts.showno){// 定义了序号列
            aPreCol.push({type: 'no', width: '50px'});// 只在兼容时默认宽度，cols 中自定义时可能需要自适应列宽
        }
        if(!bShowChk && !opts.singleChk && opts.chkField){// opts.cols 未定义选择列，复选且定义了 opts.chkField
            aPreCol.push({type: 'chk', width: '30px'});
        }
        // 处理左侧列，倒序往前添加
        for(i = aPreCol.length - 1; i >= 0; i--){
            curCol = aPreCol[i];
            oStr = fGetColStrObj(curCol);
            sCols = oStr.col + sCols;
            sThs = oStr.th + sThs;
            aColsDef.unshift(curCol);// 添加到列定义
        }
        /* 兼容代码 end */
        // 未显示选中列时，处理为单选（点击行选中）
        if(!bShowChk){
            sChkField = sDefaultChkField;// 记录字段，单选不需记录 sChkName
            opts.singleChk = true;// 2017.11.21 新增，不显示选择列时，强制设为单选
        }
        // 拼接字符串
        tableStr += '<colgroup>' + sCols + '</colgroup>';
        if(bShowHead){
            tableStr += '<thead><tr>' + sThs + '</tr></thead>';
        }
        tableStr += '<tbody></tbody>' +
            '</table>';
        // 绘制 DOM
        if(jqTable.length){
            jqTable.replaceWith(tableStr);
        }
        else{
            el.append(tableStr);
        }
        /* 重计算列宽 */
        fComputeColsW(true);
    };
    // 修改初始化时的配置，重新获取数据
    var fReset = function(cusOpts){// fInit 中调用时传入 true
        var oCusPage;
        if(typeof cusOpts == 'object'){
            // 处理分页配置
            oCusPage = cusOpts.page;
            if(oCusPage === false){
                opts.page = false;
            }
            else if(oCusPage){
                opts.page = $.extend({}, oPageOpts, oCusPage);
            }
            delete cusOpts.page;// 移除 page，避免扩展时将原有的 opts.page 直接覆盖
            // 扩展配置
            $.extend(opts, cusOpts);
            // 重定义列，需要重新初始化
            if(cusOpts.cols){
                fResetColsDef();// 重置列定义
            }
            // 绑定事件
            if(cusOpts.callback){
                // 只有 callback.cell 和 callback.row 需要重新绑定
                // callback.onCheckRow, callback.onUnCheckRow, callback.afterShowData 调用时会自动使用最新事件
                fUnbindEvent();// 解绑原先的事件
                fBindEvent();
            }
            // 重置过滤组件
            if(cusOpts.filter){
                fInitFilter();
            }
            // 数据配置
            if(cusOpts.data){// 重设了 data，将 url 置空
                opts.url = undefined;
            }
            else if(cusOpts.url){// 重设了 url，将 data 置空
                opts.data = undefined;
            }
        }
        else if(cusOpts === true){// 初始化时，处理 opts
            fResetColsDef();// 重置列定义
            fBindEvent();// 事件绑定
            fInitFilter();
            // 数据配置
            if(opts.data){
                opts.url = undefined;
            }
        }
        /* 应用配置 */
        fBindCheckEvent();// 由于 cols 等配置变化可能导致选中触发条件改变，需要重绑选中事件
        // 尺寸变化事件
        if(opts.staticSize){
            $.resizeListener.fUnBind(el, fComputeColsW);// 解绑容器尺寸变化事件
        }
        else{
            $.resizeListener.fBind(el, fComputeColsW);// 绑定容器尺寸变化事件
        }
        // 分页配置
        oPageOpts = opts.page;
        // 配置完成，获取数据
        fBindData();
    };

    var fInit = function(){
        el.addClass('listtableDiv');
        fReset(true);
    };
    api = {
        el: el,// 获取当前 grid 对应的 el
        fResetSize: fResetSize,// 初始化时可能由于元素隐藏或祖先元素隐藏，导致无法在容器变化时重算尺寸，此时可手动调用此方法触发进行尺寸重算
        fReset: fReset,// 扩展初始化时的配置，重新请求数据（分页）
        resetData: fReset,// TODO del 兼容旧版本，现改为 fReset()
        getData: fGetData,// 返回整个表格的的数据列表 {Array}，后台分页且未过滤时，同 obj.getCurData() 的结果
        getCurData: fGetCurData,// 返回当前显示（分页时为当前页数据，过滤时为过滤后当前页数据）的数据列表 {Array}
        setCurData: fSetCurData,// 重置当前显示的数据列表，不会影响 obj.getData() 的结果
        setData: fSetCurData,// TODO del 兼容旧版本，现改为 setCurData()
        findCol: fFindCol,// 根据条件查找所有符合的 cols[i].key=val 的列定义对象集合，未找到则为 []
        findRow: fFindRow,// 根据条件查找所有符合的 data[i].field=val 的行对象集合，未找到则为 []
        getCheckedIdx: fGetCheckedIdx,// 获取当前列表所有选中行索引，返回选中行索引数组，未找到则为 []
        getCheckedRows: fGetCheckedRows,// 获取当前列表所有选中行，返回选中行数据数组，未找到则为 []
        checkRow: fCheckRow,// 修改指定行的选中状态
        getPage: fGetPage,// 返回当前的分页信息，返回值 {percount,totalpage,curpage,totalcount}
        getPageApi: fGetPageApi,// 返回当前分页接口 api
        getPageObj: fGetPageApi,// TODO del 兼容旧版本，现改为 getPageApi()
        merge: fMerge,// 合并单元格
        getOpts: fGetOpts// 获取当前列表配置（为扩展编辑表格等功能添加此接口）
    };
    fInit();
    return api;
};
/**
 * @widoc $.fn.initTabsBox
 * @namespace comp
 * @des 将 .tab-box 元素初始化为 tab 容器
 * @type function
 * @param {object=} opts 配置参数
 * @param {Array} opts.tabs tab 页
 * @param {string} opts.tabs[i].val tab 页标识
 * @param {string=} opts.tabs[i].txt tab 页标题，默认与 val 一致
 * @param {boolean=} opts.tabs[i].remove 是否可关闭，默认为 false
 * @param {string=} opts.tabs[i].width 头部宽度，默认 '120px'，scroll=false 且 tab 页显示超出范围，会引起此属性失效
 * @param {string=} opts.tabs[i].cont 对应内容部分 DOM 字符串
 * @param {string=} opts.tabs[i].url 对应内容部分 url
 * @param {boolean=} opts.tabs[i].delay 若定义了 url，此属性为 true 时将在切换时才加载内容页。默认为 false
 * @param {boolean=} opts.tabs[i].scrolling 若定义了 url，此属性为 true 时将 iframe 的 scrolling 设为 'yes'。默认为 false
 * @param {boolean=} opts.tabs[i].keepcont 删除时是否保留内容部分，默认为 false
 * @param {string=} opts.headAlign 若设为 ‘right’ 则将 tab 头部居右显示，，此时 opts.scroll 失效，不可滚动
 * @param {boolean=} opts.context 是否显示右键菜单，默认为 false
 * @param {boolean=} opts.scroll 是否支持头部超出滚动，默认为 false
 * @param {boolean=} opts.noAdjust 是否禁止监听容器尺寸变化以自动调整尺寸，默认为 false，容器尺寸不会变化时，可设为 true 以提高效率
 * @param {boolean=} opts.showAdd 是否显示添加按钮，默认为 false
 * @param {function=} opts.addHandler() 添加按钮的事件
 * @param {function=} opts.onChange(val,oldVal) 切换tab时触发事件，参数为要选中的 tab.val,原来选中的 tab.val
 * @param {function=} opts.onRemove(val) 删除tab时触发事件，参数为要删除的 tab.val
 * @return {object|undefined} obj 接口对象
 * @rtn {function} obj.refreshTab() 刷新指定val的tab页，若是由cont设置的内容，则此方法无作用
 * @rtn {function} obj.addTab(tab,noToggle) 添加 tab 页
 *       tab {object} tab 页对象，结构同 opts.head
 *       noToggle {boolean=} 添加后是否禁止切换，默认为 false，即，添加即切换
 * @rtn {function} obj.getTabs(key,value) 选中所有符合条件的 tab 列表，无条件则选择全部，未找到则返回 []
 *       key {string} tab 页对象中的键：val,txt,remove
 *       value {string=}
 * @rtn {function} obj.getTab(key,value) 选择符合条件的一个tab
 * @rtn {function} obj.removeTab(tab) 删除指定的 tab
 * @rtn {function} obj.removeAll() 删除所有 tab
 * @rtn {function} obj.selectTab(tab) 切换到指定的 tab
 * @rtn {function} obj.adjust() 手动计算绘制头部尺寸
 * @rtn {function} obj.getSelect(tab) 获取当前tab页的标识
 * @rtn {function} obj.getContEl(tab) 获取内容部分的 jquery 元素对象
 */
$.fn.initTabsBox=function(opts){
    var el=$(this);
    var CONF={
        scrollCtrlW:20// 左右滚动按钮宽度各为 20
        ,addW:30
        ,liBefore:0
    };
    var _returnObj;
    var contBoxEl=el.children('.tab-cont-box');
    var headBoxEl=el.children('.tab-head-box');
    opts=$.extend({
        tabs:[]
        //,defaultVal:{string} 默认选中的 tabval，默认选中第一个，若定义为 false，则不选中任何 tab
        //            ,headAlign:'right'
        ,context:false
        ,scroll:false
        ,noAdjust:false
        ,showAdd:false
    },opts);
    var _tabs=[];
    var tabGuid = opts.noAdjust ? undefined : $.generateGuid('tab');// 用于标识 window 的 resize 事件

    var _destroy=function(){
        if(headBoxEl.length){
            _tabs.length=0;
            tabGuid && $(window).off('resize.tab_'+tabGuid);
            headBoxEl.off('click.changeTab')
                     .off('click.addTab')
                     .off('click.scroll');
            headBoxEl.remove();
        }
    };
    var tabSizes=[];// 支持滚动的状态记录 tab 头部尺寸
    var tabTotalSize=0;
    var ulWidth=0;// ul 可显示的尺寸
    /**
     * 重新计算 tab 头部尺寸
     * @param index {int=} 要重计算的 tab 的索引，未指定则重计算全部 tab
     * @private
     */
    var _calculateSizes=function(index){
        var lis=headBoxEl.find('.tab-head')
            ,li,liBCR,item,curW;
        if(index==undefined){// 重新计算全部
            tabSizes.length=0;
            tabTotalSize=0;
            var len=_tabs.length;
            for(index=0;index<len;index++){
                item=_tabs[index];
                li=lis.eq(index);
                li.css('width',item['width']||'');
                liBCR=li[0].getBoundingClientRect();
                curW=liBCR.right-liBCR.left;
                tabSizes.push(curW);
                tabTotalSize+=curW;
            }
        }else{
            item=_tabs[index];
            li=lis.eq(index);
            li.css('width',item['width']||'');
            liBCR=li[0].getBoundingClientRect();
            curW=tabSizes[index];
            if(curW!=undefined) tabTotalSize-=curW;
            curW=liBCR.right-liBCR.left;
            tabTotalSize+=curW;
            tabSizes[index]=curW;
        }
    };
    /**
     * 根据指定项或选中项滚动
     * @param index {int=} 要滚动到视图内的 tab 索引，未定义则为当前选中项索引
     * @private
     */
    var _scrollToSeL=function(index){
        if(!headBoxEl.hasClass('tab-scroll')) return;
        var headUl=headBoxEl.find('>ul')
            ,lis=headUl.children('.tab-head');
        var curLeft=0,curRight=0;// 选中项边界
        if(index==undefined) index=lis.index(lis.filter('.now'));
        for(var i= 0;i<tabSizes.length;i++){
            if(i==index){// 选中项
                curRight=curLeft+tabSizes[i];
                break;
            }
            curLeft+=tabSizes[i];
        }
        if(headUl.is(':animated')) headUl.stop(true);
        if(curRight==0){
            //                headUl.css({'left':CONF.scrollCtrlW+'px'});
            headUl.animate({'left':CONF.scrollCtrlW+'px'});
        }else{
            var hideL=CONF.scrollCtrlW-headUl.position().left;// 左侧已被隐藏的部分的尺寸
            if(hideL>curLeft){
                //                    headUl.css({'left':-curLeft+CONF.scrollCtrlW+'px'});
                headUl.animate({'left':-curLeft+CONF.scrollCtrlW+'px'});
            }else if(ulWidth+hideL-CONF.scrollCtrlW<curRight){
                //                    headUl.css({'left':ulWidth-curRight-CONF.scrollCtrlW+'px'});
                headUl.animate({'left':ulWidth-curRight-CONF.scrollCtrlW+'px'});
            }
        }
    };
    /**
     * 滚动头部
     * @param toNext {boolean=} 向后滚动
     * @private
     */
    var _scrollHead=function(toNext){
        if(!headBoxEl.hasClass('tab-scroll')) return;
        var headUl=headBoxEl.find('>ul');
        var hideL=CONF.scrollCtrlW-headUl.position().left// 左侧已被隐藏的部分的尺寸
            ,hideR=hideL+ulWidth-CONF.scrollCtrlW;// 右侧被隐藏部分前的尺寸
        var curW= 0, i, index;
        if(toNext){// 向后
            for(i= 0;i<tabSizes.length;i++){
                curW+=tabSizes[i];
                if(curW>hideR){
                    index = i;
                    break;
                }
            }
        }else{// 向前
            for(i= 0;i<tabSizes.length;i++){
                curW+=tabSizes[i];
                if(curW>=hideL){
                    index = i;
                    break;
                }
            }
        }
        if(index!=undefined) _scrollToSeL(index);
    };
    var _adjust=function(){
        var headUl=headBoxEl.find('>ul');
        _calculateSizes();// 复原尺寸
        // 计算 ul 尺寸
        var headBCR=headBoxEl.eq(0)[0].getBoundingClientRect();
        ulWidth=headBCR.right-headBCR.left;
        if(opts.showAdd){// 显示添加
            ulWidth-=CONF.addW;
        }
        if(tabTotalSize!=0 && ulWidth!=0 && tabTotalSize>ulWidth){// 超出
            if(opts.scroll){
                headBoxEl.addClass('tab-scroll');
                headUl.css('width',tabTotalSize+'px');
                var left=headUl.position().left;
                if(left > CONF.scrollCtrlW){// 左侧有留白
                    headUl.css({'left':CONF.scrollCtrlW+'px'});
                }else if(tabTotalSize + left < ulWidth - CONF.scrollCtrlW){// 右侧有留白
                    headUl.css({'left':ulWidth - tabTotalSize - CONF.scrollCtrlW+'px'});
                }
            }else{
                tabSizes.length && headUl.children('.tab-head').css('width',100/tabSizes.length+'%');
            }
        }else{
            if(opts.scroll){
                if(headUl.is(':animated')) headUl.stop(true);
                headUl.css('width','');
                headBoxEl.removeClass('tab-scroll');
                headUl.css('left',0);
            }
        }
    };
    /**
     * 添加 tab 页
     * @param tab {object} tab 页对象，结构同 opts.tabs[i]
     * @param noToggle {boolean=} 添加后是否不立即切换，默认为 false，即，添加即切换
     * @private
     */
    var _addTab=function(tab,noToggle){
        if(!headBoxEl || !tab) return;
        var val=tab.val;
        var sameTab=_getTab('val',val);
        if(sameTab){
            _selectTab(sameTab);// 选中已有项
        }else{
            !tab.txt && (tab.txt=tab.val);
            var txt=tab.txt
                ,remove=tab.remove || false;
            var cssStr='';
            var contStr, sScrolling;// 内容字符串
            if(tab.width) cssStr+='width:'+tab.width+';';
            var li=$('<li title="'+(typeof tab.title!='undefined'?tab.title:txt)+'" class="tab-head" data-val="'+val+'">'
                +'<div class="tab-head-item'+ (remove?' hasrig':'') +'" style="'+ cssStr +'">'
                +txt
                +(remove?'<div class="tab-head-remove"></div>':'')
                +'</div></li>');
            if(opts.headAlign=='right'){
                headBoxEl.children('ul').prepend(li);
            }else{
                headBoxEl.children('ul').append(li);
            }
            /* 内容部分 */
            if(tab.url){
                sScrolling = tab.scrolling === true ? 'yes' : 'no';
                if(tab.delay){
                    contStr = '<iframe width="100%" height="100%" data-name="' + tab.val + '"' +
                        ' frameborder="0" scrolling="' + sScrolling + '"></iframe>';
                }
                else{
                    contStr = '<iframe width="100%" height="100%" data-name="' + tab.val + '"' +
                        ' frameborder="0" scrolling="' + sScrolling + '" src="' + tab.url + '"></iframe>';
                }
            }else{
                contStr=tab.cont;
            }
            var contEl=contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]');
            if(contStr){
                if(contEl.length){
                    contEl.html(contStr);
                }else{
                    contBoxEl.append('<div class="tab-cont" data-val="'+val+'">'+contStr+'</div>');
                }
            }
            _tabs.push(tab);
            _calculateSizes(_tabs.length-1);
            _adjust();
            !noToggle && headBoxEl.find('>ul>li.tab-head[data-val="'+val+'"]').click();
        }
    };
    var _getTabs=function(key,value){
        var tabs=[], i, tab;
        if(key){
            for(i= 0;i<_tabs.length;i++){
                tab=_tabs[i];
                if(tab[key]==value){
                    tabs.push(tab);
                }
            }
        }else{
            $.extend(tabs,_tabs);
        }
        return tabs;
    };
    var _getTab=function(key,value){
        var i, tab;
        if(key){
            for(i= 0;i<_tabs.length;i++){
                tab=_tabs[i];
                if(tab[key]==value){
                    return tab;
                }
            }
        }
    };
    var _refreshTab=function(val){
        var contFrame=contBoxEl.find('>.tab-cont[data-val="'+val+'"]>iframe');
        if(contFrame.length) contFrame[0].contentWindow.location.reload();
    };
    var _selectTab=function(tab,val){
        if(typeof tab=='string' && val!=undefined){// 根据键值查找 tab
            tab=_getTab(tab,val);
        }
        if(!tab) return;
        var headEl=headBoxEl.find('>ul>li.tab-head[data-val="'+tab.val+'"]');
        if(!headEl.hasClass('now')){// tab 未选中
            var oldHeadEl=headBoxEl.find('>ul>li.tab-head.now'),// 16.09.27 添加离开 tab 页的事件
                oldVal,
                newContEl;
            if(oldHeadEl.length){
                oldVal=oldHeadEl.attr('data-val');//data-val
                if(opts.onLeave && opts.onLeave(oldVal)===false){// onLeave 返回 false，阻止离开原来选中的 tab 页 TODO onLeave 可能为异步操作
                    return;
                }
            }
            headBoxEl.find('>ul>li.tab-head.now').removeClass('now');
            contBoxEl.find('>.tab-cont.now').removeClass('now');
            headEl.addClass('now');
            newContEl=contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]');
            // 若定义了 url 且 iframe 未定义 src，则重置 url(实现切换时延迟加载页面)
            if(tab.url && !newContEl.find('iframe').attr('src')){
                newContEl.find('iframe').attr('src',tab.url)
            }
            newContEl.addClass('now');
            opts.onChange && opts.onChange(tab.val);
        }
        _scrollToSeL();
    };
    /**
     * 删除指定的 tab
     * @param tab {object|string}
     * @param val {string|boolean=}
     * @private
     */
    var _removeTab=function(tab,val){
        if(typeof tab=='string' && val!=undefined){// 键值对指定 tab
            tab=_getTab(tab,val);
            if(!tab) return;
        }
        var headEl=headBoxEl.find('>ul>li.tab-head[data-val="'+tab.val+'"]');
        if(headEl.hasClass('now') && _tabs.length>1){// 当前项为选中项，且还有其他标签页
            var i=_tabs.indexOf(tab);
            if(i!=_tabs.length-1){// 不是最后一项，选中后一项
                _selectTab(_tabs[i+1]);
            }else{
                _selectTab(_tabs[i-1]);
            }
        }
        var index=_tabs.indexOf(tab);
        _tabs.splice(index,1);// 移除
        tabSizes.splice(index,1);// 移除尺寸记录
        headEl.remove();// 移除标题
        if(!tab.keepcont){// 删除时不保留内容
            contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]').remove();
        }
        opts.onRemove && opts.onRemove(tab.val);
        _adjust();
    };
    /**
     * 删除全部 tab
     * @private
     */
    var _removeAll=function(){
        for(var i=_tabs.length-1;i>=0;i--){
            _removeTab(_tabs[i]);
        }
    };
    var contextVal;
    var _initContext=function(){
        var contEl=$('<div class="context"><ul>' +
            '<li data-val="closeThis"><span class="context-item">关闭当前页</span></li>' +
            '<li data-val="closeElse"><span class="context-item">关闭其他</span></li>' +
            '<li data-val="closeAll"><span class="context-item">关闭所有</span></li>' +
            '<li data-val="refresh"><span class="context-item">刷新</span></li>' +
            '</ul></div>');
        // 右键菜单
        contEl.on('click','li',function(){
            var type=$(this).attr('data-val');
            var tab,i,removeTabs=[];
            if(type=='closeThis'){
                removeTabs.push(_getTab('val',contextVal));
            }else if(type=='closeElse'){
                for(i=0;i<_tabs.length;i++){
                    tab=_tabs[i];
                    if(tab.val!=contextVal && tab.remove){// 不是当前项，且允许关闭
                        removeTabs.push(tab);
                    }
                }
            }else if(type=='closeAll'){
                for(i=0;i<_tabs.length;i++){
                    tab=_tabs[i];
                    if(tab.remove){// 允许关闭的项
                        removeTabs.push(tab);
                    }
                }
            }else if(type=='refresh'){
                _refreshTab(contextVal);
            }
            for(i=0;i<removeTabs.length;i++){
                _removeTab(removeTabs[i]);
            }
            contextMenu.close();
        });
        var contextMenu=headBoxEl.dropdown({
            cont:contEl
            ,context:true
            ,beforeShow:function(e){
                var headLi=$(e.target).closest('li');
                contEl.find('li').css('display','');
                if(headLi.length && headBoxEl.find(headLi).length>0){
                    contextVal=headLi.attr('data-val');
                    if(!_getTab('val',contextVal).remove){// 禁止关闭的tab页
                        contEl.find('li[data-val="closeThis"]').css('display','none');
                    }
                }else{// 不在tab页上，只显示关闭全部
                    contextVal=undefined;
                    contEl.find('li:not([data-val="closeAll"])').css('display','none');
                }
            }
        });
    };
    var _init=function(){
        el.addClass('tab-box');
        if(!headBoxEl.length){
            headBoxEl=$('<div class="tab-head-box clearf"><ul class="clearf"></ul>' +
                (opts.scroll?'<div class="tab-prev"></div><div class="tab-next"></div>':'') +
                '</div>');
        }
        if(!contBoxEl.length){
            contBoxEl=$('<div class="tab-cont-box"></div>');
        }
        headBoxEl
            .on('click.changeTab','>ul>li.tab-head',function(){
                var head=$(this);
                var val=head.attr('data-val');
                _selectTab('val',val);
            })
            .on('click.removeTab','.tab-head-remove',function(e){
                var tab=_getTab('val',$(this).closest('.tab-head').attr('data-val'));
                _removeTab(tab);
                e.stopPropagation();
            });
        if(opts.context){// 显示右键菜单
            _initContext();
        }
        tabGuid && $(window).on('resize.tab_'+tabGuid,_adjust);// 监听窗口 resize 事件
        el.prepend(headBoxEl);// 添加 head-box
        el.append(contBoxEl);// 添加 cont-box
        // 居右显示
        if(opts.headAlign=='right'){
            opts.scroll=false;// TODO 居右时暂不支持滚动
            headBoxEl.children('ul').addClass('tab-heads-r');
        }
        /* 根据 opts.tabs，添加 tab 页 */
        for(var i= 0;i<opts.tabs.length;i++){
            _addTab(opts.tabs[i],true);
        }
        // 显示添加
        if(opts.showAdd){
            headBoxEl.addClass('tab-withAdd');
            headBoxEl.append('<div class="tab-add" title="新增"></div>');
            opts.addHandler && headBoxEl.on('click.addTab','>.tab-add',function(){
                opts.addHandler();
            })
        }
        if(opts.scroll){
            headBoxEl.on('click.scroll','.tab-prev,.tab-next',function(){
                _scrollHead($(this).hasClass('tab-next'));
            });
        }
        //opts.onInit && opts.onInit(_returnObj); TODO 是否需要扩展
        if(opts.defaultVal!==false){// 定义为 false 时不选中任何 tab 页
            if(typeof opts.defaultVal=='undefined'){
                headBoxEl.find('li.tab-head').eq(0).click();// 默认选中第一项
            }else{
                headBoxEl.find('li.tab-head[data-val="'+opts.defaultVal+'"]').click();// 默认选中第一项
            }
        }
    };
    _returnObj={
        refreshTab: _refreshTab
        ,addTab: _addTab
        ,getTabs: _getTabs
        ,getTab: _getTab
        ,removeTab: _removeTab
        ,removeAll: _removeAll
        ,selectTab: _selectTab
        ,adjust:_adjust
        ,getSelect: function(){
            return _getTab('val',headBoxEl.find('>ul>li.now').attr('data-val'));
        }
        ,getContEl: function(tab){
            return contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]');
        }
    };
    _destroy();
    _init();
    return _returnObj;
};
/**
 * @widoc $.fn.dropdown
 * @namespace comp
 * @des 显示弹出层
 * @type function
 * @param {object} opts 弹出层配置参数
 * @param {object} opts.cont 弹出层的 dom 字符串或 jquery 对象
 * @param {string=} opts.pos 优先选择的弹出方向，默认为 'bottom-left'（贴下边和左边）
 * @param {boolean=} opts.adjust 是否允许弹出方向自适应，默认为 true
 * @param {boolean=} opts.noDestroy 关闭时是否仅隐藏，默认为 true，即关闭时不销毁弹窗
 * @param {boolean=} opts.show 初始化时是否直接打开，默认为 true
 * @param {boolean=} opts.modal 是否为模态遮罩层，默认为 true
 * @param {boolean=} opts.context 是否为右键触发弹出，默认为 false。当设置为 true 时，右键点击时显示，自动设置pos为bottom-left，adjust为true，show为false，modal为true。
 * @param {function()=} opts.beforeClose 关闭下拉框前的回调函数
 * @param {function()=} opts.beforeShow 显示下拉框前的回调函数，右键菜单显示时，传入参数 event
 * @return {object|undefined} obj 返回对象
 * @rtn {function} obj.show() 显示弹出框
 * @rtn {function} obj.close() 关闭弹出层
 * @rtn {function} obj.isShown() 是否已经打开
 */
$.fn.dropdown=function(opts){
    var el=$(this)// 弹出参照元素
        ,overlayEl// 弹出遮罩层
        ,dropdownEl;// 弹出内容主体
    opts=$.extend({
        cont:''
        ,pos:'bottom-left'
        ,adjust:true
        ,noDestroy:true
        ,show: true
        ,modal: true
        ,context: false
        ,beforeClose: $.noop
        ,beforeShow: $.noop
    },opts);
    if(opts.context){// 右键弹出
        opts.show=false;
        opts.adjust=true;
        opts.modal=true;
        opts.pos='bottom-left';
    }
    var _returnObj={};
    var _doc=$(document);
    var dpGuid=$.generateGuid('dp');
    var bScrolling=false,// 标记是否已经在滚动（为避免mousewheel及onscroll事件重复触发）
        oElBCR,// 记录触发滚动前参照元素原始位置，若滚动引起位置变化将关闭弹出层
        oChargeTimer;
    var fOnDocWheel=function(e){
        // retest 为 true 时，可能由于滚动默认行为还未执行，导致元素位置未发生改变，需要延迟 100ms（暂定） 重新计算
        var fChargeEl=function(retest){
            if(oChargeTimer){
                clearTimeout(oChargeTimer);
                oChargeTimer=undefined;
            }
            if(oElBCR){// dropdown 未隐藏时才需判断
                var oNewElBCR=el[0].getBoundingClientRect();
                if(oNewElBCR.left != oElBCR.left || oNewElBCR.top != oElBCR.top) {// 参照元素位置发生了变化
                    oElBCR = oNewElBCR;
                    _close();
                }else if(retest){
                    oChargeTimer=setTimeout(fChargeEl,100);
                }
            }
        };
        bScrolling=true;
        fChargeEl(true);
    };
    // document 捕获 scroll 事件，以便在下拉框外的其他元素发生滚动时根据 el 的位置决定是否需要隐藏下拉框
    var fOnDocScroll = function(e){
        var oNewElBCR;
        if(bScrolling){
            bScrolling=false;
        }else{
            oNewElBCR=el[0].getBoundingClientRect();
            if(oNewElBCR.left != oElBCR.left || oNewElBCR.top != oElBCR.top) {// 参照元素位置发生了变化
                oElBCR = oNewElBCR;
                _close();
            }
        }
    };
    var _addListener=function(){
        bScrolling=false;
        oElBCR=el[0].getBoundingClientRect();// 记录参照元素的初始位置
        // 由于 jquery 不支持捕获阶段的事件绑定，且 scroll 不会冒泡，因此只能使用原生方法在捕获阶段捕捉 scroll 事件
        // IE8 不支持捕获阶段的事件绑定，因此鼠标拖拽滚动条不会隐藏下拉框
        if(_doc[0].addEventListener){
            _doc[0].addEventListener('scroll', fOnDocScroll, true);
        }
        if(navigator.userAgent.indexOf("Firefox")>0){// 火狐浏览器
            _doc[0].addEventListener('DOMMouseScroll',fOnDocWheel,false);
        }else{// 其他浏览器
            _doc.on('mousewheel.dp'+dpGuid,fOnDocWheel);
        }
        // 点击关闭弹出层
        _doc.on('click.dpout'+dpGuid,function(e){
            var tarEl=$(e.target);
            if(e.type=='click'){// 点击在其他元素上
                if(tarEl.closest(el).length==0 && tarEl.closest('.overlay').length==0){
                    _close();
                }
            }
        });
        $(window).on('resize.dp'+dpGuid, _close);// 窗体发生 resize 时关闭弹出层
    };
    var _removeListener=function(){
        oElBCR=undefined;
        if(_doc[0].addEventListener){
            _doc[0].removeEventListener('scroll', fOnDocScroll, true);
        }
        if(navigator.userAgent.indexOf("Firefox")>0){// 火狐浏览器
            _doc[0].removeEventListener('DOMMouseScroll',fOnDocWheel);
        }else{// 其他浏览器
            _doc.off('mousewheel.dp'+dpGuid);
        }
        _doc.off('click.dpout'+dpGuid);
        $(window).off('resize.dp'+dpGuid);
    };
    var _close=function(){
        if(!overlayEl) return;
        opts.beforeClose();
        overlayEl.css('visibility','hidden');
        dropdownEl.css('visibility','hidden');
        if(!opts.noDestroy){
            _destroy();
        }
        _removeListener();
    };
    var _destroy=function(){
        if(!overlayEl) return;
        overlayEl.remove();
        overlayEl.off('click.dropdown');
        _removeListener();
    };
    var _show=function(e){
        if(!overlayEl || _isShown()) return;
        opts.beforeShow(e);
        //            if(!overlayEl.parent('body').length) $('body').append(overlayEl);
        overlayEl.css('visibility','hidden');
        var elBCR,adaptObj;
        if(e==undefined){
            elBCR=el[0].getBoundingClientRect();
        }else{
            elBCR={left: e.clientX,right:e.clientX,top:e.clientY,bottom: e.clientY};
        }
        adaptObj = $.adaptElement(elBCR,
            //, _doc.width(), _doc.height()
            // 以下为兼容 ie8，ie8 不支持 innerWidth、innerHeight；当主体元素是绝对定位时，会导致 body 高度为 0，因此多加 || Infinity
            (window.innerWidth||Math.min(document.documentElement.clientWidth,document.body.clientWidth||Infinity))-WICONF.scrollsize,
            (window.innerHeight||Math.min(document.documentElement.clientHeight,document.body.clientHeight||Infinity))-WICONF.scrollsize,
            dropdownEl.outerWidth(), dropdownEl.outerHeight(),
            opts.pos, opts.adjust);
        var cssObj = adaptObj[0];
        cssObj['visibility']='';
        if(!opts.context){
            var pos0 = adaptObj[1].split('-')[0];
            // TODO 可能内容宽度比 miniWidth 小
            if(pos0 == 'top' || pos0 =='bottom'){
                cssObj['min-width']=el.outerWidth()+'px'
            }else{
                cssObj['min-height']=el.outerHeight()+'px'
            }
        }
        dropdownEl.css(cssObj);
        overlayEl.css('visibility','');
        //if(!opts.modal){// 非模态时在组件外滚动关闭下拉框
        _addListener();
        //}
    };
    var _init=function(){
        overlayEl=$('<div class="overlay'+(opts.modal ? ' overlay-modal':'')+'" style="visibility:hidden;"></div>');// 是否是模态弹出层
        dropdownEl=$('<div class="dropdown-box" style="visibility:hidden;"></div>');// 调节位置后显示
        dropdownEl.append(opts.cont);
        overlayEl.append(dropdownEl);
        if(opts.context){// 右键菜单
            el.on('contextmenu',function(e){
                e.preventDefault();// 禁用浏览器右键菜单
                _show(e);
            });
        }
        opts.modal && overlayEl.on('click.dropdown',function(e){// 模态弹出层点击遮罩层关闭
            if($(e.target).parent('body').length>0){
                _close();
            }
        });
        if(!overlayEl.parent('body').length) $('body').append(overlayEl);
        opts.show!=false && _show();
    };
    var _isShown=function(){
        return dropdownEl.css('visibility')!='hidden';
    };
    _returnObj.show=_show;
    _returnObj.close=_close;
    _returnObj.destroy=_destroy;
    _returnObj.isShown=_isShown;
    _destroy();
    _init();
    return _returnObj;
};
/**
 * @widoc $.fn.initSelNum
 * @namespace comp
 * @des 初始化 numbox
 * @type function
 * @param {object} opts 配置参数
 * @param {int} opts.maxVal 控件支持的最大值 TODO 小数的支持
 * @param {int} opts.minVal 控件支持的最小值 TODO 小数的支持
 * @param {string} opts.name 控件中文本框的 name 值
 * @param {int} opts.value 初始化时的值
 * @param {int} opts.enable 初始化时是否启用，默认为 true
 * @param {function(val)} opts.onChange 值变化时的回调方法
 * @return {object} obj 接口对象
 * @rtn {function} obj.setVal(val) 为文本框赋值（val {int}）
 * @rtn {function} obj.setEnable(enable) 禁用/启用（enable {boolean}）
 */
$.fn.initSelNum=function(opts){
    var $this = this;
    opts = $.extend({
        //maxVal:0, //最大值
        minVal:0, //最小值
        name:'', //其中文本框对应的 name
        enable:true,
        //value, //初始化时的值，默认为最小值
        step:1
    },opts);
    var iCurVal,//保存当前值
        step=opts.step,
        jqTxt;
    var returnObj;
    // 初始化方法
    function _init(){
        $this.addClass('numbox');
        var str = '<input type="text" class="numbox-txt"'+(opts.name ? ' name="'+opts.name+'"' : '')+'/>' +
            '<div class="numbox-wrap"><span class="numbox-up"></span><span class="numbox-down"></span></div>';
        $this.append(str);
        jqTxt=$this.find('.numbox-txt');
        $this.find('.numbox-up,.numbox-down').on('click',clickFn);
        jqTxt.on({
            keydown:keydownFn,
            change:changeFn
        });
        _setVal(opts.value);// 赋初始值
        _setEnable(opts.enable);
    }
    function _setMinVal(val){
        var nVal=parseInt(val,10);// 先转换为整数
        if(nVal!==opts.minVal){
            opts.minVal=nVal;
            _setVal(iCurVal);
        }
    }
    function _setEnable(enable){
        opts.enable=enable;
        if(enable){// 启用
            $this.removeClass('disabled');
            jqTxt.prop('disabled',false);
        }else{
            $this.addClass('disabled');
            jqTxt.prop('disabled',true);
        }
    }
    function _getVal(){
        return iCurVal;
    }
    // 为文本框赋值（先判断值是否合法）
    function _setVal(val){
        val=parseInt(val,10);
        if(isNaN(val) || val<opts.minVal){
            val = opts.minVal;
        }else if(val > opts.maxVal){
            val = opts.maxVal;
        }
        if(val != parseInt(jqTxt.val(),10)){
            jqTxt.val(val);
        }
        if(val != iCurVal){// 值发生变化
            iCurVal = val;
            opts.onChange && opts.onChange(parseInt(iCurVal,10));
        }
    }
    //上下箭头点击函数
    function clickFn(event){
        if(!opts.enable) return;
        _setVal( $(this).hasClass('numbox-up') ? iCurVal+step : iCurVal-step);
    }
    // 键盘抬起事件 - 将当前文本框内容值更新到组件
    function changeFn(event){
        if(!opts.enable) return;
        _setVal( parseInt(jqTxt.val(),10));
    }
    //键盘按下事件
    function keydownFn(event){
        if(!opts.enable) return;
        var code = event.which;
        if (code == 38) {// 加step
            _setVal(iCurVal+step);
        } else if (code == 40) {// 减step
            _setVal(iCurVal-step);
        }else if(!(code >= 96 && code <= 105
            || code >= 48 && code <= 57
            || code == 37 || code ==39 // 左右键
            || code == 8 // 退格
                /* ||code == 110 ||  code == 190小数点*/)){// TODO 小数点、负数
            return false;
        }
        // 数字按键引起的数据变化在 keyup 中执行
    }
    returnObj={
        setVal:_setVal,
        setMinVal:_setMinVal,
        getVal:_getVal,
        setEnable:_setEnable
    };
    /* 初始化开始 */
    _init();
    return returnObj;
};
/**
 * @widoc $.fn.initDropSel
 * @namespace comp
 * @des 初始化下拉复选框（禁止输入），调用此方法的文本框不需定义 name，即使定义也不可与 opts.name 相同
 * @type function
 * @param {object} opts 配置参数
 * @param {string} opts.name 必须，下拉框中复选/单选元素的 name 属性值，初始化完成后，会在 el 后生成 <input type="hidden" name="name" />，以便表单取值
 * @param {Array} opts.data 必须，选项数据源
 * @param {string=} opts.txtField data 中每个数据显示的字段名称，默认为 'name'
 * @param {string=} opts.valField data 中每个数据值的字段名称，默认为 'val'
 * @param {object} opts.filter 过滤功能配置，定义此属性后将开启过滤，生成过滤文本框
 * @param {string|Array} opts.filter.fields 参与过滤的列的属性名，对应 cols[i].field
 * @param {boolean} opts.filter.pySupport 是否支持拼音首字过滤，开启过滤时，默认为 true
 * @param {boolean} opts.filterPrepose 是否将匹配的过滤项前置，开启过滤时，默认为 false，设为 true 将增加 dom 操作，引起资源的消耗
 * @param {int=} opts.width 弹出框的宽度，单位：px，默认为 205（css 中由.dropSel 决定）
 * @param {int=} opts.height 默认最大高度为 120，单位：px
 * @param {boolean=} opts.mulChk 是否为复选，默认为 true
 * @param {Array=} opts.selParams 默认选中项条件 [key,value]，其中 value 支持 Array
 * @param {function(selData)=} opts.callback 值改变时的回调方法
 *       selData 单选时为选中项的数据对象，无选中则为 undefined；多选时为选中对象数组，无选中则为 []
 * @param {object} opts.dpOpts 下拉弹出框的初始参数，参考 $.fn.dropdown(opts)
 *       其中部分参数默认值不同：
 *         opts.dpOpts.modal 默认值为 false，即默认为非模态下拉框。
 *       其中部分参数失效：
 *         opts.dpOpts.cont 组件自动生成
 *         opts.dpOpts.noDestroy 始终为 true
 *         opts.dpOpts.show 始终为 false
 *         opts.dpOpts.beforeClose 组件中处理
 *         opts.dpOpts.beforeShow 组件中处理
 * @param {string} opts.cusCls 附加在弹出层 dropdown dropSel 层的用户自定义样式名
 * @return {object} obj 返回对象
 * @rtn {function} obj.setData(data,selParams) 重置数据源及默认选中项
 * @rtn {function} obj.getSelect() 获取选中项，返回值：selData 单选时为选中项的数据对象，无选中则为 undefined；多选时为选中对象数组，无选中则为 []
 * @rtn {function} obj.check(key,val,check) 改变符合条件的数据源的选中状态，并更新到 dom 和 selIdx
 *       key {string=} 键
 *       val {string|Array|undefined=} 值
 *       check {boolean=} 选中 true / 取消选中 false，默认为 true
 */
$.fn.initDropSel=function(opts){
    var CONF={emptyH:32};// 没有选项时的高度
    var el=$(this);// 触发下拉的元素
    opts=$.extend({
        //width:0,// 弹出框的宽度
        height:150 // 默认高度为 150px
        ,mulChk:true // 默认为复选
        //            ,name:'' // 必须，下拉框中复选/单选元素的 name 属性值，初始化完成后，会在 el 后生成 <input type="hidden" name="name" />，以便表单取值
        ,data:[] // 数据源
        ,txtField:'name' // data 中每个数据显示的字段名称
        ,valField:'val' // data 中每个数据值的字段名称
        //,filter:{} // 过滤配置
        ,filterPrepose:false// 开启过滤时，是否将过滤匹配项前置
        ,dpOpts:{}// dropdown 扩展配置
        ,cusCls:''// 给dropdown dropSel层添加class，用于自定义样式
        //        ,selParams: [key,value] // 第一次弹出的选中项条件[key,value]，value 支持数组
        //        ,callback: function(selData) // 确定按钮的回调，单选时为选中项的数据对象，无选中则为 undefined；多选时为选中对象数组，无选中则为 []
    },opts);
    var guid=$.generateGuid('dropSel');
    !opts.name && (opts.name=guid);
    var hideEl;// 隐藏元素，用于表单取值
    var _data
        ,returnObj;// 返回对象
    var dpObj// dropdown 返回接口
        ,_filterObj// 过滤组件返回接口对象
        ,dpEl// 下拉弹出层 jquery 对象
        ,selIdx=[];// 选中的项的索引
    // 根据 dom 选中状态获取选中项
    var _refreshSelIdx=function(){
        selIdx.length=0;
        var chkEls=dpEl.find('[name="'+opts.name+'"]:checked');
        var txtField=opts.txtField
            ,valField=opts.valField;
        var txtArr=[],valArr=[],dataArr=[];// 选中项文本，值，数据
        var len=opts.mulChk?chkEls.length:Math.min(chkEls.length,1);
        for(var i= 0,dataI;i<len;i++){
            dataI=parseInt(chkEls.eq(i).val(),10);
            selIdx.push(dataI);
            txtArr.push(_data[dataI][txtField]);
            valArr.push(_data[dataI][valField]);
            dataArr.push(_data[dataI]);
        }
        el.val(txtArr.join(';'));
        el.attr('title',txtArr.join(';'));
        hideEl.val(valArr.join(';'));
        opts.callback && opts.callback(opts.mulChk?dataArr:dataArr[0]);// 修改选中项时的回调
    };
    var _getSelect=function(){
        var selData=[];
        for(var i= 0;i<selIdx.length;i++){
            selData.push(_data[selIdx[i]]);
        }
        return opts.mulChk ? selData : selData[0];
    };
    // 根据 selIdx 选中 dom
    var _checkDom=function(){
        var chkEls=dpEl.find('[name="'+opts.name+'"]');
        chkEls.prop('checked',false);
        for(var i= 0,dataI;i<selIdx.length;i++){
            dataI=selIdx[i];
            chkEls.filter('[value="'+dataI+'"]').prop('checked',true);
        }
    };
    /**
     * 改变符合条件的数据源的选中状态，并更新到 dom 和 selIdx
     * @param key {string=} 键
     * @param val {string|Array|undefined=} 值
     * @param check {boolean=} 选中 true / 取消选中 false，默认为 true
     * @private
     */
    var _check=function(key,val,check){
        var chkEls=dpEl.find('[name="'+opts.name+'"]');
        if(check==undefined) check=true;
        var valIsArr=(Object.prototype.toString.call(val) === '[object Array]');// 是否是数组
        for(var i= 0,item;i<_data.length;i++){
            item=_data[i];
            if(!valIsArr && item[key]==val || valIsArr && val.indexOf(item[key])!=-1){
                chkEls.filter('[value="'+i+'"]').prop('checked',check);
            }
        }
        _refreshSelIdx();
    };
    // 复选时的按钮操作：全选 true / 全不选 false - 只供组件内按钮操作，不刷新选中项索引列表（点取消时不保存）
    var _checkAll=function(check){
        if(!opts.mulChk) return;
        var chkEls=dpEl.find('[name="'+opts.name+'"]');
        chkEls.prop('checked',check);
    };
    // 修改数据源并根据 selParams 重置默认选中值
    var _setData=function(data,selParams){
        if(data) _data=$.extend([],data);
        var str='';
        var inputType = opts.mulChk ? 'checkbox' : 'radio'
            ,name=opts.name
            ,txtField=opts.txtField;
        for(var i= 0,opt;i<_data.length;i++){
            opt=_data[i];
            str+='<li><label class="dropSel-label"><input type="'+inputType+'" name="'+name+'" value="'+i+'" />'+$.encodeHtml(opt[txtField])+'</label></li>';
        }
        dpEl.find('ul.dropSel-ul').html(str);
        if(_filterObj){// 更新过滤组件数据源
            _filterObj.setData(_data);
        }
        if(selParams){
            _check(selParams[0],selParams[1],true);
        }else{
            _refreshSelIdx();// 直接刷新 selIdx
        }
    };
    var _init=function(){
        var oFilterOpts = opts.filter;
        // 下拉框内容主体字符串
        var getDropStr=function(){
            var str='<div class="dropdown dropSel '+ opts.cusCls +'">';
            var boxH=opts.height-CONF.emptyH,
                boxW=opts.width;
            if(oFilterOpts){
                boxH-=30;
                str+='<input class="dropSel-filter" value="" />';
            }
            str+='<div class="dropSel-box" style="'+(boxW?'width:'+boxW+'px;':'')+'height: '+boxH+'px;"><ul class="dropSel-ul"></ul></div>'+
                '<div class="dropSel-tool">';
            if(opts.mulChk){
                str+='<button class="dropSel-btn" style="float:left;" data-val="all">全选</button>'+
                    '<button class="dropSel-btn" style="float:left;margin-left:2px;" data-val="allno">清空</button>';
            }
            str+='<button class="dropSel-btn" style="margin-left:2px;" data-val="close">取消</button>'+
                '<button class="dropSel-btn dropSel-btn-success" data-val="enter">确定</button>'+
                '</div></div>';
            return str;
        };
        // 下拉框中的内容部分
        dpEl=$(getDropStr());
        if(oFilterOpts){
            !oFilterOpts.fields && (oFilterOpts.fields=opts.txtField);
            _filterObj=dpEl.find('.dropSel-filter').initFilter($.extend({
                data:_data
                ,afterFilter:function(newData,keyword){// 高亮
                    var jqUl = dpEl.find('.dropSel-ul'),
                        jqsChk = jqUl.find('[name="'+opts.name+'"]'),
                        sHighCls = 'dropSel-high';// 高亮样式
                    var i,len,jqLi;
                    dpEl.find('li').removeClass(sHighCls);// 移除全部高亮样式
                    if(opts.filterPrepose){// 需要前置匹配项
                        for(i=0, len=_data.length; i<_data.length; i++){
                            jqUl.append( jqsChk.filter('[value="'+i+'"]').closest('li'));
                        }
                        if(keyword!=''){// 关键字非空，过滤匹配的元素提前，由于使用 prepend，所以从匹配的最后一项开始遍历并插入 dom，以保证显示顺序
                            for(i=newData.length-1;i>=0;i--){
                                jqLi = jqsChk.filter('[value="'+_data.indexOf(newData[i])+'"]').closest('li');
                                jqLi.addClass(sHighCls);
                                jqUl.prepend(jqLi);
                            }
                        }
                    }else{// 不需要前置，直接高亮匹配项
                        if(keyword!=''){
                            for(i=0,len=newData.length;i<len;i++){
                                dpEl.find('[value="'+_data.indexOf(newData[i])+'"]').closest('li').addClass('dropSel-high');
                            }
                        }
                    }
                }
            },opts.filter));
        }
        hideEl=$('<input type="hidden" name="'+opts.name+'" />');
        el.prop('readonly',true)// 禁止输入
          .attr('autocomplete','off')
          .after(hideEl);// 添加隐藏域
        _setData(opts.data,opts.selParams);
        dpEl.on('click.dpSel','[data-val]',function(){// 操作按钮
            if(!dpObj) return;
            var ctrlVal=$(this).attr('data-val');
            if(ctrlVal=='enter'){// 确定 - 获取选中值，然后关闭
                _refreshSelIdx();
                dpObj.close();
            }else if(ctrlVal=='close'){// 取消 - 还原选中状态，然后关闭
                dpObj.close();
            }else if(ctrlVal=='all'){// 全选
                _checkAll(true);
            }else if(ctrlVal=='allno'){// 不选
                _checkAll(false);
            }
        });
        dpObj=el.dropdown($.extend(
            {
                modal: false
            },
            opts.dpOpts,
            {
                cont: dpEl,
                noDestroy: true,
                show: false,
                beforeClose: function(){
                    _checkDom();
                },
                beforeShow: $.noop
            }
        ));
        el.off('click.showDp').on('click.showDp',function(){
            if(dpObj && !dpObj.isShown()) dpObj.show();
        });
    };
    returnObj={
        getSelect:_getSelect,// 获取选中值，单选时返回对象，多选时返回数组
        check:_check,// 改变符合条件的数据源的选中状态，并更新到 dom 和 selIdx
        setData:_setData// 重置数据源
    };
    _init();
    return returnObj;
};
/**
 * @widoc $.fn.initDropList
 * @namespace comp
 * @des 初始化单选下拉列表，调用此方法的文本框不需定义 name，即使定义也不可与 opts.name 相同
 * @type function
 * @param {object} opts 配置项
 * @param {string} opts.name 必须，下拉框中复选/单选元素的 name 属性值，初始化完成后，会在 el 后生成 <input type="hidden" name="name" />，以便表单取值
 * @param {object} opts.filter
 * @param {string|Array} opts.filter.fields 要检索的键
 * @param {boolean} opts.filter.pySupport 是否支持拼音首字过滤，开启过滤时，默认为 true
 * @param {Array} opts.data 必须，选项数据源
 * @param {string=} opts.txtField data 中每个数据显示的字段名称，默认为 'name'
 * @param {string=} opts.valField data 中每个数据值的字段名称，默认为 'val'
 * @param {int=} opts.width 弹出框的宽度，单位：px，默认为 205（css 中由.dropSel 决定）
 * @param {int=} opts.maxCount 最多显示几条记录，默认为 5
 * @param {Array=} opts.selParams 默认选中项条件 [key,value]
 * @param {function(selData)=} opts.callback 值改变时的回调方法
 * - selData 选中项的数据对象，无选中则为 undefined
 * @param {object} opts.dpOpts 下拉弹出框的初始参数，参考 $.fn.dropdown(opts)
 *       其中部分参数默认值不同：
 *         opts.dpOpts.modal 默认值为 false，即默认为非模态下拉框。
 *       其中部分参数失效：
 *         opts.dpOpts.cont 组件自动生成
 *         opts.dpOpts.noDestroy 始终为 true
 *         opts.dpOpts.show 始终为 false
 *         opts.dpOpts.beforeClose 组件中处理
 *         opts.dpOpts.beforeShow 组件中处理
 * @return {object} obj 返回对象
 * @rtn {object} obj.setData(data,selParams) 重置数据源及默认选中项
 * @rtn {object} obj.getSelect() 获取选中项，返回值：selData 选中项的数据对象，无选中则为 undefined
 * @rtn {object} obj.check(key,val) 选中符合条件的数据
 *       key {string=} 键
 *       val {string|undefined=} 值
 */
$.fn.initDropList=function(opts){
    var CONF={
        dplistLiH:25
    };
    var el=$(this);// 触发下拉的元素
    opts=$.extend({
        //            filter:{} // 显示检索框，其他接口后续开放
        //            ,name:'' // 必须，下拉框中复选/单选元素的 name 属性值，初始化完成后，会在 el 后生成 <input type="hidden" name="name" />，以便表单取值
        //width:0,// 弹出框的宽度
        maxCount:5 // 最多显示 5 条记录
        ,data:[] // 数据源
        ,txtField:'name' // data 中每个数据显示的字段名称
        ,valField:'val' // data 中每个数据值的字段名称
        ,dpOpts:{}// dropdown 扩展配置
        //        ,selParams: [key,value] // 第一次弹出的选中项条件[key,value]，value 支持数组
        //        ,callback: function(selData) // 确定按钮的回调，单选时为选中项的数据对象，无选中则为 undefined；多选时为选中对象数组，无选中则为 []
    },opts);
    var guid=$.generateGuid('dropSel');
    !opts.name && (opts.name=guid);
    var hideEl;// 隐藏元素，用于表单取值
    var _data,returnObj;// 返回对象
    var dpObj// dropdown 返回接口
        ,dpEl// 下拉弹出层 jquery 对象
        ,_filterObj
        ,selData;// 选中的项
    //        var keyword;// 记录当前关键字
    var _getSelect=function(){
        return selData;
    };
    // 只改变选中项，不修改文本框
    var _setSelData=function(item){
        selData=item;
        if(!item){
            hideEl.val('');
        }else{
            hideEl.val(item[opts.valField]);
        }
    };
    // 选中指定对象
    var _checkItem=function(item){
        _setSelData(item);
        if(!item){
            el.val('');
        }else{
            el.val(item[opts.txtField]);
        }
        opts.callback && opts.callback(item);
        if(opts.filter && _filterObj){
            _filterObj.filter(selData && selData[opts.txtField] ? selData[opts.txtField] : '');
        }
    };
    /**
     * 改变符合条件的数据源的选中状态，并更新到 dom 和 selIdx
     * @param key {string=} 键
     * @param val {string|undefined=} 值
     * @private
     */
    var _check=function(key,val){
        if(key){
            for(var i= 0,item;i<_data.length;i++){
                item=_data[i];
                if(item[key]==val){
                    _checkItem(item);
                    return;
                }
            }
        }
        _checkItem();// 默认清空选项
    };
    var visibleData;// 要显示的所有数据
    var curPage// 当前显示数据位于第几页（visibleData 中 0 开始）
        ,curIndex;// 当前高亮数据索引（visibleData 中 0 开始）
    var _setVisibleData=function(data){
        var toolEl=dpEl.find('.dropSel-tool');
        visibleData=data;
        if(visibleData.length>opts.maxCount){// 一页无法显示，启用翻页，不能隐藏，否则弹出后过滤可能造成高度变化
            toolEl.find('button').prop('disabled',false);
        }else{
            toolEl.find('button').prop('disabled',true);
        }
        _chargeList();
    };
    // 修改数据源并根据 selParams 重置默认选中值
    var _setData=function(data,selParams){
        if(data) _data= $.extend([],data);
        var str='';
        var txtField=opts.txtField;
        var valField=opts.valField;
        for(var i= 0,item;i<_data.length;i++){
            item=_data[i];
            str+='<li data-i="'+item[valField]+'">'+$.encodeHtml(item[txtField])+'</li>';
        }
        dpEl.find('ul.dplist-box').html(str);
        if(_filterObj){// 更新过滤组件数据源
            _filterObj.setData(_data);
        }
        if(data){// 重置数据源，需要同步更新选中项
            if(selParams){
                _check(selParams[0],selParams[1]);
            }else{
                _check();
            }
        }
    };
    // 根据 curPage 刷新当前显示的数据列表
    // selI 若未定义，则选中当页第一项
    var _chargeList=function(pageI,selI){
        dpEl.find('li').removeClass('now active');
        if(visibleData.length){
            var count=opts.maxCount;
            var valField=opts.valField;
            if(pageI==undefined){// 未定义页码
                pageI = selI!=undefined ? // 定义了高亮行则据此计算页码，否则为 0
                    Math.floor(selI/count) : 0;
            }
            curPage=pageI;
            var start = pageI*opts.maxCount// 开始索引
                ,end = Math.min(start+count,visibleData.length);// 结束索引
            if(selI==undefined || selI < start || selI > end){
                selI=start;
            }
            // 开始翻页及高亮处理
            for(var i=start,item;i<end;i++){
                item=visibleData[i];
                dpEl.find('li[data-i="'+item[valField]+'"]').addClass('now');
            }
        }else{
            curPage=undefined;
            selI=undefined;
        }
        _setActiveItem(selI);
    };
    var _setActiveItem=function(i){
        curIndex=i;
        if(curIndex!=undefined){
            dpEl.find('li[data-i="'+visibleData[curIndex][opts.valField]+'"]').addClass('active');
        }
        el.focus();
    };
    // 向前翻页
    var _flipPrev=function(){
        _chargeList(curPage>0 ? curPage-1 : Math.ceil(visibleData.length/opts.maxCount)-1);
    };
    // 向后翻页
    var _flipNext=function(){
        _chargeList(curPage < Math.ceil(visibleData.length/opts.maxCount)-1 ? curPage+1 : 0);
    };
    var _initDp=function(){
        var str='<div class="dropdown dropSel dropList">';
        var boxW=opts.width;
        str+='<div class="dropSel-box" style="'+(boxW?'width:'+boxW+'px;':'')+'height:'+(opts.maxCount*CONF.dplistLiH)+'px"><ul class="dplist-box"></ul></div>'+
            '<div class="dropSel-tool">' +
            '<button class="dropSel-btn" style="float:left;" data-val="prev">上页</button>'+
            '<button class="dropSel-btn" data-val="next">下页</button>'+
            '</div></div>';
        // 下拉框中的内容部分
        dpEl=$(str);
        dpEl
            .on('click.dpSel','.dropSel-tool [data-val]',function(){// 操作按钮
                if(!dpObj) return;
                var ctrlVal=$(this).attr('data-val');
                if(ctrlVal=='prev'){// 上一页
                    _flipPrev();
                }else if(ctrlVal=='next'){// 下一页
                    _flipNext();
                }
            })
            .on('click.choose','li',function(){// 点选数据
                _check(opts.valField, $(this).attr('data-i'));
                dpObj.close();
            });
        dpObj=el.dropdown($.extend(
            {
                modal: false
            },
            opts.dpOpts,
            {
                cont: dpEl,
                noDestroy: true,
                show: false,
                beforeShow:function(){
                    opts.filter && _setVisibleData(_data);
                },
                beforeClose: function(){
                    if(!selData || el.val() != selData[opts.txtField]) _checkItem();// 值与当前选中项不匹配，置空
                }
            }
        ));
    };
    var _init=function(){
        hideEl=$('<input type="hidden" name="'+opts.name+'" />');
        el.attr('autocomplete','off')
          .after(hideEl);// 添加隐藏域
        _initDp();
        _setData(opts.data);
        el.prop('readonly',!opts.filter);// 支持过滤时允许写入
        if(opts.filter){
            !opts.filter.fields && (opts.filter.fields=opts.txtField);
            _filterObj=el.initFilter($.extend({// 打开前需手动过滤
                data:_data
                ,afterFilter:function(newData,keyword){
                    if(selData && selData[opts.txtField].toLocaleUpperCase()!=keyword){
                        _setSelData();// 置空
                    }
                    _setVisibleData(newData);
                }
            },opts.filter));
        }else{
            _setVisibleData(_data);
        }
        var selParams=opts.selParams;
        if(selParams){
            _check(selParams[0],selParams[1]);
        }else{
            _check();
        }
        el.off('click.showDp').on('click.showDp',function(){
            if(!dpObj) return;
            if(opts.filter){// 点击显示列表
                !dpObj.isShown() && dpObj.show();
            }else{// 不支持过滤时，点击切换显示状态
                dpObj.isShown() ? dpObj.close() : dpObj.show();
            }
        });
        el.off('keydown.dpList').on('keydown.dpList',function(e){// 文本框的键盘监听
            var which= e.which;
            if(!dpObj) return;
            if(which==13){// 回车
                if(dpObj.isShown()){
                    _checkItem(visibleData[curIndex]);
                    dpObj.close();
                }else{
                    dpObj.show();
                }
            }else if(which==9){// 失焦关闭
                if(dpObj.isShown()){
                    dpObj.close();
                }
            }else{
                if(!dpObj.isShown()){
                    dpObj.show();
                }else{
                    if (which == 38) {// 上
                        _chargeList(undefined, curIndex == 0 ? visibleData.length - 1 : curIndex - 1);
                        e.preventDefault();
                    } else if (which == 40) {// 下
                        _chargeList(undefined, curIndex == visibleData.length - 1 ? 0 : curIndex + 1);
                        e.preventDefault();
                    }
                }
            }
        });
    };
    returnObj={
        getSelect:_getSelect,// 获取选中值，单选时返回对象，多选时返回数组
        check:_check,// 改变符合条件的数据源的选中状态，并更新到 dom 和 selIdx
        setData:_setData// 重置数据源
    };
    _init();
    return returnObj;
};
/**
 * @widoc $.fn.initDropTree
 * @namespace comp
 * @des 初始化下拉树组件，调用此方法的文本框不需定义 name，即使定义也不可与 opts.name 相同
 * @type function
 * @param {object} opts
 * @param {string} opts.name 必须，初始化完成后，会在 el 后生成 <input type="hidden" name="name" />，以便表单取值
 * @param {string=} opts.txtField 数据显示在文本框中的字段名称，同时作为下拉树中的显示字段，默认为 'name'
 * @param {string=} opts.valField 数据值的字段名称，用于表单取值，默认为 'val'
 * @param {int=} opts.width 弹出树的宽度，单位：px，默认为 205（css 中由.dropSel 决定）
 * @param {int=} opts.height 默认最大高度为 150，单位：px
 * @param {boolean=} opts.mulChk 是否为复选，默认为 false
 * @param {object} opts.filter 过滤功能配置，未定义时不支持过滤
 * @param {string|Array} opts.filter.fields 参与过滤的属性名，默认为 opts.txtField
 * @param {boolean} opts.filter.pySupport 是否支持拼音首字过滤，开启过滤时，默认为 true
 * @param {boolean} opts.filter.hide 是否隐藏不符合过滤条件的节点，默认为 false，复选时此属性无效
 * @param {Array=} opts.selParams 默认选中项条件 [key,value]，其中 value 支持 Array
 * @param {boolean=} opts.initTrigger 初始化时是否触发 callback（新增），默认为 true
 * @param {object} opts.treeOpts 下拉弹出的树的初始化参数，参考 $.fn.initZTree(opts)
 *       其中部分参数默认值不同：
 *         opts.treeOpts.initSelect 默认值为 false，即单选时若无匹配选中项，不默认选中
 *       其中部分参数失效：
 *         opts.treeOpts.filterEl（若定义了 opts.treeOpts.filter，则自动指向下拉弹出的搜索框）
 *         opts.treeOpts.filter 由 opts.treeOpts.filter 决定
 *         opts.treeOpts.multi 由 opts.mulChk 决定
 *         opts.treeOpts.selParams 由 opts.selParams 决定
 *         opts.treeOpts.key.name 由 opts.txtField 决定
 * @param {object} opts.dpOpts 下拉弹出框的初始参数，参考 $.fn.dropdown(opts)
 *       其中部分参数默认值不同：
 *         opts.dpOpts.modal 默认值为 false，即默认为非模态下拉框。
 *       其中部分参数失效：
 *         opts.dpOpts.cont 组件自动生成
 *         opts.dpOpts.noDestroy 始终为 true
 *         opts.dpOpts.show 始终为 false
 *         opts.dpOpts.beforeClose 组件中处理
 *         opts.dpOpts.beforeShow 组件中处理
 * @param {function(selData)=} opts.chkselFilter  mulChk=true时生效，修改选中项后对需显示的选中项过滤，返回真正的选中值
 * @param {function(selData)=} opts.callback 值改变时的回调方法
 *       selData 单选时为选中项的数据对象，无选中则为 undefined；多选时为选中对象数组，无选中则为 []
 * @return {object} obj 返回对象
 * @rtn {function} obj.setSel(selParams,clear,trigger): 设置选中项，类似 initZTree 方法中的 setSel(selParams,clear)
 *      -   trigger {boolean=} 是否触发 callback，默认为 true
 * @rtn {function} obj.resetTree(url,urlArgs,selParams): 重置数据源，同 initZTree 方法中的 reset(url,urlArgs,selParams)
 * @rtn {function} obj.resetTree(data,selParams): 重置数据源，同 2.3.11 initZTree 方法中的 reset(data,selParams)
 * @rtn {function} obj.getTreeObj 获取当前下拉树的对象，返回值即为 2.3.11 initZTree 的返回值 obj
 */
$.fn.initDropTree=function(opts){
    var CONF={emptyH:2};// 没有选项时的高度
    var el=$(this);// 触发下拉的元素
    opts=$.extend({
        txtField:'name', // data 中每个数据显示的字段名称
        valField:'val', // data 中每个数据值的字段名称
        //name:'', // 必须，下拉框中复选/单选元素的 name 属性值，初始化完成后，会在 el 后生成 <input type="hidden" name="name" />，以便表单取值
        //width:0,// 弹出树的宽度
        height:150, // 默认高度为 150px
        mulChk:false, // 默认为单选
        //filter: {},
        //selParams: [key,value],// 第一次弹出的选中项条件[key,value]，value 支持数组
        initTrigger:true,// 初始化时是否触发 callback，同时将影响 resetTree 后的
        //chkselFilter:function(selData),// mulChk=true时生效，修改选中项后对需显示的选中项过滤，返回真正的选中值(为解决允许勾选父级以全选子节点，但不允许父级作为选中项)
        //callback: function(selData),// 确定按钮的回调，单选时为选中项的数据对象，无选中则为 undefined；多选时为选中对象数组，无选中则为 []
        treeOpts:{},
        dpOpts:{}// dropdown 扩展配置
    },opts);
    var bTrigger;// 是否触发 callback 回调
    var guid=$.generateGuid('dropTree');
    !opts.name && (opts.name=guid);
    var hideEl;// 隐藏元素，用于表单取值
    var returnObj={};// 返回对象
    var dpObj// dropdown 返回接口
        ,dpEl// 下拉弹出层 jquery 对象
        ,_treeObj;// 树对象
    var _setInputVal=function(){
        if(!_treeObj) return;
        var selData=_treeObj.getSelectedNodesNoHalf();
        var txtField=opts.txtField
            ,valField=opts.valField;
        var txtStr='',valStr='';
        if(opts.mulChk && opts.chkselFilter){// 仅在多选时处理，单选请使用 treeOpts.selector 实现
            selData = opts.chkselFilter(selData);
        }
        if(selData){
            var selDatas = opts.mulChk ? selData : [selData];
            for(var i=0,node,len=selDatas.length;i<len;i++){
                node=selDatas[i];
                if(valStr){
                    txtStr+=';';
                    valStr+=';';
                }
                txtStr+=node[txtField];
                valStr+=node[valField];
            }
        }
        hideEl.val(valStr);
        el.val(txtStr);
        el.attr('title',txtStr);
        if(bTrigger){
            opts.callback && opts.callback(selData);// 修改选中项时的回调
        }
        bTrigger=true;
    };
    var _initTree=function(){
        _treeObj=dpEl.find('#'+guid).initZTree(opts.treeOpts);
    };
    var _init=function(){
        // 下拉框内容主体字符串
        var getDropStr=function(){
            var str='<div class="dropdown dropSel">';
            var boxH=opts.height-CONF.emptyH,
                boxW=opts.width;
            if(opts.filter){
                boxH-=30;
                str+='<input class="dropSel-filter" value="" />';
            }
            str+='<ul class="dropSel-box ztree" style="'+(boxW?'width:'+boxW+'px;':'')+'height: '+boxH+'px;" id="'+guid+'"></ul>'+
                '</div>';
            return str;
        };
        bTrigger=opts.initTrigger;// TODO initZTree 中初始化时目前一定会触发 onSelect，进入 _setInputVal 方法，因此初始时将 bTrigger 定为 opts.initTrigger 即可，reset 时也应做此操作
        // 下拉框中的内容部分
        dpEl=$(getDropStr());
        // 处理树初始化参数
        var treeOpts=opts.treeOpts;
        treeOpts= $.extend(treeOpts ,{
            multi:opts.mulChk
            ,initSelect:treeOpts.initSelect || false
            ,selParams:opts.selParams
            ,key:$.extend(treeOpts.key||{},{name:opts.txtField})
        });
        if(opts.filter){
            treeOpts.filterEl=dpEl.find('.dropSel-filter');
            treeOpts.filter=opts.filter;
        }
        treeOpts.onSelect = opts.mulChk ? _setInputVal :
            function(){
                _setInputVal();
                dpObj.isShown() && dpObj.close();// 单选设置选中项后关闭
            };
        // 隐藏域
        hideEl=$('<input type="hidden" name="'+opts.name+'" />');
        el.prop('readonly',true)// 禁止输入
          .attr('autocomplete','off')
          .after(hideEl);// 添加隐藏域
        dpObj=el.dropdown($.extend(
            {
                modal: false
            },
            opts.dpOpts,
            {
                cont: dpEl,
                noDestroy: true,
                show: false,
                beforeClose: $.noop,
                beforeShow: $.noop
            }
        ));
        _initTree();
        el.off('click.showDp').on('click.showDp',function(){
            if(dpObj && !dpObj.isShown()){
                dpObj.show();
                if(!_treeObj){
                    _initTree();
                }
            }
        });
    };
    /**
     * 更新树数据源，重新初始化树 reset(url,urlArgs,selParams);reset(data,selParams)
     * @param url {string|Array=}
     * @param urlArgs {object|Array=}
     * @param selParams {Array=} 默认选中项条件 [key,value]
     */
    returnObj.resetTree=function(url,urlArgs,selParams){
        bTrigger=opts.initTrigger;// TODO initZTree 中初始化时目前一定会触发 onSelect，进入 _setInputVal 方法，因此初始时将 bTrigger 定为 opts.initTrigger 即可，reset 时也应做此操作 - 此处暂不考虑通过此方法只设置 selParams 的情况
        _treeObj && _treeObj.reset(url,urlArgs,selParams);
    };
    returnObj.setSel=function(selParams,clear,trigger){
        if(trigger===false){
            bTrigger=false;
        }
        _treeObj && _treeObj.setSel(selParams,clear);
    };
    returnObj.getTreeObj=function(){
        return _treeObj;
    };
    _init();
    return returnObj;
};
/**
 * @widoc $.fn.initFilter
 * @namespace comp
 * @des 初始化关键字过滤元素，该元素为 input[type="text"] 或 textarea
 * @type function
 * @param {object} opts 配置参数
 * @param {Array=} opts.data 要进行过滤的数据源
 * @param {string|Array} opts.fields 要过滤的字段的属性名
 * @param {boolean|Array} opts.pySupport 是否支持拼音首字过滤，默认为：true。当以数组定义时，数组的项指定支持首字母搜索的字段名，只作用于 opts.fields 中定义的字段。
 * @param {function=} opts.afterFilter(newData,keyword) 过滤完成后的回调方法
 *   - {Array} newData:过滤后的数据
 *   - {string} keyword:当前的过滤关键字
 * @return {object} obj 返回对象
 * @rtn {function} obj.fSetEnable(enable) 启用/禁用过滤
 *   - {boolean=} enable 是否启用，默认为：true。
 * @rtn {function} obj.filter(val) 手动过滤，不会引起回调。
 *   - {string} val 关键字
 * @rtn {function} obj.setData(data) 重置过滤源数据，关键字将还原为 ''，结果数组将还原为 []。
 *   - {Array} data 过滤数据源。<p class="t_red">注意：移除原来的第二个参数 keyword，需要时可以调用 obj.filter(keyword)。</p>
 * @rtn {function} obj.fGetResultData() 获取过滤后的数据。
 * @rtn {function} obj.getFilterData() <span class="t_gray80">请用 obj.fGetResultData() 替代。</span>
 */
$.fn.initFilter = function(opts){
    var el = $(this),
        api;
    opts = $.extend({
        //data:[],// 要搜索的数据源
        fields: 'name',
        pySupport: true,// 拼音首字支持
        afterFilter: $.noop// function(newData,keyword)// 过滤完成后的回调函数，newData:过滤后的数据
    }, opts);
    var aSrcData,// 过滤数据源
        aDictData,// 根据数据源生成的过滤字段字典
        sKeyword,// 过滤关键字
        aResultData,// 过滤后的数据
        bEnable;// 是否启用
    // 根据关键字搜索数据源
    var fFilter = function(val, doCb){
        var oldVal = sKeyword;
        if(!aSrcData || !aSrcData.length){// 没有数据源
            return;
        }
        if(el.val() != val){
            el.val(val);// 更新搜索框文本
        }
        sKeyword = val.toLocaleUpperCase();
        if(sKeyword === oldVal) return;// 关键字未发生变化
        if(sKeyword == ''){// 关键字为空，返回全部
            aResultData = aSrcData;
        }
        else{
            aResultData = [];
            for(var i = 0, vals; i < aSrcData.length; i++){
                vals = aDictData[i];
                for(var j = 0; j < vals.length; j++){
                    if(vals[j].toLocaleUpperCase().indexOf(sKeyword) != -1){
                        aResultData.push(aSrcData[i]);
                        break;
                    }
                }
            }
        }
        doCb && opts.afterFilter(aResultData, sKeyword);
    };
    // 根据数据源生成对应的过滤字段字典 - 可能由重置数据源、过滤字段、首字母配置而发生变化
    var fResetDictData = function(){
        // 字典变化会导致过滤结果变化，先将关键字、字典数组、结果数组还原
        sKeyword = '';
        el.val(sKeyword);
        aResultData = aSrcData;
        aDictData.length = 0;
        if(aSrcData){
            var fields = opts.fields,
                pySupport = opts.pySupport,
                aPySupport;// 多字段过滤时，opts.fields 中每个字段对应的 pySupport
            var len = aSrcData.length,
                i, item, val, filterVals,
                bPySupport, flen;// pySupport 为数组时的循环临时变量
            if(Object.prototype.toString.call(fields) === '[object Array]'){
                aPySupport = [];
                flen = fields.length;
                // 记录 fields 中每个字段对应的 pySupport
                if(Object.prototype.toString.call(pySupport) == '[object Array]'){
                    for(i = 0; i < flen; i++){
                        aPySupport[i] = pySupport.indexOf(fields[i]) != -1;
                    }
                }
                else{
                    for(i = 0; i < flen; i++){
                        aPySupport[i] = pySupport;
                    }
                }
                for(i = 0; i < len; i++){
                    filterVals = [];
                    item = aSrcData[i];
                    for(var f = 0; f < fields.length; f++){
                        val = item[fields[f]];
                        var vType = typeof val;
                        if(vType == 'boolean' || vType == 'string' || vType == 'number'){
                            val = String(item[fields[f]]).toLocaleUpperCase();
                            filterVals.push(val);
                            if(aPySupport[f] && /[\u4e00-\u9fa5]+/.test(val)){
                                filterVals = filterVals.concat($.makePyArr(val));
                            }
                        }
                    }
                    aDictData.push(filterVals);
                }
            }
            else{
                bPySupport = Object.prototype.toString.call(pySupport) == '[object Array]'
                    ? pySupport.indexOf(fields) != -1
                    : pySupport;
                for(i = 0; i < len; i++){
                    filterVals = [];
                    val = aSrcData[i][fields].toLocaleUpperCase();
                    filterVals.push(val);
                    if(bPySupport && /[\u4e00-\u9fa5]+/.test(val)){
                        filterVals = filterVals.concat($.makePyArr(val));
                    }
                    aDictData.push(filterVals);
                }
            }
        }
    };
    // 设置数据源
    var fSetSrcData = function(data/*, val, doCb*/){
        // 2017.11.16 by qq 不需要引起过滤，应用场景中未发现传入 val 及 doCb，需要时可以调用 api.filter
        // - 删除参数 val, doCb
        // - 移除最后一行 fFilter()
        aSrcData = $.extend([], data);
        fResetDictData();// 关键字、结果数组在重置字典表时还原
        //fFilter(val || '', doCb);
    };
    // 获取数据源
    var fGetSrcData = function(){
        return aSrcData;
    };
    // 获取当前关键字过滤后的数据
    var fGetResultData = function(){
        return aResultData;
    };
    // 过滤框键盘抬起触发过滤
    var fOnInputKeyup = function(){
        var val = el.val();
        if(val != sKeyword){
            fFilter(val, true);
        }
    };
    // 启用/禁用过滤功能，绑定 keyup 事件，默认启用
    var fSetEnable = function(enable){
        el.off('keyup.wiFilter');
        bEnable = enable = enable !== false;
        if(enable){
            el.on('keyup.wiFilter', fOnInputKeyup);
        }
    };

    // 重设配置
    var fReset = function(cusOpts){
        var bPySupportChanged;// 首字母支持是否发生变化
        if(cusOpts){
            bPySupportChanged = typeof cusOpts.pySupport != 'undefined' && cusOpts.pySupport != opts.pySupport;
            $.extend(opts, cusOpts);

            if(cusOpts.data){
                fSetSrcData(cusOpts.data);// 重新记录数据并生成字典数组
            }
            else if(cusOpts.fields || bPySupportChanged){
                fResetDictData();// 重新生成字典数组
            }
            // afterFilter - 过滤时自动生效，不需要在 fReset 中处理
        }
        else{// 初始化时，处理 opts
            fSetSrcData(opts.data);
        }
    };
    var fInit = function(){
        aDictData = [];
        fReset();
        fSetEnable();// 启用过滤
    };
    api = {
        fReset: fReset,
        fSetEnable: fSetEnable,// 启用/禁用过滤
        filter: fFilter,// 根据关键字过滤
        setData: fSetSrcData,// 更新数据源
        getData: fGetSrcData,// 获取数据源 - TODO 暂未发现开放的必要场景
        getFilterData: fGetResultData// 获取过滤后的数据
    };
    fInit();
    return api;
};
/**
 * @widoc $.fn.initDateLine
 * @namespace comp
 * @des 初始化时间范围选择控件，依赖 WdatePicker
 * @type function
 * @demo initDateLine/demo0 通用日期范围选择
 * @param {object} opts 参数配置
 * @param {Date=} opts.today 当天日期对象，默认为客户端本地时间
 * @param {Date=} opts.startDate 初始化时的起始日期，若定义 allowEmpty:false，则默认为 today 当月第一天
 * @param {Date=} opts.endDate 初始化时的结束日期，若定义 allowEmpty:false，则默认为 startDate 起始日期的这个月的最后一天
 * @param {boolean=} opts.allowEmpty 是否允许空，默认为 true
 * @param {function=} opts.onChange 日期改变时的回调方法，onChange(start,end)
 * - {Date} start
 * - {Date} end
 * @return {object} obj 返回对象
 * @rtn {Date} obj.curStart 开始日期对象
 * @rtn {Date} obj.curEnd 结束日期对象
 * @rtn {function} obj.fSetDate(startDate,endDate) 设置日期范围 TODO 作为接口调用时，不应默认触发回调 opts.onChange
 * - {Date} startDate
 * - {Date} endDate
 * @rtn {function} obj.fGetDate() 获取当前组件中的日期范围
 * - 返回值：{ curStart:{Date}, curEnd:{Date} }
 */
$.fn.initDateLine=function(opts){
    if(!window.WdatePicker) return null;
    opts= $.extend({
        today:new Date(),
        //startDate,endDate - {Date=}
        allowEmpty: true,
        onChange: $.noop
    },opts);
    var dateline=$(this);
    var dtGuid= $.generateGuid('dateline');
    // dateline 主要元素：上个月、下个月、弹出、主体
    var prevEl,nextEl,triggerEl,layerEl,
        jqStartIpt,// custom 弹出层的开始时间文本框
        jqEndIpt;// custom 弹出层的结束时间文本框
    var oCurStart, //保存当前设置的开始时间
        oCurEnd,//保存当前设置的结束时间
        api;
    var _monYear;// month 中显示的年份
    /**
     * 设置 custom 中 datepicker 文本框显示的起始时间
     * @param startDate {Date=} 开始时间，未定义时，设为 ''
     * @param endDate {Date=} 结束时间，未定义时，设为 ''
     */
    var fSetDtCustom=function(startDate, endDate){
        jqStartIpt.val(startDate ? startDate.format('yyyy-MM-dd') : '');
        jqEndIpt.val(endDate ? endDate.format('yyyy-MM-dd') : '');
    };
    /**
     * 重置显示文本框时间和弹出框的时间
     * @param startDate {Date=} 开始时间，未定义时，根据当前时间设为本月第一天
     * @param endDate {Date=} 结束时间，未定义时，根据开始时间设为当月最后一天
     * @param bTrigger {boolean=} 若日期发生变化，是否触发回调，默认为 false（一般组件内部的方法才设为 true，api.fSetDate() 则不回调，应由用户自行触发，2017.08.09 by qq）
     */
    var fSetDate = function(startDate, endDate, bTrigger){
        var oldStart = oCurStart,
            oldEnd = oCurEnd;
        var spans=triggerEl.children('span');
        // 处理开始日期和结束日期。显示顺序（开始日期不得超过结束日期），不允许为空时需补全日期
        var fDealDate = function(){
            var temp;
            if(startDate && endDate){// 开始时间和结束时间都存在
                if(startDate > endDate){ //判断时间大小
                    temp = startDate;
                    startDate = endDate;
                    endDate = temp;
                }
            }else{
                if(!opts.allowEmpty){//不能为空
                    if(startDate){// startDate 存在，endDate 不存在
                        endDate = new Date(startDate.add('M',1).add('d',-1));
                    }
                    else if(endDate){// startDate 不存在，endDate 存在
                        startDate = new Date(endDate.add('M',-1).add('d',1));
                    }
                    else{// startDate 不存在，endDate 不存在，范围取当月
                        startDate = new Date(opts.today.format('yyyy/MM/01'));
                        endDate = new Date(startDate.add('M',1).add('d',-1));
                    }
                }
            }
        };
        // TODO del 旧版本曾支持 yyyy/MM/dd 的字符串输入，此处两个 if 判断仅作兼容，升版本时将移除
        if(typeof startDate == 'string'){
            startDate = new Date(startDate);
        }
        if(typeof endDate == 'string'){
            endDate = new Date(endDate);
        }
        // 参数处理
        fDealDate();
        // 转为 string 筛除时分秒等无用信息后转回 Date，避免影响判断
        if(startDate){
            startDate = new Date(startDate.format('yyyy/MM/dd'));
        }
        if(endDate){
            endDate = new Date(endDate.format('yyyy/MM/dd'));
        }
        // 同步到组件全局变量，及 api 接口
        api.curStart = oCurStart = startDate;
        api.curEnd = oCurEnd = endDate;
        // 同步到主体显示
        spans.eq(0).html(startDate ? startDate.format('yyyy年MM月dd日') : '----年--月--日');
        spans.eq(2).html(endDate ? endDate.format('yyyy年MM月dd日') : '----年--月--日');
        hideLayer();// 设置日期后隐藏弹框，因弹框中的日期将在弹出时才进行同步，所以此时若不隐藏，可能造成主体与弹框不统一的情况
        // 日期发生了变化，作为接口调用时，不应默认触发回调 opts.onChange
        if(bTrigger &&
            (oldStart != startDate || oldEnd != endDate)){
            opts.onChange(oCurStart, oCurEnd);
        }
    };
    // 获取日期
    var fGetDate = function(){
        return {
            curStart:oCurStart,
            curEnd:oCurEnd
        }
    };
    // 隐藏弹框
    var hideLayer=function(){// 隐藏主体
        triggerEl.removeClass('now');
        layerEl.removeClass('now');
        $(document).off('click.hide'+dtGuid);
    };
    // 显示弹框
    var showLayer=function(){// 显示主体
        fSetDtCustom(oCurStart, oCurEnd); //防止在弹出层清空或修改文本框后，没有点确定按钮确定时间关闭弹框，而是点document其他地方关闭了弹框，此时需要同步时间
        triggerEl.addClass('now');
        var triggerBCR=triggerEl[0].getBoundingClientRect();
        layerEl
            .addClass('now')
            .css({
                left:triggerEl.position().left+'px',
                top:(triggerEl.position().top+triggerBCR.bottom-triggerBCR.top)+'px'
            });
        // 点击其他部位隐藏
        $(document).on('click.hide' + dtGuid, function(e){
            if($(e.target).closest(dateline).length){
                return;
            }
            hideLayer();
        });
        layerEl.children('.date-select').find('.date-option').eq(0).trigger('click.datebody'+dtGuid);// 默认选中自定义选择
    };
    /* custom 快捷切换 */
    var initCustom=function(customEl){
        var hideCustom=function(el){// 隐藏 custom 下拉
            el.find('.dateline-layer').removeClass('now');
        };
        var showCustom=function(el){// 显示 custom 下拉
            var custom=el.find('.dateline-layer');
            var triggerBCR=el[0].getBoundingClientRect();
            custom
                .addClass('now')
                .css({
                    left:(el.position().left+5)+'px',// 含有 5px 外边距
                    top:(el.position().top+triggerBCR.bottom-triggerBCR.top-1)+'px'
                });
        };
        // 快速选择弹框选中事件
        var fCustomClick = function(){// custom 快捷切换
            var opt=$(this)
                ,val=opt.attr('data-opt')
                ,txt=opt.html();
            opt.closest('.dateline-layer').prev().html(txt);
            var today=opts.today,
                y,w,start;
            switch(val){
                case 'thisMonth':// 本月
                    start=new Date(opts.today.format('yyyy/MM/01'));
                    fSetDtCustom(start, start.add('M',1).add('d',-1));
                    break;
                case 'lastMonth':// 上月
                    start=new Date(today.format('yyyy/MM/01')).add('M',-1);
                    fSetDtCustom(start, start.add('M',1).add('d',-1));
                    break;
                case 'thisWeek':// 本周 - 周一为第一天
                    w=(today.getDay() || 7)-1;
                    start=today.add('d',-w);
                    fSetDtCustom(start, start.add('d',6));
                    break;
                case 'lastWeek':// 上周
                    w=(today.getDay() || 7)-1;
                    start=today.add('d',-w-7);
                    fSetDtCustom(start, start.add('d',6));
                    break;
                case 'thisQ':// 本季
                    start=new Date(today.getFullYear()+'/'+(Math.floor(today.getMonth()/3)*3+1)+'/01');
                    fSetDtCustom(start, start.add('M',3).add('d',-1));
                    break;
                case 'lastQ':// 上季
                    start=new Date(today.getFullYear()+'/'+(Math.floor(today.getMonth()/3)*3+1)+'/01');
                    fSetDtCustom(start.add('M',-3), start.add('d',-1));
                    break;
                case 'thisYear':// 今年
                    y=today.getFullYear();
                    fSetDtCustom(new Date(y+'/01/01'), new Date(y+'/12/31'));
                    break;
                case 'lastYear':// 去年
                    y=today.getFullYear()-1;
                    fSetDtCustom(new Date(y+'/01/01'), new Date(y+'/12/31'));
                    break;
                case 'last7Days':// 近7天
                    fSetDtCustom(today.add('d',-6), today);
                    break;
                case 'last30Days':// 近30天
                    fSetDtCustom(today.add('d',-29), today);
                    break;
            }
        };
        // custom 底部按钮事件
        var fCustomBtnClick = function(){
            var jqThis = $(this);
            var fGetIptDate;// 输入框的值的处理
            switch(jqThis.attr('data-type')){
                case 'submit':// 确认，根据 datepicker 文本框赋值
                    fGetIptDate=function(data){// 输入框的值的处理
                        return data ? new Date(data.replace(/-/g,'/')) : undefined;
                    };
                    fSetDate(fGetIptDate(jqStartIpt.val()), fGetIptDate(jqEndIpt.val()), true);
                    break;
                case 'clean':// 清空
                    fSetDate(undefined, undefined, true);
                    break;
            }
        };
        jqStartIpt.click(function(e){
            WdatePicker({ dateFmt:'yyyy-MM-dd' ,readOnly:true},false,e);
        });
        jqEndIpt.click(function(e){
            WdatePicker({ dateFmt:'yyyy-MM-dd',readOnly:true},false,e);
        });
        // 显示/隐藏快捷选择弹框
        customEl.find('.date-custom-trigger').click(function(){
            var el=$(this);
            el.find('.dateline-layer').hasClass('now') ? hideCustom(el) : showCustom(el);
        });
        customEl.find('.date-custom-select')
                .append(
                    '<li data-opt="thisMonth">本月</li>' +
                    '<li data-opt="lastMonth">上月</li>' +
                    '<li data-opt="thisWeek">本周</li>' +
                    '<li data-opt="lastWeek">上周</li>' +
                    '<li data-opt="thisQ">本季</li>' +
                    '<li data-opt="lastQ">上季</li>' +
                    '<li data-opt="thisYear">今年</li>' +
                    '<li data-opt="lastYear">去年</li>' +
                    '<li data-opt="last7Days">近7天</li>' +
                    '<li data-opt="last30Days">近30天</li>')
                // 快速选择弹框选中事件
                .on('click','li',fCustomClick);
        // custom 底部按钮
        if(!opts.allowEmpty){// 禁止为空时，隐藏清空按钮
            customEl.find('.date-btn[data-type="clean"]').css('display','none');
        }
        customEl.on('click.btn','.date-btn',fCustomBtnClick);
    };
    /* month 快捷切换 */
    var initMonth=function(monthEl){
        /**
         * 设置 month 年份，并根据年份设置月份状态
         * @param year {int=} 年份，未定义时为今年
         */
        var setMonthYear=function(year){
            var today = opts.today
                ,thisYear = today.getFullYear()
                ,thisMonth = today.getMonth()+1;
            if(!year) year= thisYear;
            _monYear=year;
            monthEl.find('.date-month-head>div').eq(1).html(year+'年');
            var monthStr='';
            for(var i= 1,clsStr;i<=12;i++){
                clsStr='';
                if(year==thisYear && i==thisMonth){// 当前月
                    clsStr=' class="currentMonth"';
                }else if(year==thisYear && i>thisMonth || year>thisYear){// 不可选的月份
                    clsStr=' class="cannotSelect"';
                }
                monthStr+='<li data-month="'+ i +'"' + clsStr
                    + (i==1||i==7 ? ' style="margin-left:1px;"' : '') +'>'+ i +'月</li>';
            }
            monthEl.children('.date-month-body').html(monthStr);
        };
        var fMonthHeadClick = function(){
            if($(this).hasClass('dateline-l')){// 上一年
                setMonthYear(_monYear-1);
            }else if($(this).hasClass('dateline-r')){// 下一年
                setMonthYear(_monYear+1);
            }
        };
        var fMonthBodyClick = function(){
            if($(this).hasClass('cannotSelect')) return;// 不可选的月份
            var oNewStart = new Date(_monYear+'/'+$(this).attr('data-month')+'/01'),
                oNewEnd = new Date(oNewStart.add('M', 1).add('d', -1)); // 结束日期设为开始日期加1个月减1天
            fSetDate(oNewStart, oNewEnd, true);
        };
        setMonthYear();
        monthEl.children('.date-month-head').on('click.month','>div',fMonthHeadClick);
        monthEl.children('.date-month-body').on('click.month','li',fMonthBodyClick);
    };
    var initBody=function(bodyEl){
        // 初始化弹出主体中切换 body 的事件 （自定义选择或按月选择的tab切换）
        var fDateOptionClick = function(){
            bodyEl.find('.dateline-layer').removeClass('now');// 切换时将 date-body 中的弹出层隐藏
            var trigger=$(this);
            if(trigger.hasClass('now')) return;
            layerEl.find('.date-select>.now').removeClass('now');
            trigger.addClass('now');
            bodyEl.children('.now').removeClass('now');
            bodyEl.children('[data-type="'+trigger.attr('data-type')+'"]').addClass('now');
        };
        bodyEl.children('.date-select')
              .off('click.datebody'+dtGuid)
              .on('click.datebody'+dtGuid,'.date-option',fDateOptionClick);//自定义选择或按月选择的tab切换
        // showLayer() 显示弹框时，默认点击第一项
    };
    var initDateLine=function(){
        // 初始化el元素
        (function initEl(){
            prevEl=$('<div class="dateline-l"></div>');
            triggerEl=$('<div class="dateline-c date-trigger">' +
                '<span></span>' +
                '<span style="width:auto;">-</span>' +
                '<span></span>' +
                '</div>');
            nextEl=$('<div class="dateline-r"></div>');
            layerEl=$('<div class="dateline-layer date-body">' +
                '<div class="date-select clearf">' +
                '<div data-type="custom" class="date-option now">自定义选择</div>' +
                '<div data-type="month" class="date-option">按月选择</div>' +
                '</div>' +
                '<div data-type="custom" class="date-container now">' +
                '<div class="date-line clearf">' +
                '<div class="date-trigger date-custom-trigger"><span>本月</span>' +
                '<div class="dateline-layer"><ul class="date-custom-select"></ul></div>' +
                '</div>' +
                    //'<input class="date-trigger" onclick="WdatePicker({ dateFmt:\'yyyy-MM-dd\',readOnly:true});" /><span>-</span><input class="date-trigger" onclick="WdatePicker({ dateFmt:\'yyyy-MM-dd\',readOnly:true});" />' +
                '<input class="date-trigger" /><span>-</span><input class="date-trigger" />' +
                '</div>' +
                '<div class="date-line clearf">' +
                '<div class="date-btn" data-type="submit">确认</div>' +
                '<div class="date-btn" data-type="clean">清空</div>' +
                '</div>' +
                '</div>' +
                '<div data-type="month" class="date-container">' +
                '<div class="date-line clearf date-month-head">' +
                '<div class="dateline-l"></div>' +
                '<div style="width:80px;text-align: center;"></div>' +
                '<div class="dateline-r"></div>' +
                '</div>' +
                '<ul class="date-line clearf date-month-body"></ul>' +
                '</div>' +
                '</div>');
        })();
        // 主体 dateline 的点击事件
        var fDateLineClick = function(){
            var el=$(this);
            // 设置开始和结束时间的值。nflag 参数来设置时间是加一个月（1）还是减一个月(-1)
            var fStepMonth = function(nflag){
                var oNewStart, oNewEnd;// 切换后要显示的新起止日期
                var oRefer = oCurStart || oCurEnd;// 参照日期，起止时间都存在时，以开始日期为参照
                if(oRefer){
                    oNewStart = new Date(oRefer.format('yyyy/MM/01')).add('M', nflag);// 开始日期设置为上/下个月的第一天
                    oNewEnd = new Date(oNewStart.add('M', 1).add('d', -1)); // 结束日期设为开始日期加1个月减1天
                    fSetDate(oNewStart, oNewEnd, true);
                }
            };
            if(el.hasClass('dateline-l')){// 切换到上个月
                fStepMonth(-1);
            }
            else if(el.hasClass('dateline-r')){// 切换到下个月
                fStepMonth(1);
            }
            else if(el.hasClass('dateline-c')){// 显示/隐藏主体
                if(triggerEl.hasClass('now')){
                    hideLayer();
                }else{
                    showLayer();
                }
            }
        };
        var triggerIptEl = layerEl.find('input.date-trigger');
        jqStartIpt = triggerIptEl.eq(0);
        jqEndIpt = triggerIptEl.eq(1);
        fSetDate(opts.startDate, opts.endDate);// 初始化 dateline 时间范围
        dateline.on('click.dateline','>div',fDateLineClick); //显示框.dateline的点击事件
        initCustom(layerEl.find('.date-container[data-type="custom"]'));
        initMonth(layerEl.find('.date-container[data-type="month"]'));
        initBody(layerEl);
        dateline.addClass('dateline').append(prevEl,triggerEl,nextEl,layerEl);
    };
    api = {
        //curStart: Date,// 开始日期对象，fSetDate() 中同步
        //curEnd: Date,// 结束日期对象，fSetDate() 中同步
        setDateData:fSetDate,// TODO del 兼容旧版本，现改为 fSetDate()
        fSetDate:fSetDate,// 设置日期
        fGetDate:fGetDate // 获取日期
    };
    initDateLine();
    return api;
};
WICONF.initScrollbar = {
    step: 150// 每次滚动时的位移
};
/**
 * @widoc $.fn.initScrollbar
 * @namespace aux
 * @des 在元素中创建自定义滚动条。注意：元素初始化前，应只包含一个内容元素，用于计算高度。因此若有多块内容，也请包裹在唯一的子元素中
 * 组件配置，在使用组件前调用：
 <pre class="des-conf"> $.setWiConf('initScrollbar',{
    step:150// 每次滚动时的位移
 });</pre>
 * @type function
 * @param {object} opts 配置参数
 * @param {number=} opts.step 每次滚动时的位移，单位：px，默认为 150。
 * @param {function=} opts.onScroll 组件内引起滚动时的回调。
 *   - function()
 * @return {object|undefined} obj 接口对象
 * @rtn {function} obj.fResetSize() 根据实际尺寸调整滚动条
 * @rtn {function} obj.fScrollUp(bTriggerCb) 向上滚动
 *   - bTriggerCb {boolean=} 滚动完成后是否触发回调，默认不触发
 * @rtn {function} obj.fScrollDown(bTriggerCb) 向下滚动
 *   - bTriggerCb {boolean=} 滚动完成后是否触发回调，默认不触发
 * @rtn {function} obj.fScrollTo(newTop,bTriggerCb) 滚动到指定位置
 *   - newTop {number} 要滚动到的新位置
 *   - bTriggerCb {boolean=} 滚动完成后是否触发回调，默认不触发
 * @rtn {function} obj.fScrollElIntoView(jqSub,bTriggerCb) 将 jqSub 移入滚动元素视图区
 *   - jqSub {object} 要移入滚动元素视图区的 jquery 元素
 *   - bTriggerCb {boolean=} 滚动完成后是否触发回调，默认不触发
 */
$.fn.initScrollbar = function(opts){
    var el = $(this),
        CONF = WICONF.initScrollbar,
        dom = el[0];
    opts = $.extend({
        step: CONF.step,// 每次滚动的位移
        onScroll: $.noop// 组件内引起滚动时的回调
    }, opts);
    var api,
        domCont,// 内容元素 dom 对象
        jqBar,// 滚动条 jquery 元素对象
        jqSlider;// 滚动条滑块 jquery 元素对象
    var nHeight,// 容器高度，每次 fResetSize 时获取
        nContHeight;// 内容高度，每次 fResetSize 时获取
    // 滚动操作：newTop 要滚动到的新位置，bTriggerCb=true 触发回调
    // 由于使用 el.scrollTop(newTop) 实现滚动，因此 newTop 超出合理范围时浏览器会自动调节，即 newTop 不一定是滚动后的真正位置
    var fScroll = function(newTop, bTriggerCb){
        el.scrollTop(newTop);
        fResetPos();
        if(bTriggerCb){
            opts.onScroll();// 触发回调
        }
    };
    // 向上滚动
    var fScrollUp = function(bTriggerCb){
        var oldTop = el.scrollTop();// 滚动前的位置
        if(oldTop > 0){// 未滚动到顶
            fScroll(oldTop - opts.step, bTriggerCb);// 已经判断过位置，不需要使用 fScrollTo()
        }
    };
    // 向下滚动
    var fScrollDown = function(bTriggerCb){
        var oldTop = el.scrollTop();// 滚动前的位置
        if(oldTop < nContHeight - nHeight){// 未滚动到底
            fScroll(oldTop + opts.step, bTriggerCb);// 已经判断过位置，不需要使用 fScrollTo()
        }
    };
    // 滚动到指定位置（与 fScroll 的不同在于，此方法会先验证 newTop 的合理性，若超出范围将不会引起滚动）
    var fScrollTo = function(newTop, bTriggerCb){
        var oldTop = el.scrollTop();// 滚动前的位置
        newTop = Math.max(0, newTop);// 不能小于最小位置（顶部）
        newTop = Math.min(nContHeight - nHeight, newTop);// 不能大于最大位置（底部）
        if(oldTop != newTop){
            fScroll(newTop, bTriggerCb);
        }
    };
    // 将指定元素滚动到可见范围
    var fScrollElIntoView = function(jqSub, bTriggerCb){
        var oldTop = el.scrollTop();// 滚动前的位置
        var elBCRTop = domCont.getBoundingClientRect().top,
            subBCR = jqSub.get(0).getBoundingClientRect();
        var newTop,
            minTop = (subBCR.bottom - elBCRTop) - nHeight,// jqSub 底部相对于内容的位置 - 容器高度
            maxTop = (subBCR.top - elBCRTop);// jqSub 顶部相对于内容的位置
        if(minTop > maxTop){// jqSub 高度超过容器
            newTop = maxTop;// 借 newTop 交换 minTop, maxTop
            maxTop = minTop;
            minTop = newTop;
        }
        newTop = oldTop;
        // 判断滚动前的位置
        if(oldTop < minTop){
            newTop = minTop;
        }
        else if(oldTop > maxTop){
            newTop = maxTop;
        }
        else{
            return;
        }
        fScroll(newTop, bTriggerCb);
    };
    // 绑定滚动监听
    var fBindScrollEvent = function(){
        if(navigator.userAgent.indexOf("Firefox") > 0){// 火狐
            dom.addEventListener('DOMMouseScroll', function(e){
                //fScroll(e.detail > 0, true);
                if(e.detail > 0){
                    fScrollDown(true);
                }
                else{
                    fScrollUp(true);
                }
                if(nHeight < nContHeight){// 有滚动条时，阻止默认事件
                    e.preventDefault();
                }
            }, false);
            el.scrollTop(0);// 避免初始化进入页面时重复载入
        }
        else{// 其他浏览器
            el.on('mousewheel', function(e){
                //fScroll(e.originalEvent.wheelDelta < 0, true);
                if(e.originalEvent.wheelDelta < 0){
                    fScrollDown(true);
                }
                else{
                    fScrollUp(true);
                }
                if(nHeight < nContHeight){// 有滚动条时，阻止默认事件
                    e.preventDefault();
                }
            });
        }
    };
    // 根据实际尺寸调整滚动条位置
    var fResetPos = function(){
        var curTop = el.scrollTop();
        jqBar.css('top', curTop + 'px');
        jqSlider.css('top', curTop / nContHeight * nHeight + 'px');
    };
    // 根据实际尺寸调整滚动条大小，并调用 fResetPos 重算位置
    var fResetSize = function(){
        var curTop = el.scrollTop();
        nHeight = dom.clientHeight;// 容器尺寸
        nContHeight = domCont.clientHeight;// 内容尺寸
        var maxTop = nContHeight - nHeight;
        if(maxTop < curTop){
            el.scrollTop(maxTop);
        }
        if(nHeight < nContHeight){
            jqBar.addClass('active');
            jqSlider.css('height', (nHeight * 100 / nContHeight).toFixed(2) + '%');
            fResetPos();
        }
        else{
            jqBar.removeClass('active');
        }
    };
    var fInit = function(){
        domCont = dom.children[0];
        jqBar = $('<div class="wi-scrollbar"></div>');
        jqSlider = $('<div class="wi-scrollbar-slider"></div>');
        jqBar.append(jqSlider);
        el.css('position') == 'static' && el.css('position', 'relative');// 设置为定位元素
        el.append(jqBar);// 添加滚动条
        fResetSize();// 根据实际尺寸调整滚动条位置及大小
        fBindScrollEvent();// 绑定滚动监听
    };
    api = {
        fResetSize: fResetSize,
        fScrollUp: fScrollUp,
        fScrollDown: fScrollDown,
        fScrollTo: fScrollTo,
        fScrollElIntoView: fScrollElIntoView
    };
    fInit();
    return api;
};
/**
 * @widoc $.fn.initCarousel
 * @namespace comp
 * @des 为元素 el 中的多屏内容，创建轮播。el 中只允许包含一个元素，该元素的每个直接子元素对应一屏内容。
 * @type function
 * @demo initCarousel/demo0 轮播屏
 * @param {object} opts 配置参数
 * @param {boolean=} opts.autoplay 是否允许自动播放，默认为 true。
 * @param {string=} opts.animateType 切换效果。可选效果：'slide','slideV','fade'，默认为 无效果。
 * @param {number=} opts.duration 切换动画持续时间，单位 ms（animateType 未定义时失效）。
 * @param {number=} opts.delay 轮播间隔时间，单位 ms。
 * @param {number=} opts.num 初始化时显示的第一屏索引，从 0 开始，默认为 0。
 * @param {boolean=} opts.showNav 是否显示导航，默认为 true。
 * @param {function=} opts.fNavItemRender 导航项自定义渲染函数，function(i)。
 *   - {number} i 绘制导航的屏索引。
 * @param {boolean=} opts.showArrow 是否显示左右箭头，默认为 true。
 * @param {function=} opts.fItemCb 切换后的回调事件，function(curIdx)。
 *   - {number} curIdx 切换后的屏索引。
 * @return {object|undefined} obj 接口对象
 * @rtn {function} obj.fStartCarousel() 开始轮播
 * @rtn {function} obj.fStopCarousel() 停止轮播
 * @rtn {function} obj.fGoto(i,triggerCb) 切换到指定屏
 *   - i {number} 要切换的屏索引
 *   - triggerCb {boolean=} 是否触发用户回调，默认为 false
 */
$.fn.initCarousel = function(opts){
    var el = $(this),// el 中只允许包含一个元素，该元素的每个直接子元素对应一屏内容
        api;
    opts = $.extend({
        autoplay: true,// 是否允许自动播放
        //animateType: undefined,// 切换效果：'slide','slideV','fade'
        duration: 1000,// 切换动画持续时间，单位 ms（animateType 未定义时失效）
        delay: 5000,// 轮播间隔时间，单位 ms
        num: 0, // 初始化时显示的第一屏索引，从 0 开始
        showNav: true,// 是否显示导航
        //fNavItemRender: function(i)// 导航项自定义渲染函数
        showArrow: true,// 是否显示左右箭头
        fItemCb: $.noop// 切换后的回调事件 function(curIdx)
    }, opts);
    var jqMain,// 屏内容的主容器
        jqsCont,// 所有屏内容元素集合
        jqNav;// 切换导航容器元素
    var nCount;// 滚动屏数
    var curIdx;// 当前屏索引，切换前的屏索引
    var oTimer = null,// 自动切换定时器
        bAutoplay,// 记录当前是否自动轮播
        sAnimateType;// 记录切换效果
    // 自动播放
    var fStartCarousel = function(){
        bAutoplay = true;
        if(!oTimer){
            oTimer = setTimeout(function(){
                oTimer = null;
                fGoto(curIdx + 1, true);
            }, opts.delay);
        }
    };
    // 停止自动播放
    var fStopCarousel = function(){
        bAutoplay = false;
        if(oTimer){
            clearTimeout(oTimer);
            oTimer = null;
        }
    };
    // 左右箭头点击事件
    var fCtrlClick = function(){
        var type = $(this).attr('data-type');
        fGoto(type == 'prev' ? curIdx-1 : curIdx+1, true);
    };
    // 导航点击事件
    var fNavClick = function(){
        fGoto($(this).index(), true);
    };
    // 滚到 newIdx 指定的屏
    var fGoto = function(newIdx, triggerCb){
        var jqCurCont, jqNewCont,// 切换显示前/后的屏内容元素
            flag;// 切换方向，1 从右向左，-1 从左向右
        var duration = opts.duration;// 动画持续时间
        // 切换完成后的回调方法
        var fAfterGoto = function(){
            if(bAutoplay){ //如果是自动播放的，需要主动调用autoPlay()函数
                fStartCarousel();
            }
            jqNav&&jqNav.find('li').removeClass('active')
                        .eq(curIdx).addClass('active');
            triggerCb && opts.fItemCb(curIdx);// 用户自定义回调事件
        };
        if(sAnimateType){// 切换效果启用时，开始下一次切换前，需先结束正在进行的切换
            var jqsAnimating = jqsCont.filter(':animated');
            if(jqsAnimating.length){
                jqsAnimating.finish();
            }
        }
        if(newIdx == curIdx){
            return;
        }
        if(curIdx < newIdx){// 从右向左滑动，newIdx 屏先移到右侧
            flag = 1;
        }else{
            flag = -1;
        }
        if(newIdx >= nCount){// 如果下一个要运动的索引值超过最大索引，就回到第一个
            newIdx = 0;
        }
        else if(newIdx < 0){// 如果下一个要运动的索引值小于最小索引，就回到第最后一个
            newIdx = nCount - 1;
        }
        jqNewCont = jqsCont.eq(newIdx);
        if(curIdx == -1){// 第一次显示，不需要动画
            curIdx = newIdx;
            if(sAnimateType == 'slide'){
                jqNewCont.css('left',0);
            }else if(sAnimateType == 'slideV'){
                jqNewCont.css({
                    display: '',
                    top: 0,
                    bottom: 'auto'
                });
            }else if(sAnimateType == 'fade'){
                jqNewCont.css('display','');
            }else{
                jqNewCont.css('display','');
            }
            fAfterGoto();
        }else{
            jqCurCont = jqsCont.eq(curIdx);
            curIdx = newIdx;
            if(sAnimateType == 'slide'){
                jqNewCont.css('left', flag + '00%'); //将即将进入视图的元素定位到右侧或左侧
                jqNewCont.animate({
                    left: 0
                }, duration, fAfterGoto);
                jqCurCont.animate({
                    left: -flag + '00%'
                }, duration); //将之前展示的元素移出当前区域
            }else if(sAnimateType == 'slideV'){
                if(flag == 1){
                    jqCurCont.css({
                        top: 0,
                        bottom: 'auto'
                    });
                    jqNewCont.css({
                        top: 'auto',
                        bottom: 0
                    });
                }else{
                    jqCurCont.css({
                        top: 'auto',
                        bottom: 0
                    });
                    jqNewCont.css({
                        top: 0,
                        bottom: 'auto'
                    });
                }
                jqNewCont.slideDown(duration, fAfterGoto);
                jqCurCont.slideUp(duration); //将之前展示的元素移出当前区域
            }else if(sAnimateType == 'fade'){
                jqNewCont.fadeIn(duration, fAfterGoto);
                jqCurCont.fadeOut(duration); //将之前展示的元素移出当前区域
            }else{
                jqNewCont.css('display','');
                jqCurCont.css('display','none');
                fAfterGoto();
            }
        }
    };

    // 绘制导航
    var fDrawNav = function(){
        if(!jqNav){return;}
        var str = '',
            fNavItemRender = opts.fNavItemRender;
        for(var i= 0;i<nCount;i++){
            str += '<li class="wi-carousel-nav-item">' +
                (fNavItemRender ? fNavItemRender(i) : '') +
                '</li>';
        }
        jqNav.html(str);
    };
    var fReset = function(){
        jqsCont = jqMain.children();
        jqsCont.addClass('wi-carousel-item');// 所有屏内容元素
        nCount = jqsCont.length;// 屏数
        curIdx = -1;// 屏数可能发生变化，重新计数
        if(nCount < 2){// 只有一屏，不需要切换
            el.find('.wi-carousel-ctrl').css('display','none');
            jqNav&&jqNav.css('display','none');
        }else{// 多屏
            fDrawNav();// 根据屏数绘制导航
            el.find('.wi-carousel-ctrl').css('display','');
            jqNav&&jqNav.css('display','');
            if(sAnimateType == 'slide'){
                jqsCont.css('left', '100%');// 全部内容移出视图
            }else if(sAnimateType == 'slideV'){
                jqsCont.css({
                    display: 'none',
                    top: 'auto',
                    bottom: 0
                });// 全部内容移出视图
            }else if(sAnimateType == 'fade'){
                jqsCont.css('display','none');// 全部内容隐藏
            }else{
                jqsCont.css('display','none');// 全部内容隐藏
            }
        }
        fGoto(opts.num, true);
    };
    var fInit = function(){
        el.addClass('wi-carousel');
        jqMain = el.children().eq(0);
        jqMain.addClass('wi-carousel-main');
        sAnimateType = opts.animateType;

        el.css('position') == 'static' && el.css('position', 'relative');// 设置为定位元素
        // 显示左右箭头
        if(opts.showArrow){
            el.append('<div class="wi-carousel-ctrl wi-carousel-ctrl-prev" data-type="prev">' +
                '<span class="wi-carousel-arrow"></span></div>' +
                '<div class="wi-carousel-ctrl wi-carousel-ctrl-next" data-type="next">' +
                '<span class="wi-carousel-arrow"></span></div>');
            el.off('click.carouselCtrl')// 左右箭头点击事件
              .on('click.carouselCtrl', '.wi-carousel-ctrl', fCtrlClick);
        }
        // 显示切换导航
        if(opts.showNav){
            jqNav = $('<ul class="wi-carousel-nav"></ul>');// 导航容器
            el.append(jqNav);
            el.off('click.carouselNav')// 导航点击事件
              .on('click.carouselNav', '.wi-carousel-nav-item', fNavClick);
        }
        // 允许自动播放
        if(opts.autoplay){
            bAutoplay = true;
            el.off('mouseenter.carousel')// 移入停止定时器
              .on('mouseenter.carousel', fStopCarousel)
              .off('mouseleave.carousel')// 移出开启定时器
              .on('mouseleave.carousel', fStartCarousel);
        }else{
            bAutoplay = false;
        }
        fReset();
    };
    api = {
        fStartCarousel: fStartCarousel,// 开始轮播
        fStopCarousel: fStopCarousel,// 停止轮播
        fGoto: fGoto// 切换到指定屏
    };
    fInit();
    return api;
};
    // 以下代码为兼容原接口
    /* 旧版本兼容代码 */
//$.getBathPath=$.getBasePath;// 修改笔误
})(jQuery);