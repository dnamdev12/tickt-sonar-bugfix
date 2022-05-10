const ACTIVE_HOST = process.env.REACT_APP_BASE_URL;

const versions = {
    v1: 'v1/',
}

const ServiceEnum = {
    auth: 'auth/',
    admin: 'admin/',
    job: 'job/',
    home: 'home/',
    profile: 'profile/',
    builder: 'builder/',
    tradie: 'tradie/',
    payment: 'payment/',
    quote: 'quote/'
}

const Urls = {
    signup: `${versions.v1}${ServiceEnum.auth}signup`,
    login: `${versions.v1}${ServiceEnum.auth}login`,
    logout: `${versions.v1}${ServiceEnum.auth}logout`,
    resendOtp: `${versions.v1}${ServiceEnum.auth}resendEmailOtp`,
    resendMobileOtp: `${versions.v1}${ServiceEnum.auth}resendMobileOtp`,
    checkEmailId: `${versions.v1}${ServiceEnum.auth}checkEmailId`,
    checkMobileNumber: `${versions.v1}${ServiceEnum.auth}checkMobileNumber`,
    verifyOTP: `${versions.v1}${ServiceEnum.auth}verifyOTP`,
    verifyMobileOTP: `${versions.v1}${ServiceEnum.auth}verifyMobileOtp`,
    createPassword: `${versions.v1}${ServiceEnum.auth}createPassword`,
    tradeList: `${versions.v1}${ServiceEnum.auth}tradeList`, //admin
    forgotPassword: `${versions.v1}${ServiceEnum.auth}forgot_password`,
    checkSocialId: `${versions.v1}${ServiceEnum.auth}checkSocialId`,
    SocialAuth: `${versions.v1}${ServiceEnum.auth}socialAuth`,
    upload: `${versions.v1}upload`,
    linkedInAuth: `${versions.v1}${ServiceEnum.auth}linkedInAuth`,
    jobCategories: `${versions.v1}${ServiceEnum.auth}jobType`,
    milestones: `${versions.v1}${ServiceEnum.job}tempMilestoneList`,
    getSearchData: `${versions.v1}${ServiceEnum.admin}getSearchData`, //admin
    getRecentSearch: `${versions.v1}${ServiceEnum.admin}getRecentSearch`, //admin
    getRecentLocation: `${versions.v1}${ServiceEnum.admin}getRecentLocation`, //admin
    jobTypeList: `${versions.v1}${ServiceEnum.auth}jobTypeList`, //admin
    jobType: `${versions.v1}${ServiceEnum.auth}jobType`, //admin
    home: `${versions.v1}${ServiceEnum.home}`,
    homeSearch: `${versions.v1}${ServiceEnum.home}search`,
    profileTemplateList: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}templatesList`,
    createTemplate: `${versions.v1}${ServiceEnum.job}createTemplate`,
    createJob: `${versions.v1}${ServiceEnum.job}create`, // create job (post job)
    viewNearByJob: `${versions.v1}${ServiceEnum.home}viewNearByJob`,
    homeJobDetails: `${versions.v1}${ServiceEnum.home}jobDetails`,
    homeApplyJob: `${versions.v1}${ServiceEnum.home}apply`,
    homeSaveJob: `${versions.v1}${ServiceEnum.home}saveJob`,
    profileTradie: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}`,
    askQuestion: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}askQuestion`,
    deleteQuestion: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}deleteQuestion`,
    updateQuestion: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}updateQuestion`,
    activeJobList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}activeJobList`,
    appliedJobList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}appliedJobList`,
    pastJobList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}pastJobList`,
    newJobList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}newJobList`,
    approvedMilestoneList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}approveMilestoneList`,
    activeJobListBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}activeJobList`, //active-job-list (builder)
    OpenJobLisBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}openJobList`, //open-job-list (builder)
    pastJobListBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}pastJobList`,  //past-job-list (builder)
    newApplicantsBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}newApplicants`, //new-applicants (builder)
    newJobApplicationListBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}newJobApplicationList`, //new-job-application-list (builder)
    needApprovalBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}needApproval`, //new-approval (builder)
    jobDetailsBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}jobDetails`, //job-details (builder)
    milestoneList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}milestoneList`,
    markComplete: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}markComplete`,
    addBankDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}addBankDetails`,
    updateBankDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}updateBankDetails`,
    getBankDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}getBankDetails`,
    removeBankDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}removeBankDetails`,
    reviewBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}reviewBuilder`,
    getBuildersJob: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}getBuildersJob`,
    updateReviewBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}updateReviewBuilder`,
    removeReviewBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}removeReviewBuilder`,
    builderProfile: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}builderProfile`,
    deleteRecentSearch: `${versions.v1}${ServiceEnum.admin}deleteRecentSearch`, //admin
    tradieReviewList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}reviewList`,
    builderProfileReviewList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}reviewList`,
    tradieQuestionList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}questionList`,
    tradieReviewReply: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}reviewReply`,
    tradieUpdateReviewReply: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}updateReviewReply`,
    tradieRemoveReviewReply: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}removeReviewReply`,
    tradieProfile: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}tradieProfile`,
    tradieProfileView: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}view`,
    getTradieBasicDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}getBasicDetails`,
    tradieEditBasicDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}editBasicDetails`,
    tradieUpdateProfileDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}editProfile`,
    tradieAddPortfolioJob: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}addPortfolio`,
    tradieUpdatePortfolioJob: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}editPortfolio`,
    tradieDeletePortfolioJob: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}deletePortfolio`,
    tradieChangePassword: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}changePassword`,
    replyChangeRequest: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}replyChangeRequest`,
    acceptDeclineJobInvitation: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}acceptDeclineInvitation`,
    replyCancellation: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}replyCancellation`,
    tradieChangeEmail: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}changeEmail`,
    verifyEmailOtp: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}verifyEmail`,
    jobDetailsTradie: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}jobDetails`,
    reviewList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}reviewList`,
    tradieProfileReviewList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}reviewList`,
    acceptDeclineRequest: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}acceptDeclineRequest`,
    milestoneListBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}milestoneList`,
    milestoneDetails: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}milestoneDetails`,
    milestoneApproveDecline: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}milestoneApproveDecline`,
    questionList: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}questionList`,
    answerQuestion: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}answer`,
    askNestedQuestion: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}answer`,
    updateAnswer: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}updateAnswer`,
    deleteAnswer: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}deleteAnswer`,
    reviewReply: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}reviewReply`,
    updateReviewReply: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}updateReviewReply`,
    removeReviewReply: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}removeReviewReply`,
    needApproval: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}needApproval`,
    reviewTradie: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}reviewTradie`,
    jobBuilder: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}`,
    tradieProfileVoucher: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}getVoucher`,
    tradieLodgeDispute: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}lodgeDispute`,
    tradieCancelJob: `${versions.v1}${ServiceEnum.job}${ServiceEnum.tradie}cancelJob`,
    jobHome: `${versions.v1}${ServiceEnum.home}`,
    job: `${versions.v1}${ServiceEnum.job}`,
    quote: `${versions.v1}${ServiceEnum.quote}`,
    profile: `${versions.v1}${ServiceEnum.profile}`,
    builder: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}`,
    builderProfileView: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}view`,
    getBuilderBasicDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}getBasicDetails`,
    builderChangePassword: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}changePassword`,
    builderEditBasicDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}editBasicDetails`,
    builderAddPortfolioJob: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}addPortfolio`,
    builderUpdatePortfolioJob: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}editPortfolio`,
    builderDeletePortfolioJob: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}deletePortfolio`,
    builderUpdateProfileDetails: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}editProfile`,
    builderChangeEmail: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}changeEmail`,
    republishJob: `${versions.v1}${ServiceEnum.job}republishJob`,
    publishJobAgain: `${versions.v1}${ServiceEnum.job}${ServiceEnum.builder}publishJobAgain`,
    getAllPostedJobs: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}getAllJobs`,
    payment: `${versions.v1}${ServiceEnum.payment}`,
    getStripeClientSecretKey: `${versions.v1}${ServiceEnum.payment}createClientSecretKey`,
    saveStripeTransaction: `${versions.v1}${ServiceEnum.payment}saveTransaction`,
    notification: `${versions.v1}${ServiceEnum.home}notification`,
    addFCMNotifToken: `${versions.v1}${ServiceEnum.auth}addDeviceToken`,
    tradieSavedJobs: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}getSavedJobs`,
    tradieSettings: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}getSettingsData`,
    builderSettings: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}getSettingsData`,
    tradieUpdateSettings: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}settings`,
    builderUpdateSettings: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.builder}settings`,
    privacyPolicy: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}privacyPolicy`,
    tnc: `${versions.v1}${ServiceEnum.profile}${ServiceEnum.tradie}tnc`,
    tncWeb: `tncWeb`,
    privacyPolicyWeb: `privacyPolicyWeb`,
    getPopularBuilder: `${versions.v1}${ServiceEnum.home}getPopularBuilder`, //Admin
    unReadNotification: `${versions.v1}${ServiceEnum.home}unReadNotification`, //Admin
    getMostViewedJobs: `${versions.v1}${ServiceEnum.home}mostViewedJobs`, //Admin
    getRecommendedJobs: `${versions.v1}${ServiceEnum.home}recommendedJobs`, //Admin
    getChatJobList: `${versions.v1}${ServiceEnum.job}jobList`, //Admin
    getAdminNotificationData: `${versions.v1}${ServiceEnum.home}notification/admin`, //Admin
}

export const urlFor = (service: string): string => {
    return `${ACTIVE_HOST}/${service}`;
};

export default Urls;
