'use strict';
$(function() {
	var month,monthZhCN;
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab4', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqContMo = $('[data-val="month"]'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {

	};
	// 保存当前页
	var fSave = function() {
		month='',monthZhCN='';
		// 获取被选择的值
		if ($("input[name='month']:eq(0):checked").val()) {
			month = '?';
			monthZhCN = '每隔一月';
		}
		if ($("input[name='month']:eq(1):checked").val()) {
			month = '*';
			monthZhCN = '每隔一月';
		}
		if ($("input[name='month']:eq(2):checked").val()) {
			month = jqContMo.find('[name="begin"]').val()+'/'+jqContMo.find('[name="step"]').val();
			monthZhCN = jqContMo.find('[name="begin"]').val() +'月开始, 每隔' + jqContMo.find('[name="step"]').val() + '月';
		}
		if ($("input[name='month']:eq(3):checked").val()) {
			month = jqContMo.find('[name="between-begin"]').val()+'-'+jqContMo.find('[name="between-end"]').val() + '/1';
			monthZhCN = jqContMo.find('[name="between-begin"]').val() +'至' + jqContMo.find('[name="between-end"]').val() + '月之间每隔一月';
		}
		if ($("input[name='month']:eq(4):checked").val()) {
			month = jqContMo.find('[name="bt-begin"]').val()+'-'+jqContMo.find('[name="bt-end"]').val() + '/' + jqContMo.find('[name="bt-step"]').val();
			monthZhCN = jqContMo.find('[name="bt-begin"]').val() +'至' + jqContMo.find('[name="bt-end"]').val() + '月之间每隔' + jqContMo.find('[name="bt-step"]').val() + '月';
		}
		if ($("input[name='month']:eq(5):checked").val()) {
			var len = jqContMo.find("input:checkbox:checked").length;
			if (len==0) {
				jqContMo.find("input[type='checkbox'][value='0']").prop("checked",true);				
			}
			$.each(jqContMo.find('input:checkbox'),function(){
				if(this.checked){
					month += $(this).val() + ',';
				}
			});
			month=month.replace(/(.*),/g, '$1');
			monthZhCN=month + '月';			
		}
		console.log('月\t' + month+"|"+monthZhCN);
		
		return month+"|"+monthZhCN;
	};
	/** ==================== * */
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
		
		month = oMainApi.cronExpression.split(/\s/g)[4];
		
		var arr2,arr3,arr4,arr5;
		if (month=='0') 	
			$("input[name='month']:eq(0)").attr("checked",'checked');
		if (month=='*')
			$("input[name='month']:eq(1)").attr("checked",'checked');
		if (month.search(/^\d+\/\d+$/g) != -1) {
			$("input[name='month']:eq(2)").attr("checked",'checked');
			arr2 = month.split(/\//g);			
		}
		if (month.search(/^\d+-\d+\/1$/g) != -1) {
			$("input[name='month']:eq(3)").attr("checked",'checked');
			arr3 = month.replace(/(\d+)-(\d+)\/1/g,'$1,$2').split(',');
		}
		if (month.search(/^\d+-\d+\/[^1]$/g) != -1) {
			$("input[name='month']:eq(4)").attr("checked",'checked');			
			arr4 = month.replace(/(\d+)-(\d+)\/(\d+)/g,'$1,$2,$3').split(',');
		}
		if (month.search(/^(\d+,)*\d+$/g) != -1) {			
			$("input[name='month']:eq(5)").attr("checked",'checked');			
			arr5 = month.split(',');
			$.each(arr5, function(index, item){
				$('[data-val="month"]').find("input[type='checkbox'][value='"+item+"']").prop("checked",true);				
			});
		}

		
	    oBegin=jqContMo.find('.js-begin-mon').initSelNum({
	        minVal:0,maxVal:60,name:'begin-mon',value:arr2?arr2[0]:0
	    });
	    oStep=jqContMo.find('.js-step-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'step-mon',value:arr2?arr2[1]:0
	    });
	    oBetweenBegin=jqContMo.find('.js-between-begin-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'between-begin-mon',value:arr3?arr3[0]:0
	    });    
	    oBetweenEnd=jqContMo.find('.js-between-end-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'between-end-mon',value:arr3?arr3[1]:0
	    });
	    oBtBegin=jqContMo.find('.js-bt-begin-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-begin-mon',value:arr4?arr4[0]:0
	    });
	    oBtEnd=jqContMo.find('.js-bt-end-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-end-mon',value:arr4?arr4[1]:0
	    });
	    oBtStep=jqContMo.find('.js-bt-step-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-step-mon',value:arr4?arr4[2]:2
	    });

		
	};

	
});