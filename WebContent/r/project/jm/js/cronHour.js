'use strict';
$(function() {
	var hour,hourZhCN;
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab2', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqContH = $('[data-val="hour"]'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {

	};
	// 保存当前页
	var fSave = function() {
		hour='',hourZhCN='';
		// 获取被选择的值,重新构造cron表达式,构造cron中文表达式
		if ($("input[name='hour']:eq(0):checked").val()) {
			hour = '0';
			hourZhCN = '0时';
		}
		if ($("input[name='hour']:eq(1):checked").val()) {
			hour = '*';
			hourZhCN = '每隔一小时';
		}
		if ($("input[name='hour']:eq(2):checked").val()) {
			hour = jqContH.find('[name="begin"]').val()+'/'+jqContH.find('[name="step"]').val();
			hourZhCN = jqContH.find('[name="begin"]').val() +'时开始, 每隔' + jqContH.find('[name="step"]').val() + '小时';
		}
		if ($("input[name='hour']:eq(3):checked").val()) {
			hour = jqContH.find('[name="between-begin"]').val()+'-'+jqContH.find('[name="between-end"]').val() + '/1';
			hourZhCN = jqContH.find('[name="between-begin"]').val() +'至' + jqContH.find('[name="between-end"]').val() + '小时之间每隔一小时';
		}
		if ($("input[name='hour']:eq(4):checked").val()) {
			hour = jqContH.find('[name="bt-begin"]').val()+'-'+jqContH.find('[name="bt-end"]').val() + '/' + jqContH.find('[name="bt-step"]').val();
			hourZhCN = jqContH.find('[name="bt-begin"]').val() +'至' + jqContH.find('[name="bt-end"]').val() + '时之间每隔' + jqContH.find('[name="bt-step"]').val() + '小时';
		}
		if ($("input[name='hour']:eq(5):checked").val()) {
			var len = jqContH.find("input:checkbox:checked").length;
			if (len==0) {
				jqContH.find("input[type='checkbox'][value='0']").prop("checked",true);				
			}
			$.each(jqContH.find('input:checkbox'),function(){
				if(this.checked){
					hour += $(this).val() + ',';
				}
			});
			hour=hour.replace(/(.*),/g, '$1');
			hourZhCN=hour + '时';			
		}
		console.log('小时\t' + hour+"|"+hourZhCN);
		return hour+"|"+hourZhCN;
	};
	/** ==================== * */
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
		
		hour = oMainApi.cronExpression.split(/\s/g)[2];
		
		//页面初始化时解析cron表达式
		var arr2,arr3,arr4,arr5;
		if (hour=='0') 	
			$("input[name='hour']:eq(0)").attr("checked",'checked');
		if (hour=='*')
			$("input[name='hour']:eq(1)").attr("checked",'checked');
		if (hour.search(/^\d+\/\d+$/g) != -1) {
			$("input[name='hour']:eq(2)").attr("checked",'checked');
			arr2 = hour.split(/\//g);			
		}
		if (hour.search(/^\d+-\d+\/1$/g) != -1) {
			$("input[name='hour']:eq(3)").attr("checked",'checked');
			arr3 = hour.replace(/(\d+)-(\d+)\/1/g,'$1,$2').split(',');
		}
		if (hour.search(/^\d+-\d+\/[^1]$/g) != -1) {
			$("input[name='hour']:eq(4)").attr("checked",'checked');			
			arr4 = hour.replace(/(\d+)-(\d+)\/(\d+)/g,'$1,$2,$3').split(',');
		}
		if (hour.search(/^(\d+,)*\d+$/g) != -1) {			
			$("input[name='hour']:eq(5)").attr("checked",'checked');			
			arr5 = hour.split(',');
			$.each(arr5, function(index, item){
				$('[data-val="hour"]').find("input[type='checkbox'][value='"+item+"']").prop("checked",true);				
			});
		}
		
	    oBegin=jqContH.find('.js-begin-hor').initSelNum({
	        minVal:0,maxVal:24,name:'begin-hor',value:arr2?arr2[0]:0
	    });
	    oStep=jqContH.find('.js-step-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'step-hor',value:arr2?arr2[1]:0
	    });
	    oBetweenBegin=jqContH.find('.js-between-begin-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'between-begin-hor',value:arr3?arr3[0]:0
	    });    
	    oBetweenEnd=jqContH.find('.js-between-end-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'between-end-hor',value:arr3?arr3[1]:0
	    });
	    oBtBegin=jqContH.find('.js-bt-begin-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'bt-begin-hor',value:arr4?arr4[0]:0
	    });
	    oBtEnd=jqContH.find('.js-bt-end-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'bt-end-hor',value:arr4?arr4[1]:0
	    });
	    oBtStep=jqContH.find('.js-bt-step-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'bt-step-hor',value:arr4?arr4[2]:2
	    });
		
		
	};

	

});