;(function ($) {
    //全局系统对象
    window['PAGE_UTIL'] = {};
    PAGE_UTIL.cookies = (function () {
        var fn = function () {
        };
        fn.prototype.get = function (name) {
            var cookieValue = "";
            var search = name + "=";
            if (document.cookie.length > 0) {
                var offset = document.cookie.indexOf(search);
                if (offset != -1) {
                    offset += search.length;
                    var end = document.cookie.indexOf(";", offset);
                    if (end == -1) end = document.cookie.length;
                    cookieValue = decodeURIComponent(document.cookie.substring(offset, end));
                }
            }
            return cookieValue;
        };
        fn.prototype.set = function (cookieName, cookieValue, DayValue) {
            var expire = "";
            var day_value = 1;
            if (DayValue != null) {
                day_value = DayValue;
            }
            expire = new Date((new Date()).getTime() + day_value * 86400000);
            expire = "; expires=" + expire.toGMTString();
            document.cookie = cookieName + "=" + encodeURIComponent(cookieValue) + ";path=/" + expire;
        };
        fn.prototype.remvoe = function (cookieName) {
            var expire = "";
            expire = new Date((new Date()).getTime() - 1);
            expire = "; expires=" + expire.toGMTString();
            document.cookie = cookieName + "=" + escape("") + ";path=/" + expire;
            /*path=/*/
        };
        return new fn();
    })();

    //右下角的提示框
    PAGE_UTIL.tip = function (message) {
        if (PAGE_UTIL.wintip) {
            PAGE_UTIL.wintip.set('content', message);
            PAGE_UTIL.wintip.show();
        } else {
            PAGE_UTIL.wintip = $.ligerDialog.tip({ content: message });
        }
        setTimeout(function () {
            PAGE_UTIL.wintip.hide();
        }, 4000);
    };

    //预加载图片
    PAGE_UTIL.prevLoadImage = function (rootpath, paths) {
        for (var i in paths) {
            $('<img />').attr('src', rootpath + paths[i]);
        }
    };
    
    //显示loading
    PAGE_UTIL.showLoading = function (message) {
        message = message || "正在加载中...";
        $('body').append("<div class='loading-mask-msg'>" + message + "&nbsp;&nbsp;&nbsp;&nbsp;</div>");
        $.ligerui.win.mask();
    };
    
    //隐藏loading
    PAGE_UTIL.hideLoading = function (message) {
        $('body > div.loading-mask-msg').remove();
        $.ligerui.win.unmask({ id: new Date().getTime() });
    };
    
    //显示loading
    PAGE_UTIL.showLoading_ = function(message) {
    	message = message || "正在加载中...";
        $('body').append("<div class='jloading'>" + message + "</div>");
        $.ligerui.win.mask();
    };
    
    PAGE_UTIL.hideLoading_ = function(message) {
    	$('body > div.jloading').remove();
        $.ligerui.win.unmask({ id: new Date().getTime() });
    };
    
    //显示成功提示窗口
    PAGE_UTIL.showSuccess = function (message, callback) {
        if (typeof (message) == "function" || arguments.length == 0) {
            callback = message;
            message = "操作成功!";
        }
        $.ligerDialog.success(message, '提示信息', callback);
    };
    //显示失败提示窗口
    PAGE_UTIL.showError = function (message, callback) {
        if (typeof (message) == "function" || arguments.length == 0) {
            callback = message;
            message = "操作失败!";
        }
        $.ligerDialog.error(message, '提示信息', callback);
    };

    //预加载dialog的图片
    PAGE_UTIL.prevDialogImage = function () {
        PAGE_UTIL.prevLoadImage('css/ligerUI/Aqua/images/win/', ['dialog-icons.gif', 'dialog.gif', 'dialog-bc.gif', 'dialog-tc.gif']);
    };

    //提交服务器请求
    //返回json格式
    //1, options.method 处理
    //2, 默认返回 json 格式
    PAGE_UTIL.ajax = function (options) {
        var p = options || {};
        var data = p.data || {};
        var dataType = p.dataType || 'json';
        var type = p.type || 'post';
        if(p.method) {
        	data['event'] = p.method;
        }
        $.ajax({
            cache: false, async: true, url: p.url, traditional: !!p.traditional,
            data: data, dataType: dataType, type: type,
            beforeSend: function () {
                PAGE_UTIL.loading = true;
                if (p.beforeSend) {
                    p.beforeSend();
                } else {
                    PAGE_UTIL.showLoading(p.loading);
                }
            },
            complete: function () {
                PAGE_UTIL.loading = false;
                if (p.complete) {
                    p.complete();
                } else {
                    PAGE_UTIL.hideLoading();
                }
            },
            success: function (result) {
                if (!result) {
                    return;
                }
                if (result.success) {
                    if (p.success) {
                        p.success(result.data, result.msg || '操作成功!');
                    }
                } else {
                    if (p.error) {
                        p.error(result.msg || '操作失败!');
                    }
                }
            },
            error: function (result, b) {
            	PAGE_UTIL.showError('发现系统错误 <BR />错误码：' + result.status);
            }
        });
    };

    //获取当前页面的appCode
    //优先级1：如果页面存在appCode的表单元素，那么加载它的值
    //优先级2：加载QueryString，名字为appCode的值
    PAGE_UTIL.getPageAppCode = function () {
        var menuno = $("#appCode").val();
        if (!menuno ) {
            menuno =  PAGE_UTIL.getQueryStringByName("appCode");
        }
        return menuno;
    };
    
  //获取QueryString的数组
    PAGE_UTIL.getQueryString = function() {
        var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
        if (result != null) {
            for (var i = 0; i < result.length; i++) {
            	result[i] = result[i].substring(1);
            }
            return result;
        }
        return "";
    };
    //根据QueryString参数名称获取值
    PAGE_UTIL.getQueryStringByName = function(name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result != null && result.length > 0) {
        	return result[1];
        }
        return "";
    };

    //创建按钮
    PAGE_UTIL.createButton = function (options) {
        var p = $.extend({
            appendTo: $('body')
        }, options || {});
        var btn = $('<div class="button button2 buttonnoicon" style="width:60px"><div class="button-l"> </div><div class="button-r"> </div> <span></span></div>');
        if (p.icon) {
            btn.removeClass("buttonnoicon");
            btn.append('<div class="button-icon"> <img src="../' + p.icon + '" /> </div> ');
        }
        //绿色皮肤
        if (p.green) {
            btn.removeClass("button2");
        }
        if (p.width) {
            btn.width(p.width);
        }
        if (p.click) {
            btn.click(p.click);
        }
        if (p.text) {
            $("span", btn).html(p.text);
        }
        if (typeof (p.appendTo) == "string") p.appendTo = $(p.appendTo);
        btn.appendTo(p.appendTo);
    };

    //创建过滤规则(查询表单)
    PAGE_UTIL.bulidFilterGroup = function (form) {
        if (!form) return null;
        var group = { op: "and", rules: [] };
        $(":input", form).not(":submit, :reset, :image,:button, [disabled]").each(function () {
            if (!this.name) {
                return;
            }
            if (!$(this).hasClass("field")) {
                return;
            }
            if ($(this).val() == null || $(this).val() == "") {
                return;
            }
            var ltype = $(this).attr("ltype");
            var optionsJSON = $(this).attr("ligerui"), options;
            if (optionsJSON) {
                options = JSON.parse(optionsJSON);
            }
            var op = $(this).attr("op") || "like";
            //get the value type(number or date)
            var type = $(this).attr("vt") || "string";
            var value = $(this).val();
            var name = this.name;
            //如果是下拉框，那么读取下拉框关联的隐藏控件的值(ID值,常用与外表关联)
            if (ltype == "select" && options && options.valueFieldID) {
                value = $("#" + options.valueFieldID).val();
                name = options.valueFieldID;
            }
            group.rules.push({
                op: op,
                field: name,
                value: value,
                type: type
            });
        });
        return group;
    };

    //附加表单搜索按钮：搜索、高级搜索
    PAGE_UTIL.appendSearchButtons = function (form, grid) {
        if (!form) {
            return;
        }
        form = $(form);
        //搜索按钮 附加到第一个li  高级搜索按钮附加到 第二个li
        var container = $('<ul><li style="margin-right:8px;clear:left;"></li><li></li></ul><div class="l-clear"></div>').appendTo(form);
        PAGE_UTIL.addSearchButtons(form, grid, container.find("li:eq(0)"), container.find("li:eq(1)"));
    };

    //创建表单搜索按钮：搜索、高级搜索
    PAGE_UTIL.addSearchButtons = function (form, grid, btn1Container, btn2Container) {
        if (!form) {
            return;
        }
        if (btn1Container) {
            PAGE_UTIL.createButton({
                appendTo: btn1Container,
                text: '搜索',
                click: function () {
                    var rule = PAGE_UTIL.bulidFilterGroup(form);
                    if (rule.rules.length) {
                        grid.set('parms', { where: JSON2.stringify(rule) });
                    } else {
                        grid.set('parms', {});
                    }
                    grid.loadData();
                }
            });
        }
        if (btn2Container) {
            PAGE_UTIL.createButton({
                appendTo: btn2Container,
                width: 80,
                text: '高级搜索',
                click: function () {
                    grid.showFilter();
                }
            });
        }
    };

    //快速设置表单底部默认的按钮:保存、取消
    PAGE_UTIL.setFormDefaultBtn = function (cancleCallback, savedCallback) {
        //表单底部按钮
        var buttons = [];
        if (cancleCallback) {
            buttons.push({ text: '取消', onclick: cancleCallback });
        }
        if (savedCallback) {
            buttons.push({ text: '保存', onclick: savedCallback });
        }
        PAGE_UTIL.addFormButtons(buttons);
    };

    //增加表单底部按钮,比如：保存、取消
    PAGE_UTIL.addFormButtons = function (buttons)
    {
        if (!buttons) {
            return;
        }
        var formbar = $("body > div.form-bar");
        if (formbar.length == 0) {
            formbar = $('<div class="form-bar"><div class="form-bar-inner"></div></div>').appendTo('body');
        }
        if (!(buttons instanceof Array)) {
            buttons = [buttons];
        }
        $(buttons).each(function (i, o) {
            var btn = $('<div class="l-dialog-btn"><div class="l-dialog-btn-l"></div><div class="l-dialog-btn-r"></div><div class="l-dialog-btn-inner"></div></div> ');
            $("div.l-dialog-btn-inner:first", btn).html(o.text || "BUTTON");
            if (o.onclick) {
                btn.bind('click', function() {
                    o.onclick(o);
                });
            }
            if (o.width) {
                btn.width(o.width);
            }
            if(o.left) {
            	btn.css("float", "left");
            }
            if(o.id) {
            	btn.attr("id", o.id);
            }
            $("> div:first", formbar).append(btn);
        });
    };

    //填充表单数据
    PAGE_UTIL.loadForm = function (mainform, options, callback) {
        options = options || {};
        if (!mainform) {
            mainform = $("form:first");
        }
        var p = $.extend({
            beforeSend: function () {
                PAGE_UTIL.showLoading('正在加载表单数据中...');
            },
            complete: function () {
                PAGE_UTIL.hideLoading();
            },
            success: function (data) {
                var preID = options.preID || "";
                //根据返回的属性名，找到相应ID的表单元素，并赋值
                for (var p in data) {
                    var ele = $("[name=" + (preID + p) + "]", mainform);
                    //针对复选框和单选框 处理
                    if (ele.is(":checkbox,:radio")) {
                        ele[0].checked = data[p] ? true : false;
                    } else if (ele.hasClass("omComboNode")) {
                    	ele.omCombo("value", data[p]);
                	} else {
                        ele.val(data[p]);
                    }
                }
                // 回调函数需要放在更新样式语句块前面.防止在回调函数中有更新表现表单的动作
                if (callback) {
                    callback(data);
                }
                //下面是更新表单的样式
                var managers = $.ligerui.find($.ligerui.controls.Input);
                
                for (var i = 0, l = managers.length; i < l; i++) {
                	//改变了表单的值，需要调用这个方法来更新ligerui样式
                	var o = managers[i];
                	o.updateStyle();
                	if (managers[i] instanceof $.ligerui.controls.TextBox) {
                		o.checkValue();
                	}
                }
            },
            error: function (message) {
                PAGE_UTIL.showError('数据加载失败!<BR />错误信息：' + message);
            }
        }, options);
        PAGE_UTIL.ajax(p);
    };
    
    PAGE_UTIL.setFormReadOnly = function (mainform)
    {
        if (!mainform) {
        	mainform = $("form:first"); 
        }
        $("input,select,textarea", mainform).attr("readonly", "readonly");
        var managers = $.ligerui.find($.ligerui.controls.Input);
        for (var i = 0, l = managers.length; i < l; i++)
        {
            //改变了表单的值，需要调用这个方法来更新ligerui样式
            var element = managers[i];
            element.set('readonly', true);
        }
    };

    //带验证、带loading的提交
    PAGE_UTIL.submitForm = function (mainform, success, error)
    {
        if (!mainform) {
            mainform = $("form:first");
        }
        if (mainform.valid()) {
            mainform.ajaxSubmit({
                dataType: 'json',
                success: success,
                beforeSubmit: function (formData, jqForm, options) {
                },
                beforeSend: function (a, b, c) {
                    PAGE_UTIL.showLoading('正在保存数据中...');
                },
                complete: function () {
                    PAGE_UTIL.hideLoading();
                },
                error: function (result) {
                    PAGE_UTIL.tip('发现系统错误 <BR />错误码：' + result.status);
                }
            });
        }
        function existInFormData(formData, name) {
            for (var i = 0, l = formData.length; i < l; i++) {
                var o = formData[i];
                if (o.name == name) {
                    return true;
                }
            }
            return false;
        }
    };

    //提示 验证错误信息
    PAGE_UTIL.showInvalid = function (validator) {
        validator = validator || PAGE_UTIL.validator;
        if (!validator) {
            return;
        }
        var message = '<div class="invalid">存在' + validator.errorList.length + '个字段验证不通过，请检查!</div>';
        //top.PAGE_UTIL.tip(message);
        $.ligerDialog.error(message);
    };

    //表单验证
    PAGE_UTIL.validate = function (form, options) {
        options = $.extend({
            errorPlacement: function (lable, element) {
                if (!element.attr("id")) {
                    element.attr("id", new Date().getTime());
                }
                if (element.hasClass("l-textarea")) {
                    element.addClass("l-textarea-invalid");
                } else if (element.hasClass("l-text-field")) {
                    element.parent().addClass("l-text-invalid");
                }
                $(element).removeAttr("title").ligerHideTip();
                $(element).attr("title", lable.html()).ligerTip({
                    distanceX: 5,
                    distanceY: -3,
                    auto: true
                });
            },
            success: function (lable) {
                if (!lable.attr("for")) return;
                var element = $("#" + lable.attr("for"));

                if (element.hasClass("l-textarea")) {
                    element.removeClass("l-textarea-invalid");
                } else if (element.hasClass("l-text-field")) {
                    element.parent().removeClass("l-text-invalid");
                }
                $(element).removeAttr("title").ligerHideTip();
            }
        }, options || {});
        return PAGE_UTIL._validateHandler(form, options);
    };
    PAGE_UTIL.validate_fao = function (form, options) {
        options = $.extend({
        	errorPlacement: function (lable, element) {
	            if (!element.attr("id")) {
	                element.attr("id", new Date().getTime());
	            }
	            $(element).attr("title", "");
	            $(element).poshytip('destroy');
	            if(lable.html()){
	                $(element).addClass("text-invalid").attr("title", lable.html()).poshytip({
	                    className: 'tip-yellowsimple',
	                    showOn: 'focus',
	                    alignTo: 'target',
	                    alignX: 'center',
	                    alignY: 'bottom',
	                    offsetX: 0,
	                    offsetY: 8
	                });
	            }
	       },
	       success:function(lable){
	           if (!lable.attr("for")) return;
	           var element = $("#" + lable.attr("for"));
	           // 调用 jquery.poshytip
	           $(element).removeAttr("title").poshytip('destroy');
	           $(element).removeClass("text-invalid").removeAttr("title").poshytip('destroy');

	       }
        }, options || {});
        return PAGE_UTIL._validateHandler(form, options);
    };
	//表单验证 依赖 jquery.poshytip
    PAGE_UTIL.validate_PoshyTip_omui = function(form, options) {
    	options = $.extend({
            errorPlacement: function (lable, element) {
            	if(element.is(":hidden")) {
            		var elementSiblingNode = element.siblings("input:first");
            		if(elementSiblingNode && element.attr("ligeruiid") === elementSiblingNode.attr("ligeruiid")) {
            			element = elementSiblingNode;
            		}
            	}
            	if (!element.attr("id")) {
            		element.attr("id", new Date().getTime());
            	}
        		if (element.hasClass("l-textarea")) {
        			element.addClass("l-textarea-invalid");
        		} else if (element.hasClass("l-text-field")) {
        			if(element.parent().hasClass("om-combo")) {
        				element.parent().parent().addClass("l-text-invalid");
        			} else {
        				element.parent().addClass("l-text-invalid");
        			}
	            }
                // 调用 jquery.poshytip
                $(element).attr("title", "");
                $(element).poshytip('destroy');
                $(element).attr("title", lable.html()).poshytip({
                	className: 'tip-yellowsimple',
                	showOn: 'focus',
                	alignTo: 'target',
                	alignX: 'inner-left',
                	alignY: 'bottom',
                	offsetX: 0,
                	offsetY: 8
                });
            },
            success: function (lable) {
                if (!lable.attr("for")) return;
                var element = $("#" + lable.attr("for"));
                if (element.hasClass("l-textarea")) {
                    element.removeClass("l-textarea-invalid");
                } else if (element.hasClass("l-text-field")) {
                	if(element.parent().hasClass("om-combo")) {
        				element.parent().parent().removeClass("l-text-invalid");
        			} else {
        				element.parent().removeClass("l-text-invalid");
        			}
                }
                // 调用 jquery.poshytip
                $(element).removeAttr("title").poshytip('destroy');
            }
        }, options || {});
    	return  PAGE_UTIL._validateHandler(form, options);
    };
	//表单验证 依赖 jquery.poshytip
    PAGE_UTIL.validate_PoshyTip = function (form, options) {
    	options = $.extend({
            errorPlacement: function (lable, element) {
            	if(element.is(":hidden")) {
            		var elementSiblingNode = element.siblings("input:first");
            		if(elementSiblingNode && element.attr("ligeruiid") === elementSiblingNode.attr("ligeruiid")) {
            			element = elementSiblingNode;
            		}
            	} else {
            		
            		if (element.hasClass("l-textarea")) {
            			element.addClass("l-textarea-invalid");
            		} else if (element.hasClass("l-text-field")) {
            			element.parent().addClass("l-text-invalid");
            		}
            	}
                if (!element.attr("id")) {
                    element.attr("id", new Date().getTime());
                }
                // 调用 jquery.poshytip
                $(element).attr("title", "");
                $(element).poshytip('destroy');
//                $(element).attr("title", lable.html()).poshytip();
                $(element).attr("title", lable.html()).poshytip({
                	className: 'tip-yellowsimple',
                	showOn: 'focus',
                	alignTo: 'target',
                	alignX: 'inner-left',
                	alignY: 'bottom',
                	offsetX: 0,
                	offsetY: 8
                });
            },
            success: function (lable) {
                if (!lable.attr("for")) return;
                var element = $("#" + lable.attr("for"));
                if (element.hasClass("l-textarea")) {
                    element.removeClass("l-textarea-invalid");
                } else if (element.hasClass("l-text-field")) {
                    element.parent().removeClass("l-text-invalid");
                }
                // 调用 jquery.poshytip
                $(element).removeAttr("title").poshytip('destroy');
            }
        }, options || {});
    	return PAGE_UTIL._validateHandler(form, options);
    };
    
    PAGE_UTIL._validateHandler = function (form, options) {
        if (typeof (form) == "string") {
            form = $(form);
        } else if (typeof (form) == "object" && form.NodeType == 1) {
            form = $(form);
        }

        options = options || {};
        PAGE_UTIL.validator = form.validate(options);
        return PAGE_UTIL.validator;
    };

    PAGE_UTIL.loadToolbar = function (grid, toolbarBtnItemClick) {
        var appCode = PAGE_UTIL.getPageAppCode();
        PAGE_UTIL.ajax({
            loading: '正在加载工具条中...',
            url: 'role_rights.do',
            method: 'getCurrentUserAuthByAppCode',
            data: { HttpContext: true, appCode: appCode },
            success: function (data) {
                if (!grid.toolbarManager) return;
                if (!data || !data.length) return;
                var items = [];
                for (var i = 0, l = data.length; i < l; i++) {
                    var o = data[i];
                    if(!o) continue;
	            	 if(o.line){
	                 	items[items.length] = {
	                 			line:true
	 	                    };
	                 }else{
	                    items[items.length] = {
	                        click: toolbarBtnItemClick,
	                        text: o.text,
	                        icon:o.icon,
	                       // img: rootPath + o.BtnIcon,
	                        id: o.id
	                    };
	                 }
	                // items[items.length] = { line: true };
                }
                grid.toolbarManager.set('items', items);
            }
        });
    };
    
    //获取当前用户的列表字段
    PAGE_UTIL.getCurrentUserGridColumn = function () {
        var appId = PAGE_UTIL.getQueryStringByName("appId");
        var result=[];
        var gridColumns=[];
        var gridColumn={};
        var render;
        $.ajax({ 
        	type:'POST',
        	async:false,
        	url: "role_rights.do?event=getCurrentUserAmsGridColumn", 
        	dataType:'json',
        	data:{appId:appId},
        	success: function(data){
        		result=data;
            }
        });
        
       $.each(result.data,function(){
    	   gridColumn={};
    	   gridColumn.display=this.displayName;
    	   gridColumn.width=this.width;
    	   gridColumn.minWidth=this.minWidth;
    	   if(this.itemRender=='1'){//需要itemrender函数
    		   render=window[this.columnName+"ItemRender"];
    		   if(render){
    			   gridColumn.render=render;
    		   }
    	   }
    	   if(this.showStatus=='2'){//固定列
    		   gridColumn.frozen=true;
    	   }
    	   gridColumn.isSort=this.sort=='1'?true:false;
    	   gridColumn.name=this.columnName;
    	   gridColumn.align=this.align;
    	   gridColumns.push(gridColumn);
       });
       gridColumns.push({display:'',width:100});//最后一列添加空列
       return gridColumns;
    };
    
	// 获取当前选择的tab页的tabid
    PAGE_UTIL.getCurrentTabId = function (tab) {
    	tab = tab || top.tab;
    	var tabid = "";
		if(tab) {
			tabid = tab.getSelectedTabItemID();
		}
		return tabid;
    };

    //关闭Tab项,如果tabid不指定，那么关闭当前显示的
    PAGE_UTIL.closeCurrentTab = function (tabid, tab) {
		tab = tab || top.tab;
		if(tab) {
			if (!tabid) {
				tabid = PAGE_UTIL.getCurrentTabId(tab);
			}
			tab.removeTabItem(tabid);
		}
    };
    //关闭Tab项且切换选择父窗口(不刷新)
    PAGE_UTIL.closeAndSelectParent = function (parentTabid, tabid) {
    	var tab = top.tab;
        PAGE_UTIL.closeCurrentTab(tabid, tab);
        if (tab && parentTabid) {
            tab.selectTabItem(parentTabid);
        }
    };
    //关闭Tab项并且刷新父窗口
    PAGE_UTIL.closeAndReloadParent = function (parentTabid, tabid) {
    	var tab = top.tab;
        PAGE_UTIL.closeCurrentTab(tabid, tab);
        if (tab && parentTabid) {
        	var iframe = window.frames[parentTabid];
            tab.selectTabItem(parentTabid);
            if (iframe && iframe.f_reload) {
            	iframe.f_reload();
            } else if (tab.reload) {
            	tab.reload(parentTabid);
            }
        }
    };

    //覆盖页面grid的loading效果
    PAGE_UTIL.overrideGridLoading = function () {
        $.extend($.ligerDefaults.Grid, {
            onloading: function () {
                PAGE_UTIL.showLoading('正在加载表格数据中...');
            },
            onloaded: function () {
                PAGE_UTIL.hideLoading();
            }
        });
    };

    //根据字段权限调整 页面配置
    PAGE_UTIL.adujestConfig = function (config, forbidFields) {
        if (config.Form && config.Form.fields) {
            for (var i = config.Form.fields.length - 1; i >= 0; i--) {
                var field = config.Form.fields[i];
                if ($.inArray(field.name, forbidFields) != -1) {
                    config.Form.fields.splice(i, 1);
                }
            }
        }
        if (config.Grid && config.Grid.columns) {
            for (var i = config.Grid.columns.length - 1; i >= 0; i--) {
                var column = config.Grid.columns[i];
                if ($.inArray(column.name, forbidFields) != -1) {
                    config.Grid.columns.splice(i, 1);
                }
            }
        }
        if (config.Search && config.Search.fields) {
            for (var i = config.Search.fields.length - 1; i >= 0; i--) {
                var field = config.Search.fields[i];
                if ($.inArray(field.name, forbidFields) != -1) {
                    config.Search.fields.splice(i, 1);
                }
            }
        }
    };

    //查找是否存在某一个按钮
    PAGE_UTIL.findToolbarItem = function (grid, itemID) {
        if (!grid.toolbarManager) {
            return null;
        }
        if (!grid.toolbarManager.options.items) {
            return null;
        }
        var items = grid.toolbarManager.options.items;
        for (var i = 0, l = items.length; i < l; i++) {
            if (items[i].id == itemID) return items[i];
        }
        return null;
    };

    //设置grid的双击事件(带权限控制)
    PAGE_UTIL.setGridDoubleClick = function (grid, btnID, btnItemClick) {
        btnItemClick = btnItemClick || toolbarBtnItemClick;
        if (!btnItemClick) {
            return;
        }
        grid.bind('dblClickRow', function (rowdata) {
            var item = PAGE_UTIL.findToolbarItem(grid, btnID);
            if (!item) {
                return;
            }
            grid.select(rowdata);
            btnItemClick(item);
        });
    };
    /**
     * 获取不超过窗口大小的高度和宽度,用于设置组件的高度宽度
     * 返回一个包含宽度高的的js对象
     */
    PAGE_UTIL.getOffset = function (width, height) {
    	if(typeof (width) === "object") {
    		height = temp.height;
    		width = temp.width;
    	}
    	return {"width": PAGE_UTIL.getWidth(width), "height": PAGE_UTIL.getHeight(height)};
    };
    /**
     * 获取不超过窗口大小的宽度,用于设置组件的宽度
     */
    PAGE_UTIL.getWidth = function(width) {
    	//浏览器当前窗口可视区域宽度
    	var windowWidth = $(window).width(); 
    	width = width || 900;
    	if(windowWidth <= width) {
    		width = windowWidth - 20;
    	}
    	return width;
    };
    /**
     * 获取不超过窗口大小的宽度,用于设置组件的宽度
     */
    PAGE_UTIL.getHeight = function(height) {
    	//浏览器当前窗口可视区域高度 
    	var windowHeight = $(window).height();
    	height = height || 700;
    	if(windowHeight <= height) {
    		height = windowHeight - 20;
    	}
    	return height;
    };
})(jQuery);