<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	String path = request.getContextPath();
	int serverPort = request.getServerPort();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+serverPort +path+"/";
    request.setAttribute("basePath",basePath);
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>    
    <script type="text/javascript">
		location.href="${basePath}jm/toIndex.do";     
    </script>
</head>
<body>
</body>
</html>