/**
 * Created by QianQi on 2016/2/18.
 * 扩展 js 原生对象
 */
if (!Array.prototype.indexOf){
    /**
     * 从 from 位置开始，返回首次出现 elt 的索引位置，未找到返回 -1
     * @param {*} elt 要判断是否在数组中的对象
     * @param {int=} from 搜索起始索引，0 到 length-1，默认为 0
     * @returns {*}
     */
    Array.prototype.indexOf = function(elt , from){
        var len = this.length >>> 0;// 用于确保 this.length 是可运算的数值
        from = Number(from) || 0;
        if (from < 0 || from >= len) return;
        for (; from < len; from++){
            if (this[from] === elt) return from;
        }
        return -1;
    };
}
/**
 * 字符串去除首尾空格
 * @returns {string}
 */
String.prototype.trim=function() {
    return this.replace(/(^\s*)|(\s*$)/g,'');
};
/**
 * 日期格式化（原型扩展或重载）
 * @param {string} formatStr 格式模版
 *  - YYYY/yyyy/YY/yy 表示年份
 *  - MM/M 月份
 *  - W/w 星期
 *  - dd/DD/d/D 日期
 *  - hh/HH/h/H 时间
 *  - mm/m 分钟
 *  - ss/SS/s/S 秒
 * @return {string} 日期字符串
 */
Date.prototype.format = function(formatStr){
    var str = formatStr;
    var Week = ['日','一','二','三','四','五','六'];
    str=str.replace(/yyyy|YYYY/,''+this.getFullYear());
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));
    str=str.replace(/MM/,(this.getMonth()+1)>9?(this.getMonth()+1).toString():'0' + (this.getMonth()+1));
    str=str.replace(/M/g,this.getMonth()+1);
    str=str.replace(/w|W/g,Week[this.getDay()]);
    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
    str=str.replace(/d|D/g,this.getDate());
    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
    str=str.replace(/h|H/g,this.getHours());
    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
    str=str.replace(/m/g,this.getMinutes());
    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
    str=str.replace(/s|S/g,this.getSeconds());
    return str;
};
/**
 * 日期计算（原型扩展或重载）
 * @param {string} interval 日期计算的单位
 *  - y,Y 年
 *  - M 月
 *  - q,Q 季度
 *  - w,W 周
 *  - d,D 日
 *  - h,H 时
 *  - m 分
 *  - s,S 秒
 * @param {number} number 数量
 * @returns {Date} 计算后的日期对象
 */
Date.prototype.add = function(interval, number) {
    switch (interval) {
        case 'S':
        case 's':return new Date(this.getTime() + (1000 * number));
        case 'm':return new Date(this.getTime() + (60000 * number));
        case 'H':
        case 'h':return new Date(this.getTime() + (3600000 * number));
        case 'D':
        case 'd':return new Date(this.getTime() + (86400000 * number));
        case 'W':
        case 'w':return new Date(this.getTime() + ((86400000 * 7) * number));
        case 'Q':
        case 'q':return new Date(this.getFullYear(), (this.getMonth()) + number*3, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
        case 'M':return new Date(this.getFullYear(), (this.getMonth()) + number, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
        case 'Y':
        case 'y':return new Date((this.getFullYear() + number), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
    }
};