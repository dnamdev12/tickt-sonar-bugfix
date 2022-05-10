import React from 'react'
import Carousel from 'react-multi-carousel';
import colorLogo from '../../../../assets/images/ic-logo-yellow.png';

const Categories = () => {

    const categorieshome = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1, // optional, default to 1.
        },
    };

    
    return (
        <div className="home_categories">
            <div className="custom_container">
                <Carousel className="item_slider" responsive={categorieshome} autoPlay={false} arrows={false} showDots={true}>
                    <div>
                        <ul className="categories">
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician </span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician </span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician </span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician </span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul className="categories">
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician </span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician </span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician </span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="categ_card">
                                    <figure className="categ_img circle">
                                        <img src={colorLogo} alt="icon" />
                                    </figure>
                                    <span className="categ_name">Electrician </span>
                                </a>
                            </li>
                        </ul>
                    </div>


                </Carousel>
            </div>
        </div>
    )
}

export default Categories
