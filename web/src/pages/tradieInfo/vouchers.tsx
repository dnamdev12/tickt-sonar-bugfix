import React, { useState, useEffect } from 'react'
import dummy from '../../assets/images/u_placeholder.jpg';
import vouch from '../../assets/images/ic-template.png';
import { withRouter } from 'react-router-dom';
import {
    getVouchers
} from '../../redux/jobs/actions';
import storageService from '../../utils/storageService';

import AddVoucherModal from './addVoucher';
import VoucherDetailModal from './voucherDetail';

import InfiniteScroll from "react-infinite-scroll-component";


const Vouchers = (props: any) => {
    const [stateData, setStateData] = useState<any>([]);
    const [errors, setErrors] = useState({});
    const [toggleRecommendation, setToggleRecommendation] = useState({ isTrue: false, item: {} });
    const [jobsList, setJobsList] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    let id = props?.location?.state?.id;
    let path = props?.location?.state?.path;
    let search: any = props?.location?.search || '';

    if (search?.length) {
        const urlParams = new URLSearchParams(search);
        let tradieId: any = urlParams.get('tradieId');
        if (tradieId?.length) {
            id = tradieId;
        }
    }
    const closeToggle = (isRecall?: string) => {
        setToggleRecommendation({ isTrue: false, item: {} });
        setSelectedItem({});
        setToggle((prev: any) => false);
        if (isRecall === 'isRecall') {
            prefetch();
        }
    }



    useEffect(() => {
        prefetch();
    }, [id, path])


    const prefetch = async () => {
        let res_profile: any = await getVouchers({ tradieId: id, page: 1 })
        if (res_profile.success) {
            let completeItems = res_profile?.data?.voucher || res_profile?.data;  //[]
            setStateData(completeItems);
        }
    }


    let state_data: any = stateData;

    return (
        <div className="app_wrapper">
            <div className="section_wrapper">
                <div className="custom_container">

                    <VoucherDetailModal
                        toggleProps={toggleRecommendation.isTrue}
                        item={toggleRecommendation.item}
                        id={id}
                        closeToggle={closeToggle}
                    />
                    {storageService.getItem('userType') === 2 &&
                        <AddVoucherModal
                            toggleProps={toggle}
                            id={id}
                            closeToggle={closeToggle}
                        />}

                    <div className="flex_row">
                        <div className="flex_col_sm_6">
                            <div className="relate">
                                <button
                                    onClick={() => {
                                        // let path: any = props.location.state.path;
                                        if (!path) {
                                            props.history.push('/');
                                        } else {
                                            props.history.push(`tradie-info${path}`);
                                        }
                                    }}
                                    className="back"></button>
                                <span className="title">
                                    {`${stateData.length} ${stateData.length === 1 ? 'Vouch' : 'Vouches'}`}
                                </span>
                            </div>
                        </div>
                        {storageService.getItem('userType') === 2 && <div className="flex_col_sm_6 text-right">
                            <button
                                onClick={() => { setToggle((prev: any) => true) }}
                                className="fill_btn btn-effect add_vouch">
                                {'+ Leave a Vouch'}
                            </button>
                        </div>}
                    </div>

                    {state_data?.length ?
                        <div className="section_wrapper">
                            <div className="custom_container">
                                <span className="sub_title">
                                    {'Vouches'}
                                </span>

                                <InfiniteScroll
                                    dataLength={state_data?.length}
                                    next={async () => {
                                        console.log('Here!!!');
                                        let cp: any = currentPage + 1;
                                        setCurrentPage((prev: any) => prev + 1);
                                        let response = await getVouchers({ tradieId: id, page: cp });
                                        if (response.success) {
                                            let completeItems = response?.data?.voucher || response?.data;  //[]
                                            if (completeItems?.length) {
                                                setStateData((prev: any) => ([...prev, ...completeItems]));
                                            } else {
                                                setHasMore(false);
                                            }
                                        }
                                    }}
                                    hasMore={hasMore}
                                    loader={<></>}
                                    className="flex_row">
                                    {state_data.map((item: any) => (
                                        <div className="flex_col_sm_3">
                                            <div className="review_card vouchers">
                                                <div className="pic_shot_dtl">
                                                    <figure className="u_img">
                                                        <img
                                                            src={item?.builderImage || dummy}
                                                            alt="user-img"
                                                            onError={(e: any) => {
                                                                if (e?.target?.onerror) {
                                                                    e.target.onerror = null;
                                                                }
                                                                if (e?.target?.src) {
                                                                    e.target.src = dummy;
                                                                }
                                                            }}
                                                        />
                                                    </figure>
                                                    <div className="name_wrap">
                                                        <span className="user_name" title={item?.builderName || ''}>
                                                            {item?.builderName || ''}
                                                        </span>
                                                        <span className="date">
                                                            {item?.date}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className="xs_head">
                                                    {item?.jobName}
                                                </span>

                                                <p className="commn_para" title="">
                                                    {item?.vouchDescription || ''}
                                                </p>
                                                <div className="vouch">
                                                    <figure className="vouch_icon">
                                                        <img src={vouch} alt="vouch" />
                                                    </figure>
                                                    <span
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setToggleRecommendation((prev: any) => ({ ...prev, ...{ isTrue: true, item: item } }));
                                                        }}
                                                        className="link">
                                                        {`Vouch for ${item?.tradieName}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </InfiniteScroll>

                            </div>
                        </div>
                        : null}
                </div>
            </div>
        </div >
    )
}

export default withRouter(Vouchers);