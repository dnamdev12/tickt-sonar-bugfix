import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Login from '../../pages/login/login';
import ForgetPassword from '../../pages/forgetPassword/forgetPassword';
import Signup from '../../pages/signup/index';

import cancel from "../../assets/images/ic-cancel.png";

const AuthModal = (props: any) => {
    const [modalSteps, setModalSteps] = useState(0);
    const [socialData, setSocialData] = useState<any>('')

    const modalUpdateSteps = (step: any) => {
        setModalSteps(step);
    }

    const onCloseModal = () => {
        props.setShowModal(!props.showModal)
        setModalSteps(0)
    }

    // const useStyles = makeStyles((theme: Theme) =>
    //     createStyles({
    //         paper: {
    //             position: 'absolute',
    //             width: 400,
    //             backgroundColor: '#fff',
    //             border: '2px solid #000',
    //             boxShadow: theme.shadows[5],
    //             padding: theme.spacing(2, 4, 3),
    //         },
    //     }),
    // );

    // const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render

    const renderGuestPopup = () => {
        switch (modalSteps) {
            case 0:
                return <Login history={props.history} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={modalUpdateSteps} setSocialData={setSocialData} modalLoginBackBtn="modalLoginBackBtn" />
            case 1:
                return <ForgetPassword history={props.history} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={modalUpdateSteps} />
            case 2:
                return <Signup history={props.history} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={modalUpdateSteps} socialData={socialData} />
            default:
                return null;
        }
    }

    return (
        <React.Fragment>
            {props.showModal && <Modal className="custom_modal "
                open={props.showModal}
                onClose={onCloseModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className="custom_wh onboard_modal">
                    <button className="close_btn" onClick={onCloseModal}>
                        <img src={cancel} alt="cancel" />
                    </button>
                    {renderGuestPopup()}
                </div>
            </Modal>}
        </React.Fragment>
    )
}

export default AuthModal