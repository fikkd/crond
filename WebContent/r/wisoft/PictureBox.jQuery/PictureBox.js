/**
 * Created by QianQi on 2015/5/25.
 */
/**
 * PictureBoxTrigger 图片查看器触发类
 * @param {Object} container 页面中显示图片的容器
 * @param {Object} win 图片查看器显示页面的 window 对象
 * @param {string} imageViewId 设置查看器对应的DOM的 id
 * @param {Array} srcs 数据源集合，字符串数组
 * @param {Object=} options
 * - width: 整数 默认为 600
 * - height: 整数 默认为 400
 * - mouseZoom: bool 是否支持鼠标缩放，默认为 true
 * - mouseDrag: bool 是否支持鼠标拖拽，默认为 true
 * - supportSave: bool 是否支持保存，默认为 false
 * - dlUrls:[string] 保存链接
 * return {object}
 *   obj.resetSrcs(srcs);// 修改图片路径数组
 */
var PictureBoxTrigger=function(container,win,imageViewId,srcs,options){
    return this.init(container,win,imageViewId,srcs,options);
};
PictureBoxTrigger.prototype={
    init: function(container,win,imageViewId,srcs,options){
        if(!win || !win.creatPictureBox) return;// win 不存在
        var trigger=this;
        trigger.pictureBox = win.creatPictureBox(imageViewId,srcs,options);// 获取 pictureBox 对象
        trigger.addTrigger((container.length>0) ? container : $(document));
        return {
            resetSrcs: function(srcs){
                trigger.pictureBox.resetSrcs.call(trigger.pictureBox,srcs);
            }
        };
    }
    ,addTrigger: function(container){
        var trigger = this;
        container.on('click.iv-start','img',function(){
            if(trigger.pictureBox){
                var index = container.find('img').index($(this));// 获取图片索引
                trigger.pictureBox.showBox(index);
            }
        });
    }
};
/**
 * 图像变换类
 * @param container 要添加 img 的直接父容器
 * @param {Object} options
 * - onPreLoad: 图片加载前的回调函数
 * - onLoad: 图片加载成功的回调函数
 * - onError: 图片加载失败的回调函数
 * - mouseZoom: 是否支持鼠标缩放
 * - mouseDrag: 是否支持鼠标拖拽
 * @constructor
 */
