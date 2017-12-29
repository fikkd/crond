package com.wisoft.framework.jm.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wisoft.framework.common.annotation.SecurityCheck;
import com.wisoft.framework.common.pojo.AjaxResult;
import com.wisoft.framework.common.pojo.PageInfoDTO;
import com.wisoft.framework.common.utils.SSUtil;
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
	 * 跳转到新建任务调度页面
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
	public String toJobDetail(ModelMap modelMap, String id, boolean isView) {
		try {
			if (!SSUtil.isEmpty(id)) {
				JmJobDetail detail = this.jobManagerBO.findJobDetailByJobID(id);
				modelMap.addAttribute("jobDetail", detail);
			}
			// 是否查看
			modelMap.addAttribute("isView", isView);
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

	
	@RequestMapping("/toCron-2")
	public String toCronD(ModelMap modelMap, String cron, String starttime, String endtime) {
		return "framework/jm/jobCron-2";
	}
	

	

	
	/**
	 * 任务调度详情
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
	 * 
	 * 任务 异常跳转
	 * 
	 * @param id
	 *            任务id
	 * @return
	 * 
	 * @变更记录 2016-3-11 下午4:59:37武林林 创建
	 * 
	 */
	@RequestMapping("/toJmInstance")
	public String toJmInstance(ModelMap modelMap, String id, boolean isVie) {
		try {
			if (!SSUtil.isEmpty(id)) {
				JmJobDetail detail = this.jobManagerBO.findJobDetailByJobID(id);
				modelMap.addAttribute("jobDetail", detail);
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return "framework/jm/jmInstance";
	}
	
	
	/**
	  * 获取任务列表
	 * 
	 * @param curpage
	 *            当前页面
	 * @param percount
	 *            分页数
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午2:05:59 李瑞辉 创建
	 *
	 */
	@ResponseBody
	@RequestMapping("/getJobList")
	public AjaxResult getJobList(JmSearchParam param) {
		AjaxResult result = new AjaxResult(false);
		try {
			PageInfoDTO pageInfo = this.jobManagerBO.findJobList(param);
			result.setSuccess(true);
			result.setData(pageInfo);
		} catch (Exception e) {
			logger.error(this, e);
			result.setMsg(e.getMessage());
		}
		return result;
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
	@RequestMapping("/savejob")
	public AjaxResult savejob(JmJobDetail jopbDetail) {
		AjaxResult ar = new AjaxResult(false);
		try {
			String data = this.jobManagerBO.saveJob(jopbDetail);
			if (data.matches(".*[\u4e00-\u9fa5].*")) {/** 返回值中包含中文说明保存或更新时存在问题 			
			 															        之所以这么判断, 那是因为BO层在正常的情况下返回值是不包含中文的 */
				ar.setMsg(data);
			} else {
				ar.setData(data);
				ar.setSuccess(true);				
			}
		} catch (Exception e) {
			logger.error(this, e);			
		}
		return ar;
	}

	/**
	 * 
	 * 删除任务调度详细
	 * 
	 * @param id
	 *            任务id
	 * @return
	 * 
	 * @变更记录 2016-3-11 下午4:59:37武林林 创建
	 * 
	 */
	@ResponseBody
	@RequestMapping("/deletejob")
	public AjaxResult deletejob(String id) {
		AjaxResult ret = new AjaxResult(false);
		try {
			String flag = this.jobManagerBO.deleteJob(id);
			ret.setData(flag);
			ret.setSuccess(true);
		} catch (Exception e) {
			logger.error(this, e);
			ret.setMsg(e.getMessage());
		}
		return ret;
	}

	/**
	 * 
	 * 启动任务
	 * 
	 * @param jobID
	 *            任务ID
	 * 
	 * @变更记录 2016-3-9 下午7:22:21 华盛 创建
	 * 
	 */
	@ResponseBody
	@RequestMapping("/startjob")
	public AjaxResult startJob(String jobID) {
		AjaxResult ret = new AjaxResult(false);
		try {
			this.jobManagerBO.startJob(jobID);
			ret.setSuccess(true);
		} catch (Exception e) {
			ret.setMsg("设置有误");
			logger.error(this, e);
		}
		return ret;
	}

	/**
	 * 
	 * 停止任务
	 * 
	 * @param jobID
	 *            任务ID
	 * 
	 * @变更记录 2016-3-9 下午7:22:57 华盛 创建
	 * 
	 */
	@ResponseBody
	@RequestMapping("/stopjob")
	public AjaxResult stopjob(String jobID) {
		AjaxResult ret = new AjaxResult(false);
		try {
			this.jobManagerBO.stopJob(jobID);
			ret.setSuccess(true);
		} catch (Exception e) {
			logger.error(this, e);
		}
		return ret;
	}

	
	/**
	 * 验证是否有运行实例
	 * 
	 * @param modelMap
	 * @param job_group
	 * @param job_name
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午2:00:04 李瑞辉 创建
	 *
	 */
	@ResponseBody
	@RequestMapping("/valideRunJob")
	public AjaxResult valideRunJob(ModelMap modelMap, String job_group, String job_name) {
		AjaxResult ret = new AjaxResult(false);
		try {
			job_name = new String(job_name.getBytes("ISO-8859-1"), "UTF-8");
			job_group = new String(job_group.getBytes("ISO-8859-1"), "UTF-8");
			JmQrtzTriggers sl = this.jobManagerBO.findQrtzTriggers(job_name, job_group);
			ret.setData(sl);
			ret.setSuccess(true);
		} catch (Exception e) {
			logger.error(this, e);
		}
		return ret;
	}
}
