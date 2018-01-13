//计算包含中英文字符混合的字符串的长度
function getZhStrLength(str) {
	var totalLength = 0;
	if(!!str) {
		var list = str.split("");
		for(var i = 0; i < list.length; i++) {
			var s = list[i];
			if (s.match(/[\u0000-\u00ff]/g)) {
				//半角
			    totalLength += 1; 
			} else if (s.match(/[\u4e00-\u9fa5]/g)) {
				//中文  
			    totalLength += 2;
			} else if (s.match(/[\uff00-\uffff]/g)) {
				//全角 
			    totalLength += 2;
			}
		}
	}
	return totalLength;
}
/* 自定义验证规则 */
$(document).ready(function() {
	// 手机号码验证
	jQuery.validator.addMethod("isMobile", function(value, element){
		var length = value.length;
//		var mobileRex = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		var mobileRex = /^(1[3|4|5|8][0-9]{1})+\d{8}$/;
		return this.optional(element) || (length == 11 && mobileRex.test(value));
	}, "手机号码不正确!");
	
	// 电话号码验证       
	jQuery.validator.addMethod("isTel", function(value, element){       
		var telRex = /^(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;    //电话号码格式010-12345678   
		return this.optional(element) || (telRex.test(value));       
	}, "电话号码不正确(区号+电话)!");   
	   
	 // 联系电话(手机/电话皆可)验证   
	jQuery.validator.addMethod("isPhone", function(value,element){   
		var length = value.length;   
		var mobileRex = /^(1[3|4|5|8][0-9]{1})+\d{8}$/;   
		var telRex = /^(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
		return this.optional(element) || (telRex.test(value) || (length == 11 && mobileRex.test(value)));   
	 }, "电话号码不正确!");

	// 字符最大长度验证（一个中文字符长度为2）
	jQuery.validator.addMethod("ZhStrMaxLength", function(value, element, param){
		var length = getZhStrLength(value);
		return this.optional(element) || (length <= param);
	}, $.validator.format("字符个数大于{0}!"));

	// 字符最小长度验证（一个中文字符长度为2）
	jQuery.validator.addMethod("ZhStrMinLength", function(value, element, param){
		var length = getZhStrLength(value);
		return this.optional(element) || (length >= param);
	}, $.validator.format("字符个数小于{0}!"));
	
	// 字符长度区间验证（一个中文字符长度为2）不能在用class属性定义验证规则时使用,取不到区间的值
	jQuery.validator.addMethod("ZhStrRangeLength", function(value, element, param){       
		var length = getZhStrLength(value);
		return this.optional(element) || (length >= param[0] && length <= param[1]);       
	}, "输入的字符个数在{0}-{1}之间");
	
	// 字符验证       
	jQuery.validator.addMethod("strCheck", function(value, element){       
		return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);       
	}, "只能包括中文字、英文字母、数字和下划线");

	// 字符验证       
	jQuery.validator.addMethod("strENCheck", function(value, element){       
		return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);       
	}, "只能包括英文字母、数字");   
	   
	 // 身份证号码验证       
	jQuery.validator.addMethod("isIdCardNo", function(value, element){
		var idCardNoRex_15 = /^[1-9]\d{7}((0[1-9])|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
		var idCardNoRex_18 = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}(x|X))$/;
		return this.optional(element) || idCardNoRex_15.test(value) || idCardNoRex_18.test(value);       
	}, "身份证号码不正确");
	      
	 // 邮政编码验证       
	jQuery.validator.addMethod("isZipCode", function(value, element){       
		var zipCodeRex = /^[0-9]{6}$/;       
		return this.optional(element) || (zipCodeRex.test(value));       
	}, "邮政编码不正确");

    $.validator.addMethod("notnull", function (value, element) {
        if (!value) return true;
        return !$(element).hasClass("l-text-field-null");
    }, "不能为空");

    // 汉字
    jQuery.validator.addMethod("chcharacter", function (value, element) {
        var tel = /^[\u4e00-\u9fa5]+$/;
        return this.optional(element) || (tel.test(value));
    }, "请输入汉字");

    // QQ
    jQuery.validator.addMethod("qq", function (value, element) {
        var tel = /^[1-9][0-9]{4,}$/;
        return this.optional(element) || (tel.test(value));
    }, "请输入正确的QQ");

    // 用户名
    jQuery.validator.addMethod("username", function (value, element) {
        return this.optional(element) || /^[a-zA-Z][a-zA-Z0-9_]+$/.test(value);
    }, "用户名格式不正确");

    // 录入电阻值测试
    jQuery.validator.addMethod("isDianZu", function (value, element) {
    	if("∞"===value){
    		return true;
    	} else {
    		return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
    	}
    }, "电阻值只能为数字或者∞");
    $.validator.messages = $.extend($.validator.messages,{
    	required:"此为必填字段。",
    	digits: "请输入一个整数。",
		number: "请输入合法的数字。"
    });
});


