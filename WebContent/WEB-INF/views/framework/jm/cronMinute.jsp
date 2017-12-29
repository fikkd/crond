<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- tab0 -->
<div class="tab-cont" data-val="tab1">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">分</div>
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
								<th><input type="radio" name="minute" value="min1" /></th>
								<td><label>每隔1分钟触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min2" /></th>
								<td>
									第 <input name="s_5" value="" class="txt" type="text" style="width: 232px;" placeholder="10,16,23,46" /> 分钟分别触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min3" /></th>
								<td>
									第
									<div class="txt js-begin-min" style="width: 70px;"></div> 分钟开始, 每隔&nbsp;
									<div class="txt js-step-min" style="width: 70px;inline-block;"></div> 分钟触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min4" /></th>
								<td>
									在
									<div class="txt js-between-begin-min" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-between-end-min" style="width: 70px;inline-block;"></div> 分钟之间每隔1分钟触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min5" /></th>
								<td>
									在
									<div class="txt js-bt-begin-min" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-min" style="width: 70px;inline-block;"></div> 分钟之间每隔
									<div class="txt js-bt-step-min" style="width: 70px;inline-block;"></div> 分钟触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min6" /></th>
								<td><label>0分钟</label></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>