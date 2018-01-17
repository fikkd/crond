$(function() {
	var time_limit, cronLayer;
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
			var url = BASEPATH + "jm/saveJob.json?fired=0";
			var job = setFormData($('#groupform').serializeObject());						
			if (typeof job == 'string') {
				$.showMsg(job);
			} else {
				$.fn.request(url, function(data) {								
					if (/[a-zA-Z0-9]+/.test(data)) {
						$.showMsg('保存成功', function() {
							parent.cusLayer['jm'](data, true);
							parent.closeLayer['jm']();
						});
					} else {
						$.showMsg(data);
					}
				}, job, true);
			}
			break;
		case 'submitAndFired':
			if (!vali.validateAll())
				return;
			var url = BASEPATH + "jm/saveJob.json?fired=1";
			var job = setFormData($('#groupform').serializeObject());			
			if (typeof job == 'string') {
				$.showMsg(job);
			} else {
				$.fn.request(url, function(data) {
					if (data) {
						$.showMsg('保存并启动成功', function() {
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
		if (!job.version) {
			delete job.version;
		}
		
		var isBean = $("input[data-val='ctype']:checked").val();
		// 新增时普通方式或标准方式的验证
		if (isNew=='true' && isBean=='general') {//【1-是 0-否】
			job.impljob='0';
			var bname = $('input[name="job_bean_name"]').val();			
			if (null == bname || bname.trim() == '') {
				return "Bean的名称不能为空";
			}			
			if (bname.length < 3) {
				return "Bean名称长度必须大于3";
			}			
			if (!/^[a-zA-Z]{3,}$/.test(bname)) {
				return "Bean的名称只能包含字母";
			}
						
			var bmethod = $('input[name="job_method_name"]').val();			
			if (null == bmethod || bmethod.trim() == '') {
				return "方法名不能为空";
			}
			if (bmethod.length < 3) {
				return "方法名长度必须大于3";
			}
			if (!/^[a-zA-Z]{3,}$/.test(bmethod)) {
				return "方法名只能包含字母";
			}
			
			job.job_class_name=null;
		} else if (isNew=='true' && isBean=="standard"){
			job.impljob='1';
			var cname = job.job_class_name;
			if (null == cname || cname.trim() == '') {
				return "标准方式不能为空";
			}
			job.job_bean_name=null;
			job.job_method_name=null;
		}
		
		// 计划任务【0-一次性 1-周期性】
		var dispatch = $('input[data-val="dispatch"]:checked').val();
		var trigger_type = dispatch == 'one' ? '0' : '1';
		job.trigger_type = trigger_type;
		if (trigger_type == '1') {
			var cron_zh_cn = $('div[name="cron_zh_cn"]').html();	
			if (null == cron_zh_cn || cron_zh_cn == '') {
				return "周期性计划任务设置周期不能为空";
			}
			job.cron_zh_cn=cron_zh_cn;
			job.starttime=$('div[name="stime"]').html();			
			job.endtime=$('div[name="etime"]').html();
			job.exectime='';
			delete job.time_limit;
			delete job.time_unit;
		} else {
			var isCountDown = $('#countDown').prop('checked');
			var val = $('input[data-val="dispatch"]:checked').val();
			if (isCountDown) {
				job.time_limit=$('input[name="time_limit"]').val();
				job.time_unit=$("#time_unit").val();
				job.exectime='';
			} else {
				var exectime = $('div[name="exectime"]').html();
				if (null == exectime || exectime.trim() == '') {
					return "执行时间不能为空";
				}
				job.exectime=exectime;
				delete job.time_limit;
				delete job.time_unit;
			}			
			job.cron_expression='';
			job.cron_zh_cn='';
			job.starttime='';
			job.endtime='';
		}		
		return job;
	}
	
	/** 精准设置 */
	function fShowCron() {
		var url = BASEPATH + "jm/toCron.do";
		cronLayer.show({
            data:{
            	cron_expression : $('[name="cron_expression"]').val(),
            	cron_zh_cn : $('[name="cron_zh_cn"]').html()
            }
        });
	}

	function fShowDate(e) {
		WdatePicker({			
			dateFmt:'yyyy-MM-dd HH:mm:ss',
			minDate:'%y-%M-%d'			
		}, false, e);
	};

	function fDelDate() {
		$(this).prev().html('');		
	}
	
	/** 改变普通方式启用状态 */
	function changeCType() {
		var isBean = $('input[data-val="ctype"][value="general"]').prop('checked');
		$('tr[data-bean]').find('>td input').removeAttr("readonly");
		var beanval = isBean ? 'class' : 'bean';
		$('tr[data-bean="' + beanval + '"]').find('>td input').attr("readonly","readonly");
	}
	
	/** 倒计时执行 */
	function changeCountDown() {
		var isCountDown = $('#countDown').prop('checked');
		if (isCountDown && (isNew=='true' || isEdit=='true')) {
			$('tr[data-countdown="countdown"]').find('>td input,>td select').removeAttr("readonly");
			$('div[name="exectime"]').off("click");
			$('#time_unit').attr("disabled",false);
		} else if (isNew=='true' || isEdit=='true') {
			$('tr[data-countdown="countdown"]').find('>td input,>td select').attr("readonly","readonly");
			$('div[name="exectime"]').on("click", fShowDate);
			$('#time_unit').attr("disabled","disabled");
		}
		time_limit && time_limit.setEnable(isCountDown);
	}
	
	/** 改变调度类型 */
	function changeDispatch() {
		var val = $('input[data-val="dispatch"]:checked').val();
		var comEl = $('tr[data-dispatch="com"]'), oneEl = $('tr[data-dispatch="one"]');
		if (val == 'one' && (isNew=='true' || isEdit=='true')) {// 一次性
			$('div[name="cron_zh_cn"]').off('click');
			$('div[name="stime"]').off('click');
			$('div[name="etime"]').off('click');
			$('#countDown').show();			
			$('#countDown').on('change',changeCountDown);
			changeCountDown();		
		} else if (val == 'com' && (isNew=='true' || isEdit=='true')) {// 周期性
			$('div[name="cron_zh_cn"]').on('click',fShowCron);
			$('div[name="stime"]').on("click",fShowDate);
			$('div[name="etime"]').on("click",fShowDate);
			$('div[name="exectime"]').off('click');
			$('#countDown').hide();
			$('#countDown').off('change');
			time_limit.setEnable(false);
			$('#time_unit').attr("disabled","disabled");			
		}
		
	}
	/** 精准设置回调 */
	function cronLayer_cb(args) {
		var arr = args.split('|');
		$('[name="cron_expression"]').val(cron_expression=arr[0].trim());
		$('[name="cron_zh_cn"]').html(cron_zh_cn=arr[1]);
		$('[name="cron_zh_cn"]').attr("title",cron_zh_cn=arr[1]);		
	}
	

	
	
	/** ============================================================= **/
	
	/** 底部按钮操作 */
	$('.js-fbtns').on('click', 'button', bottomHandler);
	
	// 一次性调度的数字框初始化
	time_limit = $('#time_limit').initSelNum({
		maxVal : 60,
		minVal : 1,
		name : 'time_limit' //其中文本框对应的 name
	});
	if (isNew=='true') {
		$('input[data-val="ctype"][value="general"]').prop('checked', true);
	}
	$('input[data-val="ctype"]').change(changeCType);
	changeCType();
/*	// 倒计时间
	$('#countDown').change(changeCountDown);
	changeCountDown();*/
		
	// 调度类型
	if (trigger_type=='0') {
		$('input[data-val="dispatch"][value="one"]').prop('checked', true);		
	} else {
		$('input[data-val="dispatch"][value="com"]').prop('checked', true);		
	}
	$('input[data-val="dispatch"]').change(changeDispatch);
	changeDispatch();
	
	

	var cron_expression = $('[name="cron_expression"]').val();
	var cron_zh_cn = $('[name="cron_zh_cn"]').html();
	
	cronLayer = $.initWiLayer({
		name : 'cronLayer',
		layerOpts : {
			content : BASEPATH + "jm/toCron.do",
			title : ['周期设置', 'font-size:16px;color:#00F;background-color:#C0C0C0;'],
			shade : 0.3,
			area : [ '650px', '580px' ]
		},
		callback : cronLayer_cb
	});
	
	$('.txt-del').on('click',fDelDate);
	
});