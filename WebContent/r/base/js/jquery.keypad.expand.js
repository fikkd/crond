$(function () {
    var customKeypadSetting = {};
    var customKeypadData = [
        {'id': 'FLJSWM', 'name': 'fljswm', 'text': '金属屋面', 'desc': '金属屋面'},
        {'id': 'FLJSGJ', 'name': 'fljsgj', 'text': '金属构件', 'desc': '金属构件'},
        {'id': 'FLBS', 'name': 'flbs', 'text': '本身', 'desc': '本身'},
        {'id': 'FLAF', 'name': 'flaf', 'text': '暗敷', 'desc': '暗敷'}
    ];
    $.each(customKeypadData, function(index, data){
        $.keypad.addKeyDef(data.id, data.name,
                function(inst) { $.keypad._selectValue(inst, data.text); }, true);
        customKeypadSetting[data.name + 'Text'] = data.text;
        customKeypadSetting[data.name + 'Status'] = data.desc;
    });
    $.extend(customKeypadSetting, {
        keypadOnly: false, separator: '|',
        backText: '回退', backStatus: '删除前一个字符',
        closeText: '关闭', closeStatus: '关闭小键盘',
        layout: [
            '7|8|9|∠|.|W|'  + $.keypad.FLBS,
            '4|5|6|Φ|◎|D|'  + $.keypad.FLAF,
            '1|2|3|≥|≤|' + $.keypad.FLJSGJ,
            '0|/|-|×|' + $.keypad.SPACE + '|' + $.keypad.FLJSWM,
            'S|Fe|Cu|Al|' + $.keypad.BACK + '|' + $.keypad.CLOSE
        ],
        onKeypress:function(key, inputVal, inst){
    		if("暗敷" === inputVal){
    			// 获取input表的name属性
    			var iptName = inst._input[0].id;
    			if($.ligerui){
    				var m = $("#"+iptName+"PD").ligerGetComboBoxManager();
    				if(m){
    					m.selectValue("-");
    				}
    			}
    			if($.om){
    				$("#"+iptName+"PD").omCombo("value","-");
    			}
    		}
    	}
    });
    $.keypad.setDefaults(customKeypadSetting);
});