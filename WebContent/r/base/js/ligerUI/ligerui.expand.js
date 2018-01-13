/*
默认参数 扩展
*/
$.extend($.ligerDefaults.Grid, {
    checkbox: true,
    rownumbers: true,
    allowUnSelectRow: true,
    isPressCtrlMultiSelect: false,
    pageSize: 20,
    pageSizeOptions: [20, {'name':'全部', 'value': 0}],
    onError: function (result, msg) {
        PAGE_UTIL.tip('发生系统错误 -- ' + msg);
    }
});

$.extend($.ligerDefaults.Tab, {
    contextmenu: false
});
/*
 * 表单 扩展
 */
$.extend($.ligerDefaults.TextBox, {
    defValue: '' // 添加一个默认值.当输入验证失败时重置为这个默认值
});
$.extend($.ligerui.controls.TextBox.prototype, {
	checkValue: function ()
    {
        var g = this, p = this.options;
        var v = g.inputText.val();
        if (p.number && !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(v) || p.digits && !/^\d+$/.test(v))
        {
            g.inputText.val(g.value || p.defValue);
            return;
        } 
        g.value = v;
    }
});

/*
表格 扩展
*/
$.extend($.ligerui.controls.Grid.prototype, {
    _initBuildHeader: function () {
        var g = this, p = this.options;
        if (p.title) {
            $(".l-panel-header-text", g.header).html(p.title);
            if (p.headerImg) {
            	g.header.append("<img src='" + p.headerImg + "' />").addClass("l-panel-header-hasicon");
            }
        } else {
            g.header.hide();
        }
        if (p.toolbar) {
            if ($.fn.ligerToolBar) {
            	g.toolbarManager = g.topbar.ligerToolBar(p.toolbar);
            }
        } else {
            g.topbar.remove();
        }
    },
    _initFootbar: function () {
        var g = this, p = this.options;
        if (p.usePager) {
            //创建底部工具条 - 选择每页显示记录数
            var optStr = "";
            var selectedIndex = -1;
            $(p.pageSizeOptions).each(function (i, item) {
                if(typeof (item) === "object") {
                	if (p.pageSize == item.value) {
                		selectedIndex = i;
                	}
                    if(0 < item.value || "local" !== p.dataAction) {
                        optStr += "<option value='" + item.value + "'>" + item.name + "</option>";
                    }
                } else {
                	if (p.pageSize == item) {
                		selectedIndex = i;
                	}
                	optStr += "<option value='" + item + "' >" + item + "</option>";
                }
            });
            $('.l-bar-selectpagesize', g.toolbar).append("<select name='rp'>" + optStr + "</select>");
            if (selectedIndex != -1) {
            	$('.l-bar-selectpagesize select', g.toolbar)[0].selectedIndex = selectedIndex;
            }
            if (p.switchPageSizeApplyComboBox && $.fn.ligerComboBox) {
                $(".l-bar-selectpagesize select", g.toolbar).ligerComboBox({
                    onBeforeSelect: function () {
                        if (p.url && g.isDataChanged && !confirm(p.isContinueByDataChanged)) {
                        	return false;
                        }
                        return true;
                    },
                    width: 45
                });
            }
        } else {
            g.toolbar.hide();
        }
    },
    _buildPager: function() {
        var g = this, p = this.options;
        $('.pcontrol input', g.toolbar).val(p.page);
        if (!p.pageCount || p.pageCount === Infinity || p.pageCount === -Infinity){
        	p.pageCount = 1;
        }
        $('.pcontrol span', g.toolbar).html(p.pageCount);
        if (!p.total) p.total = 0;
        var r1 = 0;
        var r2 = 0;
        if(p.pageSize < 1) {
        	p.pageSize = p.total;
        	r1 = 1;
        	r2 = p.total;
        } else {
        	r1 = parseInt((p.page - 1) * p.pageSize) + 1.0;
        	r2 = parseInt(r1) + parseInt(p.pageSize) - 1;
        	if (p.total < r2) r2 = p.total;
        	if (!p.total) r1 = r2 = 0;
        	if (r1 < 0) r1 = 0;
        	if (r2 < 0) r2 = 0;
        }
        var stat = p.pageStatMessage;
        stat = stat.replace(/{from}/, r1);
        stat = stat.replace(/{to}/, r2);
        stat = stat.replace(/{total}/, p.total);
        stat = stat.replace(/{pagesize}/, p.pageSize);
        $('.l-bar-text', g.toolbar).html(stat);
        if (!p.total) {
            $(".l-bar-btnfirst span,.l-bar-btnprev span,.l-bar-btnnext span,.l-bar-btnlast span", g.toolbar)
                .addClass("l-disabled");
        }
        if (p.page == 1) {
            $(".l-bar-btnfirst span", g.toolbar).addClass("l-disabled");
            $(".l-bar-btnprev span", g.toolbar).addClass("l-disabled");
        } else if (p.page > p.pageCount && p.pageCount > 0) {
            $(".l-bar-btnfirst span", g.toolbar).removeClass("l-disabled");
            $(".l-bar-btnprev span", g.toolbar).removeClass("l-disabled");
        }
        if (p.page == p.pageCount) {
            $(".l-bar-btnlast span", g.toolbar).addClass("l-disabled");
            $(".l-bar-btnnext span", g.toolbar).addClass("l-disabled");
        } else if (p.page < p.pageCount && p.pageCount > 0) {
            $(".l-bar-btnlast span", g.toolbar).removeClass("l-disabled");
            $(".l-bar-btnnext span", g.toolbar).removeClass("l-disabled");
        }
    },
    addEditRow: function (rowdata) {
        var g = this;
        rowdata = g.add(rowdata);
        return g.beginEdit(rowdata);
    },
    getEditingRow: function () {
        var g = this;
        for (var i = 0, l = g.rows.length; i < l; i++) {
            if (g.rows[i]._editing) return g.rows[i];
        }
        return null;
    },
    getChangedRows: function () {
        var g = this, changedRows = [];
        pushRows(g.getDeleted(), 'delete');
        pushRows(g.getUpdated(), 'update');
        pushRows(g.getAdded(), 'add');
        return changedRows;
        function pushRows(rows, status) {
            if (!rows || !rows instanceof Array) return;
            for (var i = 0, l = rows.length; i < l; i++) {
                changedRows.push($.extend({}, rows[i], { __status: status }));
            }
        }
    },
    select: function (rowParm)
    {
        var g = this, p = this.options;
        var rowdata = g.getRow(rowParm);
        var rowid = rowdata['__id'];
        var rowobj = g.getRowObj(rowid);
        var rowobj1 = g.getRowObj(rowid, true);
        if (!g.enabledCheckbox() && !(p.isPressCtrlMultiSelect && g.ctrlKey)) //单选
        {
            for (var i in g.selected)
            {
                var o = g.selected[i];
                if (o['__id'] in g.records)
                {
                    $(g.getRowObj(o)).removeClass("l-selected l-selected-again");
                    if (g.enabledFrozen())
                        $(g.getRowObj(o, true)).removeClass("l-selected l-selected-again");
                }
            }
            g.selected = [];
        }
        if (rowobj) $(rowobj).addClass("l-selected");
        if (rowobj1) $(rowobj1).addClass("l-selected");
        g.selected[g.selected.length] = rowdata;
        g.trigger('selectRow', [rowdata, rowid, rowobj]);
    },
    unSelectAll: function() {
    	var g = this;
    	var selectRows = g.getSelectedRows();
    	if(selectRows) {
    		$.each(selectRows, function(index, rowData){
    			g.unselect(rowData);
    		});
    	}
    }
});

