package com.wisoft.framework.jm.crond;

public class JmQrtzTriggers {

	private String job_name;
	private String job_group;
	private String trigger_state;
	private String start_time;
	private String end_time;
	private String pre_fire_time;
	private String next_fire_time;

	public JmQrtzTriggers() {
		super();
	}

	public JmQrtzTriggers(String job_name, String job_group, String trigger_state, String start_time, String end_time,
			String pre_fire_time, String next_fire_time) {
		super();
		this.job_name = job_name;
		this.job_group = job_group;
		this.trigger_state = trigger_state;
		this.start_time = start_time;
		this.end_time = end_time;
		this.pre_fire_time = pre_fire_time;
		this.next_fire_time = next_fire_time;
	}

	public String getJob_name() {
		return job_name;
	}

	public void setJob_name(String job_name) {
		this.job_name = job_name;
	}

	public String getJob_group() {
		return job_group;
	}

	public void setJob_group(String job_group) {
		this.job_group = job_group;
	}

	public String getTrigger_state() {
		return trigger_state;
	}

	public void setTrigger_state(String trigger_state) {
		this.trigger_state = trigger_state;
	}

	public String getEnd_time() {
		return end_time;
	}

	public void setEnd_time(String end_time) {
		this.end_time = end_time;
	}

	public String getPre_fire_time() {
		return pre_fire_time;
	}

	public void setPre_fire_time(String pre_fire_time) {
		this.pre_fire_time = pre_fire_time;
	}

	public String getNext_fire_time() {
		return next_fire_time;
	}

	public void setNext_fire_time(String next_fire_time) {
		this.next_fire_time = next_fire_time;
	}

	public String getStart_time() {
		return start_time;
	}

	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}

}
