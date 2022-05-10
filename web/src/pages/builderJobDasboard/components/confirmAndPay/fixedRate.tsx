import React, { useEffect, useState } from 'react'
import ConfirmPay from './confirmAndPay';
import ApproveMilestonePayment from '../addBankDetails/approveMilestonePayment';
import { lastUsedCard } from '../../../../redux/jobs/actions';
import { setShowToast } from '../../../../redux/common/actions';
import { useSelector } from 'react-redux';
import storageService from "../../../../utils/storageService";

const FixedRate = (props: any) => {
    console.log({ props });
    const indexMile: any = props?.data?.selectedMilestoneIndex?.index;
    const milestones: any = props?.data?.itemDetails?.milestones;
    const selectedItems: any = milestones[indexMile];
    const [toggle, setToggle] = useState(false);
    const [toggleBankAcc, setToggleBankAcc] = useState(false);
    const [lastCard, setLastCard] = useState<any>({});
    const [toggleDetails, setToggleDetails] = useState<any>({ toggle: false, data: null })
    const isLoading = useSelector((state: any) => state.common.isLoading)
    const [checkPaymentType, setCheckPaymentType] = useState('1'); // 1 => credit card; 2 => bank account

    const backToScreen = () => {
        if (toggle) setToggle(false);
        if (toggleBankAcc) setToggleBankAcc(false);
        setToggleDetails({ toggle: false, data: null });
        fetchLastCard();
    }

    const fetchLastCard = async () => {
        let response = await lastUsedCard();
        if (response?.success) {
            setLastCard(response.data);
        }
    }

    useEffect(() => {
        fetchLastCard();
    }, [])

    useEffect(() => {
    }, [toggle, toggleBankAcc])

    if (toggle) {
        return (
            <ConfirmPay
                toggleDetails={toggleDetails}
                jobName={props?.jobName}
                dataItem={props?.data}
                backToScreen={backToScreen}
                total={selectedItems?.total}
                onSubmitAccept={props.onSubmitAccept}
            />
        )
    }

    if (toggleBankAcc) {
        return (
            <ApproveMilestonePayment
                isAddnewAccount={true}
                tradieId={props?.data?.itemDetails?.tradieId}
                builderId={storageService.getItem("userInfo")?._id || ''}
                jobName={props?.jobName}
                jobId={props?.data?.itemDetails?.jobId}
                milestoneId={props?.data?.selectedMilestoneIndex?.milestoneId}
                milestoneAmount={selectedItems?.milestoneAmount}
                milestoneTotalAmount={selectedItems?.total}
                backToScreen={backToScreen}
                milestoneNumber={indexMile}
                category={props?.data?.itemDetails?.categories?.[0]?.trade_name}
            />
        )
    }

    const renderItem = ({ title, value, bold }: any) => {
        if (value) {
            return (
                <div className="f_spacebw">
                    <span className="form_label">
                        {bold ? (
                            <b>{title}</b>
                        ) : title}
                    </span>
                    <span className="form_label">
                        {bold ? <b>{value}</b> : value}
                    </span>
                </div>
            )
        }
        return null;
    }

    return (
        <div className="flex_row">
            <div className="flex_col_sm_8">
                <div className="relate">
                    <button
                        onClick={() => {
                            props.toggleBack()
                        }}
                        className="back"></button>
                    <span className="xs_sub_title">
                        {props?.jobName}
                    </span>
                </div>
                <div className="form_field">
                    <span className="sub_title">
                        {'Confirm and pay'}
                    </span>
                </div>
                {isLoading ? null : <>
                    <div className="payment_details">
                        <span className="inner_title">Milestone payment details</span>

                        {renderItem({
                            title: 'Hours worked',
                            value: selectedItems?.hoursWorked
                        })}

                        {renderItem({
                            title: 'Hours rate',
                            value: selectedItems?.hourlyRate
                        })}

                        {renderItem({
                            title: 'Milestone amount',
                            value: selectedItems?.milestoneAmount
                        })}

                        {renderItem({
                            title: 'GST',
                            value: selectedItems?.taxes
                        })}

                        {renderItem({
                            title: 'Platform fees',
                            value: selectedItems?.platformFees
                        })}

                        {renderItem({
                            title: 'Total',
                            value: selectedItems?.total,
                            bold: true
                        })}

                    </div>
                    {!lastCard?.last4 ? (
                        <>
                            <div className="mb50">
                                <button className="fill_grey_btn full_btn btn-effect"
                                    onClick={() => {
                                        setToggle(true);
                                    }}>Add card</button>
                            </div>
                            <div className="mb50">
                                <button className="fill_grey_btn full_btn btn-effect"
                                    onClick={() => {
                                        setToggleBankAcc(true);
                                    }}>Bank account</button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <div className="view_more agree_check mb50">
                                <input
                                    onChange={() => {
                                        checkPaymentType !== '1' ? setCheckPaymentType('1') : setCheckPaymentType('0')
                                    }}
                                    checked={checkPaymentType === '1' ? true : false}
                                    className="filter-type filled-in"
                                    type="checkbox"
                                    id="creditCard" />
                                <label htmlFor="creditCard">
                                    <div
                                        onClick={() => {
                                            setToggle(true);
                                            setToggleDetails({
                                                toggle: true,
                                                data: lastCard
                                            })
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        className="bank_detail">
                                        <span className="xs_head">{`${lastCard?.funding} card`}</span>
                                        <span className="show_label">{`xxxx ${lastCard?.last4}`}</span>
                                        {/* <div className="edit_delete">
                                    <span className="edit" title="Edit"></span>
                                </div> */}
                                    </div>
                                </label>
                            </div>
                            <div className="view_more agree_check mb50">
                                <input
                                    onChange={() => {
                                        checkPaymentType !== '2' ? setCheckPaymentType('2') : setCheckPaymentType('0')
                                    }}
                                    checked={checkPaymentType === '2' ? true : false}
                                    className="filter-type filled-in"
                                    type="checkbox"
                                    id="bankAccount" />
                                <label htmlFor="bankAccount">
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        className="bank_detail"
                                        onClick={() => {
                                            setToggleBankAcc(true);
                                        }}>
                                        <span className="xs_head">{`Bank account`}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            if (checkPaymentType === '1') {
                                if (!lastCard?.last4) {
                                    setShowToast(true, 'Add card to proceed')
                                    return;
                                }
                                setToggle(true);
                            } else if (checkPaymentType === '2') {
                                setToggleBankAcc(true);
                            }
                        }}
                        className="fill_btn full_btn btn-effect"
                    >
                        {'Pay'}
                    </button>
                </>}
            </div>
        </div >

    )
}

export default FixedRate;
