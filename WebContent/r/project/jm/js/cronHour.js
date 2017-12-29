'use strict';
$(function() {
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab2', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqCont = $('.wrap-cont'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
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
    oBegin=jqCont.find('.js-begin-hor').initSelNum({
        minVal:0,maxVal:24,name:'begin-hor',value:0
    });
    oStep=jqCont.find('.js-step-hor').initSelNum({
    	minVal:0,maxVal:24,name:'step-hor',value:0
    });
    oBetweenBegin=jqCont.find('.js-between-begin-hor').initSelNum({
    	minVal:0,maxVal:24,name:'between-begin-hor',value:0
    });    
    oBetweenEnd=jqCont.find('.js-between-end-hor').initSelNum({
    	minVal:0,maxVal:24,name:'between-end-hor',value:0
    });
    oBtBegin=jqCont.find('.js-bt-begin-hor').initSelNum({
    	minVal:0,maxVal:24,name:'bt-begin-hor',value:0
    });
    oBtEnd=jqCont.find('.js-bt-end-hor').initSelNum({
    	minVal:0,maxVal:24,name:'bt-end-hor',value:0
    });
    oBtStep=jqCont.find('.js-bt-step-hor').initSelNum({
    	minVal:0,maxVal:24,name:'bt-step-hor',value:0
    });

});