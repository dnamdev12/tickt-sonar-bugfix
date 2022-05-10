import { useState, useEffect } from 'react';
import HomeBanner from './components/homeBanner';
import JobTypeList from './components/jobTypeList';
import SavedJobs from './components/savedJobs';
import PopularBuilders from './components/popularBuilders';
import RecommendedJobs from './components/recommendedJobs';
import MostViewedJobs from './components/mostViewedJobs';

const TradieHome = (props: any) => {
    const [tradieHomeData, setTradieHomeData] = useState<any>({
        location: {
            coordinates: [
                144.9631,
                -37.8136
            ]
        },
    });

    useEffect(() => {
        const showPosition = (position: any) => {
            const locationNew: any = {
                location: {
                    coordinates: []
                }
            }
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            locationNew.location.coordinates[0] = long;
            locationNew.location.coordinates[1] = lat;
            setTradieHomeData((prevData: any) => ({ ...prevData, ...locationNew }));
            const jobData = {
                lat: lat,
                long: long
            }
            props.getJobWithJobTypeLatLong(jobData);
        }

        const showError = (error: any) => {
            if (error.code == error.PERMISSION_DENIED) {
                setTradieHomeData((prevData: any) => ({ ...prevData, locationDenied: true }));
                const jobData = {
                    lat: tradieHomeData.location.coordinates[1],
                    long: tradieHomeData.location.coordinates[0],
                    jobType: '',
                }
                props.getJobWithJobTypeLatLong(jobData);
            }
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        }
    }, [])

    console.log(tradieHomeData, "stateData tradie home")

    return (
        <div className="app_wrapper" >
            <HomeBanner {...props} currentCoordinates={tradieHomeData.location} setTradieHomeData={setTradieHomeData} />
            <JobTypeList {...props} currentCoordinates={tradieHomeData.location} />
            <SavedJobs {...props} />
            <PopularBuilders {...props} coordinates={tradieHomeData.location.coordinates} />
            <RecommendedJobs {...props} coordinates={tradieHomeData.location.coordinates} />
            <MostViewedJobs {...props} coordinates={tradieHomeData.location.coordinates} />
        </div>
    )
}

export default TradieHome;
