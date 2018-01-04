'use strict';
$(function() {
	var week,weekZhCN;
	var oHideParams = $.getHideParams(), oUrlParams = $.getUrlParams();
	var URLS = {};
	var tabVal = 'tab5', // 当前 tab 页标识
	jqTab = $('.js-tabs .tab-cont[data-val="' + tabVal + '"]'), oMainApi, oApi;
	
	var jqContW = $('[data-val="week"]'), oBegin;
	
	// 切换到当前页时的事件
	var fOnSelect = function() {
		
	};
	// 保存当前页
	var fSave = function() {
		week='',weekZhCN='';
		// 获取被选择的值,重新构造cron表达式,构造cron中文表达式
		if ($("input[name='week']:eq(0):checked").val()) {
			week = '?';
		}
		if ($("input[name='week']:eq(1):checked").val()) {
			week = '*';
			weekZhCN = '每隔一周';
		}
		if ($("input[name='week']:eq(2):checked").val()) {
			var b = jqContW.find('[name="index-wek"]').val();			
			var l = $("select:eq(0)").find("option:selected").val();			
			var ltxt = $("select:eq(0)").find("option:selected").text();			
			week = l+'#'+b;
			weekZhCN = '第'+b +'个星期'+ltxt;
		}
		if ($("input[name='week']:eq(3):checked").val()) {
			var b = $("select:eq(1)").find("option:selected").val();
			var btxt = $("select:eq(1)").find("option:selected").text();
			var l = $("select:eq(2)").find("option:selected").val();
			var ltxt = $("select:eq(2)").find("option:selected").text();
			week = b+'-'+l;
			weekZhCN =  '星期'+btxt+'至星期'+ltxt+'之间';
		}
		if ($("input[name='week']:eq(4):checked").val()) {
			var l = $("select:eq(3)").find("option:selected").val();
			var ltxt = $("select:eq(3)").find("option:selected").text();
			week = l+'L';
			weekZhCN = '每月最后一个星期'+ltxt;
		}
		if ($("input[name='week']:eq(5):checked").val()) {
			var len = jqContW.find("input:checkbox:checked").length;
			if (len==0) {
				jqContW.find("input[type='checkbox'][value='0']").prop("checked",true);//如果没有被选择则默认选择第一个				
			}
			$.each(jqContW.find('input:checkbox'),function(){
				if(this.checked) {
					week += $(this).val() + ',';
					weekZhCN += $(this).attr('data-val') + ',';
				}
			});
			week=week.replace(/(.*),/g, '$1');
			weekZhCN=weekZhCN.replace(/(.*),/g, '$1');
		}
		console.log('周\t' + week+"|"+weekZhCN);
		return week+"|"+weekZhCN;
	};
	/** ==================== * */
	// 附加在全局变量上的接口，初始化时由主程序入口调用
	G_TabTool.fnInit[tabVal] = function() {
		oMainApi = G_TabTool.mainApi;
		oApi = G_TabTool.api[tabVal];
		// 为当前 tab 页扩展接口
		oApi.fOnSelect = fOnSelect;// 切换到当前选中页的事件
		oApi.fSave = fSave;
		
		week = oMainApi.cronExpression.split(/\s/g)[5];
		
		//页面初始化时解析cron表达式
		var arr2,arr3,arr4,arr5;
		if (week=='?') 	
			$("input[name='week']:eq(0)").attr("checked",'checked');
		if (week=='*')
			$("input[name='week']:eq(1)").attr("checked",'checked');
		if (week.search(/\d#\d/g) != -1) {
			$("input[name='week']:eq(2)").attr("checked",'checked');
			arr2=week.replace(/(\d)#(\d)/g,'$1,$2').split(',');
			$("select:eq(0)").find("option[value='"+arr2[0]+"']").attr("selected",true);
		}
		if (week.search(/\d-\d/g) != -1) {
			$("input[name='week']:eq(3)").attr("checked",'checked');
			arr3=week.replace(/(\d)-(\d)/g,'$1,$2').split(',');
			$("select:eq(1)").find("option[value='"+arr3[0]+"']").attr("selected",true);
			$("select:eq(2)").find("option[value='"+arr3[1]+"']").attr("selected",true);
		}
		if (week.search(/\dL/g) != -1) {
			$("input[name='week']:eq(4)").attr("checked",'checked');
			arr4=week.replace(/(\d)L/g,'$1');
			$("select:eq(3)").find("option[value='"+arr4+"']").attr("selected",true);
		}
		if (week.search(/^(\d+,)*\d+$/g) != -1) {			
			$("input[name='week']:eq(5)").attr("checked",'checked');			
			arr5 = week.split(',');
			$.each(arr5, function(index, item) {			
				$('[data-val="week"]').find("input[type='checkbox'][value='"+item+"']").prop("checked",true);				
			});
		}
		
		
		// 数字组件
	    oBegin=jqContW.find('.js-index-wek').initSelNum({
	        minVal:1,maxVal:5,name:'index-wek',value:arr2?arr2[1]:1
	    });
	    	   		
	};
	
	
});