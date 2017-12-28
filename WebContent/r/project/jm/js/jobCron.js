/**
 * Created by QianQi on 2016/3/10.
 */
$(function(){
	 var second = "*";
	 var minute = "*";
	 var hour= "*";
	 var day = "*";
	 var month = "*";
	 var week = "?";
	 var year = "*";
	
	 // 每天频率
	 var zxjg;
	 var monthday;
	 var monthSel;
	 var _zxpl;
	 var daypl='one';
	 var daypl_one_time=(new Date()).format('HH:mm:ss');
	 var daypl_com_jg=1;
	 var daypl_com_unit=1;
     var monthpl='day';
     var monthpl_day=0;
     var monthpl_djg=1;
     var monthpl_djz=1;
     var hasEnd='yes';
     
     //年
     var monthvar=1;
	 var month_djz=1;
	 var month_djg=1;
	 
	 if(cron){
		setQuartzCronExp(cron);
	 }
	init();
    function setQuartzCronExp(value) {
		var arr=value.split(" ");
		initComponent1(arr[3], arr[4], arr[5], arr[6]);
		initComponent2(arr[0], arr[1], arr[2]);
	}
	
	/**
	 * 设置频率区域
	 * */
  
	 function initComponent1(day, month, week, year) {
		
		this.day = day;
		this.month = month;
		this.week = week;
		this.year = year;
		
		// 每天
		if(day == "*"){
			zxpl=1;
			return;
		}
		if(month!='*'){
			zxpl=4;
			monthvar=month;
			if(week.indexOf("L") != -1){
				month_djg=5;
				month_djz=week.substring(0, week.length - 1);
			}else{
				month_djg=week.split("#")[1];
				month_djz= week.split("#")[0];
			}
			return;
		}
		// 每周
		if(day == "?" && week.indexOf("#") == -1 && week.indexOf("L") == -1){
			zxpl=2;
			if(week == "*"){
				return;
			}
			//
			init_week(week);
			return;
		}
		
		// 每月 - 第
		if(day != "*" && day != "?"){
			zxpl=3;
			monthpl='day';
			monthpl_day=day;
			return;
		}
		
		// 每月 - 在
		zxpl=3;
		monthpl='week';
		if(week.indexOf("L") != -1){
			  monthpl_djg=5;
		      monthpl_djz=week.substring(0, week.length - 1);
		}else{
			monthpl_djg=week.split("#")[1];
		    monthpl_djz= week.split("#")[0];
		}
	}
	
	/**
	 * 设置每天频率区域
	 * */
	
	 function initComponent2(second, minute, hour){
		
		this.second = second;
		this.minute = minute;
		this.hour = hour;
		
		// 每天频率 - 间隔（时）

		if(hour.indexOf("/") != -1){
			daypl='com';
			daypl_com_unit=60;
			daypl_com_jg=hour.split("/")[1];
			return;
		}
		
		// 每天频率 - 间隔（分钟）
		if(minute.indexOf("/") != -1){
			daypl='com';
			daypl_com_unit=1;
			daypl_com_jg=minute.split("/")[1];
			return;
		}
		
		// 每天频率 - 一次

		daypl='one';
		daypl_one_time=hour+":"+minute+":"+ second;
		
	}
    // 底部按钮点击事件
    function bottomHandler(){
        var txt=$(this).attr('data-val');
        switch (txt){
            case 'submit':// 提交
               var val=$('[name="daypl"]:checked').val();
            	if(val=='one'){
            		 setValue5();
            	}
            	var jobCronInfo=getQuartzCronExp();
            	var starttime=getStarttime();
            	var endtime=getEndtime();
                parent.cusLayer['cron']({'jobCronInfo':jobCronInfo
                	,'starttime':starttime
                	,'endtime':endtime},true);
                parent.closeLayer['cron']();
                break;
            case 'cancel':// 取消
            	 parent.closeLayer['cron']();
                break;
        }
    }
    function setSaveData(job){
    	 return job;
    	 
    }
   //底部按钮操作
   $('.pageBot_in').on('click','button',bottomHandler);
   function init(){
	   init_daypl();
	   init_zxsj();
	   
	   init_month();
	   init_year();
	   changepl(zxpl);
   }
    //设置频率
    
    $('[name="zlpl"]').change(function(){
    	changepl($(this).val());
    });
    function changepl(val){
    	 if(_zxpl==val) return;
    	 _zxpl=parseInt(val);
        var radio=$('#zlpl_'+val)
            ,cont=$('.lx-cont[data-zlpl="'+val+'"]');
        if(!radio.prop('checked')) radio.prop('checked',true);
        if(!cont.hasClass('now')){
            $('.lx-cont.now').removeClass('now');
            cont.addClass('now');
        }
        initPage();
    }
	
	 
	 function init_daypl(){
		 if(daypl=='one'){
			 $('[name="daypl"][value="one"]').prop('checked',true);
		 }else{
			 $('[name="daypl"][value="com"]').prop('checked',true);
		 }
		 zxjg=$('#zxjg').initSelNum({// 执行间隔
		        maxVal:60 //最大值
		       ,minVal:1 //最小值
		       ,value:Number(daypl_com_jg)
		       ,name:'zxjg' //其中文本框对应的 name
		       ,onChange:setValue6
		 });
		//单位
		 $('#zxjg_unit').val(daypl_com_unit);//间隔单位
		 $('[name="dayplone"]').val(daypl_one_time);
		 changeDaypl();
	 }
	 //改变
	 $('#zxjg_unit').change(setValue6);//间隔单位
//	 $('[name="dayplone"]').change(setValue5);
	 
//	  if("\v"=="v") { //判断浏览器是否是IE
//	      $('[name="dayplone"]').onpropertychange = setValue5;
//	  }else{
//		  $('[name="dayplone"]').addEventListener("input",setValue5,false);
//	  }

	 $('[name="daypl"]').change(changeDaypl);
     function changeDaypl(){
        var val=$('[name="daypl"]:checked').val();
        var comEl=$('tr[data-daypl="com"]')
            ,oneEl=$('tr[data-daypl="one"]');
        if(val=='one'){// 执行一次
            comEl.find('>td input').prop('disabled',true);
            comEl.find('>td select').prop('disabled',true);
            oneEl.find('>td input').prop('disabled',false);
            setValue5();
        }else{
            comEl.find('>td input').prop('disabled',false);
            comEl.find('>td select').prop('disabled',false);
            oneEl.find('>td input').prop('disabled',true);
            setValue6();
        }
    } 
     //持续时间
   
     function init_zxsj(){
		 if(!cron){
			$('[name="starttime"]').val(new Date().format('yyyy-MM-dd HH:mm:ss'));
	        $('[name="endtime"]').val(new Date().format('yyyy-MM-dd HH:mm:ss'));
		 }else{
			var end=$('[name="endtime"]').val();
			if(!end){
				 hasEnd='no';
			}
		 }
         if(hasEnd=='yes'){
        	 $('[name="hasEnd"][value="yes"]').prop('checked',true);
         }else{
        	 $('[name="hasEnd"][value="no"]').prop('checked',true);
        	 
         }
         
         changeEndtime();
     }
     $('[name="hasEnd"]').change(changeEndtime);
     function changeEndtime(){
    	 var val=$('[name="hasEnd"]:checked').val();
    	 if(val=='yes'){//有结束时间
    		 $('[name="endtime"]').prop('disabled',false);
    	 }else{
    		 $('[name="endtime"]').prop('disabled',false);
    	 }
    	 displayIllustration();
     }
     //每周改变
     $("input[name='week']").change(setValue2);
	 function init_week(weekstr){
		 var weeks = weekstr.split(",");
		 for(var i=0;i<weeks.length;i++){
			 $('#week_'+weeks[i]).prop("checked",true);
		 }
	 }
     //每月没有改变
     function init_month(){
    	 //每月
    	 if(monthpl=='day'){
        	 $('[name="monthpl"][value="day"]').prop('checked',true);
         }else{
        	 $('[name="monthpl"][value="week"]').prop('checked',true);
         }
         monthday=$('#monthday').initSelNum({ // 每月第几天
        	maxVal:31 //最大值
        	,minVal:1 //最小值
        	,value:Number(monthpl_day)
        	,name:'monthday' //其中文本框对应的 name
        	,onChange:setValue3
        });
         $('#weekdjz').val(monthpl_djz);
         $('#weekdjg').val(monthpl_djg);
         
         changeMonthpl();
     }
     $('[name="monthpl"]').change(changeMonthpl);
     $('#weekdjz').change(setValue4);
     $('#weekdjg').change(setValue4);
	 
    function changeMonthpl(){
        var val=$('[name="monthpl"]:checked').val();
        if(val=='day'){//在第几天
        	monthday && monthday.setEnable(true);
    	    $('#weekdjz').prop('disabled',true);
    	    $('#weekdjg').prop('disabled',true);
        	setValue3();
        }else{
        	monthday && monthday.setEnable(false);
        	 $('#weekdjz').prop('disabled',false);
     	    $('#weekdjg').prop('disabled',false);
        	setValue4() ;
        }
    }
    
    function initPage(){
        switch (_zxpl){
            case 1:
            	setValue1();
                break;
            case 2:
            	setValue2();
                break;
            case 3:
            	var wsel=$('[name="monthpl"]:checked').val();
            	if(wsel=='day'){//第几天执行
					setValue3();
				}else{
					setValue4();
				}
                break;
            case 4:
            	setValue_m();
            	break;
        }
    }
    /**
	 * 设置每天
	 * */
	 function setValue1(){
		if(_zxpl==1){
			day = "*";
			month = "*";
			week = "?";
			year = "*";
			displayIllustration();
		}
	}
	 function setValue2(){
		 if(_zxpl==2){
			day = "?";
			month = "*";
			week = "";
			 var weeks=$('input:checkbox[name="week"]:checked');
			 if(weeks){
				 weeks.each(function(i,item){
						week += item.value + ",";
				 });
			 }
			if(week.length>0){
				week = week.substring(0, week.length - 1);
			}
			week = week == "" ? "*" : week;
			year = "*";
			displayIllustration();
		}
	}
	 /**
		 * 设置每月 - 第

	 * */
	 function setValue3() {
		 if(_zxpl==3){
			if(!monthday)return
			day = monthday.getVal();
			month = "*";
			week = "?";
			year = "*";
			displayIllustration();	
		 }
	}
	
	/**
	 * 设置每月 - 在

	 * */
	 function setValue4() {
		 if(_zxpl==3){
			day = "?";
			month = "*";
			week =$("#weekdjz").val();
			if($("#weekdjg").val()!= 5){
				week += "#" + $("#weekdjg").val();
			}else{
				week += "L";
			}
			year = "*";
			displayIllustration();	
		 }
	}
	 /**
	  * 设置每年

	  * */
     function init_year(){
         monthSel=$('#monthSel').initSelNum({ // 每月第几天
         	 maxVal:12 //最大值
         	,minVal:1 //最小值
         	,value:Number(monthvar)
         	,name:'monthSel' //其中文本框对应的 name
         	,onChange:setValue_m
         });
    	 $('#month_weekdjz').val(month_djz);
         $('#month_weekdjg').val(month_djg);
         $('#month_weekdjg').change(setValue_m);
         $('#month_weekdjz').change(setValue_m);
    	 $('#month').change(setValue_m);
     }
	 
	 function setValue_m() {
		 if(_zxpl==4){
			 if(!monthSel)return
			 day = "?";
			 month =monthSel.getVal();
			 week =$("#month_weekdjz").val();
			 if($("#month_weekdjg").val()!= 5){
				 week += "#" + $("#month_weekdjg").val();
			 }else{
				 week += "L";
			 }
			 year = "*";
			 displayIllustration();	
		 }
	 }
		
	/**
	 * 设置每天频率 - 一次

	 * */
	 function setValue5() {
	    var val=$('[name="daypl"]:checked').val();
 	    if(val=='one'){
		   var sj=$("input[name='dayplone']").val();
			if(sj){
				second =sj.substring(6,8);
				minute =sj.substring(3,5);
				hour = sj.substring(0,2);
			}
			displayIllustration();	
	   }
			
	}
	
	/**
	 * 设置每天频率 - 间隔（时）

	 * */
	 function setValue6(){
	  var val=$('[name="daypl"]:checked').val();
 	  if(val=='com'){
		if(!zxjg)return
		var jg=zxjg.getVal();
		var unit= $("#zxjg_unit").val();
		second= "0";
		minute=unit==1?("0/"+jg):"0";
		hour =unit==1?"*":(jg > 24 ? "0/24" : "0/" +jg);
		displayIllustration();
	 }
	}
	 /**
		 * 创建频率区域的显示字符串
		 * */
		 function createStr1(day, month, week, year) {
			// 每天
			if(day == "*"){
				return "每天";
			}
			if(month!='*'){
				return "在每年  "+month+" 月的 " + $("#month_weekdjg").find("option:selected").text() + " " + $("#month_weekdjz").find("option:selected").text();
			}
			// 每周
			if(day == "?" && week.indexOf("#") == -1 && week.indexOf("L") == -1){
				if(week == "*"){
					return "每周";
				}
				var s= "每周 ";
				 var weeks=$('input:checkbox[name="week"]:checked');
				 if(weeks){
					 weeks.each(function(i,item){
							s += item.title+ ",";
					 });
				 }
				if(s.length>0){
					s = s.substring(0, s.length - 1);
				}
				return s;
			}
			// 每月 - 第
			if(day != "*" && day != "?"){
				return "每月 " + "第 " +monthday.getVal() + " 天";
			}
			// 每月 - 在
			return "在每月的 " + $("#weekdjg").find("option:selected").text() + " " + $("#weekdjz").find("option:selected").text();
		}
		
		/**
		 * 创建每天频率区域的显示字符串
		 * */
		 function createStr2(second, minute, hour) {
			// 每天频率 - 间隔（时）
			if(hour.indexOf("/") != -1){
				return "每 " + hour.substr(2) + " 小时执行一次。";
			}
			// 每天频率 - 间隔（分钟）
			if(minute.indexOf("/") != -1){
				return "每 " +minute.substr(2) + " 分钟执行一次。";
			}
			// 每天频率 - 一次
			return "的 " +hour
				 + ":" + minute
				 + ":" + second+ " 执行。";
		}
		
		/**
		 * 创建开始和结束日期的显示字符串
		 * */
		function  createStr3() {
			if(getEndtime()){
				return "任务从 " + getStarttime() + " 开始，到 " + getEndtime() + " 结束。";
			}
			return "任务从 " + getStarttime() + " 开始。";
		}
		
	/**
	 * 显示说明信息
	 * */
	 function displayIllustration(){
		var arr= getQuartzCronExp().split(" ");
		var str1= createStr1(arr[3], arr[4], arr[5], arr[6]);
		var str2= createStr2(arr[0], arr[1], arr[2]);
		var str3= createStr3();
		
		$('[name="description"]').val( str1 + " " + str2 + "\n" + str3);
	}
	function  getQuartzCronExp(){
	    return second + " " + minute + " " + hour + " " + day + " " + month + " " + week + " " + year;
	}
	 function getStarttime(){
		return $('[name="starttime"]').val();
	}
	
	 function getEndtime(){
		 var val= $('[name="hasEnd"]:checked').val();
		 if(val=='yes'){
				return  $('[name="endtime"]').val();
			}
		return "";
	}



});