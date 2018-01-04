package com.wisoft.framework.jm.bo;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.quartz.CronScheduleBuilder;
import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;

import com.wisoft.framework.common.exception.WisoftException;
import com.wisoft.framework.common.pojo.PageInfoDTO;
import com.wisoft.framework.common.utils.DateUtil;
import com.wisoft.framework.common.utils.SSUtil;
import com.wisoft.framework.common.utils.SpringBeanUtil;
import com.wisoft.framework.jm.common.JmSearchParam;
import com.wisoft.framework.jm.crond.JmQrtzTriggers;
import com.wisoft.framework.jm.crond.SpringJobDetail;
import com.wisoft.framework.jm.dao.JMDAO;
import com.wisoft.framework.jm.entity.JmJobDetail;

public class JobManagerBO implements IJobManagerBO {

	private Scheduler scheduler;
	private JMDAO jmDAO;
	
	public void setJmDAO(JMDAO jmDAO) {
		this.jmDAO = jmDAO;
	}

	public void setScheduler(Scheduler scheduler) {
		this.scheduler = scheduler;
	}

	/**
	 * 
	 * 删除任务
	 * 
	 * @param job
	 * @throws Exception
	 *
	 * @变更记录 2018年1月2日 上午11:23:41 李瑞辉 创建
	 *
	 */
	@Override
	public void deleteJob(JmJobDetail job) throws Exception {
		
		scheduler.deleteJob(new JobKey(job.getJob_name(), job.getJob_group()));
	}

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
	public void deleteJob(String jobId) throws Exception {
		JmJobDetail job = (JmJobDetail) this.jmDAO.find(JmJobDetail.class, jobId);
		if (job.getInstance_status() == 0) {
			this.deleteJob(job);			
		}
		this.jmDAO.delete(job);
	}
	
	/**
	 * 编辑任务时
	 * 获取调度任务的信息
	 * 
	 * @param jobId 任务ID
	 * @return
	 * @throws Exception
	 * 
	 *
	 * @变更记录 2017年12月28日 下午1:16:36 李瑞辉 创建
	 *
	 */
	public JmJobDetail findJobDetailByJobID(String jobId) {
		return (JmJobDetail) this.jmDAO.find(JmJobDetail.class, jobId);
	}

	/**
	 * 获取任务列表分页
	 * 
	 * @param param 任务名称或作业信息模糊匹配
	 *
	 * @变更记录 2017年12月28日 下午1:16:05 李瑞辉 创建
	 *
	 */
	public PageInfoDTO findJobList(JmSearchParam param) {
		PageInfoDTO pageInfoDTO = new PageInfoDTO();

		// 获取总条数
		pageInfoDTO.setTotalcount(this.jmDAO.findJobCount(param));
		// 分页
		List<JmJobDetail> details = this.jmDAO.findJobList(param);
		pageInfoDTO.setRetlist(details);
		pageInfoDTO.setPercount(param.getPercount());

		return pageInfoDTO;
	}
	
	/**
	 * 查询运行情况
	 * 
	 * @param job_name
	 * @param job_group
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:20:11 李瑞辉 创建
	 *
	 */
	public JmQrtzTriggers findQrtzTriggers(String job_name, String job_group) {
		return this.jmDAO.findQrtzTriggers(job_name, job_group);

	}

	/**
	 * 
	 * 测试方法
	 * 
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:30:09 李瑞辉 创建
	 *
	 */
	@Override
	public void fun() throws Exception {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
		Date date = Calendar.getInstance().getTime();
		System.out.println("当前时间\t" + sdf.format(date));
		System.out.println("这是一个测试方法");		
	}

	public JMDAO getJmDAO() {
		return jmDAO;
	}

	public Scheduler getScheduler() {
		return scheduler;
	}
	

