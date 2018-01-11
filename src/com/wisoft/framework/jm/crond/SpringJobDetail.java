package com.wisoft.framework.jm.crond;

import java.lang.reflect.Method;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;

import com.wisoft.framework.common.utils.SpringBeanUtil;
import com.wisoft.framework.jm.bo.IJobManagerBO;

/**
 * 
 * 自定义job模型(job不允许并发执行) 根据容器中的bean名称和方法名称来执行定时任务
 * 通常情况下都是配置这种类型的job，很少自己写一个类去实现Job
 *
 * @since 2016-3-6
 * @author "朱云山"
 *
 */
@DisallowConcurrentExecution
public class SpringJobDetail implements Job {

	private static final Log log = LogFactory.getLog(SpringJobDetail.class);

	public static final String BEAN_NAME = "beanName";
	public static final String METHOD_NAME = "methodName";

	public void execute(JobExecutionContext context) throws JobExecutionException {
		JobDetail jobDetail = context.getJobDetail();
		JobDataMap data = jobDetail.getJobDataMap();
		JobKey jobKey = jobDetail.getKey();
		try {
			invokeMethod(data.getString(BEAN_NAME), data.getString(METHOD_NAME));
		} catch (Exception e) {
			log.error("JOB执行失败：" + jobKey);
			log.error(this, e);
			JobExecutionException jobEx = new JobExecutionException(e);
			jobEx.setUnscheduleAllTriggers(true);

			// 标记失败信息
			markFailure(jobKey, e);

			throw jobEx;
		}
	}

	/**
	 * 
	 * 调用接口IJobManagerBO实现类中的markFailure方法来记录失败信息
	 * 
	 * @param jobKey
	 *            job名称和分组
	 * @param st
	 *            异常堆栈信息
	 *
	 * @变更记录 2016-3-9 下午2:33:25 "朱云山" 创建
	 *
	 */
	private void markFailure(JobKey jobKey, Exception st) {
		Object jobBO = SpringBeanUtil.getApplicationContext().getAutowireCapableBeanFactory()
				.getBean(IJobManagerBO.class);
		try {
			Method method = jobBO.getClass().getMethod("markFailure", JobKey.class, Exception.class);
			method.invoke(jobBO, jobKey, st);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 
	 * 通过反射调用bean中的方法 不支持带参数的方法,仅支持public的无参数方法
	 * 
	 * @param beanName
	 *            spring配置文件中配置的bean名称
	 * @param methodName
	 *            方法名称
	 * @return
	 * @throws Exception
	 *
	 * @变更记录 2016-3-6 下午4:24:33 "朱云山" 创建
	 *
	 */
	public Object invokeMethod(String beanName, String methodName) throws Exception {

		Object beanObject = SpringBeanUtil.getBean(beanName);

		// 不支持带参数方法
		Method method = beanObject.getClass().getMethod(methodName);
		return method.invoke(beanObject);
	}
}
