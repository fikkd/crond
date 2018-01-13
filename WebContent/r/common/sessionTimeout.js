/**
 * 默认的session过期处理，主要针对AJAX请求
 * 可以重写该函数实现自定义的session过期处理
 * 
 */
function ajaxCompleteFun(xhr, status) {
	var sessionStatus = xhr.getResponseHeader('sessionstatus');
	if (sessionStatus == 'timeout') {
		var u = top.location.href;
		var targetUrl = u.substring(0,u.lastIndexOf("/"))+"/login.jsp";//跳转到登陆界面
		console.log(targetUrl);
		var yes = confirm('session已过期, 请重新登录.');
		if (yes) {
			top.location.href = targetUrl;
		}
	}
}
$.ajaxSetup({
	type : 'POST',
	complete : ajaxCompleteFun
});
$.ajaxSetup({
	type : 'GET',
	complete : ajaxCompleteFun
});
