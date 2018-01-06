<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="tab-cont" data-val="tab3">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">日</div>
			</div>
			<div class="panel-c">
				<div style="height:330px;">
					<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;" data-val="day">
						<colgroup>
							<col style="width: 17px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th><input type="radio" name="day" value="day0" /></th>
								<td>
									不设置	<!-- ? -->
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day1" /></th>
								<td><label>每隔一天触发</label></td><!-- * -->
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day2" /></th>
								<td>
									第
									<div class="txt js-begin-day" style="width: 70px;"></div> 日开始, 每隔&nbsp;
									<div class="txt js-step-day" style="width: 70px;inline-block;"></div> 天触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day3" /></th>
								<td>
									在
									<div class="txt js-bt-begin-day" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-day" style="width: 70px;inline-block;"></div> 日之间每隔
									<div class="txt js-bt-step-day" style="width: 70px;inline-block;"></div> 天触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="day" value="day4" /></th>
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
							<tr>
								<th></th>
								<td>
									<input type="checkbox" value="13"> 13 
									<input type="checkbox" value="14"> 14 
									<input type="checkbox" value="15"> 15 
									<input type="checkbox" value="16"> 16 
									<input type="checkbox" value="17"> 17 
									<input type="checkbox" value="18"> 18 
									<input type="checkbox" value="19"> 19
									<input type="checkbox" value="20"> 20
									<input type="checkbox" value="21"> 21																	
									<input type="checkbox" value="22"> 22
								</td>
							</tr>		
							<tr>
								<th></th>
								<td>
									<input type="checkbox" value="23"> 23
									<input type="checkbox" value="24"> 24
									<input type="checkbox" value="25"> 25
									<input type="checkbox" value="26"> 26
									<input type="checkbox" value="27"> 27
									<input type="checkbox" value="28"> 28
									<input type="checkbox" value="29"> 29
									<input type="checkbox" value="30"> 30
									<input type="checkbox" value="31"> 31
								</td>
							</tr>	
							<tr>
								<th><input type="radio" name="day" value="day6" /></th>
								<td>
									每月最后一天									
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>