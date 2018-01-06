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
			month = '*';
			monthZhCN = '每隔一月';
		}
		if ($("input[name='month']:eq(1):checked").val()) {
			var b=jqContMo.find('[name="begin-mon"]').val();
			var s=jqContMo.find('[name="step-mon"]').val();
			month = b+'/'+s;
			monthZhCN = b+'月开始, 每隔'+s+'月';
		}
		if ($("input[name='month']:eq(2):checked").val()) {
			var b=jqContMo.find('[name="bt-begin-mon"]').val();
			var l=jqContMo.find('[name="bt-end-mon"]').val();
			var s=jqContMo.find('[name="bt-step-mon"]').val();
			month = b+'-'+l+'/'+s;
			monthZhCN = b+'至'+l+'月之间每隔'+s+'月';
		}
		if ($("input[name='month']:eq(3):checked").val()) {
			var len = jqContMo.find("input:checkbox:checked").length;
			if (len==0) {
				jqContMo.find("input[type='checkbox'][value='1']").prop("checked",true);				
			}
			$.each(jqContMo.find('input:checkbox'),function(){
				if(this.checked){
					month += $(this).val() + ',';
				}
			});
			month=month.replace(/(.*),/g, '$1');
			monthZhCN=month + '月';			
		}
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
		
		var arr1,arr2,arr3;
		if (month=='*')
			$("input[name='month']:eq(0)").attr("checked",'checked');
		if (month.search(/^\d+\/\d+$/g) != -1) {
			$("input[name='month']:eq(1)").attr("checked",'checked');
			arr1 = month.split(/\//g);			
		}
		if (month.search(/^\d+-\d+\/\d+$/g) != -1) {
			$("input[name='month']:eq(2)").attr("checked",'checked');			
			arr2 = month.replace(/(\d+)-(\d+)\/(\d+)/g,'$1,$2,$3').split(',');
		}
		if (month.search(/^(\d+,)*\d+$/g) != -1) {			
			$("input[name='month']:eq(3)").attr("checked",'checked');			
			arr3 = month.split(',');
			$.each(arr3, function(index, item){
				$('[data-val="month"]').find("input[type='checkbox'][value='"+item+"']").prop("checked",true);				
			});
		}

		
	    oBegin=jqContMo.find('.js-begin-mon').initSelNum({
	        minVal:0,maxVal:60,name:'begin-mon',value:arr1?arr1[0]:0
	    });
	    oStep=jqContMo.find('.js-step-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'step-mon',value:arr1?arr1[1]:0
	    });
	    oBtBegin=jqContMo.find('.js-bt-begin-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-begin-mon',value:arr2?arr2[0]:0
	    });
	    oBtEnd=jqContMo.find('.js-bt-end-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-end-mon',value:arr2?arr2[1]:0
	    });
	    oBtStep=jqContMo.find('.js-bt-step-mon').initSelNum({
	    	minVal:0,maxVal:60,name:'bt-step-mon',value:arr2?arr2[2]:1
	    });
	};
});