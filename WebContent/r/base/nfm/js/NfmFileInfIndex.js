/**
 * Created by QianQi on 2016/2/18.
 */
(function($){
    $(function(){
        (function initFrame(){
            if(!$('html').hasClass('inframe')){
                var today = $.getDate();
                $('.page>.pageMain')
                    .css({
                        'top':'60px'
                        ,'bottom':'25px'
                    })
                    .before('<div class="header clearf">' +
                        '<div class="header-l"></div>' +
//                    '<div class="header-r"></div>' +
                        '</div>')
                    .after('<div class="footer clearf">' +
                        '<div class="footer-l">' +
                        '<div class="footer-item"><span class="fa fa-calendar"></span><span>'+ today.format('yyyy-MM-dd')+'</span></div>' +
                        '</div>' +
                        '<div class="footer-r">' +
//                    '<div class="footer-item"><span class="fa fa-desktop"></span><span>Ver.3.0</span></div>' +
                        '<div class="footer-item"><span>&copy;'+today.format('yyyy')+'&emsp;Wisoft</span></div>' +
                        '</div>' +
                        '</div>');
            }
        })();
        var group_id // 记录当前选中分组的 id
            ,zd_keyword='';// 记录当前字典列表筛选关键字
        /* 开始初始化 */
        var zdGrid;// 在树节点点击时，通过 initZdGrid() 初始化
        var zdLayer= $.initCusLayer(gropuLayer_cb,'group');
        $('#uploadBtn').click(uploadFiles);// 上传
        $('#downloadBtn').click(downloadMore);// 批量下载
        $('#delMoreBtn').click(delMore);//批量删除
        $('#queryZdBtn').click(queryZd);// 查找
        initZdGrid();

       
        // 字典变更时执行的回调函数
        function gropuLayer_cb(args){
           initZdGrid();// TODO 字典变更后是否需要刷新当前列表
           //接收上传成功后返回的附件ids，多个附件之间用分号进行隔开 
           //alert(args);
        }
        /** 字典列表 **/
        // 类型单元格 render
        function zdGrid_renderLx(bytes,row,i,datalist){
        	if (bytes === 0) return '0 B';
            var k = 1024, 
                sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));

           return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];

        }
        // 操作单元格 render
        function zdGrid_renderCtrl(val,row,i,datalist){
            return '<input type="button" value="下载" data-val="dowmload" class="btn-min" />'+
                '<input type="button" value="删除" data-val="deleteFile" class="btn-min" style="margin-left: 2px;" />';
        }
        // 操作单元格单击事件
        function zdGrid_cellCtrl_click(e,val,row,i){
            var trigger=$(e.target)
                ,elType=trigger.attr('data-val');
            if(elType=='dowmload'){		//下载文件
            	//alert("单文件下载");
            	window.location.href=BASEPATH+'nfm/dowmloadFile.do?id='+row.id;
            }else if(elType=='deleteFile'){	//删除文件
            	//alert("删除");
            	layer.confirm('确定要删除吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(index){
                    $.fn.request(BASEPATH+'nfm/delFiles.do?id='+row.id,function(data){// TODO 删除请求
                    	$.showMsg("删除成功！",function(){
                  		  initZdGrid();
                            layer.close(index);}
                            );
                    },{ /* 后台参数 */ },true);
                });
            }
        }
        // 行双击事件
