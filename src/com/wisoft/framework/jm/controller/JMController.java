package com.wisoft.framework.jm.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateOptimisticLockingFailureException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wisoft.framework.common.annotation.SecurityCheck;
import com.wisoft.framework.common.pojo.AjaxResult;
import com.wisoft.framework.common.pojo.PageInfoDTO;
import com.wisoft.framework.jm.bo.IJobManagerBO;
import com.wisoft.framework.jm.common.JmSearchParam;
import com.wisoft.framework.jm.crond.JmQrtzTriggers;
import com.wisoft.framework.jm.entity.JmJobDetail;


/**
 * 任务调度管理控制器类
 *
 * @since  2017年12月28日
 * @author 李瑞辉
 *
 */
@Controller
@RequestMapping("/jm")
public class JMController {

	private static final Logger logger = Logger.getLogger(JMController.class);

	@Autowired
	private IJobManagerBO jobManagerBO;

	
	/**
	 * 跳转首页
	 * 
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午12:56:05 李瑞辉 创建
	 *
	 */
	@RequestMapping("/toIndex")
	@SecurityCheck
	public String toIndex() {
		return "framework/jm/index";
	}

	
	/**
	 * 跳转到新建或编辑任务调度页面
	 * 
	 * @param modelMap
	 * @param id
	 * @param isView
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午12:56:31 李瑞辉 创建
	 *
	 */
	@RequestMapping("/toJmEdit")
	public String toJobDetail(ModelMap modelMap, String id, boolean isView, boolean isEdit, boolean isNew) {
		try {
			if (null != id && !"".equals(id.trim())) {
				JmJobDetail detail = this.jobManagerBO.findJobDetailByJobID(id);
				modelMap.addAttribute("jobDetail", detail);
			} 
			modelMap.addAttribute("isView", isView);
			modelMap.addAttribute("isEdit", isEdit);
			modelMap.addAttribute("isNew", isNew);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return "framework/jm/jmEdit";
	}
	
	
	
	/**
	 * 跳转到周期性计划任务设置界面
	 * 
	 * @param modelMap
	 * @param cron
	 * @param starttime
	 * @param endtime
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:08:56 李瑞辉 创建
	 *
	 */
	@RequestMapping("/toCron")
	public String toCron(ModelMap modelMap, String cron, String starttime, String endtime) {
		modelMap.addAttribute("cron", cron);
		modelMap.addAttribute("starttime", starttime);
		modelMap.addAttribute("endtime", endtime);
		return "framework/jm/jobCron";
	}
	
	/**
	 * 任务运行情况查看
	 * 
	 * @param modelMap
	 * @param job_group
	 * @param job_name
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:11:23 李瑞辉 创建
	 *
	 */
	@RequestMapping("/toJmRuningtimePage")
	public String toJmRuningtimePage(ModelMap modelMap, String job_group, String job_name) {
		JmQrtzTriggers list = null;
		try {
			job_name = new String(job_name.getBytes("ISO-8859-1"), "UTF-8");
			job_group = new String(job_group.getBytes("ISO-8859-1"), "UTF-8");
			list = this.jobManagerBO.findQrtzTriggers(job_name, job_group);
			modelMap.addAttribute("trigger", list);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return "framework/jm/runingtime";
	}

	
		
	/**
	  * 获取任务列表
	 * 
	 * @变更记录 2017年12月28日 下午2:05:59 李瑞辉 创建
	 *
	 */
	@ResponseBody
	@RequestMapping("/getJobList")
	public AjaxResult getJobList(JmSearchParam param) {
		AjaxResult ar = new AjaxResult(false);
		try {
			PageInfoDTO pageInfo = this.jobManagerBO.findJobList(param);
			ar.setSuccess(true);
			ar.setData(pageInfo);
		} catch (Exception e) {
			logger.error(this, e);
			ar.setMsg(e.getMessage());
		}
		return ar;
	}

	
	/**
	 * 保存或更新任务调度
	 * 
	 * @param jopbDetail
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午2:18:08 李瑞辉 创建
	 *
	 */
	@ResponseBody
	@RequestMapping("/saveJob")
	public AjaxResult saveJob(JmJobDetail jopbDetail, String fired) {
		AjaxResult ar = new AjaxResult(false);
		try {
			String data = this.jobManagerBO.saveOrUpdateJob(jopbDetail, fired);
			ar.setData(data);
			ar.setSuccess(true);		
		} catch (Exception e) {
			if(e instanceof HibernateOptimisticLockingFailureException) {
                ar.setData("刚被他人修改请重新加载");
                ar.setSuccess(true);
            } else {
            	logger.error(this, e);
            }
		}
		return ar;
	}

	
	/**
	 * 删除任务调度
	 * 
	 * @param id
	 * @return
	 *
	 * @变更记录 2018年1月3日 上午8:55:38 李瑞辉 创建
	 *
	 */
	@ResponseBody
	@RequestMapping("/deletejob")
	public AjaxResult deletejob(String id) {
		AjaxResult ar = new AjaxResult(false);
		try {
			this.jobManagerBO.deleteJob(id);			
			ar.setSuccess(true);
		} catch (Exception e) {
			logger.error(this, e);
			ar.setMsg(e.getMessage());
		}
		return ar;
	}

	
	/**
	 * 启动任务
	 * 
	 * @param jobId
	 * @param all
	 * @return
	 *
	 * @变更记录 2018年1月5日 下午12:57:12 李瑞辉 创建
	 *
	 */
	@ResponseBody
	@RequestMapping("/startJob")
	public AjaxResult startJob(String jobId, String all) {
		AjaxResult ar = new AjaxResult(false);
		try {
			this.jobManagerBO.startJob(jobId, all);
			ar.setSuccess(true);
		} catch (Exception e) {
			ar.setMsg("启动失败");
			logger.error(this, e);
		}
		return ar;
	}

	
	/**
	 * 停止/暂停任务
	 * 
	 * @param jobId
	 * @param all
	 * @return
	 *
	 * @变更记录 2018年1月5日 下午12:58:13 李瑞辉 创建
	 *
	 */
	@ResponseBody
	@RequestMapping("/stopJob")
	public AjaxResult stopJob(String jobId, String all) {
		AjaxResult ar = new AjaxResult(false);
		try {
			this.jobManagerBO.pauseJob(jobId, all);
			ar.setSuccess(true);
		} catch (Exception e) {
			logger.error(this, e);
		}
		return ar;
	}
	
	/**
	 * 恢复任务
	 * 
	 * @param jobId
	 * @param all
	 * @return
	 *
	 * @变更记录 2018年1月5日 下午1:09:51 李瑞辉 创建
	 *
	 */
	@ResponseBody
	@RequestMapping("/resumeJob")
	public AjaxResult resumeJob(String jobId, String all) {
		AjaxResult ar = new AjaxResult(false);
		try {
			this.jobManagerBO.resumeJob(jobId, all);
			ar.setSuccess(true);
		} catch (Exception e) {
			logger.error(this, e);
		}
		return ar;
	}

}
