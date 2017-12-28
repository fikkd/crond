package com.wisoft.framework.jm.pojo;

import com.wisoft.framework.common.pojo.PageInfoDTO;

public class JmSearchParam extends PageInfoDTO {
	
	private int curpage;
	private int percount;
	private String queryParm;
	private int isexecuting;
	private int instance_status;

	public int getCurpage() {
		return curpage;
	}

	public void setCurpage(int curpage) {
		this.curpage = curpage;
	}

	public int getPercount() {
		return percount;
	}

	public void setPercount(int percount) {
		this.percount = percount;
	}

	public String getQueryParm() {
		return queryParm;
	}

	public void setQueryParm(String queryParm) {
		this.queryParm = queryParm;
	}

	public int getIsexecuting() {
		return isexecuting;
	}

	public void setIsexecuting(int isexecuting) {
		this.isexecuting = isexecuting;
	}

	public int getInstance_status() {
		return instance_status;
	}

	public void setInstance_status(int instance_status) {
		this.instance_status = instance_status;
	}

}
