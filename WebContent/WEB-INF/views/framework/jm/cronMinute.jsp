<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="tab-cont" data-val="tab1">
	<div class="container">
		<div class="panel panel-border js-searbox">
			<div class="panel-h panel-h-styrline">
				<div class="panel-h-txt">分</div>
			</div>
			<div class="panel-c">
				<div style="height:450px;">
					<table class="detailtable" cellpadding="0" cellspacing="0" style="width: 100%;" data-val="minute">
						<colgroup>
							<col style="width: 17px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th><input type="radio" name="minute" value="min0" /></th>
								<td><label>0 分</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min1" /></th>
								<td><label>每隔一分钟触发</label></td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min2" /></th>
								<td>
									第
									<div class="txt js-begin-min" style="width: 70px;"></div> 分钟开始, 每隔&nbsp;
									<div class="txt js-step-min" style="width: 70px;inline-block;"></div> 分钟触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min3" /></th>
								<td>
									在
									<div class="txt js-between-begin-min" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-between-end-min" style="width: 70px;inline-block;"></div> 分钟之间每隔一分钟触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min4" /></th>
								<td>
									在
									<div class="txt js-bt-begin-min" style="width: 70px;"></div> 至&nbsp;
									<div class="txt js-bt-end-min" style="width: 70px;inline-block;"></div> 分钟之间每隔
									<div class="txt js-bt-step-min" style="width: 70px;inline-block;"></div> 分钟触发
								</td>
							</tr>
							<tr>
								<th><input type="radio" name="minute" value="min5" /></th>
								<td>
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
								</td>
							</tr>
							<tr>
								<th></th>
								<td>
									<input type="checkbox" value="10"> 10 
									<input type="checkbox" value="11"> 11 
									<input type="checkbox" value="12"> 12 
									<input type="checkbox" value="13"> 13 
									<input type="checkbox" value="14"> 14 
									<input type="checkbox" value="15"> 15 
									<input type="checkbox" value="16"> 16 
									<input type="checkbox" value="17"> 17 
									<input type="checkbox" value="18"> 18 
									<input type="checkbox" value="19"> 19
								</td>
							</tr>
							<tr>
								<th></th>
								<td>
									<input type="checkbox" value="20"> 20 
									<input type="checkbox" value="21"> 21 
									<input type="checkbox" value="22"> 22 
									<input type="checkbox" value="23"> 23 
									<input type="checkbox" value="24"> 24 
									<input type="checkbox" value="25"> 25 
									<input type="checkbox" value="26"> 26 
									<input type="checkbox" value="27"> 27 
									<input type="checkbox" value="28"> 28 
									<input type="checkbox" value="29"> 29
								</td>
							</tr>
							<tr>
								<th></th>
								<td>
									<input type="checkbox" value="30"> 30 
									<input type="checkbox" value="31"> 31 
									<input type="checkbox" value="32"> 32 
									<input type="checkbox" value="33"> 33 
									<input type="checkbox" value="34"> 34 
									<input type="checkbox" value="35"> 35 
									<input type="checkbox" value="36"> 36 
									<input type="checkbox" value="37"> 37 
									<input type="checkbox" value="38"> 38 
									<input type="checkbox" value="39"> 39
								</td>
							</tr>
							<tr>
								<th></th>
								<td>
									<input type="checkbox" value="40"> 40 
									<input type="checkbox" value="41"> 41 
									<input type="checkbox" value="42"> 42 
									<input type="checkbox" value="43"> 43 
									<input type="checkbox" value="44"> 44 
									<input type="checkbox" value="45"> 45 
									<input type="checkbox" value="46"> 46 
									<input type="checkbox" value="47"> 47 
									<input type="checkbox" value="48"> 48 
									<input type="checkbox" value="49"> 49
								</td>
							</tr>
							<tr>
								<th></th>
								<td>
									<input type="checkbox" value="50"> 50 
									<input type="checkbox" value="51"> 51 
									<input type="checkbox" value="52"> 52 
									<input type="checkbox" value="53"> 53 
									<input type="checkbox" value="54"> 54 
									<input type="checkbox" value="55"> 55 
									<input type="checkbox" value="56"> 56 
									<input type="checkbox" value="57"> 57 
									<input type="checkbox" value="58"> 58 
									<input type="checkbox" value="59"> 59
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>