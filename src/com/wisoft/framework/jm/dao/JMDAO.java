package com.wisoft.framework.jm.dao;

import java.util.ArrayList;
import java.util.List;

import com.wisoft.framework.common.dao.NBaseDao;
import com.wisoft.framework.common.utils.SSUtil;
import com.wisoft.framework.jm.common.JmSearchParam;
import com.wisoft.framework.jm.crond.JmQrtzTriggers;
import com.wisoft.framework.jm.entity.JmJobDetail;

public class JMDAO extends NBaseDao {

	/**
	 * 判断数据库中是否存在相同的任务名称与分组名称
	 * 
	 * @param job_name 任务名称
	 * @param job_group 分组名称
	 * @param id 主键
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:27:41 李瑞辉 创建
	 *
	 */
	@SuppressWarnings("unchecked")
	public boolean findJobByNameAndGroup(String job_name, String job_group, String id) {
		List<String> jobs = null;
		if (SSUtil.isEmpty(id)) {/** 新增时 */
			jobs = this.findByHql("select id from JmJobDetail where job_name=? and job_group=?", new Object[] { job_name, job_group });
		} else {/** 修改时 */
			jobs = this.findByHql("select id from JmJobDetail where job_name=? and job_group=? and id<>?", new Object[] { job_name, job_group, id });
		}
		
		return null != jobs && jobs.size() > 0;		
	}
	
	/**
	 * 根据任务名称和分组名称查找任务对象
	 * 
	 * @param job_name 任务名称
	 * @param job_group 分组名称
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:27:41 李瑞辉 创建
	 *
	 */
	@SuppressWarnings("unchecked")
	public JmJobDetail findJobByNameAndGroup(String job_name, String job_group) {
		List<JmJobDetail> jobs = this.findByHql("from JmJobDetail where job_name=? and job_group=?", new Object[] { job_name, job_group });
		return null != jobs && jobs.size() > 0
				? jobs.get(0) : null;
	}

	/**
	 * 获取任务列表分页
	 * 
	 * @param param
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:25:52 李瑞辉 创建
	 *
	 */
	public int findJobCount(JmSearchParam param) {
		List<Object> params = new ArrayList<Object>();

		String hql = "select count(*) from JmJobDetail where 1=1 ";
		if (null != param.getKeyword() && !"".equals(param.getKeyword().trim())) {
			hql += " and (job_name like ? or job_group like ?)";
			params.add("%" + param.getKeyword().trim() + "%");
			params.add("%" + param.getKeyword().trim() + "%");
		}
		return this.findCountsByHql(hql, params.toArray(new Object[0]));
	}

	/**
	 * 获取任务列表分页
	 * 
	 * @param param
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:26:42 李瑞辉 创建
	 *
	 */
	@SuppressWarnings("unchecked")
	public List<JmJobDetail> findJobList(JmSearchParam param) {
		int offset = (param.getCurpage() - 1) * param.getPercount();
		String queryParm = "-1";
		if (null != param.getKeyword() && !"".equals(param.getKeyword().trim())) {
			queryParm = "%" + param.getKeyword().trim() + "%";
		}
		return this.findPageByNamedQuery("findJobList", JmJobDetail.class,
				new String[] { "queryParm" },
				new Object[] { queryParm }, offset,
				param.getPercount());
	}

	/**
	 * 根据任务名称及任务分组查询任务数
	 * 
	 * @param job_name 任务名称
	 * @param job_group 任务分组
	 * @param id 任务ID
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:27:11 李瑞辉 创建
	 *
	 */
	public int findNameAndGroupCount(String job_name, String job_group, String id) {
		// 若任务ID不为空则需排除该任务本身
		if (null != id && !"".equals(id.trim())) {
			return this.findCountsByHql("select count(*) from JmJobDetail where job_name=? and job_group=? and id<>?",
					new Object[] { job_name, job_group, id });
		} else {
			return this.findCountsByHql("select count(*) from JmJobDetail where job_name=? and job_group=?",
					new Object[] { job_name, job_group });
		}
	}

	/**
	 * 查询运行情况
	 * 
	 * @param job_name
	 * @param job_group
	 * @return
	 *
	 * @变更记录 2017年12月28日 下午1:28:00 李瑞辉 创建
	 *
	 */
	@SuppressWarnings("unchecked")
	public JmQrtzTriggers findQrtzTriggers(String job_name, String job_group) {
		List<JmQrtzTriggers> list = this.findByNamedQuery("findQrtz_triggers", JmQrtzTriggers.class,
				new String[] { "job_name", "job_group" }, new Object[] { job_name, job_group });
		
		return null != list && list.size() > 0
				? list.get(0) : null;
	}

}
