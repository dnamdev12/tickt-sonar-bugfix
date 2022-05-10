import React, { useState, useEffect } from 'react'
import milestonesPlaceholder from '../../assets/images/Job milestones-preview.png';
import { renderTimeWithCustomFormat } from '../../utils/common';
import { ChooseJob, InviteForJob, invitedJobIds, CancelInviteForJob } from '../../redux/jobs/actions';
import { withRouter } from 'react-router-dom';

const ChooseTheJob = (props: any) => {
    const [editItem, setEditItems] = useState<{ [index: string]: any }>({});
    const [stateData, setStateData] = useState([]);

    const checkOnClick = (e: any, index: any) => {
        if(editItem[index]){
            setEditItems({});
            return
        }
        setEditItems(() => ({ [index]: e.target.checked }));
    }

    useEffect(() => {
        preFetch();
    }, [])

    const preFetch = async () => {
        const { tradieId, cancelJob } = props?.location?.state;
        if (cancelJob) {
            let response = await invitedJobIds({ tradieId, page: 1 });
            if (response?.success) {
                setStateData(response.data);
            }
        } else {
            let response = await ChooseJob({ page: 1 });
            if (response?.success) {
                setStateData(response.data);
            }
        }
    }

    useEffect(() => {
        console.log('Here!=====>', { editItem });
    }, [editItem]);

    const handleSubmit = async () => {
        const { tradieId, path, cancelJob } = props?.location?.state;
        let key: any = '';
        if (Object.keys(editItem).length) {
            key = Object.keys(editItem)[0];
        }

        let data: any = { tradieId: tradieId, jobId: key }
        if (!cancelJob) {
            let response = await InviteForJob(data);
            if (response.success) {
                props.history.push('/choose-the-job-success');
            }
        } else {
            let filter: any = stateData.find((item: any) => item.jobId === key);
            if (filter?.invitationId) {
                data['invitationId'] = filter?.invitationId;
                let response = await CancelInviteForJob(data);
                if (response.success) {
                    props.history.push(`/tradie-info${path}`);
                }
            }
        }
    }

    const {  path, cancelJob } = props?.location?.state;
    return (
        <div className="app_wrapper">
            <div className="section_wrapper">
                <div className="custom_container">
                    <div className="form_field">
                        <div className="flex_row">
                            <div className="flex_col_sm_5">

                                <React.Fragment>
                                    <div className="relate">
                                        <button
                                            className="back"
                                            onClick={() => {
                                                props.history.push(`/tradie-info${path}`)
                                            }}
                                        >
                                        </button>
                                        <span className="title">
                                            {'Choose the job'}
                                        </span>
                                    </div>
                                </React.Fragment>
                            </div>
                        </div>
                    </div>

                    <div className="flex_row">
                        <div className="flex_col_sm_5">
                            <ul className={`milestones`}>
                                {stateData?.length > 0 ?
                                    stateData.map((item: any, index: any) => (
                                        <li key={index}>
                                            <div className="checkbox_wrap agree_check">
                                                <input
                                                    checked={editItem[item?.jobId] == true ? true : false}
                                                    onChange={(e: any) => { checkOnClick(e, item?.jobId) }}
                                                    className="filter-type filled-in"
                                                    type="checkbox"
                                                    id={`milestone${index}`} />
                                                <label
                                                    htmlFor={`milestone${index}`}>
                                                    {`${item?.tradeName}`}
                                                </label>
                                                <div className="info">
                                                    <span>{item?.jobName}</span>
                                                    <span>
                                                        {renderTimeWithCustomFormat(
                                                            item?.fromDate,
                                                            item?.toDate,
                                                            '',
                                                            ['DD MMM', 'DD MMM YY']
                                                        )}
                                                    </span>
                                                    <span>
                                                        {`${item?.jobDescription.substring(0, 120)} ${item?.jobDescription?.length > 120 ? '...' : ''}`}</span>
                                                </div>
                                            </div>
                                        </li>
                                    )) : (
                                        <figure className="placeholder_img">
                                            <img
                                                src={milestonesPlaceholder}
                                                alt="milestones-placeholder"
                                            />
                                        </figure>
                                    )}


                                <div style={{ marginTop: '50px' }} className="form_field">
                                    <button
                                        onClick={handleSubmit}
                                        className={`fill_btn full_btn btn-effect ${!Object.keys(editItem).length ? 'disable_btn' : ''}`}>
                                        {`${cancelJob ? 'Cancel' : ''} Invite `}
                                    </button>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ChooseTheJob);
