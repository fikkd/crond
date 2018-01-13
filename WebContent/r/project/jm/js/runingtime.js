$(function(){
	  //底部按钮操作
	 $('.js-fbtns').on('click','button',bottomHandler);
    // 底部按钮点击事件
    function bottomHandler(){
        var txt=$(this).attr('data-val');
        switch (txt){
            case 'cancel':
            	parent.closeLayer['jm']();
                break;
        }
    }
});