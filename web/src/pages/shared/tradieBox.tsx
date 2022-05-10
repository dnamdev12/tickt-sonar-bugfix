import React, { Component } from 'react'
import dummy from '../../assets/images/u_placeholder.jpg';
import { RouteComponentProps, withRouter } from "react-router";
interface State {
    isItemSpec: any
}

// Your component own properties
type PropsType = RouteComponentProps & {
    item: any,
    index: any,
    hideAos?: boolean,
    jobId?: any,
    specializationId?: any,
    hideInvite?: boolean,
    showStatus?: boolean,
}

class TradieBox extends Component<PropsType, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            isItemSpec: {},
        }
    }

    toggleMoreSpec = (index: any) => {
        let this_state: any = this.state;
        let isItemSpec = this_state.isItemSpec;
        if (isItemSpec[index] === undefined) {
            isItemSpec[index] = true;
        } else {
            isItemSpec[index] = !isItemSpec[index];
        }
        this.setState({ isItemSpec });
    }

    redirectPath = (item: any) => {
        const { jobId, history, hideInvite, location } = this.props;

        console.log({ item }, '-->')

        let tradieId = item?.tradieId;

        if (jobId && tradieId) {
            history.push({
                pathname: `/tradie-info`,
                search: `?jobId=${jobId}&tradeId=${tradieId}&hideInvite=${hideInvite ? true : false}`,
                state: { url: location?.pathname }
            });
        } else {
            history.push({
                pathname: `/tradie-info`,
                search: `?tradeId=${tradieId}&hideInvite=${hideInvite ? true : false}`,
                state: { url: location?.pathname }
            });
        }
    }

    render() {
        const { item, hideAos, showStatus } = this.props;
        return (
            <div className="flex_col_sm_4">
                <div className="tradie_card"
                    data-aos={hideAos ? '' : "fade-in"}
                    data-aos-delay={hideAos ? '' : "250"}
                    data-aos-duration={hideAos ? '' : "1000"}>

                    <div className="f_spacebw tag_review">
                        <span className="form_label">{(item?.tradeData?.[0]?.tradeName) || (item?.tradie_details?.trade?.[0]?.trade_name) || (item?.trade?.[0]?.trade_name)}</span>
                        <span className="rating">
                            {(item?.ratings) || (item?.rating)?.toFixed(1) || (item?.tradie_details?.rating)?.toFixed(1) || '0'} | {item?.reviews || (item?.review) || (item?.tradie_details?.review) || '0'} reviews </span>
                    </div>

                    <span
                        onClick={() => { this.redirectPath(item) }}
                        className="more_detail new_top circle"></span>
                    <div className="user_wrap">
                        <figure className="u_img">
                            <img
                                src={item?.tradieImage || item?.tradie_details?.user_image || item?.user_image || dummy}
                                alt="traide-img" />
                        </figure>
                        <div className="details">
                            <span className="name">{item?.tradieName || item?.tradie_details?.firstName || item?.firstName}</span>
                            <span className="job">{item?.businessName}</span>
                        </div>
                    </div>
                    {showStatus && item?.status && <div className="form_field"><div className="job_status" >{item?.status}</div></div>}
                </div>
            </div>
        )
    }
}

export default withRouter(TradieBox);