/*
    表格格式化函数扩展
*/
//扩展 percent 百分比 类型的格式化函数(0到1之间)
$.ligerDefaults.Grid.formatters['percent'] = function (value, column) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    var precision = column.editor.precision || 0;
    return (value * 100).toFixed(precision) + "%";
};

//扩展 numberbox 类型的格式化函数
$.ligerDefaults.Grid.formatters['numberBox'] = function (value, column) {
    var precision = column.editor.precision || 0;
    return value.toFixed(precision);
};
//扩展currency(货币)类型的格式化函数
$.ligerDefaults.Grid.formatters['currency'] = function (num, column) {
    //num 当前的值
    //column 列信息
    if (!num) return "0.00";
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0.00";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    return "" + (((sign) ? '' : '-') + '' + num + '.' + cents);
};

/*
    表格编辑器
*/
//扩展一个 百分比输入框 的编辑器(0到1之间)
$.ligerDefaults.Grid.editors['percent'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision || 0;
        var input = $("<input type='text' style='text-align:right' class='l-text' />");
        input.bind('keypress', function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 8;
        });
        input.bind('blur', function () {
            var showVal = input.val();
            showVal.replace('%', '');
            input.val(parseFloat(showVal).toFixed(precision));
        });
        container.append(input);
        return input;
    },
    getValue: function (input, editParm) {
        var showVal = input.val();
        showVal.replace('%', '');
        var value = parseFloat(showVal) * 0.01;
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        return value;
    },
    setValue: function (input, value, editParm) {
        var column = editParm.column; 
        var precision = column.editor.precision || 0;
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        var showVal = (value * 100).toFixed(precision) + "%";
        input.val(showVal);
    },
    resize: function (input, width, height, editParm) {
        input.width(width).height(height);
    }  
};

