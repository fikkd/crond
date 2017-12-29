<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- tab0 -->
<div class="tab-cont" data-val="tab4">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">月</div>
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
								<th><input type="radio" name="month" value="mon1" /></th>
								<td><label>每隔1月触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="month" value="mon2" /></th>
								<td>
									第 <input name="s_5" value="" class="txt" type="text" style="width: 232px;" placeholder="1,3,8,11" /> 月分别触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="month" value="mon3" /></th>
								<td>
									第
									<div class="txt js-begin-mon" style="width: 70px;"></div> 月开始, 每隔&nbsp;
									<div class="txt js-step-mon" style="width: 70px;inline-block;"></div> 月触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="month" value="mon4" /></th>
								<td>
									在
									<div class="txt js-between-begin-mon" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-between-end-mon" style="width: 70px;inline-block;"></div> 月之间每隔1月触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="month" value="mon5" /></th>
								<td>
									在
									<div class="txt js-bt-begin-mon" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-mon" style="width: 70px;inline-block;"></div> 月之间每隔
									<div class="txt js-bt-step-mon" style="width: 70px;inline-block;"></div> 月触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="month" value="mon6" /></th>
								<td><label>0月</label></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>