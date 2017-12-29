<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- tab0 -->
<div class="tab-cont" data-val="tab5">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">周</div>
			</div>
			<div class="panel-c">
				<div style="height:330px;">
					<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
						<colgroup>
							<col style="width: 17px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th><input type="radio" name="week" value="wek1" /></th>
								<td><label>每隔1周触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek2" /></th>
								<td>
									第 <input name="s_5" value="" class="txt" type="text" style="width: 232px;" placeholder="10,16,23,46" /> 周分别触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek3" /></th>
								<td>
									第
									<div class="txt js-begin-wek" style="width: 70px;"></div> 周开始, 每隔&nbsp;
									<div class="txt js-step-wek" style="width: 70px;inline-block;"></div> 周触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek4" /></th>
								<td>
									在
									<div class="txt js-between-begin-wek" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-between-end-wek" style="width: 70px;inline-block;"></div> 周之间每隔1周触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek5" /></th>
								<td>
									在
									<div class="txt js-bt-begin-wek" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-wek" style="width: 70px;inline-block;"></div> 周之间每隔
									<div class="txt js-bt-step-wek" style="width: 70px;inline-block;"></div> 周触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek6" /></th>
								<td>
									第
									<div class="txt js-bt-count-wek" style="width: 70px;"></div> 个
									<select id="weekdjz" class="txt" style="width: 80px;">
										<option value="1">星期日</option>
										<option value="2">星期一</option>
										<option value="3">星期二</option>
										<option value="4">星期三</option>
										<option value="5">星期四</option>
										<option value="6">星期五</option>
										<option value="7">星期六</option>
									</select> 触发
								</td>			
							</tr>
							<tr>
								<th><input type="radio" name="week" value="wek7" /></th>
								<td><label>0周</label></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>