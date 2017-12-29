<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- tab0 -->
<div class="tab-cont" data-val="tab0">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">秒</div>
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
								<th><input type="radio" name="second" value="sec1" /></th>
								<td><label>每隔1秒触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="second" value="sec2" /></th>
								<td>
									第 <input name="s_5" value="" class="txt" type="text" style="width: 232px;" placeholder="10,16,23,46" /> 秒分别触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="second" value="sec3" /></th>
								<td>
									第
									<div class="txt js-begin" style="width: 70px;"></div> 秒开始, 每隔&nbsp;
									<div class="txt js-step" style="width: 70px;inline-block;"></div> 秒触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="second" value="sec4" /></th>
								<td>
									在
									<div class="txt js-between-begin" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-between-end" style="width: 70px;inline-block;"></div> 秒之间每隔1秒触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="second" value="sec5" /></th>
								<td>
									在
									<div class="txt js-bt-begin" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end" style="width: 70px;inline-block;"></div> 秒之间每隔
									<div class="txt js-bt-step" style="width: 70px;inline-block;"></div> 秒触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="second" value="sec6" /></th>
								<td><label>0秒</label></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>