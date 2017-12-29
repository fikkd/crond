<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- tab0 -->
<div class="tab-cont" data-val="tab2">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">时</div>
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
								<th><input type="radio" name="hour" value="hor1" /></th>
								<td><label>每隔1小时触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="hour" value="hor2" /></th>
								<td>
									第 <input name="s_5" value="" class="txt" type="text" style="width: 232px;" placeholder="3,10,12,20" /> 小时分别触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="hour" value="hor3" /></th>
								<td>
									第
									<div class="txt js-begin-hor" style="width: 70px;"></div> 小时开始, 每隔&nbsp;
									<div class="txt js-step-hor" style="width: 70px;inline-block;"></div> 小时触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="hour" value="hor4" /></th>
								<td>
									在
									<div class="txt js-between-begin-hor" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-between-end-hor" style="width: 70px;inline-block;"></div> 小时之间每隔1小时触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="hour" value="hor5" /></th>
								<td>
									在
									<div class="txt js-bt-begin-hor" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-hor" style="width: 70px;inline-block;"></div> 小时之间每隔
									<div class="txt js-bt-step-hor" style="width: 70px;inline-block;"></div> 小时触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="hour" value="hor6" /></th>
								<td><label>0小时</label></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>