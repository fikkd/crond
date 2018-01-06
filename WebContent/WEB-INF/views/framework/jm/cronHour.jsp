<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="tab-cont" data-val="tab2">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">分</div>
			</div>
			<div class="panel-c">
				<div style="height:330px;">
					<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;" data-val="hour">
						<colgroup>
							<col style="width: 17px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th><input type="radio" name="hour" value="hor0" /></th>
								<td><label>每隔一小时触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="hour" value="hor1" /></th>
								<td>
									第
									<div class="txt js-begin-hor" style="width: 70px;"></div> 小时开始, 每隔&nbsp;
									<div class="txt js-step-hor" style="width: 70px;inline-block;"></div> 小时触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="hour" value="hor2" /></th>
								<td>
									在
									<div class="txt js-bt-begin-hor" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-hor" style="width: 70px;inline-block;"></div> 小时之间每隔
									<div class="txt js-bt-step-hor" style="width: 70px;inline-block;"></div> 小时触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="hour" value="hor3" /></th>
								<td>
									AM: 
									<input type="checkbox" value="0"> 00 
									<input type="checkbox" value="1"> 01 
									<input type="checkbox" value="2"> 02 
									<input type="checkbox" value="3"> 03 
									<input type="checkbox" value="4"> 04 
									<input type="checkbox" value="5"> 05 
									<input type="checkbox" value="6"> 06 
									<input type="checkbox" value="7"> 07 
									<input type="checkbox" value="8"> 08 
									<input type="checkbox" value="9"> 09
									<input type="checkbox" value="10"> 10
									<input type="checkbox" value="11"> 11
								</td>
							</tr>
							<tr>
								<th></th>
								<td>
									PM:
									<input type="checkbox" value="12"> 12 
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
									<input type="checkbox" value="23"> 23
								</td>
							</tr>							
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>