package com.wisoft.framework.jm.entity;

/**
 * 定时任务表
 * 
 */
@SuppressWarnings("serial")
public class JmJobDetail implements java.io.Serializable {
	/**
	 * 
	 * 
	 * 周期性调度的表达式
	 * 
	 */
	private java.lang.String cron_expression;
	/**
	 * 
	 * 周期性调度中文描述
	 * 
	 */
	private java.lang.String cron_zh_cn;
	/**
	 * 
	 * 任务描述
	 * 
	 */
	private java.lang.String description;
	/**
	 * 
	 * 
	 * 结束时间
	 * 
	 */
	private java.lang.String endtime;
	/**
	 * 
	 * 异常信息
	 * 
	 */
	private java.lang.String exception_info;
	/**
	 * 一次性任务执行时间
	 */
	private String exectime;
	/**
	 * 
	 * id
	 * 
	 */
	private java.lang.String id;
	/**
	 * 
	 * 
	 * 任务运行状态【-1未运行 0-正常运行 1-暂停/停止 2-异常】
	 * 
	 */
	private int instance_status = -1;
	/**
	 * 
	 * 
	 * 是否存在调度实例【0-不存在 1-存在】【废弃-2017-12-28】
	 * 
	 * 李瑞辉在2017-12-28修改
	 * 
	 */
	private int isexecuting;
	/**
	 * 
	 * 
	 * 是否是一个实现Job接口的Java类【1-是 0-否】
	 * 
	 */
	private int isjobclass = 0;
	/**
	 * 
	 * 调用spring中的bean 名称
	 * 
	 */
	private java.lang.String job_bean_name;
	/**
	 * 
	 * 实现Job接口的任务完整类名
	 * 
	 * 例如: com.wisoft.framework.jm.bo.MyJob
	 * 
	 */
	private java.lang.String job_class_name;
	/**
	 * 
	 * 任务创建时间
	 * 
	 */
	private java.lang.String job_create_time;
	
	/**
	 * 
	 * 分组名称
	 * 
	 */
	private java.lang.String job_group;
	
	/**
	 * 
	 * 调用bean中的方法名
	 * 
	 */
	private java.lang.String job_method_name;
	
	/**
	 * 
	 * 任务名称
	 * 
	 */
	private java.lang.String job_name;
	/**
	 * 
	 * 排序号
	 */
	private int orderNum = 0;
	/**
	 * 
	 * 当前运行实例数量【废弃-2017-12-28】
	 * 李瑞辉在2017-12-28修改
	 */
	private int qrtzcount = 0;
	/**
	 * 
	 * 
	 * 开始时间
	 * 
	 */
	private java.lang.String starttime; 
	/**
	 * 
	 * 
	 * 倒计多少时间触发
	 * 
	 */
	private int time_limit;	
	
	
	/**
	 * 
	 * 
	 * 倒计时间单位【小时=60分钟 天=1440分钟 分钟=1分钟】
	 * 
	 */
	private int time_unit;
	
	
	/**
	 * 
	 * 调度类型【0-一次性 1-周期性】
	 * 
	 */
	private int trigger_type = 0; 

