<%@ page import="com.wisoft.framework.common.pojo.Login_Userinfo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	int serverPort = request.getServerPort();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+serverPort +path+"/";
    request.setAttribute("basePath",basePath);
%>
<!DOCTYPE html>
<html class="fixed inframe">
<head lang="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>周期性计划任务详细设置</title>
    <script type="text/javascript">
        var BASEPATH='${basePath }';
    </script>
    <link rel="stylesheet" href="${basePath }r/base/fontawesome-4.2.0_ie7/css/font-awesome.min.css?v=${version}" />
    <script type="text/javascript" src="${basePath }r/base/My97DatePicker/WdatePicker.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/common/ECMAScript_ex/ECMAScript_ex.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/base/jQuery-1.10.2/jquery-1.10.2.min.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/base/layer-v2.1/layer.js?v=${version}"></script>    
    <link type="text/css" rel="stylesheet" href="${basePath }r/wisoft/wiFrame/css/common.css"/>
    <script type="text/javascript" src="${basePath }r/wisoft/wiFrame/common.js"></script>
    <link type="text/css" rel="stylesheet" href="${basePath }r/project/common/frame/css/common.css"/>
    <script type="text/javascript" src="${basePath }r/project/common/frame/common.js"></script>
    <script type="text/javascript" src="${basePath }r/project/jm/js/cronSecond.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/project/jm/js/cronMinute.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/project/jm/js/cronHour.js?v=${version}"></script>    
    <script type="text/javascript" src="${basePath }r/project/jm/js/cronDay.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/project/jm/js/cronMonth.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/project/jm/js/cronWeek.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/project/jm/js/cronYear.js?v=${version}"></script>    
    <script type="text/javascript" src="${basePath }r/project/jm/js/jobCron.js?v=${version}"></script>
    <style type="text/css">
        .detailtable>*>tr>*>.numbox{ width:50px; margin-right:2px;}
    </style>   
</head>
<body>
    <div class="wrap wrap-inabs">
        <div class="wrap-head js-tbtns">
            <div class="wrap-head-r">
           		<label data-val="cronInfo"></label><!-- 显示信息 -->
            </div>
            <div class="wrap-head-l">
                <button class="btn btn-operate btn-success" type="button" data-type="save">确定</button>
            </div>
        </div>
        <div class="wrap-cont">
            <div class="wrap-cont-c">
                <div class="container-abs">
                    <div class="tab-box-abs js-tabs">
                        <div class="tab-cont-box">
                        	<jsp:include page="./cronSecond.jsp"></jsp:include>
                        	<jsp:include page="./cronMinute.jsp"></jsp:include>
                        	<jsp:include page="./cronHour.jsp"></jsp:include>
                        	<jsp:include page="./cronDay.jsp"></jsp:include>
                        	<jsp:include page="./cronMonth.jsp"></jsp:include>
                        	<jsp:include page="./cronWeek.jsp"></jsp:include>
                        	<jsp:include page="./cronYear.jsp"></jsp:include>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>	
</body>
</html>