var HASINTERACTION=true;// TODO 测试中使用，标识当前环境是否支持后台交互
/**
 * Created by QianQi on 2016/1/5
 */
if(window._GLOBAL == undefined){ window._GLOBAL={};}// 用于存放全局变量
(function(){
    /**
     * 分页：对象为 pageBar 容器 class="manu"
     * @param {string=} jsonUrl 数据源请求jsonUrl
     *  返回的数据结构
     *  - success {bool}
     *  - data.totalcount {int} 总数据条数
     *  - data.curpage {int} 请求到第几页的数据，从 1 开始
     *  - data.totalpage {int} 总页数
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
        var _page={};
        var _destroy=function(){
            _pageBar.find('.manu-sel').off('change.per');
            _pageBar.off('click.toPage')
                .html('');
            _returnObj=undefined;
        };
        var _returnObj={
            page: $.extend({},_page)
            ,destroy:_destroy
        };// 返回的接口对象
        var drawDOM=function(result,drawDomFn){
            if(result.success){
                result=result.data;
                var half = (VISIBLEPAGES-1)/ 2,pStart,pEnd
                    ,totalPage = result.totalpage
                    ,toPage = result.curpage;
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
                        if(perList.indexOf(per)==-1){// per 不在 perList 中
                            per=perList[0];
                        }
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
                            '<a href="javascript:void(0)" class="manu-lnk manu-lnk-x" data-page="'+result.totalpage+'"><span class="fa fa-angle-double-right"></span></a>');
                    pageStr+='';
                    pageStr+='</div>';// manu-r 结束
                }
                _page.percount=per;
                _page.totalpage=totalPage;
                _page.curpage=toPage;
                _page.totalcount=result.totalcount;
                _pageBar.html(pageStr);
                drawDomFn && drawDomFn(result.retlist);
                _pageBar.find('.manu-sel')
                    .off('change.per')
                    .on('change.per',function(){
                        per = parseInt($(this).val());
                        $.extend(_returnObj,_pageBar.initPageBar(jsonUrl,per,drawDomFn,args,showloading,perList));
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
                        drawDOM(result,drawDomFn);//result,drawDomFn
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
                        totalcount:2
                        ,curpage:pageNum
                        ,totalpage:10
                        ,retlist:undefined
                    }
                },drawDomFn);
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
        var _formatMsg=function(src, args){
            if (args.constructor!= Array) {
                args = [args];
            }
            $.each(args, function(i, n) {
                src = src.replace(new RegExp('\\{'+i+'\\}','g'), n);
            });
            return src;
        };
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
        },cb)
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
            ,'number': '此字段必须为数字'
            ,'maxlength': '此字段值最多{0}个字符'
            ,'length': '此字段值为{0}个字符'
            ,'ZhStrMaxLength': '此字段字符（中文）最多为{0}个'
            ,'ZhStrRangeLength': '此字段字符（中文）个数在{0}-{1}之间'
            ,'isPhone': '电话号码格式错误'
            ,'isCardNo': '身份证号格式错误'
        },
        // 验证通过时返回 true，不通过时返回 false
        methods: {
            'required': function(limit, el) {
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
     * 获取元素中定义了 name 属性的元素的 value
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
                            $('#'+selNode.tId+'_a').click();
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
     * @param cancelcb {function} 弹框设置取消的回调函数
     */
    $.initCusLayer=function(callback,apiName,cancelcb){
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
     *  - opts.chkField {string=} 若定义此属性，则显示复选框列，并根据此属性的值初始化选中状态
     *  - opts.page {object} 分页数据
     *      opts.page.percount {int} 默认每页数据条数
     *      opts.page.perList {Array} 分页数据列表
     *  - opts.cols {Array=} 列定义 [{field,...}]
     *      opts.cols[i].field {string} 该列对应的属性名
     *      opts.cols[i].name {string=} 该列的标识，默认与 field 相同
     *      opts.cols[i].title {string} 该列显示的标题文本
     *      opts.cols[i].type {string} 该列显示的数据类型，默认为：'string'，可选值：'number','string'
     *      opts.cols[i].width {string} 该列宽度，需带单位
     *      opts.cols[i].align {string} 对齐方式，可选值：'center','left','right'。不指定时，type='string'时为'left'，type='number'时为'right'
     *      opts.cols[i].sort {bool} 该列是否允许排序，默认 false
     *      opts.cols[i].render {function} 该列的渲染函数 render(val,row,i,grid) val 单元格值，row 行数据，i 当前行索引，grid 接口对象；返回 dom 字符串
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
     * ========================
     * @return {object|undefined} obj 接口对象
     *   - obj.el 获取当前 grid 对应的 el
     *   - obj.findCol(key,name) 根据条件查找所有符合的 cols[i].key=val 的列定义
     *   - obj.getCheckedIdx() 获取当前列表所有选中行索引
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
         * 根据请求获取的数据绘制表格内容
         * @param datalist 数据列表
         * @private
         */
        var _drawFn=function(datalist){
            if(!HASINTERACTION){
                if(!datalist){
//                    // index.html 测试数据
//                    datalist=[
//                        {"id":"zd001","code": "job","mc": "职位","lx":1,"strvalue":"ZW"}
//                        ,{"id":"zd002","code": "name","mc": "姓名","lx":2,"strvalue":"XM"}
//                    ];
                    // zdEdit.html 测试数据
                    datalist=[
                        {"id":"i001","itemmc": null,"itemvalue": "0","ms":"初中ms"}
                        ,{"id":"i002","itemmc": "高中","itemvalue": "1","ms":"高中ms"}
                    ];
//                    // Ams index.html 测试数据
//                    datalist=[
//                        {"ID":"i001","NAME": "百度","ACCESSADDRESS": "http://www.baidu.com","ISUSING":1}
//                        ,{"ID":"i002","NAME": "菜单管理","ACCESSADDRESS": "http://qq.com","ISUSING":0}
//                    ];
                }
            }
            var startNo=1;
            if(_manuObj){
                startNo=(_manuObj.page.curpage-1)*_manuObj.percount+1 || 1;// 根据分页对象获得第一条的序号
            }
            _data=datalist;
            var dataStr='';
            if(datalist && datalist.length>0){
                for(var i=0;i<datalist.length;i++){
                    var data=datalist[i];
                    dataStr+='<tr data-i="'+i+'">';
                    if(opts.showno){
                        dataStr+='<td class="ctrltd">'+(startNo+i)+'</td>';
                    }
                    if(_chkField){
                        dataStr+='<td style="text-align:center;" data-name="'+_chkField+'"><input type="checkbox"'+(data[_chkField] ? ' checked':'')+' /></td>';
                    }
                    for(var j= 0,col,cssStr;j<_cols.length;j++){
                        col=_cols[j];
                        cssStr='';
                        if(col.align) cssStr+='text-align:center;';// 对齐方式
                        if(cssStr) cssStr=' style="'+cssStr+'"';// 需要定义 style
                        dataStr+='<td data-name="'+col.name+'"'+cssStr+'>'
                            +(col.render ? col.render(data[col.field],data,i,_returnObj) : data[col.field]||'')
                            +'</td>';
                    }
                    dataStr+='</tr>';
                }
            }else{
                var colspan=_cols.length;
                opts.showno && colspan++;
                _chkField && colspan++;
                dataStr='<tr><td class="nodata" colspan="'+colspan+'">未查询到符合条件的数据!</td></tr>'
            }
            el.find('tbody').html(dataStr);
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
            if(_chkField){
                tableStr+='<th style="width:30px;">&nbsp;</th>';
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
                tableStr+='<th style="'+(col.width ? 'width:'+col.width : '')+'">'+col.title+'</th>';
            }
            tableStr+='</tr></thead>' +
                '<tbody></tbody>' +
                '</table>';
            el.append(tableStr);// 将表格添加到 DOM
            /* 创建回调监听 */
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
            el.on('click._row','tbody>tr',function(){
                var tr=$(this);
                if(tr.hasClass('now')) return;
                tr.siblings('.now').removeClass('now');
                tr.addClass('now');
            });
            // 默认复选框列点击切换事件
            if(_chkField){
                el.on('click.chk','tbody>*>td[data-name="'+_chkField+'"]',function(){
                    var td=$(this)
                        ,input=td.children('input')
                        ,i=parseInt(td.parent().attr('data-i'))
                        ,stat=_data[i][_chkField];
                    input.prop('checked',!stat);
                    _data[i][_chkField]=!stat;
                });
            }
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
                .off('click._row');
            /* 解绑分页 */
            if(_manuObj){
                _manuObj.destroy();
            }
            el.next('.manu').remove();
            // 清空 DOM
            el.html('');
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
        _returnObj={
            el:el
            /**
             * 根据条件查找所有符合的 cols[i].key=val 的列
             */
            ,findCol:_findCol
            /**
             * 获取当前列表所有选中行索引
             */
            ,getCheckedIdx:_getCheckedIdx
            /**
             * 返回当前显示的数据列表
             * @returns {object}
             */
            ,getData:function(){
                return $.extend([],_data);
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
     *   - opts.head {object}
     *       opts.key=[txt,allowRemove] 键对应 tab-cont-box 中 .tab-cont 的 data-val
     *         txt 头部显示文本{string=}，默认与 key 相同,allowRemove 是否可删除{bool=}
     *   - opts.onChange(val) {function=} 切换tab时触发的回调函数，val 为当前 tab 对应的 key
     * @return {object|undefined} obj
     */
    $.fn.initTabBox=function(opts){
        var el=$(this);
        if(!el.hasClass('tab-box')) return;
        var _returnObj;
        var contBoxEl=el.children('.tab-cont-box');
        var headBoxEl=el.children('.tab-head-box');
        var tab;
        var _destroy=function(){
            if(headBoxEl.length){
                headBoxEl.off('click.changeTab');
                headBoxEl.remove();
            }
        };
        var _initHead=function(){
            var headStr='<div class="tab-head-box"><ul>';
            var contEls=contBoxEl.children();
            var arr=opts.head;
            if(contEls.length){
                for(var i= 0,contEl,head,val;i<contEls.length;i++){
                    contEl=contEls.eq(i);
                    val=contEl.attr('data-val');// 标识 tab 页的 val
                    head= arr ? arr[val] : [''];
                    headStr+='<li class="tab-head" data-val="'+val+'"'+ (head[1]?' style="padding-right: 20px;"':'') +'>'
                        +head[0]
                        +(head[1]?'<span class="fa fa-remove"></span>':'')
                        +'</li>';
                }
            }
            headStr+='</ul></div>';
            headBoxEl=$(headStr);
            headBoxEl.on('click.changeTab','li.tab-head',function(){
                var head=$(this);
                if(head.hasClass('now')) return;
                headBoxEl.find('li.tab-head.now').removeClass('now');
                contBoxEl.children('.now').removeClass('now');
                head.addClass('now');
                var val=head.attr('data-val');
                contBoxEl.children('[data-val="'+val+'"]').addClass('now');
                opts.onChange && opts.onChange(val);
            });
            el.prepend(headBoxEl);
            headBoxEl.find('li.tab-head').eq(0).click();
        };
        var _init=function(){
            _initHead();
        };
        _returnObj={

        };
        _destroy();
        _init();
    };
})(jQuery);