	public JmJobDetail() {

	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		JmJobDetail other = (JmJobDetail) obj;
		if (cron_zh_cn == null) {
			if (other.cron_zh_cn != null)
				return false;
		} else if (!cron_zh_cn.equals(other.cron_zh_cn))
			return false;
		if (cron_expression == null) {
			if (other.cron_expression != null)
				return false;
		} else if (!cron_expression.equals(other.cron_expression))
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (endtime == null) {
			if (other.endtime != null)
				return false;
		} else if (!endtime.equals(other.endtime))
			return false;
		if (exception_info == null) {
			if (other.exception_info != null)
				return false;
		} else if (!exception_info.equals(other.exception_info))
			return false;
		if (exectime == null) {
			if (other.exectime != null)
				return false;
		} else if (!exectime.equals(other.exectime))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (instance_status != other.instance_status)
			return false;
		if (isexecuting != other.isexecuting)
			return false;
		if (isjobclass != other.isjobclass)
			return false;
		if (job_bean_name == null) {
			if (other.job_bean_name != null)
				return false;
		} else if (!job_bean_name.equals(other.job_bean_name))
			return false;
		if (job_class_name == null) {
			if (other.job_class_name != null)
				return false;
		} else if (!job_class_name.equals(other.job_class_name))
			return false;
		if (job_create_time == null) {
			if (other.job_create_time != null)
				return false;
		} else if (!job_create_time.equals(other.job_create_time))
			return false;
		if (job_group == null) {
			if (other.job_group != null)
				return false;
		} else if (!job_group.equals(other.job_group))
			return false;
		if (job_method_name == null) {
			if (other.job_method_name != null)
				return false;
		} else if (!job_method_name.equals(other.job_method_name))
			return false;
		if (job_name == null) {
			if (other.job_name != null)
				return false;
		} else if (!job_name.equals(other.job_name))
			return false;
		if (orderNum != other.orderNum)
			return false;
		if (qrtzcount != other.qrtzcount)
			return false;
		if (starttime == null) {
			if (other.starttime != null)
				return false;
		} else if (!starttime.equals(other.starttime))
			return false;
		if (time_limit != other.time_limit)
			return false;
		if (time_unit != other.time_unit)
			return false;
		if (trigger_type != other.trigger_type)
			return false;
		return true;
	}

	public java.lang.String getCron_expression() {
		return cron_expression;
	}

	public java.lang.String getCron_zh_cn() {
		return cron_zh_cn;
	}

	public java.lang.String getCron_ZH_CN() {
		return cron_zh_cn;
	}

	public java.lang.String getDescription() {
		return description;
	}

	public java.lang.String getEndtime() {
		return endtime;
	}

	public java.lang.String getException_info() {
		return exception_info;
	}

	public String getExectime() {
		return exectime;
	}

	public java.lang.String getId() {
		return id;
	}

	public int getInstance_status() {
		return instance_status;
	}

	public int getIsexecuting() {
		return isexecuting;
	}

	public int getIsjobclass() {
		return isjobclass;
	}

	public java.lang.String getJob_bean_name() {
		return job_bean_name;
	}

	public java.lang.String getJob_class_name() {
		return job_class_name;
	}

	public java.lang.String getJob_create_time() {
		return job_create_time;
	}

	public java.lang.String getJob_group() {
		return job_group;
	}

	public java.lang.String getJob_method_name() {
		return job_method_name;
	}

	public java.lang.String getJob_name() {
		return job_name;
	}

	public int getOrderNum() {
		return orderNum;
	}

	public int getQrtzcount() {
		return qrtzcount;
	}

	public java.lang.String getStarttime() {
		return starttime;
	}

	public int getTime_limit() {
		return time_limit;
	}

	public int getTime_unit() {
		return time_unit;
	}

