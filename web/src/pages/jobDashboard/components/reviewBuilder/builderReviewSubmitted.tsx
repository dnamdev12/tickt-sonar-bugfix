import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import reviewBuilderSuccess from '../../../../assets/images/review-builder-success.png';
import { setLoading } from '../../../../redux/common/actions';

const BuilderReviewSuccess = () => {
    const [isLoad, setImageLoad] = useState(true);

    useEffect(() => { setLoading(true) }, [])

    useEffect(() => {
        if (!isLoad) { setLoading(false) }
    }, [isLoad])


    return (
        <div className="img_text_wrap">
            <figure className="full_image">
                <img
                    src={reviewBuilderSuccess}
                    alt="template"
                    onLoad={() => {
                        setImageLoad(false)
                    }}
                />
                <div className="short_info">
                    <div className="content">
                        <h1 className="title">Thanks!</h1>
                        <span className="show_label">
                            Your review will help other tradespeople find the highest quality builders on Tickt.
                        </span>
                        <NavLink to='/past-jobs'>
                            <div className="btn_wrapr">
                                <button className="fill_btn btn-effect">OK</button>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </figure>
        </div>
    )
}

export default BuilderReviewSuccess;
