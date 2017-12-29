$(function() {
	var time_limit, cronLayer, cronLayerS;
	/** 验证 **/
	var vali = $('#groupform').initValidator({
		rules : {
			'job_name' : { 'required' : true, 'maxlength' : 50 },
			'job_group' : { 'required' : true, 'maxlength' : 50 },
			'description' : { 'maxlength' : 250 }
		},
		callback : $.showValiTip
	});
	/** 底部按钮点击事件 */
	function bottomHandler() {
		var txt = $(this).attr('data-val');
		switch (txt) {
		case 'submit':// 提交
			if (!vali.validateAll())
				return;
			var url = BASEPATH + "jm/savejob.json";
			var job = setFormData($('#groupform').serializeObject());
			if (typeof job == 'string') {
				$.showAlert(job);
			} else {
				$.fn.request(url, function(data) {
					if (data) {
						$.showMsg('保存成功', function() {
							parent.cusLayer['jm'](data, true);
							parent.closeLayer['jm']();
						});
					}
				}, job, true);
			}
			break;
		case 'cancel':// 取消
			parent.closeLayer['jm']();
			break;
		}
	}
	/** 构造与验证表单数据 */
	function setFormData(job) {
		var isBean = $('#bean').prop('checked');
		if (isBean) {
			var bname = job.job_bean_name;
			if (null == bname || bname.trim() == '') {
				return "Bean的名称不能为空";
			}
			var bmethod = job.job_method_name;
			if (null == bmethod || bmethod.trim() == '') {
				return "方法名不能为空";
			}
		} else {
			var cname = job.job_class_name;
			if (null == cname || cname.trim() == '') {
				return "执行类方式不能为空";
			}
		}
		// 计划任务【0-一次性 1-周期性】
		var dispatch = $('[name="dispatch"]:checked').val();
		var trigger_type = dispatch == 'one' ? 0 : 1;
		job.trigger_type = trigger_type;
		if (trigger_type == 1) {
			if (null == job.cron_expression || job.cron_expression == '') {
				return "周期性计划任务不能为空";
			}
		}
		var isCountDown = $('#countDown').prop('checked');
		var val = $('[name="dispatch"]:checked').val();
		if (trigger_type == 0 && isCountDown) {
			job.time_unit = $("#time_unit").val();
		}
		if (trigger_type == 0 && !isCountDown) {
			var startime = job.starttime;
			if (null == startime || startime.trim() == '') {
				return "日期不能为空";
			}
		}
		if (val == 'com') {
			job.starttime = startsj;
			job.endtime = endsj;
		}
		job.instance_status = instance_status;
		job.isexecuting = isexecuting;
		return job;
	}
	
	/** 精准设置 */
	function showJobCron() {
		var url = BASEPATH + "jm/toCron.do";
		cronLayer.show({
            data:{
            	cron_expression : cron_expression,
            	cron_zh_cn : cron_zh_cn
            }
        });
		
	}
	/** 常规设置 */
	function showJobCronS() {
		var url = BASEPATH + "jm/toCron.do";
		if (jobCronInfo) {
			url += "?cron=" + jobCronInfo.replace(/\#/g, '%23') + "&starttime=" + startsj + "&endtime=" + endsj;
		}
		cronLayerS.show({
			data:{
            	cron_expression : cron_expression,
            	cron_zh_cn : cron_zh_cn
            }
        });
	}
	
	/** 改变 Bean 注入启用状态 */
	function changeBean() {
		var isBean = $('#bean').prop('checked');
		$('tr[data-bean]').find('>td input').prop('disabled', false);
		var beanval = isBean ? 'class' : 'bean';
		$('tr[data-bean="' + beanval + '"]').find('>td input').prop('disabled', true);
	}
	
	/** 倒计时执行 */
	function changeCountDown() {
		var isCountDown = $('#countDown').prop('checked');
		$('tr[data-countdown="countdown"]').find('>td input,>td select').prop('disabled', !isCountDown);
		time_limit && time_limit.setEnable(isCountDown);//禁用数字组件
		$('[name="starttime"]').prop('disabled', isCountDown);
	}
	
	/** 改变调度类型 */
	function changeDispatch() {
		var val = $('[name="dispatch"]:checked').val();
		var comEl = $('tr[data-dispatch="com"]'), oneEl = $('tr[data-dispatch="one"]');
		if (val == 'one') {// 一次性
			comEl.find('>td input').prop('disabled', true);
			comEl.find('>td .input-group-btn').addClass('disabled');
			$('#changeJobCron').unbind();
			$('#changeJobCronS').unbind();
			$('#countDown').prop('disabled', false);
			changeCountDown();
		} else {// 周期性
			comEl.find('>td input').prop('disabled', false);
			comEl.find('>td .input-group-btn').removeClass('disabled');// 启用按钮
			$('#changeJobCron').click(showJobCron);
			$('#changeJobCronS').click(showJobCronS);
			oneEl.find('>td input,>td select').prop('disabled', true);
		}
	}
	/** 精准设置回调 */
	function cronLayer_cb(args) {
		console.log('回到方法被调用'+args);
		jobCronInfo = args.jobCronInfo;
		$('[name="cron_expression"]').val(args.jobCronInfo);
		startsj = args.starttime;
		endsj = args.endtime;
	}
	/** 常规设置的回调 */
	function cronLayerS_cb(args) {
	}
	
	/** ============================================================= **/
	
	/** 底部按钮操作 */
	$('.pageBot_in').on('click', 'button', bottomHandler);
	/** 默认启用 Bean 方式 */
	$('#bean').change(changeBean).prop('checked', isjobclass == 0 ? true : false);
	changeBean();
	
	// 调度类型
	$('[name="dispatch"]').change(changeDispatch);
	if (trigger_type == 0) {
		$('[name="dispatch"][value="one"]').prop('checked', true);
	} else {
		$('[name="dispatch"][value="com"]').prop('checked', true);
	}
	// 倒计时
	// 一次性调度的数字框初始化
	time_limit = $('#time_limit').initSelNum({
		maxVal : 60,
		minVal : 1,
		value : Number(time_limitv),
		name : 'time_limit' //其中文本框对应的 name
	});
	if (starttime) {
		$('#countDown').prop('checked', false);
	} else {
		$('#countDown').prop('checked', true);
	}
	$('#countDown').change(changeCountDown);
	changeCountDown();
	$("#starttime").val(starttime);
	$("#time_unit").val(time_unit);

	changeDispatch();
	
	var cron_expression = $('[name="cron_expression"]').val();
	var cron_zh_cn = $('[name="cron_zh_cn"]').val();
	
	cronLayer = $.initWiLayer({
		name : 'cronLayer',
		layerOpts : {
			content : BASEPATH + "jm/toCron.do",
			title : '精准频率',
			shade : [ 0 ],
			area : [ '600px', '530px' ]
		},
		callback : cronLayer_cb
	});
	cronLayerS = $.initWiLayer({
		name : 'cronLayerS',
		layerOpts : {
			content : BASEPATH + "jm/toCron.do",
			title : '常规频率',
			shade : [ 0 ],
			area : [ '600px', '530px' ]
		},
		callback : cronLayerS_cb
	});
	
	// 变更时执行的回调函数
	var startsj = starttime;
	var endsj = endtime;
	
	
});