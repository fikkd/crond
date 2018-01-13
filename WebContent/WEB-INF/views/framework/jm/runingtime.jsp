<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%
	String path = request.getContextPath();
	String serverPort = (request.getServerPort() == 80 ? "8080" : String.valueOf(request.getServerPort()));
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + serverPort + path + "/";
	String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + serverPort + "/";
	request.setAttribute("basePath", basePath);
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="renderer" content="webkit" />
	<meta name="_csrf" content="${fn:escapeXml(CSRFToken)}" />
	<title>运行情况</title>
	<script type="text/javascript">
		var BASEPATH = '${basePath}';
	</script>
	<script type="text/javascript" src="${basePath}r/base/jQuery-1.10.2/jquery-1.10.2.min.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath}r/base/layer-v2.1/layer.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath}r/base/My97DatePicker/WdatePicker.js?v=${version}"></script>
	<link rel="stylesheet" href="${basePath}r/base/fontawesome-4.2.0_ie7/css/font-awesome.min.css?v=${version}" />
	<link type="text/css" rel="stylesheet" href="${basePath }r/wisoft/wiFrame/css/common.css" />
	<script type="text/javascript" src="${basePath }r/wisoft/wiFrame/common.js"></script>
	<link type="text/css" rel="stylesheet" href="${basePath}r/project/common/frame/css/common.css?v=${version}" />
	<script type="text/javascript" src="${basePath }r/project/common/frame/common.js"></script>
	<script type="text/javascript" src="${basePath }r/project/jm/js/runingtime.js?v=${version}"></script>
</head>
<body>
	<div class="wrap wrap-inabs hasfoot">
		<div class="wrap-cont">
			<div class="wrap-cont-c">
				<div class="container">
					<form id="pageform">
						<table class="detailtable" cellspacing="0" cellpadding="0">
							<colgroup>
								<col style="width: 100px;" />
								<col />
							</colgroup>
							<tbody>
								<tr>
									<th>任务调度状态</th>
									<td>
										<c:choose>
											<c:when test="${trigger.trigger_state == 'WAITING'}">
												等待中
											</c:when>
											<c:when test="${trigger.trigger_state == 'ACQUIRED'}">
												运行中
										    </c:when>
											<c:when test="${trigger.trigger_state == 'COMPLETE'}">
												已完成
										    </c:when>
											<c:when test="${trigger.trigger_state == 'PAUSED'}">
												暂停
										    </c:when>
											<c:otherwise>
												未运行
											</c:otherwise>
										</c:choose></td>
									<th>任务开始时间</th>
									<td>${trigger.start_time}</td>
								</tr>
								<tr>
									<th>上次触发时间</th>
									<td>${trigger.pre_fire_time}</td>
									<th>下次触发时间</th>
									<td>${trigger.next_fire_time}</td>
								</tr>
								<tr>
									<th>任务结束时间</th>
									<td>${trigger.end_time}</td>
									<th></th>
									<td></td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
			</div>
		</div>
		<div class="wrap-foot">
			<div class="btns-ctrl js-fbtns">
				 <button type="button" class="btn btn-cancel" style="margin-left:.2em;" data-val="cancel">关闭</button>
			</div>
		</div>
	</div>
</body>
</html>