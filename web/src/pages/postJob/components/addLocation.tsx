
import { useEffect, useState } from 'react';
// @ts-ignore
// import PlacesAutocomplete from 'react-places-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';
import icgps from "../../../assets/images/ic-gps.png";
import Geocode from "react-geocode";
import { setShowToast, setLoading } from '../../../redux/common/actions';
import cross from "../../../assets/images/close-black.png";
import Constants from '../../../utils/constants';

Geocode.setApiKey(Constants.SocialAuth.GOOGLE_GEOCODE_KEY);
Geocode.setLanguage("en");
Geocode.setRegion('au');
// Enable or disable logs. Its optional.
Geocode.enableDebug();
interface Proptypes {
  data: any;
  stepCompleted: boolean;
  handleStepComplete: (data: any) => void;
  handleStepBack: () => void;
}

const searchOptions = {
  componentRestrictions: { country: "au" },
  types: ["(cities)"]
}

const AddLocation = ({ data, stepCompleted, handleStepComplete, handleStepBack }: Proptypes) => {
  const [address, setAddress] = useState('');
  const [locationDetails, setLocationDetails] = useState<{ [index: string]: any }>({ location: {}, location_name: '' });
  const [error, setError] = useState('');
  const [localChanges, setLocationChanges] = useState(false);
  const [activeCurrent, setActiveCurrent] = useState(false);

  const [locationSelected, setLocationSelected] = useState(false);

  const updateLocalData = (data: any) => {
    setLocationDetails({
      location: {
        type: 'Point',
        coordinates: data?.coordinates
      },
      location_name: data?.location_name
    });
  }

  useEffect(() => {
    if (stepCompleted && !localChanges) {
      updateLocalData(data);
      setAddress(data?.location_name);
      setLocationSelected(true);
      setLocationChanges(true);
    }

    if (address?.length > 2) {
      setActiveCurrent(false);
      document.getElementById('location_search_dynamic')?.focus();
    } else {
      setActiveCurrent(false);
      document.getElementById('location_search_static')?.focus();
    }
  }, [address, stepCompleted, data])


  const filterFromAddress = (response: any) => {
    let city, state, country = null;
    for (let i = 0; i < response.results[0].address_components.length; i++) {
      for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
        switch (response.results[0].address_components[i].types[j]) {
          case "locality":
            city = response.results[0].address_components[i].long_name;
            break;
          case "administrative_area_level_1":
            state = response.results[0].address_components[i].long_name;
            break;
          case "country":
            country = response.results[0].address_components[i].long_name;
            break;
        }
      }
    }
    return { city, state, country: country.toLowerCase() };
  }

  const getCurrentLocation = async (e: any) => {
    e.preventDefault();
    setActiveCurrent(true);
    let permission_web = await navigator?.permissions?.query({ name: 'geolocation' });

    if (permission_web.state !== 'denied') {
      setLoading(true)
      let item_position: any = localStorage.getItem('position');
      let position = JSON.parse(item_position);
      let longitude = (position[0])?.toString();
      let latitude = (position[1])?.toString();
      try {
        let response: any = await Geocode.fromLatLng(latitude, longitude);
        console.log({response});
        const { city, state, country } = filterFromAddress(response);
        if (response && ["australia", "au"].includes(country)) {
          const address = response.results[0].formatted_address;
          let coordinates_values = [latitude, longitude];
          setLocation({ coordinates: coordinates_values, address: address })
          setLoading(false);
        } else {
          setShowToast(true, "Uh Oh! We don't provide service currently in your location");
          setLoading(false);
        }
      } catch (err) {
        console.log({ err });
      }

    } else {
      setError('Please enable the location permission from the browser settings so that Tickt app can access your location');
    }
  }

  const handleContinue = (e: any) => {
    e.preventDefault();
    let locationAddress: any = locationDetails;
    if (data?.location?.coordinates?.length && data?.location_name === address) {
      locationAddress.location['coordinates'] = data?.location?.coordinates;
      handleStepComplete(locationAddress);
      return
    } else {
      if (locationAddress?.location?.coordinates?.length) {
        handleStepComplete(locationDetails);
        return
      }
    }
    setError('please choose current location or search a location.');
  }

  const setLocation = ({ coordinates, address }: any) => {
    setLocationDetails({
      location: {
        type: 'Point',
        coordinates: coordinates,
      },
      location_name: address,
    });
    setAddress(address);
    setError('');
  }

  const handleSelect = async (address: any) => {
    setLocationSelected(true);
    try {
      let coordinates_response = await Geocode.fromAddress(address);
      if (coordinates_response) {
        const { lat, lng } = coordinates_response.results[0].geometry.location;
        setLocation({ coordinates: [lng, lat], address })
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const checkErrors = () => {
    let location_details: any = locationDetails;
    if (!location_details?.location?.coordinates?.length && !location_details?.location_name?.length && !address?.length) {
      return true;
    }
    return false;
  }

  // Please enable the location permission from the settings so that Tickt app can access your location
  return (
    <div className="app_wrapper">
      <div className="section_wrapper">
        <div className="custom_container">
          <div className="form_field">
            <div className="flex_row">
              <div className="flex_col_sm_5">
                <div className="relate">
                  <button className="back" onClick={handleStepBack}></button>
                  <span className="title">Location</span>
                </div>
                <p className="commn_para">Type the place for your job</p>
              </div>
            </div>
          </div>
          <div className="flex_row">
            <div className="flex_col_sm_5">
              <div className="form_field">

                <div className={`text_field ${address.length > 2 ? 'none' : ''}`}>
                  <input
                    placeholder='Type a State, city or suburb'
                    value={address}
                    id="location_search_static"
                    onChange={(e) => setAddress((e.target.value).trimLeft())}
                    autoComplete="off"
                  />
                </div>


                <PlacesAutocomplete
                  value={address}
                  onChange={(value) => {
                    setLocationSelected(false);
                    setAddress((value).trimLeft())
                  }}
                  searchOptions={searchOptions}
                  onSelect={handleSelect}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }: any) => (
                    <div>
                      <div className="text_field">
                        <input
                          id="location_search_dynamic"
                          {...getInputProps({
                            placeholder: 'Type a State, city or suburb',
                            className: `${address?.length < 2 ? 'none' : 'location-search-input detect_input'}`,
                          })}
                        />
                        <span className={`${address?.length < 2 ? 'none' : 'detect_icon'}`}>
                          <img
                            src={cross}
                            alt="cross"
                            onClick={() => {
                              setAddress('');
                              // setLocation({});
                              setLocation({ coordinates: [], address: '' })
                              setLocationSelected(false);
                            }} />
                        </span>
                      </div>
                      <div className="autocomplete-drop-down-map-container">
                        {loading && <div>Loading...</div>}
                        {!locationSelected && !loading && !suggestions?.length && address?.length > 2 && !locationDetails?.location?.coordinates?.length ?
                          (<div className="loc_suggestions">
                            {'No Result Found.'}
                          </div>)
                          : ''}
                        {!locationSelected && !loading && suggestions?.length && address?.length > 2 ?
                          suggestions.map((suggestion: any) => {
                            const className = suggestion.active
                              ? 'suggestion-item--active'
                              : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                              : { backgroundColor: '#ffffff', cursor: 'pointer' };
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                })}
                              >
                                <div className="loc_suggestions">{suggestion.description}</div>
                              </div>
                            );
                          }) : null}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>

                <span className="error_msg">{error}</span>
              </div>

              <div className="form_field">
                <button
                  className={activeCurrent ? 'location-btn fill_btn' : "location-btn"}
                  onClick={getCurrentLocation}>
                  <span className="gps_icon">
                    <img src={icgps} alt="gps-icon" />
                  </span>
                  {'Use my current location'}
                </button>
              </div>

              <div className="form_field">
                <button
                  className={`fill_btn full_btn btn-effect ${checkErrors() ? 'disable_btn' : ''}`}
                  onClick={handleContinue}>Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

export default AddLocation;
