import React, { useEffect, useState } from 'react';
import { profileTemplateList } from '../../../../redux/jobs/actions';
import noData from '../../../../assets/images/no-search-data.png';

import JobMilestones from './jobMilestones';

interface Proptypes {
    data: any;
    isLoading: any,
    stepCompleted: Boolean;
    handleStepComplete: (data: any) => void;
    handleStepForward: (data: any) => void;
    handleCombineMileStones: (data: any) => void;
    handleStepBack: () => void;
}

const MileStoneTemplates = (props: Proptypes) => {
    const { isLoading, } = props;
    const [list, setList] = useState([]);
    const [localFetch, setLocalFetch] = useState(false);
    const [toggleJobMilestone, setToggleJobMilestone] = useState({ toggle: false, ItemId: '' });

    const preFetch = async () => {
        let { success, data } = await profileTemplateList();
        if (success && data?.length) {
            setList(data)
            setLocalFetch(true)
        }
    }

    useEffect(() => {
        preFetch();
    }, []);

    const backToScreen = () => {
        setToggleJobMilestone((prev: any) => ({ ...prev, toggle: false, ItemId: '' }));
    }

    if (toggleJobMilestone?.toggle) {
        return (
            <JobMilestones
                id={toggleJobMilestone?.ItemId}
                backToScreen={backToScreen}
            />
        )
    }
    console.log({ toggleJobMilestone })
    return (
        <div className="custom_container">
            <div className="form_field">
                <div className="flex_row">
                    <div className="flex_col_sm_12">
                        <div className="">
                            <span className="title">{'Milestone Templates'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex_row">
                    <div className="flex_col_sm_8">
                        <ul className="milestone_templates">
                            {list?.length ?
                                list.map(({ templateId, templateName, milestoneCount }: any) => (
                                    <li onClick={() => {
                                        setToggleJobMilestone({ toggle: true, ItemId: templateId });
                                    }}>
                                        <span className="name">{templateName} </span>
                                        <div className="count">{milestoneCount}
                                            <span>milestones</span>
                                        </div>
                                    </li>
                                )) : null}
                        </ul>
                    </div>

                    {!isLoading && !list?.length ? (
                        <div className="no_record  m-t-vh">
                            <figure className="no_img">
                                <img src={noData} alt="data not found" />
                            </figure>
                            <span>{'No Data Found'}</span>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>

    )
}

export default MileStoneTemplates;