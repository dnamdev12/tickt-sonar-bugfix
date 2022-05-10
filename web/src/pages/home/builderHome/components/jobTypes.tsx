import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const JobTypes = (props: any) => {
    let tradeListData: any = props.tradeListData;
    return (
        <div className="home_job_categories">
            <div className="custom_container">
                <OwlCarousel
                    responsiveClass={true}
                    responsive={{
                        // breakpoint from 0 up
                        0: {
                            items: 4,
                            margin: 10,
                            mouseDrag: true,
                            touchDrag: true
                        },
                        450: {
                            items: 4,
                            margin: 10,
                            mouseDrag: true,
                            touchDrag: true
                        },
                        650: {
                            items: 5,
                            margin: 10,
                            mouseDrag: true,
                            touchDrag: true
                        },
                        768: {
                            items: 6,
                            margin: 10,
                            mouseDrag: true,
                            touchDrag: true
                        },
                        1000: {
                            items: 7,
                            margin: 10,
                            mouseDrag: true,
                            touchDrag: true
                        },
                        1360: {
                            items: 7,
                            margin: 10,
                            mouseDrag: true,
                            touchDrag: true
                        }
                    }
                    }
                    className='owl-theme'
                >
                    {tradeListData && tradeListData?.length ?
                        tradeListData.map((item: any, index: any) => (
                            <div id={index} className="select_sphere">
                                <ul>
                                    <li onClick={() => {
                                        let specializations: any = [];
                                        let data = {
                                            name: item?.trade_name,
                                            tradeId: [item?._id],
                                            specializations: specializations,
                                            location: null,
                                            calender: null,
                                            address: null,
                                        }

                                        if(!specializations?.length){
                                            delete data.specializations;
                                        }

                                        props.history.push({
                                            pathname: `search-tradie-results`,
                                            state: data
                                        })
                                    }}>
                                        <figure>
                                            <img
                                                src={item.selected_url}
                                                alt="icon"
                                            />
                                        </figure>
                                        <span className="name">{item.trade_name}</span>
                                    </li>
                                </ul>
                            </div>
                        ))
                        :
                        <div></div>}
                </OwlCarousel>
            </div>
        </div>

    )
}

export default JobTypes
