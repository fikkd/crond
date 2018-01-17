'use strict';
var G_TabTool = {// tab 页全局变量、方法管理
    mainApi: {},// 主页面开放到全局的接口
    /* 以下2个对象，以 tab 页的标识作为键保存对应的方法 */
    api: {},// 各 tab 开放到全局的接口 - 主体初始化时赋值，tab 页 js 中扩展方法
    fnInit: {} //初始化tabtab 页的初始化方法，主页面加载完成后，会将所有 tab 页的初始化内容方法都执行一次 - function(val)
};
var cronExpression;
var cronExpressionZhCN;
$(function(){
    var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
    var layerName, fromWin;
    var URLS = {};
    var aTabVal = ['tab0', 'tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'],// 根据此顺序触发每个 tab 页的初始化内容方法
        aTabsData,
        oMainApi = G_TabTool.mainApi,
        oApi = G_TabTool.api,
        oFnInit=G_TabTool.fnInit,
        oTabApi;
    
    
    // 顶部按钮点击事件
    var fTbtnsClick = function(){
        switch($(this).attr('data-type')){
            case 'save':
                if(aTabsData.length){
                    // 依次调用tab 页的的fSave函数                	
                	var arr,flag=true,ct=0,dt=0,
                	cronExpression='',cronExpressionZhCN='';
                    for(var i= 0,curTabval,len=aTabsData.length;i<len;i++){
                        curTabval=aTabsData[i]['val'];
                        var s = oApi[curTabval].fSave && oApi[curTabval].fSave();
                        
                        if (s=='false' && !(flag=false)) {//年的tab中如果输入的内容不正确则不允许关闭弹框
                        	$.showMsg("年份设置不符合规范");
                        	break;
                        }
                        arr=s.split('|');                        
                        if ((arr[0]=='?') && (++ct) && (ct==2) && !(flag=false)) {
            				$.showMsg("日和周有且必须设置一个");
                        	break;
                        }
                        if ((arr[0]!='?') && (++dt) && (dt==7) && !(flag=false)) {
                        	$.showMsg("日和周必须有一个不设置");
                        	break;
                        }
                        
                        cronExpression+=arr[0]+' ';
                        cronExpressionZhCN = arr[1] + cronExpressionZhCN;
                    }
                }                                
                if (flag) {
                	fromWin.cusLayer[layerName](cronExpression+'|'+cronExpressionZhCN);// 调用打开弹框的页面中定义的callback 方法
                	fromWin.closeLayer[layerName]();// 关闭弹窗                	
                }
                break;
        }
    };
    // tab 页切换后的事件
    var fOnTabChange = function(val){
        var fOnSelect = oApi[val]['fOnSelect'];
        fOnSelect && fOnSelect();// 调用指定 tab 页的选中方法
    };
    
    /** ========================================================= **/
    window.initPage = function(name, data, win) {
		layerName = name;
		fromWin = win;
		// 接收父页面传递过来的参数
		cronExpression = data.cron_expression;
		cronExpressionZhCN = data.cron_zh_cn;
		if (!cronExpression) {//新建任务时默认表达式
			oMainApi.cronExpression = "0 0 * * * ? *";
		} else {
			oMainApi.cronExpression = cronExpression;	
			oMainApi.cronExpressionZhCN = cronExpressionZhCN;	
		}
		
		// 扩展主页面全局接口
	    oMainApi['oHideParams'] = oHideParams;
	    oMainApi['oUrlParams'] = oUrlParams;
	    $('.js-tbtns').on('click', '.btn', fTbtnsClick);  // 顶部按钮事件
	    // 依次初始化 tab 页内容
	    for(var i = 0, curTabval, len = aTabVal.length; i < len; i++){
	        curTabval = aTabVal[i];
	        oApi[curTabval] = {};
	        oFnInit[curTabval] && oFnInit[curTabval]();
	    }
	    // 初始化 tab 组件
	    aTabsData = [
	        {val:'tab0',txt:'秒'}, {val:'tab1',txt:'分'}, {val:'tab2',txt:'时'},
	        {val:'tab3',txt:'日'}, {val:'tab4',txt:'月'}, {val:'tab5',txt:'周'}, {val:'tab6',txt:'年'}
	    ];

	    oTabApi = G_TabTool.oTabApi = $('.js-tabs').initTabsBox({
	        tabs: aTabsData,
	        onChange: fOnTabChange
	    });
		
	}
});