var ImageTrans = function(container, options){
    this._initialize( container, options);
    this._initMode();
    if ( this._support ) {
        this._initContainer();
        this._init();
    } else {//模式不支持
        this.onError("not support");
    }
};
ImageTrans.prototype = {
    //初始化程序
    _initialize: function(container, options) {
        this._container=container;
        this._img = new Image();//图片对象
        this._x = this._y = 1;//水平/垂直变换参数
        this._radian = 0;//旋转变换参数
        this._support = false;//是否支持变换
        this._init = this._load = this._show = this._dispose = function(){};

        var opt = this._setOptions(options);
        this._zoom = opt.zoom;
        this.onPreLoad = opt.onPreLoad;
        this.onLoad = opt.onLoad;
        this.onError = opt.onError;

        var imageTrans = this;
        this._LOAD=function (oriSize) {
            imageTrans.onLoad();
            imageTrans._load();
            imageTrans.reset(oriSize);
            imageTrans._img.style.visibility = "visible";
        };

        // 扩展的 init
        if (this.cusevents){
            var args = Array.prototype.slice.call(arguments, 2), handlers = this.cusevents["init"];
            for (var i in handlers) {
                handlers[i].apply(this, args);
            }
        }
    },
    resize: function(oriSize){
        if(this._img.style.visibility=='visible'){
            this._LOAD(oriSize);
        }
    },
    //设置默认属性
    _setOptions: function(options) {
        this.options = {//默认值
            mode:		"css3|filter|canvas",
            zoom:		.1,//缩放比率
            onPreLoad:	function(){},//图片加载前执行
            onLoad:		function(){},//图片加载后执行
            onError:	function(err){}//出错时执行
        };
        return $.extend(this.options, options || {});
    },
    //模式设置
    _initMode: function() {
        var modes = ImageTrans.modes
            ,object=this.options.mode.toLowerCase().split("|")
            ,callback=function(mode){
                mode = modes[ mode ];
                if ( mode && mode.support ) {
                    mode.init && (this._init = mode.init);//初始化执行程序
                    mode.load && (this._load = mode.load);//加载图片执行程序
                    mode.show && (this._show = mode.show);//变换显示程序
                    mode.dispose && (this._dispose = mode.dispose);//销毁程序
                    //扩展变换方法
                    var transforms = ImageTrans.transforms;
                    var imageTrans = this;
                    for (var name in transforms) {
                        var res = (function(transform, name){
                            imageTrans[name] = function(){
                                transform.apply( imageTrans, arguments);
                                imageTrans._show();
                            }
                        })(transforms[name], name);
                        if(res === false) break;
                    }
                    return true;
                }
            }
            ,thisp = this;
        var ret = false;
        var _callback=function () {
            if (callback.apply(thisp, arguments)) {
                ret = true;
                return false;
            }
        };
        for (var i = 0; i < object.length; i++) {
            var res=_callback(object[i], i, object);
            if (false === res) break;
        }
        this._support = ret;
    },
    //初始化容器对象
    _initContainer: function() {
        if (this.cusevents){
            var args = Array.prototype.slice.call(arguments, 2), handlers = this.cusevents["initContainer"];
            for (var i in handlers) {
                handlers[i].apply(this, args);
            }
        }
    },
    //加载图片
    load: function(src) {
        if ( this._support ) {
            var img = this._img, oThis = this;
            img.onload || ( img.onload = this._LOAD );
            img.onerror || ( img.onerror = function(){ oThis.onError("err image"); } );
            img.style.visibility = "hidden";
            this.onPreLoad();
            img.src = src;
        }
    },
    //重置
    reset: function(oriSize) {// oriSize 时显示原大
        if (this._support) {
            var img = this._img,zoom;
            this._x=this._y=zoom=1;// 先恢复原大
            this._radian = 0;
            this._show();
            if(oriSize===true || !img.offsetWidth && !img.offsetHeight){
            }else{
                var ws = this._container.width()/img.offsetWidth;
                var hs = this._container.height()/img.offsetHeight;
                zoom = Math.min(Math.floor(Math.min(ws, hs)*10)/10,1)||1;
                this._x=this._y=zoom;// 若图片较大，自动缩小
                this._show();
            }
        }
    },
    //销毁程序
    dispose: function() {
        if ( this._support ) {
            this._dispose();
            if (this.cusevents){
                var args = Array.prototype.slice.call(arguments, 2), handlers = this.cusevents["dispose"];
                for (var i in handlers) {
                    handlers[i].apply(this, args);
                }
            }
            this._container = this._img = this._img.onload = this._img.onerror = this._LOAD = null;
        }
    }
};
//变换模式
ImageTrans.modes = function(){
    var css3Transform;//ccs3变换样式
    //初始化图片对象函数
    function initImg(img, container) {
        var _img = $(img);
        _img.css('visibility', "hidden");//加载前隐藏
        container.append(_img);
    }
    //获取变换参数函数
    function getMatrix(radian, x, y) {
        var Cos = Math.cos(radian), Sin = Math.sin(radian);
        return {
            M11: Cos * x, M12:-Sin * y,
            M21: Sin * x, M22: Cos * y
        };
    }
    return {
        css3: {//css3设置
            support: function(){
                var style = document.createElement("div").style;
                var object = [ "transform", "MozTransform", "webkitTransform", "OTransform" ]
                    ,callback = function(css){
                        if ( css in style ) {
                            css3Transform = css; return true;
                        }
                    }
                    ,ret = false;
                var _callback=function () {
                    if (callback.apply(undefined, arguments)) {
                        ret = true;
                        return false;
                    }
                };
                for (var i = 0; i < object.length; i++) {
                    var res=_callback(object[i], i, object);
                    if (false === res) break;
                }
                return ret;
            }(),
            init: function() { initImg( this._img, this._container ); },
            load: function(){
            },
            show: function() {
                var img = this._img;
                $(img).css({//居中
                    'marginTop': (-img.naturalHeight / 2) + "px",
                    'marginLeft': (-img.naturalWidth) / 2 + "px",
                    'visibility': "visible"
                });
                var matrix = getMatrix( this._radian, this._y, this._x );
                //设置变形样式
                img.style[ css3Transform ] = "matrix("
                    + matrix.M11.toFixed(16) + "," + matrix.M21.toFixed(16) + ","
                    + matrix.M12.toFixed(16) + "," + matrix.M22.toFixed(16) + ", 0, 0)";
            },
            dispose: function(){ $(this._img).remove(); }
        },
        filter: {//滤镜设置
            support: function(){ return "filters" in document.createElement("div"); }(),
            init: function() {
                initImg( this._img, this._container );
                //设置滤镜
                this._img.style.filter = "progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand')";
            },
            load: function(){
            },
            show: function() {
                var img = this._img;
                img.onload = null;//防止ie重复加载gif的bug
                $.extend(
                    img.filters.item("DXImageTransform.Microsoft.Matrix"),
                    getMatrix( this._radian, this._y, this._x )
                );
                $(img).css({//居中
                    'marginTop': (-img.offsetHeight / 2) + "px",
                    'marginLeft': (-img.offsetWidth) / 2 + "px",
                    'visibility': "visible"
                });
            },
            dispose: function(){ $(this._img).remove(); }
        }
    };
}();
//变换方法
ImageTrans.transforms = {
    //垂直翻转
    vertical: function() {
        this._radian = Math.PI - this._radian; this._y *= -1;
    },
    //水平翻转
    horizontal: function() {
        this._radian = Math.PI - this._radian; this._x *= -1;
    },
    //根据弧度旋转
    rotate: function(radian) { this._radian = radian; },
    //向左转90度
    left: function() {
        this._radian -= Math.PI/2;
    },
    //向右转90度
    right: function() {
        this._radian += Math.PI/2;
    },
    //根据角度旋转
//    rotatebydegress: function(degress) { this._radian = degress * Math.PI/180; },
    //缩放
    scale: function () {
        function getZoom(scale, zoom) {
            return	scale > 0 && scale >-zoom ? zoom :
                    scale < 0 && scale < zoom ?-zoom : 0;
        }
        return function(zoom) { if( zoom ){
            var hZoom = getZoom( this._y, zoom ), vZoom = getZoom( this._x, zoom );
            if ( hZoom && vZoom ) {
                this._y += hZoom; this._x += vZoom;
            }
        }}
    }(),
    //放大
    zoomout: function() { this.scale( Math.abs(this._zoom) ); },
    //缩小
    zoomin: function() { this.scale( -Math.abs(this._zoom) ); }
};
// 扩展
ImageTrans.prototype._initialize = (function(){
    var init = ImageTrans.prototype._initialize
        ,_mousewheel = (/firefox/.test(window.navigator.userAgent.toLowerCase()) ? "DOMMouseScroll" : "mousewheel")+'.zoom'// 判断是否为 firefox
        ,methods = {
            "init": function(){
            },
            "initContainer": function(){
                var imageTrans = this;
                // 滚轮缩放
                if(imageTrans.options.mouseZoom !== false){
                    imageTrans._container.on(_mousewheel,function(e){
                        if(imageTrans._img.style.visibility!='visible') return;
                        var originalEvent = e.originalEvent;
                        var mul = originalEvent.wheelDelta ? originalEvent.wheelDelta / 120 : (-originalEvent.detail || 0) / 3;// detail 适用于 firefox
                        imageTrans.scale( mul * Math.abs(imageTrans._zoom) );
                        e.preventDefault();
                    });
                }
                // 鼠标拖动
                if(imageTrans.options.mouseDrag !== false){
                    imageTrans._container.on('mousedown.drag','img',function(e){
                        imageTrans._container.css('cursor','move');
                        // firefox 中禁止 img 拖动
                        e.preventDefault();
                        e.stopPropagation();
                        var img=imageTrans._img
                            ,_x= e.clientX
                            ,_y= e.clientY
                            ,_marginTop = parseInt(img.style.marginTop)
                            ,_marginLeft = parseInt(img.style.marginLeft);
                        $(document).on('mousemove.drag',function(e){
                            var offsetX= e.clientX-_x
                                ,offsetY= e.clientY-_y;
                            img.style.marginLeft=(_marginLeft+offsetX)+'px';
                            img.style.marginTop=(_marginTop+offsetY)+'px';
                            // webkit 中禁止 img 拖动
                            e.stopPropagation();
                            // IE8 中禁止 img 拖动
                            var ev = e.originalEvent;
                            if(ev){
                                ev.cancelBubble=true;
                                ev.returnValue = false;
                            }
                        });
                        $(document).on('mouseup.drag',function(){
                            imageTrans._container.css('cursor','auto');
                            _x=_y=undefined;
                            $(document).off('mousemove.drag');
                            $(document).off('mouseup.drag');
                            $(document).off('mouseleave.drag');
                        });
                        imageTrans._container.on('mouseleave.drag',function(){
                            imageTrans._container.css('cursor','auto');
                            _x=_y=undefined;
                            $(document).off('mousemove.drag');
                            $(document).off('mouseup.drag');
                            $(document).off('mouseleave.drag');
                        });
                    });
                }
            },
            "dispose": function(){
                this._container.off(_mousewheel);
            }
        };
    return function(){
        var options = arguments[1];
        for(var name in methods){
            var method = methods[name];
            if (!this.cusevents) this.cusevents = {};
            if (!this.cusevents[name]) this.cusevents[name] = {};
            this.cusevents[name].method = method;
        }
        init.apply( this, arguments );
    }
})();

