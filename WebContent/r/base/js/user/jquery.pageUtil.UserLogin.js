$(function() {
	var userNameInput = $("#userName");
	var passWordInput = $("#passWord");
	var checkCodeInput = $("#checkCode");
	// 表单输入框焦点样式变化处理函数注册
	$("input.login-text").focus(function() {
		var parentNode = $(this).parent();
		var fieldBgLabel = parentNode.siblings("label.field-bg-label");
		parentNode.addClass("login-form-item-input-focus");
//		parentNode.siblings("label.field-bg-label").addClass("field-bg-label-focus");
		if(!fieldBgLabel.hasClass("field-bg-label-hide")) {
			fieldBgLabel.addClass("field-bg-label-hide");
		}
	}).blur(function() {
		var parentNode = $(this).parent();
		var fieldBgLabel = parentNode.siblings("label.field-bg-label");
		parentNode.removeClass("login-form-item-input-focus");
//		parentNode.siblings("label.field-bg-label").removeClass("field-bg-label-focus");
		if (fieldBgLabel.hasClass("field-bg-label-hide") && "" === $(this).val()) {
			fieldBgLabel.removeClass("field-bg-label-hide");
		}
	});
	// 页面加载按后让用户名输入框获的焦点
	if (userNameInput.val()) {
		userNameInput.parent().siblings("label.field-bg-label").addClass("field-bg-label-hide");
		passWordInput.focus();
	} else {
		userNameInput.focus();
	}
	// 注册密码输入框大写锁定键事件处理
	detectCapsLock();
	// 注册表单输入事件处理函数  用户登陆框,密码框进行输入
//	if (checkBrowserIsMSIE()) {
//		$("input.login-text").filter(".login-form-username,.login-form-password").bind("propertychange", formItemInputHandle);
//	} else {
//		$("input.login-text").filter(".login-form-username,.login-form-password").bind("input", formItemInputHandle);
//	}
	// 用户名输入框回车事件注册
	userNameInput.keydown(function(event) {
		if (event.keyCode === 13) {
			passWordInput.focus();
			return false;
		}
	});
	// 密码框回车事件注册
	passWordInput.keydown(function(event) {
		if (event.keyCode === 13) {
			checkCodeInput.focus();
			return false;
		}
	});
	checkCodeInput.keydown(function(event) {
		if (event.keyCode === 13) {
			$("#submitBtn").click();
			return false;
		}
	});
	var checkCodeImgNode = $("#checkCodeImg").click(function(){
		changeCheckCode($(this));
	});
	$("#checkCodeChangeBtn").click(function(){
		changeCheckCode(checkCodeImgNode);
		return false;
	});
	// 登陆按钮处理时间注册
	$("#submitBtn").click(function() {
		doLogin();
		return false;
	});
//	labelClassByItemInput(userNameInput);
});
// 变更验证码
function changeCheckCode(checkCodeImgNode) {
	checkCodeImgNode.hide().attr('src', 'user.do?event=generateCaptcha&' + Math.floor(Math.random()*100)).fadeIn();
}
// 给IE注册事件
function addIEInputChangeEvent(element, handle) {
	element.onpropertychange = handle;
}
// 检测浏览器是否为IE
function checkBrowserIsMSIE() {
	return ($.browser.msie && ($.browser.version < 9.0) && !$.support.style);
}
// 表单项输入处理函数
//function formItemInputHandle(event) {
//	labelClassByItemInput($(this));
//}
// 表单输入提示Label样式变更处理
function labelClassByItemInput(inputNode) {
	var inputVal = inputNode.val();
	if (inputVal !== "") {
		inputNode.parent().siblings("label.field-bg-label").addClass("field-bg-label-hide");
	} else {
		inputNode.parent().siblings("label.field-bg-label").removeClass("field-bg-label-hide");
	}
}
// 登陆处理
function doLogin() {
	var userNameInput = $("#userName");
	var passWordInput = $("#passWord");
	var checkCodeInput = $("#checkCode");
	var userName = userNameInput.val();
	var passWord = passWordInput.val();
	var checkCode = checkCodeInput.val();
	if (!userName) {
		showLoginErrorMsg("账号不能为空!");
		userNameInput.focus();
		return;
	}
	if (!passWord) {
		showLoginErrorMsg("密码不能为空!");
		passWordInput.focus();
		return;
	}
	if (!checkCode) {
		showLoginErrorMsg("验证码不能为空!");
		checkCodeInput.focus();
		return;
	}
	$.ajax({
		type : 'post', cache : false, dataType : 'json', url : $("#action").val(),
		data : [ 
			{name: 'event', value: 'login' }, 
			{name: 'userName', value: userName }, 
			{name: 'passWord', value: passWord },
			{name: 'checkCode', value: checkCode }
		],
		success : function(result) {
			if (result) {
				if (result.success) {
					if (result.data && result.data.fromUrl) {
						location.href = decodeURIComponent(result.data.fromUrl);
					} else {
						location.reload();
					}
				} else {
					showLoginErrorMsg(result.msg);
					clearPswAndHideLoading();
				}
			} else {
				showLoginErrorMsg("系统异常,请与管理员联系!");
				clearPswAndHideLoading();
			}
		},
		error : function() {
			showLoginErrorMsg("系统异常,请与管理员联系!");
			clearPswAndHideLoading();
		},
		beforeSend : function() {
			PAGE_UTIL.showLoading("正在登陆中,请稍后...");
			$("#submitBtn").prop("disabled", true);
		},
		complete : function() {
			$("#submitBtn").prop("disabled", false);
		}
	});
	
	function clearPswAndHideLoading(){
	    $("#checkCodeChangeBtn").click();
		passWordInput.val("");
		checkCodeInput.val("");
		PAGE_UTIL.hideLoading();
		passWordInput.focus();
	}
}

function showLoginErrorMsg(errMsg) {
	var formMsgNode = $("#loginFormMsgPanel > p.error");
	formMsgNode.text(errMsg);
	formMsgNode.show();
}

function detectCapsLock(event) {
	$(window).bind("capsOn", function(event) {
		if ($("#passWord:focus").length > 0) {
			$("#loginFormPswCapsLockTip").show();
		}
	});
	$(window).bind("capsOff capsUnknown", function(event) {
		$("#loginFormPswCapsLockTip").hide();
	});
//	$("#passWord").bind("focusout", function(event) {
//		$("#loginFormPswCapsLockTip").hide();
//	});
	$("#passWord").bind("focusin", function(event) {
		if ($(window).capslockstate("state") === true) {
			$("#loginFormPswCapsLockTip").show();
		}
	});
	$(window).capslockstate();
};