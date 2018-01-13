<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="tab-cont" data-val="tab4">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">月</div>
			</div>
			<div class="panel-c">
				<div style="height:330px;">
					<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;" data-val="month">
						<colgroup>
							<col style="width: 17px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th><input type="radio" name="month" value="mon0" /></th>
								<td>
									每隔一月触发
								</td>
							</tr>	
							<tr>
								<th><input type="radio" name="month" value="mon1" /></th>
								<td>
									第
									<div class="txt js-begin-mon" style="width: 70px;"></div> 月开始, 每隔&nbsp;
									<div class="txt js-step-mon" style="width: 70px;inline-block;"></div> 月触发
								</td>
							</tr>		
							<tr>
								<th><input type="radio" name="month" value="mon2" /></th>
								<td>
									在
									<div class="txt js-bt-begin-mon" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-mon" style="width: 70px;inline-block;"></div> 月之间每隔
									<div class="txt js-bt-step-mon" style="width: 70px;inline-block;"></div> 月触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="month" value="mon3" /></th>
								<td>
									<input type="checkbox" value="1"> 1 
									<input type="checkbox" value="2"> 2 
									<input type="checkbox" value="3"> 3 
									<input type="checkbox" value="4"> 4 
									<input type="checkbox" value="5"> 5 
									<input type="checkbox" value="6"> 6 
									<input type="checkbox" value="7"> 7 
									<input type="checkbox" value="8"> 8 
									<input type="checkbox" value="9"> 9
									<input type="checkbox" value="10"> 10
									<input type="checkbox" value="11"> 11									
									<input type="checkbox" value="12"> 12 
								</td>
							</tr>							
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>