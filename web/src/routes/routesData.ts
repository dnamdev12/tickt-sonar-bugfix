import React from 'react';
// @ts-ignore
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';

const Home = React.lazy(() => import('../pages/home/home'));
const Login = React.lazy(() => import('../pages/login/login'));
const NotFound = React.lazy(() => import('../pages/notFound/notFound'));
const Signup = React.lazy(() => import('../pages/signup'));
const ForgerPassword = React.lazy(() => import('../pages/forgetPassword/forgetPassword'));
const PostJob = React.lazy(() => import('../pages/postJob'));
const SavedJobs = React.lazy(() => import('../pages/savedJobs/index'));
const RecommendedJobs = React.lazy(() => import('../pages/recommendedJobs/index'));
const MostViewedJobs = React.lazy(() => import('../pages/mostViewedJobs/index'));
const TradieSearchJobResult = React.lazy(() => import('../pages/tradieSearchJobResult/index'));
const PopularBuilders = React.lazy(() => import('../pages/popularBuilders/index'));
const JobDetailsPage = React.lazy(() => import('../pages/jobDetailsPage/index'));
const JobAppliedSuccessfully = React.lazy(() => import('../pages/jobDetailsPage/components/jobAppliedSuccess'));

const JobDashboard = React.lazy(() => import('../pages/jobDashboard'));
const TradieListData = React.lazy(() => import('../pages/shared/tradieListData'));
const SearchResultTradie = React.lazy(() => import('../pages/searchTradieResult/index'));
const builderJobDasboard = React.lazy(() => import('../pages/builderJobDasboard/index'));
const TradieDetails = React.lazy(() => import('../common/tradieDetails'));
const BuilderInfo = React.lazy(() => import('../pages/builderInfo/index'));
const BuilderReviewSubmitted = React.lazy(() => import('../pages/jobDashboard/components/reviewBuilder/builderReviewSubmitted'));
const TradieInfo = React.lazy(() => import('../pages/tradieInfo'));
const BuilderPostedJobs = React.lazy(() => import('../pages/builderInfo/builderPostedJobs'));
const JobDetailsPageBuilder = React.lazy(() => import('../pages/jobDetailsPageBuilder/index'));
const TradieEditProfile = React.lazy(() => import('../pages/tradieEditProfile'));
const EmailUpdatedSuccess = React.lazy(() => import('../pages/tradieEditProfile/components/personalInformation/changeEmailModal/components/successPage'));
const RateSuccessTradie = React.lazy(() => import('../pages/builderJobDasboard/components/rateSuccess'));
const TradieVouchers = React.lazy(() => import('../pages/tradieInfo/vouchers'));

const LodgeSuccess = React.lazy(() => import('../pages/builderJobDasboard/components/lodgeDispute/success'));
const CancelJobSuccess = React.lazy(() => import('../pages/builderJobDasboard/components/cancelJobs/success'));

const ChooseTheJob = React.lazy(() => import('../pages/chooseTheJob/index'));
const ChooseJobToStartChat = React.lazy(() => import('../pages/chooseJobToStartChat/chooseJobToStartChat'));
const ChooseJobSuccess = React.lazy(() => import('../pages/chooseTheJob/success'));

const MilestoneRequestSentSuccess = React.lazy(() => import('../pages/builderJobDasboard/components/editMilestones/sucess'));
const RequestMonitored = React.lazy(() => import('../pages/jobDetailsPage/components/requestMonitored'));
const ChangePasswordSuccess = React.lazy(() => import('../pages/tradieEditProfile/components/personalInformation/changePasswordSuccess'));
const NeedApprovalSuccess = React.lazy(() => import('../pages/builderJobDasboard/components/confirmAndPay/suceess'));
const declineMilestoneSuccess = React.lazy(() => import('../pages/builderJobDasboard/components/declineMilestoneSuccess'));

const PostJobSuccess = React.lazy(() => import('../pages/postJob/sucess'));
const CommonViewAll = React.lazy(() => import('../pages/home/builderHome/components/commonViewAll'));

const ChatComponent = React.lazy(() => import('../pages/chat'));
const SupportChat = React.lazy(() => import('../pages/tradieEditProfile/components/supportChat'));
const PaymentHistory = React.lazy(() => import('../pages/paymentHistory'));

const TemplateSavedSuccess = React.lazy(() => import('../pages/postJob/components/templateSavedSucess'));
const GuestPage = React.lazy(() => import('../pages/home/guestHome'));
const AdminAnnouncementPage = React.lazy(() => import('../pages/adminAnnouncementPage/adminAnnouncementPage'));

const QuoteSuccess = React.lazy(() => import('../pages/jobDashboard/components/quoteJobs/success'));
const QuoteSuccessBuilder = React.lazy(() => import('../pages/builderJobDasboard/components/quoteJobs/quoteSuccess'));

const DocViewerComponent = React.lazy(() => import('../pages/shared/DocViewer'));
const quoteJobCancel = React.lazy(() => import('../pages/builderJobDasboard/components/quoteJobs/quoteJobCancel'));

