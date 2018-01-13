(function($) {
	$(function() {
		var jmGrid = undefined;
		
		var jmLayer = $.initCusLayer(jmLayer_cb, 'jm');
		// 变更时执行的回调函数
		function jmLayer_cb(args) {
			initJmGrid();// 菜单变更后是否需要刷新当前列表
		}
		// 任务调度信息页面展示
		function showJobDetail(jobID, isView) {
			var url = BASEPATH + "jm/toJmEdit.do", title;			
			if (jobID && !isView) {
				url += "?id=" + jobID+"&isEdit=true";				
				title = ['编辑任务调度', 'font-size:16px;color:#00F;background-color:#C0C0C0;'];
				jmLayer.show({
					content : url,
					title : title,
					shade : [ 0 ],				
					area : [ '650px', '580px' ]
				});
			} else if (jobID && isView) {
				url += "?id=" + jobID + "&isView=true";
				title = ['查看任务调度', 'font-size:16px;color:#00F;background-color:#C0C0C0;'];
				jmLayer.show({
					content : url,
					title : title,
					shade : [ 0 ],				
					area : [ '650px', '370px' ]
				});
			} else {
				url += "?isNew=true";
				title = ['新建任务调度', 'font-size:16px;color:#00F;background-color:#C0C0C0;'];
				jmLayer.show({
					content : url,
					title : title,
					shade : [ 0 ],				
					area : [ '650px', '580px' ]
				});
			}			
		}

		// 新建任务
		function newJob() {
			showJobDetail();
		}
		// 启动任务
		function startJob() {
			if($(this).hasClass("disabled")) return;			
			if (!jmGrid)
				return;
			var chks = jmGrid.getCheckedRows();
			if (chks.length && chks.length == 1) {
				$.fn.request(BASEPATH + 'jm/startJob.json?jobId=' + chks[0].id+'&all=no use',
					function() {						
						$.showMsg('任务启动成功');
						initJmGrid();
					}, {}, true);				
			} else {
				$.showValiTip(this, '请选择一个任务');
			}
		}
		function startJobAll() {
			if($(this).hasClass("disabled")) return;
			$.fn.request(BASEPATH + 'jm/startJob.json?all=all',
				function() {
					$.showMsg('任务启动成功');
					initJmGrid();		
				}, {}, true);
		}
		// 停止任务
		function stopJob() {
			if($(this).hasClass("disabled")) return;
			if (!jmGrid)
				return;
			var chks = jmGrid.getCheckedRows();
			if (chks.length && chks.length == 1) {
				$.fn.request(BASEPATH + 'jm/stopJob.json?jobId=' + chks[0].id+'&all=no use', function() {
					$.showMsg('任务已停止');
					initJmGrid();					
				}, {}, true);
			} else {
				$.showValiTip(this, '请选择一个任务');
			}
		}
		function stopJobAll() {
			if($(this).hasClass("disabled")) return;
			$.fn.request(BASEPATH + 'jm/stopJob.json?all=all', function() {
				$.showMsg('任务已停止');
				initJmGrid();			
			}, {}, true);
		}
		// 恢复任务
		function resumeJob() {
			if($(this).hasClass("disabled")) return;
			if (!jmGrid)
				return;
			var chks = jmGrid.getCheckedRows();
			if (chks.length && chks.length == 1) {
				$.fn.request(BASEPATH + 'jm/resumeJob.json?jobId=' + chks[0].id+'&all=no use', function() {
					$.showMsg('任务已恢复');
					initJmGrid();			
				}, {}, true);
			} else {
				$.showValiTip(this, '请选择一个任务');
			}
		}
		function resumeJobAll() {
			if($(this).hasClass("disabled")) return;
			$.fn.request(BASEPATH + 'jm/resumeJob.json?all=all', function() {
				$.showMsg('任务已恢复');
				initJmGrid();						
			}, {}, true);
		}
		// 运行情况
		function runJob() {
			if($(this).hasClass("disabled")) return;
			if (!jmGrid)
				return;
			var chks = jmGrid.getCheckedRows();
			if (chks.length && chks.length == 1) {
				var group = chks[0].job_group;
				var name = chks[0].job_name;
				jmck(group, name);								
			} else {
				$.showValiTip(this, '请选择一个任务');
			}
		}
		function jmck(group, name) {
			var url = BASEPATH + "jm/toJmRuningtimePage.do?job_group=" + group + "&job_name=" + name;
			jmLayer.show({
				content : url,
				title : '运行情况',
				shade : [ 0 ],
				area : [ '650px', '230px' ]
			});
		}

		// 关键字查询
		$("#queryJobBtn").click(queryJob);
		function queryJob() {
			var job_keyword = $('#queryJobTxt').val().trim();
			initJmGrid(job_keyword);
		}

		/**
		 * 初始化表格
		 */
		function initJmGrid(job_keyword) {		
			
			$("#startJobBtn").removeClass('disabled');
			$("#startJobBtnAll").removeClass('disabled');
			$("#pauseJobBtn").removeClass('disabled');
			$("#pauseJobBtnAll").removeClass('disabled');
			$("#resumeJobBtn").removeClass('disabled');
			$("#resumeJobBtnAll").removeClass('disabled');
			$("#runJobBtn").removeClass('disabled');
			
			
			var jmGridEl = $('#jmGrid'), per = 10;// 默认每页显示 10 条数据
			var args = {
				'keyword' : job_keyword
			};
			if (!jmGrid) {// 初始化
				jmGrid = jmGridEl.initGrid({
					url : BASEPATH + 'jm/getJobList.json',
					args : args,
					cols : [ 
					         { field : 'job_group',title : '分组名称',width : '150px'}, 
					         { field : 'job_name',title : '任务名称',width : '150px'}, 
					         { field : 'job_full_bean',title : '作业类',showTip : true,width : '200px',render : class_renderCtrl}, 
					         { field : 'trigger_type',title : '任务类型',align : 'center',render : type_renderCtrl}, 
					         { field : 'instance_status',title : '任务状态',align : 'center',width : '150px',render : instance_statusCtrl}, 
					         { field : '',name : 'ctrl',title : '操作',width : '130px',align : 'center',render : jmGrid_renderCtrl }
					],
					showno : true,
					singleChk : true,
					page : {
						percount : per,
						perList : [ 10, 20, 50 ]
					},
					callback : {
						cell : {
							'ctrl' : {'click' : jmGrid_cellCtrl_click}
						},
						row : {// 行事件						    
						    click: jmGrid_rowCtrl_click
						}
					}
				});				
			} else {// 刷新数据
				jmGrid.resetData({
					args : args
				});
			}
		}
		
		// 作业类
		function class_renderCtrl(val, row, i, datalist) {
			if (row.impljob == '1') {
				var clname = row.job_class_name;
				var clArr = clname.split('.');
				return '<div title="' + row.job_class_name + '">'
						+ clArr[clArr.length - 1] + '</div>';
			} else {
				var bean = row.job_bean_name + "." + row.job_method_name + "()";
				return '<div title="' + bean + '">' + bean + '</div>';
			}
		}
		// 任务类型
		function type_renderCtrl(val, row, i, datalist) {
			if (row.trigger_type == '0') {
				return '<div class="stat-bg-green">一次性</div>';
			} else {
				return '<div class="stat-bg-green">周期性</div>';
			}
		}
		// 运行状态
		function instance_statusCtrl(val, row, i, datalist) {
			switch (row.instance_status) {
			case 'WAITING':
				return '<div class="stat-bg-green">等待中</div>';
				break;
			case 'ACQUIRED':
				return '<div class="stat-bg-green">运行中</div>';
				break;
			case 'COMPLETE':
				return '<div class="stat-bg-green">已完成</div>';
				break;
			case 'PAUSED':
				return '<div class="stat-bg-green">暂停</div>';
				break;
			default :
				return '<div class="stat-bg-green">未运行</div>';
				break;
			}
		}
		// 操作单元格 render
		function jmGrid_renderCtrl(val, row, i, datalist) {
			return '<button class="btn gbtn btn-primary" type="button" data-val="view">查看</button>' +
			'<button class="btn gbtn btn-primary" type="button" data-val="edit">修改</button>' +
            '<button class="gico gico-del" type="button" data-val="remove"></button>';
			
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
		// 行事件
		function jmGrid_rowCtrl_click(e, row, i) {
			switch (row.instance_status) {
				case 'WAITING'://等待中
					btnDisplay(0, 1, 0, 1, 0);
					break;
				case 'ACQUIRED'://运行中
					btnDisplay(0, 1, 0, 1, 0);
					break;
				case 'COMPLETE'://已完成
					btnDisplay(0, 1, 1, 1, 0);
					break;
				case 'PAUSED'://暂停
					btnDisplay(0, 1, 1, 0, 0);
					break;
				default :
					btnDisplay(0, 0, 1, 1, 1);
					break;				
			}
		}		
		// 根据被选中的任务从而控制顶部按钮的展示
		function btnDisplay(nez, start, pause, resume, run) {// 1-隐藏 0-显示			
			if (nez==0) {
				$("#newJobBtn").removeClass('disabled');
			}		 
			if (start==0) {
				$("#startJobBtn").removeClass('disabled');
				$("#startJobBtnAll").removeClass('disabled');			
			} else if (start==1) {
				$("#startJobBtn").addClass('disabled');				
				$("#startJobBtnAll").addClass('disabled');				
			}
			if (pause==0) {
				$("#pauseJobBtn").removeClass('disabled');
				$("#pauseJobBtnAll").removeClass('disabled');				
			} else if (pause==1) {
				$("#pauseJobBtn").addClass('disabled');				
				$("#pauseJobBtnAll").addClass('disabled');				
			}
			if (resume==0) {
				$("#resumeJobBtn").removeClass('disabled');
				$("#resumeJobBtnAll").removeClass('disabled');				
			} else if (resume==1) {
				$("#resumeJobBtn").addClass('disabled');				
				$("#resumeJobBtnAll").addClass('disabled');				
			}
			if (run==0) {
				$("#runJobBtn").removeClass('disabled');				
			} else if (run==1) {
				$("#runJobBtn").addClass('disabled');				
			}
		}
		
		// 删除任务
		function showJobRemove(id, name) {
			$.showConfirm("确定删除",function(){
				var url = BASEPATH + 'jm/deletejob.json';
				$.fn.request(url, function() {
					$.showMsg("删除成功")									
					initJmGrid();
				}, {
					"id" : id
				}, true);
			});
		}
		
		/** ========================================================== **/
		
		
		initJmGrid();
		
		$('#startJobBtn').click(startJob);// 启动任务
		$('#startJobBtnAll').click(startJobAll);
		$('#pauseJobBtn').click(stopJob);// 停止任务
		$('#pauseJobBtnAll').click(stopJobAll);
		$('#resumeJobBtn').click(resumeJob);// 恢复任务
		$('#resumeJobBtnAll').click(resumeJobAll);
		$('#runJobBtn').click(runJob);
		
		// 新建任务
		$('#newJobBtn').click(newJob);
		
	});
})(jQuery);