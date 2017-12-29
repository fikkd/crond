package com.wisoft.framework.jm.bo;

import org.quartz.JobKey;

import com.wisoft.framework.common.pojo.PageInfoDTO;
import com.wisoft.framework.jm.common.JmSearchParam;
import com.wisoft.framework.jm.crond.JmQrtzTriggers;
import com.wisoft.framework.jm.entity.JmJobDetail;

public interface IJobManagerBO {

	
	/**
	 * 删除任务
	 * 
	 * @param jobID
	 * @return 
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:19:35 LRH 创建
	 *
	 */
	public String deleteJob(String jobID) throws Exception;
	
	/**
	 * 编辑任务时
	 * 获取调度任务的信息
	 * 
	 * @param jobID
	 *            任务ID
	 * @param forEdit
	 *            是否用于编辑
	 * @return
	 * @throws Exception
	 * 
	 *
	 * @变更记录 2017年12月28日 下午1:16:36 李瑞辉 创建
	 *
	 */
	public JmJobDetail findJobDetailByJobID(String jobID);

	
	/**
	 * 获取任务列表分页
	 * 
	 * @param curpage
	 *            当前页码
	 * @param percount
	 *            分页数
	 * @param queryParm
	 *            任务名称或作业信息模糊匹配
	 *
	 * @变更记录 2017年12月28日 下午1:16:05 李瑞辉 创建
	 *
	 */
	public PageInfoDTO findJobList(JmSearchParam param);

	
	/**
	 * 查询运行情况
	 * 
	 * @param job_name
	 * @param job_group
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:20:11 LRH 创建
	 *
	 */
	public JmQrtzTriggers findQrtzTriggers(String job_name, String job_group);

	
	/**
	 * 记录异常信息
	 * 
	 * @param jobKey job分组和名称
	 * @param st 异常信息
	 *
	 * @变更记录 2017年12月28日 下午1:15:09 李瑞辉 创建
	 *
	 */
	public void markFailure(JobKey jobKey, Exception st);
	
	
	/**
	 * 保存任务调度信息
	 * 
	 * @param jobDetail
	 *            任务调度信息
	 * @return 
	 *
	 * @变更记录 2017年12月28日 下午1:17:30 李瑞辉 创建
	 *
	 */
	public String saveJob(JmJobDetail jobDetail)throws Exception;

	
	/**
	 * 启动任务
	 * 
	 * @param job
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:22:57 李瑞辉 创建
	 *
	 */
	public void startJob(JmJobDetail job) throws Exception;

	
	/**
	 * 启动任务
	 * 
	 * @param jobID
	 *            任务ID
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:18:32 李瑞辉 创建
	 *
	 */
	public void startJob(String jobID) throws Exception;
	
	
	/**
	 * 停止任务
	 * 
	 * @param jobID
	 *            任务ID
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:19:15 李瑞辉 创建
	 *
	 */
	public void stopJob(String jobID) throws Exception;
	
	void stopJob(JmJobDetail job) throws Exception;
	
	
	/**
	 * 
	 * 测试方法
	 * 
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:30:09 李瑞辉 创建
	 *
	 */
	void fun() throws Exception;


}
