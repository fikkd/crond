'use strict';
$(function() {
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab1', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqCont = $('.wrap-cont'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {
		
		
		
		
	};
	// 保存当前页
	var fSave = function() {
		
		
		
	};
	
	/** ================================================== **/
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
	};

	// 数字组件
    oBegin=jqCont.find('.js-begin-min').initSelNum({
        minVal:0,maxVal:60,name:'begin-min',value:0
    });
    oStep=jqCont.find('.js-step-min').initSelNum({
    	minVal:0,maxVal:60,name:'step-min',value:0
    });
    oBetweenBegin=jqCont.find('.js-between-begin-min').initSelNum({
    	minVal:0,maxVal:60,name:'between-begin-min',value:0
    });    
    oBetweenEnd=jqCont.find('.js-between-end-min').initSelNum({
    	minVal:0,maxVal:60,name:'between-end-min',value:0
    });
    oBtBegin=jqCont.find('.js-bt-begin-min').initSelNum({
    	minVal:0,maxVal:60,name:'bt-begin-min',value:0
    });
    oBtEnd=jqCont.find('.js-bt-end-min').initSelNum({
    	minVal:0,maxVal:60,name:'bt-end-min',value:0
    });
    oBtStep=jqCont.find('.js-bt-step-min').initSelNum({
    	minVal:0,maxVal:60,name:'bt-step-min',value:0
    });

});