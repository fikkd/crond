<%@ page import="com.wisoft.framework.common.pojo.Login_Userinfo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	int serverPort = request.getServerPort();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+serverPort +path+"/";
    request.setAttribute("basePath",basePath);
%>
<!DOCTYPE html>
<html class="fixed inframe">
<head lang="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>周期性计划任务详细设置</title>
    <script type="text/javascript">
        var BASEPATH='${basePath }';
        var zxpl=1;
        var cron='${cron}';
        var endtimev='${endtime}';
        var starttimev='${starttime}';
    </script>
    <link rel="stylesheet" href="${basePath }r/base/fontawesome-4.2.0_ie7/css/font-awesome.min.css?v=${version}" />
    <link rel="stylesheet" href="${basePath }r/common/frame/css/common.css?v=${version}" />
    <script type="text/javascript" src="${basePath }r/base/My97DatePicker/WdatePicker.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/common/ECMAScript_ex/ECMAScript_ex.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/base/jQuery-1.10.2/jquery-1.10.2.min.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/base/layer-v2.1/layer.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/common/frame/common.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/project/jm/js/jobCron-2.js?v=${version}"></script>
    <style type="text/css">
        .detailtable>*>tr>*>.numbox{ width:50px; margin-right:2px;}
    </style>
</head>
<body>
	<div class="page">
		<div class="pageMain">
			<div class="pageMain hasBot">
				<div class="panel">
					<div class="panel-box">
						<form id="groupform">
							<table class="detailtable" cellspacing="0" cellpadding="0">
								<colgroup>
									<col />
								</colgroup>
								<tbody>
									<tr>
										<td>
											<div style="border: solid 1px #ccc;">
												<div style="border-bottom: solid 1px #ccc; text-align: center;">频率</div>
												<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
													<colgroup>
														<col style="width: 100px;" />
														<col />
													</colgroup>
													<tbody>
														<tr>
															<th>执行</th>
															<td>
																<label class="radio-lab" for="zlpl_1"><input type="radio" name="zlpl" id="zlpl_1" value="1" />每天</label> 
																<label class="radio-lab" for="zlpl_2"><input type="radio" name="zlpl" id="zlpl_2" value="2" />每月</label> 
																<label class="radio-lab" for="zlpl_3"><input type="radio" name="zlpl" id="zlpl_3" value="3" />每周</label> 
																<label class="radio-lab" for="zlpl_4"><input type="radio" name="zlpl" id="zlpl_4" value="4" />每年</label>
															</td>
														</tr>
														<tr>
															<td colspan="2">
																<div class="lx-cont" data-zlpl="2">
																	<!-- 是否启用month -->
																	<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
																		<colgroup>
																			<col style="width: 90px;" />
																			<col style="width: 100px;" />
																			<col style="width: 40px;" />
																			<col />
																		</colgroup>
																		<tbody>
																			<tr>
																				<th>
																					<input type="radio" name="monthpl" value="day" />第
																				</th>	
																				<td>
																					<div class="txt-mid numbox" style="width: 70px;" id="monthday"></div> 天																				
																				</td>	
																				<th>
																					<input type="radio" name="monthpl" value="week" />第
																				</th>
																				<td>
																					<select id="weekdjg" class="txt-mid" style="width: 100px;">
																						<option value="1">一个</option>
																						<option value="2">二个</option>
																						<option value="3">三个</option>
																						<option value="4">四个</option>
																						<option value="5">最后一个</option>
																					</select>
																					<select id="weekdjz" class="txt-mid" style="width: 100px;">
																						<option value="1">星期日</option>
																						<option value="2">星期一</option>
																						<option value="3">星期二</option>
																						<option value="4">星期三</option>
																						<option value="5">星期四</option>
																						<option value="6">星期五</option>
																						<option value="7">星期六</option>
																					</select>		
																				</td>																		
																			</tr>
																	</table>																	
																</div>
																<div class="lx-cont" data-zlpl="3">
																	<!-- 是否启用week -->
																	<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
																		<colgroup>
																			<col style="width: 90px;" />
																			<col />
																		</colgroup>
																		<tbody>
																			<tr>
																				<th></th>
																				<td>
																					<input type="checkbox" name="week" id="week_1" value="1" title="星期日" /><span>星期日</span>
																					<input type="checkbox" name="week" id="week_2" value="2" title="星期一" /><span>星期一</span> 
																					<input type="checkbox" name="week" id="week_3" value="3" title="星期二" /><span>星期二</span> 
																					<input type="checkbox" name="week" id="week_4" value="4" title="星期三" /><span>星期三</span> 
																					<input type="checkbox" name="week" id="week_5" value="5" title="星期四" /><span>星期四</span> 
																					<input type="checkbox" name="week" id="week_6" value="6" title="星期五" /><span>星期五</span> 
																					<input type="checkbox" name="week" id="week_7" value="7" title="星期六" /><span>星期六</span>
																				</td>
																			</tr>
																	</table>
																</div>
																<div class="lx-cont" data-zlpl="4">
																	<!-- 是否启用year -->
																	<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
																		<colgroup>
																			<col style="width: 100px;" />
																			<col />
																		</colgroup>
																		<tbody>
																			<tr>
																				<th>第:</th>
																				<td>
																					<div class="txt-mid numbox" style="width: 70px;" id="monthSel"></div>月
																					<select id="month_weekdjg" class="txt-mid"	style="width: 100px;">
																						<option value="1">第一个</option>
																						<option value="2">第二个</option>
																						<option value="3">第三个</option>
																						<option value="4">第四个</option>
																						<option value="5">最后一个</option>
																					</select>
																					<select id="month_weekdjz" class="txt-mid" style="width: 100px;">
																						<option value="1">星期日</option>
																						<option value="2">星期一</option>
																						<option value="3">星期二</option>
																						<option value="4">星期三</option>
																						<option value="5">星期四</option>
																						<option value="6">星期五</option>
																						<option value="7">星期六</option>
																					</select>
																				</td>
																			</tr>
																	</table>
																</div>
															</td>
														</tr>
												</table>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div style="border: solid 1px #ccc;">
												<div style="border-bottom: solid 1px #ccc; text-align: center;">每天频率</div>
												<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
													<colgroup>
														<col style="width: 100px;" />
														<col />
													</colgroup>
													<tbody>
														<tr data-daypl="one">
															<th><input type="radio" name="daypl" value="one" />执行一次</th>
															<td><input name="dayplone" class="txt-mid txt-date" onclick="WdatePicker({dateFmt:'HH:mm:ss'})" /></td>
														</tr>
														<tr data-daypl="com">
															<th><input type="radio" name="daypl" value="com" />执行间隔</th>
															<td>
																<div class="txt-mid numbox" style="width: 70px;" id="zxjg"></div> 
																<select id="zxjg_unit" class="txt-mid" style="width: 100px;">
																	<option value="1">分钟</option>
																	<option value="60">小时</option>
																</select>
															</td>
														</tr>
												</table>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div style="border: solid 1px #ccc;">
												<div style="border-bottom: solid 1px #ccc; text-align: center;">持续时间</div>
												<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
													<colgroup>
														<col style="width: 100px;" />
														<col style="width: 350px;" />
														<col style="width: 100px;" />
													</colgroup>
													<tbody>
														<tr>
															<th>开始时间</th>
															<td colspan="2">
																<input name="starttime" value="${starttime}" class="txt-mid txt-date" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-%d}'})" />
															</td>
														</tr>
														<tr>
															<th><input type="radio" name="hasEnd" value="yes" />结束时间</th>
															<td><input name="endtime" value="${endtime}" class="txt-mid txt-date" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-%d}'})" /></td>
															<td><input type="radio" name="hasEnd" value="no" />无结束时间</td>
														</tr>														
												</table>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div style="border: solid 1px #ccc;">
												<div style="border-bottom: solid 1px #ccc; text-align: center;">摘要</div>
												<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
													<colgroup>
														<col style="width: 100px;" />
														<col />
													</colgroup>
													<tbody>
														<tr>
															<th>说明</th>
															<td>
																<textarea name="description" rows="2" class="txt"></textarea></td>
														</tr>
												</table>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</form>
					</div>
				</div>
			</div>
			<div class="pageBot">
				<div class="pageBot_in">
					<button type="button" class="btn-mid btn-submit" data-val="submit">确定</button>
					<!-- <button type="button" class="btn-mid btn-cancel" style="margin-left:.2em;" data-val="cancel">关闭</button> -->
				</div>
			</div>
		</div>
	</div>
</body>
</html>