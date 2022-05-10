import { useState } from 'react';
import storageService from '../../utils//storageService';

import uc from '../../assets/images/uc.png';

const GuestHome = (props: any) => {
    const [userType] = useState(storageService.getItem('userType'));

    if (userType === 1 || userType === 2) {
        props.history?.push('/');
    }

    return (
        <div className="app_wrapper">
            {/* Under construction */}
            <div className="custom_container">
                <div className="under_construction_wrap">
                    <figure className="constrction_img">
                        <img src={uc} alt="coming soon" />
                    </figure>
                    <h2>This Page is under construction. Please come back later.</h2>
                </div>
            </div>
        </div>
    )
}

export default GuestHome;
