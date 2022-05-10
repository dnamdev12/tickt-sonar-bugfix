import React, { Component } from 'react'
import { withRouter, RouteProps } from 'react-router-dom';
import { connect,  } from 'react-redux'
import TradieBox from './tradieBox';

interface Props {
    title: any,
    jobDataWithJobTypeLatLong:any
}

class TradieListData extends Component<TradieListData & RouteProps, Props> {
    render() {
        let props: any = this.props;
        const { jobDataWithJobTypeLatLong } = props;
        let home_data: any = jobDataWithJobTypeLatLong;
        let { recomended_tradespeople } = home_data;
 
        return (
            <div className={'app_wrapper'} >
                <div className="section_wrapper bg_gray">
                    <div className="custom_container">
                        <div className="relate">
                            <button className="back" onClick={() => { props.history.push('/') }}></button>
                            <span className="title">Most viewed jobs</span>
                        </div>
                        <div className="flex_row tradies_row">
                            {recomended_tradespeople?.length ?
                                (recomended_tradespeople?.map((item: any, index: number) => {
                                    return <TradieBox item={item} index={index} />
                                })) : <span>No data Found</span>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state: any) => {
    return {
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
    }
}

export default withRouter(connect(mapStateToProps)(TradieListData) as React.ComponentType<any>);
