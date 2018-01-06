<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="tab-cont" data-val="tab6">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">年</div>
			</div>
			<div class="panel-c">
				<div style="height:330px;">
					<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;" data-val="year">
						<colgroup>
							<col style="width: 17px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th><input type="radio" name="year" value="yer0" /></th>
								<td><label>每隔一年触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="year" value="yer1" /></th>
								<td>
									在
									<div class="txt js-begin-yer" style="width: 70px;"></div> 年开始, 每隔&nbsp;
									<div class="txt js-step-yer" style="width: 70px;inline-block;"></div> 年触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="year" value="yer2" /></th>
								<td>
									在 <input id="yer2" class="txt" type="text" style="width: 232px;" placeholder="2018,2019,2020" /> 年分别触发
								</td>								
							</tr>
							<tr>
								<th><input type="radio" name="year" value="yer3" /></th>
								<td>
									在
									<div class="txt js-bt-begin-yer" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-yer" style="width: 70px;inline-block;"></div> 年之间每隔
									<div class="txt js-bt-step-yer" style="width: 70px;inline-block;"></div> 年触发
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>