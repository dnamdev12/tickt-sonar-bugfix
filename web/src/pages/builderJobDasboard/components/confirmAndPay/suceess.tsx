import React, { useState, useEffect } from 'react';
import templateImage from '../../../../assets/images/job-complete-bg.png';
import { useHistory, withRouter } from 'react-router-dom';
import { setLoading } from '../../../../redux/common/actions';


const Success = (props: any) => {
    const history = useHistory();
    const [isLoad, setImageLoad] = useState(true);

    const params = new URLSearchParams(history?.location?.search);
    const payMode: any = params.get('payMode') === 'bank';

    useEffect(() => { setLoading(true) }, [])

    useEffect(() => {
        if (!isLoad) { setLoading(false) }
    }, [isLoad])

    return (
        <div className="img_text_wrap">
            <figure className="full_image">
                <img
                    src={templateImage}
                    alt="template-item"
                    loading="eager"
                    onLoad={() => {
                        setImageLoad(false)
                    }}
                />
                <div className="short_info">
                    <div className="content">
                        <h1 className="title">
                            {`Payment ${payMode ? 'in progress' : 'sent'}!`}
                        </h1>
                        <span className="show_label">
                            {`We’ll notify the tradesperson that payment has been ${payMode ? 'initiated' : 'received'} for completing this milestone.`}
                        </span>
                        <div className="flex_row">
                            <div className="flex_col_sm_6">
                                <div className="btn_wrapr">
                                    <button
                                        onClick={() => {
                                            props.history.push('/');
                                        }}
                                        className="fill_btn btn-effect">
                                        {'OK'}
                                    </button>
                                </div>
                            </div>
                            <div className="flex_col_sm_6">
                                <div className="btn_wrapr">
                                    <button
                                        onClick={() => {
                                            history.push('/payment-history');
                                        }}
                                        style={{ backgroundColor: '#fff' }}
                                        className="fill_btn btn-effect">
                                        {'See your transactions'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </figure>
        </div>
    )
}

export default withRouter(Success);