//扩展一个 数字输入 的编辑器
$.ligerDefaults.Grid.editors['numberBox'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision;
        var input = $("<input type='text' style='text-align:right' class='l-text' />");
        input.bind('keypress', function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 8;
        });
        input.bind('blur', function () {
            var value = input.val();
            input.val(parseFloat(value).toFixed(precision));
        });
        container.append(input);
        return input;
    },
    getValue: function (input, editParm) {
        return parseFloat(input.val());
    },
    setValue: function (input, value, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision;
        input.val(value.toFixed(precision));
    },
    resize: function (input, width, height, editParm) { 
        input.width(width).height(height);
    }
};

$.ligerDefaults.Grid.editors['date'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var input = $("<input type='text'/>");
        container.append(input);
        var options = {};
        var ext = column.editor.p || column.editor.ext;
        if (ext) {
            var tmp = (typeof (ext) == 'function') ? ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
            $.extend(options, tmp);
        }
        input.ligerDateEditor(options);
        return input;
    },
    getValue: function (input, editParm) {
        return input.liger('option', 'value');
    },
    setValue: function (input, value, editParm) {
        input.liger('option', 'value', value);
    },
    resize: function (input, width, height, editParm) {
        input.liger('option', 'width', width);
        input.liger('option', 'height', height);
    },
    destroy: function (input, editParm) {
        input.liger('destroy');
    }
};
$.ligerDefaults.Grid.editors['string'] = $.ligerDefaults.Grid.editors['text'] = {
    create: function (container, editParm) {
        var input = $("<input type='text' style='border:1px solid #d3d3d3;'/>");
        container.append(input);
        return input;
    },
    getValue: function (input, editParm) {
        return input.val();
    },
    setValue: function (input, value, editParm) {
        input.val(value);
    },
    resize: function (input, width, height, editParm) {
        input.width(width).height(21);
    }
};
$.ligerDefaults.Grid.editors['select'] =
$.ligerDefaults.Grid.editors['combobox'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var input = $("<input type='text'/>");
        container.append(input);
        var options = {
            data: column.editor.data,
            slide: false,
            valueField: column.editor.valueField || column.editor.valueColumnName,
            textField: column.editor.textField || column.editor.displayColumnName
        };
        var ext = column.editor.p || column.editor.ext;
        if (ext) {
            var tmp = (typeof (ext) == 'function') ? ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
            $.extend(options, tmp);
        }
        input.ligerComboBox(options);
        return input;
    },
    getValue: function (input, editParm) {
        return input.liger('option', 'value');
    },
    setValue: function (input, value, editParm) {
        input.liger('option', 'value', value);
    },
    resize: function (input, width, height, editParm) {
        input.liger('option', 'width', width - 7);
        input.liger('option', 'height', height);
    },
    destroy: function (input, editParm) {
        input.liger('destroy');
    }
};

$.ligerDefaults.Grid.editors['int'] =
$.ligerDefaults.Grid.editors['float'] =
$.ligerDefaults.Grid.editors['spinner'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var input = $("<input type='text'/>");
        container.append(input);
        input.css({ border: '#6E90BE' });
        var options = $.extend({
            type: column.editor.type == 'float' ? 'float' : 'int'
        }, column.editor.options);
        if (column.editor.minValue != undefined) options.minValue = column.editor.minValue;
        if (column.editor.maxValue != undefined) options.maxValue = column.editor.maxValue;
        input.ligerSpinner(options);
        return input;
    },
    getValue: function (input, editParm) {
        var column = editParm.column;
        var isInt = column.editor.type == "int";
        if (isInt) {
        	return parseInt(input.val(), 10);
        } else {
        	return parseFloat(input.val());
        }
    },
    setValue: function (input, value, editParm) {
        input.liger('option', 'value', value);
    },
    resize: function (input, width, height, editParm) {
        input.liger('option', 'width', width);
        input.liger('option', 'height', height);
    },
    destroy: function (input, editParm) {
        input.liger('destroy');
    }
};

