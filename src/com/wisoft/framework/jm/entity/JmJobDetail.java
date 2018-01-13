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
	 * 是否是一个实现Job接口的Java类【1-是 0-否】
	 * 
	 */
	private java.lang.String impljob;

	/**
	 * 
	 * 
	 * 任务运行状态
	 * 
	 */
	private String instance_status;
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
	private int version;

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
	private String trigger_type = "0";

	public JmJobDetail() {

	}

	public java.lang.String getCron_expression() {
		return cron_expression;
	}

	public java.lang.String getCron_zh_cn() {
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

	public java.lang.String getImpljob() {
		return impljob;
	}

	public String getInstance_status() {
		return instance_status;
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

	public java.lang.String getStarttime() {
		return starttime;
	}

	public int getTime_limit() {
		return time_limit;
	}

	public int getTime_unit() {
		return time_unit;
	}

	public String getTrigger_type() {
		return trigger_type;
	}

	public void setCron_expression(java.lang.String cron_expression) {
		this.cron_expression = cron_expression;
	}

	public void setCron_zh_cn(java.lang.String cron_zh_cn) {
		this.cron_zh_cn = cron_zh_cn;
	}

	public void setDescription(java.lang.String description) {
		this.description = description;
	}

	public void setEndtime(java.lang.String endtime) {
		this.endtime = endtime;
	}

	public void setException_info(java.lang.String exception_info) {
		this.exception_info = exception_info;
	}

	public void setExectime(String exectime) {
		this.exectime = exectime;
	}

	public void setId(java.lang.String id) {
		this.id = id;
	}

	public void setImpljob(java.lang.String impljob) {
		this.impljob = impljob;
	}

	public void setInstance_status(String instance_status) {
		this.instance_status = instance_status;
	}

	public void setJob_bean_name(java.lang.String job_bean_name) {
		this.job_bean_name = job_bean_name;
	}

	public void setJob_class_name(java.lang.String job_class_name) {
		this.job_class_name = job_class_name;
	}

	public void setJob_create_time(java.lang.String job_create_time) {
		this.job_create_time = job_create_time;
	}

	public void setJob_group(java.lang.String job_group) {
		this.job_group = job_group;
	}

	public void setJob_method_name(java.lang.String job_method_name) {
		this.job_method_name = job_method_name;
	}

	public void setJob_name(java.lang.String job_name) {
		this.job_name = job_name;
	}

	public void setStarttime(java.lang.String starttime) {
		this.starttime = starttime;
	}

	public void setTime_limit(int time_limit) {
		this.time_limit = time_limit;
	}

	public void setTime_unit(int time_unit) {
		this.time_unit = time_unit;
	}

	public void setTrigger_type(String trigger_type) {
		this.trigger_type = trigger_type;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cron_expression == null) ? 0 : cron_expression.hashCode());
		result = prime * result + ((cron_zh_cn == null) ? 0 : cron_zh_cn.hashCode());
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((endtime == null) ? 0 : endtime.hashCode());
		result = prime * result + ((exception_info == null) ? 0 : exception_info.hashCode());
		result = prime * result + ((exectime == null) ? 0 : exectime.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((impljob == null) ? 0 : impljob.hashCode());
		result = prime * result + ((instance_status == null) ? 0 : instance_status.hashCode());
		result = prime * result + ((job_bean_name == null) ? 0 : job_bean_name.hashCode());
		result = prime * result + ((job_class_name == null) ? 0 : job_class_name.hashCode());
		result = prime * result + ((job_create_time == null) ? 0 : job_create_time.hashCode());
		result = prime * result + ((job_group == null) ? 0 : job_group.hashCode());
		result = prime * result + ((job_method_name == null) ? 0 : job_method_name.hashCode());
		result = prime * result + ((job_name == null) ? 0 : job_name.hashCode());
		result = prime * result + ((starttime == null) ? 0 : starttime.hashCode());
		result = prime * result + time_limit;
		result = prime * result + time_unit;
		result = prime * result + ((trigger_type == null) ? 0 : trigger_type.hashCode());
		result = prime * result + version;
		return result;
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
		if (cron_expression == null) {
			if (other.cron_expression != null)
				return false;
		} else if (!cron_expression.equals(other.cron_expression))
			return false;
		if (cron_zh_cn == null) {
			if (other.cron_zh_cn != null)
				return false;
		} else if (!cron_zh_cn.equals(other.cron_zh_cn))
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
		if (impljob == null) {
			if (other.impljob != null)
				return false;
		} else if (!impljob.equals(other.impljob))
			return false;
		if (instance_status == null) {
			if (other.instance_status != null)
				return false;
		} else if (!instance_status.equals(other.instance_status))
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
		if (starttime == null) {
			if (other.starttime != null)
				return false;
		} else if (!starttime.equals(other.starttime))
			return false;
		if (time_limit != other.time_limit)
			return false;
		if (time_unit != other.time_unit)
			return false;
		if (trigger_type == null) {
			if (other.trigger_type != null)
				return false;
		} else if (!trigger_type.equals(other.trigger_type))
			return false;
		if (version != other.version)
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "JmJobDetail [cron_expression=" + cron_expression + ", cron_zh_cn=" + cron_zh_cn + ", description="
				+ description + ", endtime=" + endtime + ", exception_info=" + exception_info + ", exectime=" + exectime
				+ ", id=" + id + ", impljob=" + impljob + ", instance_status=" + instance_status + ", job_bean_name="
				+ job_bean_name + ", job_class_name=" + job_class_name + ", job_create_time=" + job_create_time
				+ ", job_group=" + job_group + ", job_method_name=" + job_method_name + ", job_name=" + job_name
				+ ", version=" + version + ", starttime=" + starttime + ", time_limit=" + time_limit + ", time_unit="
				+ time_unit + ", trigger_type=" + trigger_type + "]";
	}

}