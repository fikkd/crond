/**
 * 自定义tabs插件.定义页面上tab标签切换.只针对一个tab节点.未处理多个节点直接调用的情况.
 */
;(function(){
	$.fn.extend({
		myTabs:function(options){
			options = $.extend({
                //默认选择节点
				curIndex:0,
                //tabBeginIndex:0,
                tabsNode:"ul > li",
                targetNode: "div",
                overClass: "over",
                isClick: true,
                isHover: true,
                mouseHoverTime: 400
				//tabEndIndex:0
			}, options);
            var tabParentNode = $(this);
            var curTabsNode = $(this);
            var curSelectTabNode;
            var curSelectTabIndex = options.curIndex;
            var oldSelectTabIndex = options.curIndex;
            var setTimeoutID;
            var navToIndex = function(){
                if(curTabsNode && oldSelectTabIndex !== curSelectTabIndex)
                {
                    curSelectTabNode.addClass(options.overClass).siblings(options.tabsNode).removeClass(options.overClass);
                    $(options.targetNode, curTabsNode).stop(true, true).eq(curSelectTabIndex).show("slow").siblings(options.targetNode).hide();
                    oldSelectTabIndex = curSelectTabIndex;
                }
            }
            if(options.isClick)
            {
                $(options.tabsNode, curTabsNode).click(function(){
                    curSelectTabNode = $(this);
                    curSelectTabIndex = $(options.tabsNode, curTabsNode).index(curSelectTabNode);
                    navToIndex();
                });
            }
            if(options.isHover)
            {
                $(options.tabsNode, curTabsNode).mouseover(function(){
                    curSelectTabNode = $(this);
                    curSelectTabIndex = $(options.tabsNode, curTabsNode).index(curSelectTabNode);
                    setTimeoutID = setTimeout(navToIndex, options.mouseHoverTime);
                }).mouseout(function(){
                            clearTimeout(setTimeoutID);
                });
            }

            return this;
		}
	});
})(jQuery);