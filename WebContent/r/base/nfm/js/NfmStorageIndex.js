/**
 * Created by QianQi on 2016/2/18
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
        $('#newBtn').click(add);// 新建
        $('#delBtn').click(delZd);// 删除
        $('#editBtn').click(edit);// 修改
        initZdGrid();

        /** zd 弹框 **/
        /**
         * 显示 zd 弹框
         * @param id {string=} 字典 id，新建时此字段为 undefined
         */
        function showZdEdit(id){
            var url=BASEPATH+'nfm/addOrUpdateNfmStorage.do'// TODO 字典编辑页面
                ,title;
            if(id){
                url+='?id='+id;
                title='修改存储空间信息';
            }else{
                
                title='新建存储空间信息';
            }
            zdLayer.show({
                content:url
                ,title:title
                ,area: ['400px','210px']
            });
        }
        function showZdView(id){
            zdLayer.show({
                content:'zdView.html?system_zdgroup_id='+group_id+'&id='+id// TODO 字典编辑页面
                ,title:'查看字典'
                ,area: ['80%','80%']
            });
        }
        // 字典变更时执行的回调函数
        function gropuLayer_cb(args){
            initZdGrid();// TODO 字典变更后是否需要刷新当前列表
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
            return '<input type="button" value="修改" data-val="edit" class="btn-min" />'+
                '<input type="button" value="删除" data-val="del" class="btn-min" style="margin-left: 2px;"/>';
        }
        // 操作单元格单击事件
        function zdGrid_cellCtrl_click(e,val,row,i){
            var trigger=$(e.target)
                ,elType=trigger.attr('data-val');
            if(elType=='edit'){
                showZdEdit(row.id);
            }else if(elType=='del'){
                del(row.id);
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
                    'system_zdgroup_id': group_id
                    ,'keyWord':zd_keyword
                };
            $('#queryZdTxt').val(zd_keyword);// 查询条件显示更新
             if(!zdGrid){// 初始化
                zdGrid=zdGridEl.initGrid({
                    url: BASEPATH+'nfm/findAllStorage.do'// TODO 字典列表请求地址
                    ,args: args
                    ,page: {
                        percount: per
                        ,perList: [10, 20, 30, 40]
                    }
                    ,cols: [
                         { field: 'lvl', title: '优先级', width: '100px', align: 'center'}
                        ,{ field: 'storage', title: '空间地址', width: '300px'}
                        ,{ field: 'roomage', title: '空间大小', width: '150px', align: 'left',render: zdGrid_renderLx}
                        ,{ field: 'usespace', name: 'ctrl', title: '空间已用大小', width: '150px', align: 'left',render: zdGrid_renderLx}
                        ,{ field: 'usespace', name: 'ctrl', title: '操作', width: '120px', align: 'center', render: zdGrid_renderCtrl}
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
        // 新建
        function add(){
            showZdEdit(group_id);
        }
        function edit(){
        	var chks=zdGrid.getCheckedIdx()// 当前选中行索引列表
            showZdEdit(id);
        }
        function del(id){

            layer.confirm('确定要删除吗？', {
                btn: ['确定','取消'] //按钮
            }, function(index){
                $.fn.request(BASEPATH+'nfm/delStorageSpaces.do?ids='+id,function(data){// TODO 删除请求
                	  $.showMsg("删除成功！",function(){
                		  initZdGrid();
                          layer.close(index);}
                          );
                	
                },{ /* 后台参数 */ },true);
            });
       
        	 }
        // 删除
        function delZd(){
            if(!zdGrid) return;
//            showZdEdit(group_id);
            var chks=zdGrid.getCheckedIdx()// 当前选中行索引列表
                ,data=zdGrid.getData();// 当前列表行数据
            if(chks.length){
                layer.confirm('确定要删除吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(index){
                	var ids = "";
                	for ( var i = 0; i < chks.length; i++) {
                		ids = ids + data[i].id + ",";
					}
                    $.fn.request(BASEPATH+'nfm/delStorageSpaces.do?ids='+ids,function(data){// TODO 删除请求
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