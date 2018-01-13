<%@ page import="com.wisoft.framework.common.pojo.Login_Userinfo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%
	String path = request.getContextPath();
	int serverPort = request.getServerPort();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + serverPort + path + "/";
	request.setAttribute("basePath", basePath);
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="renderer" content="webkit" />
	<meta name="_csrf" content="${fn:escapeXml(CSRFToken)}" />
	<title>新建任务调度</title>	
	<script type="text/javascript" src="${basePath}r/base/jQuery-1.10.2/jquery-1.10.2.min.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath}r/base/layer-v2.1/layer.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath}r/base/My97DatePicker/WdatePicker.js?v=${version}"></script>
    <link rel="stylesheet" href="${basePath}r/base/fontawesome-4.2.0_ie7/css/font-awesome.min.css?v=${version}"/>
    <link type="text/css" rel="stylesheet" href="${basePath }r/wisoft/wiFrame/css/common.css"/>
    <script type="text/javascript" src="${basePath }r/wisoft/wiFrame/common.js"></script>
    <link type="text/css" rel="stylesheet" href="${basePath}r/project/common/frame/css/common.css?v=${version}"/>
    <script type="text/javascript" src="${basePath }r/project/common/frame/common.js"></script>
	<script type="text/javascript" src="${basePath }r/project/jm/js/jmEdit.js?v=${version}"></script>
	<style type="text/css">
		.detailtable>*>tr>*>.numbox {
			width: 50px;
			margin-right: 2px;
		}
		.txt-del { 
			background:url("${basePath}r/project/index/images/remove.png") no-repeat scroll right center transparent; 
		}
	</style>
	<script type="text/javascript">
		var BASEPATH = '${basePath }';
		var id = '${jobDetail.id}', 
		trigger_type = '${jobDetail.trigger_type}' || 0,
		isNew = '${isNew}',
		isEdit = '${isEdit}',
		isView = '${isView}';		
	</script>
