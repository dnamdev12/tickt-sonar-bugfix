import React from 'react'
import dummy from '../../../../assets/images/u_placeholder.jpg';

const PopularTradies = () => {
    return (
        <div className="section_wrapper">
            <div className="custom_container">
                <span className="title">Popular tradies</span>
                <ul className="popular_tradies">
                    <li>
                        <figure className="tradies_img">
                            <img src={dummy} alt="tradies-img" />
                        </figure>
                        <span className="name">John Oldman</span>
                        <span className="post">Electrician</span>
                    </li>
                    <li>
                        <figure className="tradies_img">
                            <img src={dummy} alt="tradies-img" />
                        </figure>
                        <span className="name">John Oldman</span>
                        <span className="post">Electrician</span>
                    </li>
                    <li>
                        <figure className="tradies_img">
                            <img src={dummy} alt="tradies-img" />
                        </figure>
                        <span className="name">John Oldman</span>
                        <span className="post">Electrician</span>
                    </li>
                    <li>
                        <figure className="tradies_img">
                            <img src={dummy} alt="tradies-img" />
                        </figure>
                        <span className="name">John Oldman</span>
                        <span className="post">Electrician</span>
                    </li>
                    <li>
                        <figure className="tradies_img">
                            <img src={dummy} alt="tradies-img" />
                        </figure>
                        <span className="name">John Oldman</span>
                        <span className="post">Electrician</span>
                    </li>
                    <li>
                        <figure className="tradies_img">
                            <img src={dummy} alt="tradies-img" />
                        </figure>
                        <span className="name">John Oldman</span>
                        <span className="post">Electrician</span>
                    </li>
                </ul>
                <button className="fill_grey_btn full_btn m-tb40 view_more">View all</button>
            </div>
        </div>

    )
}

export default PopularTradies
