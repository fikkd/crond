<%@ page import="com.wisoft.framework.common.pojo.Login_Userinfo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	int serverPort = request.getServerPort();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + serverPort + path + "/";
	request.setAttribute("basePath", basePath);
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html class="fixed">
<head lang="en">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>首页</title>
	<script type="text/javascript"> 
		var BASEPATH = '${basePath }';
	</script>
	<link rel="stylesheet" href="${basePath }r/base/fontawesome-4.2.0_ie7/css/font-awesome.min.css?v=${version}" />
	<link rel="stylesheet" href="${basePath }r/common/frame/css/common.css?v=${version}" />
	<script type="text/javascript" src="${basePath }r/common/ECMAScript_ex/ECMAScript_ex.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/base/jQuery-1.10.2/jquery-1.10.2.min.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/base/layer-v2.1/layer.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/common/frame/common.js?v=${version}"></script>
	<script type="text/javascript" src="${basePath }r/project/jm/js/index.js?v=${version}"></script>
</head>
<body>
	<div class="page">
		<div class="pageMain">
			<div class="pageMain" style="padding: 5px;">
				<div class="panel">
					<div class="panel-box">
						<div class="panel">
							<div class="panel-box">
								<div class="clearf">
									<div style="float: left;">
										<button class="btn-mid btn-success" id="newJobBtn">
											<span class="fa fa-plus"></span> 新建
										</button>
										<!-- <button class="btn-mid" id="editJobBtn"><span class="fa fa-edit"></span> 编辑</button> -->
										<button class="btn-mid" id="startJobBtn" >
											<span class="fa fa-check"></span> 启动
										</button>
										<button class="btn-mid" id="startJobBtnAll" >
											<span class="fa fa-check"></span> 全部启动
										</button>
										<button class="btn-mid btn-danger" id="pauseJobBtn" >
											<span class="fa fa-pause"></span> 暂停
										</button>
										<button class="btn-mid btn-danger" id="pauseJobBtnAll" >
											<span class="fa fa-pause"></span> 全部暂停
										</button>
										<button class="btn-mid btn" id="resumeJobBtn" >
											<span class="fa fa-pause"></span> 恢复
										</button>
										<button class="btn-mid btn" id="resumeJobBtnAll" >
											<span class="fa fa-pause"></span> 全部恢复
										</button>
										<button class="btn-mid" id="runJobBtn" >
											<span class="fa fa-search"></span>运行情况
										</button>
									</div>
									<div style="float: right;">
										<input type="text" class="txt-mid" style="width: 200px;" placeholder="任务名称或分组名称" id="queryJobTxt" />
										<button class="btn-mid" id="queryJobBtn">
											<span class="fa fa-search"></span> 查询
										</button>
									</div>
								</div>
								<div class="listtableDiv topBlank" id="jmGrid">
									<table class="listtable" cellspacing="0" cellpadding="0">
										<thead>
											<tr>
												<th style="width: 150px">分组名称</th>
												<th style="width: 150px">任务名称</th>
												<th style="width: 150px">作业类</th>
												<th style="width: 150px">任务类型</th>
												<th style="width: 150px">任务状态</th>
												<th style="width: 150px">操作</th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
								<!--<div class="manu"></div>-->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>