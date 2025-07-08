import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import SchoolRegistration from './pages/SchoolRegistration';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Exams from './pages/Exams';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PageNotFound from './pages/PageNotFound';
import './App.css';
import StudentDashboard from './pages/StudentDashboard';
import StudentLogin from './pages/StudentLogin';
import StudentProfile from './components/students/StudentProfile';
import Progress from './components/students/Progress';
import Results from './components/students/Results';
import StudentSettings from './components/students/StudentSettings';
import ManageTeacher from './components/teachers/ManageTeacher';
import ManageExams from './pages/ManageExams';
import ManageSubjects from './pages/ManageSubjects';
import ManageStudentsOptions from './components/students/ManageStudentOptions';
import UpdateStudent from './components/students/UpdateStudent';
import TransferStudent from './components/students/TransferStudent';
import FreezeStudent from './components/students/FreezStudent';
import WithdrawStudent from './components/students/WithdrawStudent';
import AssignClass from './components/teachers/AssignClass';
import AssignSubject from './components/teachers/AssignSubject';
import UpdateTeacher from './components/teachers/UpdateTeacher';
import DeleteTeacher from './components/teachers/DeleteTeacher';
import Subject from './components/subjects/Subject';
import AddSubject from './components/subjects/AddSubject';
import UpdateSubject from './components/subjects/UpdateStubject';
import DeleteSubject from './components/subjects/DeleteSubject';
import FirstTerm from './components/exams/FirstTerm';
import SecondTerm from './components/exams/SecondTerm';
import ThirdTerm from './components/exams/ThirdTerm';
import AddExams from './components/exams/AddExam';
import ViewExams from './components/exams/ViewExam';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';
import TeacherDashboard from './components/teachers/TeacherDashboard';
import TeacherLogin from './components/teachers/TeacherLogin';
import TeachersProfile from './components/teachers/TeachersProfile';
import TeachersClasses from './components/teachers/TeachersClass';
import TeachersSchedule from './components/teachers/TeachersSchedule';
import TeachersSettings from './components/teachers/TeachersSetting';
import TeachersResult from './components/teachers/TeachersSubject';
import TeacherSubjects from './components/teachers/TeachersSubject';
import Classes from './pages/Classes';
import TeacherExam from './components/teachers/TeacherExam';
import TransferStudentForm from './components/students/TransferStudentForm';
import Schools from './components/admin/Schools';
import Admins from './components/admin/Admins';
import AdminSettings from './components/admin/AdminSettings';
import { CircularProgress, Box } from '@mui/material';
import GenReport from './pages/GenReport';
import ViewFirstTerm from './components/exams/ViewFirstTerm';
import ViewSecondTerm from './components/exams/ViewSecondTerm'
import ViewThirdTerm from './components/exams/ViewThirdTerm'
import TeacherManageExams from './components/teachers/TeacherManageExam';
import TeacherViewExams from './components/teachers/TeacherViewExam';
import TeacherAddExams from './components/teachers/TeacherAddExam';
import TeacherFirstTerm from './components/teachers/TeacherFirstTerm';
import TeacherSecondTerm from './components/teachers/TeacherSecondTerm';
import TeacherThirdTerm from './components/teachers/TeacherThirdTerm';
import TeacherViewSecond from './components/teachers/TeacherViewSecond';
import TeacherViewThird from './components/teachers/TeacherViewThird';
import TeacherViewFirst from './components/teachers/TeacherViewFirst';
import AdminStudents from './components/admin/AdminStudents';
import AdminTeachers from './components/admin/AdminTeachers';

function App() {
  const { user, loading } = useAuth();

 if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        
        <CircularProgress />
      </Box>
      
    );
    
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<SchoolRegistration />} />
      <Route path="/admin-login" element={<Login />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />
    <Route path="/student-dashboard" element={<StudentDashboard /> } />
    <Route path="/teacher-dashboard" element={<TeacherDashboard/>}/>
     <Route path='/student-profile' element={<StudentProfile />} />
    <Route path="/student-results" element={<Results />} />
    <Route path="/student-progress" element={<Progress />} />
    <Route path="/student-settings" element={<StudentSettings />} />
      <Route path="/admin-teachers" element={<AdminTeachers />} />
      
    
    <Route path="/teacher-profile" element= {<TeachersProfile/>}/>
      <Route path="/teacher-classes" element={<TeachersClasses />} />
      <Route path="/teacher-schedule" element={<TeachersSchedule />} /> 
      <Route path="/teacher-subject" element={<TeacherSubjects />} />
      <Route path="/teacher-settings" element={<TeachersSettings />} />
       <Route path='classes' element={<TeacherExam/>} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/admin-schools" element={<Schools />} />
        <Route path="/schooladmins" element={<Admins />} />
        <Route path="/admin-students" element={<AdminStudents/>} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/teacher-exams" element={<TeacherManageExams />} />
        <Route path="/teacher-view" element={<TeacherViewExams/>} />
        <Route path="/teacher-add" element={<TeacherAddExams/>} />
        <Route path="/teacher-first" element={<TeacherFirstTerm/>} />
         <Route path="/teacher-second" element={<TeacherSecondTerm/>} />
          <Route path="/teacher-third" element={<TeacherThirdTerm/>} />
           <Route path="/view-first" element={<TeacherViewFirst/>} />
           <Route path="/view-second" element={<TeacherViewSecond/>} />
            <Route path="/view-third" element={<TeacherViewThird/>} />

    
      {/* Protected routes */}
      <Route path="/admin" element={user ? <Layout /> : <Navigate to="/admin-login" />}>
     
        <Route index element={<Dashboard />} />
        <Route path="view-first" element={<ViewFirstTerm/>}/>
         <Route path="view-second" element={<ViewSecondTerm/>}/>
         <Route path="view-third" element={<ViewThirdTerm/>}/>
        <Route path='classes' element={<Classes/>} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="manage-teacher" element={<ManageTeacher/>} />
        <Route path="manage-student" element={<ManageStudentsOptions/>} />
        <Route path="manage-exam" element={<ManageExams/>} />
        <Route path="manage-subject" element={<ManageSubjects/>} />
        <Route path="update-student" element={<UpdateStudent />} />
        <Route path="transfer-student" element={<TransferStudent/>} />
         <Route path="transfer-student/:admissionNumber" element={<TransferStudentForm />} />
        <Route path="withdraw-student" element={<WithdrawStudent/>} />
        <Route path="freeze-student" element={<FreezeStudent/>} />
        <Route path='assign-class'  element= {<AssignClass/>}/>
        <Route path='assign-subject' element ={<AssignSubject/>}/>
        <Route path='update-teacher' element= {<UpdateTeacher/>}/>
        <Route path='delete-teacher' element={<DeleteTeacher/>}/>
        <Route path='subject'  element= {<Subject/>}/>
        <Route path='add-subject' element ={<AddSubject/>}/>
        <Route path='update-subject' element= {<UpdateSubject/>}/>
        <Route path='delete-subject' element={<DeleteSubject/>}/>
        <Route path='first-term' element ={<FirstTerm/>}/>
        <Route path='second-term' element= {<SecondTerm/>}/>
        <Route path='third-term' element={<ThirdTerm/>}/>
        <Route path='Add-exam' element={<AddExams/>}/>
        <Route path='view-exam' element={<ViewExams/>}/>
        <Route path="exams" element={<Exams />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="generate" element={<GenReport />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;