

import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import ProtectedRoute from '../Services/ProtectedRoute';
import PublicRoute from '../Services/PublicRoute';
import { useSelector } from 'react-redux';
import { LoadingOverlay, Loader } from '@mantine/core';

const FindJobsPage = lazy(() => import('./FindJobsPage'));
const JobPage = lazy(() => import('./JobPage'));
const ApplyJobPage = lazy(() => import('./ApplyJobPage'));
const FindTalentPage = lazy(() => import('./FindTalentPage'));
const TalentProfilePage = lazy(() => import('./TalentProfilePage'));
const CompanyPage = lazy(() => import('./CompanyPage'));
const CompaniesPage = lazy(() => import('./CompaniesPage'));
const MessagesPage = lazy(() => import('./MessagesPage'));
const JobHistoryPage = lazy(() => import('./JobHistoryPage'));
const PostedJobPage = lazy(() => import('./PostedJobPage'));
const PostJobPage = lazy(() => import('./PostJobPage'));
const SignUpPage = lazy(() => import('./SignUpPage'));
const HomePage = lazy(() => import('./HomePage'));
const AboutPage = lazy(() => import('./AboutPage'));
const PrivacyPage = lazy(() => import('./PrivacyPage'));
const TermsPage = lazy(() => import('./TermsPage'));
const SupportPage = lazy(() => import('./SupportPage'));
const ContactPage = lazy(() => import('./ContactPage'));
const FeedbackPage = lazy(() => import('./FeedbackPage'));
const FaqPage = lazy(() => import('./FaqPage'));
const AdminDashboardPage = lazy(() => import('./AdminDashboardPage'));
const AdminLoginPage = lazy(() => import('./AdminLoginPage'));
const ProfilePage = lazy(() => import('./ProfilePage'));
const Unauthorized = lazy(() => import('./UnauthroizedPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));

const AppRoutes = () => {
  const overlay = useSelector((state: any) => state.overlay);
  return <HelmetProvider><BrowserRouter>
    <div className='relative overflow-hidden'>
      {overlay && <div className='fixed !z-[2000] w-full h-full flex  items-center justify-center'>
        <LoadingOverlay
          visible={overlay}
          zIndex={2000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'brightSun.4', type: 'bars' }}
        />

      </div>}
      <Header />
      <Suspense fallback={<div className="h-[90vh] w-full flex justify-center items-center bg-mine-shaft-950"><Loader color="brightSun.4" size="lg" /></div>}>
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/find-jobs' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><FindJobsPage /></ProtectedRoute>} />
        <Route path='/jobs/:id' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><JobPage /></ProtectedRoute>} />
        <Route path='/apply-job/:id' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN']}><ApplyJobPage /></ProtectedRoute>} />
        <Route path='/companies' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><CompaniesPage /></ProtectedRoute>} />
        <Route path='/messages' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><MessagesPage /></ProtectedRoute>} />
        <Route path='/find-talent' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><FindTalentPage /></ProtectedRoute>} />
        <Route path='/talent-profile/:id' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><TalentProfilePage /></ProtectedRoute>} />
        <Route path='/company/:name' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><CompanyPage /></ProtectedRoute>} />
        <Route path='/job-history' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN']}><JobHistoryPage /></ProtectedRoute>} />
        <Route path='/posted-jobs/:id' element={<ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}><PostedJobPage /></ProtectedRoute>} />
        <Route path='/post-job/:id' element={<ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}><PostJobPage /></ProtectedRoute>} />
        <Route path='/signup' element={<PublicRoute><SignUpPage /></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><SignUpPage /></PublicRoute>} />
        <Route path='/profile' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN', 'EMPLOYER']}><ProfilePage /></ProtectedRoute>} />
        <Route path='/admin/dashboard' element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path='/admin/login' element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
        
        {/* Static & Dynamic Footer Pages */}
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/privacy' element={<PrivacyPage />} />
        <Route path='/terms' element={<TermsPage />} />
        <Route path='/support' element={<SupportPage />} />
        <Route path='/feedback' element={<FeedbackPage />} />
        <Route path='/faqs' element={<FaqPage />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      <Footer />
    </div>
  </BrowserRouter></HelmetProvider>
}
export default AppRoutes;