	/**
	 * 记录异常信息
	 * 
	 * @param jobKey job分组和名称
	 * @param st 异常信息
	 *
	 * @变更记录 2017年12月28日 下午1:15:09 李瑞辉 创建
	 *
	 */
	@Override
	public void markFailure(JobKey jobKey, Exception st) {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		st.printStackTrace(new PrintStream(baos));
		// 更新jm_job_detail中相关字段信息
		JmJobDetail detail = this.jmDAO.findJobByNameAndGroup(jobKey.getName(), jobKey.getGroup());
		this.updateJmJobDetail(detail, 1, 0, baos.toString());// 异常,已停止
	}

	@Override
	public void pauseAll() throws Exception {
		
		
	}

	/**
	 * 暂停任务
	 * 
	 * @param jobId 任务ID
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:19:15 李瑞辉 创建
	 *
	 */
	private void pauseJob(JmJobDetail job) throws Exception {
		scheduler.pauseJob(new JobKey(job.getJob_name(), job.getJob_group()));
	}

	/**
	 * 暂停任务
	 * 
	 * @param jobId 任务ID
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:19:15 李瑞辉 创建
	 *
	 */
	@Override
	public void pauseJob(String jobId) throws Exception {
		JmJobDetail job = (JmJobDetail) this.jmDAO.find(JmJobDetail.class, jobId);
		this.pauseJob((JmJobDetail) job);
	}

	@Override
	public void pauseJobs(List<JmJobDetail> jobs) throws Exception {
		
	}

	@Override
	public void resumeAll() throws Exception {
		
	}

	/**
	 * 
	 * 恢复任务
	 * 
	 * @param job
	 * @throws Exception
	 *
	 * @变更记录 2018年1月3日 上午8:50:29 李瑞辉 创建
	 *
	 */
	@Override
	public void resumeJob(String jobId) throws Exception {
		JmJobDetail job = (JmJobDetail) this.jmDAO.find(JmJobDetail.class, jobId);
		this.resumeJob((JmJobDetail) job);		
	}
	/**
	 * 
	 * 恢复任务
	 *
	 * @变更记录 2018年1月3日 上午9:18:39 LRH 创建
	 *
	 */
	private void resumeJob(JmJobDetail job) throws Exception {
		scheduler.resumeJob(new JobKey(job.getJob_name(), job.getJob_group()));				
	}
	
	/**
	 * 
	 * 恢复任务
	 *
	 * @变更记录 2018年1月3日 上午9:18:55 LRH 创建
	 *
	 */
	@Override
	public void resumeJobs(List<JmJobDetail> jobs) throws Exception {
	}

	/**
	 * 保存或更新任务调度
	 * 
	 * @param jobDetail 任务调度信息
	 * @return 
	 *
	 * @变更记录 2017年12月28日 下午1:17:30 李瑞辉 创建
	 *
	 */
	@Override
	public String saveOrUpdateJob(JmJobDetail jobDetail) throws Exception {
		/**
		 * 验证一
		 * 验证标准方式或普通方式
		 */
		/* 标准方式 即实现Job接口的类 */
		if (jobDetail.getIsjobclass() == 1) {
			boolean flag = false;
			try {
				Class<?> clazz = Class.forName(jobDetail.getJob_class_name());
				for (Class<?> o : clazz.getInterfaces()) {
					if (flag = (Job.class == o)) break;
				}
				if (!flag)
					return "非标准方式";
			} catch (ClassNotFoundException e) {
				return "未查询到指定的类";
			}				
		} else { /* 普通方式 */
			// 验证Bean和方法
			if (SpringBeanUtil.containsBean(jobDetail.getJob_bean_name())) {
			} else {
				throw new WisoftException("错误");
			}

		}
		
		/**
		 * 验证二
		 * 验证任务名称与分组分组的唯一性
		 */
		boolean isExist = this.jmDAO.findJobByNameAndGroup(jobDetail.getJob_name(), jobDetail.getJob_group(), jobDetail.getId());
		if (isExist)
			return "已存在相同的任务名称和任务分组";
		
		if (null != jobDetail.getId()) {//更新方式
			if (jobDetail.getInstance_status() == 0) {//如果任务正在运行则需要暂停它
				this.pauseJob(jobDetail);
			}
			jobDetail.setInstance_status(-1);//设置为【未运行】状态			
			this.jmDAO.update(jobDetail);
		} else {//新增方式
			jobDetail.setJob_create_time(DateUtil.getFullDate()).setInstance_status(-1);			
			this.jmDAO.save(jobDetail);
		}		
		return jobDetail.getId();
	}


