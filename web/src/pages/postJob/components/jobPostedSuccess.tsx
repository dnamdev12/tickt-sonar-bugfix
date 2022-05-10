import React from 'react';

interface Proptypes {
    data: any;
    history: any
    editDetailPage: any;
    templateImage: any;
    stepCompleted: boolean;
    handleStepComplete: (data: any) => void;
    handleStepForward: (data: any) => void;
    handleStepBack: () => void;
}

const JobPostedSuccess = ({ history }: Proptypes) => {

    const redirectToSuccess = () => {
        history.push('/post-job-success');
    }

    return (
        <>
            {redirectToSuccess()}
        </>
    )
}

export default JobPostedSuccess;