</head>
<body>
	<div class="wrap wrap-inabs hasfoot">
        <div class="wrap-cont">
            <div class="wrap-cont-c">
                <div class="container">
                    <form id="groupform">
						<input type="hidden" name="id" value="${jobDetail.id}"> 
						<input type="hidden" name="exception_info" value="${jobDetail.exception_info}"> 
						<input type="hidden" name="job_create_time" value="${jobDetail.job_create_time}">
						<input type="hidden" name="impljob" value="${jobDetail.impljob}">
						<input type="hidden" name="version" value="${jobDetail.version}">
						<table class="detailtable" cellspacing="0" cellpadding="0">
							<colgroup>
								<col style="width: 130px;" />
								<col />
							</colgroup>
							<tbody>
								<tr>
									<th>任务名</th>
									<td>
										<input name="job_name" value="${jobDetail.job_name}" class="txt" placeholder="检查数据任务"/>
									</td>
								</tr>
								<tr>
									<th>任务组名</th>
									<td>
										<input name="job_group" value="${jobDetail.job_group}" class="txt" placeholder="检查组"/>
									</td>
								</tr>
								
								
								<c:if test="${isNew }">
									<tr data-bean="bean">
										<th>
											<label class="radio-lab"><input type="radio" name="ctype" data-val="ctype" value="general">普通方式</label>																			
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
																<input name="job_bean_name"  readonly="readonly" value="${jobDetail.job_bean_name}" class="txt" placeholder="jaxyJM" />
															</td>
														</tr>
														<tr>
															<th>方法名</th>
															<td>
																<input name="job_method_name" readonly="readonly" value="${jobDetail.job_method_name}" class="txt" placeholder="saveJM"/>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</td>
									</tr>			
								</c:if>
								<c:if test="${(isEdit || isView) && !empty jobDetail.job_bean_name }">
									<tr data-bean="bean">
										<th>
											<label class="radio-lab">普通方式</label>																			
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
																<input name="job_bean_name"  readonly="readonly" value="${jobDetail.job_bean_name}" class="txt" placeholder="jaxyJM" />
															</td>
														</tr>
														<tr>
															<th>方法名</th>
															<td>
																<input name="job_method_name" readonly="readonly" value="${jobDetail.job_method_name}" class="txt" placeholder="saveJM"/>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</td>
									</tr>			
								</c:if>
								
								
								<c:if test="${isNew }">
									<tr data-bean="class">
										<th>
											<label class="radio-lab"><input type="radio" name="ctype" data-val="ctype" value="standard">标准方式</label>																	
										</th>
										<td>
											<input name="job_class_name" readonly="readonly" value="${jobDetail.job_class_name}" class="txt" placeholder="com.wisoft.framework.jm.JaxyJM"/>
										</td>
									</tr>									
								</c:if>		
								<c:if test="${(isEdit || isView) && !empty jobDetail.job_class_name }">
									<tr data-bean="class">
										<th>										
											<label class="radio-lab">标准方式</label>							
										</th>
										<td>
											<input name="job_class_name" readonly="readonly" value="${jobDetail.job_class_name}" class="txt" placeholder="com.wisoft.framework.jm.JaxyJM"/>
										</td>
									</tr>									
								</c:if>			
								
								<c:if test="${isNew || isEdit}">
									<tr data-dispatch="one">
										<!-- 调度类型 -->
										<th>
											<label class="radio-lab"><input type="radio" name="dispatch" data-val="dispatch" value="one" />一次性计划任务</label>
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
															<th>执行时间</th>
															<td>
																<div style="position: relative;width: 100%;">
																	<div name="exectime"  readonly="readonly" class="txt txt-date" style="width: 100%;" >${jobDetail.exectime}</div>
																	<c:if test="${isNew || isEdit }">
																		<div class="txt-del" style="width: 30px;height: 20px;position: absolute;right: 40px;top: 5px;"></div>																																
																	</c:if>												
																</div>
															</td>
														</tr>
														<tr data-countdown="countdown">
															<th>
																<label class="radio-lab"><input type="checkbox" id="countDown">倒计时间</label>
															</th>
															<td>
																<div class="txt numbox" style="width: 70px;" id="time_limit"></div> 
																<select id="time_unit" class="txt" style="width: 70px;">
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
								</c:if>
								<c:if test="${isView && !empty jobDetail.exectime}">
									<tr data-dispatch="one">
										<!-- 调度类型 -->
										<th>
											<label class="radio-lab">一次性计划任务</label>
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
															<th>执行时间</th>
															<td>
																<div style="position: relative;width: 100%;">
																	<div name="exectime"  readonly="readonly" class="txt txt-date" style="width: 100%;" >${jobDetail.exectime}</div>
																	<c:if test="${isNew || isEdit }">
																		<div class="txt-del" style="width: 30px;height: 20px;position: absolute;right: 40px;top: 5px;"></div>																																
																	</c:if>												
																</div>
															</td>
														</tr>														
													</tbody>
												</table>
											</div>
										</td>
									</tr>
								</c:if>
									
									
									
								<c:if test="${isNew || isEdit}">
									<tr data-dispatch="com">
										<th>
											<label class="radio-lab"><input type="radio" name="dispatch"  data-val="dispatch" value="com">周期性计划任务</label>
										</th>
										<td>
											<div style="border: solid 1px #ccc;" id="tmp">
												<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
													<colgroup>
														<col style="width: 100px;" />
														<col />
													</colgroup>
													<tbody>
														<tr>
															<th>设置周期</th>
															<td >
																<input name="cron_expression" type="hidden" value="${jobDetail.cron_expression}">
																<div style="position: relative;width: 100%;">
						                                            <div name="cron_zh_cn" readonly="readonly" class="txt txt-date" style="width: 100%;" title="${jobDetail.cron_zh_cn}">${jobDetail.cron_zh_cn}</div>				
						                                        </div>
															</td>
														</tr>
														<tr>
															<th>开始时间</th>
															<td>
																<div style="position: relative;width: 100%;">
																	<div name="stime"  readonly="readonly" class="txt txt-date" style="width: 100%;" >${jobDetail.starttime}</div>
																	<c:if test="${isNew || isEdit }">
																		<div class="txt-del" style="width: 30px;height: 20px;position: absolute;right: 40px;top: 5px;"></div>																																
																	</c:if>														
																</div>
															</td>
														</tr>
														<tr>
															<th>结束时间</th>
															<td>
																<div style="position: relative;width: 100%;">
																	<div name="etime"  readonly="readonly" class="txt txt-date" style="width: 100%;" >${jobDetail.endtime}</div>
																	<c:if test="${isNew || isEdit }">
																		<div class="txt-del" style="width: 30px;height: 20px;position: absolute;right: 40px;top: 5px;"></div>																																
																	</c:if>														
																</div>
															</td>
														</tr>														
													</tbody>
												</table>
											</div>
										</td>
									</tr>
								</c:if>
								
								<c:if test="${isView && !empty jobDetail.cron_zh_cn}">
									<tr data-dispatch="com">
										<th>
											<label class="radio-lab">周期性计划任务</label>
										</th>
										<td>
											<div style="border: solid 1px #ccc;" id="tmp">
												<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
													<colgroup>
														<col style="width: 100px;" />
														<col />
													</colgroup>
													<tbody>
														<tr>
															<th>设置周期</th>
															<td >
																<input name="cron_expression" type="hidden" value="${jobDetail.cron_expression}">
																<div style="position: relative;width: 100%;">
						                                            <div name="cron_zh_cn" readonly="readonly" class="txt txt-date" style="width: 100%;" title="${jobDetail.cron_zh_cn}">${jobDetail.cron_zh_cn}</div>				
						                                        </div>
															</td>
														</tr>
														<tr>
															<th>开始时间</th>
															<td>
																<div style="position: relative;width: 100%;">
																	<div name="stime"  readonly="readonly" class="txt txt-date" style="width: 100%;" >${jobDetail.starttime}</div>
																	<c:if test="${isNew || isEdit }">
																		<div class="txt-del" style="width: 30px;height: 20px;position: absolute;right: 40px;top: 5px;"></div>																																
																	</c:if>											
																</div>
															</td>
														</tr>
														<tr>
															<th>结束时间</th>
															<td>
																<div style="position: relative;width: 100%;">
																	<div name="etime"  readonly="readonly" class="txt txt-date" style="width: 100%;" >${jobDetail.endtime}</div>
																	<c:if test="${isNew || isEdit }">
																		<div class="txt-del" style="width: 30px;height: 20px;position: absolute;right: 40px;top: 5px;"></div>																																
																	</c:if>
																</div>
															</td>
														</tr>														
													</tbody>
												</table>
											</div>
										</td>
									</tr>
								</c:if>
								
							<%-- 	
								<tr>
									<th>任务描述</th>
									<td><textarea name="description" class="txt" placeholder="这是一个检查数据的任务">${jobDetail.description}</textarea></td>
								</tr> 
							--%>
							</tbody>
						</table>
					</form>
                </div>
            </div>
        </div>
        <div class="wrap-foot">
            <div class="btns-ctrl js-fbtns">
                <c:if test="${isNew || isEdit }">
					<button type="button" class="btn btn-success" data-val="submit">保存</button>					
				</c:if>
				<c:if test="${isNew }">
					<button type="button" class="btn btn-success" data-val="submitAndFired">保存并启动</button>					
				</c:if>
				<button type="button" class="btn btn-cancel" style="margin-left: .2em;" data-val="cancel">关闭</button>
            </div>
       	</div>
    </div>	
</body>
</html>