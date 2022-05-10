import React from 'react'
import dummy from '../../../../assets/images/u_placeholder.jpg';

const SavedJobs = () => {
    return (
        <div className="section_wrapper bg_gray">
        <div className="custom_container">
            <span className="title">Saved jobs</span>
            <div className="flex_row tradies_row">
                <div className="flex_col_sm_6">
                    <div className="tradie_card" data-aos="fade-in" data-aos-delay="250" data-aos-duration="1000">
                        <a href="javascript:void(0)" className="more_detail circle"></a>
                        <div className="user_wrap">
                            <figure className="u_img">
                                <img src={dummy} alt="traide-img" />
                            </figure>
                            <div className="details">
                                <span className="name">Wire up circuit box</span>
                            </div>
                        </div>
                        <div className="job_info">
                            <ul>
                                <li className="icon clock">32 minutes ago</li>
                                <li className="icon dollar">$250 p/h</li>
                                <li className="icon location line-1">Melbourne CBD</li>
                                <li className="icon calendar">4 days </li>
                            </ul>
                        </div>
                        <p className="commn_para">Sparky wanted for a quick job to hook up two floodlights on the exterior of an apartment building to the main electrical grid. Current sparky away due to illness. Sparky wanted for a quick job to hook up two floodlights...</p>
                        <ul className="count_wrap">
                            <li className="icon view">127</li>
                            <li className="icon comment">32</li>
                        </ul>
                    </div>
                </div>
                <div className="flex_col_sm_6">
                    <div className="tradie_card" data-aos="fade-in" data-aos-delay="250" data-aos-duration="1000">
                        <a href="javascript:void(0)" className="more_detail circle"></a>
                        <div className="user_wrap">
                            <figure className="u_img">
                                <img src={dummy} alt="traide-img" />
                            </figure>
                            <div className="details">
                                <span className="name">Wire up circuit box</span>
                            </div>
                        </div>
                        <div className="job_info">
                            <ul>
                                <li className="icon clock">32 minutes ago</li>
                                <li className="icon dollar">$250 p/h</li>
                                <li className="icon location line-1">Melbourne CBD</li>
                                <li className="icon calendar">4 days </li>
                            </ul>
                        </div>
                        <p className="commn_para">Sparky wanted for a quick job to hook up two floodlights on the exterior of an apartment building to the main electrical grid. Current sparky away due to illness. Sparky wanted for a quick job to hook up two floodlights...</p>
                        <ul className="count_wrap">
                            <li className="icon view">127</li>
                            <li className="icon comment">32</li>
                        </ul>
                    </div>
                </div>
            </div>
            <button className="fill_grey_btn full_btn m-tb40 view_more">View all</button>
        </div>
    </div>

    )
}

export default SavedJobs
