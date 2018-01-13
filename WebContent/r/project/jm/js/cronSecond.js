'use strict';
$(function() {
	var second,secondZhCN;
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab0', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqCont = $('[data-val="second"]'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {
		
		
	};
	// 保存当前页
	var fSave = function() {
		second='',secondZhCN='';
		// 获取被选择的值,重新构造cron表达式,构造cron中文表达式
		if ($("input[name='second']:eq(0):checked").val()) {
			second = '*';
			secondZhCN = '每隔一秒触发';
		}
		if ($("input[name='second']:eq(1):checked").val()) {
			var b = $('[data-val="second"]').find('[name="begin"]').val();
			var s = $('[data-val="second"]').find('[name="step"]').val();
			second = b+'/'+s;
			secondZhCN = b+'秒开始, 每隔'+s+'秒触发';
		}
		if ($("input[name='second']:eq(2):checked").val()) {
			var b = $('[data-val="second"]').find('[name="bt-begin"]').val();
			var l = $('[data-val="second"]').find('[name="bt-end"]').val();
			var s = $('[data-val="second"]').find('[name="bt-step"]').val();
			second = b+'-'+l+'/'+s;
			secondZhCN = b+'至'+l+'秒之间每隔'+s+'秒触发';
		}
		if ($("input[name='second']:eq(3):checked").val()) {
			var len = jqCont.find("input:checkbox:checked").length;
			if (len==0) {
				jqCont.find("input[type='checkbox'][value='0']").prop("checked",true);				
			}
			$.each(jqCont.find('input:checkbox'),function(){
				if(this.checked){
					second += $(this).val() + ',';
				}
			});
			second=second.replace(/(.*),/g, '$1');
			secondZhCN=second + '秒触发';			
		}
		return second+"|"+secondZhCN;
	};
	
	/** =============================================== **/
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
		second = oMainApi.cronExpression.split(/\s/g)[0];
		//页面初始化时解析cron表达式
		var arr1,arr2,arr3;
		if (second=='*')
			jqCont.find("input[name='second']:eq(0)").attr("checked",'checked');
		if (second.search(/^\d+\/\d+$/g) != -1) {
			jqCont.find("input[name='second']:eq(1)").attr("checked",'checked');
			arr1 = second.split(/\//g);			
		}
		if (second.search(/^\d+-\d+\/\d+$/g) != -1) {
			jqCont.find("input[name='second']:eq(2)").attr("checked",'checked');			
			arr2 = second.replace(/(\d+)-(\d+)\/(\d+)/g,'$1,$2,$3').split(',');
		}
		if (second.search(/^(\d+,)*\d+$/g) != -1) {			
			jqCont.find("input[name='second']:eq(3)").attr("checked",'checked');			
			arr3 = second.split(',');
			$.each(arr3, function(index, item) {
				jqCont.find("input[type='checkbox'][value='"+item+"']").prop("checked",true);				
			});
		}
		
		oBegin=jqCont.find('.js-begin').initSelNum({
	        minVal:0,maxVal:60,name:'begin',value:arr1?arr1[0]:0
	    });
	    oStep=jqCont.find('.js-step').initSelNum({
	    	minVal:0,maxVal:60,name:'step',value:arr1?arr1[1]:0
	    });
	    oBtBegin=jqCont.find('.js-bt-begin').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-begin',value:arr2?arr2[0]:0
	    });
	    oBtEnd=jqCont.find('.js-bt-end').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-end',value:arr2?arr2[1]:0
	    });
	    oBtStep=jqCont.find('.js-bt-step').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-step',value:arr2?arr2[2]:1
	    });
	};

});