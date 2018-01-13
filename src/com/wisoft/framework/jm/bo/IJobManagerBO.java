package com.wisoft.framework.jm.bo;

import java.util.List;

import com.wisoft.framework.common.pojo.PageInfoDTO;
import com.wisoft.framework.jm.common.JmSearchParam;
import com.wisoft.framework.jm.crond.JmQrtzTriggers;
import com.wisoft.framework.jm.entity.JmJobDetail;

public interface IJobManagerBO {

	
	/**
	 * 
	 * 删除Job任务
	 * 
	 * @param job
	 * @throws Exception
	 *
	 * @变更记录 2018年1月2日 上午11:11:58 李瑞辉 创建
	 *
	 */
	public void deleteJob(JmJobDetail job) throws Exception;
	
	/**
	 * 删除任务
	 * 
	 * @param jobId
	 * @return 
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:19:35 李瑞辉 创建
	 *
	 */
	public void deleteJob(String jobId) throws Exception;

	
	/**
	 * 在编辑任务时获取调度任务的信息
	 * 
	 * @param jobId 任务ID
	 *
	 * @变更记录 2017年12月28日 下午1:16:36 李瑞辉 创建
	 *
	 */
	public JmJobDetail findJobDetailByJobID(String jobId);

	
	/**
	 * 获取任务列表分页
	 *
	 * @变更记录 2017年12月28日 下午1:16:05 李瑞辉 创建
	 *
	 */
	public PageInfoDTO findJobList(JmSearchParam param);

	
	/**
	 * 查询运行情况
	 *
	 * @变更记录 2017年12月28日 下午1:20:11 李瑞辉 创建
	 *
	 */
	public JmQrtzTriggers findQrtzTriggers(String job_name, String job_group);
	
	
	/**
	 * 
	 * 测试方法
	 *
	 * @变更记录 2017年12月28日 下午1:30:09 李瑞辉 创建
	 *
	 */
	void fun() throws Exception;

	
	/**
	 * 
	 * 暂停所有任务
	 *
	 * @变更记录 2018年1月2日 上午11:20:30 李瑞辉 创建
	 *
	 */
	
	public void pauseAll() throws Exception;
	
		
	/**
	 * 
	 * 暂停任务
	 *
	 * @变更记录 2018年1月2日 上午11:20:47 李瑞辉 创建
	 *
	 */
	public void pauseJob(String jobId, String all) throws Exception;
	
	/**
	 * 
	 * 暂停任务
	 *
	 * @变更记录 2018年1月2日 上午11:20:47 李瑞辉 创建
	 *
	 */
	public void pauseJobs(List<JmJobDetail> jobs) throws Exception;
	
	/**
	 * 
	 * 恢复所有任务
	 *
	 * @变更记录 2018年1月2日 上午11:20:47 李瑞辉 创建
	 *
	 */
	public void resumeAll() throws Exception;
	
	/**
	 * 
	 * 恢复任务
	 *
	 * @变更记录 2018年1月2日 上午11:20:47 李瑞辉 创建
	 *
	 */
	public void resumeJob(String jobId, String all) throws Exception;
	
	/**
	 * 
	 * 恢复任务
	 *
	 * @变更记录 2018年1月2日 上午11:20:47 李瑞辉 创建
	 *
	 */
	public void resumeJobs(List<JmJobDetail> jobs) throws Exception;
	
	/**
	 * 保存或更新任务调度信息
	 * 
	 * @变更记录 2017年12月28日 下午1:17:30 李瑞辉 创建
	 *
	 */
	public String saveOrUpdateJob(JmJobDetail jobDetail, String fired)throws Exception;
	
	
	/**
	 * 启动任务
	 * 
	 * @变更记录 2017年12月28日 下午1:18:32 李瑞辉 创建
	 *
	 */
	public void startJob(String jobId, String all) throws Exception;


}
