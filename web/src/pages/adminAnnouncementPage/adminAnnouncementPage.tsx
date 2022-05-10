import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { portfolio } from '../builderInfo/builderInfo';
import { getAdminNotificationData } from '../../redux/homeSearch/actions';
//@ts-ignore
import FsLightbox from 'fslightbox-react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import portfolioPlaceholder from '../../assets/images/portfolio-placeholder.jpg';
import noData from '../../assets/images/no-search-data.png';

const AdminAnnouncementPage = (props: any) => {
    const [toggler, setToggler] = useState(false);
    const [selectedSlide, setSelectSlide] = useState<any>(1);
    const [notificationData, setNotificationData] = useState<any>(null);
    console.log('notificationData: ', notificationData);

    useEffect(() => {
        setItems();
    }, []);

    const setItems = async () => {
        const admin_notification_id = new URLSearchParams(props.location?.search)?.get('admin_notification_id');

        const res = await getAdminNotificationData({ admin_notification_id: admin_notification_id });
        if (res.success) {
            setNotificationData(res.result?.notification_data);
        }
    }

    const renderMediaItems = (itemsMedia: any) => {
        let sources: any = [];
        let types: any = [];

        sources.push(itemsMedia);
        types.push('image');
        return { sources, types };
    }

    const { sources, types } = renderMediaItems(notificationData?.image);
    return (
        <div className="app_wrapper">
            <div className="section_wrapper">
                <div className="custom_container">
                    {(notificationData || props.isLoading) ? (
                        <>
                            <div className="flex_row">
                                <div className="flex_col_sm_8">
                                    <div className="description">
                                    <span className="sub_title">{notificationData?.title}</span>
                                    <p className="commn_para">{notificationData?.sub_title}
                                    </p>
                                    </div>
                                </div>
                            </div>
                            <FsLightbox
                                toggler={toggler}
                                slide={selectedSlide}
                                sources={sources}
                                types={types}
                                key={sources?.length}
                            />
                            {notificationData && <div className="section_wrapper">
                                <div className="custom_container">
                                    <Carousel
                                        responsive={portfolio}
                                        showDots={false}
                                        arrows={true}
                                        infinite={true}
                                        className="portfolio_wrappr"
                                        partialVisbile
                                    >
                                        <div className="media">
                                            <figure className="portfolio_img">
                                                <img
                                                    src={notificationData?.image || portfolioPlaceholder}
                                                    alt="portfolio-images"
                                                    onClick={() => {
                                                        setToggler((prev: any) => !prev);
                                                        setSelectSlide(1);
                                                    }}
                                                />
                                            </figure>
                                        </div>
                                    </Carousel>
                                </div>
                            </div>}
                        </>) : (<div className="no_record">
                            <figure className="no_img">
                                <img src={noData} alt="data not found" />
                            </figure>
                            <span>No Data Found</span>
                        </div>)}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        isLoading: state.common.isLoading,
    }
}

export default connect(mapStateToProps, null)(AdminAnnouncementPage);
