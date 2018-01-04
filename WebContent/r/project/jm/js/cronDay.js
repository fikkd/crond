'use strict';
$(function() {
	var day,dayZhCN;
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab3', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqContD = $('[data-val="day"]'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {

	};
	// 保存当前页
	var fSave = function() {
		day='',dayZhCN='';
		// 获取被选择的值,重新构造cron表达式,构造cron中文表达式
		if ($("input[name='day']:eq(0):checked").val()) {
			day = '?';
		}
		if ($("input[name='day']:eq(1):checked").val()) {
			day = '*';
			dayZhCN = '每隔一天';
		}
		if ($("input[name='day']:eq(2):checked").val()) {
			day = jqContD.find('[name="begin"]').val()+'/'+jqContD.find('[name="step"]').val();
			dayZhCN = jqContD.find('[name="begin"]').val() +'日开始, 每隔' + jqContD.find('[name="step"]').val() + '天';
		}
		if ($("input[name='day']:eq(3):checked").val()) {
			day = jqContD.find('[name="between-begin"]').val()+'-'+jqContD.find('[name="between-end"]').val() + '/1';
			dayZhCN = jqContD.find('[name="between-begin"]').val() +'至' + jqContD.find('[name="between-end"]').val() + '日之间每隔一天';
		}
		if ($("input[name='day']:eq(4):checked").val()) {
			day = jqContD.find('[name="bt-begin"]').val()+'-'+jqContD.find('[name="bt-end"]').val() + '/' + $('[name="bt-step"]').val();
			dayZhCN = jqContD.find('[name="bt-begin"]').val() +'至' + jqContD.find('[name="bt-end"]').val() + '日之间每隔' + jqContD.find('[name="bt-step"]').val() + '天';
		}
		if ($("input[name='day']:eq(5):checked").val()) {
			var len = jqContD.find("input:checkbox:checked").length;
			if (len==0) {
				jqContD.find("input[type='checkbox'][value='0']").prop("checked",true);				
			}
			$.each(jqContD.find('input:checkbox'),function(){
				if(this.checked){
					day += $(this).val() + ',';
				}
			});
			day=day.replace(/(.*),/g, '$1');
			dayZhCN=day + '日';			
		}
		if ($("input[name='day']:eq(6):checked").val()) {
			day = 'L';
			dayZhCN = '每月最后一天';
		}
		console.log('day' + day+"|"+dayZhCN);
		return day+"|"+dayZhCN;
	};
	/** ==================== * */
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
		
		day = oMainApi.cronExpression.split(/\s/g)[3];
		
		//页面初始化时解析cron表达式
		var arr2,arr3,arr4,arr5;
		if (day=='?') 	
			$("input[name='day']:eq(0)").attr("checked",'checked');
		if (day=='*')
			$("input[name='day']:eq(1)").attr("checked",'checked');
		if (day.search(/^\d+\/\d+$/g) != -1) {
			$("input[name='day']:eq(2)").attr("checked",'checked');
			arr2 = day.split(/\//g);			
		}
		if (day.search(/^\d+-\d+\/1$/g) != -1) {
			$("input[name='day']:eq(3)").attr("checked",'checked');
			arr3 = day.replace(/(\d+)-(\d+)\/1/g,'$1,$2').split(',');
		}
		if (day.search(/^\d+-\d+\/[^1]$/g) != -1) {
			$("input[name='day']:eq(4)").attr("checked",'checked');			
			arr4 = day.replace(/(\d+)-(\d+)\/(\d+)/g,'$1,$2,$3').split(',');
		}
		if (day.search(/^(\d+,)*\d+$/g) != -1) {			
			$("input[name='day']:eq(5)").attr("checked",'checked');			
			arr5 = day.split(',');
			$.each(arr5, function(index, item){
				$('[data-val="day"]').find("input[type='checkbox'][value='"+item+"']").prop("checked",true);				
			});
		}
		if (day.search(/L/g) != -1) {			
			$("input[name='day']:eq(6)").attr("checked",'checked');			
		}
		
		// 数字组件
	    oBegin=jqContD.find('.js-begin-day').initSelNum({
	        minVal:0,maxVal:31,name:'begin-day',value:arr2?arr2[0]:0
	    });
	    oStep=jqContD.find('.js-step-day').initSelNum({
	    	minVal:0,maxVal:31,name:'step-day',value:arr2?arr2[1]:0
	    });
	    oBetweenBegin=jqContD.find('.js-between-begin-day').initSelNum({
	    	minVal:0,maxVal:31,name:'between-begin-day',value:arr3?arr3[0]:0
	    });    
	    oBetweenEnd=jqContD.find('.js-between-end-day').initSelNum({
	    	minVal:0,maxVal:31,name:'between-end-day',value:arr3?arr3[1]:0
	    });
	    oBtBegin=jqContD.find('.js-bt-begin-day').initSelNum({
	    	minVal:0,maxVal:31,name:'bt-begin-day',value:arr4?arr4[0]:0
	    });
	    oBtEnd=jqContD.find('.js-bt-end-day').initSelNum({
	    	minVal:0,maxVal:31,name:'bt-end-day',value:arr4?arr4[1]:0
	    });
	    oBtStep=jqContD.find('.js-bt-step-day').initSelNum({
	    	minVal:0,maxVal:31,name:'bt-step-day',value:arr4?arr4[2]:2
	    });

	};

	
});