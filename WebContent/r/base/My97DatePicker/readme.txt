My97DatePicker4.8 Beta4
原始 WdatePicker.js 更名为 orig_WdatePicker.js

【项目资源参照基础】 WdatePicker.js
1 修改了 $skinList，并将 wiBlue 设为默认皮肤
2 移除了默认配置中重复的 opposite:false
3 为主方法 U(K,C) 添加参数为 U(K,C,ev)
（目的：在严格模式js中，事件中调用 WdatePicker，无法像非严格模式下通过 caller 获取
事件对象，所以改为由参数传入）
  - TODO ？？？仅在$preLoad=true时可能使C=true，但$preLoad初始时为false，且未进行赋值
  - U(K,C,ev) 中 var F=D() 改为 var F=ev||D();
  - 通过事件触发 U 方法的地方，都添加为3个参数（3处，均添加 false,e）