<%@ page import="com.wisoft.framework.common.pojo.Login_Userinfo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%
	String path = request.getContextPath();
	int serverPort = request.getServerPort();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + serverPort + path + "/";
	request.setAttribute("basePath", basePath);
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html class="fixed inframe">
<head lang="en">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>新建任务调度</title>
	<script type="text/javascript">
		var BASEPATH = '${basePath }';
		var id = '${jobDetail.id}', starttime = '${jobDetail.starttime}', endtime = '${jobDetail.endtime}', isjobclass = '${jobDetail.isjobclass}' || 0, trigger_type = '${jobDetail.trigger_type}' || 0, instance_status = '${jobDetail.instance_status}' || 0, isexecuting = '${jobDetail.isexecuting}' || 0, time_limitv = '${jobDetail.time_limit}' || 1//倒计时
		, time_unit = '${jobDetail.time_unit}' == 0 ? 1 : '${jobDetail.time_unit}';//任务id
	</script>
	<link rel="stylesheet" href="${basePath }r/base/zTree_v3/css/zTreeStyle/zTreeStyle.css?v=${version}" type="text/css">
	<link rel="stylesheet" href="${basePath }r/base/fontawesome-4.2.0_ie7/css/font-awesome.min.css?v=${version}" />
	<link rel="stylesheet" href="${basePath }r/common/frame/css/common.css?v=${version}" />
	<script type="text/javascript" src="${basePath }r/base/My97DatePicker/WdatePicker.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/common/ECMAScript_ex/ECMAScript_ex.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/base/jQuery-1.10.2/jquery-1.10.2.min.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/base/layer-v2.1/layer.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/common/frame/common.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/project/jm/js/jmEdit.js?v=${version}"></script>
	<style type="text/css">
		.detailtable>*>tr>*>.numbox {
			width: 50px;
			margin-right: 2px;
		}
	</style>
</head>
<body>
	<div class="page">
		<div class="pageMain">
			<div class="pageMain hasBot">
				<div class="panel">
					<div class="panel-box">
						<form id="groupform">
							<input type="hidden" name="id" value="${jobDetail.id}"> 
							<input type="hidden" name="exception_info" value="${jobDetail.exception_info}"> 
							<input type="hidden" name="job_create_time" value="${jobDetail.job_create_time}">
							<table class="detailtable" cellspacing="0" cellpadding="0">
								<colgroup>
									<col style="width: 120px;" />
									<col />
								</colgroup>
								<tbody>
									<tr>
										<th>任务名</th>
										<td>
											<input name="job_name" value="${jobDetail.job_name}" class="txt-mid" />
										</td>
									</tr>
									<tr>
										<th>任务组名</th>
										<td>
											<input name="job_group" value="${jobDetail.job_group}" class="txt-mid" />
										</td>
									</tr>
									<tr data-bean="bean">
										<!-- 是否启用 Bean 注入 -->
										<th>
											<label class="radio-lab"><input type="checkbox" id="bean">Bean注入</label>
										</th>
										<td>
											<div style="border: solid 1px #ccc;">
												<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
													<colgroup>
														<col style="width: 100px;" />
														<col />
													</colgroup>
													<tbody>
														<tr>
															<th>Bean名</th>
															<td>
																<input name="job_bean_name" value="${jobDetail.job_bean_name}" class="txt-mid" /></td>
														</tr>
														<tr>
															<th>方法名</th>
															<td>
																<input name="job_method_name" value="${jobDetail.job_method_name}" class="txt-mid" />
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</td>
									</tr>
									<tr data-bean="class">
										<th>执行类</th>
										<td>
											<input name="job_class_name" value="${jobDetail.job_class_name}" class="txt-mid" />
										</td>
									</tr>
									<tr data-dispatch="one">
										<!-- 调度类型 -->
										<th>
											<label class="radio-lab"><input type="radio" name="dispatch" value="one" />一次性计划任务</label>
										</th>
										<td>
											<div style="border: solid 1px #ccc;">
												<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
													<colgroup>
														<col style="width: 100px;" />
														<col />
													</colgroup>
													<tbody>
														<tr>
															<th>日期</th>
															<td>
																<input name="starttime" id="starttime" value="${jobDetail.starttime}" class="txt-mid txt-date" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />
															</td>
														</tr>
														<tr data-countdown="countdown">
															<th>
																<label class="radio-lab"><input type="checkbox" id="countDown">倒计时执行</label>
															</th>
															<td>
																<div class="txt-mid numbox" id="time_limit"></div> 
																<select id="time_unit" class="txt-mid" style="width: 50px;">
																	<option value="1">分钟</option>
																	<option value="60">小时</option>
																	<option value="1440">天</option>
																</select> 后执行
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</td>
									</tr>
									<tr data-dispatch="com">
										<th>
											<label class="radio-lab"><input type="radio" name="dispatch" value="com">周期性计划任务</label>
										</th>
										<td>
											<div class="input-group">
												<input name="cron_expression" readonly="readonly" value="${jobDetail.cron_expression}" class="input-group-txt txt-mid" />
												<div id="changeJobCron" class="input-group-btn btn-mid">
													<span class="fa fa-cog"></span>设置
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<th>任务描述</th>
										<td><textarea name="description" rows="3" class="txt">${jobDetail.description}</textarea></td>
									</tr>
								</tbody>
							</table>
						</form>
					</div>
				</div>
			</div>
			<div class="pageBot">
				<div class="pageBot_in">
					<c:if test="${!isView}">
						<button type="button" class="btn-mid btn-submit" data-val="submit">保存</button>
					</c:if>
					<button type="button" class="btn-mid btn-cancel" style="margin-left: .2em;" data-val="cancel">关闭</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>