	/**
	 * 启动任务
	 * 
	 * @param job
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:22:57 李瑞辉 创建
	 *
	 */
	@SuppressWarnings("unchecked")
	private void startJob(JmJobDetail job) throws Exception {

		JobDetail jobDetail;
		/* 标准方式的任务 即实现Job接口的类 */
		if (1 == job.getIsjobclass()) {
			jobDetail = JobBuilder.newJob((Class<? extends Job>) Class.forName(job.getJob_class_name())).withIdentity(job.getJob_name(), job.getJob_group()).storeDurably(false).build();
		} else {/* 普通方式的任务 */
			jobDetail = JobBuilder.newJob(SpringJobDetail.class).withIdentity(job.getJob_name(), job.getJob_group()).storeDurably(false).build();
			jobDetail.getJobDataMap().put(SpringJobDetail.BEAN_NAME, job.getJob_bean_name());
			jobDetail.getJobDataMap().put(SpringJobDetail.METHOD_NAME, job.getJob_method_name());
		}
		
		Trigger trigger;
		// 一次性调度触发器
		if (job.getTrigger_type() == 0) {
			Date dateTime = new Date();
			if (null != job.getStarttime()) {
				dateTime = DateUtil.string2datetime(job.getStarttime());
			} else if (0 != job.getTime_limit() && 0 != job.getTime_unit()) {	
				long startTime = System.currentTimeMillis()
						+ new Long((long) (job.getTime_limit() * job.getTime_unit() * 60)) * 1000L;
				dateTime = new Date(startTime);
			}
			trigger = TriggerBuilder.newTrigger().withIdentity(job.getJob_name(), job.getJob_group()).startAt(dateTime).forJob(jobDetail).build();
		} else {/* 周期性调度触发器 */
			if (SSUtil.isEmpty(job.getEndtime())) {
				trigger = TriggerBuilder.newTrigger().withIdentity(job.getJob_name(), job.getJob_group())
						.startAt(DateUtil.string2datetime(job.getStarttime()))
						.withSchedule(CronScheduleBuilder.cronSchedule(job.getCron_expression())).build();
			} else {
				trigger = TriggerBuilder.newTrigger().withIdentity(job.getJob_name(), job.getJob_group())
						.startAt(DateUtil.string2datetime(job.getStarttime()))
						.endAt(DateUtil.string2datetime(job.getEndtime()))
						.withSchedule(CronScheduleBuilder.cronSchedule(job.getCron_expression())).build();
			}


		}
		scheduler.scheduleJob(jobDetail, trigger);

		// 将Job的状态更新为【运行】状态
		job.setInstance_status(0);
		jmDAO.update(job);
	}

	/**
	 * 启动任务
	 * 
	 * @param jobId 任务ID
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:18:32 李瑞辉 创建
	 *
	 */
	@Override
	public void startJob(String jobId) throws Exception {
		JmJobDetail job = (JmJobDetail) this.jmDAO.find(JmJobDetail.class, jobId);
		this.startJob(job);
	}

	/**
	 * 更新实例运行状况
	 *
	 */
	private void updateJmJobDetail(JmJobDetail detail, int instance_status, int isexecuting, String exception) {
		detail.setInstance_status(instance_status);
		detail.setException_info(exception);
		detail.setIsexecuting(isexecuting);
		this.jmDAO.update(detail);
	}
	
}
