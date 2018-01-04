<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="tab-cont" data-val="tab5">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">周</div>
			</div>
			<div class="panel-c">
				<div style="height:330px;">
					<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;" data-val="week">
						<colgroup>
							<col style="width: 17px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th><input type="radio" name="week" value="wek0" /></th>
								<td><label>不设置</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek1" /></th>
								<td><label>每隔一周触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek2" /></th>
								<td>
									第
									<div class="txt js-index-wek" style="width: 70px;"></div> 个星期
									<select class="txt" style="width: 50px;">									
										<option value="1">日</option>
										<option value="2">一</option>
										<option value="3">二</option>
										<option value="4">三</option>
										<option value="5">四</option>
										<option value="6">五</option>
										<option value="7">六</option>
									</select> &nbsp;触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek3" /></th>
								<td>
									从星期
									<select class="txt" style="width: 50px;">									
										<option value="1">日</option>
										<option value="2">一</option>
										<option value="3">二</option>
										<option value="4">三</option>
										<option value="5">四</option>
										<option value="6">五</option>
										<option value="7">六</option>
									</select> 至星期&nbsp;
									<select class="txt" style="width: 50px;">									
										<option value="1">日</option>
										<option value="2">一</option>
										<option value="3">二</option>
										<option value="4">三</option>
										<option value="5">四</option>
										<option value="6">五</option>
										<option value="7">六</option>
									</select> &nbsp;之间触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek4" /></th>
								<td>
									每月最后一个星期
									<select class="txt" style="width: 50px;">									
										<option value="1">日</option>
										<option value="2">一</option>
										<option value="3">二</option>
										<option value="4">三</option>
										<option value="5">四</option>
										<option value="6">五</option>
										<option value="7">六</option>
									</select> &nbsp;触发
								</td>
							</tr>	
							<tr>
								<th><input type="radio" name="week" value="wek5" /></th>
								<td>
									<input type="checkbox" value="1" data-val="周日"> 周日 
									<input type="checkbox" value="2" data-val="周一"> 周一
									<input type="checkbox" value="3" data-val="周二"> 周二 
									<input type="checkbox" value="4" data-val="周三"> 周三
									<input type="checkbox" value="5" data-val="周四"> 周四
									<input type="checkbox" value="6" data-val="周五"> 周五
									<input type="checkbox" value="7" data-val="周六"> 周六
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>