var HASINTERACTION=true;// TODO 测试中使用，标识当前环境是否支持后台交互
/**
 * Created by QianQi on 2016/1/5.
 */
if(window._GLOBAL == undefined){ window._GLOBAL={};}// 用于存放全局变量
(function(){
    /**
     * 分页：对象为 pageBar 容器 class="manu"
     * @param {string=} jsonUrl 数据源请求jsonUrl
     *  返回的数据结构
     *  - success {bool}
     *  - data.totalcount {int} 总数据条数
     *  - （已取消此参数）data.curpage {int} 请求到第几页的数据，从 1 开始
     *  - （已取消此参数）data.totalpage {int} 总页数
     *  - data.retlist 将作为 drawDomFn 的参数
     *  后台接受请求时获得的分页参数
     *  - curpage:pageNum {int} 要请求第几页的数据
     *  - percount:per {int} 每页显示几条
     * @param {number} per 每页的数据条数，若定义了 perList，per 必须为其中之一，否则默认为 perList[0]
     * @param {function|undefined} drawDomFn 数据绘制函数(参数：数据集合，当前页第一条数据索引(从0开始))
     * @param {object} args 请求时附加的参数，请求时默认已加参数：curpage 当前页码，percount 每页记录条数
     * @param {bool} showloading 请求时是否显示 loading 动画，默认不显示
     * @param {Array=} perList 可选择的每页页码列表，若未定义则不可切换。
     * @return {object|undefined} obj
     *   - obj.destroy() {function} 销毁
     *   - obj.getPage() {function} 获得分页信息
     *       obj.page.percount 每页条数
     *       obj.page.totalpage 总页数
     *       obj.page.curpage 当前页码
     *       obj.page.totalcount 总数据条数
     */
    $.fn.initPageBar=function(jsonUrl,per,drawDomFn,args,showloading,perList){
        var VISIBLEPAGES = 5;// 页码数量（奇数）
        var _pageBar=$(this);
        if(!_pageBar.hasClass('manu')) return;// 判断是否为分页容器
        if(perList && perList.length && perList.indexOf(per)==-1){// 定义了每页显示条数列表，且 per 不在 perList 中
            per=perList[0];
        }
        if(!per) per=20;// 若未定义每页条数，则为 20
        var _destroy=function(){
            _pageBar.find('.manu-sel').off('change.per');
            _pageBar.off('click.toPage')
                .html('');
        };
        var _page={
            percount:per
        };
        var _returnObj={
            page: _page
            ,destroy:_destroy
        };// 返回的接口对象
        var drawDOM=function(result,drawDomFn,pageNum){
            if(result.success){
                result=result.data;
                var half = (VISIBLEPAGES-1)/ 2,pStart,pEnd
                    ,totalPage = Math.ceil(result.totalcount/per)
                    ,toPage = pageNum;
                var bakStr, i,pageStr='';// 临时变量
                if(!totalPage){// 总数据为 0，分页信息不需绘制
                    pageStr+='<div class="manu-l"><div class="manu-item">共 0 页 0 条</div></div>';
                }else{
                    if(toPage > totalPage || toPage < 1){// 页码超出范围，不绘制 DOM
                        alert('页码超过范围!');
                        return;
                    }
                    /****** manu-l ******/
                    pageStr+='<div class="manu-l">';
                    pageStr+='<div class="manu-item">共 '+ totalPage +' 页 '+ result.totalcount +' 条</div>';
                    if(perList && perList.length){// 定义了每页显示条数列表
                        bakStr='<select class="txt manu-sel">';
                        for(i=0;i<perList.length;i++){
                            bakStr += '<option'+(perList[i]==per ? ' selected' : '')+'>'+perList[i]+'</option>';
                        }
                        bakStr+='</select>'
                    }else{
                        bakStr=per;
                    }
                    pageStr+='<div class="manu-item">每页 '+bakStr+' 条</div>' +
                        '<div class="manu-item">' +
                        '<input class="txt manu-txt" type="text" style="width:50px;"> 页 <input type="button" class="btn-min manu-btn" value="跳转">' +
                        '</div>';
                    pageStr+='</div>';// manu-l 结束
                    /****** manu-r ******/
                    pageStr+='<div class="manu-r">';
                    /* 绘制分页 */
                    if(toPage-half>0 && toPage+half<=totalPage){
                        pStart = toPage-half;
                        pEnd = toPage+half;
                    }else if(toPage-half<=0){
                        pStart = 1;
                        pEnd = Math.min(VISIBLEPAGES,totalPage);
                    }else{
                        pStart = Math.max(1,totalPage-VISIBLEPAGES+1);
                        pEnd = totalPage;
                    }
                    pageStr += toPage==1 ?
                        ('<span class="manu-lnk manu-lnk-0"><span class="fa fa-angle-double-left"></span></span>' +
                            '<span class="manu-lnk"><span class="fa fa-angle-left"></span></span>') :
                        ('<a href="javascript:void(0)" class="manu-lnk manu-lnk-0" data-page="1"><span class="fa fa-angle-double-left"></span></a>' +
                            '<a href="javascript:void(0)" class="manu-lnk" data-page="'+(toPage-1)+'"><span class="fa fa-angle-left"></span></a>');
                    for(i=pStart;i<=pEnd;i++){
                        if(i==toPage){
                            pageStr += '<span class="manu-lnk manu-lnk-i">'+i+'</span>';
                        }else{
                            pageStr += '<a class="manu-lnk" href="javascript:void(0)" data-page="'+i+'">'+i+'</a>';
                        }
                    }
                    pageStr += toPage>=totalPage ?
                        ('<span class="manu-lnk"><span class="fa fa-angle-right"></span></span>' +
                            '<span class="manu-lnk manu-lnk-x"><span class="fa fa-angle-double-right"></span></span>') :
                        ('<a href="javascript:void(0)" class="manu-lnk " data-page="'+(toPage+1)+'"><span class="fa fa-angle-right"></span></a>' +
                            '<a href="javascript:void(0)" class="manu-lnk manu-lnk-x" data-page="'+totalPage+'"><span class="fa fa-angle-double-right"></span></a>');
                    pageStr+='';
                    pageStr+='</div>';// manu-r 结束
                }
                _page.totalpage=totalPage;
                _page.curpage=toPage;
                _page.totalcount=result.totalcount;
                _pageBar.html(pageStr);
                drawDomFn && drawDomFn(result.retlist);
                _pageBar.find('.manu-sel')
                    .off('change.per')
                    .on('change.per',function(){
                        $.extend(_returnObj,_pageBar.initPageBar(jsonUrl,parseInt($(this).val()),drawDomFn,args,showloading,perList));
                    });
            }
        };
        var goPage=function(pageNum){// 跳转到第几页
            if(HASINTERACTION){
                showloading && $.showLoading();
                $.ajax({
                    data: $.extend({
                        curpage:pageNum// 从1开始
                        ,percount:per
                    },args || {})
                    ,success:function(result){
                        drawDOM(result,drawDomFn,pageNum);//result,drawDomFn
                    }
                    ,complete:function(){
                        showloading && $.hideLoading();
                    }
                    ,type:'post'
                    ,url:jsonUrl
                });
            }else{
                /* 以下为不连接后台的请求测试 */
                drawDOM({
                    success:true
                    ,data:{
                        totalcount:200
                        ,retlist:undefined
                    }
                },drawDomFn,pageNum);
            }
        };

        _destroy();
        _pageBar.off('click.toPage');
        _pageBar.on('click.toPage','a.manu-lnk,.manu-btn',function(){
            if(this.tagName.toLocaleLowerCase() == 'a'){
                goPage(parseInt($(this).attr('data-page'))||1);
            }else if($(this).hasClass('manu-btn')){
                var val=parseInt(_pageBar.find('.manu-txt').val());
                if(isNaN(val)){
                    alert('页码必须为数字!');
                }else{
                    goPage(val);
                }
            }
        });
        goPage(1);
        return _returnObj;
    };
    /**
     * 请求数据
     * @param {string=} requestUrl 数据源请求jsonUrl
     *  返回的数据结构
     *  - success {bool}
     *  - data 将作为 drawDomFn 的参数
     * @param {function|undefined=} drawDomFn 数据绘制函数(参数：数据集合)，其中 this 指向调用 request 方法的元素
     *  - drawDomFn(data)
     * @param {object=} args 请求时附加的参数
     * @param {bool=} showloading 请求时是否显示 loading 动画，默认不显示
     * @param {bool=} argToJson 请求时是否添加 dataType: "json",contentType:"application/json"
     */
    $.fn.request=function(requestUrl,drawDomFn,args,showloading,argToJson){
        var _this=this;
        if(HASINTERACTION){
            showloading && $.showLoading();
            $.ajax($.extend({
                    data:args || {}
                    ,success:function(result){
                        if(result.success){
                            drawDomFn && drawDomFn.call(_this,result.data);
                        }else if(result.msg){
                            $.showAlert(result.msg);
                        }
                    }
                    ,complete:function(){
                        showloading && $.hideLoading();
                    }
                    ,type:'post'
                    ,url:requestUrl
                },argToJson?{dataType: "json",contentType:"application/json"}:{})
            );
        }else{
            drawDomFn && drawDomFn.call(_this,undefined); // 无后台时的测试语句
        }
        return _this;
    };
    /* 验证辅助方法 */
    var _formatMsg=function(src, args){
        if (args.constructor!= Array) {
            args = [args];
        }
        $.each(args, function(i, n) {
            src = src.replace(new RegExp('\\{'+i+'\\}','g'), n);
        });
        return src;
    };
    /**
     * 验证当前元素
     * @param rules {object}: 要验证的表单元素的验证规则，键值对
     *     rules.key: 验证规则名称
     *     rules.value: 验证规则对应的参数
     * @param messages {object=}: 自定义提示
     *     messages.key: 验证规则名称
     *     messages.value : 对应规则验证不通过时显示的自定义提示
     * @param cb {function=} 验证不通过时再次点击元素时的回调函数
     * @returns {boolean} 是否通过验证
     */
    $.fn.validate=function(rules,messages,cb){
//            var cont=el.parent();// 要添加danger样式的元素
        var el=$(this);
        var cont=el;// 要添加danger样式的元素
        cont.off('click.valiTip');
        var errorRule = '';
        for(var rule in rules){
            if(rules.hasOwnProperty(rule)){
                var method=$.validator.methods[rule];
                if(method && !method(rules[rule],el)){// 定义了该验证方法且验证结果为 false
                    errorRule || (errorRule = rule);
                    break;
                }
            }
        }
        if(errorRule==''){
            cont.removeClass('dangerI');
        }
        else{
            cont.addClass('dangerI');
            var msg=(messages && messages[errorRule]) ?
                messages[errorRule]:
                $.validator.messages[errorRule]||'校验未通过';
            msg = _formatMsg(msg,rules[errorRule]);
            cont.on('click.valiTip',(function(msg){
                return function(){
                    if(cb){
                        cb(el,msg);
                    }else alert(msg);// TODO 显示验证信息
                };
            })(msg));
            return false;
        }
        return true;
    };
    /**
     * 对元素子孙元素中的表单元素初始化验证条件
     * @param options
     *  - options.rules {object} 验证规则，键值对
     *      key: 要验证的表单元素的 name 属性的值
     *      value {object}: 要验证的表单元素的验证规则，键值对
     *          key: 验证规则名称
     *          value: 验证规则对应的参数
     *  - options.messages {object=} 自定义验证信息，键值对
     *      key: 要验证的表单元素的 name 属性的值
     *      value {object}: 验证不通过时显示的自定义提示
     *  - options.callback(el,msg) {function} 自定义提示方法
     *      el {string} 验证失败的元素
     *      msg {string} 该元素上的提示信息
     * @returns {object || undefined} returnObj
     *  - returnObj.validateAll() 手动触发当前元素内表单验证的方法
     * 验证不通过时将对该表单元素的 class 添加 "dangerI"
     */
    $.fn.initValidator=function(options){
        if(!options || !options.rules) return;
        var rules=options.rules
            ,messages=options.messages
            ,form=$(this);
        var _validateEl=function(el,name,rulesOnEl,messages){
//            var cont=el.parent();// 要添加danger样式的元素
            var cont=el;// 要添加danger样式的元素
            cont.off('click.valiTip');
            var errorRule = '';
            for(var rule in rulesOnEl){
                if(rulesOnEl.hasOwnProperty(rule)){
                    var method=$.validator.methods[rule];
                    if(method && !method(rulesOnEl[rule],el)){// 定义了该验证方法且验证结果为 false
                        errorRule || (errorRule = rule);
                        break;
                    }
                }
            }
            if(errorRule==''){
                cont.removeClass('dangerI');
            }
            else{
                cont.addClass('dangerI');
                var msg=(messages && messages[name] && messages[name][errorRule]) ?
                    messages[name][errorRule]:
                    $.validator.messages[errorRule]||'校验未通过';
                msg = _formatMsg(msg,rulesOnEl[errorRule]);
                cont.on('click.valiTip',(function(msg){
                    return function(){
                        if(options.callback){
                            options.callback(el,msg);
                        }else alert(msg);// TODO 显示验证信息
                    };
                })(msg));
                return false;
            }
            return true;
        };
        var _validateAll=function(){
            var status=true;
            for(var name in rules){
                if(rules.hasOwnProperty(name)){
                    var el=form.find('[name="'+name+'"]')
                        ,rulesOnEl=rules[name];
                    if(rulesOnEl && _validateEl(el, name, rulesOnEl,messages)==false){// 对此元素定义了规则且验证未通过
                        status=false;
                    }
                }
            }
            return status;
        };
        form
            .on('blur.validate','[name]',function(){// 失焦时根据规则校验-暂只考虑文本框
                var el=$(this)
                    ,name=el.attr('name')
                    ,rulesOnEl=rules[name];
                if(rulesOnEl){// 对此元素定义了规则
                    _validateEl(el, name, rulesOnEl,messages);
                }
            })
            .submit(function(){
                return _validateAll();
            });
        return {
            validateAll: _validateAll
        };
    };
    /**
     * 显示 el 上验证提示信息 msg
     * @param el
     * @param msg
     */
    $.showValiTip=function(el,msg){
        layer.tips(msg,el,{
            tips: [1, '#FF9901']
            ,time: 1000
        });
    };
    /**
     * 显示 alert 弹框
     * @param msg {string} 提示信息
     * @param cb {function=} 关闭时的回调函数
     */
    $.showAlert=function(msg,cb){
        layer.alert(msg,{
            title: false //不显示标题
            ,closeBtn:0
        },function(index){
            cb && cb();
            layer.close(index);
        })
    };
    /**
     * 显示 msg 弹框
     * @param msg {string} 提示信息
     * @param cb {function=} 关闭时的回调函数
     */
    $.showMsg=function(msg,cb){
        layer.msg(msg,{
            shade: 0.3
            ,time:1000
            ,end:cb
        });
    };
    /**
     * 计算包含中英文字符混合的字符串的长度
     * @param str 要计算长度的字符串
     * @returns {number}
     */
    $.getZhStrLength=function(str){
        var totalLength = 0;
        if(!!str) {
            var list = str.split("");
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
    /* 验证规则定义 */
    $.validator={
        messages: {
            'required': '此字段必填'
            ,'requiredNoTrim': '此字段必填'
            ,'number': '此字段必须为数字'
            ,'maxlength': '此字段值最多{0}个字符'
            ,'length': '此字段值为{0}个字符'
            ,'ZhStrMaxLength': '此字段最多{0}个字符（中文计为2个字符）'
            ,'ZhStrRangeLength': '此字段限制{0}-{1}个字符（中文计为2个字符）'
            ,'isPhone': '电话号码格式错误'
            ,'isCardNo': '身份证号格式错误'
            ,'regularName':'此字段只能由字母、数字、下划线组成'
        },
        // 验证通过时返回 true，不通过时返回 false
        methods: {
            'required': function(limit, el) {
                if(limit){
                    var val = el.val().trim();
                    return val && val.length > 0;
                }
                return true;
            }
            // 必填，但允许前后空格
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
                    return !val || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(val);
                }
                return true;
            }
            ,'maxlength': function(limit, el) {
                if(typeof limit=='number'){
                    var val = el.val();
                    return !val || val.length <= limit;
                }
                return true;
            }
            ,'length': function(limit, el) {
                if(typeof limit=='number'){
                    var val = el.val();
                    return !val || val.length == limit;
                }
                return true;
            }
            // 字符最大长度验证（一个中文字符长度为2）
            ,'ZhStrMaxLength': function(limit, el){
                if(typeof limit=='number'){
                    var val = el.val();
                    return !val || $.getZhStrLength(val)<=limit;
                }
                return true;
            }
            // 字符长度区间验证（一个中文字符长度为2）不能在用class属性定义验证规则时使用,取不到区间的值
            ,'ZhStrRangeLength': function(limit, el){
                if(limit.constructor==Array){
                    var val = el.val()
                        ,length = $.getZhStrLength(val);
                    return !val || (length >=limit[0] && length <= limit[1]);
                }
                return true;
            }
            // 联系电话(手机/电话皆可)验证
            ,'isPhone': function(limit, el){
                if(limit){
                    var val = el.val()
                        ,length = val.length
                        ,mobileRex = /^(1[3|4|5|8][0-9]{1})+\d{8}$/
                        ,telRex = /^(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
                    return !val || (telRex.test(val) || (length == 11 && mobileRex.test(val)));
                }
                return true;
            }
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            ,'isCardNo':function(limit, el){
                if(limit){
                    var val = el.val()
                        ,cardNoRex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                    return !val || cardNoRex.test(val);
                }
                return true;
            }
            ,'regularName':function(limit, el){
                if(limit){
                    var val = el.val()
                        ,cardNoRex = /(^[\da-zA-Z_]+$)/;
                    return !val || cardNoRex.test(val);
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
    /**
     * 获取当前日期 TODO 扩展为从服务器获取
     * return {Date}
     */
    $.getDate=function(){
        return new Date();
    };
    /**
     * 获取元素中定义了 name 属性的元素的 value，调用此方法的元素必须为 form
     * @returns {Object} 键值对
     */
    $.fn.serializeObject=function(){
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if(this.name!='' && this.name!=null){
                if (o[this.name] != undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            }
        });
        return o;
    };
    /**
     * 显示 loading 动画
     */
    $.showLoading=function(){
        if($('body>.loadingdata').length<=0){
            $('body').append('<div class="loadingdata"></div>');
        }
    };
    /**
     * 隐藏 loading 动画
     */
    $.hideLoading=function(){
        var loading=$('body>.loadingdata');
        if(loading.length>0){
            loading.remove();
        }
    };
    /**
     * 初始化 tree，调用此方法的元素必须定义了 id
     * @param {object} opts 用户配置
     *  - opts.url {string} 树数据源请求地址
     *  - opts.urlArgs {object=} 树数据源请求时向后台传递的参数
     *  - opts.multi {bool=} 是否多选，默认为 false
     *  - opts.selParams {Array=} 指定加载完成后选中项条件[key,value]
     *  - opts.async {object=} ztree 初始化时的 setting.async
     *  - opts.check {object=} ztree 初始化时的 setting.check
     *  - opts.callback  {object=} ztree 初始化时的 setting.callback
     *  - opts.edit  {object=} ztree 初始化时的 setting.edit
     *  - opts.view  {object=} ztree 初始化时的 setting.view
     *  - opts.key {object=} ztree 初始化时的 setting.data.key
     *  - opts.simpleData {object=} ztree 初始化时的 setting.data.simpleData（opts.simple.enable: false 使用/不使用 简单数据模式，默认为树形结构）
     *  - opts.afterInit {function=} 完成初始化后调用的方法
     * @return {object|undefined} obj
     *  - obj.treeId: 当前树 id
     *  - obj.setting: ztree 初始化时使用的 setting
     *  - obj.reset(url,urlArgs): 重新请求数据源,若未定义 url 或 urlArgs，则使用初始化时的配置重新请求
     *  - obj.getNodeById(tId): 根据 tid 获取节点
     */
    $.fn.initZTree=function(opts){
        if(!opts || !opts.url) return;
        var treeId = $(this).attr('id') // 树控件 id
            ,multi = opts.multi || false;
        var _conf={
//            ,statistic: 1// TODO 统计项最小层级，最小为 0
//            ,hiddenList: []// 记录当前被隐藏节点的数组
//            ,keyword: ''// 记录关键字
            // 辅助参数
            filterRemains: 0// 搜索关键字时修改节点高亮属性及展开父节点（会造成延时）的剩余操作总数 - 暂只用于初始化
            ,firstNodeId: undefined// 搜索到的第一个符合层级的节点 tId，即要移入视图的节点 - 暂只用于初始化
            ,filtering: false
            ,initTimer: undefined
        };
        var _ztree={
            'treeId':treeId
            // 根据用户配置初始化 zTree setting
            ,'setting':(function(opts,multi){
                var setting={
                    data: {
                        key: opts.key,
                        simpleData: opts.simpleData
                    },
                    check: $.extend({
                        enable: multi // 是否显示复选框
                        ,chkboxType: { "Y": "", "N": "" } // 禁止级联
                    },opts.check || {}),
                    view: $.extend({
                        // 根据 treeNode.highlight 设置节点样式
                        fontCss: function (treeId, treeNode) {
                            return (!!treeNode.highlight) ? {color: "#A60000", "font-weight": "bold"} : {color: "#333", "font-weight": "normal"};
                        },
                        selectedMulti: multi
                    },opts.view || {}),
                    callback: opts.callback || {}
                };
                // 因为聚焦元素时会展开节点（异步），所以要加入默认操作
                if(setting.callback.onExpand){
                    var _onExtend=setting.callback.onExpand;
                    setting.callback.onExpand=function (event, treeId, node) {
                        if (!_conf.filtering){
                            _onExtend(event, treeId, node);
                        }else{// 过滤时展开完成，操作总数-1，不执行用户操作
                            _conf.filterRemains--;
                            _afterFilterOpt(treeId);
                        }
                    }
                }
                return setting;
            })(opts,multi)
        };
        /**
         * 搜索到的所有节点的祖先节点及属性修改完成后，将 _conf.firstNodeId 对应的节点滚入视图
         * @param treeId {string} zTree 容器DOM元素的 id
         * @param init {bool=} 是否是由初始化函数触发
         */
        var _afterFilterOpt=function(treeId,init){
            init && _conf.initTimer && clearInterval(_conf.initTimer);// 关闭树初始化计时器
            if(_conf.filtering && _conf.filterRemains==0){// 所有节点操作完成，使第一个高亮节点进入视图
                if(init){// 初始化完成
                    opts.afterInit && opts.afterInit();
                }
                var nodeId =_conf.firstNodeId;
                if(nodeId !== undefined){
                    var _treeDom=document.getElementById(treeId);
                    var _treeBCR=_treeDom.getBoundingClientRect()
                        ,_nodeBCR=document.getElementById(nodeId).getBoundingClientRect();
                    if(_nodeBCR.top + 20 > _treeBCR.bottom){
                        _treeDom.scrollTop+=_nodeBCR.top + 20-_treeBCR.bottom;
                    }else if(_nodeBCR.top < _treeBCR.top){
                        _treeDom.scrollTop+=_nodeBCR.top-_treeBCR.top;
                    }
                    _conf.firstNodeId=undefined;
                }
                _conf.filtering=false;
            }
        };
        var _initTree=function(){
            // 请求数据初始化树
            $.ajax({
                type: "post",
                dataType: "json",
                url: opts.url,
                data: opts.urlArgs || {},
                success: function (result) {
                    if(HASINTERACTION){
                        if(!result.success){
                            result.msg && $.showAlert(result.msg);
                            return;
                        }
                        var data=result.data;
                    }else{
                        var data=result;
                    }
                    if(typeof(data)=='string') data=JSON.parse(data);
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    treeObj && treeObj.destroy();
                    $.fn.zTree.init($("#"+treeId), _ztree.setting, data);
                    // 根据选中项设置级联父子节点
//                treeObj = $.fn.zTree.getZTreeObj(treeId);
//                var checkedNodes = treeObj.getCheckedNodes(true);
//                for (var i = 0; i < checkedNodes.length; i++) {
//                    treeObj.checkNode(checkedNodes[i], true, true);
//                }
                    // 初始化树时，开启计时器，当树完成初始化后，将选中项移入视图
                    _conf.initTimer = setInterval(function(){
                        var treeObj= $.fn.zTree.getZTreeObj(treeId);
                        if(!treeObj) return;// 树初始化仍未完成
                        if(opts.selParams){// 定义了默认选中项，选中第一个符合的项，若无，则选中第一项
                            var selNode=treeObj.getNodeByParam(opts.selParams[0],opts.selParams[1]);
                            if(!selNode){
                                selNode=treeObj.getNodes()[0];
                            }
                            if(selNode){
                                $('#'+selNode.tId+'_a').click();
                                treeObj.selectNode(selNode);
                            }
                        }
//                        var checkedNodes = treeObj.getCheckedNodes(true);
                        var checkedNodes = treeObj.getSelectedNodes(true);
                        if(checkedNodes.length>0){
                            var node=checkedNodes[0];
                            !multi && treeObj.selectNode(node);// 单选，选中第一项
                            _conf.firstNodeId = node.tId.replace(/\s/g,'_');// 记录需移入视图的节点 id
                            _conf.filterRemains ++;// 新增一个父节点操作
                            _conf.filtering = true;
                            // 展开第一个选中项的父节点
                            var pnode=node
                                ,level=node.level;
                            while(level>0){
                                pnode=pnode.getParentNode();
                                if(pnode.open==false) {
                                    _conf.filterRemains ++;// 新增一个父节点操作
                                    /* 展开父节点，完成后触发 onExpand */
                                    treeObj.expandNode(pnode, true, false, true, true);
                                    break;// expandNode 操作会展开父级节点
                                }
                                level--;
                            }
                            _conf.filterRemains--;
                        }
                        _afterFilterOpt(treeId,true);
                    },50);
                }
            });
        };
//        /**
//         * 根据关键字过滤节点 TODO
//         * @param treeId {string} zTree 容器DOM元素的 id
//         * @param keyField {string} 节点数据搜索字段的属性名
//         * @param value {string} 搜索关键字不区分大小写
//         */
//        _ztree.filter=function(treeId, keyField, value) {
//            var keyword=_conf.keyword;
//            if(value) value=value.toLocaleLowerCase();// 将关键字转为小写
//            if(keyword == value) return;// 关键字未变化
//            _conf.keyword = keyword = value;
//            _conf.filtering = true;
//            var treeObj = $.fn.zTree.getZTreeObj(treeId);
//            var nodes=treeObj.getNodes();
//            var childrenField=treeObj.setting.data.key.children;
//            /**
//             * @return {boolean} nodes 中是否存在需要显示的节点
//             */
//            var chargeNodes=function(nodes){
//                if(!nodes || !nodes.length) return false;
//                var show=false;
//                for(var i= 0,node,children,nodeShow=false;i<nodes.length;i++){
//                    node=nodes[i];
//                    children=node[childrenField];
//                    nodeShow=chargeNodes(children);// 先判断子孙中是否有匹配的节点
//                    if(!keyword){
//                        node.highlight=false;
//                        nodeShow=true;
//                    }else if(typeof node[keyField] == "string" && node[keyField].toLowerCase().indexOf(keyword)>-1){// 当前节点匹配
//                        node.highlight=true;
//                        nodeShow=true;
//                    }else{
//                        node.highlight=false;
//                    }
//                    if(nodeShow){
//                        treeObj.showNode(node);
//                    }else{
//                        treeObj.hideNode(node);
//                        _conf.hiddenList.push(node);
//                    }
//                    treeObj.updateNode(node);// 更新节点状态
//                    show = show || nodeShow;
//                }
//                return show;// 没有匹配的子节点
//            };
//            _conf.hiddenList.length=0;
//            chargeNodes(nodes);
//            if(keyword) treeObj.expandAll(true);// 搜索结果全部展开
//            $("#dicKey").focus();
//        };
        /**
         * 请求数据源，初始化树
         * @param url {string=}
         * @param urlArgs {object=}
         * @param selParams {Array=} 默认选中项条件 [key,value]
         */
        _ztree.reset=function(url,urlArgs,selParams){
            if(url) opts.url=url;
            if(urlArgs) opts.urlArgs=urlArgs;
            if(selParams) opts.selParams = selParams;
            _initTree();
        };
        _ztree.getNodeById=function(tId){
            return $.fn.zTree.getZTreeObj(treeId).getNodeByTId(tId);
        };
        _initTree();
        return _ztree;
    };
    /**
     * 初始化弹出控件，依赖 layer，弹出页面依赖 layer
     * @param callback {function} 弹框中的页面可调用的回调函数（不再关闭弹框，关闭需调用 parent.closeLayer['..']()）
     *  - callback(args)
     *    args: {object|undefined} 弹框页面传回主页面的值
     * @param apiName {string} 当前组件对应的选中事件方法名，供弹出的 iframe 页面中调用，避免多个 layer 组件冲突
     * 开放 window.cusLayer 接口供 iframe 调用
     *  - window.cusLayer[apiName](args,w)
     *    args: {object|undefined} 弹框页面传回主页面的值
     *    w: 是否用弹框中的值覆盖原始值，仅当其为 true 时，会调用 callback(args)
     * - window.closeLayer[apiName]() 关闭当前弹窗
     * @return {object} obj
     *  - obj.show(opts) 显示弹框
     *    - opts.content {string} 必须项，弹框页面 url
     *    - opts.title {string=} 弹框标题，默认不显示标题
     *    - opts.area {Array=} 弹框大小，默认为：['400px', '90%']
     */
    $.initCusLayer=function(callback,apiName){
        var curLayerIdx;// 记录当前弹窗索引，用于关闭
        if(!window.cusLayer) window.cusLayer={};
        if(!window.closeLayer) window.closeLayer={};
        window.cusLayer[apiName]=function(args,w){
            if(w){// 设置了值
                callback(args);
            }else{// 未提交修改
//                alert('cancel');
            }
//            layer.close(curLayerIdx);
        };
        window.closeLayer[apiName]=function(){
            layer.close(curLayerIdx);
        };
        return {
            show:function(options){
                curLayerIdx = layer.open($.extend({
                    type: 2,
                    title: false,
//                shadeClose: true,// 允许点遮罩层关闭
                    shade: 0.5,// 遮罩层透明度
                    area: ['400px', '90%'],
                    cancel:window.closeLayer[apiName]
                },options));
            }
        };
    };
    /**
     * 初始化表格，当前元素中必须包含 .listtableDiv
     * @param opts {object}
     *  - opts.url {string} 请求路径
     *  - opts.args {object=} 请求参数的键值对
     *  - opts.showno {bool=} 是否显示序号，默认为 false
     *  - opts.chkField {bool|string=} 若定义此属性，则显示复选框列。若值为 string，则根据 chkField 对应的值初始化选中状态。
     *  - opts.singleChk {bool=} 若定义为 true，则只能进行单选，默认为 false
     *  - opts.page {object} 分页数据
     *      opts.page.percount {int} 默认每页数据条数
     *      opts.page.perList {Array} 分页数据列表
     *  - opts.prompt {bool=} 无数据时是否显示提示，默认为 true
     *  - opts.cols {Array=} 列定义 [{field,...}]
     *      opts.cols[i].field {string} 该列对应的属性名
     *      opts.cols[i].name {string=} 该列的标识，默认与 field 相同
     *      opts.cols[i].title {string} 该列显示的标题文本
     *      opts.cols[i].showTip {bool=} 该列是否显示 title，默认为 false
     *      opts.cols[i].type {string} 该列显示的数据类型，默认为：'string'，可选值：'number','string'
     *      opts.cols[i].width {string} 该列宽度，需带单位
     *      opts.cols[i].align {string} 对齐方式，可选值：'center','left','right'。不指定时，type='string'时为'left'，type='number'时为'right'
     *      opts.cols[i].sort {bool} 该列是否允许排序，默认 false
     *      opts.cols[i].render {function} 该列的渲染函数 render(val,row,i,grid) val 单元格值，row 行数据，i 当前行索引，grid 接口对象；返回 dom 字符串
     *      opts.cols[i].hrender {function} 该列标题部分的渲染函数 hrender(name,title) 当前列的 name 及 title
     *  - opts.callback {object=} 回调函数定义
     *      opts.callback.cell {object=} 单元格事件
     *          cell:{
     *              'ctrl':{     // 对应 cols 中定义的 opts.cols[i].name
     *                  'click':function(e,val,row,i){...}    // this 指向当前单元格 dom 对象，参数参考 opts.cols[i].render，e 为触发事件的 event 对象
     *              }
     *          }
     *      opts.callback.row {object=} 行事件
     *          row:{
     *              'click':function(e,row,i){...}    // this 指向当前行 dom 对象，参数参考 opts.callback.cell
     *          }
     *      opts.callback.afterShowData {function=} 显示完数据的回调函数
     *          function(grid){...}
     *      opts.callback.onCheckRow{function=} 选中行时的回调函数
     *          function(row,i,el){...} 参数依次是：行数据，行索引，行对应的tr对象
     *      opts.callback.onUnCheckRow{function=} 取消行选中时的回调函数
     *          function(row,i,el){...} 参数依次是：行数据，行索引，行对应的tr对象
     * ========================
     * @return {object|undefined} obj 接口对象
     *   - obj.el 获取当前 grid 对应的 el
     *   - obj.findCol(key,name) 根据条件查找所有符合的 cols[i].key=val 的列定义对象集合，未找到则为 []
     *   - obj.findRow(field,val) 根据条件查找所有符合的 data[i].field=val 的行对象集合，未找到则为 []
     *   - obj.getCheckedIdx() 获取当前列表所有选中行索引
     *   - obj.getCheckedRows() 获取当前列表所有选中行
     *   - obj.checkRow(row,chk) 改变指定行的选中状态
     *       row {object|Array} 要选中的行对应的数据，支持多条数据组成的数组
     *       chk {bool} true 时改为选中，false 改为不选中
     *   - obj.setData(data) 重置当前显示的数据列表
     *       data 新的列表数据
     *   - obj.getData() 返回当前显示的数据列表
     *   - obj.getPage() 返回当前的分页信息，返回值 {percount,totalpage,curpage,totalcount}
     *   - obj.resetData(cusOpts) 扩展初始化时的配置，重新请求数据（分页），不重绘整个 Grid
     *   - obj.destroy(cusOpts) 销毁 grid
     */
    $.fn.initGrid=function(opts){
        var el=$(this);
        if(!opts) return;
        if(!el.hasClass('listtableDiv')) el.addClass('listtableDiv');
        var _args=opts.args
            ,_page=opts.page
            ,_chkField=opts.chkField
            ,_cols=opts.cols
            ,_cb=opts.callback
            ,_data; // 记录当前页数据
        var _manuObj
            ,_returnObj;
        // 未定义选中状态字段名，且允许单选或多选
        if(typeof _chkField != 'string' && (opts.singleChk || _chkField==true)){
            _chkField='__checked';
        }
        /**
         * 根据条件查找所有符合的 cols[i].key=val 的列
         * @param key
         * @param val
         * @return {Array} 所有符合的列定义对象集合，未找到则为 []
         * @private
         */
        var _findCol=function(key,val){
            var idxArr=[];
            for(var i=0;i<_cols.length;i++){
                var col=_cols[i];
                if(col[key]==val){
                    idxArr.push(col);
                }
            }
            return idxArr;
        };
        /**
         * 根据条件查找所有符合的 data[i].field=val 的行
         * @param field
         * @param val
         * @return {Array} 所有符合的行对象集合，未找到则为 []
         * @private
         */
        var _findRow=function(field,val){
            var rows=[];
            for(var i=0;i<_data.length;i++){
                var row=_data[i];
                if(row[field]==val){
                    rows.push(row);
                }
            }
            return rows;
        };
        /**
         * 改变指定行的选中状态
         * @param row {object|Array} 要选中的行对应的数据
         * @param chk {bool} true 时改为选中，false 改为不选中
         */
        var _checkRow=function(row,chk){
            if(!_chkField) return;// 未定义可选中
            var applyRow=function(r,rChk){
                var oldChk=!!r[_chkField];// 修改前的选中状态
                if(oldChk != rChk){
                    r[_chkField]=rChk;
                    var i=parseInt(_data.indexOf(r));
                    var rowEl=el.find('tbody>tr[data-i="'+i+'"]');
                    rChk ? rowEl.addClass('trchk') : rowEl.removeClass('trchk');
                    !opts.singleChk && rowEl.find('>td[data-name="'+_chkField+'"]>input').prop('checked',rChk);
                    _cb && _cb.onCheckRow && rChk && _cb.onCheckRow(r,i,rowEl);// 选中回调
                    _cb && _cb.onUnCheckRow && !rChk && _cb.onUnCheckRow(r,i,rowEl);// 取消选中回调
                }
            };
            var chkStats=!!chk,i;
            // 单选情况下选中，先取消其他行选中
            if(opts.singleChk && chkStats==true){
                var idxs=_getCheckedIdx();
                for(i=0;i<idxs.length;i++){
                    applyRow(_data[idxs[i]],false);
                }
            }
            if(Object.prototype.toString.call(row) === '[object Array]'){// 修改数组中的行的选中状态
                for(i=0;i<row.length;i++){
                    applyRow(row[i],chkStats);
                }
            }else{
                applyRow(row,chkStats);
            }
        };
        /**
         * 根据请求获取的数据绘制表格内容
         * @param datalist 数据列表
         * @private
         */
        var _drawFn=function(datalist){
            if(!HASINTERACTION){
                if(!datalist){
                    datalist=[
                        {"id":"zd001","ID":"zd001","code": "code1","mc": "职位","lx":1,"strvalue":"ZW"
                            ,"itemmc": null,"itemvalue": "1","ms":"初中ms"
                            ,"NAME": "百度","ACCESSADDRESS": "http://www.baidu.com","ISUSING":1}
                        ,{"id":"zd002","ID":"zd002","code": "code2","mc": "姓名","lx":2,"strvalue":"XM"
                            ,"itemmc": "高中2","itemvalue": "2","ms":"高中ms"
                            ,"NAME": "菜单管理","ACCESSADDRESS": "http://qq.com","ISUSING":0}
                        ,{"id":"zd003","ID":"zd003","code": "code3","mc": "姓名","lx":3,"strvalue":"XM"
                            ,"itemmc": "高中3","itemvalue": "3","ms":"高中ms"
                            ,"NAME": "菜单管理","ACCESSADDRESS": "http://qq.com","ISUSING":0}
                        ,{"id":"zd004","ID":"zd004","code": "code4","mc": "姓名","lx":3,"strvalue":"XM"
                            ,"itemmc": "高中4","itemvalue": "4","ms":"高中ms"
                            ,"NAME": "菜单管理","ACCESSADDRESS": "http://qq.com","ISUSING":0}
                        ,{"id":"zd005","ID":"zd005","code": "code5","mc": "姓名","lx":3,"strvalue":"XM"
                            ,"itemmc": "高中5","itemvalue": "5","ms":"高中ms"
                            ,"NAME": "菜单管理","ACCESSADDRESS": "http://qq.com","ISUSING":0}
                        ,{"id":"zd006","ID":"zd006","code": "code6","mc": "姓名","lx":3,"strvalue":"XM"
                            ,"itemmc": "高中6","itemvalue": "6","ms":"高中ms"
                            ,"NAME": "菜单管理","ACCESSADDRESS": "http://qq.com","ISUSING":0}
                    ];
                }
            }
            var startNo=1;
            if(_manuObj && _manuObj.page){
                startNo=(_manuObj.page.curpage-1)*_manuObj.page.percount+1 || 1;// 根据分页对象获得第一条的序号
            }
            _data=datalist;
            var dataStr='';
            if(datalist && datalist.length>0){
                for(var i=0;i<datalist.length;i++){
                    var data=datalist[i];
                    if(_chkField && data[_chkField]){// 当前行选中
                        dataStr+='<tr data-i="'+i+'" class="trchk">';
                    }else{
                        dataStr+='<tr data-i="'+i+'">';
                    }
                    if(opts.showno){
                        dataStr+='<td class="ctrltd">'+(startNo+i)+'</td>';
                    }
                    if(_chkField && !opts.singleChk){
                        dataStr+='<td style="text-align:center;" data-name="'+_chkField+'"><input type="checkbox"'+(data[_chkField] ? ' checked':'')+' /></td>';
                    }
                    for(var j= 0,col,cssStr;j<_cols.length;j++){
                        col=_cols[j];
                        cssStr='';
                        if(col.align) cssStr+='text-align:center;';// 对齐方式
                        if(cssStr) cssStr=' style="'+cssStr+'"';// 需要定义 style
                        dataStr+='<td data-name="'+col.name+'"'+cssStr+(col.showTip ? ' title="'+(data[col.field]||'')+'"' : '')+'>'
                            +(col.render ? col.render(data[col.field],data,i,_returnObj) : data[col.field]||'')
                            +'</td>';
                    }
                    dataStr+='</tr>';
                }
            }else if(opts.prompt!=false){
                var colspan=_cols.length;
                opts.showno && colspan++;
                _chkField && !opts.singleChk && colspan++;
                dataStr='<tr><td class="nodata" colspan="'+colspan+'">未查询到符合条件的数据!</td></tr>'
            }
            el.find('tbody').html(dataStr);
            _cb && _cb.afterShowData && _cb.afterShowData(_returnObj);
        };
        /**
         * 获取当前列表所有选中行索引
         * @return {Array}
         * @private
         */
        var _getCheckedIdx=function(){
            var sels=[];
            if(_chkField){
                for(var i=0;i<_data.length;i++){
                    if(_data[i][_chkField]) sels.push(i);
                }
            }
            return sels;
        };
        var _initBindEvent=function(){
            if(_cb){
                var name,eType;// 临时变量
                // 行事件
                var cbRow=_cb.row;
                if(typeof cbRow=='object'){
                    var cbRowHandle=function(handle){
                        return function(e){
                            var el=$(this)
                                ,i=parseInt(el.attr('data-i'));
                            handle.call(this,e,_data[i],i);
                        };
                    };
                    for(eType in cbRow){
                        if(cbRow.hasOwnProperty(eType))
                            el.on(eType+'.row','tbody>tr',cbRowHandle(cbRow[eType]));
                    }
                }
                // 单元格事件
                var cbCell=_cb.cell;
                if(typeof cbCell=='object'){
                    var cbCellHandle=function(handle,name){
                        var col=_findCol('name',name)[0];
                        return function(e){
                            var el=$(this)
                                ,i=parseInt(el.parent().attr('data-i'));
                            handle.call(this,e,_data[i][col.field],_data[i],i);
                        };
                    };
                    for(name in cbCell){
                        if(cbCell.hasOwnProperty(name))
                            for(eType in cbCell[name]){
                                if(cbCell[name].hasOwnProperty(eType)){
                                    el.on(eType+'.cell_'+name,'tbody>*>td[data-name="'+name+'"]',cbCellHandle(cbCell[name][eType],name));
                                }
                            }
                    }
                }
            }
            // 默认行点击变色事件
            el.on('click._row','tbody>tr[data-i]',function(){
                var tr=$(this);
                if(tr.hasClass('now')) return;
                tr.siblings('.now').removeClass('now');
                tr.addClass('now');
            });
            // 行选中事件
            if(_chkField){
                // 单选
                if(opts.singleChk){
                    el.on('click.chk','tbody>tr[data-i]',function(){
                        var tr=$(this)
                            ,rowI=parseInt(tr.attr('data-i'))
                            ,stat=_data[rowI][_chkField];
                        _checkRow(_data[rowI], !stat);// 复选或单选情况未被选中
                    });
                }
                // 复选
                else{
                    el.on('click.chk','tbody>tr>td[data-name="'+_chkField+'"]',function(){
                        var td=$(this)
                            ,rowI=parseInt(td.parent().attr('data-i'))
                            ,stat=_data[rowI][_chkField];
                        _checkRow(_data[rowI], !stat);// 复选或单选情况未被选中
                    });
                    el.on('click.chkAll','thead>tr>[data-name="'+_chkField+'"]',function(e){
                        var stat,input;
                        input=$(this).children('input');
                        if(e.target.tagName.toLocaleLowerCase()=='input'){// 事件源是 input
                            stat=input.prop('checked');
                        }else{
                            stat=!input.prop('checked');
                        }
                        input.prop('checked',stat);
                        _checkRow(_data,stat);
                    });
                }
            }
        };
        /* 创建表格 */
        /**
         * 绘制表格，确定表头，并完成事件绑定
         * @private
         */
        var _initTable=function(){
            var colAlignArr=['center','left','right'];// col.align 合法值
            var tableStr='<table class="listtable" cellspacing="0" cellpadding="0">' +
                '<thead><tr>';
            if(opts.showno){
                tableStr+='<th style="width:50px;">&nbsp;</th>';
            }
            if(_chkField && !opts.singleChk){// 复选
                tableStr+='<th style="width:30px;" data-name="'+_chkField+'"><input type="checkbox" /></th>';
            }
            for(var i= 0,col;i<_cols.length;i++){
                col=_cols[i];
                // name
                if(!col.name) col.name=col.field;
                // 水平对齐方式
                if(col.align && colAlignArr.indexOf(col.align)!=-1){// 指定了合法的 align
                    if(col.align=='left') delete col.align;// 此列为默认对齐方式
                }else if(col.type=='number'){// 未指定 align，且为数字，居右显示
                    col.align='right';
                }else{
                    delete col.align;
                }
                var colStr=col.hrender ? col.hrender() : col.title;
                tableStr+='<th style="'+(col.width ? 'width:'+col.width : '')+'" data-name="'+col.name+'">'+colStr+'</th>';
            }
            tableStr+='</tr></thead>' +
                '<tbody></tbody>' +
                '</table>';
            el.append(tableStr);// 将表格添加到 DOM
            /* 创建回调监听 */
            _initBindEvent();
        };
        /**
         * 请求数据（分页）并绘制到 DOM
         * @private
         */
        var _bindData=function(){
            if(_page){// 分页列表
                var manu=el.next('.manu');
                if(!manu.length){
                    manu=$('<div class="manu"></div>');
                    el.after(manu);
                }
                _manuObj=manu.initPageBar(opts.url,_page.percount,_drawFn,opts.args,true,_page.perList);
            }else{// 不分页列表
                el.request(opts.url,_drawFn,opts.args,true);
            }
        };
        /**
         * 销毁 grid
         * @private
         */
        var _destroy=function(){
            if(!el || !el.children().length) return;
            /* 解绑事件监听 */
            if(_cb){
                var name,eType;// 临时变量
                // 行事件
                var cbRow=_cb.row;
                if(typeof cbRow=='object'){
                    for(eType in cbRow){
                        if(cbRow.hasOwnProperty(eType))
                            el.off(eType+'.row');
                    }
                }
                // 单元格事件
                var cbCell=_cb.cell;
                if(typeof cbCell=='object'){
                    for(name in cbCell){
                        if(cbCell.hasOwnProperty(name))
                            for(eType in cbCell[name]){
                                if(cbCell[name].hasOwnProperty(eType)){
                                    el.off(eType+'.cell_'+name);
                                }
                            }
                    }
                }
            }
            el.off('click.chk')
                .off('click.chkAll')
                .off('click._row');
            /* 解绑分页 */
            if(_manuObj){
                _manuObj.destroy();
            }
            el.next('.manu').remove();
            // 清空 DOM
            el.html('');
        };
        _returnObj={
            el:el
            /**
             * 根据条件查找所有符合的 cols[i].key=val 的列
             */
            ,findCol:_findCol
            /**
             * 根据条件查找所有符合的 data[i].field=val 的行
             */
            ,findRow:_findRow
            /**
             * 获取当前列表所有选中行索引
             */
            ,getCheckedIdx:_getCheckedIdx
            /**
             * 获取当前列表所有选中行
             */
            ,getCheckedRows:function(){
                var chks=_getCheckedIdx();
                var rows=[];
                for(var i=0;i<chks.length;i++){
                    rows.push(_data[chks[i]]);
                }
                return rows;
            }
            /**
             * 返回当前显示的数据列表
             * @returns {object}
             */
            ,getData:function(){
                return $.extend([],_data);
            }
            /**
             * 改变指定行的选中状态
             * @param row {object} 要选中的行对应的数据
             * @param chk {bool} true 时改为选中，false 改为不选中
             */
            ,checkRow:function(row,chk){
                _checkRow(row,chk);
            }
            /**
             * 重置当前显示的数据列表
             * @param {object} data 新的列表数据
             */
            ,setData:function(data){
                _drawFn(data);
            }
            /**
             * 返回当前的分页信息
             * @returns {object}
             */
            ,getPage:function(){
                if(_manuObj) return $.extend([],_manuObj.page);
            }
            /**
             * 扩展初始化时的配置，重新请求数据（分页），不重绘整个 Grid
             * @param cusOpts {object=} 若不定义则直接以原始配置请求数据
             *  - cusOpts.url {string=} 请求路径
             *  - cusOpts.args {object=} 请求参数的键值对
             *  - cusOpts.page {object=} 分页数据
             *      cusOpts.page.percount {int} 默认每页数据条数
             *      cusOpts.page.perList {Array} 分页数据列表
             */
            ,resetData:function(cusOpts){
                if(cusOpts){
                    if(cusOpts.url) opts.url=cusOpts.url;
                    if(cusOpts.args) $.extend(_args,cusOpts.args);
                    if(cusOpts.page) $.extend(_page,cusOpts.page);
                }
                _bindData();
            }
            /**
             * 销毁 grid
             */
            ,destroy:_destroy
        };
        _destroy();
        _initTable();
        _bindData();
        return _returnObj;
    };
    /**
     * 将 .tab-box 元素初始化为 tab 容器
     * @param opts
     *   - opts.head {Array}
     *     opts.head[i].val {string} tab 页标识
     *     opts.head[i].txt {string=} tab 页标题，默认与 val 一致
     *     opts.head[i].remove {bool=} 是否可关闭，默认为 false
     *     opts.head[i].width {string=} 头部宽度，默认 '120px'
     *   - opts.headAlign {string=} 若设为 ‘right’ 则将 tab 头部居右显示
     *   - opts.noAdjust 是否禁止自动调整尺寸，默认为 false
     *   - opts.showAdd {bool=} 是否显示添加按钮，默认为 false
     *   - opts.addHandler() {function=} 添加按钮的事件
     *   - opts.onChange(val) {function=} 切换tab时触发事件，参数为要选中的 tab.val
     *   - opts.onRemove(val) {function=} 删除tab时触发事件，参数为要删除的 tab.val
     * @return {object|undefined} obj
     *   - obj.addTab(tab,cont)
     *     tab {object} tab 页对象，结构同 opts.head
     *     cont {string=} 对应内容部分 DOM 字符串
     *     noToggle {bool=} 添加后是否不立即切换，默认为 false，即，添加即切换
     *   - obj.getTabs(key,value) 选中所有符合条件的 tab 列表，无条件则选择全部，未找到则返回 []
     *     key {string} tab 页对象中的键：val,txt,remove
     *     value {string=}
     *   - obj.removeTab(tab) 删除指定的 tab
     *   - obj.selectTab(tab) 切换到指定的 tab
     *   - obj.adjust() 手动计算绘制头部尺寸
     *   - obj.getContEl(tab) 获取内容部分的 jquery 元素对象
     */
    $.fn.initTabBox=function(opts){
        var el=$(this);
        if(!el.hasClass('tab-box')) return;
        var _returnObj;
        var contBoxEl=el.children('.tab-cont-box');
        var headBoxEl=el.children('.tab-head-box');
        var _tabs=[];
        var tabGuid;// tab 的标识
        if(!opts.noAdjust){
            tabGuid= $.generateGuid('tab');
        }
        var _destroy=function(){
            if(headBoxEl.length){
                _tabs.length=0;
                tabGuid && $(window).off('resize.tab_'+tabGuid);
                headBoxEl.off('click.changeTab')
                    .off('click.addTab');
                headBoxEl.remove();
            }
        };
        var _adjust=function(){
            if(opts.noAdjust) return;// 不需要调整
            headBoxEl.find('>ul>li.tab-head').css('width','');// TODO 恢复时根据原先的定义，是否需要延迟之后的操作
            var ulBCR=headBoxEl.find('>ul').eq(0)[0].getBoundingClientRect();
            var ulW=ulBCR.right-ulBCR.left;
            var count=_tabs.length
                ,lisW=0;
            for(var i= 0,liBCR;i<count;i++){
                liBCR=headBoxEl.find('>ul>li.tab-head').eq(i)[0].getBoundingClientRect();
                lisW+=(liBCR.right-liBCR.left);
            }
            if(lisW!=0 && ulW!=0 && lisW > ulW){
                headBoxEl.find('>ul>li.tab-head').css('width',100/count+'%');
            }
        };
        /**
         * 添加 tab 页
         * @param tab {object} tab 页对象，结构同 opts.head
         * @param cont {string=} 对应内容部分 DOM 字符串
         * @param noToggle {bool=} 添加后是否禁止切换，默认为 false，即，添加即切换
         * @private
         */
        var _addTab=function(tab,cont,noToggle){
            if(!headBoxEl || !tab) return;
            !tab.txt && (tab.txt=tab.val);
            var val=tab.val
                ,txt=tab.txt
                ,remove=tab.remove || false;
            var cssStr='';
            if(remove){
                cssStr+='padding-right:20px;';
            }
            if(tab.width){
                cssStr+='width:'+tab.width+';';
            }
            var liStr='<li title="'+txt+'" class="tab-head" data-val="'+val+'" style="'+ cssStr +'">'
                +txt
                +(remove?'<span class="fa fa-remove"></span>':'')
                +'</li>';
            if(opts.headAlign=='right'){
                headBoxEl.children('ul').prepend(liStr);
            }else{
                headBoxEl.children('ul').append(liStr);
            }
            if(cont!=undefined){
                var contEl=contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]');
                if(contEl.length){
                    contEl.html(cont);
                }else{
                    contBoxEl.append('<div class="tab-cont" data-val="'+val+'">'+cont+'</div>');
                }
            }
            _tabs.push(tab);
            !noToggle && headBoxEl.find('>ul>li.tab-head[data-val="'+val+'"]').click();
            _adjust();
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
        var _selectTab=function(tab){
            var headEl=headBoxEl.find('>ul>li.tab-head[data-val="'+tab.val+'"]');
//            if(headEl.hasClass('now') || !tab) return;// 当前项为选中项
            if(!tab) return;
            headBoxEl.find('>ul>li.tab-head.now').removeClass('now');
            contBoxEl.find('>.tab-cont.now').removeClass('now');
            headEl.addClass('now');
            contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]').addClass('now');
            opts.onChange && opts.onChange(tab.val);
        };
        /**
         * 删除指定的 tab
         * @param tab
         * @private
         */
        var _removeTab=function(tab){
            var headEl=headBoxEl.find('>ul>li.tab-head[data-val="'+tab.val+'"]');
            if(headEl.hasClass('now') && _tabs.length>1){// 当前项为选中项，且还有其他标签页
                var i=_tabs.indexOf(tab);
                if(i!=_tabs.length-1){// 不是最后一项，选中后一项
                    _selectTab(_tabs[i+1]);
                }else{
                    _selectTab(_tabs[i-1]);
                }
            }
            _tabs.splice(_tabs.indexOf(tab),1);// 移除
            headEl.remove();// 移除标题
            contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]').remove();
            _adjust();
            opts.onRemove && opts.onRemove(tab.val);
        };
        var _init=function(){
            var headStr='<div class="tab-head-box"><ul></ul></div>';
            headBoxEl=$(headStr);
            headBoxEl
                .on('click.changeTab','>ul>li.tab-head',function(){
                    var head=$(this);
                    var val=head.attr('data-val');
                    _selectTab(_getTabs('val',val)[0]);
                })
                .on('click.removeTab','>ul>li.tab-head>.fa-remove',function(e){
                    var tab=_getTabs('val',$(this).parent().attr('data-val'))[0];
                    _removeTab(tab);
                    e.stopPropagation();
                });
            tabGuid && $(window).on('resize.tab_'+tabGuid,function(){
                _adjust();
            });
            el.prepend(headBoxEl);// 添加 head-box
            /* 根据内容，添加 tab 页 */
            var contEls=contBoxEl.children();
            var tabs=opts.head||[];
            if(contEls.length){
                for(var i= 0;i<tabs.length;i++){
                    _addTab(tabs[i],undefined,true);
                }
            }
            // 居右显示
            if(opts.headAlign=='right'){
                headBoxEl.children('ul').addClass('tab-heads-r');
            }
            // 显示添加
            if(opts.showAdd){
                headBoxEl.children('ul').addClass('tab-heads-add');
                headBoxEl.append('<div class="tab-add" title="新增"><span class="fa fa-plus"></span></div>');
                opts.addHandler && headBoxEl.on('click.addTab','>.tab-add',function(e){
                    opts.addHandler();
                })
            }
            headBoxEl.find('li.tab-head').eq(0).click();// 默认选中第一项
        };
        _returnObj={
            addTab: _addTab
            ,getTabs: _getTabs
            ,removeTab: _removeTab
            ,selectTab: _selectTab
            ,adjust:_adjust
            ,getSelect: function(){
                return _getTabs('val',headBoxEl.find('>ul>li.now').attr('data-val'))[0];
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
     * 将 .tab-box 元素初始化为 tab 容器
     * @param _opts {object=}
     *   - opts.tabs {Array}
     *       opts.tabs[i].val {string} tab 页标识
     *       opts.tabs[i].txt {string=} tab 页标题，默认与 val 一致
     *       opts.tabs[i].remove {bool=} 是否可关闭，默认为 false
     *       opts.tabs[i].width {string=} 头部宽度，默认 '120px'
     *       opts.tabs[i].cont {string=} 对应内容部分 DOM 字符串
     *       opts.tabs[i].url {string=} 对应内容部分 url
     *   - opts.headAlign {string=} 若设为 ‘right’ 则将 tab 头部居右显示
     *   - opts.headScroll {string=} 若设为 true，tab 头部溢出时出现左右箭头
     *   - opts.noAdjust 是否禁止自动调整尺寸，默认为 false
     *   - opts.showAdd {bool=} 是否显示添加按钮，默认为 false
     *   - opts.addHandler() {function=} 添加按钮的事件
     *   - opts.onChange(val) {function=} 切换tab时触发事件，参数为要选中的 tab.val
     *   - opts.onRemove(val) {function=} 删除tab时触发事件，参数为要删除的 tab.val
     * @return {object|undefined} obj
     *   - obj.addTab(tab,cont)
     *     tab {object} tab 页对象，结构同 opts.head
     *     cont {string=} 对应内容部分 DOM 字符串
     *     noToggle {bool=} 添加后是否禁止切换，默认为 false，即，添加即切换
     *   - obj.getTabs(key,value) 选中所有符合条件的 tab 列表，无条件则选择全部，未找到则返回 []
     *     key {string} tab 页对象中的键：val,txt,remove
     *     value {string=}
     *   - obj.removeTab(tab) 删除指定的 tab
     *   - obj.selectTab(tab) 切换到指定的 tab
     *   - obj.adjust() 手动计算绘制头部尺寸
     *   - obj.getContEl(tab) 获取内容部分的 jquery 元素对象
     */
    $.fn.initScrollTabBox=function(_opts){
        var el=$(this);
        if(!el.hasClass('tab-box')) return;
        var _returnObj;
        var contBoxEl=el.children('.tab-cont-box');
        var headBoxEl=el.children('.tab-head-box');
        var opts=$.extend({},_opts);
        var _tabs=[];
        var tabGuid;// tab 的标识
        if(!opts.noAdjust){
            tabGuid= $.generateGuid('tab');
        }
        var _destroy=function(){
            if(headBoxEl.length){
                _tabs.length=0;
                tabGuid && $(window).off('resize.tab_'+tabGuid);
                headBoxEl.off('click.changeTab')
                    .off('click.addTab');
                headBoxEl.remove();
            }
        };
        var _adjust=function(){
            if(opts.noAdjust) return;// 不需要调整
            headBoxEl.find('>ul>li.tab-head').css('width','');// TODO 恢复时根据原先的定义，是否需要延迟之后的操作
            var ulBCR=headBoxEl.find('>ul').eq(0)[0].getBoundingClientRect();
            var ulW=ulBCR.right-ulBCR.left;
            var count=_tabs.length
                ,lisW=0;
            for(var i= 0,liBCR;i<count;i++){
                liBCR=headBoxEl.find('>ul>li.tab-head').eq(i)[0].getBoundingClientRect();
                lisW+=(liBCR.right-liBCR.left);
            }
            if(lisW!=0 && ulW!=0 && lisW > ulW){
                headBoxEl.find('>ul>li.tab-head').css('width',100/count+'%');
            }
        };
        /**
         * 添加 tab 页
         * @param tab {object} tab 页对象，结构同 opts.tabs[i]
         * @param noToggle {bool=} 添加后是否不立即切换，默认为 false，即，添加即切换
         * @private
         */
        var _addTab=function(tab,noToggle){
            if(!headBoxEl || !tab) return;
            var val=tab.val;
            var sameTab=_getTabs('val',val);
            if(sameTab.length){
                _selectTab(sameTab[0]);// 选中已有项
            }else{
                !tab.txt && (tab.txt=tab.val);
                var txt=tab.txt
                    ,remove=tab.remove || false;
                var cssStr='';
                if(remove){
                    cssStr+='padding-right:20px;';
                }
                if(tab.width){
                    cssStr+='width:'+tab.width+';';
                }
                var liStr='<li title="'+txt+'" class="tab-head" data-val="'+val+'" style="'+ cssStr +'">'
                    +txt
                    +(remove?'<span class="fa fa-remove"></span>':'')
                    +'</li>';
                if(opts.headAlign=='right'){
                    headBoxEl.children('ul').prepend(liStr);
                }else{
                    headBoxEl.children('ul').append(liStr);
                }
                var contStr=tab.url ?
                    '<iframe width="100%" height="100%" frameborder="0" scrolling="0" src="'+tab.url+'"></iframe>':
                    tab.cont;
                var contEl=contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]');
                if(contStr){
                    if(contEl.length){
                        contEl.html(contStr);
                    }else{
                        contBoxEl.append('<div class="tab-cont" data-val="'+val+'">'+contStr+'</div>');
                    }
                }
                _tabs.push(tab);
                !noToggle && headBoxEl.find('>ul>li.tab-head[data-val="'+val+'"]').click();
                _adjust();
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
        var _refreshTab=function(val){
            contBoxEl.find('>.tab-cont[data-val="'+val+'"]>iframe')[0].contentWindow.location.reload();
        };
        var _selectTab=function(tab){
            var headEl=headBoxEl.find('>ul>li.tab-head[data-val="'+tab.val+'"]');
//            if(headEl.hasClass('now') || !tab) return;// 当前项为选中项
            if(!tab) return;
            headBoxEl.find('>ul>li.tab-head.now').removeClass('now');
            contBoxEl.find('>.tab-cont.now').removeClass('now');
            headEl.addClass('now');
            contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]').addClass('now');
            opts.onChange && opts.onChange(tab.val);
        };
        /**
         * 删除指定的 tab
         * @param tab
         * @private
         */
        var _removeTab=function(tab){
            var headEl=headBoxEl.find('>ul>li.tab-head[data-val="'+tab.val+'"]');
            if(headEl.hasClass('now') && _tabs.length>1){// 当前项为选中项，且还有其他标签页
                var i=_tabs.indexOf(tab);
                if(i!=_tabs.length-1){// 不是最后一项，选中后一项
                    _selectTab(_tabs[i+1]);
                }else{
                    _selectTab(_tabs[i-1]);
                }
            }
            _tabs.splice(_tabs.indexOf(tab),1);// 移除
            headEl.remove();// 移除标题
            contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]').remove();
            _adjust();
            opts.onRemove && opts.onRemove(tab.val);
        };
        var _init=function(){
            if(!headBoxEl.length){
                headBoxEl=$('<div class="tab-head-box"><ul></ul></div>');
            }
            if(!contBoxEl.length){
                contBoxEl=$('<div class="tab-cont-box"></div>');
            }
            headBoxEl
                .on('click.changeTab','>ul>li.tab-head',function(){
                    var head=$(this);
                    var val=head.attr('data-val');
                    _selectTab(_getTabs('val',val)[0]);
                })
                .on('click.removeTab','>ul>li.tab-head>.fa-remove',function(e){
                    var tab=_getTabs('val',$(this).parent().attr('data-val'))[0];
                    _removeTab(tab);
                    e.stopPropagation();
                });
            tabGuid && $(window).on('resize.tab_'+tabGuid,function(){
                _adjust();
            });
            el.prepend(headBoxEl);// 添加 head-box
            el.append(contBoxEl);// 添加 cont-box
            /* 根据内容，添加 tab 页 */
//            var contEls=contBoxEl.children();
            var tabs=opts.tabs||[];
            for(var i= 0;i<tabs.length;i++){
                _addTab(tabs[i],undefined,true);
            }
            // 居右显示
            if(opts.headAlign=='right'){
                headBoxEl.children('ul').addClass('tab-heads-r');
            }
            // 显示添加
            if(opts.showAdd){
                headBoxEl.children('ul').addClass('tab-heads-add');
                headBoxEl.append('<div class="tab-add" title="新增"><span class="fa fa-plus"></span></div>');
                opts.addHandler && headBoxEl.on('click.addTab','>.tab-add',function(e){
                    opts.addHandler();
                })
            }
            headBoxEl.find('li.tab-head').eq(0).click();// 默认选中第一项
        };
        _returnObj={
            refreshTab: _refreshTab
            ,addTab: _addTab
            ,getTabs: _getTabs
            ,removeTab: _removeTab
            ,selectTab: _selectTab
            ,adjust:_adjust
            ,getSelect: function(){
                return _getTabs('val',headBoxEl.find('>ul>li.now').attr('data-val'))[0];
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
     * 弹出位置计算
     * @param elBCR {object} 参照元素的 BCR
     * @param targetElWidth {int} 弹出项的宽
     * @param targetElHeight {int} 弹出项的高
     * @param viewW {int} 视图范围的宽
     * @param viewH {int} 视图范围的高
     * @param positionStr {string} 定位方向: 'p-p'，可能的值：top,left,right,bottom,center。
     * @param adjust {bool=} 是否允许调整弹出方向
     * @param appendToEl {object=} 以参照元素计算定位，未定义则以窗口为参照(.overlay)
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
                return nowS < targetS && otherS >= targetS;//当前空间不足，反向空间足够，返回 true，即需要反向
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
     * 显示下拉弹出层
     * @param opts {object}
     *   - opts.cont {object} 弹出层的 dom 字符串或 jquery 对象
     *   - opts.pos {string=} 优先选择的弹出方向，默认为 'bottom-right'（贴下边和左边） TODO
     *   - opts.adjust {bool=} 是否允许弹出方向自适应，默认为 true TODO
     *   - opts.noDestroy {bool=} 关闭时是否仅隐藏，默认为 true，即关闭时不销毁弹窗
     *   - opts.show {bool=} 初始化时是否直接打开，默认为 true
     *   - opts.beforeClose {function=} 关闭下拉框前的回调函数
     *   - opts.beforeShow {function=} 显示下拉框前的回调函数
     * @returns {object|undefined} obj
     *   - obj.show() {function} 显示弹出框
     *   - obj.close() {function} 关闭弹出层
     */
    $.fn.dropdown=function(opts){
        var el=$(this)// 弹出参照元素
            ,overlayEl// 弹出遮罩层
            ,dropdownEl;// 弹出内容主体
        if(!opts) return;
        var config=$.extend({
            cont:''
            ,pos:'bottom-left'
            ,adjust:true
            ,noDestroy:true
            ,show:true
        },opts);
        config.positionStr=opts.positionStr || 'bottom-right';
        var _returnObj={};
        var dpGuid=$.generateGuid('dp');
        var _close=function(){
            if(!overlayEl) return;
            opts.beforeClose && opts.beforeClose();
            overlayEl.css('display','none');
            dropdownEl.css('visibility','hidden');
            if(!config.noDestroy){
                _destroy();
            }
        };
        var _destroy=function(){
            if(!overlayEl) return;
            overlayEl.remove();
            overlayEl.off('click.dropdown');
            $(window).off('resize.dp'+dpGuid);
        };
        var _show=function(){
            if(!overlayEl) return;
            opts.beforeShow && opts.beforeShow();
            overlayEl.css('display','');// _close() 中可能设为 none
            overlayEl && overlayEl.css('visibility','hidden');
            $('body').append(overlayEl);
            dropdownEl.css($.extend({'visibility':''},
                $.adaptElement(el[0].getBoundingClientRect()
                    , overlayEl.width(), overlayEl.height()
                    , dropdownEl.outerWidth(), dropdownEl.outerHeight()
                    , config.pos, config.adjust)[0]));
            overlayEl && overlayEl.css('visibility','');
        };
        var _init=function(){
            overlayEl=$('<div class="overlay"></div>');
            dropdownEl=$('<div class="dropdown-box" style="visibility:hidden; min-width:'+el.outerWidth()+'px"></div>');// 调节位置后显示
            dropdownEl.append(config.cont);
            overlayEl.append(dropdownEl);
            overlayEl.on('click.dropdown',function(e){
                if($(e.target).parent('body').length>0){
                    _close();
                }
            });
            $(window).on('resize.dp'+dpGuid, _close);// 窗体发生 resize 时关闭弹出层
            config.show!=false && _show();
        };
        _returnObj.show=_show;
        _returnObj.close=_close;
        _returnObj.destroy=_destroy;
        _destroy();
        _init();
        return _returnObj;
    };
    /**
     * 根据源对象深度拷贝数据，并删除 __ 开头的组件属性
     * @param src 拷贝参照的对象
     * @returns {*}
     */
    $.pureClone=function(src){
        // 基本类型及 function
        if(typeof src !== 'object' || src===null) return src;
        var dst = Object.prototype.toString.call(src) === '[object Array]' ? [] : {};//判断参数的类型,定义要拷贝的对象的数据类型
        for(var i in src){
            if(src.hasOwnProperty(i) && !/^__/.test(i)){
                dst[i] = typeof src[i] === 'object' && src ? arguments.callee(src[i]) : src[i];
            }
        }
        return dst;
    };
    $.generateGuid=function(key){
        return key + (new Date()).getTime();
    };
    /**
     * 初始化 numbox
     * @param option
     *   - option.maxVal {int} 控件支持的最大值 TODO 小数的支持
     *   - option.minVal {int} 控件支持的最小值 TODO 小数的支持
     *   - option.name {string} 控件中文本框的 name 值
     *   - option.value {int} 初始化时的值
     *   - option.enable {int} 初始化时是否启用，默认为 true
     *   - option.onChange {function(val)} 值变化时的回调方法
     * @return {object} returnObj
     *   - obj.setVal(val) 为文本框赋值（val {int}）
     *   - obj.setEnable(enable) 禁用/启用（enable {bool}）
     */
    $.fn.initSelNum=function(option){
        var $this = this;
        var settings = {
            maxVal:0 //最大值
            ,minVal:0 //最小值
            ,name:'' //其中文本框对应的 name
            ,enable:true
//                ,value //初始化时的值，默认为最小值
//                ,step:1 //TODO 每次上下增减的数值
        };
        option = $.extend(settings,option||{});
        var iCurVal;//保存当前值
        var returnObj={};
        returnObj.setVal=_setVal;
        returnObj.getVal=_getVal;
        returnObj.setEnable=_setEnable;

        // 初始化方法
        function _init(){
            $this.addClass('txt numbox');
            var str = '<input type="text" class="iptVal"'+(option.name ? ' name="'+option.name+'"' : '')+'/>' +
                '<div class="arrowWrap"><span class="arrowUp"></span><span class="arrowDown"></span></div>';
            $this.append(str);
            $this.find('.arrowUp,.arrowDown').on('click',clickFn);
            $this.find('.iptVal').on({
                keydown:keydownFn,
                change:changeFn
            });
            _setVal(option.value);// 赋初始值
            _setEnable(option.enable);
        }
        function _setEnable(enable){
            option.enable=enable;
            if(enable){// 启用
                $this.removeClass('disabled');
            }else{
                $this.addClass('disabled');
            }
        }
        function _getVal(){
            return iCurVal;
        }
        // 为文本框赋值（先判断值是否合法）
        function _setVal(val){
            if(isNaN(val) || val<option.minVal){
                val = option.minVal;
            }else if(val > option.maxVal){
                val = option.maxVal;
            }
            if(val != parseInt($this.find('.iptVal').val())){
                $this.find('.iptVal').val(val);
            }
            if(val != iCurVal){// 值发生变化
                iCurVal = val;
                option.onChange && option.onChange(parseInt(iCurVal));
            }
        }
        //上下箭头点击函数
        function clickFn(event){
            if(!option.enable) return;
            _setVal( $(this).hasClass('arrowUp') ? iCurVal+1 : iCurVal-1);
        }
        // 键盘抬起事件 - 将当前文本框内容值更新到组件
        function changeFn(event){
            if(!option.enable) return;
            _setVal( parseInt($this.find('.iptVal').val()));
        }
        //键盘按下事件
        function keydownFn(event){
            if(!option.enable) return;
            var code = event.which;
            if (code == 38) {// 加1
                _setVal(iCurVal+1);
            } else if (code == 40) {// 减1
                _setVal(iCurVal-1);
            }else if(!(code >= 96 && code <= 105
                || code >= 48 && code <= 57
                || code == 37 || code ==39 // 左右键
                || code == 8 // 退格
                /* ||code == 110 ||  code == 190小数点*/)){// TODO 小数点、负数
                return false;
            }
            // 数字按键引起的数据变化在 keyup 中执行
        }
        /* 初始化开始 */
        _init();
        return returnObj;
    };
    /**
     * 在祖先窗口打开 tab 页，若祖先窗口不支持，则打开新窗口
     * @param tab
     */
    $.openTab=function(tab){
        var win=window;
        while(win && !win.frameTab){
            win=window.parent;
        }
        win.frameTab && win.frameTab.add(tab);
        if(win.frameTab){
            win.frameTab.add(tab);
        }else if(tab.url){
            window.open(tab.url,'_blank');
        }
    };
    /**
     * 刷新祖先窗口中的指定 tab 页
     * @param val {string}
     */
    $.refreshTab=function(val){
        var win=window;
        while(win && !win.frameTab){
            win=window.parent;
        }
        win.frameTab && win.frameTab.refresh(val);
    }
})(jQuery);