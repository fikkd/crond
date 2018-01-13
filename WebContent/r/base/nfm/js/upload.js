/**
 * Created by QianQi on 2016/2/22
 */
	$(function(){
	    $('.pageBot_in').on('click','button',bottomHandler);
	    $('#groupform').on('keydown',function(e){ return e.which!=13;});
    // 底部按钮点击事件
    function bottomHandler(){
        var txt=$(this).attr('data-val');
        switch (txt){
            case 'submit':// 提交
            	
//            	$("#groupform").attr("enctype", "multipart/form-data");
//                $("#groupform").attr("encoding", "multipart/form-data");
//                $('#groupform').attr('enctype', 'multipart/form-data').get(0).encoding = 'multipart/form-data';
                
//                $.fn.request(BASEPATH+'nfm/uploadFile.do',function(data){// 提交完成后关闭弹窗
//                	data={
//                	};
//                    $.showMsg("上传成功！",function(){parent.cusLayer['group'](data.id,true);
//                    parent.closeLayer['group']();});
//                    
//                }, $.extend({},{
//                   
//                },$('#groupform').serializeObject()),true);
                
                //以下写法必须IE8以上才能支持
                var formData = new FormData($( "#groupform" )[0]);   
                     $.ajax({   
                          url: BASEPATH+'nfm/uploadFile.do' ,   
                         type: 'POST',   
                         data: formData,   
                         async: false,   
                          cache: false,   
                          contentType: false,   
                          processData: false,   
                          success: function (returndata) {   
                             // alert(returndata.msg+"返回的ID="+returndata.data);                             
                        	  parent.$("#picid").val(returndata.data);
                        	  parent.uploadsuccess();
                              parent.closeLayer['uploadpic']();
                         },   
                          error: function (returndata) {   
                              alert("上传失败！");   
                          }   
                     });       
                break;
                
            case 'cancel':// 取消
                parent.closeLayer['uploadpic']();
                break;
        }
    }

    
});