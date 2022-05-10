import { useState, useCallback, useRef } from "react";
// @ts-ignore
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import mapStyles from "./mapStyles";

import jobIconDemo from "../../assets/images/jobicon.png";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const options: any = {
  styles: mapStyles[0],
  disableDefaultUI: true,
  zoomControl: true,
};

const RenderMap = (props: any) => {
  const [center, setCenter] = useState<any>("");
  const [markers, setMarkers] = useState<Array<any>>([]);
  const [selected, setSelected] = useState<any>(null);
  const mapRef = useRef(null);

  const setMapCenter = () => {
    var mapCenterCoordinates;
    const jobResultsParam = new URLSearchParams(props.location?.search).get(
      "jobResults"
    );
    if (props.searchByFilter) {
      mapCenterCoordinates = props.homeSearchJobData?.slice(0, 1);
    } else if (jobResultsParam == "viewNearByJob") {
      mapCenterCoordinates = props.viewNearByJobData?.slice(0, 1);
    } else {
      mapCenterCoordinates = props.homeSearchJobData?.slice(0, 1);
    }
    console.log(mapCenterCoordinates, "mapCenterCoordinates");
    const newCenter = {
      lat:
        mapCenterCoordinates?.length > 0
          ? mapCenterCoordinates[0]?.location?.coordinates[1]
          : -37.8136, //lat
      lng:
        mapCenterCoordinates?.length > 0
          ? mapCenterCoordinates[0]?.location?.coordinates[0]
          : 144.9631, //lng
    };
    if (JSON.stringify(center) == JSON.stringify(newCenter)) {
      return;
    } else {
      setCenter(newCenter);
    }
  };

  console.log(props, "props renderMap", mapRef, "mapRef");

  const renderJobsData = () => {
    setMapCenter();
    var jobsData;
    const jobResultsParam = new URLSearchParams(props.location?.search).get(
      "jobResults"
    );
    if (props.searchByFilter) {
      jobsData = props.homeSearchJobData;
      return jobsData;
    }
    if (jobResultsParam == "viewNearByJob") {
      jobsData = props.viewNearByJobData;
      return jobsData;
    } else {
      jobsData = props.homeSearchJobData;
      return jobsData;
    }
  };

  const jobClickHandler = (item: any) => {
    props.history.push(
      `/job-details-page?jobId=${item.jobId}&tradeId=${item.tradeId}&specializationId=${item.specializationId}`
    );
  };

  const onMapClick = useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      options={options}
      // onClick={onMapClick}
      onLoad={onMapLoad}
      onUnmount={onUnmount}
    >
      {renderJobsData()?.map((item: any) => (
        <Marker
          key={item.jobId}
          position={{
            lat: item.location?.coordinates[1],
            lng: item.location?.coordinates[0],
          }}
          icon={{
            url: jobIconDemo,
            scaledSize: new window.google.maps.Size(45, 45),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(20, 20),
          }}
          onClick={() => {
            const lat = item.location.coordinates[1];
            const lng = item.location.coordinates[0];
            setSelected(item);
          }}
        />
      ))}
      {selected ? (
        <InfoWindow
          position={{
            lat: selected.location.coordinates[1],
            lng: selected.location.coordinates[0],
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="preview_card">
            <div className="tradie_card">
              <a
                href="javascript:void(0)"
                className="more_detail circle"
                onClick={() => jobClickHandler(selected)}
              ></a>
              <div className="user_wrap">
                <figure className="u_img">
                  <img
                    src={
                      selected.tradeSelectedUrl ? selected.tradeSelectedUrl : ""
                    }
                    alt="tradie-img"
                  />
                </figure>
                <div className="details">
                  <span className="name">{selected.tradeName}</span>
                  <span className="prof">{selected.jobName}</span>
                </div>
              </div>
              <div className="job_info">
                <ul>
                  <li className="icon clock">{selected.time}</li>
                  <li className="icon dollar">{selected.amount}</li>
                  <li className="icon location line-1">
                    {selected.locationName}
                  </li>
                  <li className="icon calendar">{selected.durations}</li>
                </ul>
              </div>
            </div>
          </div>
        </InfoWindow>
      ) : null}
    </GoogleMap>
  );
};

export default RenderMap;
