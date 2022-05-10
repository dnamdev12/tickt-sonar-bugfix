// 1 --> tradie | 2 --> builder
const USER_TYPE = 2;

const OTP_TIMER = 60;

const errorStrings: any = {
    fullNameEmpty: 'Full Name is required',
    fullNameErr: 'Please enter a valid name',
    fullNameShortErr: 'Name must have minimum 3 letters',
    companyNameEmpty: 'Company Name is required',
    companyNameErr: 'Please enter a valid company name',
    businessNameEmpty: 'Business Name is required',
    businessNameErr: 'Please enter a valid business name',
    companyNameShortErr: 'Company Name must have minimum 3 letters',
    positionNameEmpty: 'Position is required',
    positionNameErr: 'Please enter a valid position',
    positionNameShortErr: 'Position must have minimum 3 letters',
    emailEmpty: 'Email Address is required',
    emailExist: 'Email Address already in use',
    emailErr: 'Please enter valid Email Address',
    tncEmpty: 'Please accept privacy policy and terms & conditions',
    phoneNumberEmpty: 'Phone Number is required',
    phoneNumberErr: 'Please enter correct Phone Number',
    phoneNumberExist: 'Phone Number already in use',
    abnEmpty: 'ABN is required',
    abnErr: 'Please enter correct ABN',
    abnExist: 'ABN already in use',
    password: 'Password is required',
    oldPassword: 'Old Password is required',
    passwordInvalid: 'Invalid password',
    passwordError: 'Password must be 8 characters long and must include atleast one uppercase, one lowercase letter, one numeric and one special character',
    confirmNewPassword: 'New Password and confirm New Password doesn\'t match',
    otpEmpty: 'OTP is required',
    otpIncorrect: 'Please enter a valid OTP',
    sphereEmpty: 'Please select your trade',
    specializationEmpty: 'Please select your specialization',
    pleaseEnter: 'Please enter ',
    pleaseSelect: 'Please select',
    bannerSearchJob: 'Please Select Job Type from the List',
    bannerSearchJobError: 'Please search valid job name',
    bannerSearchJobEmpty: 'Job Type is required',
    bannerSearchLocation: 'Please select location from the list',
    maxBudgetEmpty: 'Budget is required',
    maxBudgetError: 'Budget have maximum two decimal values',
    askQuestion: 'Question is required',
    askReview: 'Review is required',
    askReply: 'Reply is required',
    JobName: 'Job Name is required',
    JobDescription: 'Job Description is required',
}
interface Types {
    [key: string]: any | string;
}

const SocialAuth: Types = {
    GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    GOOGLE_SECRET_KEY: process.env.REACT_APP_GOOGLE_SECRET_KEY,
    GOOGLE_GEOCODE_KEY: process.env.REACT_APP_GOOGLE_GEOCODE_KEY,
}

const LinkedInAuth: Types = {
    REDIRECT_URI: `${window.location.origin}/linkedin`,
    CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
    CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET,
}

const BasicAuthorizationToken = process.env.REACT_APP_BASIC_AUTHORIZATION_TOKEN;
const FirebasePushServiceKey = process.env.REACT_APP_FIREBASE_PUSH_SERVICE_KEY;
const FcmHeaderAuthorizationKey = process.env.REACT_APP_FCM_AUTHORIZATION;

const qaStgFirebaseConfig: Types = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};


export const MoEConstants: any = {
    LOG_OUT: 'Log Out',
    APP_OPEN: 'App Open',
    SIGN_UP: 'Sign Up',
    SEARCHED_FOR_TRADIES: 'Searched for tradies',
    VIEWED_TRADIE_PROFILE: 'Viewed tradie profile',
    POSTED_A_JOB: 'Posted a job',
    VIEW_QUOTE: 'View Quote',
    ACCEPT_QUOTE: 'Accept quote',
    CANCEL_QUOTED_JOB: 'Cancel quoted job',
    MILESTONE_CHECKED_AND_APPROVED: 'Milestone Checked and approved',
    MADE_PAYMENT: 'Made Payment',
    MILESTONE_DECLINED: 'Milestone declined',
    SAVED_TRADIE:'Saved tradie',
    CHAT: 'Chat',
    VIEWED_REVIEWS: 'Viewed reviews',
    LEFT_VOUCHER: 'Left voucher',
    PAYMENT_SUCCESS: 'Payment success',
    PAYMENT_FAILURE: 'Payment failure',
    EDIT_MILESTONES: 'Edit milestones',
    CANCEL_JOB: 'Cancel job',
    REPUBLISHED_JOB: 'Republished job',
    ADDED_INFO_ABOUT_COMPANY: 'Added info about company',
    ADDED_PORTFOLIO: 'Added portfolio',
    ADDED_PAYMENT_DETAILS: 'Added payment details',
    SEARCHED_FOR_JOBS: 'Searched for jobs',
    VIEWED_BUILDER_PROFILE: 'Viewed builder profile',
    QUOTED_A_JOB: 'Quoted a job',
    ASKED_A_QUESTION: 'Asked a question',
    APPLIED_FOR_A_JOB: 'Applied for a job',
    MILESTONE_COMPLETED: 'Milestone completed',
    VIEWED_APPROVED_MILESTONE: 'Viewed approved milestone',
    ADDED_REVIEW: 'Added review',
    ACCEPT_CANCELLATION: 'Accept cancellation',
    REJECT_CANCELLATION: 'Reject Cancellation',
}

export default {
    errorStrings,
    OTP_TIMER,
    USER_TYPE,
    SocialAuth,
    LinkedInAuth,
    BasicAuthorizationToken,
    FirebasePushServiceKey,
    qaStgFirebaseConfig,
    FcmHeaderAuthorizationKey,
}