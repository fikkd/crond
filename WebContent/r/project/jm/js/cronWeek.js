'use strict';
$(function() {
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab5', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqCont = $('.wrap-cont'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep, oBtCount;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {
		console.log('父页面传递过来的参数' + cronExpression);
		console.log('父页面传递过来的参数' + cronExpressionZhCN);
	};
	// 保存当前页
	var fSave = function() {
		cronExpression = '789';
		cronExpressionZhCN = '001';
	};
	/** ==================== * */
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
	};

	// 数字组件
    oBegin=jqCont.find('.js-begin-wek').initSelNum({
        minVal:0,maxVal:52,name:'begin-wek',value:0
    });
    oStep=jqCont.find('.js-step-wek').initSelNum({
    	minVal:0,maxVal:52,name:'step-wek',value:0
    });
    oBetweenBegin=jqCont.find('.js-between-begin-wek').initSelNum({
    	minVal:0,maxVal:52,name:'between-begin-wek',value:0
    });    
    oBetweenEnd=jqCont.find('.js-between-end-wek').initSelNum({
    	minVal:0,maxVal:52,name:'between-end-wek',value:0
    });
    oBtBegin=jqCont.find('.js-bt-begin-wek').initSelNum({
    	minVal:0,maxVal:52,name:'bt-begin-wek',value:0
    });
    oBtEnd=jqCont.find('.js-bt-end-wek').initSelNum({
    	minVal:0,maxVal:52,name:'bt-end-wek',value:0
    });
    oBtStep=jqCont.find('.js-bt-step-wek').initSelNum({
    	minVal:0,maxVal:52,name:'bt-step-wek',value:0
    });
    oBtCount=jqCont.find('.js-bt-count-wek').initSelNum({
    	minVal:0,maxVal:52,name:'bt-count-wek',value:0
    });

});