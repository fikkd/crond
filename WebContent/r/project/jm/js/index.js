(function($) {
	$(function() {
		var jmGrid = undefined;
		var job_keyword = undefined;
		var headDp;
		var headDpEl;
		initHeadDpEl();
		var headDp_ins;
		var headDpEl_ins;
		initHeadDpEl_ins();
		var isexecuting = -1;
		var instance_status = -1;
		initJmGrid();
		var jmLayer = $.initCusLayer(jmLayer_cb, 'jm');
		// 变更时执行的回调函数
		function jmLayer_cb(args) {
			initJmGrid();// 菜单变更后是否需要刷新当前列表
		}
		// 任务调度信息页面展示
		function showJobDetail(jobID, isView) {
			var url = BASEPATH + "jm/toJmEdit.do", title;
			if (jobID && !isView) {
				url += "?id=" + jobID;
				title = '编辑任务调度';
			} else if (jobID && isView) {
				url += "?id=" + jobID + "&isView=" + isView;
				title = '查看任务调度';
			} else {
				title = '新建任务调度';
			}
			jmLayer.show({
				content : url,
				title : title,
				shade : [ 0 ],
				area : [ '650px', '570px' ]
			});
		}

		// 新建任务
		$('#newJobBtn').click(newJob);
		function newJob() {
			showJobDetail();
		}
		// 启动任务
		function startJob() {
			if (!jmGrid)
				return;
			var chks = jmGrid.getCheckedRows();
			if (chks.length && chks.length == 1) {
				$.fn.request(BASEPATH + 'jm/startjob.json?jobID=' + chks[0].id,
						function() {
							layer.msg('任务启动成功');
							jmGrid.resetData();
						}, {}, true);
			} else {
				$.showValiTip(this, '请选中一个任务');
			}
		}
		// 停止任务
		function stopJob() {
			if (!jmGrid)
				return;
			var chks = jmGrid.getCheckedRows();
			if (chks.length && chks.length == 1) {
				$.fn.request(BASEPATH + 'jm/stopjob.json?jobID=' + chks[0].id,
						function() {
							layer.msg('任务已停止');
							jmGrid.resetData();
						}, {}, true);
			} else {
				$.showValiTip(this, '请选中一个任务');
			}
		}
		// 运行情况
		function runJob() {
			if (!jmGrid)
				return;
			var chks = jmGrid.getCheckedRows();
			if (chks.length && chks.length == 1) {
				if (chks[0].isexecuting == 1) {
					var group = chks[0].job_group;
					var name = chks[0].job_name;
					$.fn.request(BASEPATH + 'jm/valideRunJob.json?job_group='
							+ group + '&job_name=' + name, function(data) {
						if (data) {
							jmck(group, name);
						} else {
							layer.msg('当前任务实例已不存在');
							jmGrid.resetData();
						}
					}, {}, true);

				} else {
					$.showValiTip(this, '当前任务无实例');
				}
			} else {
				$.showValiTip(this, '请选中一个任务');
			}
		}
		function jmck(group, name) {
			var url = BASEPATH + "jm/toJmRuningtimePage.do?job_group=" + group
					+ "&job_name=" + name, title = '任务调度查看';
			jmLayer.show({
				content : url,
				title : title,
				shade : [ 0 ],
				area : [ '650px', '200px' ]
			});
		}

		// 关键字查询
		$("#queryJobBtn").click(queryJob);
		function queryJob() {
			job_keyword = $('#queryJobTxt').val().trim();
			initJmGrid();
		}

		/**
		 * 初始化表格
		 */
		function initJmGrid() {
			var jmGridEl = $('#jmGrid'), per = 10;// 默认每页显示 10 条数据
			var args = {
				'queryParm' : job_keyword,
				'isexecuting' : isexecuting,
				'instance_status' : instance_status
			};
			if (!jmGrid) {// 初始化
				jmGrid = jmGridEl.initGrid({
					url : BASEPATH + 'jm/getJobList.json',
					args : args,
					cols : [ { 
						field : 'job_group',title : '分组名称',width : '150px'}, {
						field : 'job_name',title : '任务名称',width : '150px'}, {
						field : 'job_full_bean',title : '作业类',showTip : true,width : '200px',render : class_renderCtrl}, {
						field : 'description',title : '任务描述',showTip : true}, {
						field : 'instance_status',title : '运行状态',align : 'center',width : '150px',render : instance_statusCtrl}, {
						field : '',name : 'ctrl',title : '操作',width : '130px',align : 'center',render : jmGrid_renderCtrl
					} ],
					showno : true,
					singleChk : true,
					page : {
						percount : per,
						perList : [ 10, 20, 50 ]
					},
					callback : {
						cell : {
							'ctrl' : {'click' : jmGrid_cellCtrl_click},
							'ins' : {'click' : jmGrid_instance_click}
						},
						row : {// 行事件						    
						    click: jmGrid_rowCtrl_click
						}
					}
				});
				$('#jmGrid').on('click.isexecuting', 'th[data-name="isexecuting"] .listtable-dp', function() {
					if (headDp) {
						headDp.show();
					} else {
						headDp = $(this).dropdown({
							cont : headDpEl,
							adjust : false,
							pos : 'bottom-right'
						});
					}
				});
				$('#jmGrid').on('click.ins', 'th[data-name="ins"] .listtable-dp', function() {
					if (headDp_ins) {
						headDp_ins.show();
					} else {
						headDp_ins = $(this).dropdown({
							cont : headDpEl_ins,
							adjust : false,
							pos : 'bottom-right'
						});
					}
				});
			} else {// 刷新数据
				jmGrid.resetData({
					args : args
				});
			}
		}

		function initHeadDpEl() {
			headDpEl = $('<ul class="treeDropdown">'
					+ '<li data-val="-1">全部</li>' + '<li data-val="1">存在</li>'
					+ '<li data-val="0">不存在</li>' + '</ul>');
			headDpEl.on('click.treeDropdown', 'li', headDpCb_click);// 用户菜单点击事件
		}
		function headDpCb_click() {
			var elType = $(this).attr('data-val');
			if (elType == '0') {
				isexecuting = 0;
			} else if (elType == '1') {
				isexecuting = 1;
			} else {
				isexecuting = -1;
			}
			initJmGrid();
			headDp && headDp.close();
		}
		function initHeadDpEl_ins() {
			headDpEl_ins = $('<ul class="treeDropdown">'
					+ '<li data-val="-1">全部</li>' + '<li data-val="1">异常</li>'
					+ '<li data-val="0">正常</li>' + '</ul>');
			headDpEl_ins.on('click.instance_status', 'li', headDpCb_click_ins);// 用户菜单点击事件
		}
		function headDpCb_click_ins() {
			var elType = $(this).attr('data-val');
			if (elType == '0') {
				instance_status = 0;
			} else if (elType == '1') {
				instance_status = 1;
			} else {
				instance_status = -1;
			}
			initJmGrid();
			headDp_ins && headDp_ins.close();
		}

		// 操作单元格单击事件
		function jmGrid_instance_click(e, val, row, i) {			
			var trigger = $(e.target), elType = trigger.attr('data-val');
			if (elType == 'instance') {
				showJobInstance(row.id);
			}
		}
		var jmCloseLayer = $.initCusLayer(function jmCloseLayer_cb(args) {
		}, 'closejm');
		// 任务调度信息页面展示
		function showJobInstance(jobID) {
			var url = BASEPATH + "jm/toJmInstance.do?id=" + jobID, title = '异常信息查看';
			jmCloseLayer.show({
				content : url,
				title : title,
				shade : [ 0 ],
				area : [ '650px', '570px' ]
			});
		}
		// 作业类
		function class_renderCtrl(val, row, i, datalist) {
			if (row.isjobclass == 1) {
				var clname = row.job_class_name;
				var clArr = clname.split('.');
				return '<div title="' + row.job_class_name + '">'
						+ clArr[clArr.length - 1] + '</div>';
			} else {
				var bean = row.job_bean_name + "." + row.job_method_name + "()";
				return '<div title="' + bean + '">' + bean + '</div>';
			}
		}
		// 运行状态【-1未运行 0-正常运行 1-异常】
		function instance_statusCtrl(val, row, i, datalist) {
			switch (row.instance_status) {
			case -1:
				return '<div class="stat-bg-green">未运行</div>';
				break;
			case 0:
				return '<div class="stat-bg-green">正常运行</div>';
				break;
			case 1:
				return '<div class="stat-bg-green">异常</div>';
				break;
			}
		}
		// 操作单元格 render
		function jmGrid_renderCtrl(val, row, i, datalist) {
			return '<span class="fa fa-search" data-val="view" title="查看"></span>'
					+ '<span class="fa fa-edit" data-val="edit" title="修改"></span>'
					+ '<span class="fa fa-remove" data-val="remove" title="删除"></span>';
		}
		// 操作单元格单击事件
		function jmGrid_cellCtrl_click(e, val, row, i) {
			var trigger = $(e.target), elType = trigger.attr('data-val');
			if (elType == 'view') {
				showJobDetail(row.id, true);
			} else if (elType == 'edit') {
				showJobDetail(row.id);
			} else if (elType == 'remove') {
				showJobRemove(row.id, row.job_name);
			}
		}
		// 行事件【-1未运行 0-正常运行 1-异常】
		function jmGrid_rowCtrl_click(e, row, i) {
			switch (row.instance_status) {
			case -1:
				btnDisplay(0, 0, 1, 1);
				break;
			case 0:
				btnDisplay(0, 1, 0, 0);
				break;
			case 1:
				btnDisplay(0, 1, 0, 0);
				break;
			}
		}
		
		function btnDisplay(nez, start, stop, run) {
			var arr = [nez, start, stop, run]; // 1-隐藏 0-显示
			if (arr[0]==0) {
				$("#newJobBtn").removeClass('disabled');
			}		 
			if (arr[1]==0) {
				$("#startJobBtn").removeClass('disabled');
				$('#startJobBtn').click(startJob);// 启动任务
			} else if (arr[1]==1) {
				$("#startJobBtn").addClass('disabled');				
				$('#startJobBtn').unbind();
			}
			if (arr[2]==0) {
				$("#stopJobBtn").removeClass('disabled');
				$('#stopJobBtn').click(stopJob);// 停止任务
			} else if (arr[2]==1) {
				$("#stopJobBtn").addClass('disabled');				
				$('#stopJobBtn').unbind();
			}
			if (arr[3]==0) {
				$("#runJobBtn").removeClass('disabled');
				$('#runJobBtn').click(runJob);
			} else if (arr[3]==1) {
				$("#runJobBtn").addClass('disabled');				
				$('#runJobBtn').unbind();
			}
		}
		
		// 删除任务
		function showJobRemove(id, name) {
			layer.confirm('确定删除"' + name + '"', {
				btn : [ '确定', '取消' ]
			}, function(index) {
				var url = BASEPATH + 'jm/deletejob.json';
				$.fn.request(url, function() {// 验证是否可删除回调
					jmGrid.resetData();
					layer.close(index);
				}, {
					"id" : id
				}, true);
			});
		}
		function deleteJob(id) {
			var url = BASEPATH + 'jm/deletejob.json';
			$.fn.request(url, function(data) {// 验证是否可删除回调
			}, {
				"id" : id
			}, true);
		}
	});
})(jQuery);