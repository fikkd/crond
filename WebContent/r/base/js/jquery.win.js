;(function($, window, document){
	top.$=top.jQuery;
	/** 提示框**/
	wAlert = {};
	wAlert.Type = wAlert.Type || {};
	wAlert.Type.ALERT = 0;// 警告图标
	wAlert.Type.OK = 1;// 成功图标
	wAlert.Type.EDIT = 2;// 编辑图标
	wAlert.Type.FORBID = 3;// 禁止
	wAlert.Type.ASK = 4;// 询问
	wAlert.Type.DISABLE = 5;// 不允许
	wAlert.Type.ALLOW = 6;// 允许
	wAlert.Type.LOCK = 7;// 锁定
	wAlert.Type.SORRY = 8;// 遗憾
	wAlert.Type.HAPPY = 9;// 开心
	wAlert.Type.SUCCESS = 10;// 成功
	wAlert.Type.PROMPT = 11;// 遗憾
	wAlert.Type.INTERACTIVE = 12;// 互动
	wAlert.Type.GARBAGE = 13;// 垃圾
	wAlert.Type.SEND = 14;// 发送
	wAlert.Type.DOWNLOAD = 15;// 下载
	window.wAlert = wAlert;

	window["getIFrameLayerIndex"] = function(selecter){
		$(selecter).parents();
	};
	window.tlayer = top.layer;
	window.tlayer$ = top.$.layer;
	window.t$ = top.$;
	window.closeIframe = function(){
		tlayer.close(tlayer.getFrameIndex(window.name));
    };
	$.winAlert = function(option){
		this._default = {
			title:"提示框",
			msg:"",
			type:wAlert.Type.ALERT,
			callback:function(layer){}
		};
		$.extend(this._default, option);
		//layer.alert(alertMsg , alertType, alertTit , alertYes)
		return layer.alert(this._default.msg, this._default.type, this._default.title, this._default.callback);
	};
	$.getWinIFrameIndex = function(win){
		var ret = -1;
		if(!win) return ret;
		var $par = $(document).parents("iframe");
		if(!$par) return ret;
		if(!$par.is("iframe")) return ret;
		var id = $par.attr("id");
		if(!id) return ret;
		ret = id.replace("xubox_iframe","");
		return ret;
	};
	$.winOpenFrame = function(option){
		this._default = {
			type : 2,
			shade : [0],
		    fix: false,
			iframe : {src : ''},
			area : ['300px' , '160px'],
			offset : ['150px', ''],
			close : function(index){
				layer.close(index);
			}
		};
		$.extend(this._default, option);
		if(option.area){
			this._default.offset = getCenterPosition(option.area);
		}
		//layer.alert(alertMsg , alertType, alertTit , alertYes)
		return $.layer(this._default);
	};

	$.winOpenDom = function(option){
		this._default = {
		    type : 1,
		    title : false,
		    fix : false,
		    offset:['150px' , ''],
		    area : ['515px','615px']
		};
		$.extend(this._default, option);
		if(option.area){
			this._default.offset = getCenterPosition(option.area);
		}
		return $.layer(this._default);
	};
	
	function getCenterPosition(area){
		var a = area,
		    offset = ['',''];
		
		if(/px/.test(a[0])){
			var d = a[0].substring(0,a[0].indexOf("p"));
			offset[1] = getMidPost(t$(top.window).width(),d)+"px";
		}
		if(/px/.test(a[1])){
			var d = a[1].substring(0,a[1].indexOf("p"));
			offset[0] = getMidPost(t$(top.window).height(),d)+"px";
		}
		return offset;
	}
	function getMidPost(winDig,divDig){
		return winDig-divDig > 0 ? (winDig-divDig)/2 : 1;
	}
})(jQuery, window, document);