/**
 * Created by QianQi on 2016/2/22
 */
$(function(){
    var vali=$('.detailtable').initValidator({
        rules:{
            'storage':{
                'required':true
            },
            'lvl':{
                'required':true,
                'number':true
            },
            'roomage':{
                'required':true, 
                'number':true
            }
        }
        ,callback: $.showValiTip
    });
    $('.pageBot_in').on('click','button',bottomHandler);
    $('#groupform').on('keydown',function(e){ return e.which!=13;});
    // 底部按钮点击事件
    function bottomHandler(){
        var txt=$(this).attr('data-val');
        switch (txt){
            case 'submit':// 提交
                if(!vali.validateAll()) return;
                $.fn.request(BASEPATH+'nfm/saveOrupdateStorage.json',function(data){// 提交完成后关闭弹窗
                	data={
                	};
                    $.showMsg("保存成功！",function(){parent.cusLayer['group'](data.id,true);
                    parent.closeLayer['group']();});
                    
                }, $.extend({},{
                   
                },$('#groupform').serializeObject()),true);
                break;
            case 'cancel':// 取消
                parent.closeLayer['group']();
                break;
        }
    }

    
});