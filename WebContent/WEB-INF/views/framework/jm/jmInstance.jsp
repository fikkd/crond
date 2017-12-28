<%@page import="com.wisoft.framework.common.pojo.Login_Userinfo"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	int serverPort = request.getServerPort();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+serverPort +path+"/";
    request.setAttribute("basePath",basePath);
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html class="fixed inframe">
<head lang="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>jm 任务调度</title>
    <script type="text/javascript">
        var BASEPATH='${basePath }';
    </script>
    <link rel="stylesheet" href="${basePath }r/base/zTree_v3/css/zTreeStyle/zTreeStyle.css?v=${version}" type="text/css">
    <link rel="stylesheet" href="${basePath }r/base/fontawesome-4.2.0_ie7/css/font-awesome.min.css?v=${version}" />
    <link rel="stylesheet" href="${basePath }r/common/frame/css/common.css?v=${version}" />
    <script type="text/javascript" src="${basePath }r/base/My97DatePicker/WdatePicker.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/common/ECMAScript_ex/ECMAScript_ex.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/base/jQuery-1.10.2/jquery-1.10.2.min.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/base/layer-v2.1/layer.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/common/frame/common.js?v=${version}"></script>
    <script type="text/javascript" src="${basePath }r/project/jm/js/jmInstance.js?v=${version}"></script>
</head>
<body>
<div class="page">
    <div class="pageMain">
        <div class="pageMain hasBot">
            <div class="panel">
                <div class="panel-box">
                    <form id="groupform">
                        <table class="detailtable" cellspacing="0" cellpadding="0">
                            <colgroup>
                                <col style="width:30px;" />
                                <col />
                            </colgroup>
                            <tbody><tr>
                                <th></th>
                                <td><textarea name="exception_info" readonly="readonly"  style="height: 470px" class="txt">${jobDetail.exception_info}</textarea></td>
                            </tr></tbody>
                        </table>
                    </form>
                </div>
            </div>
        </div>
        <div class="pageBot">
            <div class="pageBot_in">
                <button type="button" class="btn-mid btn-cancel" style="margin-left:.2em;" data-val="cancel">关闭</button>
            </div>
        </div>
    </div>
</div>
</body>
</html>