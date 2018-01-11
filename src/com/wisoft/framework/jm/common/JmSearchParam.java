package com.wisoft.framework.jm.common;

import com.wisoft.framework.common.pojo.PageInfoDTO;

@SuppressWarnings("serial")
public class JmSearchParam extends PageInfoDTO {
	
	private int curpage;
	private int percount;
	private String keyword;
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
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}


	
}
