import React, { useState, useEffect } from 'react'
import TradieBox from './tradieBox';
import noData from '../../assets/images/no-search-data.png';


interface Props {
    data: any,
    title: string,
    redirectPath?: string,
    length: any,
    history?: any
}

const TradieHome = (props: Props) => {
    const { data, length, redirectPath, title, history } = props;
    const [force, forceUpdate] = useState({});


    useEffect(() => {
        if (!Array.isArray(force)) {
            forceUpdate([])
        }
    }, [data])

    if (data && length && redirectPath && title) {


        const renderItem = ({ item, index }: any) => {
            let setIndex = length - 1;
            if (index <= setIndex) {
                return (
                    <TradieBox item={item} index={index} />
                )
            }
        }

        return (
            <div className="section_wrapper bg_gray">
                <div className="custom_container">
                    <span className="title">{title}</span>
                    <div className="flex_row tradies_row">
                        {data?.length ?
                            data.map((item: any, index: number) => {
                                return renderItem({ item, index });
                            }) : (
                                <div className="no_record">
                                    <figure className="no_data_img">
                                        <img src={noData} alt="data not found" />
                                    </figure>
                                    <span>No Data Found</span>
                                </div>
                            )}
                    </div>
                    <button
                        onClick={() => {
                            if (history) {
                                history.push({
                                    pathname: redirectPath,
                                    state: {
                                        data: data,
                                        title: title
                                    }
                                })
                            }
                        }}
                        className="fill_grey_btn full_btn m-tb40 view_more">View all</button>
                </div>
            </div >
        )
    } else {
        return null;
    }
}
export default TradieHome;