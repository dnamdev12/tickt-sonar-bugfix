import React, { useState } from 'react'
//@ts-ignore
import FsLightbox from 'fslightbox-react';



const SeeDetails = (props: any) => {
    const { backToScreen, data } = props;
    const [toggler, setToggler] = useState(false);
    const [selectedSlide, setSelectSlide] = useState(1);


    if (data) {
        let {
            selectedMilestoneIndex: { index },
            itemDetails: { milestones },
            selectedMile: { description, hoursWorked, images },
            selectedItem: { jobName }
        } = data;

        let item: any = milestones[index];


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
                                        <img
                                            style={{ cursor: 'pointer' }}
                                            async-src={media_item}
                                            decoding="async"
                                            loading="lazy"
                                            onClick={() => { setItemToggle(index) }}
                                            src={media_item} alt="media" />
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
                        <button
                            onClick={() => {
                                backToScreen()
                            }}
                            className="fill_btn full_btn">OK</button>
                    </div>

                </div>
            </div>
        )
    }

    return null;
}

export default SeeDetails;
