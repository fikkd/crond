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
			hour = '*';
			hourZhCN = '每隔一小时';
		}
		if ($("input[name='hour']:eq(1):checked").val()) {
			var b = jqContH.find('[name="begin-hor"]').val();
			var s = jqContH.find('[name="step-hor"]').val();
			hour = b+'/'+s;
			hourZhCN = b+'时开始, 每隔'+s+'小时';
		}
		if ($("input[name='hour']:eq(2):checked").val()) {
			var b = jqContH.find('[name="bt-begin-hor"]').val();
			var l = jqContH.find('[name="bt-end-hor"]').val();
			var s = jqContH.find('[name="bt-step-hor"]').val();
			hour = b+'-'+l+'/'+s;
			hourZhCN = b+'至'+l+'时之间每隔'+s+'小时';
		}
		if ($("input[name='hour']:eq(3):checked").val()) {
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
		var arr1,arr2,arr3,arr4;		
		if (hour=='*')
			jqContH.find("input[name='hour']:eq(0)").attr("checked",'checked');
		if (hour.search(/^\d+\/\d+$/g) != -1) {
			jqContH.find("input[name='hour']:eq(1)").attr("checked",'checked');
			arr1 = hour.split(/\//g);			
		}
		if (hour.search(/^\d+-\d+\/\d+$/g) != -1) {
			jqContH.find("input[name='hour']:eq(2)").attr("checked",'checked');			
			arr2 = hour.replace(/(\d+)-(\d+)\/(\d+)/g,'$1,$2,$3').split(',');
		}
		if (hour.search(/^(\d+,)*\d+$/g) != -1) {			
			jqContH.find("input[name='hour']:eq(3)").attr("checked",'checked');			
			arr3 = hour.split(',');
			$.each(arr3, function(index, item){
				jqContH.find("input[type='checkbox'][value='"+item+"']").prop("checked",true);				
			});
		}
		
	    oBegin=jqContH.find('.js-begin-hor').initSelNum({
	        minVal:0,maxVal:24,name:'begin-hor',value:arr1?arr1[0]:0
	    });
	    oStep=jqContH.find('.js-step-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'step-hor',value:arr1?arr1[1]:0
	    });
	    oBtBegin=jqContH.find('.js-bt-begin-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'bt-begin-hor',value:arr2?arr2[0]:0
	    });
	    oBtEnd=jqContH.find('.js-bt-end-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'bt-end-hor',value:arr2?arr2[1]:0
	    });
	    oBtStep=jqContH.find('.js-bt-step-hor').initSelNum({
	    	minVal:0,maxVal:24,name:'bt-step-hor',value:arr2?arr2[2]:1
	    });
	};
});