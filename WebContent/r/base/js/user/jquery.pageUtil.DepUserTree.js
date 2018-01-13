PAGE_UTIL.depUserTreeData = function (depId, selPersonIds) {
	
	PAGE_UTIL.ajax({
		url: 'rights.do', method: 'getDepUserTree', cache: false,
        data: {'oldPassWord': oldPassWord, 'newPassWord': newPassWord},
        success: function (data, message) {
    		
        },
        error: function (message) {
        	PAGE_UTIL.showError(message);
        }
    });
};