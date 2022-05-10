import React, { useEffect, useState, useCallback } from 'react';
import masterIcon from '../../../../assets/images/mastercard.svg';
import visaIcon from '../../../../assets/images/visacard.svg';
import check from '../../../../assets/images/checked-2.png';

import PaymentDetails from './paymentDetails';
import { withRouter } from 'react-router-dom';

import dotMenu from '../../../../assets/images/menu-dot.png'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getCardList, deleteCard } from '../../../../redux/jobs/actions'



const ConfirmAndPay = (props: any) => {
    const [toggle, setToggle] = useState(false);
    const [selected, setSelected] = useState(0);
    const [editItem, setEditItem] = useState<any>('');
    const [deleteToggle, setDeleteToggle] = useState(false);
    const [paymentDetail, setPaymentDetail] = useState<any>([]);


    const setAfterFetch = () => {
        console.log('Here!', {
            toggle: props?.toggleDetails
        })
        if (props?.toggleDetails?.toggle) {
            setToggle(true);
            let data = props?.toggleDetails?.data;
            let exp_date = (data?.exp_month).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
            let data_: any = {
                cardId: data?.cardId,
                number: `${data?.last4}`,
                cardholderName: data?.name,
                date: `${exp_date}/${((data?.exp_year).toString()).substring(2, 4)}`,
                cvv: '000',
                cardType: data?.funding,
                fetched: true
            }

            setEditItem(data_);
        }
    }

    const fetchMyAPI = useCallback(async () => {
        let result: any = await getCardList();
        let data: any = result.data;
        let filterItems: any = []
        if (data?.length) {
            filterItems = data.map((item: any) => {
                let exp_date = (item?.exp_month).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
                return {
                    brand: item?.brand,
                    cardId: item?.cardId,
                    number: `${item?.last4}`,
                    cardholderName: item?.name,
                    date: `${exp_date}/${((item?.exp_year).toString()).substring(2, 4)}`,
                    cvv: '000',
                    cardType: item?.funding,
                    fetched: true
                }
            });
        }
        setPaymentDetail(filterItems);
        setAfterFetch()
    }, [])


    useEffect(() => {
        fetchMyAPI();
    }, [])

    useEffect(() => {
        if (toggle == false) {
            fetchMyAPI();
        }
    }, [toggle]);

    const backToScreen = () => {
        setToggle(false);
        if (props?.toggleDetails?.data) {
            props.backToScreen();
        }
    }

    const setDetials = (data: any) => {
        if (data?.index) {
            paymentDetail[data?.index] = data;
        } else {
            setPaymentDetail((prev: any) => ([...prev, data]))
        }
    }

    if (toggle) {
        console.log({
            editItem
        })
        return (
            <PaymentDetails
                jobName={props?.jobName}
                editItem={editItem}
                backToScreen={backToScreen}
                setDetials={setDetials}
                hideExtra={props.hideExtra}
                onSubmitAccept={props.onSubmitAccept}
            />
        )
    }

    return (
        <div className="flex_row">
            <div className="flex_col_sm_8">
                <div className="relate">
                    {!props.hideExtra ? (
                        <button
                            onClick={() => {
                                props.backToScreen()
                            }}
                            className="back"></button>
                    ) : null}
                    <span className={!props.hideExtra ? `xs_sub_title` : 'xs_sub_title mb0'}>
                        {props?.jobName}
                    </span>

                    <Dialog
                        open={deleteToggle}
                        onClose={() => {
                            setDeleteToggle((prev: any) => !prev)
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure you want to delete ?"}
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    let result: any = await deleteCard({ cardId: paymentDetail[selected].cardId })
                                    if (result.success) {
                                        setDeleteToggle((prev: any) => !prev)
                                        fetchMyAPI();
                                    }
                                }}
                                color="primary" autoFocus>
                                {'Yes'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setDeleteToggle((prev: any) => !prev)
                                }}

                                color="primary">
                                {'No'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {(selected > -1) ? (
                        <span className="dot_menu">
                            <img src={dotMenu} alt="edit" />
                            <div className="edit_menu">
                                <ul>
                                    <li
                                        onClick={() => {
                                            try {
                                                console.log({
                                                    paymentDetail,
                                                    selected
                                                })
                                                let item = paymentDetail.find((_: any, index: any) => {
                                                    console.log({ _, index })
                                                    if (index == selected) {
                                                        return _;
                                                    }
                                                });
                                                item['index'] = selected;
                                                setEditItem(item);
                                                setToggle(true);
                                            } catch (err) {
                                                console.log(err);
                                            }
                                        }}
                                        className="icon lodge">{'Edit'}</li>
                                    <li
                                        onClick={() => {
                                            setDeleteToggle((prev: any) => !prev);
                                        }}
                                        className="icon delete">{'Delete'}</li>
                                </ul>
                            </div>
                        </span>
                    ) : null}
                </div>
                <div className="form_field">
                    {!props.hideExtra ? (
                        <span className="sub_title">
                            {'Confirm and pay'}
                        </span>
                    ) : (
                        <span className="sub_title">
                            {'Payment Details'}
                        </span>
                    )}
                </div>
                <div className="mb130">
                    {paymentDetail?.length ?
                        paymentDetail.map((item: any, index: any) => (
                            <button
                                onClick={() => {
                                    setSelected(index);
                                }}
                                className="card_btn full_btn">
                                <img src={item.brand == 'visa' ? visaIcon : masterIcon} alt="card-icon" className="pos card" />
                                {`${item?.cardType?.charAt(0).toUpperCase() + item?.cardType?.slice(1)} Card`}{' '}
                                <span className="show_label">
                                    XXXX {(item?.number).substring(item?.number?.length - 4, item?.number?.length)}
                                </span>
                                {selected == index ? (
                                    <img src={check} alt="check" className="pos check" />
                                ) : null}
                            </button>
                        ))
                        : null}

                    <button
                        onClick={() => {
                            setToggle(true);
                            setEditItem('')
                        }}
                        className="fill_grey_btn full_btn btn-effect">
                        {paymentDetail?.length ? 'Add another card' : 'Add card'}
                    </button>
                </div>
                {!props.hideExtra ? (
                    <React.Fragment>
                        <div className="form_field">
                            <span className="payment_note">
                                Tickt does not store your payment information.
                            </span>
                            <p className="commn_para">
                                Tickt does not handle payment for jobs, we only facilitate
                                communication between tradespeople and builders. If you have problems
                                receiving your payment, please contact your builder.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                // this will submit the accept request.
                                let index = props?.dataItem?.selectedMilestoneIndex?.index;
                                let milestoneAmount = props?.dataItem?.itemDetails.milestones[index]?.milestoneAmount;
                                console.log({
                                    props,
                                    milestoneAmount,
                                    index
                                }, '-------->');
                                props.onSubmitAccept({
                                    total: props.total,
                                    cardId: paymentDetail[selected]?.cardId,
                                    milestoneAmount
                                });
                            }}
                            className={`fill_btn full_btn btn-effect ${!paymentDetail?.length ? 'disable_btn' : ''}`}>
                            {'Continue'}
                        </button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className="form_field">
                            <span className="payment_note">
                                Tickt does not store your payment information.
                            </span>
                            <p className="commn_para">
                                Tickt does not handle payment for jobs, we only facilitate
                                communication between tradespeople and builders. If you have problems
                                receiving your payment, please contact your builder.
                            </p>
                        </div>
                    </React.Fragment>
                )}

            </div>
        </div>
    )
}

export default withRouter(ConfirmAndPay);
