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
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading application...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<SchoolRegistration />} />
      <Route path="/admin-login" element={<Login />} />
      <Route path="/student-login" element={<StudentLogin />} />
    <Route path="/student-dashboard" element={<StudentDashboard /> } />
     <Route path='/student-profile' element={<StudentProfile />} />
    <Route path="/student-results" element={<Results />} />
    <Route path="/student-progress" element={<Progress />} />
    <Route path="/student-settings" element={<StudentSettings />} />
    <Route path="/superadmin" element={<SuperAdminDashboard />} />

      {/* Protected routes */}
      <Route path="/admin" element={user ? <Layout /> : <Navigate to="/admin-login" />}>
        
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="manage-teacher" element={<ManageTeacher/>} />
        <Route path="manage-student" element={<ManageStudentsOptions/>} />
        <Route path="manage-exam" element={<ManageExams/>} />
        <Route path="manage-subject" element={<ManageSubjects/>} />
        <Route path="update-student" element={<UpdateStudent />} />
        <Route path="transfer-student" element={<TransferStudent/>} />
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
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;