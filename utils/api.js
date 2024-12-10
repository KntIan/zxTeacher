import { get, post } from '@/utils/request'

//登录请求
export const loginUser = (data) => post('/user/login', data)

//校区列表请求
export const getSchoolList = () => get('/teacher/schoollist')

//我的学生列表请求
export const getMyStudentList = (data) => get('/teacher/classlystudents', data)

//我的课程列表请求
export const getMyCourseList = (data) => get('/teacher/lessons', data)

//我的课程-章列表请求
export const getMyCourseChapterList = (data) => get('/teacher/lessonunit', data)

//我的课程-节列表请求
export const getMyCourseSectionList = (data) =>
  get('/teacher/lessonsection', data)

// 班级课程表请求
export const getClassCourseTable = (data) =>
  get('/teacher/classlytimetable', data)

//班级课程安排删除请求
export const deleteClassCourseArrange = (data) =>
  post('/teacher/arrangeclasslylessondel', data)

//某个学生课程安排删除请求
export const deleteStudentCourseArrange = (data) =>
  post('/teacher/arrangestudentlessondel', data)

//我的课程-章节课件上传请求
export const uploadCourseChapterMaterial = (data) =>
  get('/teacher/unitcontent', data)

//我的课程章节总请求
export const getMyCourseChapterAll = (data) =>
  get('/teacher/lessonunitcontent', data)

//班级课程安排添加请求
export const addClassCourseArrange = (data) =>
  post('/teacher/arrangeclasslylesson', data)

// 布置作业请求
export const setHomework = (data) => post('/teacher/arrangehomework', data)

//课堂列表请求
export const getHomeworkList = (data) =>
  get('/teacher/arrangehomeworktimetable', data)

//已布置作业待批改列表请求
export const getHomeworkToBeCheckedList = (data) =>
  get('/teacher/homeworkrecent', data)

//已布置作业的班级列表请求
export const getHomeworkClassList = (data) =>
  get('/teacher/homeworkclassly', data)

//待批改学生作业列表请求
export const getHomeworkToCheckList = (data) =>
  get('/teacher/homeworkrecentstudent', data)

//批改作业延时10分钟请求
export const delayHomework = (data) => post('/teacher/homeworkdefer', data)

//批改作业请求
export const checkHomework = (data) => get('/teacher/homeworkreview', data)

//点击完成执行批改请求
export const finishHomework = (data) =>
  post('/teacher/homeworkreviewexecute', data)

//收藏评语请求
export const collectComment = (data) => post('/teacher/collectremark', data)

//收藏评语列表请求
export const getCommentList = (data) => get('/teacher/remarks', data)

// 删除评语请求
export const deleteComment = (data) => post('/teacher/delremark', data)

//ai点评请求
export const getAiComment = (data) => post('/teacher/remarkai', data)

//某一个学生课程调整列表请求
export const getStudentCourseArrangeList = (data) =>
  get('/teacher/studenttimetable', data)

//老师审阅作业列表请求
export const getHomeworkToReviewList = (data) =>
  get('/teacher/studenthomeworkpast', data)

//ai检查学生作业列表请求
export const getHomeworkToCheckByAiList = (data) =>
  get('/teacher/studenthomeworkai', data)

//搜索关联文字视频请求
export const searchRelatedVideo = (data) => get('/teacher/fonts', data)

//双师课堂提交请求
export const submitDoubleClassHomework = (data) =>
  post('/teacher/doublelesson', data)

//某一个学生课程安排调整请求
export const adjustStudentCourseArrange = (data) =>
  post('/teacher/arrangestudentlesson', data)

//我的班级列表请求
export const getMyClassList = (data) => get('/teacher/classly', data)

//我的学生列表请求
export const getMyStudent = (data) => get('/teacher/students', data)

//用户协议
export const fetchUserAgreement = (data) => get('/common/agreement', data)

//获取验证码
export const fetchVerificationCode = (data) => post('/sms/send', data)

//找回密码
export const fetchFindPassword = (data) => post('/user/resetpwd', data)

//关于我们
export const fetchAboutUs = () => get('/user/aboutus')

//联系我们
export const fetchContactUs = () => get('/user/contact')

//投诉建议
export const submitComplaint = (data) => post('/user/feedback', data)

//生成二维码
export const generateQRCode = (data) => get('/common/qrcode', data)

//公告通知
export const fetchNotice = (data) => get('/teacher/notice', data)

//去学习
export const goStudy = (data) => get('/user/gostudy', data)

//作业ai审阅详情
export const fetchHomeworkAIReviewDetail = (data) =>
  get('/user/homeworkaidetail', data)