const IDSuccess = React.lazy(() => import('../pages/tradieEditProfile/components/idSuccess'));
const routes = [
    {
        name: 'main',
        path: '/',
        component: Home,
        authRoute: false,
        privateRoute: true,
        exact: true,
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
        authRoute: true,
        privateRoute: false,
    },
    {
        name: 'signup',
        path: '/signup',
        component: Signup,
        authRoute: true,
        privateRoute: false,
    },
    {
        name: 'forgetpassword',
        path: '/reset-password',
        component: ForgerPassword,
        authRoute: true,
    },
    {
        name: 'guest-user',
        path: '/guest-user',
        component: GuestPage,
    },
    {
        name: 'postnewjob',
        path: '/post-new-job',
        component: PostJob,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'recommendedjobs',
        path: '/recommended-jobs',
        component: RecommendedJobs,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'savedjobs',
        path: '/saved-jobs',
        component: SavedJobs,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'template-suceess',
        path: '/template-sucess',
        component: TemplateSavedSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'view-all',
        path: [
            '/saved-tradespeople',
            '/popular-tradespeople',
            '/recommended-tradespeople',
            '/most-viewed-tradespeople'
        ],
        component: CommonViewAll,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'mostviewedjobs',
        path: '/most-viewed-jobs',
        component: MostViewedJobs,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'milestoneRequestSent',
        path: '/milestone-request-sent-success',
        component: MilestoneRequestSentSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'decline-milestone-success',
        path: '/decline-milestone-success',
        component: declineMilestoneSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'requestMonitered',
        path: '/request-monitored/:id',
        component: RequestMonitored,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'changePasswordSuccess',
        path: '/change-password-success',
        component: ChangePasswordSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'popularbuilders',
        path: '/popular-builders',
        component: PopularBuilders,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'searchjobresults',
        path: '/search-job-results',
        component: TradieSearchJobResult,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'quoteJobSuccess',
        path: '/quote-job-success',
        component: QuoteSuccess,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'quoteJobSuccess',
        path: '/quote-job-accepted',
        component: QuoteSuccessBuilder,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'quoteJobCancel',
        path: '/quote-job-cancel',
        component: quoteJobCancel,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'jobdetailspage',
        path: '/job-details-page',
        component: JobDetailsPage,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'jobdetail',
        path: '/job-detail',
        component: JobDetailsPageBuilder,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'job-applied-successfully',
        path: '/job-applied-successfully',
        component: JobAppliedSuccessfully,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'ratesuccess',
        path: '/rate-success',
        component: RateSuccessTradie,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'lodgesuccess',
        path: '/lodge-success',
        component: LodgeSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'cancelsuccess',
        path: '/cancel-job-success',
        component: CancelJobSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'postJobSuccess',
        path: '/post-job-success',
        component: PostJobSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'builderinfo',
        path: '/builder-info',
        component: BuilderInfo,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'tradieinfo',
        path: '/tradie-info',
        component: TradieInfo,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'tradievouchers',
        path: '/tradie-vouchers',
        component: TradieVouchers,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'chooseTheJob',
        path: ['/choose-the-job', '/cancel-the-job'],
        component: ChooseTheJob,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'chooseJobToStartChat',
        path: '/choose-job-to-start-chat',
        component: ChooseJobToStartChat,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'needApprovalSuccess',
        path: '/need-approval-success',
        component: NeedApprovalSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'chooseTheJob',
        path: '/choose-the-job-success',
        component: ChooseJobSuccess,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'jobdashboard',
        path: [
            '/active-jobs',
            '/active-quote-job',
            '/applied-jobs',
            '/past-jobs',
            '/new-jobs',
            '/quote-job',
            '/approved-milestones',
            '/mark-milestone',
            '/review-builder',
        ],
        component: JobDashboard,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'builderreviewsubmitted',
        path: '/builder-review-submitted',
        component: BuilderReviewSubmitted,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'builderpostedjobs',
        path: '/builder-posted-jobs',
        component: BuilderPostedJobs,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'update-user-info',
        path: '/update-user-info',
        component: TradieEditProfile,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'id-verification-success',
        path: '/id-verification-success',
        component: IDSuccess,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'email-updated-successfully',
        path: '/email-updated-successfully',
        component: EmailUpdatedSuccess,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'linkedin-oauth',
        path: '/linkedin',
        component: LinkedInPopUp
    },
    {
        name: 'builder-jobs',
        path: '/jobs',
        component: builderJobDasboard,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'recommended-trade-people',
        path: '/recommended-trade-people',
        component: TradieListData,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'saved-trade-people',
        path: '/saved-trade-people',
        component: TradieListData,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'tradie-details',
        path: '/tradie-details',
        component: TradieDetails,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'chat',
        path: '/chat',
        component: ChatComponent,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'support-chat',
        path: '/support-chat',
        component: SupportChat,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'search-builder-result',
        path: '/search-builder-result',
        component: TradieListData,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'search-tradie-results',
        path: '/search-tradie-results',
        component: SearchResultTradie,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'payment-history',
        path: '/payment-history',
        component: PaymentHistory,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'admin-announcement-page',
        path: '/admin-announcement-page',
        component: AdminAnnouncementPage,
        authRoute: false,
        privateRoute: true,
    },
    {
        name: 'doc-view',
        path: '/doc-view',
        component: DocViewerComponent,
        authRoute: false,
        privateRoute: true
    },
    {
        name: 'notFound',
        path: '/404',
        component: NotFound,
        authRoute: false,
        privateRoute: true
    },
    {
        name: '404',
        path: '/*',
        redirectTO: '/404'
    },
]

export default routes;
