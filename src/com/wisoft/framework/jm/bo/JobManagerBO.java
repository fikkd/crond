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
import org.quartz.SimpleTrigger;
import org.quartz.TriggerBuilder;

import com.wisoft.framework.common.exception.WisoftException;
import com.wisoft.framework.common.pojo.PageInfoDTO;
import com.wisoft.framework.common.utils.DateUtil;
import com.wisoft.framework.common.utils.ListUitl;
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

	public JMDAO getJmDAO() {
		return jmDAO;
	}

	public Scheduler getScheduler() {
		return scheduler;
	}
	
	public void setJmDAO(JMDAO jmDAO) {
		this.jmDAO = jmDAO;
	}

	public void setScheduler(Scheduler scheduler) {
		this.scheduler = scheduler;
	}
	
	/**
	 * 删除任务
	 * 
	 * @param jobID
	 * @return 
	 * @throws Exception
	 *
	 * @变更记录 2017年12月28日 下午1:19:35 李瑞辉 创建
	 *
	 */
	public String deleteJob(String jobID) throws Exception {
		// 获取任务信息
		if (null != jobID && !"".equals(jobID.trim())) {
			Object obj = this.jmDAO.find(JmJobDetail.class, jobID);
			if (obj != null) {
				// 停止任务
				this.stopJob((JmJobDetail) obj);
				// 删除
				this.jmDAO.delete((JmJobDetail) obj);
			} else {
				throw new Exception("任务已不存在,请刷新列表");
			}
		}

		return jobID;
	}

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
	public JmJobDetail findJobDetailByJobID(String jobID) {
		// 获取任务信息
		if (null != jobID && !"".equals(jobID.trim())) {
			JmJobDetail jobDetail = null;
			Object obj = this.jmDAO.find(JmJobDetail.class, jobID);
			if (null != obj) {
				jobDetail = (JmJobDetail) obj;
				return jobDetail;
			}
		}
		return null;
	}

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
	public PageInfoDTO findJobList(JmSearchParam param) {
		PageInfoDTO pageInfoDTO = new PageInfoDTO();

		// 获取总条数
		pageInfoDTO.setTotalcount(this.jmDAO.findJobCount(param));
		// 分页
		List<JmJobDetail> details = this.jmDAO.findJobList(param);
		if (!ListUitl.isListEmpty(details)) {
			for (JmJobDetail jmJobDetail : details) {
				if (jmJobDetail.getQrtzcount() == 0 && jmJobDetail.getIsexecuting() == 1) {
					jmJobDetail.setIsexecuting(0);//是否存在调度实例【0-不存在 1-存在】
					this.jmDAO.update(jmJobDetail);
				}
			}
		}

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
	@Override
	public String saveJob(JmJobDetail jobDetail) throws Exception {
		if (null != jobDetail) {
			// 验证任务名称与分组分组的唯一性
			boolean isExist = this.jmDAO.findJobByNameAndGroup(jobDetail.getJob_name(), jobDetail.getJob_group(), jobDetail.getId());
			if (isExist) 
				return "已存在相同的任务名称和任务分组";
			
			
			// 作业类 和bean是否合法
			boolean flag = false;
			// 任务要执行的作业类
			if (jobDetail.getIsjobclass() == 1) {
				try {
					Class<?> forName = Class.forName(jobDetail.getJob_class_name());
					for (Class<?> o : forName.getInterfaces()) {
						if (Job.class == o) {
							flag = true;
							break;
						}
					}
				} catch (ClassNotFoundException e) {
					throw new WisoftException("执行类不合法！");
				}
				if (!flag)
					throw new WisoftException("执行类不合法！");
			} else {
				// 验证bean是否存在
				if (SpringBeanUtil.containsBean(jobDetail.getJob_bean_name())) {
				} else {
					throw new WisoftException("Bean名称不存在！");
				}

			}
			if (null != jobDetail.getId() && !"".equals(jobDetail.getId().trim())) {
				// 停止任务
				this.stopJob(jobDetail);
				this.jmDAO.update(jobDetail);
			} else {
				jobDetail.setJob_create_time(DateUtil.getFullDate());
				this.jmDAO.save(jobDetail);
			}
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
	@Override
	public void startJob(JmJobDetail job) throws Exception {
		if (job.getIsexecuting() == 1) {
			return;
		}
		Scheduler s1 = scheduler;
		JobDetail jobDetail = null;
		if (1 == job.getIsjobclass()) {
			// 任务要执行的作业类
			jobDetail = JobBuilder.newJob((Class<? extends Job>) Class.forName(job.getJob_class_name()))
					.withIdentity(job.getJob_name(), job.getJob_group()).storeDurably(false).build();

		} else {
			jobDetail = JobBuilder.newJob(SpringJobDetail.class).withIdentity(job.getJob_name(), job.getJob_group())
					.storeDurably(false).build();
			jobDetail.getJobDataMap().put(SpringJobDetail.BEAN_NAME, job.getJob_bean_name());
			jobDetail.getJobDataMap().put(SpringJobDetail.METHOD_NAME, job.getJob_method_name());
		}
		// 简单/复杂调度判断
		if (job.getTrigger_type() == 0) {
			// 调度开始时间
			Date dateTime = new Date();
			if (null != job.getStarttime()) {
				dateTime = DateUtil.string2datetime(job.getStarttime());
			} else if (0 != job.getTime_limit() && 0 != job.getTime_unit()) {
				// 系统当前时间+间隔时间后
				long startTime = System.currentTimeMillis()
						+ new Long((long) (job.getTime_limit() * job.getTime_unit() * 60)) * 1000L;
				dateTime = new Date(startTime);
			}
			org.quartz.SimpleTrigger simpleTrigger = (SimpleTrigger) TriggerBuilder.newTrigger()
					.withIdentity(job.getJob_name(), job.getJob_group()).startAt(dateTime).forJob(jobDetail).build();
			// 删除job的实例数据
			s1.deleteJob(new JobKey(job.getJob_name(), job.getJob_group()));
			// 启动job
			s1.scheduleJob(jobDetail, simpleTrigger);
		} else {
			org.quartz.CronTrigger cronTrigger = null;
			if (SSUtil.isEmpty(job.getEndtime())) {
				cronTrigger = TriggerBuilder.newTrigger().withIdentity(job.getJob_name(), job.getJob_group())
						.startAt(DateUtil.string2datetime(job.getStarttime()))
						.withSchedule(CronScheduleBuilder.cronSchedule(job.getCron_expression())).build();
			} else {// 结束时间
				cronTrigger = TriggerBuilder.newTrigger().withIdentity(job.getJob_name(), job.getJob_group())
						.startAt(DateUtil.string2datetime(job.getStarttime()))
						.endAt(DateUtil.string2datetime(job.getEndtime()))
						.withSchedule(CronScheduleBuilder.cronSchedule(job.getCron_expression())).build();
			}
			// 删除job的实例数据
			s1.deleteJob(new JobKey(job.getJob_name(), job.getJob_group()));
			// 启动job
			s1.scheduleJob(jobDetail, cronTrigger);
		}
		// 更新jmjobdetail表状态
		this.updateJmJobDetail(job, 0, 1, "");// 正常,执行中
	}

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
	@Override
	public void startJob(String jobID) throws Exception {
		// 获取任务信息
		if (null != jobID && !"".equals(jobID.trim())) {
			Object obj = this.jmDAO.find(JmJobDetail.class, jobID);
			if (obj != null) {
				// 启动任务
				this.startJob((JmJobDetail) obj);
			} else {
				throw new Exception("任务已不存在,请刷新列表");
			}
		}
	}

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
	@Override
	public void stopJob(JmJobDetail job) throws Exception {
		if (job.getIsexecuting() == 0) {
			return;
		}
		Scheduler s1 = scheduler;		
		// 删除job实例
		s1.deleteJob(new JobKey(job.getJob_name(), job.getJob_group()));
		// 更新jmjobdetail表中的相关状态
		this.updateJmJobDetail(job, 0, 0, "");// 正常,不存在调度实例
	}

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
	@Override
	public void stopJob(String jobID) throws Exception {
		// 获取任务信息
		if (null != jobID && !"".equals(jobID.trim())) {
			Object obj = this.jmDAO.find(JmJobDetail.class, jobID);
			if (obj != null) {
				// 停止任务
				this.stopJob((JmJobDetail) obj);
			} else {
				throw new Exception("任务已不存在,请刷新列表");
			}
		}
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
	
}
