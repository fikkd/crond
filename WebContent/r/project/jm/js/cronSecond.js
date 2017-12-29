'use strict';
$(function() {
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab0', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqCont = $('.wrap-cont'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {
		
		
		
		
	};
	// 保存当前页
	var fSave = function() {
		
		
	};
	
	/** =============================================== **/
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
	};

	// 数字组件
    oBegin=jqCont.find('.js-begin').initSelNum({
        minVal:0,maxVal:60,name:'begin',value:0
    });
    oStep=jqCont.find('.js-step').initSelNum({
    	minVal:0,maxVal:60,name:'step',value:0
    });
    oBetweenBegin=jqCont.find('.js-between-begin').initSelNum({
    	minVal:0,maxVal:60,name:'between-begin',value:0
    });    
    oBetweenEnd=jqCont.find('.js-between-end').initSelNum({
    	minVal:0,maxVal:60,name:'between-end',value:0
    });
    oBtBegin=jqCont.find('.js-bt-begin').initSelNum({
    	minVal:0,maxVal:60,name:'bt-begin',value:0
    });
    oBtEnd=jqCont.find('.js-bt-end').initSelNum({
    	minVal:0,maxVal:60,name:'bt-end',value:0
    });
    oBtStep=jqCont.find('.js-bt-step').initSelNum({
    	minVal:0,maxVal:60,name:'bt-step',value:0
    });

});