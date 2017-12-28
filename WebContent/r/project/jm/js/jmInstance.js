$(function(){
    // 底部按钮点击事件
    function bottomHandler(){
        var txt=$(this).attr('data-val');
        switch (txt){
            case 'cancel':// 取消
            	 parent.closeLayer['closejm']();
                break;
        }
    }
    //底部按钮操作
    $('.pageBot_in').on('click','button',bottomHandler);
   
});