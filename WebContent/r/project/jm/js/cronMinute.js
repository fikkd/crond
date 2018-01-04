'use strict';
$(function() {
	var minute,minuteZhCN;
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab1', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqContM = $('[data-val="minute"]'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {
		
		
		
		
	};
	// 保存当前页
	var fSave = function() {
		minute='',minuteZhCN='';
		// 获取被选择的值,重新构造cron表达式,构造cron中文表达式
		if ($("input[name='minute']:eq(0):checked").val()) {
			minute = '0';
			minuteZhCN = '0分';
		}
		if ($("input[name='minute']:eq(1):checked").val()) {
			minute = '*';
			minuteZhCN = '每隔一分钟';
		}
		if ($("input[name='minute']:eq(2):checked").val()) {
			minute = jqContM.find('[name="begin"]').val()+'/'+jqContM.find('[name="step"]').val();
			minuteZhCN = jqContM.find('[name="begin"]').val() +'分开始, 每隔' + jqContM.find('[name="step"]').val() + '分钟';
		}
		if ($("input[name='minute']:eq(3):checked").val()) {
			minute = jqContM.find('[name="between-begin"]').val()+'-'+jqContM.find('[name="between-end"]').val() + '/1';
			minuteZhCN = jqContM.find('[name="between-begin"]').val() +'至' + jqContM.find('[name="between-end"]').val() + '分钟之间每隔一分钟';
		}
		if ($("input[name='minute']:eq(4):checked").val()) {
			minute = jqContM.find('[name="bt-begin"]').val()+'-'+jqContM.find('[name="bt-end"]').val() + '/' + jqContM.find('[name="bt-step"]').val();
			minuteZhCN = jqContM.find('[name="bt-begin"]').val() +'至' + jqContM.find('[name="bt-end"]').val() + '分钟之间每隔' + jqContM.find('[name="bt-step"]').val() + '分钟';
		}
		if ($("input[name='minute']:eq(5):checked").val()) {
			var len = jqContM.find("input:checkbox:checked").length;
			if (len==0) {
				jqContM.find("input[type='checkbox'][value='0']").prop("checked",true);				
			}
			$.each(jqContM.find('input:checkbox'),function(){
				if(this.checked){
					minute += $(this).val() + ',';
				}
			});
			minute=minute.replace(/(.*),/g, '$1');
			minuteZhCN=minute + '分钟';			
		}
		console.log('分钟\t' + minute+"|"+minuteZhCN);
		return minute+"|"+minuteZhCN;
		
		
	};
	
	/** ================================================== **/
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
		
		minute = oMainApi.cronExpression.split(/\s/g)[1];
		//页面初始化时解析cron表达式
		var arr2,arr3,arr4,arr5;
		if (minute=='0') 	
			$("input[name='minute']:eq(0)").attr("checked",'checked');
		if (minute=='*')
			$("input[name='minute']:eq(1)").attr("checked",'checked');
		if (minute.search(/^\d+\/\d+$/g) != -1) {
			$("input[name='minute']:eq(2)").attr("checked",'checked');
			arr2 = minute.split(/\//g);			
		}
		if (minute.search(/^\d+-\d+\/1$/g) != -1) {
			$("input[name='minute']:eq(3)").attr("checked",'checked');
			arr3 = minute.replace(/(\d+)-(\d+)\/1/g,'$1,$2').split(',');
		}
		if (minute.search(/^\d+-\d+\/[^1]$/g) != -1) {
			$("input[name='minute']:eq(4)").attr("checked",'checked');			
			arr4 = minute.replace(/(\d+)-(\d+)\/(\d+)/g,'$1,$2,$3').split(',');
		}
		if (minute.search(/^(\d+,)*\d+$/g) != -1) {			
			$("input[name='minute']:eq(5)").attr("checked",'checked');			
			arr5 = minute.split(',');
			$.each(arr5, function(index, item){
				$("[data-val='minute']").find("input[type='checkbox'][value='"+item+"']").prop("checked",true);				
			});
		}
		
		// 数字组件
	    oBegin=jqContM.find('.js-begin-min').initSelNum({
	        minVal:0,maxVal:60,name:'begin-min',value:arr2?arr2[0]:0
	    });
	    oStep=jqContM.find('.js-step-min').initSelNum({
	    	minVal:0,maxVal:60,name:'step-min',value:arr2?arr2[1]:0
	    });
	    oBetweenBegin=jqContM.find('.js-between-begin-min').initSelNum({
	    	minVal:0,maxVal:60,name:'between-begin-min',value:arr3?arr3[0]:0
	    });    
	    oBetweenEnd=jqContM.find('.js-between-end-min').initSelNum({
	    	minVal:0,maxVal:60,name:'between-end-min',value:arr3?arr3[1]:0
	    });
	    oBtBegin=jqContM.find('.js-bt-begin-min').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-begin-min',value:arr4?arr4[0]:0
	    });
	    oBtEnd=jqContM.find('.js-bt-end-min').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-end-min',value:arr4?arr4[1]:0
	    });
	    oBtStep=jqContM.find('.js-bt-step-min').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-step-min',value:arr4?arr4[2]:2
	    });
	    
	};

	
	
	

});