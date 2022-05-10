import React, { useState, useEffect } from 'react';
import { setLoading } from '../../../redux/common/actions';
import templateImage from '../../../assets/images/teplate-saved-bg.jpg';
import { useLocation, useHistory } from "react-router-dom";
interface Proptypes {
    data: any;
    stepCompleted: boolean;
    handleStepComplete: (data: any) => void;
    handleStepForward: (data: any) => void;
    handleStepBack: () => void;
}

const TemplateSavedSuccess = (props: Proptypes) => {
    const { handleStepForward} = props;
    const [isLoad, setImageLoad] = useState(true);
    const location: any = useLocation();
    const history: any = useHistory();

    useEffect(() => { setLoading(true) }, [])

    useEffect(() => {
        if (!isLoad) { setLoading(false) }
    }, [isLoad])

    return (
        <div className="img_text_wrap">
            <figure className="full_image">
                <img
                    src={templateImage}
                    alt="template-img"
                    onLoad={() => {
                        setImageLoad(false)
                    }}
                />

                <div className="short_info">
                    <div className="content">
                        <h1 className="title">{'Templete is saved!'}</h1>
                        <span className="show_label">
                            {'Your template is saved in your Milestone templates. You can edit and chose it when you will post new jobs.'}
                        </span>
                        <button
                            onClick={() => {
                                if (location?.state?.redirectTo) {
                                    history.push(`${location?.state?.redirectTo}`)
                                } else {
                                    handleStepForward(6)
                                }
                            }}
                            className="fill_btn full_btn btn-effect">{'OK'}</button>
                    </div>
                </div>
            </figure>
        </div>
    )
}

export default TemplateSavedSuccess