$.ligerDefaults.Grid.editors['string'] =
$.ligerDefaults.Grid.editors['text'] = {
    create: function (container, editParm) {
        var input = $("<input type='text' class='l-text-editing'/>");
        if (typeof (editParm.column.validate) == "string") {
            input.attr("validate", editParm.column.validate);
        } else if (editParm.column.validate && typeof (editParm.column.validate) == "object") {
            input.attr("validate", JSON2.stringify(editParm.column.validate));
        }
        if (editParm.grid) {
            var id = editParm.grid.id + "_editor_" + editParm.grid.editorcounter++ + "_" + new Date().getTime();
            input.attr("name", id).attr("id", id);
        }
        container.append(input);
        input.ligerTextBox();
        return input;
    },
    getValue: function (input, editParm) {
        return input.val();
    },
    setValue: function (input, value, editParm) {
        input.val(value);
    },
    resize: function (input, width, height, editParm) {
        input.liger('option', 'width', width - 8);
        input.liger('option', 'height', 19);
    },
    destroy: function (input, editParm) {
        input.liger('destroy');
    }
};

//扩展 ligerGrid 的 搜索功能(高级自定义查询)
$.ligerui.controls.Grid.prototype.showFilter = function () {
    var g = this, p = this.options;
    if (g.winfilter) {
        g.winfilter.show();
        return;
    }
    var filtercontainer = $('<div id="' + g.id + '_filtercontainer"></div>').width(380).height(120).hide();
    var fields = [];
    $(g.columns).each(function () {
        var o = { name: this.name, display: this.display };
        var isNumber = this.type == "int" || this.type == "number" || this.type == "float";
        var isDate = this.type == "date";
        if (isNumber) o.type = "number";
        if (isDate) o.type = "date";
        if (this.editor) {
            o.editor = this.editor;
        }
        fields.push(o);
    });
    var filter = filtercontainer.ligerFilter({ fields: fields });
    g.winfilter = $.ligerDialog.open({
    	width: 420, height: 208, target: filtercontainer, isResize: true, top: 50,
        buttons: [
              {text: '确定', onclick: function (item, dialog) { loadFilterData(); dialog.hide(); } },
              {text: '取消', onclick: function (item, dialog) { dialog.hide(); } }
        ]
    });

    var historyPanle = $('<div class="historypanle"><select class="selhistory"><option value="0">历史查询记录</options></select><input type="button" value="删除" class="deletehistory" /><input type="button" value="保存" class="savehistory" /></div>');
    filtercontainer.append(historyPanle);

    var historySelect = $(".selhistory", historyPanle).change(function () {
        if (this.value == "0") {
        	return;
        }
        var rule = getHistoryRule(this.value);
        if (rule) {
        	filter.setData(rule);
        }
    });

    $(".deletehistory", historyPanle).click(function () {
        if (historySelect.val() == "0") return;
        $.ligerDialog.confirm('确定删除吗', function (yes) {
            if (yes) {
                removeHistory(historySelect.val());
                reLoadHistory();
            }
        });
    });

    $(".savehistory", historyPanle).click(function () {
        $.ligerDialog.prompt('输入保存名字', JSON2.stringify(new Date()).replace(/["-\.:]/g, ''), false, function (yes, name) {
            if (yes && name) {
                addHistory(name);
                reLoadHistory();
                historySelect.val(name);
            }
        });
    });

    reLoadHistory(); 

    function getKey() { 
        return encodeURIComponent(p.url.replace(/(.+)?view=/, ''));
    }

    function reLoadHistory() {
        historySelect.html('<option value="0">历史查询记录</options>');
        var key = getKey();
        var history = PAGE_UTIL.cookies.get(key);
        if (history) {
            var data = JSON.parse(history);
            $(data).each(function () {
                historySelect.append('<option value="' + this.name + '">' + this.name + '</options>');
            });
        }
    }
    function removeHistory(name) {
        var key = getKey();
        var data;
        var history = PAGE_UTIL.cookies.get(key);
        if (history) {
            data = JSON.parse(history);
            for (var i = 0, l = data.length; i < l; i++) {
                if (data[i].name == name) {
                    data.splice(i, 1);
                    PAGE_UTIL.cookies.set(key, JSON.stringify(data));
                    return;
                }
            }
        }
    }

    function addHistory(name) {
        var key = getKey();
        var data;
        var history = PAGE_UTIL.cookies.get(key);
        if (history) {
            data = JSON.parse(history);
            data.push({ name: name, value: filter.getData() });
        } else {
            data = [{ name: name, value: filter.getData()}];
        }
        PAGE_UTIL.cookies.set(key, JSON.stringify(data));
    }

    function getHistoryRule(name) {
        var key = getKey();
        var history = PAGE_UTIL.cookies.get(key);
        if (history) {
            var data = JSON.parse(history);
            for (var i = 0, l = data.length; i < l; i++) {
                if (data[i].name == name) {
                	return data[i].value;
                }
            }
        }
        return null;
    }

    function loadFilterData() {
        var data = filter.getData();
        if (data && data.rules && data.rules.length) {
            g.set('parms', { where: JSON.stringify(data) });
        } else {
            g.set('parms', {});
        }
        g.loadData();
    }
};

/*
表单 扩展
*/
/**
 * 设置默认表单参数
 */
$.extend($.ligerDefaults.Form, {
	labelAlign : 'right',
	toJSON : JSON.stringify/**  注意:需要要引用json2.js **/
});
$.extend($.ligerui.controls.Form.prototype, {
	checkNotNull: function () {
		var g = this, p = this.options;
		if (p.nullText && !p.disabled) {
			if (!g.inputText.val()) {
				g.inputText.addClass("l-text-field-null").val(p.nullText);
			}
		}
	},
	_buliderSpaceContainer: function (field) {
		var g = this, p = this.options;
		var spaceWidth = field.space || field.spaceWidth || p.space;
		var out = [];
		out.push('<li style="');
		if (spaceWidth) {
			out.push('width:' + spaceWidth + 'px;');
		}
		out.push('">');
		if ((field.validate && field.validate.required) || field.required) {
			out.push('<div style="color:red;margin-left:2px;">*</div>');
		}
		out.push('</li>');
		return out.join('');
	}
});

/**
 * 窗口扩展
 */
$.extend($.ligerDefaults.Dialog, {
	isDrag: false
});


//扩展 DateEditor 的updateStyle方法
$.ligerui.controls.DateEditor.prototype.updateStyle = function () {
    var g = this, p = this.options;
    //Grid的date默认格式化函数就有对日期的处理
    var v = $.ligerDefaults.Grid.formatters['date'](g.inputText.val(), { format: p.format });
    g.inputText.val(v);
};
//覆盖 DateEditor 的isDateTime方法
$.ligerui.controls.DateEditor.prototype.isDateTime = function (dateStr) {
    var g = this, p = this.options;
    if (p.format == "MM/dd/yyyy") {
        var r = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/);
        if (r == null) return false;
        var d = new Date(r[3], r[1] - 1, r[2]);
        if (d == "NaN") return false;
        return (d.getFullYear() == r[3] && (d.getMonth() + 1) == r[1] && d.getDate() == r[2]);
    } else {
        var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) return false;
        var d = new Date(r[1], r[3] - 1, r[4]);
        if (d == "NaN") return false;
        return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
    } 
};
$.ligerui.controls.DateEditor.prototype._bulidDate = function (dateStr) {
	var g = this, p = this.options;
    if (p.format == "MM/dd/yyyy") {
        var r = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/);
        if (r == null) return null;
        return new Date(r[3], r[1] - 1, r[2]);
    } else {
        var r = dateStr.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) return null;
        return new Date(r[1], r[3] - 1, r[4]); 
    }
};
/*
    下拉框 combobox  --- 待完善
*/
$.extend($.ligerui.controls.ComboBox.prototype, {
    _setHeight: function (value) {
        var g = this;
        if (value > 10) {
            g.wrapper.height(value);
            g.inputText.height(value);
            g.link.height(value);
            g.textwrapper.css({ width: value });
        }
    },
    _setReadonly: function (value) {
    	this.wrapper.addClass('l-text-disabled');
    },
    updateSelectBoxPosition: function () {
        var g = this, p = this.options;
        var winHeight = $(window).height();
        var wrapperOffset = g.wrapper.offset();
        var textHeight = g.wrapper.outerHeight();
        var topHeight = wrapperOffset.top - $(window).scrollTop();
        var selectBoxHeight = g.selectBox.height() + 4;
        var selfheight = selectBoxHeight + textHeight;
        if (p.absolute) {
        	var selectBoxTop;
            /**
             * 设定如果下拉框组件所在位置下面高度容纳不了下拉框则将下拉框打开在下拉框组件上方
             */
            if(winHeight - topHeight < selfheight && topHeight > selectBoxHeight) {
            	selectBoxTop = wrapperOffset.top - selectBoxHeight;
            } else {
            	selectBoxTop = wrapperOffset.top + textHeight + 1;
            }
            g.selectBox.css({ left: wrapperOffset.left, top: selectBoxTop});
        } else {
            if (topHeight + selfheight > winHeight && topHeight > selfheight) {
                g.selectBox.css("marginTop", -1 * (g.selectBox.height() + textHeight + 5));
            }
        }
    }
});
//下拉框 加载文本值(有的时候在数据库只是返回了id值，并没有加载文本值，需要调用这个方法，远程获取)
$.ligerui.controls.ComboBox.prototype.loadText = function (options) {
    var g = this, p = this.options;
    options = $.extend({
        url: 'data.do',
        view: null,
        idfield: null,
        textfield: null,
        success: function () { }
    }, options || {});
    var value = options.value || g.getValue();
    var where = { op: 'and', rules: [
        { field: options.idfield, op: 'equal', value: value }
    ]};
    $.ajax({
        cache: false,
        async: true,
        dataType: 'json', type: 'post',
        url: options.url,
        data: {
            view: options.view,
            idfield: options.idfield,
            textfield: options.textfield,
            where: JSON.stringify(where)
        },
        success: function (data) { 
            if (!data || !data.length) return;
            g._changeValue(data[0]['id'], data[0]['text']);
            options.success(data);
        }
    });
};
//使下拉框支持 在弹出窗口在选择
$.ligerui.controls.ComboBox.prototype.openSelect = function (options) { 
    var g = this, p = this.options;
    options = $.extend({
        title: '选择数据',     //窗口标题
        width: 800,            //窗口宽度     
        height: 420,           //窗口高度
        top: null,
        left: null,
        valueField: null,    //接收表格的value字段名
        textField: null,    //接收表格的text字段名
        grid: null,          //表格的参数 同ligerGrid
        form: null            //搜索表单的参数 同ligerForm
    }, options || {});

    //需要指定表格参数
    if (!options.grid) return;
    g.wrapper.addClass("l-text-openselect");
    //三个 ligerui 对象
    var win, grid, form;

    g.bind('beforeOpen', function () {
        show();
        return false;
    });

    function getGridHeight() {
        if (options.grid.height) return options.grid.height;
        var height = options.height - 60;
        if (options.search)
        {
            height -= 55;
        }
        return height;
    }

    function show() {
        if (win) {
            win.show();
        } else {
            var panle = $("<div></div>");
            var formPanle = $("<form></form>");
            var gridPanle = $("<div></div>");

            panle.append(formPanle).append(gridPanle);

            options.grid.width = options.grid.width || "99%";
            options.grid.height = getGridHeight();

            //grid
            grid = gridPanle.ligerGrid(options.grid);

			grid.bind('dblClickRow', function (rowdata) { 
				grid.select(rowdata);
				toSelect(); 
				win.hide();
			});
		
            //dialog
            win = $.ligerDialog.open({
                title: options.title,
                width: options.width,
                height: options.height,
                top: options.top,
                left: options.left,
                target: panle,
                buttons: [
                      { text: '选择', onclick: function (item, dialog) { toSelect(); dialog.hide(); } },
                      { text: '取消', onclick: function (item, dialog) { dialog.hide(); } }
                ]
            });
            if (options.search) {
                //搜索
                form = formPanle.ligerForm(options.search);
                //搜索按钮、高级搜索按钮 
                var containerBtn1 = $('<li style="margin-right:9px"></li>');
                var containerBtn2 = $('<li></li>');
                $("ul:first", formPanle).append(containerBtn1).append(containerBtn2).after('<div class="l-clear"></div>');
                PAGE_UTIL.addSearchButtons(formPanle, grid, containerBtn1, containerBtn2);
            } else {
                formPanle.remove();
            }
        }
    }

    function toSelect() {
        var selected = grid.selected;
        var appended = false; 
        var ids = "", texts = "";
        $(selected).each(function () {
            if (appended) ids += p.split;
            ids += this[options.valueField];
            texts += this[options.textField];
            appended = true;
        });
        g._changeValue(ids, texts);
    }
};