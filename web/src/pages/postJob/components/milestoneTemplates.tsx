import React, { useEffect, useState } from 'react';
import { profileTemplateList, getMileStoneByTempId } from '../../../redux/jobs/actions';
import moment from 'moment';
import noData from '../../../assets/images/no-search-data.png';

interface Proptypes {
    data: any;
    isLoading: any,
    stepCompleted: boolean;
    handleStepComplete: (data: any) => void;
    handleStepForward: (data: any) => void;
    handleCombineMileStones: (data: any) => void;
    handleStepBack: () => void;
}

const MileStoneTemplates = (props: Proptypes) => {
    const { isLoading, handleCombineMileStones, handleStepForward } = props;
    const [list, setList] = useState([]);

    const preFetch = async () => {
        let { success, data } = await profileTemplateList();
        if (success && data?.length) {
            setList(data)
        }
    }


    const handleContinue = async (id: any) => {
        let { success, data } = await getMileStoneByTempId(id);

        if (success && data) {
            let filter_milestones = data?.milestones?.map((item: any) => ({
                from_date: moment(item?.fromDate, 'MM-DD-YYYY').format('MM-DD-YYYY'),
                to_date: moment(item?.toDate, 'MM-DD-YYYY').isValid() ? moment(item?.toDate, 'MM-DD-YYYY').format('MM-DD-YYYY') : '',
                milestone_name: item?.milestoneName,
                recommended_hours: item?.recommendedHours,
                isPhotoevidence: item?.isPhotoevidence || false,
            }))
           
            handleCombineMileStones(filter_milestones);
            handleStepForward(6);
        }
    }

    useEffect(() => {
        preFetch();
    }, []);

    return (
        <div className="app_wrapper">
            <div className="section_wrapper">
                <div className="custom_container">
                    <div className="form_field">
                        <div className="flex_row">
                            <div className="flex_col_sm_5">
                                <div className="relate">
                                    <button className="back" onClick={() => { handleStepForward(6) }}></button>
                                    <span className="title">{'Milestone Templates'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex_row">
                            <div className="flex_col_sm_6">
                                <ul className="milestone_templates">
                                    {list?.length ?
                                        list.map(({ templateId, templateName, milestoneCount }: any) => (
                                            <li
                                                onClick={() => { handleContinue(templateId) }}
                                            >
                                                <span className="name">{templateName} </span>
                                                <div className="count">{milestoneCount}
                                                    <span>milestones</span>
                                                </div>
                                            </li>
                                        )) : null}
                                </ul>
                            </div>

                            {!isLoading && !list?.length ? (
                                <div className="no_record m-t-vh">
                                    <figure className="no_img">
                                        <img src={noData} alt="data not found" />
                                    </figure>
                                    <span>{'No Data Found'}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MileStoneTemplates;
