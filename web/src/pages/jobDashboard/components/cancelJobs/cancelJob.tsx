import { useState } from 'react';
import { tradieCancelJob } from '../../../../redux/jobs/actions';
//@ts-ignore
import FsLightbox from 'fslightbox-react';
import { JobCancelReasons } from '../../../../utils/common';
import { moengage, mixPanel } from '../../../../services/analyticsTools';
import { MoEConstants } from '../../../../utils/constants';


interface PropTypes {
    item: any,
    history: any,
    backTab: (data: string) => void,
}

const LodgeDispute = (props: PropTypes) => {
    const { item: { jobId, jobName }, history } = props;
    const [stateData, setStateData] = useState({ reason: 0, detail: '', upload: [] });
    const [errorData, setErrorData] = useState({ reason: '', detail: '', upload: '' });
    const [filesUrl, setFilesUrl] = useState([] as any);
    const [toggler, setToggler] = useState(false);
    const [selectedSlide, setSelectSlide] = useState(1);


    const { reason, detail } = stateData;

    const isValid = ({ name, value, title }: any) => {
        if (name === 'reason') {
            return value === 0 ? `${title} is required.` : '';
        }
        return !value?.length ? `${title} is required.` : '';
    }

    const checkErrors = () => {
        let error_1 = isValid({ name: 'reason', value: reason, title: 'Reason' });
        if (!error_1?.length) {
            return false;
        }
        return true;
    }


    const handleSubmit = async () => {
        let data: any = {
            jobId: jobId,
            reason: reason,
            note: detail,
        }
        if (!data.note) delete data.note;
        let response: any = await tradieCancelJob(data);
        if (response?.success) {
            const mData = {
                timeStamp: moengage.getCurrentTimeStamp(),
            }
            moengage.moE_SendEvent(MoEConstants.CANCEL_JOB, mData);
            mixPanel.mixP_SendEvent(MoEConstants.CANCEL_JOB, mData);
            history.push('/cancel-job-success');
        }
    }


    const commonRenderValues = ({ id }: any) => {
        return (
            <div className="checkbox_wrap agree_check">
                <input
                    value={reason}
                    onClick={() => { setStateData((prev: any) => ({ ...prev, reason: id })) }}
                    checked={reason === id}
                    name="Reason" className="filter-type filled-in" type="checkbox" id={`reason${id}`} />
                <label htmlFor={`reason${id}`}>
                    {JobCancelReasons(id)}
                </label>
            </div>
        )
    }

    const renderFilteredItems = () => {
        let sources: any = [];
        let types: any = [];

        if (filesUrl?.length) {
            filesUrl.forEach((item: any) => {
                if (item?.mediaType === 1) {
                    sources.push(item.link);
                    types.push('image');
                }
            })
        }

        return { sources, types };
    }

    const { sources, types } = renderFilteredItems();
    return (
        <div className="detail_col">
            <div className="flex_row">
                <div className="flex_col_sm_8">
                    <div className="relate">
                        <button
                            onClick={() => { props.backTab('cancel') }}
                            className="back"></button>
                        <span className="xs_sub_title">
                            {jobName || ''}
                        </span>
                    </div>

                    <span className="sub_title">
                        {'Your reason for canceling job'}
                    </span>
                    <p className="commn_para">
                        {'Let the builder and Tickt know why you are cancelling the job.'}
                    </p>

                    <FsLightbox
                        toggler={toggler}
                        slide={selectedSlide}
                        sources={sources}
                        types={types}
                    />

                    <div className="reason_wrap">
                        <div className="f_spacebw">
                            {commonRenderValues({ id: 1 })}
                            {commonRenderValues({ id: 2 })}
                        </div>

                        <div className="f_spacebw">
                            {commonRenderValues({ id: 3 })}
                            {commonRenderValues({ id: 4 })}
                        </div>

                        <div className="f_spacebw">
                            {commonRenderValues({ id: 5 })}
                        </div>
                    </div>

                </div>

                <div className="flex_col_sm_9">
                    <div className="form_field">
                        <label className="form_label">Add note (optional)</label>
                        <div className="text_field">
                            <textarea
                                value={detail}
                                onChange={(e: any) => {
                                    setStateData((prev: any) => ({ ...prev, detail: e.target.value }))
                                }}
                                placeholder="It’s really bad work, because..."
                                maxLength={1000}
                            />
                        </div>
                        <span className="error_msg">
                            {errorData.detail}
                        </span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className={`fill_btn full_btn btn-effect ${checkErrors() ? 'disable_btn' : ''}`}>
                        {'Send'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LodgeDispute;