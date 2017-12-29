'use strict';
$(function() {
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab4', // 当前 tab 页标识
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
    oBegin=jqCont.find('.js-begin-mon').initSelNum({
        minVal:0,maxVal:12,name:'begin-mon',value:0
    });
    oStep=jqCont.find('.js-step-mon').initSelNum({
    	minVal:0,maxVal:12,name:'step-mon',value:0
    });
    oBetweenBegin=jqCont.find('.js-between-begin-mon').initSelNum({
    	minVal:0,maxVal:12,name:'between-begin-mon',value:0
    });    
    oBetweenEnd=jqCont.find('.js-between-end-mon').initSelNum({
    	minVal:0,maxVal:12,name:'between-end-mon',value:0
    });
    oBtBegin=jqCont.find('.js-bt-begin-mon').initSelNum({
    	minVal:0,maxVal:12,name:'bt-begin-mon',value:0
    });
    oBtEnd=jqCont.find('.js-bt-end-mon').initSelNum({
    	minVal:0,maxVal:12,name:'bt-end-mon',value:0
    });
    oBtStep=jqCont.find('.js-bt-step-mon').initSelNum({
    	minVal:0,maxVal:12,name:'bt-step-mon',value:0
    });

});