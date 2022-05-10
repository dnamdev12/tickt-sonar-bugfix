import React, { useState, useEffect } from 'react'
import cancel from '../../assets/images/ic-cancel.png';
import Modal from '@material-ui/core/Modal';
import DocViewer from '../../common/DocViewer';

const VoucherDetail = (props: any) => {
    const { toggleProps, item, closeToggle } = props;
    const [toggleRecommendation, setToggleRecommendation] = useState(false);

    useEffect(() => {
        setToggleRecommendation(toggleProps);
    }, [toggleProps])

    useEffect(() => {
        
    }, [item?.recommendation])

    console.log({ item: item?.recommendation, data: item });
    return (
        <Modal
            className="custom_modal"
            open={toggleRecommendation}
            onClose={() => {
                closeToggle();
                setToggleRecommendation((prev: any) => !prev)
            }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div className="custom_wh vouch_modal" data-aos="zoom-in" data-aos-delay="30" data-aos-duration="1000">
                <div className="heading">
                    <span className="sub_title">
                        {'Recommendation about work'}
                    </span>
                    <button
                        onClick={() => {
                            closeToggle();
                            setToggleRecommendation((prev: any) => !prev)
                        }}
                        className="close_btn">
                        <img src={cancel} alt="cancel" />
                    </button>
                </div>
                <div className="inner_wrap descr">
                    <div className="inner_wrappr">
                        <div className="form_field">
                            <span className="show_label"><b>Job position:</b>{item?.jobName}</span>
                            <span className="show_label"><b>Trader:</b> {item?.tradieName}</span>
                        </div>

                        <DocViewer
                            src={item?.recommendation}
                            width="100%"
                            height="1200px"
                            isHeader={false}
                        />

                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default VoucherDetail;
