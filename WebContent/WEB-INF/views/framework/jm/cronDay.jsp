<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- tab0 -->
<div class="tab-cont" data-val="tab3">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">日</div>
			</div>
			<div class="panel-c">
				<div style="height:250px;">
					<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;">
						<colgroup>
							<col style="width: 17px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th><input type="radio" name="day" value="day1" /></th>
								<td><label>每隔1天触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day2" /></th>
								<td>
									第 <input name="s_5" value="" class="txt" type="text" style="width: 232px;" placeholder="2,11,17,20" /> 天分别触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day3" /></th>
								<td>
									第
									<div class="txt js-begin-day" style="width: 70px;"></div> 天开始, 每隔&nbsp;
									<div class="txt js-step-day" style="width: 70px;inline-block;"></div> 天触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day4" /></th>
								<td>
									在
									<div class="txt js-between-begin-day" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-between-end-day" style="width: 70px;inline-block;"></div> 天之间每隔1秒触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day5" /></th>
								<td>
									在
									<div class="txt js-bt-begin-day" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-day" style="width: 70px;inline-block;"></div> 天之间每隔
									<div class="txt js-bt-step-day" style="width: 70px;inline-block;"></div> 天触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day6" /></th>
								<td><label>0日</label></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>