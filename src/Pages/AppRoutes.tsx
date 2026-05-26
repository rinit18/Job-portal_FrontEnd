

import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from '../Components/AnimatedPage';
import { HelmetProvider } from 'react-helmet-async';
import Header from '../Components/Header/Header';
import BottomNav from '../Components/Header/BottomNav';
import ScrollToTop from '../Components/ScrollToTop';
import ErrorBoundary from '../Components/ErrorBoundary';
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
const GlobalSearchPage = lazy(() => import('./GlobalSearchPage'));
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
const SettingsPage = lazy(() => import('./SettingsPage'));
const Unauthorized = lazy(() => import('./UnauthroizedPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));
const ProfessionalsPage = lazy(() => import('./ProfessionalsPage'));

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<AnimatedPage><HomePage /></AnimatedPage>} />
        <Route path='/unauthorized' element={<AnimatedPage><Unauthorized /></AnimatedPage>} />
        <Route path='/find-jobs' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><FindJobsPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/jobs/:id' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><JobPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/apply-job/:id' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN']}><AnimatedPage><ApplyJobPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/companies' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><CompaniesPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/messages' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><MessagesPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/search' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><GlobalSearchPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/network' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><FindTalentPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/professionals' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><ProfessionalsPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/user/:id' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><TalentProfilePage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/company/:name' element={<ProtectedRoute allowedRoles={['APPLICANT', 'EMPLOYER', 'ADMIN']}><AnimatedPage><CompanyPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/job-history' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN']}><AnimatedPage><JobHistoryPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/posted-jobs/:id' element={<ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}><AnimatedPage><PostedJobPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/post-job/:id' element={<ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}><AnimatedPage><PostJobPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/signup' element={<PublicRoute><AnimatedPage><SignUpPage /></AnimatedPage></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><AnimatedPage><SignUpPage /></AnimatedPage></PublicRoute>} />
        <Route path='/profile' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN', 'EMPLOYER']}><AnimatedPage><ProfilePage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/settings' element={<ProtectedRoute allowedRoles={['APPLICANT', 'ADMIN', 'EMPLOYER']}><AnimatedPage><SettingsPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/admin/dashboard' element={<ProtectedRoute allowedRoles={['ADMIN']}><AnimatedPage><AdminDashboardPage /></AnimatedPage></ProtectedRoute>} />
        <Route path='/admin/login' element={<PublicRoute><AnimatedPage><AdminLoginPage /></AnimatedPage></PublicRoute>} />
        
        {/* Static & Dynamic Footer Pages */}
        <Route path='/about' element={<AnimatedPage><AboutPage /></AnimatedPage>} />
        <Route path='/contact' element={<AnimatedPage><ContactPage /></AnimatedPage>} />
        <Route path='/privacy' element={<AnimatedPage><PrivacyPage /></AnimatedPage>} />
        <Route path='/terms' element={<AnimatedPage><TermsPage /></AnimatedPage>} />
        <Route path='/support' element={<AnimatedPage><SupportPage /></AnimatedPage>} />
        <Route path='/feedback' element={<AnimatedPage><FeedbackPage /></AnimatedPage>} />
        <Route path='/faqs' element={<AnimatedPage><FaqPage /></AnimatedPage>} />

        <Route path='*' element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

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
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>
      </Suspense>
      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  </BrowserRouter></HelmetProvider>
}
export default AppRoutes;