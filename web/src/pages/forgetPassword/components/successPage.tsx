import React, { useState, useEffect } from 'react';
import colorLogo from '../../../assets/images/ic-logo-yellow.png';
import templateImage from '../../../assets/images/thanks-bg.jpg';
import { setLoading } from '../../../redux/common/actions';

interface Propstype {
    history: any,
    showModal?: boolean,
    setShowModal: (data: any) => void,
    modalUpdateSteps: (data: any) => void,
}

const SuccessPage = (props: Propstype) => {
    const [isLoad, setImageLoad] = useState(true);
    const goToLogin = () => {
        if (props.showModal) {
            props.modalUpdateSteps(0)
            return;
        }
        props.history.push('/login')
    }


    useEffect(() => { setLoading(true) }, [])

    useEffect(() => {
        if (!isLoad) { setLoading(false) }
    }, [isLoad])

    return (
        <div className="img_text_wrap">
            <figure className="full_image">
                <img
                    src={templateImage}
                    alt="template"
                    loading="eager"
                    onLoad={() => {
                        setImageLoad(false)
                    }}
                />

                <div className="short_info">
                    <figure className="logo_img">
                        <img src={colorLogo} alt="Tickt-logo" loading="eager" />
                    </figure>
                    <div className="content">
                        <h1 className="title">Thanks!</h1>
                        <span className="show_label msg">You have created new password for your account.</span>
                        <button className="fill_btn full_btn btn-effect" onClick={goToLogin}>Login</button>
                    </div>
                </div>
            </figure>
        </div>
    )
}

export default SuccessPage
