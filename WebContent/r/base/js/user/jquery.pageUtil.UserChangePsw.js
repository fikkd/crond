PAGE_UTIL.changepassword = function () {
    $(document).bind('keydown.changepassword', function (event) {
        if (event.keyCode == 13) {
            doChangePassword();
        }
    });

    if (!PAGE_UTIL.changePasswordWin) {
    	PAGE_UTIL.changePasswordPanle = $("<form style='font-family: verdana;' method='post'></form>");
    	PAGE_UTIL.changePasswordPanle.ligerForm({
            fields: [
                { display: '旧&#12288;密&#12288;码', name: 'oldPassWord', type: 'password'},
                { display: '新&#12288;密&#12288;码', name: 'newPassWord', type: 'password'},
                { display: '确认新密码', name: 'newPassWord2', type: 'password'}
            ]
        });
        //验证
        var validate_options = {
			onkeyup : false,
	    	rules : {
	    		oldPassWord : {
	    			required :true, ZhStrMaxLength : 50,
	    			remote : {
	    				url : 'user.do', type : 'post',
	    				data : {
	    					'event' : 'validationUserPsw',
    						'passWord' : function() {
    							return $("#oldPassWord").val();
    						}
	    				}
	    			}
	    		},
	    		newPassWord : {
	    			required :true,
	    			ZhStrRangeLength : [6,50]
	    		},
	    		newPassWord2 : {
	    			required :true,
	    			equalTo : '#newPassWord',
	    			ZhStrRangeLength : [6,50]
	    		}
			},
			messages: {
				oldPassWord : {
					remote : '密码验证失败,请输入正确的密码!',
					required : '请输入密码'
				},
				newPassWord : {
					required : '请输入新密码'
				},
				newPassWord2 : {
					required : '请再次输入新密码',
					equalTo : '两次密码输入不一致'
				}
			}
	    };
//        PAGE_UTIL.validate(changePasswordPanle);
        PAGE_UTIL.validate_PoshyTip(PAGE_UTIL.changePasswordPanle, validate_options);
        PAGE_UTIL.changePasswordWin = $.ligerDialog.open({
            width: 400, height: 170, isDrag: false,
            title: '用户密码修改', target: PAGE_UTIL.changePasswordPanle,
            buttons: [
            { text: '确定', onclick: doChangePassword},
            { text: '取消', onclick: function () {
                $(document).unbind('keydown.changepassword');
                PAGE_UTIL.changePasswordWin.hide();
            }}]
        });
    } else {
    	PAGE_UTIL.changePasswordPanle.find("input")
    			.parent().removeClass("l-textarea-invalid l-text-invalid")
	    		.end().removeAttr("title").poshytip('destroy').val("");
        PAGE_UTIL.changePasswordWin.show();
    }

    function doChangePassword() {
        var oldPassWord = $("#oldPassWord", PAGE_UTIL.changePasswordPanle).val();
        var newPassWord = $("#newPassWord", PAGE_UTIL.changePasswordPanle).val();
        if (PAGE_UTIL.changePasswordPanle.valid()) {
        	PAGE_UTIL.ajax({
        		url: 'user.do', method: 'changePassword', cache: false,
                data: {'oldPassWord': oldPassWord, 'newPassWord': newPassWord},
                success: function (data, message) {
                	PAGE_UTIL.changePasswordWin.hide();
            		PAGE_UTIL.showSuccess(message);
                    $(document).unbind('keydown.changepassword');
                },
                error: function (message) {
                	PAGE_UTIL.changePasswordWin.hide();
                	PAGE_UTIL.showError(message, function(){
                		PAGE_UTIL.changePasswordWin.show();
                	});
                }
            });
        }
    }
};