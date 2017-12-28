/**
 * Created by QianQi on 2016/3/10.
 */
$(function(){
    var time_limit;
    /** 验证 **/
    var vali=$('#groupform').initValidator({
        rules:{
        	   'job_name':{'required':true,'maxlength':50}
               , 'job_group':{'required':true,'maxlength':50}
               , 'DESCRIPTION':{'maxlength':250}
        }
        ,callback: $.showValiTip
    });
    // 底部按钮点击事件
    function bottomHandler(){
        var txt=$(this).attr('data-val');
        switch (txt){
            case 'submit':// 提交
                if(!vali.validateAll()) return;
                var url=BASEPATH+"jm/savejob.json";
                var job=setSaveData($('#groupform').serializeObject());
                if(typeof job=='string'){
             		$.showAlert(job);
             	 }else{
	                $.fn.request(url,function(data){
	                	//返回
	                   if(data){
	                	   $.showMsg('保存成功',function(){
	                     	  parent.cusLayer['jm'](data,true);
	                           parent.closeLayer['jm']();
	                      });
	                   }
	                },job,true);
                 }
                break;
            case 'cancel':// 取消
            	 parent.closeLayer['jm']();
                break;
        }
    }
    function setSaveData(job){
    	 //是否bean注入
    	 var isBean=$('#bean').prop('checked');
    	 job.isjobclass=isBean?0:1;
    	 if(isBean){
    		 var bname=job.job_bean_name;
    		 if(null==bname||bname.trim()==''){
    			 return "Bean的名称不能为空";
    		 }
    		 var bmethod=job.job_method_name;
    		 if(null==bmethod||bmethod.trim()==''){
    			 return "方法名不能为空";
    		 }
    	 }else{
    		 var cname=job.job_class_name;
    		 if(null==cname||cname.trim()==''){
    			 return "执行类不能为空";
    		 }
    	 }
    	 //时间复杂度
    	 var dispatch=$('[name="dispatch"]:checked').val();
    	 var trigger_type=dispatch=='one'?0:1;
    	 job.trigger_type=trigger_type;
    	 if(trigger_type==1){
    		 if(null==job.cron_expression||job.cron_expression==''){
    			 return "复杂调度表达式不能为空";
    		 }
    	 }
    	 var isCountDown=$('#countDown').prop('checked');
		 var val=$('[name="dispatch"]:checked').val();
		 if(trigger_type==0&&isCountDown){
			 job.time_unit=$("#time_unit").val();
		 }
		 if(trigger_type==0&&!isCountDown){
			 var startime=job.starttime;
    		 if(null==startime||startime.trim()==''){
    			 return "日期不能为空";
    		 }
		 }
		 if(val=='com'){
			 job.starttime=startsj;
			 job.endtime=endsj;
		 }
		 job.instance_status=instance_status;
		 job.isexecuting=isexecuting;
    	 return job;
    	 
    }
    //底部按钮操作
    $('.pageBot_in').on('click','button',bottomHandler);
    // 默认启用 Bean 注入
    $('#bean').change(changeBean)
        .prop('checked',isjobclass==0?true:false);
    changeBean();
    // 改变 Bean 注入启用状态
    function changeBean(){
        var isBean=$('#bean').prop('checked');
        $('tr[data-bean]')
            .find('>td input').prop('disabled',false);
        var beanval=isBean?'class':'bean';
        $('tr[data-bean="'+beanval+'"]')
            .find('>td input').prop('disabled',true);
    }
    // 调度类型
    $('[name="dispatch"]').change(changeDispatch);
    if(trigger_type==0){
    	$('[name="dispatch"][value="one"]').prop('checked',true);
    }else{
    	$('[name="dispatch"][value="com"]').prop('checked',true);
    }
    // 倒计时
    // 调度一次的数字框初始化
    time_limit=$('#time_limit').initSelNum({
        maxVal:60 //最大值
        ,minVal:1 //最小值
        ,value:Number(time_limitv)
        ,name:'time_limit' //其中文本框对应的 name
    });
    if(starttime){
    	$('#countDown').prop('checked',false);
    }else{
    	$('#countDown').prop('checked',true);
    }
    $('#countDown').change(changeCountDown);
    changeCountDown();
    $("#starttime").val(starttime);
  //  $("#starttime").val(starttime||(new Date()).format('yyyy-MM-dd HH:mm:ss'));
   $("#time_unit").val(time_unit);
    // 倒计时执行
    function changeCountDown(){
        var isCountDown=$('#countDown').prop('checked');
        $('tr[data-countdown="countdown"]')
            .find('>td input,>td select').prop('disabled',!isCountDown);
        time_limit && time_limit.setEnable(isCountDown);//禁用数字组件
        $('[name="starttime"]').prop('disabled',isCountDown);
    }
  
    changeDispatch();
    // 改变调度类型
    function changeDispatch(){
        var val=$('[name="dispatch"]:checked').val();
        var comEl=$('tr[data-dispatch="com"]')
            ,oneEl=$('tr[data-dispatch="one"]');
        if(val=='one'){// 一次调度，禁用复杂调度
            comEl.find('>td input').prop('disabled',true);
            comEl.find('>td .input-group-btn').addClass('disabled');
            $('#countDown').prop('disabled',false);
            changeCountDown();
        }else{
            comEl.find('>td input').prop('disabled',false);
            comEl.find('>td .input-group-btn').removeClass('disabled');// 启用按钮
            oneEl.find('>td input,>td select').prop('disabled',true);
        }
    }
   
    $('#changeJobCron').click(showJobCron);
    var jobCronInfo =$('[name="cron_expression"]').val();//复杂调度表达式
    var cronLayer= $.initCusLayer(cronLayer_cb,'cron');
    // 变更时执行的回调函数
    var startsj=starttime;
    var endsj=endtime;
    function cronLayer_cb(args){
    	jobCronInfo=args.jobCronInfo;// 菜单变更后是否需要刷新当前列表
    	$('[name="cron_expression"]').val(args.jobCronInfo);
    	startsj=args.starttime;
    	endsj=args.endtime;
    }
    function showJobCron() {
    	var url = BASEPATH+"jm/toCron.do";
    	if(jobCronInfo) {
    		url += "?cron="+jobCronInfo.replace(/\#/g, '%23')+"&starttime="+startsj+"&endtime="+endsj;
    	}
    	var title='调度频率';
    	cronLayer.show({
            content:url
            ,title:title
            ,shade: [0]
            ,area: ['600px','530px']
        });
      	  
    }





});