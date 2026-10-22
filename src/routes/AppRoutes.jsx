import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import LearnerLayout from '../layouts/LearnerLayout'
import AdminLayout from '../layouts/AdminLayout'
import { RequireRole, GuestOnly } from './guards'
import { BrandLoader } from '../components/common/PageLoader'

const page = (loader) => lazy(loader)

// Public
const Home = page(() => import('../pages/public/Home'))
const Catalog = page(() => import('../pages/public/Catalog'))
const CourseDetail = page(() => import('../pages/public/CourseDetail'))
const Categories = page(() => import('../pages/public/Categories'))
const Instructors = page(() => import('../pages/public/Instructors'))
const InstructorProfile = page(() => import('../pages/public/InstructorProfile'))
const Programs = page(() => import('../pages/public/Programs'))
const Business = page(() => import('../pages/public/Business'))
const About = page(() => import('../pages/public/About'))
const Contact = page(() => import('../pages/public/Contact'))
const Help = page(() => import('../pages/public/Help'))
const Terms = page(() => import('../pages/public/Terms'))
const Privacy = page(() => import('../pages/public/Privacy'))
const CertificateVerify = page(() => import('../pages/public/CertificateVerify'))
const Services = page(() => import('../pages/public/Services'))
const VerifyCertificate = page(() => import('../pages/public/VerifyCertificate'))
const NotFound = page(() => import('../pages/errors/NotFound'))

// Auth
const Login = page(() => import('../pages/auth/Login'))
const Register = page(() => import('../pages/auth/Register'))
const ForgotPassword = page(() => import('../pages/auth/ForgotPassword'))

// Learner
const LearnerDashboard = page(() => import('../pages/learner/Dashboard'))
const MyLearning = page(() => import('../pages/learner/MyLearning'))
const Saved = page(() => import('../pages/learner/Saved'))
const Certificates = page(() => import('../pages/learner/Certificates'))
const CertificateView = page(() => import('../pages/learner/CertificateView'))
const Achievements = page(() => import('../pages/learner/Achievements'))
const Notifications = page(() => import('../pages/learner/Notifications'))
const Profile = page(() => import('../pages/learner/Profile'))
const LearnerSettings = page(() => import('../pages/learner/Settings'))
const CoursePlayer = page(() => import('../pages/learner/CoursePlayer'))

// Admin
const AdminDashboard = page(() => import('../pages/admin/Dashboard'))
const AdminCourses = page(() => import('../pages/admin/Courses'))
const CourseEditor = page(() => import('../pages/admin/CourseEditor'))
const AdminCategories = page(() => import('../pages/admin/Categories'))
const AdminInstructors = page(() => import('../pages/admin/Instructors'))
const AdminLearners = page(() => import('../pages/admin/Learners'))
const AdminLearnerDetail = page(() => import('../pages/admin/LearnerDetail'))
const AdminEnrollments = page(() => import('../pages/admin/Enrollments'))
const AdminAssessments = page(() => import('../pages/admin/Assessments'))
const AdminAssignments = page(() => import('../pages/admin/Assignments'))
const AdminReviews = page(() => import('../pages/admin/Reviews'))
const AdminDiscussions = page(() => import('../pages/admin/Discussions'))
const AdminAnnouncements = page(() => import('../pages/admin/Announcements'))
const AdminAnalytics = page(() => import('../pages/admin/Analytics'))
const AdminContent = page(() => import('../pages/admin/Content'))
const AdminSettings = page(() => import('../pages/admin/Settings'))
const AdminActivityLogs = page(() => import('../pages/admin/ActivityLogs'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Catalog />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructors/:instructorId" element={<InstructorProfile />} />
          <Route path="career-paths/*" element={<Navigate to="/courses" replace />} />
          <Route path="programs" element={<Programs />} />
          <Route path="business" element={<Business />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="help" element={<Help />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="certificates/:certId" element={<CertificateVerify />} />
          <Route path="services" element={<Services />} />
          <Route path="verify-certificate" element={<VerifyCertificate />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<GuestOnly><AuthLayout /></GuestOnly>}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="learn/course/:courseId/:lessonId?" element={<RequireRole role="learner"><CoursePlayer /></RequireRole>} />
        <Route path="learn" element={<RequireRole role="learner"><LearnerLayout /></RequireRole>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<LearnerDashboard />} />
          <Route path="my-learning" element={<MyLearning />} />
          <Route path="browse" element={<Catalog embedded />} />
          <Route path="saved" element={<Saved />} />
          <Route path="paths" element={<Navigate to="/learn/dashboard" replace />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="certificates/:certId" element={<CertificateView />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<LearnerSettings />} />
          <Route path="*" element={<NotFound embedded />} />
        </Route>

        <Route path="admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/new" element={<CourseEditor />} />
          <Route path="courses/:courseId/edit" element={<CourseEditor />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="instructors" element={<AdminInstructors />} />
          <Route path="learners" element={<AdminLearners />} />
          <Route path="learners/:userId" element={<AdminLearnerDetail />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="assessments" element={<AdminAssessments />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="discussions" element={<AdminDiscussions />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="activity-logs" element={<AdminActivityLogs />} />
          <Route path="*" element={<NotFound embedded />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
