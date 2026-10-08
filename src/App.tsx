import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import TeacherLayout from "./components/TeacherLayout";
import { useApp } from "./context/AppContext";
import AIAssistant from "./pages/AIAssistant";
import Announcements from "./pages/Announcements";
import Changes from "./pages/Changes";
import ChildProfile from "./pages/ChildProfile";
import Dashboard from "./pages/Dashboard";
import Grades from "./pages/Grades";
import HomeworkPage from "./pages/HomeworkPage";
import Login from "./pages/Login";
import MessagesPage from "./pages/MessagesPage";
import ParentDashboard from "./pages/ParentDashboard";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherMeetings from "./pages/teacher/TeacherMeetings";
import TeacherRooms from "./pages/teacher/TeacherRooms";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";

export default function App() {
  const { user } = useApp();
  const isParent = user?.role === "parent";
  const isTeacher = user?.role === "teacher";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={isTeacher ? "/teacher" : "/"} replace />
            ) : (
              <Login />
            )
          }
        />
        {isTeacher ? (
          <>
            <Route path="/" element={<Navigate to="/teacher" replace />} />
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route index element={<TeacherHome />} />
              <Route path="jadval" element={<TeacherSchedule />} />
              <Route path="sinflar" element={<TeacherClasses />} />
              <Route path="xonalar" element={<TeacherRooms />} />
              <Route path="yigilishlar" element={<TeacherMeetings />} />
              <Route path="*" element={<Navigate to="/teacher" replace />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="/teacher/*" element={<Navigate to="/" replace />} />
            <Route
              element={
                user ? (
                  <Layout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route
                path="/"
                element={isParent ? <ParentDashboard /> : <Dashboard />}
              />
              <Route path="/jadval" element={<Schedule />} />
              <Route path="/uy-vazifalari" element={<HomeworkPage />} />
              <Route path="/xabarlar" element={<MessagesPage />} />
              <Route path="/elonlar" element={<Announcements />} />
              <Route
                path="/ozgarishlar"
                element={isParent ? <Navigate to="/" replace /> : <Changes />}
              />
              <Route
                path="/ai"
                element={
                  isParent ? <Navigate to="/" replace /> : <AIAssistant />
                }
              />
              <Route
                path="/profil"
                element={
                  isParent ? <Navigate to="/" replace /> : <Profile />
                }
              />
              <Route
                path="/baholar"
                element={isParent ? <Grades /> : <Navigate to="/" replace />}
              />
              <Route
                path="/farzandim"
                element={
                  isParent ? <ChildProfile /> : <Navigate to="/" replace />
                }
              />
            </Route>
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
