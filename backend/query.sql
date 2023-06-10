CREATE TABLE subject_section_hours (
	id int not null primary key auto_increment,
	subject_id int not null references subjects(id),
	section_id int not null references sections(id),
	total_hours int not null default 0
);


SELECT a.student_id, a.student_name, a.roll_no,
	a.section_name,
	sum(a.sub1_tot_hrs) sub1_tot_hrs,
	sum(a.sub1_abs_hrs) sub1_abs_hrs,
	sum(a.sub1_tot_hrs) - sum(a.sub1_abs_hrs) sub1_pre_hrs,
	
	sum(a.sub2_tot_hrs) sub2_tot_hrs,
	sum(a.sub2_abs_hrs) sub2_abs_hrs,
	
	sum(a.sub3_tot_hrs) sub3_tot_hrs,
	sum(a.sub3_abs_hrs) sub3_abs_hrs,
	
	sum(a.sub4_tot_hrs) sub4_tot_hrs,
	sum(a.sub4_abs_hrs) sub4_abs_hrs,
	
	sum(a.sub5_tot_hrs) sub5_tot_hrs,
	sum(a.sub5_abs_hrs) sub5_abs_hrs,
	
	sum(a.sub6_tot_hrs) sub6_tot_hrs,
	sum(a.sub6_abs_hrs) sub6_abs_hrs
FROM
(
	SELECT s.id student_id, s.name student_name, s.roll_no,
		sec.name section_name,
		sum(case when sub.name = 'Sub1' then ssh.total_hours else 0 end) sub1_tot_hrs,
		count(case when sub.name = 'Sub1' then ha.is_absent else null end) sub1_abs_hrs,
		
		sum(case when sub.name = 'Sub2' then ssh.total_hours else 0 end) sub2_tot_hrs,
		count(case when sub.name = 'Sub2' then ha.is_absent else null end) sub2_abs_hrs,
		
		sum(case when sub.name = 'Sub3' then ssh.total_hours else 0 end) sub3_tot_hrs,
		count(case when sub.name = 'Sub3' then ha.is_absent else null end) sub3_abs_hrs,
		
		sum(case when sub.name = 'Sub4' then ssh.total_hours else 0 end) sub4_tot_hrs,
		count(case when sub.name = 'Sub4' then ha.is_absent else null end) sub4_abs_hrs,
		
		sum(case when sub.name = 'Sub5' then ssh.total_hours else 0 end) sub5_tot_hrs,
		count(case when sub.name = 'Sub5' then ha.is_absent else null end) sub5_abs_hrs,
		
		sum(case when sub.name = 'Sub6' then ssh.total_hours else 0 end) sub6_tot_hrs,
		count(case when sub.name = 'Sub6' then ha.is_absent else null end) sub6_abs_hrs
		-- sum(case when sub.name = 'Sub1' then count(ha.is_absent) else 0 end) sub1_abs_hrs
		-- ssh.total_hours  - count(ha.is_absent) pre_hours
		-- count(case when ha.is_absent is null then 1 else null end) pre_hours
	from students s cross join subjects sub
	inner join sections sec on s.section_id = sec.id 
	LEFT join hourly_attendances ha on s.id = ha.student_id and ha.subject_id = sub.id 
	LEFT JOIN subject_section_hours ssh on ssh.subject_id = sub.id and ssh.section_id = sec.id 
	-- WHERE sub.name = 'Sub1'
	GROUP BY s.id, sec.id
	ORDER BY s.name
) a
GROUP BY a.student_id, a.section_name
ORDER BY a.student_name
