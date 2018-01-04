'use strict';
$(function() {
	var year,yearZhCN;
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab6', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	var date = new Date();
	var cyear = date.getFullYear();
	
	var jqContN = $('[data-val="year"]'), oBegin, oStep, oBetweenBegin, oBetweenEnd, oBtBegin, oBtEnd, oBtStep;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {
		
	};
	// 保存当前页
	var fSave = function() {
		year='',yearZhCN='';
		// 获取被选择的值,重新构造cron表达式,构造cron中文表达式
		if ($("input[name='year']:eq(0):checked").val()) {
			year = '*';
			yearZhCN = '每年';
		}
		if ($("input[name='year']:eq(1):checked").val()) {
			year = '*';
			yearZhCN = '每隔一年';
		}
		if ($("input[name='year']:eq(2):checked").val()) {
			var b = jqContN.find('[name="begin-yer"]').val();
			var l = jqContN.find('[name="step-yer"]').val();			
			year = b+'/'+l;
			yearZhCN = b+'年开始每隔'+l+'年';
		}
		if ($("input[name='year']:eq(3):checked").val()) {
			year = $('#yer3').val();
			if (year.search(/^(\d+,)*\d+$/g) == -1) {
				$.showMsg("年份设置不符合规范");
				return false;
			}
			yearZhCN = year + '年';
		}
		if ($("input[name='year']:eq(4):checked").val()) {
			var b = jqContN.find('[name="between-begin-yer"]').val();
			var l = jqContN.find('[name="between-end-yer"]').val();
			year = b+'-'+l+ '/1';
			yearZhCN = b+'至'+l+'年每隔一年';
		}
		if ($("input[name='year']:eq(5):checked").val()) {
			var a1 = jqContN.find('[name="bt-begin-yer"]').val();
			var a2 = jqContN.find('[name="bt-end-yer"]').val();
			var a3 = jqContN.find('[name="bt-step-yer"]').val();
			year = a1+'-'+a2+'/'+a3 ;
			yearZhCN = a1+'至'+a2+'年每隔'+a3+'年';
		}
		console.log('年\t' + year+"|"+yearZhCN);
		return year+"|"+yearZhCN;
	};
	/** ==================== * */
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
		
		year = oMainApi.cronExpression.split(/\s/g)[6];
		
		//页面初始化时解析cron表达式
		var arr2,arr4,arr5;
		if (year=='?') 	
			$("input[name='year']:eq(0)").attr("checked",'checked');
		if (year=='*')
			$("input[name='year']:eq(1)").attr("checked",'checked');
		if (year.search(/^\d+\/\d+$/g) != -1) {
			$("input[name='year']:eq(2)").attr("checked",'checked');
			arr2 = year.split(/\//g);			
		}
		if (year.search(/^(\d+,)*\d+$/g) != -1) {			
			$("input[name='year']:eq(3)").attr("checked",'checked');	
			$('#yer3').val(year);
		}		
		if (year.search(/^\d+-\d+\/1$/g) != -1) {
			$("input[name='year']:eq(4)").attr("checked",'checked');
			arr4 = year.replace(/(\d+)-(\d+)\/1/g,'$1,$2').split(',');
		}
		if (year.search(/^\d+-\d+\/[^1]$/g) != -1) {
			$("input[name='year']:eq(5)").attr("checked",'checked');			
			arr5 = year.replace(/(\d+)-(\d+)\/(\d+)/g,'$1,$2,$3').split(',');
		}
		
		
		// 数字组件
	    oBegin=jqContN.find('.js-begin-yer').initSelNum({
	        minVal:cyear,name:'begin-yer',value:arr2?arr2[0]:cyear
	    });
	    oStep=jqContN.find('.js-step-yer').initSelNum({
	    	minVal:1,name:'step-yer',value:arr2?arr2[1]:1
	    });
	    oBetweenBegin=jqContN.find('.js-between-begin-yer').initSelNum({
	    	minVal:cyear,name:'between-begin-yer',value:arr4?arr4[0]:cyear
	    });    
	    oBetweenEnd=jqContN.find('.js-between-end-yer').initSelNum({
	    	minVal:cyear+1,name:'between-end-yer',value:arr4?arr4[1]:cyear+1
	    });
	    oBtBegin=jqContN.find('.js-bt-begin-yer').initSelNum({
	    	minVal:cyear,name:'bt-begin-yer',value:arr5?arr5[0]:year
	    });
	    oBtEnd=jqContN.find('.js-bt-end-yer').initSelNum({
	    	minVal:cyear+1,name:'bt-end-yer',value:arr5?arr5[1]:cyear+1
	    });
	    oBtStep=jqContN.find('.js-bt-step-yer').initSelNum({
	    	minVal:2,name:'bt-step-yer',value:arr5?arr5[2]:2
	    });		
	};

});