//        function zdGrid_row_dbclick(e,row,i){
//            console.log('click',row,i);
//        }
        /**
         * 根据页面中选中的分组 id 初始化右侧的表格
         */
        function initZdGrid() {
            var zdGridEl=$('#zdGrid')
                ,per=10 // 默认每页显示 10 条数据
                ,args={// TODO 列表数据请求参数
            	'keyword':zd_keyword
                };
            $('#queryZdTxt').val(zd_keyword);// 查询条件显示更新
            if(!zdGrid){// 初始化
                zdGrid=zdGridEl.initGrid({
                    url: BASEPATH+'nfm/findAllFileinf.do'// TODO 字典列表请求地址
                    ,args: args
                    ,page: {
                        percount: per
                        ,perList: [10, 20, 30, 40]
                    }
                    ,cols: [
                        { field: 'nfm_fileamount_id', title: '文件MD5编号', width: '150px'}
                        ,{ field: 'filename', title: '文件名称', width: '150px'}  
                        ,{ field: 'filesize', title: '文件大小', width: '80px', render: zdGrid_renderLx} 
                        ,{ field: 'upload_time', title: '上传时间', width: '120px'} 
                        ,{ field: '', name: 'ctrl', title: '操作', width: '120px', align: 'center', render: zdGrid_renderCtrl}
                    ]
                    ,showno: true
                    ,chkField: 'check'
                    ,callback: {
                        cell: {
                            'ctrl': {
                                'click': zdGrid_cellCtrl_click
                            }
                        }
//                        ,row: {
//                            'dblclick': zdGrid_row_dbclick
//                        }
                    }
                });
            }else{// 刷新数据
                var manuSel=zdGridEl.next().find('.manu-sel');// 每页显示数据条数
                zdGrid.resetData({
                    args: args
                    ,page: {
                        percount: manuSel.length ? parseInt(manuSel.val()) : per
                    }
                });
            }
        }
        /** 其他事件 **/
        //上传文件
        function uploadFiles()
        {
        	var url=BASEPATH+'nfm/uploadindex.do';
            zdLayer.show({
                content:url
                ,title:'附件上传'
                ,area: ['450px','250px']
            });
        }
        
        //批量下载
        function downloadMore()
        {
        	if(!zdGrid) return;
            var chks=zdGrid.getCheckedIdx();// 当前选中行索引列表
            var data=zdGrid.getData();// 当前列表行数据           
            if(chks.length)
            {           
              var chkIds=[];
              var idStrs="";
              for(var i=0;i<chks.length;i++)
              {
                 chkIds.push(data[chks[i]].id);
                 idStrs=idStrs+data[chks[i]].id+",";
              }
              idStrs=idStrs.substring(0, idStrs.length-1);	//把最后一个逗号截掉
              if(chks.length==1)	//只选中了一个，说明是单个附件下载
              {
            	  window.location.href=BASEPATH+'nfm/dowmloadFile.do?id='+idStrs;
              }
              else	//多附件下载
              {
            	  window.location.href=BASEPATH+'nfm/dowmloadFile.do?isMultiDownload=1&id='+idStrs;
              }             
            }else{
                $.showValiTip(this,'请勾选要下载的数据！');
            }
        }
        
        
        
        //批量删除
        function delMore(){
            if(!zdGrid) return;
            var chks=zdGrid.getCheckedIdx();// 当前选中行索引列表
            var data=zdGrid.getData();// 当前列表行数据           
            if(chks.length){
                layer.confirm('确定要删除吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(index){
                	var chkIds=[];
                    var idStrs="";
                    for(var i=0;i<chks.length;i++)
                    {
                        chkIds.push(data[chks[i]].id);
                        idStrs=idStrs+data[chks[i]].id+",";
                    }
                    idStrs=idStrs.substring(0, idStrs.length-1);	//把最后一个逗号截掉
                    $.fn.request(BASEPATH+'nfm/delFiles.do?id='+idStrs,function(data){// TODO 删除请求
                    	$.showMsg("删除成功！",function(){
                  		  initZdGrid();
                            layer.close(index);}
                            );
                    },{ /* 后台参数 */ },true);
                });
            }else{
                $.showValiTip(this,'请勾选要删除的数据！');
            }
        }
        // 根据关键字查询字典
        function queryZd(){
            zd_keyword=$('#queryZdTxt').val().trim();
            initZdGrid();
        }
    });
})(jQuery);