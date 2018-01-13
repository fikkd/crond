PAGE_UTIL.formOption = {
	subMenu: {
		menuFormFieldsOption : {
			labelWidth: 80, width: 150, space: 15, inputWidth: 170,
			fields: [ 
	        	{name: 'id', type : 'hidden'}, 
	        	{name: 'parentId', type : 'hidden'},
	        	{name: 'leaf', type : 'hidden'},
	        	{display: '菜单名称', name: 'appName', type : 'text', newline: false}, 
	        	{display: '菜单编码', name: 'appCode', type : 'text', newline: false}, 
	        	{display: '链接地址', name: 'urlAddress', type : 'text', newline: true},
	        	{display: '模块代码', name: 'mkdm', type : 'text', newline: false},
	        	{display: '是否公用', name: 'publicName', type: "select", options: {
	        		valueFieldID:"isPublic", valueField: 'value', url:"ams/getMenuIsUsedDataList.json", initValue: 1}, 
	        		width: 100, space: 12, newline: true 
	    		}, 
	        	{display : '启用状态', name : 'usedName', type: "select", options: {
	        		valueFieldID:"isUsed", valueField: 'value', url:"ams/getMenuIsPublicDataList.json", initValue: 0}, 
	        		width: 100, space: 12, newline: false
	    	 	},
	         	{display : '序号', name : 'paiXuHao', type : 'int', width: 50, inputWidth: 70, newline: false},
	        	{display : '说明', name : 'description', width: 438, type : 'textarea', newline:true}
	    	]
		},
		menuValidateOptions: {
			onkeyup: false,
			rules: {
				appName: {
					required: true,
					ZhStrMaxLength: 50
				},
				appCode: {
					required: true,
					ZhStrMaxLength: 50,
					remote: {
						url: 'ams/checkMenuCodeNotExist.json',
						type: 'post',
						data: {
							'oldAppCode': function() {
								return $("#oldAppCode").val();
							},
							'appCode': function() {
								return $("#appCode").val();
							}
						}
					}
				},
				urlAddress: {
					ZhStrMaxLength: 100
				},
				description: {
					ZhStrMaxLength: 500
				}
			},
			messages: {
				appCode: {
					remote: '当前菜单编号已存在, 请输入一个唯一的菜单编号!'
				}
			}
		}
	},
	mainMenu: {
		menuFormFieldsOption : {
			labelWidth: 80, width: 150, space: 15, inputWidth: 170,
			fields : [ 
	        	{name : 'id', type : 'hidden'},
	        	{name : 'parentId', type : 'hidden'},
	        	{name : 'leaf', type : 'hidden'},
	        	{display : '菜单名称', name : 'appName', type : 'text', newline: false}, 
	        	{display: '菜单编码', name: 'appCode', type : 'text', newline: false}, 
	        	{display: '链接地址', name: 'urlAddress', type : 'text', newline: true},
	        	{display: '模块代码', name: 'mkdm', type : 'text', newline: false},
	        	{display : '是否公用', name : 'publicName', type: "select", options: {
	        		valueFieldID:"isPublic", valueField: 'value', url:"ams/getMenuIsUsedDataList.json"}, 
	        		width: 100, space: 12, newline: true
	        	}, 
	        	{display : '启用状态', name : 'usedName', type: "select", options: {
	        		valueFieldID:"isUsed", valueField: 'value', url:"ams/getMenuIsPublicDataList.json"}, 
	        		width: 100, space: 12, newline: false
	        	},
	        	{display : '序号', name : 'paiXuHao', type : 'int', width: 50, inputWidth: 60, newline: false},
	        	{display : '说明', name : 'description', width: 438, type : 'textarea', newline: true}
	        	
	    	]
		},
		menuValidateOptions: {
			onkeyup : false,
			rules : {
				appName : {
					required : true,
					ZhStrMaxLength : 50
				},
				description : {
					ZhStrMaxLength : 500
				}
			},
			messages : {
				appCode : {
					remote : '当前菜单编号已存在, 请输入一个唯一的菜单编号!'
				}
			}
		}
	}
};

PAGE_UTIL.openMenuDetailPage = function(menuType, operType, currentMenuId, callback) {
	// 定义按钮
	var buttons = [];
    if('view' !== operType) {
    	buttons.push({ text: '保存', onclick: f_save});
    }
    buttons.push({ text: '取消', onclick: f_cancel});
    var params = {'menuType': menuType, 'operType': operType, 'currentMenuId': currentMenuId};
	$.ligerDialog.open({
		width: 600,
		height: 285,
		top: 50,
		title: '菜单管理',
		url: 'ams/menuDetail.do?' + $.param(params),
		buttons : buttons
	});
	
	function f_save(button, dialog) {
		dialog.frame['saveMenuHandler'](dialog, grid);
	}
	
	function f_cancel(button, dialog) {
		dialog.close();
	}
};