import dummy from '../assets/images/u_placeholder.jpg';
import storageService from '../utils/storageService';

const TradieJobInfoBox = (props: any) => {
    const jobClickHandler = (item: any) => {
        if (storageService.getItem('userType') === 1) {
            let string_redirect: any = `/job-details-page?jobId=${item.jobId}`;
            if (item?.tradeId) { string_redirect += `&tradeId=${item.tradeId}` }
            if (item?.specializationId) { string_redirect += `&specializationId=${item.specializationId}` }
            if (item?.jobStatus) { string_redirect += `&jobStatus=${item.jobStatus}` }
            console.log({ item, string_redirect })
            props.history.push(string_redirect);
        } else {
            let status = '';
            if (item?.jobStatus) {
                status = (item?.jobStatus).toLowerCase();
            }

            let string_item = `?jobId=${item?.jobId}&status=${status}&edit=true`
            if (['expired', 'completed'].includes(status)) {
                string_item += `&job=past`
            }
            console.log({
                string_item,
                status,
                jobStatus: item?.jobStatus
            })
            let urlEncode: any = string_item;
            props.history.push(`/job-detail?${urlEncode}`);
        }
    }

    const { item } = props;
    return (
        <div className="flex_col_sm_6">
            <div className="tradie_card" data-aos="fade-in" data-aos-delay="250" data-aos-duration="1000">
                <a href="javascript:void(0)" className="more_detail circle" onClick={() => jobClickHandler(item)} />
                <div className="user_wrap">
                    <figure className={`u_img ${props.userType === 2 ? 'icon' : ''}`}>
                        <img
                            src={props.userType === 2 ? item.tradeSelectedUrl : (item.builderImage || dummy)}
                            alt=""
                            onError={(e: any) => {
                                if (e?.target?.onerror) {
                                    e.target.onerror = null;
                                }
                                if (e?.target?.src) {
                                    e.target.src = dummy;
                                }
                            }}
                        />
                    </figure>
                    <div className="details">
                        <span className="name">{props.userType === 2 ? item.tradeName : item.jobName}</span>
                        <span className="prof">{props.userType === 2 ? item.jobName : item.builderName}</span>
                    </div>
                </div>
                <div className="job_info">
                    <ul>
                        <li className="icon clock">{item.time}</li>
                        <li className="icon dollar">{item.amount}</li>
                        <li className="icon location line-1">{item.locationName}</li>
                        <li className="icon calendar">{item.durations}</li>
                    </ul>
                </div>
                <p className="commn_para line-3">{item.jobDescription}</p>
                <ul className="count_wrap">
                    <li className="icon view">{item.viewersCount}</li>
                    <li className="icon comment">{item.questionsCount}</li>
                </ul>
            </div>
        </div>
    )
}

export default TradieJobInfoBox;