/**
 * PictureBox 图片查看器类
 * @param {string} imageViewId 设置查看器对应的DOM的 id
 * @param {Array} srcs 数据源集合，字符串数组
 * @param {Object=} options
 * - width: 整数 默认为 600
 * - height: 整数 默认为 400
 * - mouseZoom: bool 是否支持鼠标缩放，默认为 true
 * - mouseDrag: bool 是否支持鼠标拖拽，默认为 true
 * - supportSave: bool 是否支持保存，默认为 false
 * - dlUrls:[string] 保存链接
 */
var PictureBox=function(imageViewId,srcs,options){
    this.init(imageViewId,srcs,options);
    this.creatBox();
    return this;
};
PictureBox.prototype={
    init: function(imageViewId,srcs,options){
        this.$elem=$('#'+imageViewId);// jq 元素
        // 初始化 this.$elem
        if(this.$elem.length<=0){// 新建
            this.$elem=$('<div class="wi-imageview" id="'+imageViewId+'"></div>');
        }else{
            this.$elem.attr({'class':'wi-imageview','style':''});
        }
        this.srcs=srcs || [];
        this.opts={// 默认属性
            fullScreen:true
            ,initFull:true
            ,supportSave:false
            ,width: 600
            ,height: 400
            ,toBody: true
            ,noClose: false
        };
        $.extend(this.opts,options);// 扩展用户配置
        this.index=-1;
        this.imagetrans=undefined;
        this.$pic=undefined;// img 的直接父元素
    }
    ,_toolView: function(){
        var pictureBox = this;
        if (pictureBox.srcs.length<=1) {
            pictureBox.$elem.find('.wi-imageview-ctrl-prev,.wi-imageview-ctrl-next').hide();// 隐藏切换图片按钮
        }else{
            pictureBox.$elem.find('.wi-imageview-ctrl-prev,.wi-imageview-ctrl-next').show();// 隐藏切换图片按钮
        }
    }
    ,creatBox: function(){
        var pictureBox = this;
        pictureBox.$elem.html('<div class="wi-imageview-picbox wi-unselectable">'+
            '    <div class="wi-imageview-pic"></div>'+
            '    <div class="wi-imageview-ctrl wi-imageview-ctrl-prev" title="上一张"></div>'+
            '    <div class="wi-imageview-ctrl wi-imageview-ctrl-next" title="下一张"></div>'+
            '    <div class="wi-imageview-toolbar">'+
            '        <a class="wi-imageview-orisize" title="原始大小"></a>'+
            '        <a class="wi-imageview-zoomout" title="放大"></a>'+
            '        <a class="wi-imageview-zoomin" title="缩小"></a>'+
            '        <a class="wi-imageview-reset" title="重置"></a>'+
            '        <a class="wi-imageview-toleft" title="逆时针旋转"></a>'+
            '        <a class="wi-imageview-toright" title="顺时针旋转"></a>'+
            '        <a class="wi-imageview-save" title="本地保存"></a>'+
            '        <a class="wi-imageview-full" title="全屏"></a>'+
//            '        <a class="wi-imageview-origin" title="退出全屏"></a>'+
            '    </div>'+
            '    <div class="wi-imageview-close"></div>'+
            '</div>');
        pictureBox._setPicBoxStyle();
        pictureBox.$pic = pictureBox.$elem.find('.wi-imageview-pic');
        if(!pictureBox.opts.supportSave){
            pictureBox.$elem.find('.wi-imageview-save').hide();// 隐藏保存按钮
            pictureBox.$elem.find('.wi-imageview-picbox').on('contextmenu',function(e){
                e.preventDefault();// 禁用浏览器右键菜单
            });
        }
        if(pictureBox.opts.noClose){
            pictureBox.$elem.find('.wi-imageview-close').hide();// 隐藏关闭按钮
        }
        pictureBox._toolView();
        pictureBox._addEvents();
        if(pictureBox.opts.toBody){// 添加到 body
            $('body').append(pictureBox.$elem);
        }
        pictureBox.imagetrans = new ImageTrans( pictureBox.$pic, {
            onPreLoad: function(){ pictureBox._setPicClass(' wi-imageview-pic-loading');}
            ,onLoad: function(){ pictureBox._setPicClass('');}
            ,onError: function(){ pictureBox._setPicClass(' wi-imageview-pic-error');}
            ,mouseZoom: (pictureBox.opts.mouseZoom != false) // 是否支持鼠标缩放
            ,mouseDrag: (pictureBox.opts.mouseDrag != false) // 是否支持鼠标拖拽
        });
        if(pictureBox.opts.initFull){
            pictureBox._setPicBoxStyle(true);
            pictureBox.imagetrans.resize(pictureBox.$pic.width(),pictureBox.$pic.height());
        }
    }
    ,_addEvents:function(){
        var that = this;
        that.$elem.find('.wi-imageview-close').click(function(){
            if(that.opts.fullScreen){// 全屏
                window.resizeTo(that.originalW,that.originalH);
                window.moveTo(that.originalL,that.originalT);
            }
            that.$elem.hide();
        });
        that.$elem.find('.wi-imageview-orisize').click(function(){
            if(that.$elem.find('.wi-imageview-pic-error').length<=0)
                that.imagetrans.resize(true);
        });
        that.$elem.find('.wi-imageview-zoomout').click(function(){
            if(that.$elem.find('.wi-imageview-pic-error').length<=0)
                that.imagetrans.zoomout();
        });
        that.$elem.find('.wi-imageview-zoomin').click(function(){
            if(that.$elem.find('.wi-imageview-pic-error').length<=0)
                that.imagetrans.zoomin();
        });
        that.$elem.find('.wi-imageview-reset').click(function(){
            if(that.$elem.find('.wi-imageview-pic-error').length<=0)
                that.imagetrans.reset();
        });
        that.$elem.find('.wi-imageview-toleft').click(function(){
            if(that.$elem.find('.wi-imageview-pic-error').length<=0)
                that.imagetrans.left();
        });
        that.$elem.find('.wi-imageview-toright').click(function(){
            if(that.$elem.find('.wi-imageview-pic-error').length<=0)
                that.imagetrans.right();
        });
        that.$elem.find('.wi-imageview-ctrl-next').click(function(){
            that.index++;
            if(that.index>=that.srcs.length) that.index=0;
            that.viewPic();
        });
        that.$elem.find('.wi-imageview-ctrl-prev').click(function(){
            that.index--;
            if(that.index<0) that.index=that.srcs.length-1;
            that.viewPic();
        });
        that.$elem.find('.wi-imageview-save').click(function(){// 保存
            if(that.$elem.find('.wi-imageview-pic-error').length<=0){
                if(that.opts.dlUrls){
                    window.open(that.opts.dlUrls[that.index],'_blank');
                }else{
                    window.open(that.srcs[that.index],'_blank');
                }
            }
        });
        that.$elem.find('.wi-imageview-full').click(function(){// 全屏
            that._setPicBoxStyle(true);
            that.imagetrans.resize();
        });
        that.$elem.find('.wi-imageview-origin').click(function(){// 退出全屏
            that._setPicBoxStyle();
            that.imagetrans.resize();
        });
    }
    ,viewPic:function(){
        this.imagetrans.load(this.srcs[this.index]);
    }
    ,showBox:function(index){
        var pictureBox = this
            ,oldIndex = pictureBox.index;
        if(pictureBox.opts.fullScreen){// 全屏
            if(!pictureBox.originalW){
                if(window.outerWidth){
                    pictureBox.originalW=window.outerWidth;
                    pictureBox.originalH=window.outerHeight;
//                    pictureBox.originalL=window.screenX || window.screenLeft;
//                    pictureBox.originalT=window.screenY || window.screenTop;
                }else{// IE8
                    pictureBox.originalW=document.documentElement.clientWidth;
                    pictureBox.originalH=document.documentElement.clientHeight+70;
//                    pictureBox.originalL=Math.floor((screen.availWidth-pictureBox.originalW)/2);
//                    pictureBox.originalT=Math.floor((screen.availHeight-pictureBox.originalH)/2);
                }
                pictureBox.originalL=Math.floor((screen.availWidth-pictureBox.originalW)/2);
                pictureBox.originalT=Math.floor((screen.availHeight-pictureBox.originalH)/2);
            }
            window.resizeTo(screen.availWidth,screen.availHeight);
            window.moveTo(0,0);
        }
        pictureBox.$elem.show();
        if(oldIndex != index){// 改变了当前图，需调用 viewPic，否则直接显示
            pictureBox.index = index;
            pictureBox.viewPic();
        }else if(!pictureBox.$pic.hasClass('wi-imageview-pic-error')){
            pictureBox.imagetrans.reset();
        }
    }
    ,_setPicBoxStyle:function(full){// 根据是否全屏调整 picbox 的样式
        var _style = {};
        if(full){// 全屏
            $.extend(_style,{'top':'2px','left':'2px','bottom':'2px','right':'2px'});
            this.$elem.find('.wi-imageview-origin').css('display','inline-block');
            this.$elem.find('.wi-imageview-full').hide();
        }else{
            var boxW = this.opts.width, boxH = this.opts.height;
            if(boxW){// 定义了宽度
                $.extend(_style,{'left':'50%','margin-left':(-Math.ceil(boxW/2))+'px','width':boxW+'px'});
            }
            if(boxH){// 定义了高度
                $.extend(_style,{'top':'50%','margin-top':(-Math.ceil(boxH/2))+'px','height':boxH+'px'});
            }
            this.$elem.find('.wi-imageview-origin').hide();
            this.$elem.find('.wi-imageview-full').css('display','inline-block');
        }
        this.$elem.find('.wi-imageview-picbox').attr('style','').css(_style);
    }
    ,_setPicClass:function(exClass){// exClass 含空格
        this.$pic.attr('class','wi-imageview-pic'+exClass);
    }
    ,resetSrcs:function(srcs){
        var pictureBox = this;
        pictureBox.srcs=srcs || [];
        pictureBox.index=-1;
        pictureBox._toolView();
    }
};

window.creatPictureBox=function(imageViewId,srcs,options){
    return new PictureBox(imageViewId,srcs,options);
};