	public int getTrigger_type() {
		return trigger_type;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cron_zh_cn == null) ? 0 : cron_zh_cn.hashCode());
		result = prime * result + ((cron_expression == null) ? 0 : cron_expression.hashCode());
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((endtime == null) ? 0 : endtime.hashCode());
		result = prime * result + ((exception_info == null) ? 0 : exception_info.hashCode());
		result = prime * result + ((exectime == null) ? 0 : exectime.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + instance_status;
		result = prime * result + isexecuting;
		result = prime * result + isjobclass;
		result = prime * result + ((job_bean_name == null) ? 0 : job_bean_name.hashCode());
		result = prime * result + ((job_class_name == null) ? 0 : job_class_name.hashCode());
		result = prime * result + ((job_create_time == null) ? 0 : job_create_time.hashCode());
		result = prime * result + ((job_group == null) ? 0 : job_group.hashCode());
		result = prime * result + ((job_method_name == null) ? 0 : job_method_name.hashCode());
		result = prime * result + ((job_name == null) ? 0 : job_name.hashCode());
		result = prime * result + orderNum;
		result = prime * result + qrtzcount;
		result = prime * result + ((starttime == null) ? 0 : starttime.hashCode());
		result = prime * result + time_limit;
		result = prime * result + time_unit;
		result = prime * result + trigger_type;
		return result;
	}

	public JmJobDetail setCron_expression(java.lang.String cron_expression) {
		this.cron_expression = cron_expression;
		return this;
	}

	public void setCron_zh_cn(java.lang.String cron_zh_cn) {
		this.cron_zh_cn = cron_zh_cn;
	}

	public JmJobDetail setCron_ZH_CN(java.lang.String cron_ZH_CN) {
		this.cron_zh_cn = cron_ZH_CN;
		return this;
	}

	public JmJobDetail setDescription(java.lang.String description) {
		this.description = description;
		return this;
	}

	public JmJobDetail setEndtime(java.lang.String endtime) {
		this.endtime = endtime;
		return this;
	}

	public JmJobDetail setException_info(java.lang.String exception_info) {
		this.exception_info = exception_info;
		return this;
	}

	public void setExectime(String exectime) {
		this.exectime = exectime;
	}

	public JmJobDetail setId(java.lang.String id) {
		this.id = id;
		return this;
	}

	public JmJobDetail setInstance_status(int instance_status) {
		this.instance_status = instance_status;
		return this;
	}

	public JmJobDetail setIsexecuting(int isexecuting) {
		this.isexecuting = isexecuting;
		return this;
	}

	public JmJobDetail setIsjobclass(int isjobclass) {
		this.isjobclass = isjobclass;
		return this;
	}

	public JmJobDetail setJob_bean_name(java.lang.String job_bean_name) {
		this.job_bean_name = job_bean_name;
		return this;
	}

	public JmJobDetail setJob_class_name(java.lang.String job_class_name) {
		this.job_class_name = job_class_name;
		return this;
	}

	public JmJobDetail setJob_create_time(java.lang.String job_create_time) {
		this.job_create_time = job_create_time;
		return this;
	}

	public JmJobDetail setJob_group(java.lang.String job_group) {
		this.job_group = job_group;
		return this;
	}

	public JmJobDetail setJob_method_name(java.lang.String job_method_name) {
		this.job_method_name = job_method_name;
		return this;
	}

	public JmJobDetail setJob_name(java.lang.String job_name) {
		this.job_name = job_name;
		return this;
	}

	public JmJobDetail setOrderNum(int orderNum) {
		this.orderNum = orderNum;
		return this;
	}

	public JmJobDetail setQrtzcount(int qrtzcount) {
		this.qrtzcount = qrtzcount;
		return this;
	}

	public JmJobDetail setStarttime(java.lang.String starttime) {
		this.starttime = starttime;
		return this;
	}

	public JmJobDetail setTime_limit(int time_limit) {
		this.time_limit = time_limit;
		return this;
	}

	public JmJobDetail setTime_unit(int time_unit) {
		this.time_unit = time_unit;
		return this;
	}

	public JmJobDetail setTrigger_type(int trigger_type) {
		this.trigger_type = trigger_type;
		return this;
	}

	@Override
	public String toString() {
		return "JmJobDetail [id=" + id + ", job_name=" + job_name + ", job_group=" + job_group + ", description="
				+ description + ", isjobclass=" + isjobclass + ", job_class_name=" + job_class_name + ", job_bean_name="
				+ job_bean_name + ", job_method_name=" + job_method_name + ", job_create_time=" + job_create_time
				+ ", trigger_type=" + trigger_type + ", time_limit=" + time_limit + ", time_unit=" + time_unit
				+ ", cron_expression=" + cron_expression + ", cron_zh_cn=" + cron_zh_cn + ", exectime=" + exectime
				+ ", starttime=" + starttime + ", endtime=" + endtime + ", isexecuting=" + isexecuting + ", qrtzcount="
				+ qrtzcount + ", instance_status=" + instance_status + ", exception_info=" + exception_info
				+ ", orderNum=" + orderNum + "]";
	}

	

}