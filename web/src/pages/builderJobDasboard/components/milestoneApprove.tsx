import React, { useState } from 'react'
import DeclineMilestone from './declineMilestone';
import { milestoneAcceptOrDecline } from '../../../redux/homeSearch/actions'

import FixedRate from './confirmAndPay/fixedRate';
import { withRouter } from 'react-router-dom';
//@ts-ignore
import FsLightbox from 'fslightbox-react';
//@ts-ignore
import { moengage, mixPanel } from '../../../services/analyticsTools';
import { MoEConstants } from '../../../utils/constants';

const MilestoneApprove = (props: any) => {
    const { backToScreen, data, resetStateLocal } = props;
    const [isToggle, setToggle] = useState(false);
    const [IsToggleAccept, setToggleAccept] = useState(false);
    const [toggler, setToggler] = useState(false);
    const [selectedSlide, setSelectSlide] = useState(1);
    const [loadingTrue, setLoadingTrue] = useState(false);

    if (data) {
        let jobName: any = data?.selectedItem?.jobName;
        let jobId: any = data?.selectedItem?.jobId;
        let description: any = data?.selectedMile?.description;
        let hoursWorked: any = data?.selectedMile?.hoursWorked;
        let images: any = data?.selectedMile?.images;
        let milestones: any = data?.itemDetails?.milestones;
        let index: any = data?.selectedMilestoneIndex?.index;

        let item: any = milestones[index];

        const onSubmitAccept = async (data: any) => {
            let total = data?.total;
            let data_ = {
                "status": 1,
                "jobId": jobId,
                "milestoneId": item?.milestoneId,
                "paymentMethodId": data?.cardId,
                "milestoneAmount": data?.milestoneAmount.replace("$", ""),
                "amount": total.replace("$", "")
            }

            let response: any = await milestoneAcceptOrDecline(data_);
            if (response?.success) {
                const mData1 = {
                    Category: props.data?.itemDetails?.categories?.[0]?.trade_name,
                    timeStamp: moengage.getCurrentTimeStamp(),
                }
                moengage.moE_SendEvent(MoEConstants.MADE_PAYMENT, mData1);
                mixPanel.mixP_SendEvent(MoEConstants.MADE_PAYMENT, mData1);
                const mData2 = {
                    ...mData1,
                    'Milestone number': props.data?.selectedMilestoneIndex?.index + 1,
                }
                moengage.moE_SendEvent(MoEConstants.MILESTONE_CHECKED_AND_APPROVED, mData2);
                mixPanel.mixP_SendEvent(MoEConstants.MILESTONE_CHECKED_AND_APPROVED, mData2);
                resetStateLocal();
                props.history.push('/need-approval-success');
            }
        }

        const toggleBack = () => {
            setToggle(false);
            setToggleAccept(false);
        }

        if (IsToggleAccept) {
            return (
                <FixedRate
                    {...props}
                    jobName={jobName}
                    data={props.data}
                    toggleBack={toggleBack}
                    onSubmitAccept={onSubmitAccept}
                />
            )
        }


        if (isToggle) {
            return (
                <DeclineMilestone
                    milestoneAcceptOrDecline={milestoneAcceptOrDecline}
                    jobId={jobId}
                    jobName={jobName}
                    toggleBack={toggleBack}
                    resetStateLocal={resetStateLocal}
                    milestoneId={item?.milestoneId}
                />)
        }


        const renderFilteredItems = () => {
            let sources: any = [];
            let types: any = [];

            if (images?.length) {
                images.forEach((item: any) => {
                    if (item?.mediaType === 2) {
                        sources.push(item.link);
                        types.push('video');
                    } else if (item?.mediaType === 1) {
                        sources.push(item.link);
                        types.push('image');
                    } else {
                        sources.push(item);
                        types.push('image');
                    }
                })
            }

            return { sources, types };
        }

        const { sources, types } = renderFilteredItems();

        const setItemToggle = (index: any) => {
            setToggler((prev: boolean) => !prev);
            setSelectSlide(index + 1);
        }

        return (
            <div className="flex_row">
                <div className="flex_col_sm_8">
                    <div className="relate">
                        <button onClick={() => { backToScreen() }} className="back"></button>
                        <span className="xs_sub_title">
                            {jobName}
                        </span>
                    </div>
                    <span className="sub_title">Milestone details</span>
                    <span className="xs_sub_title">{item?.milestoneName} complete</span>

                    <FsLightbox
                        toggler={toggler}
                        slide={selectedSlide}
                        sources={sources}
                        types={types}
                    />


                    {images && Array.isArray(images) && images?.length ?
                        <div className="upload_img_video">
                            {images.map((media_item: any, index: any) => (
                                <figure className="img_video">
                                    {media_item?.mediaType == 1 ? (
                                        <img
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => { setItemToggle(index) }}
                                            async-src={media_item?.link}
                                            decoding="async"
                                            loading="lazy"
                                            src={media_item?.link} alt="media" />
                                    ) : media_item?.mediaType == 2 ? (
                                        <video
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => { setItemToggle(index) }}
                                            src={media_item?.link} />
                                    ) : (
                                        <>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => { setItemToggle(index) }}
                                                onLoad={() => {
                                                    setLoadingTrue(true)
                                                }}
                                                src={media_item}
                                                async-src={media_item}
                                                decoding="async"
                                                loading="lazy"
                                                alt="media" />
                                        </>
                                    )}
                                </figure>
                            ))}
                        </div>
                        : null}

                    <div className="form_field">
                        <span className="xs_sub_title">Description</span>
                        <p className="commn_para">{description || ''}</p>
                    </div>

                    <div className="form_field">
                        <span className="xs_sub_title">Hours worked in this milestone</span>
                        <span className="show_label">{`${hoursWorked || 0} hours`}</span>
                    </div>
                    <div className="form_field">
                        {/* onSubmitAccept */}
                        <button
                            onClick={() => {
                                setToggleAccept(true)
                            }}
                            className="fill_btn full_btn">Approve</button>
                    </div>
                    <div className="form_field">
                        <button
                            onClick={() => { setToggle(true) }}
                            className="fill_grey_btn full_btn btn-effect mt-15">
                            {'Decline'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    return null;
}

export default withRouter(MilestoneApprove);
