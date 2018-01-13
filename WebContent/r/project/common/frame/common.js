'use strict';
(function($){
    /* wiFrame 版本兼容代码 */
    $.HtmlEncode= $.encodeHtml;
    $.JavascriptEncode= $.encodeJavascript;


    if(window._WI == undefined){ window._WI={};}// 用于存放全局变量

    $.getTopFrameWin=$.getFrameWin=function(){
        var win=window
            ,topWin=window.top;
        while(win!=topWin && win.parent._WI){
            win=win.parent;
        }
        return win._WI ? win : undefined;
    };
    // 将框架页面路径指向 url，相对路径相对于调用此方法的页面
    $.resetTopUrl=function(url){
        var _top= $.getFrameWin() || top;
        _top.location.href=url;
    };
    /**
     * 框架页 - 左侧菜单
     * @param _opts
     * @returns {object} obj
     *   {undefined} userMenuApi.setData({Array}) 设置菜单数据
     */
    $.fn.initSidebar=function(_opts){
        var el=$(this);
        var CONF = {
            sideW:'33px',// 折叠后的侧边菜单宽度
            sideWOver:'220px'// 展开后的侧边菜单宽度
        };
        var opts= $.extend({
            data:[],// 菜单数据源
            autoClick: true,// 设置数据时，若未指定选中项，是否选中第一个叶子节点
            //affectedEl:// 菜单展开收起时受影响的元素
            folded: false,// 初始化时是否收起侧边菜单，默认为 false
            onClick: $.noop,// function(data)
            onToggle: $.noop// function(folded) 切换侧边菜单展开状态时的回调，参数为修改后的展开状态
        },_opts);
        var api;
        var _data,
            _hashData=[],// 以hash形式保存菜单数据
            curI;// 记录当前选中的项在 _hashMenu 中的索引
        var jqToggle,// 展开/收起菜单的元素
            jqMenuMain,// 第一级菜单元素
            jqAffected;
        var oScrollbarApi;// 滚动条组件 api
        var curHeight;// 记录当前菜单高度，以便在发生改变时触发回调
        var aMenuCls=['sidemenu-root','sidemenu-sub','sidemenu-ssub'];// 不同层级的菜单对应的 class
        var _setData=function(data,curmenu){// 根据数据 data 绘制菜单，curmenu 定义当前激活菜单项的 code
            _data=data;
            _hashData.length=0;
            var mainStr='';// 第一个叶子节点
            curI=undefined;
            var strFn=function(datalist,type,level){// 直接追加 str
                var str='';
                var subLevel=level+1;
                if(datalist && datalist.length){
                    var txtField,
                        defaultIco;
                    if(type=='chd'){
                        txtField='name';// 文本字段
                        defaultIco='fa-folder';
                    }else{
                        txtField='appname';
                        defaultIco='fa-list';
                    }
                    if(level){// 非一级菜单
                        defaultIco='sidemenu-img';
                    }
                    var i,dataI,
                        len=datalist.length,
                        item,children,amsAppList,
                        hasSub;
                    for(i= 0;i<len;i++){
                        item=datalist[i];
                        dataI=_hashData.length;// 在 _hashData 中的索引
                        _hashData.push(item);
                        children=item['children'];
                        amsAppList=item['amsAppList'];
                        hasSub = !!(children&&children.length || amsAppList&&amsAppList.length);// 有子节点
                        if(typeof curI=='undefined'){// 未指定选中节点
                            if(typeof curmenu=='undefined'){
                                if(opts.autoClick && !hasSub){// 未指定选中项，默认选中第一个叶子节点
                                    curI=dataI;
                                }
                            }else{// 指定了选中项
                                if(curmenu==item['code'] || curmenu==item['appcode']){
                                    curI=dataI;
                                }
                            }
                        }
                        str+='<li class="sidemenu'+(hasSub?' sidemenu-haschd':'')+'" data-i="'+dataI+'">';
                        str+='<div class="sidemenu-item" title="'+item[txtField]+'">' +
                            '<div class="sidemenu-icon fa '+(item['ico_class']||defaultIco)+'"></div>' +
                            '<div class="sidemenu-txt">'+item[txtField]+'</div>' +
                            '</div>';
                        if(hasSub){
                            str+='<ul class="sidemenu-list '+aMenuCls[subLevel]+'" data-type="chd">' +
                                strFn(children,'chd',subLevel) +
                                strFn(amsAppList,'app',subLevel) +
                                '</ul>';
                        }
                        str+='</li>';
                    }
                }
                //if(level==0){// 第一级包裹一层 ul
                //    str='<ul class="sidemenu-list '+aMenuCls[level]+'" data-type="chd">'+str+'</ul>';
                //}
                return str;
            };

            if(_data/* && _data[0]*/){// applications 由数组改为对象
                var _children=_data/*[0]*/['children'],
                    _amsAppList=_data/*[0]*/['amsAppList'],
                    _level=0;
                mainStr += strFn(_children,'chd',_level) + strFn(_amsAppList,'app',_level);
                if(!!(_children&&_children.length || _amsAppList&&_amsAppList.length)){
                    //jqMenuMain.html('<ul class="sidemenu-list '+aMenuCls[_level]+'" data-type="chd">'+mainStr+'</ul>');// chd 或 app
                    jqMenuMain.children('.sidemenu-list')
                              .addClass(aMenuCls[_level]).attr('data-type','chd').html(mainStr);// chd 或 app
                }
                if(typeof curI!='undefined'){
                    jqMenuMain.find('.sidemenu[data-i="'+curI+'"]').addClass('active');
                    jqMenuMain.find('.sidemenu[data-i="'+curI+'"]').parents('.sidemenu-haschd').addClass('opened');
                }
                fResetUpDown();
            }
        };
        // 侧边菜单展开/收起
        var fSidemenuToggle=function(){
            if(el.is(':animated')) return;// 正在进行动画，直接返回
            var sideW=CONF.sideW,
                sideWOver=CONF.sideWOver,
                foldedCls='folded';
            if(el.hasClass(foldedCls)){
                jqAffected.animate({left:sideWOver});
                el.animate({'width':sideWOver},function(){
                    el.removeClass(foldedCls);
                    opts.onToggle(false);
                    fResetUpDown();// 收起时会隐藏非一级菜单，引起高度变化
                });
            }else{
                jqAffected.animate({left:sideW});
                el.animate({'width':sideW},function(){
                    el.addClass(foldedCls);
                    opts.onToggle(true);
                    fResetUpDown();// 收起时会隐藏非一级菜单，引起高度变化
                });
            }
        };
        var fSidemenuChange=function(){
            if(el.hasClass('folded')) return;// 侧边已经折叠，禁止切换菜单
            var jqCurMenuItem=$(this),
                jqCurMenu=jqCurMenuItem.parent(),
                activeCls='active',
                openedCls='opened',
                hasChd=jqCurMenu.children('.sidemenu-list').length;
            if(hasChd){// 目录节点
                if(jqCurMenu.hasClass(openedCls)){
                    jqCurMenu.removeClass(openedCls);
                }else{
                    jqCurMenu.addClass(openedCls);
                }
            }else if(!jqCurMenu.hasClass(activeCls)){// 叶子节点且不是当前菜单
                //el.find('.sidemenu').removeClass(activeCls);
                //jqCurMenu.addClass(activeCls);
            }
            curI=parseInt(jqCurMenu.attr('data-i'));
            opts.onClick(_hashData[curI]);
            if(hasChd){
                fResetUpDown();// 有子菜单，可能引起高度变化
            }
        };
        // 重新计算是否需要显示上下箭头
        var fResetUpDown=function(){// 菜单的高度变化事件
            //var jqSideContainer = $('.sidemenu-list');
            //var nSideMenuMainH = jqMenuMain.height(),
            //    nSideContainerH =jqSideContainer.length>0? jqSideContainer[0].scrollHeight:0;
            //var nScrollTopVal = jqMenuMain.scrollTop();
            //if(nScrollTopVal>0){//出现向上箭头（把滚动条上面的内容显示出来）
            //    el.addClass('sidebar-scroll-prev');
            //}else{
            //    el.removeClass('sidebar-scroll-prev');
            //}
            //if(nSideMenuMainH+nScrollTopVal<nSideContainerH){
            //    el.addClass('sidebar-scroll-next');
            //}else{
            //    el.removeClass('sidebar-scroll-next')
            //}
            oScrollbarApi.fResetSize();
        };
        var fOnUpDownClick=function(){
            var jqSideContainer = $('.sidemenu-list');
            var curScrollTop = jqMenuMain.scrollTop();
            var nMenuMainH = jqMenuMain.height(),
                nContainerH = jqSideContainer[0].scrollHeight;
            var nDisH = jqMenuMain.height()-(30*2);  //滚动的高度为容器高度-2个菜单项的高度
            switch ($(this).attr('data-val')){
                case 'prev':
                    nDisH = Math.min(nDisH,curScrollTop);//到最后容器到顶滚的距离不足nDisH的高度，以实际要滚动的值来滚动
                    jqMenuMain.animate({scrollTop:curScrollTop-nDisH},function(){
                        fResetUpDown();//运动结束后判断箭头是否改出现
                    });
                    break;
                case 'next':
                    nDisH = Math.min(nDisH,nContainerH-curScrollTop-nMenuMainH);//到最后容器到底滚的距离不足nDisH的高度，以实际要滚动的值来滚动
                    jqMenuMain.animate({scrollTop:curScrollTop+nDisH},function(){
                        fResetUpDown();
                    });
                    break;
            }
        };
        var fGetCurData=function(){
            return _hashData[curI];
        };
        var _init=function(){
            el.addClass('sidebar');
            jqAffected=opts.affectedEl;
            jqToggle=$('<div class="sidemenu-toggle">' +
                '<span class="sidemenu-prev js-sideBtn" data-val="prev" title="向上"></span>' +
                '<span class="sidemenu-next js-sideBtn" data-val="next" title="向下"></span>' +
                '<span class="sidemenu-toggle-ico"></span>' +
                '</div>');
            //jqMenuMain=$('<div class="sidemenu-main"></div>');
            jqMenuMain=$('<div class="sidemenu-main"><ul class="sidemenu-list"></ul></div>');
            el.prepend(jqToggle,jqMenuMain);
            //jqAffected.css('marginLeft',el.width());
            if(opts.folded){
                fSidemenuToggle();
            }
            curHeight = jqMenuMain.outerHeight();
            // 事件绑定
            el.off('click.sidebarToggle')
              .on('click.sidebarToggle','.sidemenu-toggle-ico',fSidemenuToggle)// 展开/收起
              .off('click.sidebarChange')
              .on('click.sidebarChange','.sidemenu-item',fSidemenuChange);
              //.off('click.sidebarUpDown')
              //.on('click.sidebarUpDown','.js-sideBtn',fOnUpDownClick);
            oScrollbarApi = jqMenuMain.initScrollbar({
            });
            _setData(opts.data);
        };
        api={
            setData:_setData,
            getCurData:fGetCurData,
            fResetUpDown:fResetUpDown
        };
        _init();
        return api;
    };
    /**
     * 框架页 - 顶部快捷菜单
     * @param _opts
     * @returns {object} obj
     *   {undefined} obj.setData({Array}) 设置快捷菜单数据
     *   {Array}     obj.getData() 获取快捷菜单数据
     */
    $.fn.initShortcuts=function(_opts){
        var CONF={// 常量
            maxCounts:5
        };
        var el=$(this);
        var opts= $.extend({
            data:[]
            ,showConfig:true// 是否显示配置，默认显示
            //        ,onConfig:function(data) // 点击配置后的回调函数
            //        ,onClick:function(menuData) // 点击菜单后的回调函数
        },_opts);
        var api;
        var _data=opts.data;

        var _refresh=function(){
            if(!_data){
                return;
            }
            var str='';
            var len=Math.min(opts.showConfig ? CONF.maxCounts-1 : CONF.maxCounts,_data.length);// 快捷菜单总数，显示配置，则少显示一个
            for(var i= 0,item;i<len;i++){
                item=_data[i];
                str+='<li class="shortcuts-li" data-i="'+i+'">';
                str+='<div class="shortcuts-ico"><span class="fa fa-bookmark-o"></span></div>';
                str+='<div class="shortcuts-txt">'+item['appname']+'</div>';
                str+='</li>'
            }
            if(opts.showConfig){
                str+='<li class="shortcuts-li shortcuts-li-cog" data-i="'+i+'">';
                str+='<div class="shortcuts-ico"><span class="fa fa-cog"></span></div>';
                str+='<div class="shortcuts-txt">配置</div>';
                str+='</li>'
            }
            el.html('').append(str);
        };
        var _setData=function(data){
            _data=data;
            _refresh();
        };
        var _getData=function(){
            return _data;
        };
        var _init=function(){
            el.addClass('shortcuts')
              .off('click.goto')
              .on('click.goto','.shortcuts-li',function(){
                  var menu=$(this);
                  if(menu.hasClass('shortcuts-li-cog')){// 快捷菜单配置
                      opts.onConfig && opts.onConfig(_data);
                  }else{
                      opts.onClick && opts.onClick(_data[parseInt(menu.attr('data-i'))]);
                  }
              });
            _refresh();
        };
        api={
            setData:_setData,
            getData:_getData
        };
        _init();
        return api;
    };
    /**
     * 框架页 - 用户菜单
     * @param _opts
     * @returns {object} obj
     *   {undefined} obj.setData({Array}) 设置菜单数据
     */
    $.fn.initUserMenu=function(_opts){
        var el=$(this);
        var userDpObj,userDpEl;
        var opts= $.extend({
            data:[],
            onClick: $.noop
        },_opts);
        var api;
        var _data;
        var initDomStr=function(datalist){
            var str='<ul class="wi-menu-curMenu">';
            for(var i=0,cur,len=datalist.length;i<len;i++){
                cur=datalist[i];
                str+='<li title="'+cur['title']+'" data-i="'+i+'">' +
                    '<span class="wi-menu-icon fa '+(cur['icocls']||'fa-folder')+'"></span><span class="wi-menu-content">'+cur['title']+'</span>' +
                    '</li>';
            }
            str+='</ul>';
            return str;
        };
        var onClick=function(){
            opts.onClick(_data[parseInt($(this).attr('data-i'))]);
            userDpObj.close();
        };
        var showUserDp=function(){
            userDpObj.show();
        };
        var setData=function(data){
            _data=data;
            userDpEl.html(initDomStr(_data));
        };
        var init=function(){
            userDpEl=$('<div class="wi-menu wi-menu-open user-menu"></div>');
            _data=opts['data'];
            setData(_data);
            userDpEl.off('click.userMenu')
                    .on('click.userMenu','li',onClick);// 用户菜单点击事件
            userDpObj= el.dropdown({
                cont: userDpEl
                ,adjust: true
                ,show: false
            });
            el.on('click',showUserDp);
        };
        api={
            setData:setData
        };
        init();
        return api;
    };
    /**
     * 初始化进度条组件
     * @param el {object} jquery 对象，将被添加 progress-bar 样式
     * @param opts
     *   opts.contEl {object} 对应的进度内容容器 jquery 对象，其中的子元素以 data-pro 标记对应步骤的索引
     *   opts.steps {array} steps[i]={ txt} txt:{string}-步骤名称
     *   opts.curIdx {number=} 初始化时选中的步骤索引
     *   opts.beforeGoto {function=} beforeGoto(curIdx) 切换步骤时的回调
     *   opts.allowReview {boolean=} 到达最后一步后是否允许会看，默认不允许
     * @returns {{viewTo: viewTo, goTo: goTo, goNext: goNext}|*}
     */
    $.progressFn=function(el,opts){
        opts= $.extend({
            //contEl: 进度内容容器对应的 jquery 队形，切换进度时，将根据其中子元素的 data-pro 指定的步骤索引控制显示隐藏
            steps:[],
            //curIdx:0,// 当前进度
            //viewIdx:0,// 当前显示进度 - 若未指定，在 init() 中设为 curIdx
            beforeGoto: $.noop,// function(curIdx)
            beforeViewto: $.noop,// function(viewIdx)
            onClick: $.noop// function(newIdx,curIdx) 点击进度条切换显示时，若返回 false 将阻止切换
        },opts);
        var jqPros,jqCont,
            steps,stepCount,// 进度数据，进度总数
            api;
        /**
         * 跳转到指定步骤
         * @param idx {number} 要跳转到的进度索引
         */
        var goTo=function(idx){
            if(typeof idx === 'string') idx=parseInt(idx);
            if(idx<0 || idx>=stepCount) return;
            if(opts.beforeGoto && opts.beforeGoto(idx)==false){
                return;// 如果定义了 beforeGoto，若返回 false 则阻止切换
            }
            // 移除进度条所有步骤状态
            jqPros.removeClass('done active');
            jqPros.eq(idx).prevAll().addClass('done');// 当前进度之前标记为已完成
            api.curIdx=idx;
            viewTo(idx);
        };
        var viewTo=function(idx){
            if(typeof idx === 'string') idx=parseInt(idx);
            if(idx<0 || idx>api.curIdx) return;
            if(opts.beforeViewto && opts.beforeViewto(idx)==false){
                return;// 如果定义了 beforeViewto，若返回 false 则阻止切换
            }
            jqPros.filter('.done').removeClass('active');// 移除所有已完成步骤的 active 状态，进行到的最后一项的 active 状态始终保留
            jqPros.eq(idx).addClass('active');
            // 显示对应进度内容
            jqCont.children('[data-pro]').css('display','none');
            jqCont.children('[data-pro="'+idx+'"]').css('display','');
            api.viewIdx=idx;
        };
        // 跳转到下一步
        var goNext=function(){
            goTo(api.viewIdx+1);// 从当前显示项跳转到下一步
        };
        var viewPrev=function(){
            viewTo(api.viewIdx-1);// 从当前显示项显示上一步
        };
        // 点击进度条跳转
        var onProClick=function(){
            var proEl=$(this),
                newIdx=proEl.index(),
                oldIdx=api.curIdx;
            // 是否拦截点击跳转
            if(opts.onClick(newIdx)==false) return;
            if(newIdx<=oldIdx){
                viewTo(newIdx);
            }else{
                goTo(newIdx);
            }
        };
        var initDom=function(){
            var steps=opts.steps;
            var str='',curCls;
            var styCls = 'style="width:'+Math.floor(100/stepCount)+'%"';
            for(var i=0,step;i<stepCount;i++){
                curCls='';
                step=steps[i];
                if(i==0){
                    curCls=' first';
                }else if(i==stepCount-1){
                    curCls=' last';
                }
                str+='<div class="progress-step' + curCls + '" data-pro="'+i+'"' + styCls + '>' +
                    '<div class="progress-bg"><div class="progress-ico"></div></div>' +
                    '<p class="progress-txt">' + step['txt'] + '</p></div>';
            }
            el.addClass('progress-bar')
              .html(str);
        };
        var init=function(){
            steps=opts.steps;
            stepCount=steps.length;
            initDom();
            jqPros=el.children('.progress-step');
            jqCont=opts.contEl;
            jqCont.children('[data-pro]').css('display','none');
            if(typeof opts.curIdx!='undefined'){
                opts.viewIdx = typeof opts.viewIdx=='undefined' ? opts.curIdx : opts.viewIdx;// 未定义显示项时，显示当前项
                goTo(opts.curIdx);// 进度设置
                if(opts.viewIdx !== opts.curIdx){// 定义了 viewIdx，且未超过 curIdx
                    viewTo(opts.viewIdx);
                }
            }
            el.off('click.progress')
              .on('click.progress','.progress-step',onProClick);
        };
        api={
            //curIdx: - 当前进度索引，init() 中设置默认选中项时赋初始值
            //viewIdx: - 当前显示进度索引，init() 中设置默认选中项时赋初始值
            viewTo: viewTo,// 仅切换显示进度，不改变进度状态，不会触发 beforeGoto
            goTo: goTo,// 切换显示进度，并改变进度状态，会触发 beforeGoto
            goNext: goNext,// 改变进度状态到下一步，相当于 goTo(curIdx+1)
            viewPrev: viewPrev// 显示上一步
        };
        init();
        return api;
    };
    /**
     * 可编辑表格的辅助工具
     * @param opts
     *   opts.conf {object} 编辑项对应的配置
     *     conf.type {string=} 编辑项对应的表单元素类型。默认为'text'，可选值：'select'-下拉框
     *     conf.rules {object=} 编辑项对应的验证规则，同验证组件的规则部分
     *     conf.options {array=} 下拉框选项，每一项对应一个候选项{txt:文本,val:值}
     *   opts.gridApi {object=} 表格接口
     *   opts.onAdd {function=} function(row,jqTr)
     *   opts.onEdit {function=} function(row,i)
     *   opts.onCancel {function=} function(i)
     *   opts.callback {object}
     * @returns {{setGridApi: setGridApi, viewEditRow: viewEditRow, viewAddRow: viewAddRow}|*}
     */
    $.initEditGridHelper=function(opts){
        opts= $.extend({
            //conf:{},
            //gridApi:object
            //onAdd: function(row,jqTr)
            //onEdit: function(row,i)
            //onCancel: function(i)
            //afterViewEdit: function(row,i,jqCont)
            //afterViewAdd: function(jqCont)
        },opts);
        var api,gridApi,el;
        var conf, oGridOpts;// 编辑列定义，grid 组件 opts 配置
        var oDetailAddingRow;// 编辑行保存时暂存新增行数据
        var oCurEditRules={},oCurAddRules={};// 记录当前行特殊的验证规则，通过 setRules(field,rules,i) 设置的验证规则
        var setGridApi=function(grid){
            gridApi = grid;
            if(gridApi){
                el = gridApi.el;
                oGridOpts = gridApi.getOpts();
            }else{
                el = null;
                oGridOpts = null;
            }
        };
        /**
         * 根据编辑内容获取当前编辑行数据
         * @param trEl 当前行对应的 jquery 元素对象
         * @param i 当前行对应的索引，-1 为新增行
         * @param shouldVali {boolean=} 是否需要验证，默认为 true
         * @returns {object|undefined}
         */
        var getEditRowData=function(trEl,i,shouldVali){
            var oResult={};
            var oConf,jqInput,oRules;
            var oRowRules= (i==-1?oCurAddRules:oCurEditRules);// 当前行验证规则
            shouldVali = shouldVali!==false;// 只有在定义为 false 跳过验证
            for(var sField in conf){
                if(conf.hasOwnProperty(sField)){
                    jqInput=trEl.find('[name="'+sField+'"]');
                    oConf=conf[sField];
                    oRules=oRowRules[sField]||oConf.rules;
                    if(oConf.type=='boolean'){// 布尔型，需将值由 string 转换为 boolean
                        oResult[sField] = jqInput.val()=='true' ? oConf.trueVal : oConf.falseVal;
                    }else if(shouldVali && oRules && !jqInput.validate(oRules)){// 定义了验证规则，但未通过验证
                        return;
                    }else{
                        oResult[sField]=jqInput.val();
                    }
                }
            }
            return oResult;
        };
        /**
         * 生成可编辑单元格编辑状态的dom字符串内容
         * @param name {string} 当前编辑项对应的 field
         * @param val {*} 编辑项当前值
         * @param row {object} 编辑行原始数据
         * @returns {string} '<td>...</td>'
         */
        var getEditTdStr=function(name,val,row){
            var str='',
                oConf = conf[name] || { type:'empty'};// 未在 conf 中定义时，默认显示空白，即 type='empty'
            if(typeof val == 'undefined'){
                val='';
            }
            str+='<td class="center" data-name="'+name+'"><div class="listtable-item">';
            switch(oConf.type){
                //case 'ctrl':break;// 操作列绘制，在 getEditRowStr() 直接生成，此处不做处理
                case 'select':
                    str+='<select class="txt" name="'+name+'">';
                    var options=oConf.options;
                    if(options && options.length){
                        for(var i= 0,opt,len=options.length;i<len;i++){
                            opt=options[i];
                            str+='<option value="'+opt.val+'"'+(opt.val==val?' selected':'')+'>'+opt.txt+'</option>'
                        }
                    }
                    str+='</select>';
                    break;
                case 'readonly':
                    str+='<input class="txt" type="text" name="'+name+'" value="'+val+'" readonly />';
                    break;
                case 'boolean':
                    str+='<div class="ico '+(oConf.trueVal===val ? 'ico-chk' : 'ico-nochk')+'"></div>' +
                        '<input type="hidden" name="'+name+'" value="'+(oConf.trueVal===val?'true':'false')+'" />';
                    break;
                case 'custom':
                    str+=oConf.render(val,row);
                    break;
                case 'empty':
                    str+='';
                    break;
                default:
                    str+='<input class="txt" type="text" name="'+name+'" value="'+(val||'')+'" />';
            }
            str+='</div></td>';
            return str;
        };
        /**
         * 生成可编辑行的dom字符串
         * @param row {object=} 可编辑行原有的数据，新增行可省略此参数
         * @param i {int} 行索引
         * @param add {boolean=} 是否为新增行
         * @returns {string}
         */
        var getEditRowStr=function(row,i,add){
            var str='';
            var ctrlStr,editFlag;
            var aCols = oGridOpts.cols,
                sCtrlName;// 记录操作列 name
            if(!row){
                row={};
            }
            if(add){// 新建
                editFlag=' data-adding';// 标记新建行
                ctrlStr='<button class="btn gbtn btn-success" type="button" data-val="add">新增</button>';
            }else{// 编辑
                editFlag=' data-editing';// 标记编辑行
                ctrlStr='<button class="btn gbtn btn-primary" type="button" data-val="save">保存</button>' +
                    '<button class="btn gbtn btn-default" type="button" data-val="cancel">取消</button>';
            }
            str += '<tr' + (i == -1 ? '' : ' data-i="' + i + '"') + editFlag + '>';
            for(var j= 0,col,name,oConf,len=aCols.length; j<len; j++){
                col = aCols[j];
                name = col['name'];
                oConf = conf[name];
                if(!sCtrlName && (oConf && oConf.type == 'ctrl' || j==len-1)){// 未定义过操作列，当前 type='ctrl'或已达最后一列，设为操作列
                    sCtrlName = name;
                    str+='<td class="center"><div class="listtable-item">'+ctrlStr+'</div></td>';
                }
                else{
                    str += getEditTdStr(name, row[name], row);
                }
            }
            str+='</tr>';
            return str;
        };
        var fAddRow=function(e){
            if(el.find('tbody>tr[data-editing]').length){// 有未完成的在修改的行
                $.showMsg('请先完成修改中的行');
                return;
            }
            var trEl=$(this).closest('tr');
            var rowData=getEditRowData(trEl,-1);// 获取当前编辑行数据
            if(rowData){
                //trEl.off('click.add');// 解绑事件 2017.06.05，onAdd 若未重新刷新列表，会导致新增事件不再触发
                oDetailAddingRow=undefined;
                if(opts.onAdd){
                    opts.onAdd(rowData,trEl);
                }
            }
            e.stopPropagation();
        };
        var fSaveRow=function(i,oldRow){// 保存按钮操作
            var trEl=$(this).closest('tr');
            oDetailAddingRow=getEditRowData(el.find('tbody>tr[data-adding]'),-1,false);
            var rowData=getEditRowData(trEl,i);
            if(rowData){
                //trEl.off('click.save click.cancel');// 解绑编辑行事件 2017.06.05，onEdit 若未重新刷新列表，会导致编辑事件不再触发
                if(opts.onEdit){
                    opts.onEdit(rowData,i,oldRow,trEl);
                }
            }
        };
        var fCancelRow=function(i){// 取消按钮操作
            var trEl=$(this).closest('tr');
            oDetailAddingRow=getEditRowData(el.find('tbody>tr[data-adding]'),-1,false);
            trEl.off('click.save click.cancel');// 解绑事件
            gridApi.setData(gridApi.getCurData());
            if(opts.onCancel){
                opts.onCancel(i);
            }
        };
        var fOnBooleanClick=function(){
            var jqCur=$(this),
                jqIpt=jqCur.next(),
                val=jqIpt.val();// 字符串：true/false
            if(val=='true'){
                jqIpt.val('false');
                jqCur.removeClass('ico-chk')
                     .addClass('ico-nochk');
            }else{
                jqIpt.val('true');
                jqCur.removeClass('ico-nochk')
                     .addClass('ico-chk');
            }
        };
        var _initBindEvent=function(jqTr,row,i){
            var _cb=opts.callback;
            if(_cb){
                var name,eType;// 临时变量
                // 行事件
                var cbRow=_cb.row;
                if(typeof cbRow=='object'){
                    var cbRowHandle=function(handle,i){
                        return function(e){
                            var newRow=getEditRowData(jqTr,i,false);
                            handle.call(this,e,newRow,i,gridApi);
                        };
                    };
                    for(eType in cbRow){
                        if(cbRow.hasOwnProperty(eType)){
                            jqTr.off(eType+'.gridhelpercbrow')
                                .on(eType+'.gridhelpercbrow',cbRowHandle(cbRow[eType],i));
                        }
                    }
                }
                // 单元格事件
                var cbCell=_cb.cell;
                if(typeof cbCell=='object'){
                    var cbCellHandle=function(handle,name,i){
                        return function(e){
                            var newRow=getEditRowData(jqTr,i,false);
                            handle.call(this,e,newRow[name],row,i,gridApi);
                        };
                    };
                    for(name in cbCell){
                        if(cbCell.hasOwnProperty(name)){
                            for(eType in cbCell[name]){
                                if(cbCell[name].hasOwnProperty(eType)){
                                    jqTr.off(eType+'.gridhelpercbcell_'+name)
                                        .on(eType+'.gridhelpercbcell_'+name,'>td[data-name="'+name+'"]',cbCellHandle(cbCell[name][eType],name,i));
                                }
                            }
                        }
                    }
                }
            }
        };
        var bindTrEvent=function(jqTr,row,i){
            var oConf;
            for(var name in conf){
                if(conf.hasOwnProperty(name)){
                    oConf=conf[name];
                    switch(oConf.type){
                        case 'boolean':// 布尔型
                            jqTr.on('click.gridhelper','>[data-name="'+name+'"]>*>.ico',fOnBooleanClick);
                            break;
                        case 'custom':// 自定义类型
                            if(oConf.onClick){
                                jqTr.on('click.gridhelper','>[data-name="'+name+'"]',(function(handle,name){
                                    return function(e){
                                        handle.call(this,e,row?row[name]:undefined,row,i,gridApi);
                                    };
                                })(oConf.onClick,name));
                            }
                    }
                }
            }
            _initBindEvent(jqTr,row,i);
        };
        var viewEditRow=function(row,i){// row 当前行数据，i 当前行索引
            if(!gridApi) return;
            if(el.find('tbody>tr[data-editing]').length){// 有未完成的在修改的行
                $.showMsg('请先完成修改中的行');
                return;
            }
            var trEl=$(getEditRowStr(row,i));// 当前行显示为编辑行
            oCurEditRules={};// 清空之前的编辑行验证规则
            trEl.off('click.save click.cancel');// 解绑事件
            trEl.on('click.save','[data-val="save"]',function(e){
                    fSaveRow.call(this,i,row);
                    e.stopPropagation();
                })
                .on('click.cancel','[data-val="cancel"]',function(e){
                    fCancelRow.call(this,i,row);
                    e.stopPropagation();
                });// 完成/取消编辑时解绑事件
            bindTrEvent(trEl,row,i);
            el.find('tbody>tr[data-i="'+i+'"]').replaceWith(trEl);
            opts.afterViewEdit && opts.afterViewEdit(row,i,trEl);
        };
        var viewAddRow=function(){// 向列表中添加一行新增行
            if(!gridApi) return;
            var trEl=$(getEditRowStr(oDetailAddingRow,-1,true));
            oCurAddRules={};// 清空之前的新增行验证规则
            oDetailAddingRow=undefined;
            trEl.off('click.add')
                .on('click.add','[data-val="add"]',fAddRow);
            bindTrEvent(trEl,undefined,-1);
            el.find('tbody').append(trEl);
            opts.afterViewAdd && opts.afterViewAdd(trEl);
        };
        // 定义 i 时，只对该行的对应字段添加验证规则，-1 为新增行
        var setRules=function(sField,rules,i){
            if(i===undefined){// 所有行验证
                conf[sField].rules=rules;
            }else{// 指定行验证
                if(i==-1){
                    oCurAddRules[sField]=rules;
                }else{
                    oCurEditRules[sField]=rules;
                }
            }
        };
        //重新配置conf  todo 只是修改了数据配置，并没有重新绘制dom
        var fResetConf = function(_key,_conf){
            if(!conf[_key]){
                return;
            }
            $.extend(conf[_key],_conf);
        };
        var init=function(){
            conf = opts.conf;
            setGridApi(opts.gridApi);
        };
        api={
            setGridApi:setGridApi,
            viewEditRow:viewEditRow,// 将当前行显示为编辑行
            viewAddRow:viewAddRow,// 在表格结尾添加新增行
            setRules:setRules,// 为字段重新指定验证规则
            resetConf:fResetConf //重新配置参数
        };
        init();
        return api;
    };
    /**
     * 列表编辑组件
     * @param el
     * @param opts
     * @returns {*}
     */
    $.initEditHelper=function(el,opts){
        opts= $.extend({
            //data:[],// 初始显示的数据
            defaultData:{},// 默认值
            viewBtnCls: 'edit-btn',
            itemRender: $.noop,
            editBtnCls: 'edit-btn',
            editRender: $.noop,
            //validator:{} initValidator 的参数
            callback: $.noop// 组件中数据变化（新增、编辑、删除）后的回调方法
        },opts);
        var api,data,
            curIdx,// 正在进行编辑的项的索引,-1 新增,number 修改,undefined 没有正在编辑的项
            jqEdit,
            oValiApi;// 验证组件接口
        var fAdd=function(){
            if(typeof curIdx!='undefined'){
                $.showAlert('请先完成正在编辑的项!');
                return;
            }
            fBeforeShowEdit(-1);
        };
        var fShowEdit=function(idx){
            var itemData=$.extend({},opts.defaultData,data[idx]);
            curIdx=idx;// 记录编辑项索引
            fBeforeShowEdit(idx,fGetJqItem(idx),itemData);
        };
        var fDelete=function(idx){
            data.splice(idx,1);// 移除原始数据中被删除的项
            fGetJqItem(idx).remove();
        };
        var fHideEdit=function(){
            if(curIdx!=-1){// 修改，显示被隐藏的显示项
                el.find('.edit-item').removeClass('hidden');
            }
            oValiApi && oValiApi.resetValStat();
            oValiApi=null;
            curIdx=undefined;
            jqEdit.off('tap.editctrl')
                  .remove();
        };
        var fSaveEdit=function(itemData){// 更新数据
            var jqItem;
            if(curIdx==-1){// 新增
                jqItem=$(fDrawItem(itemData));
                if(!data) data=[];
                data.unshift(itemData);
                el.prepend(jqItem);
            }else{// 修改
                itemData= $.extend(data[curIdx],itemData);
                jqItem=$(fDrawItem(itemData));
                el.find('.edit-item.hidden').eq(0).replaceWith(jqItem);
            }
            fHideEdit();
        };
        var fEditClick=function(){
            var jqCur=$(this);
            var itemData=jqEdit.serializeObject();
            if(jqCur.attr('data-type')=='save'){
                if(oValiApi && !oValiApi.validateAll()){// 定义了验证规则，但验证未通过
                    return;
                }
            }
            opts.callback.call(this,-1,itemData);
        };
        // 显示项中的按钮事件
        var fViewClick=function(){
            if(typeof curIdx!='undefined'){
                $.showAlert('请先完成正在编辑的项!');
                return;
            }
            var jqCur=$(this),
                jqItem=jqCur.closest('.edit-item'),
                idx=fGetJqItem().index(jqItem);
            opts.callback.call(this,idx,data[idx]);
        };
        var fSetItemVal=function(i,key,val){
            data[i][key]=val;
        };
        var fGetData=function(){
            return $.extend([],data);
        };
        // 获取指定索引的显示项 jq 对象，未指定，返回所有显示项 jq 对象
        var fGetJqItem=function(i){
            var jqItems=el.find('[data-view]');
            if(typeof i=='undefined'){
                return jqItems;
            }else{
                return jqItems.eq(i);
            }
        };
        var fReset=function(cusOpts){
            if(cusOpts){
                $.extend(opts,{// 暂只支持 data 重设
                    data:cusOpts.data/*,
                    defaultData:cusOpts.defaultData*/
                });
            }
            data=opts.data;
            if(data){
                fDrawDom();
            }
        };
        var fIsEditting=function(){
            return !(typeof curIdx=='undefined');
        };
        // 显示编辑项前的操作，修改 curIdx,填充表单，绑定事件，初始化验证规则
        // idx 编辑项索引，新增为 -1
        // jqItem 修改时生效，将被编辑的显示项 jq 对象
        // item 修改时生效，将被编辑的显示项数据
        var fBeforeShowEdit=function(idx,jqItem,item){
            curIdx=idx;
            jqEdit.setFormData($.extend({},opts.defaultData,item));// 填充数据
            jqEdit.on('click.inedit','.'+opts.editBtnCls,fEditClick);// 编辑项按钮事件 - remove() 将移除事件，每次添加前绑定
            if(opts.validator){
                oValiApi=jqEdit.initValidator(opts.validator);
            }
            if(idx==-1){
                el.prepend(jqEdit);// 添加编辑项
            }else{
                jqItem.before(jqEdit)// 显示编辑项
                      .addClass('hidden');// 隐藏对应显示项
            }
        };
        var fDrawItem=function(item){
            return '<div class="edit-item" data-view>'+opts.itemRender(item)+'</div>';
        };
        var fDrawDom=function(){
            var str='';
            for(var i=0,len=data.length;i<len;i++){
                str+=fDrawItem(data[i]);
            }
            el.html(str);
        };
        var fDrawEditDom=function(){
            jqEdit=$('<div class="edit-item" data-edit>'+opts.editRender()+ '</div>');
        };
        var init=function(){
            el.addClass('edit-list');
            fReset();
            fDrawEditDom();
            el.on('click.inview','[data-view] .'+opts.viewBtnCls,fViewClick);// 查看项按钮事件
        };
        api={
            reset:fReset,
            isEditting:fIsEditting,// 是否正在编辑
            showAdd:fAdd,// 显示新增表单
            showEdit:fShowEdit,// 显示编辑表单
            hideEdit:fHideEdit,// 显示编辑表单
            saveEdit:fSaveEdit,// 保存正在编辑的表单
            del:fDelete,// 显示编辑表单
            getData:fGetData,
            getJqItem:fGetJqItem,
            setItemVal:fSetItemVal// 临时方法，i,key,val 更新组件数据中第 i 项 key 属性的值为 val
        };
        init();
        return api;
    };
    //$.fn.initTabsBox=function(_opts){
    //    var el=$(this);
    //    var CONF={
    //        scrollCtrlW:20// 左右滚动按钮宽度各为 20
    //        ,addW:30
    //        ,liBefore:0
    //    };
    //    var _returnObj;
    //    var contBoxEl=el.children('.tab-cont-box');
    //    var headBoxEl=el.children('.tab-head-box');
    //    var opts=$.extend({
    //        tabs:[]
    //        //,headAlign:'right'
    //        ,context:false
    //        ,scroll:false
    //        ,noAdjust:false
    //        ,showAdd:false
    //    },_opts);
    //    var _tabs=[];
    //    var tabGuid = opts.noAdjust ? undefined : $.generateGuid('tab');// 用于标识 window 的 resize 事件
    //
    //    var _destroy=function(){
    //        if(headBoxEl.length){
    //            _tabs.length=0;
    //            tabGuid && $(window).off('resize.tab_'+tabGuid);
    //            headBoxEl.off('click.changeTab')
    //                     .off('click.addTab')
    //                     .off('click.scroll');
    //            headBoxEl.remove();
    //        }
    //    };
    //    var tabSizes=[];// 支持滚动的状态记录 tab 头部尺寸
    //    var tabTotalSize=0;
    //    var ulWidth=0;// ul 可显示的尺寸
    //    /**
    //     * 重新计算 tab 头部尺寸
    //     * @param index {int=} 要重计算的 tab 的索引，未指定则重计算全部 tab
    //     * @private
    //     */
    //    var _calulateSizes=function(index){
    //        var lis=headBoxEl.find('.tab-head')
    //            ,li,liBCR,item,curW;
    //        if(index==undefined){// 重新计算全部
    //            tabSizes.length=0;
    //            tabTotalSize=0;
    //            var len=_tabs.length;
    //            for(index=0;index<len;index++){
    //                item=_tabs[index];
    //                li=lis.eq(index);
    //                li.css('width',item['width']||'');
    //                liBCR=li[0].getBoundingClientRect();
    //                curW=liBCR.right-liBCR.left;
    //                tabSizes.push(curW);
    //                tabTotalSize+=curW;
    //            }
    //        }else{
    //            item=_tabs[index];
    //            li=lis.eq(index);
    //            li.css('width',item['width']||'');
    //            liBCR=li[0].getBoundingClientRect();
    //            curW=tabSizes[index];
    //            if(curW!=undefined) tabTotalSize-=curW;
    //            curW=liBCR.right-liBCR.left;
    //            tabTotalSize+=curW;
    //            tabSizes[index]=curW;
    //        }
    //    };
    //    /**
    //     * 根据指定项或选中项滚动
    //     * @param index {int=} 要滚动到视图内的 tab 索引，未定义则为当前选中项索引
    //     * @private
    //     */
    //    var _scrollToSeL=function(index){
    //        if(!headBoxEl.hasClass('tab-scroll')) return;
    //        var headUl=headBoxEl.find('>ul')
    //            ,lis=headUl.children('.tab-head');
    //        var curLeft=0,curRight=0;// 选中项边界
    //        if(index==undefined) index=lis.index(lis.filter('.now'));
    //        for(var i= 0;i<tabSizes.length;i++){
    //            if(i==index){// 选中项
    //                curRight=curLeft+tabSizes[i];
    //                break;
    //            }
    //            curLeft+=tabSizes[i];
    //        }
    //        if(headUl.is(':animated')) headUl.stop(true);
    //        if(curRight==0){
    //            //                headUl.css({'left':CONF.scrollCtrlW+'px'});
    //            headUl.animate({'left':CONF.scrollCtrlW+'px'});
    //        }else{
    //            var hideL=CONF.scrollCtrlW-headUl.position().left;// 左侧已被隐藏的部分的尺寸
    //            if(hideL>curLeft){
    //                //                    headUl.css({'left':-curLeft+CONF.scrollCtrlW+'px'});
    //                headUl.animate({'left':-curLeft+CONF.scrollCtrlW+'px'});
    //            }else if(ulWidth+hideL-CONF.scrollCtrlW<curRight){
    //                //                    headUl.css({'left':ulWidth-curRight-CONF.scrollCtrlW+'px'});
    //                headUl.animate({'left':ulWidth-curRight-CONF.scrollCtrlW+'px'});
    //            }
    //        }
    //    };
    //    /**
    //     * 滚动头部
    //     * @param toNext {boolean=} 向后滚动
    //     * @private
    //     */
    //    var _scrollHead=function(toNext){
    //        if(!headBoxEl.hasClass('tab-scroll')) return;
    //        var headUl=headBoxEl.find('>ul');
    //        var hideL=CONF.scrollCtrlW-headUl.position().left// 左侧已被隐藏的部分的尺寸
    //            ,hideR=hideL+ulWidth-CONF.scrollCtrlW;// 右侧被隐藏部分前的尺寸
    //        var curW= 0, i, index;
    //        if(toNext){// 向后
    //            for(i= 0;i<tabSizes.length;i++){
    //                curW+=tabSizes[i];
    //                if(curW>hideR){
    //                    index = i;
    //                    break;
    //                }
    //            }
    //        }else{// 向前
    //            for(i= 0;i<tabSizes.length;i++){
    //                curW+=tabSizes[i];
    //                if(curW>=hideL){
    //                    index = i;
    //                    break;
    //                }
    //            }
    //        }
    //        if(index!=undefined) _scrollToSeL(index);
    //    };
    //    var _adjust=function(){
    //        var headUl=headBoxEl.find('>ul');
    //        _calulateSizes();// 复原尺寸
    //        // 计算 ul 尺寸
    //        var headBCR=headBoxEl.eq(0)[0].getBoundingClientRect();
    //        ulWidth=headBCR.right-headBCR.left;
    //        if(opts.showAdd){// 显示添加
    //            ulWidth-=CONF.addW;
    //        }
    //        if(tabTotalSize!=0 && ulWidth!=0 && tabTotalSize>ulWidth){// 超出
    //            if(opts.scroll){
    //                headBoxEl.addClass('tab-scroll');
    //                headUl.css('width',tabTotalSize+'px');
    //                var left=headUl.position().left;
    //                if(left > CONF.scrollCtrlW){// 左侧有留白
    //                    headUl.css({'left':CONF.scrollCtrlW+'px'});
    //                }else if(tabTotalSize + left < ulWidth - CONF.scrollCtrlW){// 右侧有留白
    //                    headUl.css({'left':ulWidth - tabTotalSize - CONF.scrollCtrlW+'px'});
    //                }
    //            }else{
    //                tabSizes.length && headUl.children('.tab-head').css('width',100/tabSizes.length+'%');
    //            }
    //        }else{
    //            if(opts.scroll){
    //                if(headUl.is(':animated')) headUl.stop(true);
    //                headUl.css('width','');
    //                headBoxEl.removeClass('tab-scroll');
    //                headUl.css('left',0);
    //            }
    //        }
    //    };
    //    /**
    //     * 添加 tab 页
    //     * @param tab {object} tab 页对象，结构同 opts.tabs[i]
    //     * @param noToggle {boolean=} 添加后是否不立即切换，默认为 false，即，添加即切换
    //     * @private
    //     */
    //    var _addTab=function(tab,noToggle){
    //        if(!headBoxEl || !tab) return;
    //        var val=tab.val;
    //        var sameTab=_getTab('val',val);
    //        if(sameTab){
    //            _selectTab(sameTab);// 选中已有项
    //        }else{
    //            !tab.txt && (tab.txt=tab.val);
    //            var txt=tab.txt
    //                ,remove=tab.remove || false;
    //            var cssStr='';
    //            if(remove){
    //                cssStr+='padding-right:20px;';
    //            }
    //            if(tab.width) cssStr+='width:'+tab.width+';';
    //            var li=$('<li title="'+(typeof tab.title!='undefined'?tab.title:txt)+'" class="tab-head" data-val="'+val+'">'
    //                +'<div class="tab-head-item" style="'+ cssStr +'">'
    //                +txt
    //                +(remove?'<div class="tab-head-remove"></div>':'')
    //                +'</div></li>');
    //            if(opts.headAlign=='right'){
    //                headBoxEl.children('ul').prepend(li);
    //            }else{
    //                headBoxEl.children('ul').append(li);
    //            }
    //            /* 内容部分 */
    //            var contStr=tab.url ?
    //            '<iframe width="100%" height="100%" data-name="'+tab.val+'" frameborder="0" scrolling="no" src="'+tab.url+'"></iframe>':
    //                tab.cont;
    //            var contEl=contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]');
    //            if(contStr){
    //                if(contEl.length){
    //                    contEl.html(contStr);
    //                }else{
    //                    contBoxEl.append('<div class="tab-cont" data-val="'+val+'">'+contStr+'</div>');
    //                }
    //            }
    //            _tabs.push(tab);
    //            _calulateSizes(_tabs.length-1);
    //            _adjust();
    //            !noToggle && headBoxEl.find('>ul>li.tab-head[data-val="'+val+'"]').click();
    //        }
    //    };
    //    var _getTabs=function(key,value){
    //        var tabs=[], i, tab;
    //        if(key){
    //            for(i= 0;i<_tabs.length;i++){
    //                tab=_tabs[i];
    //                if(tab[key]==value){
    //                    tabs.push(tab);
    //                }
    //            }
    //        }else{
    //            $.extend(tabs,_tabs);
    //        }
    //        return tabs;
    //    };
    //    var _getTab=function(key,value){
    //        var i, tab;
    //        if(key){
    //            for(i= 0;i<_tabs.length;i++){
    //                tab=_tabs[i];
    //                if(tab[key]==value){
    //                    return tab;
    //                }
    //            }
    //        }
    //    };
    //    var _refreshTab=function(val){
    //        var contFrame=contBoxEl.find('>.tab-cont[data-val="'+val+'"]>iframe');
    //        if(contFrame.length) contFrame[0].contentWindow.location.reload();
    //    };
    //    var _selectTab=function(tab,val){
    //        if(typeof tab=='string' && val!=undefined){// 根据键值查找 tab
    //            tab=_getTab(tab,val);
    //        }
    //        if(!tab) return;
    //        var headEl=headBoxEl.find('>ul>li.tab-head[data-val="'+tab.val+'"]');
    //        if(!headEl.hasClass('now')){// tab 未选中
    //            var gotoTab=function(){
    //                headBoxEl.find('>ul>li.tab-head.now').removeClass('now');
    //                contBoxEl.find('>.tab-cont.now').removeClass('now');
    //                headEl.addClass('now');
    //                contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]').addClass('now');
    //                opts.onChange && opts.onChange(tab.val);
    //                _scrollToSeL();
    //            };
    //            var oldHeadEl=headBoxEl.find('>ul>li.tab-head.now');
    //            if(opts.onLeave && oldHeadEl.length){// 原先有选中的 tab
    //                opts.onLeave(oldHeadEl.attr('data-val'),gotoTab);
    //            }else{
    //                gotoTab();
    //            }
    //        }else{
    //            _scrollToSeL();
    //        }
    //    };
    //    /**
    //     * 删除指定的 tab
    //     * @param tab {object|string}
    //     * @param val {string|boolean=}
    //     * @private
    //     */
    //    var _removeTab=function(tab,val){
    //        if(typeof tab=='string' && val!=undefined){// 键值对指定 tab
    //            tab=_getTab(tab,val);
    //            if(!tab) return;
    //        }
    //        var headEl=headBoxEl.find('>ul>li.tab-head[data-val="'+tab.val+'"]');
    //        if(headEl.hasClass('now') && _tabs.length>1){// 当前项为选中项，且还有其他标签页
    //            var i=_tabs.indexOf(tab);
    //            if(i!=_tabs.length-1){// 不是最后一项，选中后一项
    //                _selectTab(_tabs[i+1]);
    //            }else{
    //                _selectTab(_tabs[i-1]);
    //            }
    //        }
    //        var index=_tabs.indexOf(tab);
    //        _tabs.splice(index,1);// 移除
    //        tabSizes.splice(index,1);// 移除尺寸记录
    //        headEl.remove();// 移除标题
    //        if(!tab.keepcont){// 删除时不保留内容
    //            contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]').remove();
    //        }
    //        opts.onRemove && opts.onRemove(tab.val);
    //        _adjust();
    //    };
    //    /**
    //     * 删除全部 tab
    //     * @private
    //     */
    //    var _removeAll=function(){
    //        for(var i=_tabs.length-1;i>=0;i--){
    //            _removeTab(_tabs[i]);
    //        }
    //    };
    //    var contextVal;
    //    var _initContext=function(){
    //        var contEl=$('<div class="context"><ul>' +
    //            '<li data-val="closeThis"><span class="context-item">关闭当前页</span></li>' +
    //            '<li data-val="closeElse"><span class="context-item">关闭其他</span></li>' +
    //            '<li data-val="closeAll"><span class="context-item">关闭所有</span></li>' +
    //            '<li data-val="refresh"><span class="context-item">刷新</span></li>' +
    //            '</ul></div>');
    //        // 右键菜单
    //        contEl.on('click','li',function(){
    //            var type=$(this).attr('data-val');
    //            var tab,i,removeTabs=[];
    //            if(type=='closeThis'){
    //                removeTabs.push(_getTab('val',contextVal));
    //            }else if(type=='closeElse'){
    //                for(i=0;i<_tabs.length;i++){
    //                    tab=_tabs[i];
    //                    if(tab.val!=contextVal && tab.remove){// 不是当前项，且允许关闭
    //                        removeTabs.push(tab);
    //                    }
    //                }
    //            }else if(type=='closeAll'){
    //                for(i=0;i<_tabs.length;i++){
    //                    tab=_tabs[i];
    //                    if(tab.remove){// 允许关闭的项
    //                        removeTabs.push(tab);
    //                    }
    //                }
    //            }else if(type=='refresh'){
    //                _refreshTab(contextVal);
    //            }
    //            for(i=0;i<removeTabs.length;i++){
    //                _removeTab(removeTabs[i]);
    //            }
    //            contextMenu.close();
    //        });
    //        var contextMenu=headBoxEl.dropdown({
    //            cont:contEl
    //            ,context:true
    //            ,beforeShow:function(e){
    //                var headLi=$(e.target).closest('li');
    //                contEl.find('li').css('display','');
    //                if(headLi.length && headBoxEl.find(headLi).length>0){
    //                    contextVal=headLi.attr('data-val');
    //                    if(!_getTab('val',contextVal).remove){// 禁止关闭的tab页
    //                        contEl.find('li[data-val="closeThis"]').css('display','none');
    //                    }
    //                }else{// 不在tab页上，只显示关闭全部
    //                    contextVal=undefined;
    //                    contEl.find('li:not([data-val="closeAll"])').css('display','none');
    //                }
    //            }
    //        });
    //    };
    //    var _init=function(){
    //        el.addClass('tab-box');
    //        if(!headBoxEl.length){
    //            headBoxEl=$('<div class="tab-head-box clearf"><ul class="clearf"></ul>' +
    //                (opts.scroll?'<div class="tab-prev"></div><div class="tab-next"></div>':'') +
    //                '</div>');
    //        }
    //        if(!contBoxEl.length){
    //            contBoxEl=$('<div class="tab-cont-box"></div>');
    //        }
    //        headBoxEl
    //            .on('click.changeTab','>ul>li.tab-head',function(){
    //                var head=$(this);
    //                var val=head.attr('data-val');
    //                _selectTab('val',val);
    //            })
    //            .on('click.removeTab','.tab-head-remove',function(e){
    //                var tab=_getTab('val',$(this).closest('.tab-head').attr('data-val'));
    //                _removeTab(tab);
    //                e.stopPropagation();
    //            });
    //        if(opts.context){// 显示右键菜单
    //            _initContext();
    //        }
    //        tabGuid && $(window).on('resize.tab_'+tabGuid,_adjust);// 监听窗口 resize 事件
    //        el.prepend(headBoxEl);// 添加 head-box
    //        el.append(contBoxEl);// 添加 cont-box
    //        // 居右显示
    //        if(opts.headAlign=='right'){
    //            opts.scroll=false;// TODO 居右时暂不支持滚动
    //            headBoxEl.children('ul').addClass('tab-heads-r');
    //        }
    //        /* 根据 opts.tabs，添加 tab 页 */
    //        for(var i= 0;i<opts.tabs.length;i++){
    //            _addTab(opts.tabs[i],true);
    //        }
    //        // 显示添加
    //        if(opts.showAdd){
    //            headBoxEl.addClass('tab-withAdd');
    //            headBoxEl.append('<div class="tab-add" title="新增"></div>');
    //            opts.addHandler && headBoxEl.on('click.addTab','>.tab-add',function(){
    //                opts.addHandler();
    //            })
    //        }
    //        if(opts.scroll){
    //            headBoxEl.on('click.scroll','.tab-prev,.tab-next',function(){
    //                _scrollHead($(this).hasClass('tab-next'));
    //            });
    //        }
    //        opts.onInit && opts.onInit(_returnObj);
    //        if(opts.defaultVal!==false){// 定义为 false 时不选中任何 tab 页
    //            if(typeof opts.defaultVal=='undefined'){
    //                headBoxEl.find('li.tab-head').eq(0).click();// 默认选中第一项
    //            }else{
    //                headBoxEl.find('li.tab-head[data-val="'+opts.defaultVal+'"]').click();// 默认选中第一项
    //            }
    //        }
    //    };
    //    _returnObj={
    //        refreshTab: _refreshTab
    //        ,addTab: _addTab
    //        ,getTabs: _getTabs
    //        ,getTab: _getTab
    //        ,removeTab: _removeTab
    //        ,removeAll: _removeAll
    //        ,selectTab: _selectTab
    //        ,adjust:_adjust
    //        ,getSelect: function(){
    //            return _getTab('val',headBoxEl.find('>ul>li.now').attr('data-val'));
    //        }
    //        ,getContEl: function(tab){
    //            return contBoxEl.find('>.tab-cont[data-val="'+tab.val+'"]');
    //        }
    //    };
    //    _destroy();
    //    _init();
    //    return _returnObj;
    //};
    /**
     * 初始化 SerialCode
     * @param _opts
     *   - opts.name {string} 控件中文本框的 name 值
     *   - opts.minVal {int=} 控件支持的最小值
     *   - opts.value {string=} 初始化时的值
     *   - opts.digit {int=} 限定位数，默认为 4 位
     *   - opts.enable {bool=} 初始化时是否启用，默认为 true
     *   - opts.onChange {function(sCurVal,nCurVal)=} 值变化时的回调方法，参数分别为当前值的文本框字符串及数值形式
     * @return {object} returnObj
     *   - obj.setVal(val) 为文本框赋值（val {int|string}）
     *   - obj.getVal() 获取当前文本框字符串
     *   - obj.setEnable(enable) 禁用/启用（enable {bool}）
     *   - obj.setMinVal 设置最小值
     */
    $.fn.initSerialCode=function(_opts){
        var $this = this;
        var opts = $.extend({
            minVal:0,//最小值
            //name:'',//其中文本框对应的 name
            enable:true,
            digit:4,
            //value,//初始化时的值，默认为最小值
            step:1,
            onChange: $.noop
        },_opts);
        var nCurVal,// 当前数值
            sCurVal,// 当前文本框值
            nMaxVal=Math.pow(10,opts.digit)- 1,
            nMinVal=opts.minVal,
            step=opts.step,
            jqTxt;
        var returnObj;
        /**
         * 将一个数值转换为前面带0的字符串，_setVal中调用，不需考虑超出范围的情况
         * @param num {int} 要设置的实际数值
         * @returns {string}
         */
        function converStr(num){
            var digit = opts.digit,
                s = num.toString(),
                curDigit = s.length;
            for(var i=digit-curDigit;i>0;i--){
                s = '0' + s;
            }
            return s;
        }
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
            return sCurVal;
        }
        // 为文本框赋值（先判断值是否合法）
        /**
         * 将当前值改为 val
         * @param val {string|number=} 新值
         * @private
         */
        function _setVal(val){
            var nVal=parseInt(val);// 先转换为整数
            //  因为不允许为空，在值不是数字或过小，则显示为最小值
            if(isNaN(nVal) || nVal<nMinVal) {
                nVal = nMinVal;
            }else if(val>nMaxVal){
                nVal = nMaxVal;
            }
            sCurVal=converStr(nVal);
            if(sCurVal != parseInt($this.find('.iptVal').val())){
                jqTxt.val(sCurVal);
            }
            if(nVal != nCurVal){// 值发生变化
                nCurVal=nVal;
                opts.onChange(sCurVal,nCurVal);
            }
        }
        function _setMinVal(val){
            var nVal=parseInt(val);// 先转换为整数
            if(nVal!==nMinVal){
                nMinVal=nVal;
                _setVal(nCurVal);
            }
        }
        //上下箭头点击函数
        function clickFn(event){
            if(!opts.enable) return;
            _setVal($(this).hasClass('numbox-up') ? nCurVal+step : nCurVal-step);
        }
        // 键盘抬起事件 - 将当前文本框内容值更新到组件
        function changeFn(event){
            if(!opts.enable) return;
            _setVal(jqTxt.val());
        }
        //键盘按下事件
        function keydownFn(event){
            if(!opts.enable) return;
            var code = event.which;
            if (code == 38) {// 加step
                _setVal(nCurVal+step);
            }else if (code == 40) {// 减step
                _setVal(nCurVal-step);
            }else if(code == 13){// 回车
                _setVal(jqTxt.val());
                return false;
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
            getVal:_getVal,
            setEnable:_setEnable,
            setMinVal:_setMinVal
        };
        /* 初始化开始 */
        _init();
        return returnObj;
    };
    /**
     *
     * @param _opts
     * @returns {{filter: filter, removeAll: setConditions, setConditions: setConditions, getConditions: getConditions}|*}
     */
    $.fn.initConditions=function(_opts){
        var el=$(this),
            api,
            opts=$.extend({
                filterRender: $.noop,// function(key,val) return {title=,text}
                hTxt: '全部结果&nbsp;&gt;',
                onChange: $.noop
            },_opts),
            conditions={},
            jqCrumb;
        var filter=function(key,val,nochange){
            var jqCur=jqCrumb.find('[data-key="'+key+'"]');// 条件显示
            var oldVal=conditions[key];
            var renderObj=opts.filterRender(key,val);// title,text
            var htmlStr='';
            if(renderObj && typeof renderObj.text!='undefined'){
                if(typeof renderObj.title!='undefined'){
                    htmlStr+=renderObj.title+': ';
                }
                htmlStr+=renderObj.text;
            }
            if(val){
                conditions[key]=val;
                if(jqCur.length){
                    jqCur.html(htmlStr);
                }else{
                    jqCrumb.append('<li class="filter-crumb-item" data-key="'+key+'">'+htmlStr+'</li>');
                }
            }else{
                delete conditions[key];
                jqCur.remove();// 移除条件显示
            }
            if(!nochange && conditions[key]!=oldVal){
                opts.onChange();// 非传递触发，刷新数据
            }
        };
        var setConditions=function(newConditions,nochange){
            var allConditions= $.extend(conditions,newConditions);
            conditions=newConditions||{};
            for(var key in allConditions){
                if(allConditions.hasOwnProperty(key)){
                    filter(key,conditions[key],true);
                }
            }
            if(!nochange){
                opts.onChange();
            }
        };
        var fRemoveAll=function(nochange){
            setConditions(undefined,nochange);
        };
        var getConditions=function(){
            return conditions;
        };
        var fCrumbClick=function(){
            filter($(this).attr('data-key'));
        };
        var fGetDomStr=function(){
            var hStr=opts.hTxt;
            return '<ul class="filter-crumb-list">'+
                (hStr?'<li class="filter-crumb-h">'+hStr+'</li>':'')+
                '</ul>';
        };
        var init=function(){
            jqCrumb=$(fGetDomStr());
            el.addClass('filter-crumb')
              .html(jqCrumb)
              .on('click','li.filter-crumb-item',fCrumbClick);// 移除单个条件
        };
        api={
            filter:filter,
            removeAll:fRemoveAll,
            setConditions:setConditions,
            getConditions:getConditions
        };
        init();
        return api;
    };
    /**
     * 绘制各个分局
     * @param _opts
     * _opts.url {string} 请求数据的url地址
     * _opts.args {object=} 请求参数的键值对
     * _opts.idField {string} 数据源中每个对象id显示的字段名称
     * _opts.txtField {string} 数据源中每个对象显示的字段名称
     * _opts.szmField {string} 数据源中每个对象首字母显示的字段名称
     * _opts.isImport {bool=} 是否有导入按钮 true是带图片  false不带图片
     * _opts.cbConClick {function} 点击各分局的回调函数
     * _opts.cbImp {function} 点击各分局导入按钮的回调函数
     */
    $.fn.drawGFJ = function(_opts){
        var jqEl = $(this);
        var opts =$.extend({
            idField:'id',   //数据源中每个对象id显示的字段名称
            txtField:'name',  // 数据源中每个对象显示的字段名称
            szmField:'',  //数据源中每个对象首字母显示的字段名称
            isImport:false,    //是否有导入按钮 默认没有图片
            //aData:{},   //数据源
            cbConClick: $.noop,
            cbImp: $.noop
        },_opts);
        var idField = opts.idField,
            txtField = opts.txtField,
            szmField = opts.szmField;
        var jqDepUl = jqEl.find('.dep-ul'),
            jqSearch = jqEl.find('.txt-search');
        var cbConClick = opts.cbConClick,
            cbImp = opts.cbImp;
        var aReturnData = opts.aData;   //请求成功后的数据源
        var gfjFilterApi;   //分局过滤api
        var api;
        //得到当前点击项的数据源
        var fGetCurData = function(curId){
            for(var i=0;i<aReturnData.length;i++){
                if(curId ==aReturnData[i][idField] ){
                    return aReturnData[i];
                }
            }
        };
        //分局点击事件
        var fFjClick = function(){
            var nId = $(this).closest('li').attr('data-value');
            cbConClick(fGetCurData(nId));
        };
        //导入按钮点击事件
        var fImpClick = function(){
            var nId = $(this).closest('li').attr('data-value');
            cbImp(fGetCurData(nId));
        };
        /**
         * 根据请求回来的数据绘制部门列表
         * @param data
         */
        var fDrawUl = function(data){
            fDrawFilterUl(data);//初始化部门列表
            gfjFilterApi.setData(data);  //更新各分局的数据源
        };
        /**
         * 绘制列表
         * @param data
         */
        var fDrawFilterUl = function(data){
            var str = '';
            for(var i=0,item;i<data.length;i++){
                item = data[i];
                str +='<li data-value="'+item[idField]+'"> ';
                if(opts.isImport){
                    str +='<span class="dep-import" title="导入"></span>';
                }
                str += '<div class="dep-fenju"  title="'+item[txtField]+'" data-initial="'+item[szmField]+'">'+item[txtField]+'</div>'+
                    '</li>';
            }
            jqDepUl.html(str);
        };
        //返回整个数据
        var returnData = function(){
            return aReturnData;
        };
        //根据关键字查找当前数据
        var fGetDataByKey = function(key){
            for(var i=0, item; i<aReturnData.length; i++){
                item=aReturnData[i];
                if(item['id']==key){
                    return item;
                }
            }
        };
        var init = function(){
            gfjFilterApi = jqSearch.initGFJFilter({
                data:aReturnData,
                fields:txtField,
                initialFields:szmField,  //首字母过滤字段
                afterFilter:function(newData,keyword){
                    fDrawFilterUl(keyword!=''?newData:aReturnData);//关键字存在现实过滤后的部门。没有关键字显示所有部门
                }
            });
            fDrawUl(aReturnData);
            //给li绑定点击事件
            jqDepUl.off('click.dept').on('click.dept','.dep-fenju',fFjClick);
            jqDepUl.off('click.import').on('click.import','.dep-import',fImpClick);  //给导入按钮绑定点击事件
        };

        init(); //初始化
        api = {
            getData:returnData,
            getDataByKey:fGetDataByKey
        };
        return api;
    };
    /**
     *
     * @param el
     * @param opts
     * @returns {{fResetSearNum: fResetSearNum}|*}
     */
    _WI.initSearTab=function(el,opts){
        var oApi,jqAll,jqGltj;
        opts= $.extend({
            allVal:'all',// 标记全部的 val
            gltjVal:'gltj',// 标记关联条件的 val
            onClick: $.noop// onClick(val) val 为 data-val
        },opts);
        var fResetSearNum=function(data){
            el.find('.sear-item').removeClass('sear-exist');
            var jqLabel,jqDetail,
                jqTabSearLabel = el.find('.sear-item>label');
            for(var i= 0,cur,len=jqTabSearLabel.length;i<len;i++){
                jqLabel=jqTabSearLabel.eq(i);
                jqDetail=jqLabel.parent();
                cur=data[i];
                if(cur){
                    jqDetail.addClass('sear-exist');
                    if(!jqDetail.hasClass('sear-dot')){
                        jqLabel.text(cur);
                    }
                }else{
                    jqDetail.removeClass('sear-exist');
                    jqLabel.text('');
                }
            }
        };
        var fChangeSearGltj=function(keyVal){
            var cusPos=el.find('.sear-item.active').attr('data-val');
            jqGltj.html(keyVal);//过滤条件<span>赋搜索框的值
            if(keyVal){
                jqAll.addClass('hidden');//隐藏“全部”
                jqGltj.removeClass('hidden')//显示“过滤条件”
                      .trigger('click');// 重设关键字，切换到“过滤条件”
            }else{
                jqGltj.addClass('hidden');//隐藏“过滤条件”
                jqAll.removeClass('hidden');//显示“全部”
                if(cusPos=='gltj'){
                    jqAll.trigger('click');// 原来激活“过滤条件”，改为“全部”
                }
            }
        };
        var fTabClick=function(){
            var jqCur=$(this);
            jqCur.addClass('active')
                 .siblings().removeClass('active');
            opts.onClick(jqCur.attr('data-val'));
        };
        // 切换到指定 tab，默认触发 click 事件
        var fSelectTab=function(val,trigger){
            el.find('[data-val="'+val+'"]').addClass('active')
              .siblings().removeClass('active');
            if(trigger!==false){
                opts.onClick(val);
            }
        };
        var fInit=function(){
            jqAll = el.find('[data-val="all"]');//tab搜索“全部”
            jqGltj = el.find('[data-val="gltj"]');//tab搜索“过滤条件”
            el.off('click.detail')
              .on('click.detail','.sear-item',fTabClick);
        };
        oApi={
            fSelectTab:fSelectTab,
            fResetSearNum:fResetSearNum,// 重置 tab 上的数据
            fChangeSearGltj:fChangeSearGltj// 修改“过滤条件”的值
        };
        fInit();
        return oApi;
    };
    /**
     * 人员弹框选择
     * @param el
     * @param opts
     * @returns {object} obj
     * - obj.fSetArgs(newArgs) 重新设置弹框附加参数 args
     * - obj.fSetVal(newVal) 重新设置选中值，即选中项的主键集合[Array(string)]
     * - obj.fSetValData(newValData) 重新设置选中值，即选中项的主键集合[Array(object)]
     * - obj.fGetVal() 获取选中项值，返回选中项的主键集合[Array(id)]
     */
    _WI.initComPerson=function(el,opts){
        var api;
        opts= $.extend({
            //layerUrl:'',// 弹框路径，必须
            //layerOpts:{},// 弹框自定义属性，其中 content 将被 layerUrl 覆盖
            args:{},// 打开部门选择弹框时传递的附加参数 args
            value:[],// [Array(string)] 初始化时选中项的主键 id 集合
            showName:true,// 弹框中确定后是否用 .html() 将 el 的内容替换，默认为 true
            callback: $.noop// 设置选中项后的回调 function(data,value)
        },opts);
        var oLayerApi;
        var oArgs,// 打开弹框时传递的附加参数 args
            aVal;// [Array(string)] 当前选中项的主键 id 集合
        var fSetArgs=function(newArgs){
            oArgs=newArgs;
        };
        // 设置选中项数据后，调用 cb
        var fResetValData=function(data,cb){
            var aNewVal=[],aNewName=[],sNewName;
            for(var i= 0,len=data.length;i<len;i++){
                aNewVal.push(data[i]['id']);
                aNewName.push(data[i]['name']);
            }
            fSetVal(aNewVal);// 设置新的值
            if(opts.showName){
                sNewName=aNewName.join(';');
                el.html(sNewName);
                el.attr('title',sNewName)
            }
            if(cb){
                cb(data,aNewVal);
            }
        };
        var fSetVal=function(newVal){
            aVal=newVal;
        };
        var fSetValData=function(newValData){
            fResetValData(newValData);
        };
        var fGetVal=function(){
            return aVal;
        };
        var fShowLayer=function(){
            oLayerApi.show({
                data: {
                    val:aVal,
                    args:oArgs
                }
            });
        };
        var fLayerCb=function(data){
            fResetValData(data,opts.callback);
        };
        var fInit=function(){
            oArgs=opts.args;
            aVal=opts.value;
            oLayerApi=$.initWiLayer({
                name:'comDept',// 此处必须保证当前页面中弹框标识唯一，弹出页 window.initPage(name,data) 中的 name
                layerOpts: $.extend({
                        title:'选择人员',
                        area: ['600px','80%']
                    },
                    opts.layerOpts,
                    { content:opts['layerUrl']}
                ),
                callback:fLayerCb// 如果弹框时才能确定弹框的回调方法，则在 show 中定义
            });
            el.off('click.deptlayer')
              .on('click.deptlayer',fShowLayer);
        };
        api={
            fSetArgs:fSetArgs,
            fSetVal:fSetVal,
            fSetValData:fSetValData,
            fGetVal:fGetVal// 获取选中项值
        };
        fInit();
        return api;
    };

    $.initBox0 = function(el, opts){
        // 将对数据添加字段 __hidden 标识是否隐藏
        opts = $.extend({
            cols: 2,// 每行几列
            autoSelect: false,// 数据变更后是否默认选中
            showToggleEl: false,// 是否显示切换按钮，默认为 false
            onSelect: $.noop,// 改变选中项回调，参数为选中项对应的数据对象
            afterResetData: $.noop// 重置数据后绘制前调用 afterResetData(nodesData,api)
            //nodeRender:function(nodeData,api)
            //data {array} 或 url {string} + args {object}
            //filterEl:$('.js-filter-dep'),// 过滤元素 jquery 对象
            //filter:{
            //    fields:['depname']// 过滤字段
            //},
            //idField:'id',// 标识字段
            //txtField:'depname',// 显示字段
        }, opts);
        var api;
        var jqFilter = opts.filterEl;
        var aData,// 数据
            oFilter;// 过滤组件 api
        var sIdField = opts.idField,
            sTxtField = opts.txtField;
        var wStyStr = 'width:' + (parseInt(100 / opts.cols * 10) / 10) + '%;';// 根据列数计算每列尺寸
        var resetData = function(cusOpts){
            if(cusOpts){
                if(cusOpts.url){
                    opts.url = cusOpts.url;
                    opts.data = undefined;
                }
                else if(cusOpts.data){
                    opts.data = cusOpts.data;
                    opts.url = undefined;
                }
                if(cusOpts.args) opts.args = $.extend({}, cusOpts.args);
            }
            bindData();
        };
        var bindData = function(){
            var data = opts.data;
            if(!data && !opts.url) return;// 没有定义数据源时不进行数据部分绘制，用于支持初始化时不带入数据
            if(!data){// 后台不分页
                $.fn.request({
                    ajaxOpts: {
                        url: opts.url,
                        data: opts.args,
                        showloading: opts.showloading
                    },
                    drawDomFn: fAfterRequest
                });
            }
            else{
                fAfterRequest($.extend(true, [], data));
            }
        };
        // 重置数据后，计算 box 展开收起状态
        var fBoxFoldStat = function(){// 参数为 box0 对应的 jquery 对象
            if(!opts.showToggleEl) return;
            var jqMain = el.find('.box0-main'),
                jqUl = jqMain.children('ul');
            el.removeClass('box0-unfolded')
              .addClass('box0-folded');// 先折叠
            if(jqMain.innerHeight() > jqUl.outerHeight()){// 内容未超出最小值
                el.removeClass('box0-folded');
            }
        };
        var fGetNodeStr = function(data, infilter){
            var aCls = [];
            if(data['__hidden']){
                aCls.push('hidden');
            }
            if(data['__chk']){
                aCls.push('chk');
            }
            if(infilter){
                aCls.push('equally-filter');
            }
            return '<li class="equally ' + aCls.join(' ') + '"' +
                ' style="' + wStyStr + '" data-id="' + data[sIdField] + '" title="' + data[sTxtField] + '">' +
                '<div class="equally-item">' +
                ((opts.nodeRender ? opts.nodeRender(data, api) : '') || '<span class="equally-txt">' + data[sTxtField] + '</span>' ) +
                '</div>' +
                '</li>';
        };
        var fDrawNodesFilter = function(data, keyword){
            var jqMain = el.find('.box0-main'),
                jqUl = jqMain.children('ul'),
                strFilter = '',// 符合条件 dom 字符串
                strElse = '';// 不符合条件 dom 字符串
            var i, len = aData.length;
            if(data.length == len){
                for(i = 0; i < len; i++){
                    strElse += fGetNodeStr(aData[i]);
                }
            }
            else{
                for(i = 0; i < len; i++){
                    if(data.indexOf(aData[i]) != -1){
                        strFilter += fGetNodeStr(aData[i], true);
                    }
                    else{
                        strElse += fGetNodeStr(aData[i])
                    }
                }
            }
            jqUl.html(strFilter + strElse);
            opts.autoSelect && jqUl.find('.equally').first().click();// 重绘后暂未记录原有选项，点击第一个节点使激活状态符合实际
        };
        var fAfterRequest = function(data){
            aData = data || [];
            oFilter && oFilter.setData(aData);
            opts.afterResetData(aData, api);
            fDrawNodesFilter(aData);
            fBoxFoldStat();
        };
        var fFindIdxById = function(id){
            for(var i = 0, node, len = aData.length; i < len; i++){
                node = aData[i];
                if(node[sIdField] == id){
                    return i;
                }
            }
            return -1;
        };
        var fFindDataById = function(id){
            for(var i = 0, node, len = aData.length; i < len; i++){
                node = aData[i];
                if(node[sIdField] == id){
                    return node;
                }
            }
        };
        var fOnSelect = function(){
            var jqCur = $(this);
            el.find('.equally').removeClass('active');
            jqCur.addClass('active');
            opts.onSelect(fFindDataById(jqCur.attr('data-id')));
        };
        var getData = function(){
            return aData;
        };
        // 展开、收起操作
        var fOnMore = function(){
            if(el.hasClass('box0-folded')){
                el.removeClass('box0-folded')
                  .addClass('box0-unfolded');
            }
            else{
                el.removeClass('box0-unfolded')
                  .addClass('box0-folded');
            }
        };
        // 设置 id 指定的节点的选中状态，若 bChk = false，将 nodeData 取消选中
        var chkNode = function(id,bChk){
            var nodeData = null;
            if(fFindIdxById(id) != -1){// 已包含 nodeData
                nodeData = fFindDataById(id);// id 对应的数据
                if(bChk !== false){// 未设为 false，则选中
                    el.find('.equally[data-id="' + id + '"]').addClass('chk');
                    nodeData['__chk'] = true;
                }else{// 只在设为 false 时取消选中
                    el.find('.equally[data-id="' + id + '"]').removeClass('chk');
                    delete nodeData['__chk'];// 已有节点，需更新可见属性
                }
            }
            return nodeData;
        };
        // 显示节点，若 bAddData=true，不包含 nodeData 将自动添加
        var addNode = function(nodeData, bAddData){
            var id = nodeData[sIdField];
            if(fFindIdxById(id) != -1){
                el.find('.equally[data-id="' + id + '"]').removeClass('hidden');
                delete fFindDataById(id)['__hidden'];// 已有节点，需更新可见属性
            }
            else if(bAddData){
                nodeData = $.extend({}, nodeData);
                delete nodeData['__hidden'];
                aData.push(nodeData);
                el.find('.equally-box').append(fGetNodeStr(nodeData));
            }
        };
        var delNode = function(id, bDelData){// 隐藏节点
            var nodeData = fFindDataById(id);
            if(nodeData){
                if(bDelData){
                    el.find('.equally[data-id="' + id + '"]').remove();
                    aData.splice(fFindIdxById(id), 1);
                }
                else{
                    el.find('.equally[data-id="' + id + '"]').addClass('hidden');
                    nodeData['__hidden'] = true;// 已有节点，需更新可见属性
                }
            }
            return nodeData;
        };
        var initDom = function(){
            el.addClass('box0')
              .off('click.select')
              .off('click.more')
              .on('click.select', '.equally', fOnSelect);
            var str = '<div class="box0-main"><ul class="equally-box"></ul></div>';
            if(opts.showToggleEl){// 是否显示切换按钮
                str += '<div class="box0-more"><a class="t_orange" href="javascript:void(0)">展开更多&gt;&gt;</a></div>' +
                    '<div class="box0-less"><a class="t_orange" href="javascript:void(0)">收起&lt;&lt;</a></div>';
                el.on('click.more', '.box0-more>a,.box0-less>a', fOnMore);
            }
            el.html(str);
        };
        var init = function(){
            aData = [];
            initDom();
            if(jqFilter){//如果过滤条件存在
                oFilter = opts.filterEl.initFilter({
                    fields: opts.filter.fields,
                    pySupport: false,
                    afterFilter: fDrawNodesFilter
                });
            }
            resetData({
                url: opts.url,
                args: opts.args
            });
        };
        api = {
            getData: getData,
            resetData: resetData,
            findIdxById: fFindIdxById,
            findDataById: fFindDataById,
            chkNode: chkNode,// id,bDelData{bool} - 是否删除存在的节点
            delNode: delNode,// id,bDelData{bool} - 是否删除存在的节点
            addNode: addNode// data,bAddData{bool} - 是否添加不存在的节点
        };
        init();
        return api;
    };

    /**
     * 在 el 中添加搜索条
     * @param el
     * @param opts
     * @returns {{}|*}
     */
    _WI.initQueryBar=function(el,opts){
        var oApi,jqTxt,sVal;
        opts= $.extend({
            width:'',// 支持 ..px,..% 等，需带单位
            placeholder:'请输入搜索条件',
            showReset: false,// 是否显示重置按钮
            onSubmit: $.noop,// 搜索按钮点击事件 function(keyword)
            onReset: $.noop// 重置按钮点击事件
        },opts);
        var fGetDomStr=function(){
            return '<input type="text" class="txt querybar-txt" placeholder="'+opts.placeholder+'"/>' +
                '<button class="btn querybar-search" data-type="submit" title="搜索"></button>' +
                '<button class="btn querybar-reset" data-type="reset"></button>';
        };
        var fGetVal=function(){
            return sVal;
        };
        var fSetVal=function(val){
            sVal=val;
            jqTxt.val(sVal);
        };
        //var fClear=function(){// TODO 是否需要提供可触发回调的接口
        //    jqTxt.val('');
        //};
        var fBtnClick=function(){
            var jqCur=$(this);
            switch(jqCur.attr('data-type')){
                case 'submit':
                    sVal=jqTxt.val().trim();
                    opts.onSubmit(sVal);// 搜索
                    break;
                case 'reset':
                    sVal='';
                    jqTxt.val(sVal);
                    opts.onReset();
                    break;
            }
        };
        var fInit=function(){
            el.addClass('querybar')
              .html(fGetDomStr());
            if(opts.showReset){
                el.addClass('hasreset');
            }
            jqTxt=el.find('.txt');
            if(opts.width){
                el.css('width',opts.width);
            }
            el.off('click.querybar')
              .on('click.querybar','.btn',fBtnClick);
            jqTxt.setKeyEnter({// 文本框中回车，默认执行搜索
                callback:function(){
                    sVal=jqTxt.val().trim();
                    opts.onSubmit(sVal);// 搜索
                }
            });// 指定回车触发搜索点击
        };
        oApi={
            fGetVal:fGetVal,
            fSetVal:fSetVal
            //fClear:fClear
        };
        fInit();
        return oApi;
    };
    /**
     * 初始化部门选择组件
     * @param el
     * @param opts
     * @return {object}
     */
    _WI.initDept = function(el,opts){
        opts =$.extend({
            //nosortData:[],  // 按政府序列
            //sortData:[], // 按字母
            //zoneData:[],// 区划数据,未定义时,不根据区划过滤
            idField:'idorg',// 部门id
            txtField:'orgshortname',// 部门名称
            initialField:'org',// 首字母字段，若传入 ''，则直接根据部门名称过滤
            zoneField:'idareaCode',// 行政区划字段
            zoneIdField:'code',// zoneData 数据中与 zoneField 的值对应
            zoneTxtField:'name',// zoneData 数据中的显示字段
            isHighLight:false,// 是否显示高亮,默认不显示
            miniMode:false,// 是否启用极简模式
            onDepCb: $.noop// 部门点击后的回调方法
        },opts);
        var nosortData, sortData, zoneData,// 未排序数据（政府）、排序数据、区划数据
            jqsTabhead,  //字母政府序列菜单dom对象
            api;
        var group=[
            {val:'0',txt:'A-G'},
            {val:'1',txt:'H-N'},
            {val:'2',txt:'O-T'},
            {val:'3',txt:'U-Z'}
        ];
        //绘制每条数据dom节点
        var fDrawData=function(){
            var initialField=opts.initialField,
                idField=opts.idField,
                txtField=opts.txtField,
                zoneField=opts.zoneField;// 数据中表示区划的字段
            var zoneIdField=opts.zoneIdField,
                zoneTxtField=opts.zoneTxtField;
            var jqZone=el.find('.dept-zone');
            var getDepStr = function(item,i){
                // data-inital 便于快速过滤，data-zone 用于区划过滤
                return '<li class="dept-item" data-idx="'+i+'" data-inital="'+item[initialField]+'" data-depid="'+item[idField]+'" data-zone="'+(item[zoneField]||'')+'">' +
                    '<span>'+item[txtField]+'</span>' +
                    '</li>';
            };
            var fDrawAllDep = function(_data){
                var str = '';
                for(var i=0,item;i<_data.length;i++){
                    item = _data[i];
                    str += getDepStr(item,i);
                }
                return str;
            };
            var fSortDep = function(){
                var str1='',str2='',str3='',str4='';
                var initial;
                var fChargeChar=function(char){
                    if(char>='A' && char<='Z'){
                        if(char<'H'){
                            str1+=getDepStr(item,i);
                        }else if(char<'O'){
                            str2+=getDepStr(item,i);
                        }else if(char<'U'){
                            str3+=getDepStr(item,i);
                        }else{
                            str4+=getDepStr(item,i);
                        }
                    }
                };
                for(var i= 0,item,len=sortData.length;i<len;i++){
                    item=sortData[i];
                    if(initialField===''){// 根据名称排序
                        initial = $.makePyArr(item[txtField]);
                    }else{
                        initial = item[initialField].toUpperCase();
                    }
                    if(typeof initial=='string'){
                        fChargeChar(initial.charAt(0));
                    }else{
                        for(var j= 0,jlen=initial.length;j<jlen;j++){
                            fChargeChar(initial[j].charAt(0));
                        }
                    }
                }
                el.find('[data-sort-rang="0"] .dept-ul').html(str1);
                el.find('[data-sort-rang="1"] .dept-ul').html(str2);
                el.find('[data-sort-rang="2"] .dept-ul').html(str3);
                el.find('[data-sort-rang="3"] .dept-ul').html(str4);
            };
            var fGetZonesStr = function(){
                var str='';
                for(var i= 0,cur,len=zoneData.length;i<len;i++){
                    cur=zoneData[i];
                    str+='<li class="dept-zone-li chkico" data-i="'+i+'">'+cur[zoneTxtField]+'</li>';
                }
                return str;
            };
            el.find('[data-type="szmall"]').html(fDrawAllDep(sortData));//拼音首字母快速查找数据绘制，sortData
            el.find('.dept-tag').eq(0).trigger('mouseenter.py');// 拼音首字母快速查找中选中'A'
            if(!opts.miniMode){
                el.find('[data-type="zfxlall"]').html(fDrawAllDep(nosortData));//按政府序列数据绘制，nosortData
                fSortDep();// 拼音分组数据绘制
                jqsTabhead.eq(0).click();// 拼音、政府 tab 页选中第一个
            }
            // 区划选择 - TODO 是否需要判断 zoneData，undefined 时不通过区划过滤
            if(zoneData && zoneData.length){
                jqZone.addClass('active');
                jqZone.html(fGetZonesStr());
                el.find('.dept-zone-li').eq(0).trigger('click');
            }else{
                jqZone.removeClass('active');
                jqZone.html('');
                el.find('.dept-item').addClass('dept-inzone');
            }
        };
        //字母和按政府序列菜单的点击事件
        var fZmZfxlClick = function(){
            var jqCur = $(this),
                type = jqCur.attr('data-type');
            jqsTabhead.removeClass('active');
            jqCur.addClass('active');
            el.find('.dept-tabcont').removeClass('active');
            el.find('[data-val="'+type+'"]').addClass('active');
        };
        //拼音首字母查找点击事件
        var fPySearClick = function(){
            var jqCur = $(this),
                sType = jqCur.attr('data-value');
            jqCur.addClass('active')
                 .siblings().removeClass('active');
            el.find('.dept-quick-res .dept-item')
              .removeClass('show')
              .each(function(idx,dom){
                  var jqCur = $(this);
                  var sFirInitalZm = jqCur.attr('data-inital').charAt(0); //得到首字母的第一个字母
                  if(sFirInitalZm == sType){
                      jqCur.addClass('show');
                  }
              });
        };
        var fDeptClick = function(){
            var jqCur = $(this),
                sId = jqCur.attr('data-depid'), //当前不同数据源对应的同一个标识id
                sClosestUlType = jqCur.closest('.dept-ul').attr('data-val'),
                idx = parseInt(jqCur.attr('data-idx'));
            if(opts.isHighLight){
                el.find('.dept-item').removeClass('active');  //清空所有委办局的选中状态
                el.find('[data-depid="'+sId+'"]').addClass('active'); //让div所有等于这个数据的委办局都是选中状态  //todo
            }
            sClosestUlType ? opts.onDepCb(nosortData[idx]):opts.onDepCb(sortData[idx]); //判断是从拍序数组中取数据还是非拍序数组张取数据
        };
        //区划点击事件
        var fZoneClick = function(){
            var jqThis=$(this),
                idx=parseInt(jqThis.attr('data-i')),
                oData=zoneData[idx],
                zoneId=oData[opts.zoneIdField];
            el.find('.dept-zone-li').removeClass('active');
            jqThis.addClass('active');
            // TODO 只显示匹配的部门
            el.find('.dept-item').removeClass('dept-inzone')
              .filter('[data-zone="'+zoneId+'"]').addClass('dept-inzone');// 显示当前区划下的部门
        };
        // 绘制基础 DOM
        var fGetDomStr=function(){
            //拼音首字母查找dom
            var fDrawAZNavs = function(){
                var str ='<div class="dept-quick">' +
                    '<div class="dept-tags">' +
                    '<div class="dept-tags-t"><span class="dept-focal">拼音</span>首字母查找&nbsp;:</div>';
                str+='<div class="dept-tags-c">';
                for(var i=0,idx;i<26;i++){
                    idx = String.fromCharCode(65+i);
                    str += '<span class="dept-tag" data-value="'+idx+'">'+idx+'</span>';//输出A-Z  26个大写字母
                }
                str +='</div>';
                str+='</div>' +
                    '<div class="dept-quick-res"><ul class="dept-ul" data-type="szmall"></ul></div>' +
                    '</div>';
                return str;
            };
            <!--按字母，按政府序列-->
            var fDrawZMNavs=function(){
                var str = '<div class="dept-main">' +
                    '<div class="dept-tabhead-box">' +
                    '<div class="dept-tabhead" data-type="zm">按字母</div>' +
                    '<div class="dept-tabhead" data-type="zfxl">按政府序列</div>' +
                    '</div>';
                // 按字母
                str +='<div class="dept-tabcont" data-val="zm">';
                for(var i= 0,item,len=group.length;i<len;i++){
                    item=group[i];
                    var zm = item['txt'].split('-');
                    str += '<div class="dept-panel" data-sort-rang="'+i+'">' +
                        '<div class="dept-panel-t"><span class="dept-focal">'+zm[0]+'</span>---<span class="dept-focal">'+zm[1]+'</span></div>' +
                        '<div class="dept-panel-c"><ul class="dept-ul"></ul></div>' +
                        '</div>';
                }
                str +='</div>';
                // 按政府序列
                str +='<div class="dept-tabcont" data-val="zfxl">' +
                    '<div class="dept-panel">' +
                    '<div class="dept-panel-t">' +
                        //'<span class="dept-focal">全部</span>' +
                    '</div>' +
                    '<div class="dept-panel-c"><ul class="dept-ul" data-type="zfxlall"  data-val="nosort"></ul></div>' +
                    '</div>' +
                    '</div>';
                str +='</div>';
                return str;
            };
            var fDrawZone=function(){
                return '<ul class="dept-zone chkico-ul"></ul>';
            };
            var str=fDrawZone()+fDrawAZNavs();
            if(!opts.miniMode){
                str+=fDrawZMNavs()
            }
            return str;
        };
        var fReset = function(newOpts){
            if(newOpts){
                $.extend(opts,newOpts);
            }
            nosortData = opts.nosortData;
            sortData = opts.sortData;
            zoneData = opts.zoneData;
            if(!nosortData){
                return;
            }
            if(!sortData){
                sortData = nosortData;// 若未传入排序数据，则设为与未排序数据
            }
            fDrawData();
        };
        var fInit = function(){
            el.addClass('dept-box')
              .html(fGetDomStr()); //初始化div
            jqsTabhead = el.find('.dept-tabhead');
            fReset();
            el.off('click.zmzfxl')
              .off('mouseenter.py')
              .off('click.wbj')
              .off('click.zone');
            el.on('mouseenter.py','.dept-tag',fPySearClick); //拼音首字母查找点击事件
            el.on('click.wbj','.dept-item',fDeptClick);  //部门的点击事件
            el.on('click.zone','.dept-zone-li',fZoneClick);  //区划的点击事件
            if(!opts.miniMode){
                el.on('click.zmzfxl','.dept-tabhead',fZmZfxlClick);//字母和按政府序列菜单的点击事件
            }
        };
        fInit();
        api = {
            reset:fReset
        };
        return api;
    };
    /**
     * 将 el 初始化为部门选择组件
     * @param el
     * @param opts
     * @returns {{}|*}
     */
    _WI.initDepBar=function(el,opts){
        var oApi,oSelected,
            oDepApi,oDpApi;
        opts= $.extend({
            onChange: $.noop,// 修改部门后的回调方法
            idField:'idorg',// 部门id
            txtField:'orgshortname'// 部门名称
            //initialField:'org',// 首字母字段，若传入 ''，则直接根据部门名称过滤
            //zoneField:'idareaCode',// 行政区划字段
            //zoneIdField:'code',// zoneData 数据中与 zoneField 的值对应
            //zoneTxtField:'name',// zoneData 数据中的显示字段
        },opts);
        // 弹出的部门选择回调
        var fDepCb = function(data){
            fSetData(data);
            oDpApi.close();  //关闭部门弹框
        };
        // 组件点击事件，显示下拉框
        var fClick=function(){
            if(oDpApi){
                oDpApi.show();
            }
        };
        var fGetData=function(){
            return oSelected;
        };
        var fSetData=function(data,noCb){// 若 noCb==true 不触发回调
            var idField=opts.idField,
                txtField=opts.txtField,
                newData;
            if(data===true){// 初始化，根据 dom 赋值
                newData={};
                newData[idField]=el.attr('data-val');
                newData[txtField]=el.html().trim();
                oSelected=newData;
            }else{
                newData=$.extend({},data);
                if(!newData[idField]){
                    newData[idField]='';
                }
                if(!newData[txtField]){
                    newData[txtField]='';
                }
                if(!oSelected || newData[idField]!=oSelected[idField]){
                    oSelected=newData;
                    el.attr('data-val',oSelected[idField]);
                    el.html(oSelected[txtField].trim());
                    if(noCb!==true){
                        opts.onChange(oSelected);
                    }
                }
            }
        };
        var fInitDp=function(){
            // 以下新增
            var jqDrop = $('<div class="dp-dept"></div>');
            //初始化部门
            oDepApi = _WI.initDept(jqDrop,{
                onDepCb:fDepCb,
                idField:opts.idField,
                txtField:opts.txtField,
                initialField:opts.initialField,
                zoneField:opts.zoneField,
                zoneIdField:opts.zoneIdField,
                zoneTxtField:opts.zoneTxtField
            });
            //初始化下拉弹出框
            oDpApi = el.dropdown({
                cont:jqDrop,// 弹出层的jQuery对象
                modal:false,//是否为模态遮罩层，默认为 true
                show:false
            });
            el.on('click.depchoose',fClick);
        };
        var fReset=function(cusOpts){
            if(cusOpts){
                $.extend(opts,cusOpts);
                if(oDepApi && (cusOpts.nosortData||cusOpts.sortData)){
                    oDepApi.reset({
                        nosortData:opts.nosortData,// 必须（全部数据集合）
                        sortData:opts.sortData, // 可选（按字母排序的数据集合，若未定义，则默认与 nosortData 相同）
                        zoneData:opts.zoneData // 区划数据字段
                    });
                }
            }
        };
        var fInit=function(){
            el.addClass('depbar')
              .off('click.depchoose');
            if(!el.hasClass('disabled')){
                fInitDp();// 需要初始化部门下拉框
            }
            fReset();
            fSetData(true);
        };
        oApi={
            fReset:fReset,
            fGetData:fGetData,
            fSetData:fSetData
        };
        fInit();
        return oApi;
    };

    /**
     * 在当前元素中添加导航栏，并当前元素中的内容块与导航关联
     * @param {object} el
     * @param {object} options
     *  - initVal {string} 初始化时默认滚入视图的内容 val，若未定义则滚动到第一个。设为 -1 则不滚动内容。
     *  - navsData {array} 导航数组，每一项为对象{val:键string, txt:文本string}。
     *  - visibleVal {string|array} 可见项的 val {string}，支持数组。
     *  - sectionClass {string} 内容部分每块对应的 class，默认为："section"。
     *  - navClass {string} 导航中每块对应的 class，默认为："scrollNav"。
     *  - navBox {string} 当前元素中，导航栏的容器对应的 selector，不定义则认为是 $(this)
     *  - sectionBox {string} 当前元素中，决定内容块可见区域的容器对应的 selector，不定义则认为是 $(this)
     *  - scrollOffset {number} 每个内容块滚动进入视图的偏移（单位 px），默认为：20，即当某内容块上方 20px 到达 el 顶部就认为它是当前项。
     *  - animationSpeed {number} 点击导航触发内容滚动的动画时长（单位 ms），默认为：500。
     *  - navRender {function(nav)} 导航中每项的渲染函数。
     *    - nav {object} 当前渲染项对应 opts.navsData 中的数据对象
     *  - navIsHor {bool} 是否是水平方向的导航条，默认为 false。
     *  - animationBefore {function(nav)} 导航引起滚动前执行的回调。
     *    - nav {object} 当前渲染项对应 opts.navsData 中的数据对象
     *  - animationComplete {function(nav)} 导航引起的滚动执行后执行的回调。
     *    - nav {object} 当前渲染项对应 opts.navsData 中的数据对象
     *  - onChange {function(oldV,newV)} 导航栏状态发生变化时执行的回调。
     *    - oldV {object} 变换前的选中项 navData
     *    - newV {object} 变换后的选中项 navData
     * @returns {object} 初始化后生成的对象。
     *  - opts {object} 组件的配置属性
     *  - getCurInedx() 当前项索引，-1 为在第一块内容之前，senction.length 为在最后一块内容之后
     *  - next() {function} 滚动至下一个内容块
     *  - prev() {function} 滚动至上一个内容块
     *  - goto(i) {function} 滚动至索引为 i 的内容块
     *
     *  <el navBox class="pageScrollPrev pageScrollNext"> 上方有导航项:pageScrollPrev; 下方有导航项:pageScrollNext
     *    自动生成的导航结构及样式说明
     *    <div class="pageScroll-prev"></div>
     *    <ul class="pageScroll">
     *      <li class="scrollNav scrollNav_1 data-pscroll= active" 0"="">导航1</li>
     *      <li class="scrollNav scrollNav_2 data-pscroll=" 1"="">导航2</li>
     *      ...
     *    </ul>
     *    <div class="pageScroll-next"></div>
     *  </el>
     */
    _WI.pageScroller=function(el,options) {
        var oApi;
        var opts = $.extend({
            //initVal: 0,
            navsData: [],
            visibleVal:[],
            sectionClass: "sear-section",
            navClass: "sear-item",
            sectionBox: '',
            navBox: '',
            navIsHor: false,
            scrollOffset: 10,// 滚动偏移？？？为什么不能设为5
            animationSpeed: 500,
            navRender: $.noop,
            animationBefore: $.noop,
            animationComplete: $.noop,
            onChange: $.noop
        }, options);
        var navsData,
            bIsDom;// 是否是window，html,document，body的节点
        var jqNavBox,jqNav,jqsNavitem,// 导航容器元素、导航主体元素，导航项元素集合
            jqSectionBox,jqsSection,// 内容容器元素、内容项元素
            sCur;// 当前激活项的 val
        /**
         * 滚动监听，根据 section 的状态修改导航栏状态
         */
        var fOnSectionboxScroll = function () {
            if (jqSectionBox.is(":animated")) return;// 正在执行动画效果
            var offset = jqSectionBox.find(jqsSection.eq(0).offsetParent()).length ? // 滚动容器中找到内容块的定位元素，则两者不为同一元素
                -jqSectionBox.scrollTop(): 0;
            var jqViewSection=jqsSection.filter(':not(.hidden)');
            var val;
            for(var i= 0,cur,curTop,nextTop,len=jqViewSection.length;i<len;i++){
                cur = jqViewSection.eq(i);
                curTop = nextTop || cur.position().top-opts.scrollOffset;// 当前内容项距离顶部的位置
                if(i==0 && curTop + offset > 0){// 未移入第一项
                    i=-1;
                    break;
                }
                if(i==len-1){// 已经遍历到最后一项
                    nextTop = curTop + cur.height();// 当前内容项距离顶部的位置 + 高度
                }else{
                    nextTop = jqViewSection.eq(i+1).position().top-opts.scrollOffset;// 下个内容项距离顶部的位置
                }
                if(curTop+offset <= 0 && nextTop+offset > 0){
                    break;
                }
            }
            val=jqViewSection.eq(i).attr('data-val');
            _updateLink(val);// 更新导航
        };
        var fIndexofNavs=function(val){
            for(var i= 0,cur,len=navsData.length;i<len;i++){
                cur=navsData[i];
                if(cur['val']==val){
                    return i;
                }
            }
            return -1;
        };
        /**
         * 切换到指定内容块
         * @param val {string} 内容项的 val
         */
        var fGoto=function(val){
            var jqCurSec,curI;
            if(typeof val=='undefined'){
                val=navsData[0]['val'];
                curI=0;
            }else{
                curI=fIndexofNavs(val);
            }
            jqCurSec=jqsSection.filter('[data-val="'+val+'"]');
            if(val==sCur || jqCurSec.length==0){// 未发生变化或无对应内容
                return;
            }
            var top = jqCurSec.position().top - opts.scrollOffset,
                offset = jqSectionBox.find(jqCurSec.offsetParent()).length ? // 滚动容器中找到内容块的定位元素，则两者不为同一元素
                    0: jqSectionBox.scrollTop();
            if(top + offset != 0 && !jqSectionBox.is(":animated")){
                if(bIsDom){//如果是根节点，直接改变位置
                    jqSectionBox.scrollTop( top + offset);
                    _updateLink(val);
                    opts.animationComplete(navsData[curI]);
                }else{
                    jqSectionBox.animate({scrollTop: top + offset}, opts.animationSpeed, function(){
                        _updateLink(val);
                        opts.animationComplete(navsData[curI]);
                    });
                }
            }
        };
        var fNext=function(){
            var jqCur=jqsNavitem.filter('[data-val="'+sCur+'"]'),
                jqNext=jqCur.nextAll(':not(.hidden)');
            if(jqNext.length){
                fGoto(jqNext.eq(0).attr('data-val'));
            }
        };
        var fPrev=function(){
            var jqCur=jqsNavitem.filter('[data-val="'+sCur+'"]'),
                jqPrev=jqCur.prevAll(':not(.hidden)');
            if(jqPrev.length){
                fGoto(jqPrev.eq(0).attr('data-val'));
            }
        };
        /**
         * 修改导航栏状态
         * @param val {string} 内容项的 val
         */
        var _updateLink = function (val) {
            var oldVal=sCur;// 原始值
            if(sCur == val) return;// 未发生变化
            sCur = val;
            jqsNavitem.removeClass("active");
            var jqCur=jqsNavitem.filter('[data-val="'+sCur+'"]');
            if(jqCur.length){
                jqCur.addClass("active");
                // 判断需要滚动以使当前项进入视图
                _chargeNavScroll(val,'_updateLink');
            }
            opts.onChange(navsData[fIndexofNavs(oldVal)],navsData[fIndexofNavs(val)]);
        };
        // 判断是否需要滚动以使指定导航进入视图
        var _chargeNavScroll=function(val,fromFn){
            var p=opts.navIsHor?
                ['left','right','scrollLeft']:// 水平方向
                ['top','bottom','scrollTop'];
            var navBCR=jqsNavitem.filter('[data-val="'+val+'"]')[0].getBoundingClientRect()
                ,ulBCR=jqNav[0].getBoundingClientRect()
                ,oldTop=jqNav[p[2]]()
                ,diff=0;
            if(ulBCR[p[0]]>navBCR[p[0]]){// 当前项在上方
                diff=ulBCR[p[0]]-navBCR[p[0]];
                jqNav[p[2]](oldTop-diff);
            }else if(ulBCR[p[1]]<navBCR[p[1]]){// 当前项在下方
                diff=ulBCR[p[1]]-navBCR[p[1]];
                jqNav[p[2]](oldTop-diff);
            }
            if(fromFn=='_updateLink') fOnNavboxScroll(val);
        };
        /**
         * @param {string|Array} aVal 使指定项显示，支持数组 TODO 设置滚动项
         * @param {boolean} hideElse 是否需要隐藏其他
         */
        var fShowNavs=function(aVal,hideElse){
            var curData,curVal,
                sNew=sCur;// 新选中项 val
            if(typeof aVal=='string'){
                aVal=[aVal];
            }
            if(hideElse){
                jqsNavitem.addClass('hidden');
                jqsSection.addClass('hidden');
                // 隐藏其他时，原有的选中项被隐藏
                if(aVal.indexOf(sCur)==-1){
                    sNew=undefined;
                }
            }
            for(var i= 0,len=aVal.length;i<len;i++){
                curData=navsData[fIndexofNavs(aVal[i])];
                curVal=curData['val'];
                jqsNavitem.filter('[data-val="'+curVal+'"]').removeClass('hidden');
                jqsSection.filter('[data-val="'+curVal+'"]').removeClass('hidden');
            }
            if(typeof sNew=='undefined'){
                sNew=jqsNavitem.filter(':not(.hidden)').eq(0).attr('data-val');
            }
            sCur=undefined;// fShowNavs 可能引起内容区域变化，需重设滚动状态，避免 fGoto 中跳出，故设为 undefined
            setTimeout(function(){
                fGoto(sNew);
            }, 200);
        };
        /**
         * @param {string|Array} aVal 使指定项隐藏，支持数组 TODO 设置滚动项
         */
        var fhideNavs=function(aVal){
            var curData,curVal,
                sNew=sCur;// 新选中项 val
            if(typeof aVal=='string'){
                aVal=[aVal];
            }
            // 选中项被隐藏
            if(aVal.indexOf(sCur)>-1){
                sNew=undefined;
            }
            for(var i= 0,len=aVal.length;i<len;i++){
                curData=navsData[fIndexofNavs(aVal[i])];
                curVal=curData['val'];
                jqsNavitem.filter('[data-val="'+curVal+'"]').addClass('hidden');
                jqsSection.filter('[data-val="'+curVal+'"]').addClass('hidden');
            }
            if(typeof sNew=='undefined'){
                sNew=jqsNavitem.filter(':not(.hidden)').eq(0).attr('data-val');
            }
            sCur=undefined;// fShowNavs 可能引起内容区域变化，需重设滚动状态，避免 fGoto 中跳出，故设为 undefined
            setTimeout(function(){
                fGoto(sNew);
            }, 200);
        };
        /**
         * 导航部分滚动监听
         */
        var fOnNavboxScroll=function(val){
            if(opts.navIsHor){// 暂未处理横向导航
                return;
            }
            var newTop=jqNav.scrollTop();
            // 上方有内容，需显示向上箭头
            if(newTop>0){
                jqNavBox.addClass('pageScrollPrev');
            }else{
                jqNavBox.removeClass('pageScrollPrev');
            }
            // 下方有内容，需显示向下箭头
            if(newTop+jqNav.height()<jqNav[0].scrollHeight){
                jqNavBox.addClass('pageScrollNext');
            }else{
                jqNavBox.removeClass('pageScrollNext');
            }
            if(opts.navClass){//如果导航栏有自己的外层盒子
                var jqNavs = el.find("." + opts.navClass);
                var nNavWidth = jqNavs.length * jqNavs.eq(0).outerWidth(); //导航栏内容的实际宽度
                jqNav.width(nNavWidth);   //给导航栏的ul设置宽
            }
            if(typeof val=='string'){
                _chargeNavScroll(val);
            }
        };
        // 导航项点击事件
        var fOnNavClick=function(ev){
            if (jqSectionBox.is(":animated")) return;// 正在执行动画效果
            var jqCur=$(this),
                sNewVal=jqCur.attr('data-val');
            ev.preventDefault();
            opts.animationBefore(navsData[fIndexofNavs(sNewVal)]);
            fGoto(sNewVal);
        };
        // 导航栏的前进和后退
        var fOnCtrlClick=function(){
            var oldTop=jqNav.scrollTop();
            jqNav.scrollTop($(this).hasClass('pageScroll-prev') ?
            oldTop-100 : oldTop+100);
        };
        var fGetNavBoxStr=function(){
            var str='<div class="pageScroll-prev"></div>' +
                '<ul class="pageScroll">',
                sCls=opts.navClass;
            var curData,curTxt;
            for(var i= 0,len=navsData.length;i<len;i++){
                curData=navsData[i];
                curTxt=opts.navRender(curData)||curData['txt'];// 内容块导航项内容
                str += '<li class="'+sCls+'" data-val="'+curData['val']+'">'+ curTxt +'</li>';
            }
            str+='</ul>' +
                '<div class="pageScroll-next"></div>';
            return str;
        };
        var fInit=function(){
            navsData=opts.navsData;
            //判断是否window,html,body,document对象，成立就直接将调用对象转为window
            if(el.is($(window))||el.is('html,body')||el.is(document)){
                el=$(document);
                bIsDom = true;//isDom设置为true代表是window对象
            }else{// 如果不是dom节点
                el.addClass('pageScroller');
            }
            jqsSection=$("." + opts.sectionClass, el);
            jqSectionBox = opts.sectionBox ? el.find(opts.sectionBox) : [];
            jqNavBox = opts.navBox ? el.find(opts.navBox) : [];
            jqSectionBox.length<=0 && (jqSectionBox=el);
            jqNavBox.length<=0 && (jqNavBox=el);
            if(!bIsDom){
                jqSectionBox.css('position')=='static' && jqSectionBox.css('position','relative');// 内容块中可能不存在定位元素
            }
            jqNavBox.html(fGetNavBoxStr());// 填充 navbox 元素
            jqNav=jqNavBox.find('.pageScroll');
            jqsNavitem = jqNav.children();
            jqsSection.addClass('sear-section hidden');// 先隐藏所有内容块，之后根据 navData 显示
            jqsNavitem.addClass('sear-nav hidden');

            if(jqsNavitem.length!==jqsSection.length){
                console.error('导航与内容块数量不匹配');
                return;
            }
            fShowNavs(opts.visibleVal);
            /* 导航点击事件 */
            jqNavBox.off('click.psNav')
                    .on('click.psNav','.pageScroll .'+opts.navClass,fOnNavClick);
            jqSectionBox.off('scroll.ps')
                        .on('scroll.ps',fOnSectionboxScroll);
            jqNav.off('scroll.ps')
                 .on('scroll.ps',fOnNavboxScroll); //导航部分滚动监听
            jqNavBox.off('click.ps')
                    .on('click.ps','.pageScroll-prev,.pageScroll-next',fOnCtrlClick);
            $(window).off('resize.ps').on('resize.ps',fOnNavboxScroll);
            // 初始化根据 opts.initVal 滚动内容
            setTimeout(function(){
                fGoto(opts.initVal);
            }, 200);
        };
        oApi={
            options:opts,
            fNext:fNext,
            fPrev:fPrev,
            fGoto:fGoto,
            fShowNavs:fShowNavs,
            fhideNavs:fhideNavs
        };
        fInit();
        /** ================ 返回接口 ================ **/
        return oApi;
    };

    /**
     * @widoc $.fn.fSimpleEdit
     * @namespace comp
     * @des 修改添加信息
     * @type function
     * @param {object} el
     * @param {object} opts
     * @param {string=} opts.showField 页面展示字段名，默认为 'name'
     * @param {string=} opts.addInfo 新增按钮文字，默认为 '新增'
     * @param {object} opts.initData 新增时的默认值
     * @param {object=} opts.oInitVali 编辑容器验证规则
     * @param {function=} opts.fBtnsRender 数据项自定义按钮，必须包含 .simpedit-btn (回调将返回其 data-type，其中修改为 update，删除 del)
     * @param {function=} opts.fEditRender 需要修改/添加的输入框
     * @param {function=} opts.fBtnsCallback: function(sType,oCur,jqItem) 数据项中按钮的回调，除 update,del
     * return {object}
     *        obj.fGetData()  返回全部数据
     *        obj.fSetData(aData,showAdd)  重设列表数据 aData, showAdd=true 时展开新增编辑容器
     *        obj.fCancelEditing()  取消所有编辑状态
     */
    _WI.initSimpEdit=function(el,opts){
        var api;
        opts= $.extend({
            contiAdd: true,// 是否支持连续新增（新增数据保存后，是否继续显示新增编辑容器）
            //onSave: function(oData,cb) oData 为要保存的数据; cb(oNewData) 将 oNewData 应用到组件（dom显示和组件数据）
            //onDel: function(oData,cb) oData 为要删除的数据; cb() 将应用到组件（dom显示和组件数据）
            //data:[],// 数据
            showField:'name',// 默认显示字段
            addInfo:'新增',
            //initData:{},// 默认值
            //oInitVali:{},// 验证规则
            fBtnsRender: $.noop,
            fEditRender: $.noop,
            fBtnsCallback: $.noop// function(sType,oCur,jqItem) 数据项中按钮的回调，除 update,del
        },opts);
        var aData,// 数据
            jqList,// .simpedit-list
            jqAddItem;// 新增项（包含"新增"按钮和编辑容器）
        var fInit=function(){
            var str='';
            str+='<div class="simpedit-list"></div>' +
                '<div class="simpedit-add">'+
                '<div class="simpedit-view"><span class="simpedit-addbtn">添加角色</span></div>'+
                '</div>';
            el.addClass('simpedit')
              .html(str);
            jqList=el.find('.simpedit-list');
            jqAddItem=el.find('.simpedit-add');
            fSetData(opts.data);
            el.off('click.btn')
              .on('click.btn','.simpedit-btn',fItemBtnsClick)// 普通数据的 修改/刪除
              .off('click.addbtn')
              .on('click.addbtn','.simpedit-addbtn',fShowAdd)// "新增"事件
              .off('click.edit')
              .on('click.edit','.simpedit-item .simpedit-tool',fEditTool)// 普通编辑容器的 保存/取消
              .off('click.addedit')
              .on('click.addedit','.simpedit-add .simpedit-tool',fAddEditTool);// "新增"编辑容器的 保存/取消
        };
        // 设置数据
        var fSetData=function(aNewData,showAdd){
            var str='';
            aData=aNewData;
            if(aNewData){
                for(var i= 0;i<aData.length;i++){
                    str+=fGetItemStr(aData[i]);
                }
            }
            jqList.html(str);
            fCancelEditing();
            if(showAdd){
                fShowAdd();
            }
        };
        // 取消所有编辑状态
        var fCancelEditing=function(){
            el.find('.editing').removeClass('editing')
        };
        // 获取数据
        var fGetData=function(){
            return aData;
        };
        // 获取 item 对应的 dom 字符串
        var fGetItemStr=function(item){
            return '<div class="simpedit-item"><div class="simpedit-view">' +
                '<div class="simpedit-btns btns-ctrl">' + opts.fBtnsRender(item) + '</div>' +
                '<div class="simpedit-tit">' + $.encodeHtml(item[opts.showField]) + '</div>' +
                '</div></div>';
        };
        // 获取编辑容器绘制字符串
        var fGetEditStr=function(){
            return '<div class="simpedit-edit">' +
                '<div class="simpedit-editbox">' +opts.fEditRender()+ '</div>' +
                '<div class="simpedit-tools btns-ctrl">' +
                '<input class="simpedit-tool btn btn-min btn-primary" data-type="save" type="button" value="保存"/>' +
                '<input class="simpedit-tool btn btn-min btn-default" data-type="cancel" type="button" value="取消"/>' +
                '</div>' +
                '</div>';
        };
        // 显示 jqItem 下的编辑容器，显示时根据 oData 赋值
        var fShowEidt=function(jqItem,oData){
            var jqEdit=jqItem.find('.simpedit-edit'),
                oValiApi=jqItem.data('valiApi');// 数据项上的验证接口
            if(oValiApi){// 移除验证接口，避免上次编辑留下的验证状态错误显示
                oValiApi.removeAllRules();
                jqItem.removeData('valiApi');
            }
            if(!jqEdit.length){//没有修改框
                jqEdit=$(fGetEditStr());
                jqItem.append(jqEdit);
            }
            jqEdit.setFormData(oData);//给修改输入框赋值
            el.find('.editing').removeClass('editing');
            jqItem.addClass('editing');
            jqEdit.find('.txt').eq(0).focus();
        };
        // "新增"事件，显示新增编辑容器
        var fShowAdd=function(){
            fShowEidt(jqAddItem,opts.initData);
        };
        // 数据项 view 中按钮事件
        var fItemBtnsClick=function(){
            var jqThis=$(this);
            var jqItem=jqThis.closest('.simpedit-item'),//当前模块
                index=jqItem.index(),//当前模块索引
                oData=aData[index];
            var sType=jqThis.attr('data-type');
            var fAfterDel=function(){//删除
                aData.splice(index,1);
                jqItem.remove();
            };
            switch (sType){
                case 'update'://修改
                    fShowEidt(jqItem,oData);
                    break;
                case 'del':
                    $.showConfirm('确认删除吗？',function(){
                        if(opts.onDel){
                            opts.onDel(oData,fAfterDel);
                        }else{
                            fAfterDel();
                        }
                    });
                    break;
                default:// 其他操作调用用户回调
                    opts.fBtnsCallback(sType,oData,jqItem)
            }
        };
        // 编辑容器中，保存/取消
        var fEditTool=function(){
            var jqThis=$(this);
            var jqItem=jqThis.closest('.simpedit-item'),//当前模块
                index=jqItem.index(),//当前模块索引
                jqCon=jqItem.find('.simpedit-view'),//当前模块展示内容
                oData=aData[index];
            var fAfterSave=function(oNewItem){
                $.extend(oData,oNewItem);
                jqCon.find('.simpedit-tit').html(oData[opts.showField]);// 更新显示字段
                jqItem.removeClass('editing');
            };
            switch (jqThis.attr('data-type')){
                case 'save':
                    fSaveEdit(jqItem,oData,fAfterSave);
                    break;
                case 'cancel':
                    jqItem.removeClass('editing');
                    break;
            }
        };
        // 新增容器中，保存/取消
        var fAddEditTool=function(){
            var jqCur=$(this);
            var fAfterSave=function(oNewItem){
                aData.push(oNewItem);
                jqList.append(fGetItemStr(oNewItem));// 把添加的数据绘制到页面
                if(opts.contiAdd){// 支持连续新增
                    fShowEidt(jqAddItem,opts.initData);// 新增完成，默认继续新增
                }else{
                    jqAddItem.removeClass('editing');
                }
            };
            switch (jqCur.attr('data-type')){
                case 'save':
                    fSaveEdit(jqAddItem,undefined,fAfterSave);
                    break;
                case 'cancel':
                    jqAddItem.removeClass('editing');
                    break;
            }
        };
        // 验证通过后，将当前编辑容器中的数据，传给 fAfterSave(oNewItem)
        var fSaveEdit=function(jqItem,oOldData,fAfterSave){
            var jqEdit=jqItem.find('.simpedit-edit'),
                oNewData;
            if(opts.oInitVali){// 需要验证
                var oValiApi=jqItem.data('valiApi');
                if(!oValiApi){
                    oValiApi = jqEdit.initValidator($.pureClone(opts.oInitVali));// 将验证 api 存到元素上
                    jqItem.data('valiApi',oValiApi);
                }
                if(!oValiApi.validateAll()){
                    return;
                }
            }
            oNewData= $.extend({},oOldData,jqEdit.serializeObject());
            if(opts.onSave){// 异步保存
                opts.onSave(oNewData,fAfterSave);
            }else{
                fAfterSave(oNewData);
            }
        };
        api={
            fSetData:fSetData,
            fGetData:fGetData,
            fCancelEditing:fCancelEditing
        };
        fInit();
        return api;
    };
    // 区划选择组件 - 2017.11.03 迁移from: svn\前端资源库\工作区\prjs\框架\frame6.2（版本:2640）
    _WI.initZoneBar = function(el, _opts){
        var opts = $.extend({
            data: [],  //区划数据源
            selectId: '', //默认无选中项
            idField: 'id',// 区划id
            txtField: 'zonename',// 区划名称
            placeholder: '',  //无选中项时的默认显示文字
            onChange: $.noop  //区划改变的回调  {function} opts.onChange(data) data是选中项数据
        }, _opts);

        var sTxtField = opts.txtField,
            sIdField = opts.idField,
            onChange = opts.onChange,
            selectId,
            _data, //数据源
            aCurHItem, //存放当前选中项下的其他层的有hover节点在_hasData中的索引
            aSelect,
            nMaxLevel, //最大层
            jqZoneDp,
            jqZoneDpCont,
            oDpApi,
            api;
        // 组件点击事件，显示下拉框
        var fDpClick = function(){
            if(el.hasClass('disabled')) return;
            aCurHItem = aSelect.slice();
            fDrawItem(0);//鼠标滑过到其他项，关闭弹框，再次打开需要重新绘制选中项
            oDpApi.show();
        };
        //根据id查找索引
        var fGetIndex = function(id){
            var aTemp = [];
            var flag;
            var fFindId = function(data, level){
                if(!data || !data.length){
                    return;
                }
                for(var i = 0, item; i < data.length; i++){
                    item = data[i];
                    if(item[sIdField] == id){
                        flag = true;
                    }
                    else{
                        fFindId(item.children, level + 1);
                    }
                    if(flag){
                        aTemp[level] = i;
                        break;
                    }
                }
            };
            fFindId(_data, 0);
            return aTemp;
        };
        /**
         * 得到选中项数据
         **/
        var fGetData = function(){
            var oResult = _data;
            for(var i = 0, idx; i < aSelect.length; i++){
                idx = aSelect[i];
                oResult = i ? oResult.children[idx] : oResult[idx];
            }
            return oResult;
        };
        /**
         * 绘制具体的数据
         * @param nLevel 生成的dom要写入的jquery对象的层级
         * @param aCurData  当前要绘制层的对象数组
         */
        var fDrawItem = function(nLevel, aCurData){
            var cls, i, item, chd,
                str = '';
            var n = jqZoneDp.find('.dp-zone-level').length;
            for(i = nLevel; i < n; i++){
                jqZoneDp.find('[data-idx=' + i + ']').remove();
            }
            if(!aCurData){
                aCurData = _data;
                for(i = 0; i < nLevel; i++){   // 获取绘制的数据源
                    aCurData = aCurData[aCurHItem[i]].children;
                }
            }
            if(!aCurData || !aCurData.length){
                return;
            }
            jqZoneDpCont.append('<div class="dp-zone-level" data-idx="' + nLevel + '"></div>');
            //如果当前绘制层级的索引没有在aCurHItem中找到，将选中节点的子节点的层级的索引设置为0，存放到aCurHItem数组
            if(aCurHItem[nLevel] == undefined){
                aCurHItem[nLevel] = 0;
            }
            for(i = 0; i < aCurData.length; i++){
                cls = '';
                item = aCurData[i];
                chd = item.children;  //可能是 null||[]
                if(i == aCurHItem[nLevel]){
                    if(Array.isArray(chd)){
                        if(chd.length){
                            cls = "hover";
                            fDrawItem(nLevel + 1, chd);
                        }
                    }
                    else{
                        if(chd){
                            cls = "hover";
                            fDrawItem(nLevel + 1, chd);
                        }
                    }
                }
                if(item[sIdField] == fGetData()[sIdField]){
                    cls += " active";
                }
                str += '<div class="item"><span class="' + cls + '">' + $.encodeHtml(item[sTxtField]) + '</span></div>';
            }
            jqZoneDp.find('[data-idx=' + nLevel + ']').html(str);
        };
        //鼠标移入事件
        var fItemEnter = function(e){
            var jqCur = $(this),
                nLevel = parseInt(jqCur.closest('.dp-zone-level').attr('data-idx')),// 当前项是第几层
                nIndex = jqCur.closest('.item').index(), // 当前项是第几项
                nNextLevel = nLevel + 1;
            jqCur.closest('.item').siblings().find('span').removeClass('hover');
            jqCur.addClass("hover");
            aCurHItem.length = nNextLevel;
            aCurHItem[nLevel] = nIndex;
            fDrawItem(nNextLevel);  // 绘制数据
        };
        //关闭区划弹框
        var fCloseDp = function(data){
            var sId = data[sIdField];
            oDpApi.close();  //关闭下拉弹框
            if(sId == selectId){
                return;
            }
            selectId = sId; // 保存选中项id
            el.html(data[sTxtField]);
            onChange(data); //触发改变后的回调函数
        };
        //区划的点击事件
        var fItemClick = function(e){
            var jqCur = $(this);
            jqZoneDp.find(".active").removeClass("active");
            jqCur.addClass("active");
            aSelect = aCurHItem.slice();
            aSelect.length = parseInt(jqCur.closest('.dp-zone-level').attr('data-idx')) + 1;
            fCloseDp(fGetData());
        };

        //初始化下拉弹框
        var fInitDp = function(){
            jqZoneDp = $('<div class="dp-zone js-dpzone">' +
                '<div class="dp-zone-h">请选择区划</div>' +
                '<div class="dp-zone-cont"></div>' +
                '</div>');
            jqZoneDpCont = jqZoneDp.find('.dp-zone-cont');
            jqZoneDp.on('click.item', 'span', fItemClick);  //区划的点击事件
            jqZoneDp.on('mouseenter.item', 'span', fItemEnter);   //鼠标移入span事件
            oDpApi = el.dropdown({
                cont: jqZoneDp,// 弹出层的jQuery对象
                show: false
                //modal:true//是否为模态遮罩层，默认为 true
            });
        };
        //重置区划组件
        var fReset = function(newOpts){
            if(newOpts){
                $.extend(opts, newOpts);
            }
            _data = opts.data.length ? opts.data : [];
            selectId = opts.selectId;
            nMaxLevel = 0;
            var oSelData;
            if(selectId){
                var aInitSelect = fGetIndex(selectId);
                aSelect = aInitSelect.length ? aInitSelect : []; //如果初始化数据id在数据源中不存在，默认不选中节点
            }
            else{
                aSelect = []; //初始化没有选中项，默认不选中节点
            }
            if(aSelect.length > 0){
                aCurHItem = aSelect.slice(); // 鼠标经过元素在数据源中的序号
                oSelData = fGetData();
                el.html(oSelData && oSelData[sTxtField]);
            }
            else{
                aCurHItem = [0];    // 初始化没有选中项，默认根节点高亮
                el.html(opts.placeholder);  // 初始化没有选中项，显示placeholder文本
            }
            jqZoneDpCont.html('');
            fDrawItem(0);
        };
        var fInit = function(){
            el.addClass('zoneBar');
            fInitDp();  //初始化下拉弹框
            fReset();
            el.off('click.zonechoose')
              .on('click.zonechoose', fDpClick);
        };
        fInit();
        api = {
            reset: fReset,
            getData: fGetData, //取选中值
            setData: fReset  //赋选中值
        };
        return api;
    };
    // 过滤组件
    _WI.initfilterBar = function(el, opts){
        var CONF = {
            ctrlHeight: 40// 底部按钮条高度
        };
        opts = $.extend({
            cateConf: {},// 类目配置
            cateSort: [],// 类目显示顺序，其中每项对应 oCateConf 中的键
            width:600, // 宽度，默认600px
            height:370,  // 类目选项框最大高度，默认370px，包括下方按钮条高度 CONF.ctrlHeight
            //data: {},// 暂不支持初始化时定义，选项数据源
            //today: Date,// 指定今天的日期（通常从后台获取的真实日期），包含日期组件时生效
            onChange: $.noop// function(data) data 为当前条件的键值对
        }, opts);
        var oCateConf = opts.cateConf,  // 类目数据
            aCateSort = opts.cateSort,          // 类目显示顺序，其中每项对应 oCateConf 中的键
            oData,                      // opts.data 选项数据源，oCateConf 中每个类目对应的选项数据源
            oSelect = {},               // 选中项数据
        //oInitSelect = {},           // 初始选中项数据（暂未实现，每次显示弹框时的选中项？修改数据源时的选中项？为避免修改 oSelect 时影响 oInitSelect，此处需要深拷贝）
            oDefault = {};              // 默认选中项数据
        var jqFilterDp;// 下拉弹出元素
        var api, oDpApi, oDlApi = {};
        var bAllowCb;// 用于标识是否允许回调事件，设置日期时，会引起回调（通过接口设置选中项时不应触发回调）
        // 组件点击事件，显示下拉框
        var fDpClick = function(){
            oDpApi.show();
        };
        // 弹框中底部按钮点击事件
        var fBtnClick = function(){
            var jqCur = $(this);
            switch(jqCur.attr('data-type')){
                case 'reset':
                    fSetSelect();
                    opts.onChange(fGetSelect());
                    break;
            }
        };
        // 弹框中单选/多选选项点击事件
        var fItemClick = function(){
            var jqCur = $(this),// .dp-filter-cateitem>span
                jqCurCate = jqCur.closest('.panel'),// 类目 panel 容器
                sCurKey = jqCurCate.attr('data-val'),// 类目 key
                sCurVal = jqCur.attr('data-key'),// 点击项 key
                oCurCate = oCateConf[sCurKey],// 类目配置
                sCurType = oCurCate['type'] || 'radio',
                bCurRequire = oCurCate['require'],
                aCurSelect = oSelect[sCurKey],
                nCurIdx = -1;// 点击项 key 在 aCurSelect 中的索引
            if(aCurSelect && aCurSelect.length){
                nCurIdx = aCurSelect.indexOf(sCurVal);
            }else{// 手动操作，取消后也应设为 []，不再使用默认项，并便于之后数组操作，在此设为 []
                aCurSelect = oSelect[sCurKey] = [];
            }
            if(sCurType == 'radio'){// 单选
                if(nCurIdx > -1){// 已选中
                    if(bCurRequire){// 必选，不可取消
                        return;
                    }
                    jqCur.removeClass('active');// 非必选，取消选中
                    aCurSelect.length = 0;
                }else{// 未选中，设为选中项
                    jqCur.addClass('active');
                    jqCur.parent().siblings().children().removeClass('active');// 取消其他选中项
                    aCurSelect[0] = sCurVal;
                }
            }
            else if(sCurType == 'checkbox'){// 多选
                if(nCurIdx > -1){// 已选中
                    if(bCurRequire && aCurSelect.length == 1){// 必选，且为最后一个选中项，不可取消
                        return;
                    }
                    jqCur.removeClass('active');// 非必选，取消选中
                    aCurSelect.splice(nCurIdx,1);// 从选中项移除移除
                }else{
                    jqCur.addClass('active');
                    aCurSelect.push(sCurVal);
                }
            }
            opts.onChange(fGetSelect());
        };
        // 日期改变后的回调函数
        var fDateChangeHandler = function(sKey){
            return function(start, end){
                oSelect[sKey] = [start, end];
                if(bAllowCb){
                    opts.onChange(fGetSelect());
                }
            }
        };
        // 初始化下拉弹框 绘制类别框架
        var fInitDp = function(){
            var str = '<div class="dp-filter" style="width:'+opts.width+'px;">' +
                    //'<div class="dp-filter-c" style="max-height:'+opts.height+'px;">';
                '<div class="dp-filter-c" style="height:'+(opts.height-CONF.ctrlHeight)+'px;">';// TODO 有日期组件时，若使用 max-height
            // 循环绘制类别框架
            for(var i = 0, oCurCate, sCurName; i < aCateSort.length; i++){
                sCurName = aCateSort[i];
                oCurCate = oCateConf[sCurName];
                str += '<div class="panel" data-val="' + sCurName + '">' +
                    '<div class="panel-h panel-h-styrline">' +
                    '<div class="panel-h-l">' + oCurCate.name + '</div>' +
                    '</div>' +
                    '<div class="panel-c"><div class="dp-filter-cate"></div></div>' +
                    '</div>';
            }
            // 底部按钮
            str += '</div>'+
                '<div class="dp-filter-ctrl">' +
                '<button class="btn btn-min btn-primary" type="button" data-type="reset">重置</button>';
            str += '</div></div>';
            jqFilterDp = $(str);
            jqFilterDp.on('click.item', '.dp-filter-cateitem>span', fItemClick)//弹框中单选/多选选项点击事件（通过.dp-filter-cateitem 限制 span，避免日期中的 span 进入事件）
                      .on('click.btn', '.btn', fBtnClick);  //底部按钮的点击事件
            oDpApi = el.dropdown({
                cont: jqFilterDp,// 弹出层的jQuery对象
                //modal: false,//是否为模态遮罩层，默认为 true
                show: false
            });
        };
        // 绘制选项
        var fDrawItem = function(sKey){
            var jqCurCate = jqFilterDp.find('[data-val="' + sKey + '"]'),
                jqCurContainer = jqCurCate.find('.dp-filter-cate'),
                oCurCate = oCateConf[sKey];// 当前绘制项配置
            if(oCurCate.type == 'dateLine'){
                var oJqDate = $('<div class="dp-filter-dl"></div>');
                jqCurContainer.html(oJqDate);
                oDlApi[sKey] = oJqDate.initDateLine({// 日期范围选择组件
                    today:opts.today,
                    allowEmpty:!oCurCate['require'],// 若必选，则不允许为空
                    onChange: fDateChangeHandler(sKey)
                });
            }
            else{
                var str = '',
                    oCurData = oData[sKey] || [];
                if(oCurData.length == 0){
                    jqCurCate.remove();
                    return;
                }
                var sValField = oCurCate.valField,
                    sTxtField = oCurCate.txtField;
                for(var i = 0; i < oCurData.length; i++){
                    var oCurItem = oCurData[i];
                    str += '<div class="dp-filter-cateitem"><span class="" data-key="' + oCurItem[sValField] + '" title="'+oCurItem[sTxtField]+'">' +
                        $.encodeHtml(oCurItem[sTxtField]) + '</span></div>';
                }
                jqCurContainer.html(str);
            }
        };
        // 设置某一类的选中项
        var fSetCateSelect = function(aSelect,sKey){
            var jqCurCate = jqFilterDp.find('[data-val="' + sKey + '"]'),// 当前类目
                oCurCate = oCateConf[sKey],// 当前类目配置
                aDefault = oDefault[sKey];
            if(oCurCate.type == 'dateLine'){
                if(!aSelect && oCurCate.require){// 未设置选中项，且必选，将默认项设为选中
                    // 日期框中，因设置了 allowEmpty = false，因此，不需考虑 aDefault 的情况，initDateLine 中会进行处理
                    aSelect = $.extend([],aDefault);// 避免修改选中项时，污染默认项
                }
                oSelect[sKey] = aSelect;// 同步选中项（可能被设为 aDefault 或 undefined）
                if(aSelect){
                    oDlApi[sKey].setDateData(aSelect[0], aSelect[1]);
                }else{
                    oDlApi[sKey].setDateData();
                }
            }
            else{
                var oCurData = oData[sKey],// 选项数据源
                    sValField = oCurCate.valField;
                if(oCurData && oCurData.length){// 无数据源，不允许设置选中项
                    if(oCurCate.require){// 必选
                        if(!aSelect || !aSelect.length){// 未定义选中项或选中项长度为0，需要以默认值处理
                            aSelect = aDefault ?
                                $.extend([],aDefault):// 避免修改选中项时，污染默认项
                                [oCurData[0][sValField]];// 无默认项，将第一项选中
                        }
                    }else{// 非必选
                        if(!aSelect && aDefault){// 未设置选中项，将默认项设为选中
                            aSelect = $.extend([],aDefault);// 避免修改选中项时，污染默认项
                        }
                    }
                    oSelect[sKey] = aSelect;// 同步选中项（可能被设为 aDefault 或 undefined）
                    jqCurCate.find('.active').removeClass('active');
                    if(aSelect && aSelect.length){
                        $.each(aSelect, function(key, value){
                            jqCurCate.find('[data-key="' + value + '"]').addClass('active');
                        })
                    }
                }
            }
        };
        // 设置选中项，changePart = true 时，只修改 selected 定义的条件，保留其他条件
        var fSetSelect = function(selected,changePart){
            var sKey;
            bAllowCb = false;// 阻止回调，防止 fSetCateSelect() 中日期设值时触发回调
            if(!selected){
                selected = {};
            }
            if(changePart){ // changePart为true时，只修改传入数据类目
                for(sKey in selected){
                    fSetCateSelect(selected[sKey],sKey);
                }
            }else{ // changePart不为true时，修改全部类目
                for(var i = 0, len = aCateSort.length; i < len; i++){
                    sKey = aCateSort[i];
                    fSetCateSelect(selected[sKey],sKey);
                }
            }
            bAllowCb = true;// 完成选中项配置，允许回调
        };
        // 获取选中项
        var fGetSelect = function(){
            var oReturn = {},
                aCurSelect;
            for(var sKey in oSelect){
                aCurSelect = oSelect[sKey];
                if(aCurSelect && aCurSelect.length){
                    // 非 dateLine 的条件，或虽为 dateLine，但两项不全为 undefined ，此时条件有意义
                    if(oCateConf[sKey].type != 'dateLine' || aCurSelect[0] || aCurSelect[1]){
                        oReturn[sKey] = $.extend([],aCurSelect);// 暂不需深拷贝，目前 oCurSelect 仅为一维数组
                    }
                }
            }
            return oReturn;
        };
        // 设置选项数据
        var fSetData = function(data, defaultData, selected){
            oData = data || {};
            oDefault = defaultData || {};
            for(var i = 0, len = aCateSort.length; i < len; i++){
                fDrawItem(aCateSort[i]);
            }
            fSetSelect(selected);// 设置选中项
        };
        // 重设部分选项数据
        var fSetPartData = function(data, defaultData, selected){
            var realSelected = {};
            defaultData || (defaultData={});
            selected || (selected={});
            for(var sKey in data){
                if(data.hasOwnProperty(sKey)){
                    oData[sKey] = data[sKey];
                    oDefault[sKey] = defaultData[sKey];
                    realSelected[sKey] = selected[sKey];
                    fDrawItem(sKey);
                }
            }
            fSetSelect(realSelected,true);// 设置选中项
        };
        var fInit = function(){
            el.addClass('filterbar');
            fInitDp();  //初始化下拉弹框
            el.off('click.filter')
              .on('click.filter', fDpClick);
            // TODO 数据绘制，选中项绘制
        };
        api = {
            fGetSelect: fGetSelect,// function() 获取选中项
            fSetData: fSetData,// function(data, defaultData, selected) 重设可选项数据，同时将修改默认值和选中值
            fSetPartData: fSetPartData,// function(data, defaultData, selected) 重设部分可选项数据，同时将修改对应的默认值和选中值
            fSetSelect: fSetSelect// function(selected,changePart) selected {object}; changePart {boolean} 为 true 时，只修改 selected 定义的条件，保留其他条件
        };
        fInit();
        return api;
    };
    //container容器左右拖拽左右滑动改变宽度组件
    _WI.drag = function(el,opts){
        opts = $.extend({
            leftMinWidth:200 //左侧容器最小宽度
        }, opts);
        var nElW,//el的容器宽度
            nMaxDragDisX,//最大的移动距离
            nLineOffsetL,//滑动线相对于文档的偏移
            nStarX,//滑动线鼠标点击的起始位置
            nLeftMinWidth,//左侧容器的最小宽
            jqDocument,//文档jquery对象
            jqRight,//容器右侧jquery对象
            jqLeft,//容器左侧jquery对象
            jqLine,//滑动线jquery对象
            dLine;//滑动线dom对象
        //document鼠标移动的事件
        var fDomMousemove = function(e){
            var curDis = nLineOffsetL + (e.pageX - nStarX);//滑动线滑动的距离文档的距离
            curDis < nLeftMinWidth && ( curDis = nLeftMinWidth);
            curDis > nMaxDragDisX && ( curDis = nMaxDragDisX);
            jqLine.css('left', curDis); //更新滑动线的left位置
            jqLeft.css('width', curDis); //更新左侧容器的宽
            jqRight.css({
                'left':curDis,
                'marginLeft':'4px' //container-l与container-r两个容器直接有4px的间距
            });//更新右侧容器left位置
            return false;
        };
        //document鼠标抬起的事件
        var fDomMouseup = function(e){
            jqDocument.off('mousemove.dragline')
                      .off('mouseup.dragline');
            dLine.releaseCapture && dLine.releaseCapture();
            return false;
        };
        //滑动界限的鼠标按下的事件
        var fLindeMouseDown = function(e){
            dLine = jqLine[0]; //滑动线的dom
            nStarX = e.pageX; //滑动线鼠标点击的起始位置
            nLineOffsetL = jqLine.offset().left;
            dLine.setCapture && dLine.setCapture();
            jqDocument.off('mousemove.dragline')
                      .on('mousemove.dragline', fDomMousemove)//document鼠标移动的事件
                      .off('mouseup.dragline')
                      .on('mouseup.dragline', fDomMouseup);//document鼠标抬起的事件
            return false;
        };

        var fInit = function(){
            el.addClass('drag-container');
            jqLine = $('<div class="drag-line"></div>');
            jqRight = el.find('.container-r');
            jqLeft = el.find('.container-l');
            jqDocument = $(document);
            nLeftMinWidth = opts.leftMinWidth;
            jqLeft.css('min-width',nLeftMinWidth);
            jqLine.css('left',jqLeft.outerWidth());//设置滑动线的left位置
            el.append(jqLine);
            nElW = el.outerWidth();
            nMaxDragDisX = nElW - jqLine.width();
            jqLine.off('mousedown.dragline')
                  .on('mousedown.dragline', fLindeMouseDown);//滑动线的鼠标按下的事件
        };
        fInit();
    };

    /* ===== 主体实现 ===== */
    window.BASEPATH= $.getBasePath();
    var URLS={
        pTimeout: BASEPATH+'timeout.jsp'
    };
    // session 过期将页面转到提示页面
    $(document).ajaxComplete(function(event, xhr, settings) {
        if (xhr.getResponseHeader('session_status') == 'timeout') {
            location.href = URLS.pTimeout;
        }
    });
    $.setWiConf('initPageBar',{
        toolTxts:[
            '<span class="fa fa-angle-double-left"></span>',
            '<span class="fa fa-angle-left"></span>',
            '<span class="fa fa-angle-right"></span>',
            '<span class="fa fa-angle-double-right"></span>'
        ]
    });
    $.setWiConf('initZTree',{
        view:{
            showLine:false,
            showIcon:false
        }
    });
    $.setWiConf('initCusLayer',{
        win: $.getTopFrameWin()
    });
})(jQuery);