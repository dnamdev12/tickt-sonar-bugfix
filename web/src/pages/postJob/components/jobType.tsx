import { useEffect, useState } from "react";

interface Proptypes {
  categories: any;
  jobTypes: any;
  data: any;
  editDetailPage: any;
  stepCompleted: boolean;
  handleStepComplete: (data: any) => void;
  handleStepBack: () => void;
  handleStepForward: (data: any) => void;
  handleStepJustUpdate: (data: any, goto: any) => void;
}

const JobType = ({
  categories: categoriesData,
  jobTypes,
  data,
  stepCompleted,
  editDetailPage,
  handleStepForward,
  handleStepJustUpdate,
  handleStepComplete,
  handleStepBack,
}: Proptypes) => {

  const [jobTypeDetails, setJobTypeDetails] = useState<{
    [index: string]: string[];
  }>({ categories: [], job_type: [], specialization: [] });
  const [errors, setErrors] = useState({
    job_type: "",
    categories: "",
    specialization: "",
  });
  const [continueClicked, setContinueClicked] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);

  const specializations: Array<{ _id: string; name: string }> = [];
  const categoriesHTML: JSX.Element[] = [];

  const { job_type, categories, specialization } = jobTypeDetails;

  categoriesData.forEach(
    ({
      _id,
      trade_name,
      selected_url,
      specialisations,
    }: {
      _id: string;
      trade_name: string;
      selected_url: string;
      specialisations: [];
    }) => {
      if (categories.includes(_id)) {
        specializations.push(...specialisations);
      }

      categoriesHTML.push(
        <li
          key={_id}
          className={categories.includes(_id) ? "active" : undefined}
          onClick={() => {
            handleChange(_id, "categories");
            setSelectedAll(false);
          }}
        >
          <figure>
            <img src={selected_url} alt="cat-icon" />
          </figure>
          <span className="name">{trade_name}</span>
        </li>
      );
    }
  );

  useEffect(() => {
    if (stepCompleted) {
      let checkSelected = false;

      if (categoriesData?.length) {
        let preSelectedSpec = [];
        preSelectedSpec = categoriesData.find(
          (item: any) => item._id === data.categories[0]
        ).specialisations;

        if (preSelectedSpec?.length === data.specialization?.length) {
          checkSelected = true;
        }

        if (preSelectedSpec?.length && !data.specialization?.length) {
          checkSelected = true;
        }
      }

      setJobTypeDetails({
        categories: data.categories,
        job_type: data.job_type,
        specialization: checkSelected ? [] : data.specialization,
      });

      console.log({ checkSelected });
      setSelectedAll(checkSelected);
    }
  }, [stepCompleted, data]);

  // for error messages
  const label: { [index: string]: string } = {
    job_type: "Job Type",
    categories: "Categories",
    specialization: "Specialization",
  };

  const isEmpty = (name: string, value: string[]) =>
    !value.length ? `${label[name]} is required.` : "";

  const isInvalid = (name: string, value: string[]) => {
    switch (name) {
      case "job_type":
        return isEmpty(name, value);
      case "categories":
        return isEmpty(name, value);
      case "specialization":
        return isEmpty(name, value);
    }
  };

  // update errors and jobDetails
  const updateDetails = (value: string[], name: string) => {
    if (stepCompleted || continueClicked) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: isInvalid(name, value),
      }));
    }

    setJobTypeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // function callable on handle change
  const handleChange = (value: string, name: string) => {
    if (jobTypeDetails[name].includes(value)) {
      updateDetails(
        jobTypeDetails[name].filter((val) => val !== value),
        name
      );

      // when category is deselected, remove it's specialization
      if (name === "categories") {
        const specializationsToBeRemoved =
          categoriesData
            .find(({ _id }: { _id: string }) => _id === value)
            .specialisations?.map(({ _id }: { _id: string }) => _id) || [];
        let itemsSpec = jobTypeDetails.specialization.filter(
          (value) => !specializationsToBeRemoved.includes(value)
        );
        updateDetails(itemsSpec, "specialization");
        updateDetails([], "categories");
      }
    } else {
      if (name !== "specialization") {
        jobTypeDetails[name] = [value];
        updateDetails(jobTypeDetails[name], name);
      } else {
        updateDetails(jobTypeDetails[name].concat([value]), name);
      }
    }
  };

  const handleContinue = () => {
    let hasErrors;

    if (selectedAll) {
      setJobTypeDetails((prev: any) => ({
        ...prev,
        specialization: specializations.map((item: any) => item._id),
      }));
    }
    if (!continueClicked) {
      setContinueClicked(true);

      hasErrors = Object.keys(jobTypeDetails).reduce((prevError, name) => {
        let hasError = !!isInvalid(name, jobTypeDetails[name]);

        if (name === "specialization" && hasError) {
          hasError = false;
        }

        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: isInvalid(name, jobTypeDetails[name]),
        }));

        return hasError || prevError;
      }, false);
    }

    if (!hasErrors) {
      let dataItems = jobTypeDetails;

      if (jobTypeDetails?.specialization?.length === 0) {
        if (selectedAll) {
          dataItems["specialization"] = specializations.map(
            (item: any) => item._id
          );
        }
      }

      if (editDetailPage?.currentScreen) {
        handleStepJustUpdate(dataItems, true);
      } else {
        handleStepComplete(dataItems);
      }
    } else {
      setContinueClicked(false);
    }
  };

  const checkErrors = () => {
    let error_1 = isInvalid("categories", jobTypeDetails["categories"]);
    let error_2 = isInvalid("job_type", jobTypeDetails["job_type"]);
    let error_3 = isInvalid("specialization", jobTypeDetails["specialization"]);

    if (
      !error_1?.length &&
      !error_2?.length &&
      (selectedAll || (!error_3?.length && specializations?.length))
    ) {
      return false;
    }
    return true;
  };

  return (
    <div className="app_wrapper">
      <div className="section_wrapper">
        <div className="custom_container">
          <div className="form_field">
            <div className="flex_row">
              <div className="flex_col_sm_5">
                {editDetailPage?.currentScreen ? (
                  <div className="relate">
                    <button
                      className="back"
                      onClick={() => {
                        handleStepForward(14);
                      }}
                    ></button>
                    <span className="title">Job type</span>
                  </div>
                ) : (
                  <div className="relate">
                    <button className="back" onClick={handleStepBack}></button>
                    <span className="title">Job type</span>
                  </div>
                )}

                <p className="commn_para">
                  Select the category and the specialisations required
                </p>
              </div>
            </div>
          </div>
          <div className="form_field">
            <span className="xs_sub_title">Categories</span>
          </div>
          <div className="select_sphere">
            <ul>{categoriesHTML}</ul>
            <span className="error_msg">{errors.categories}</span>
          </div>
          <div className="form_field">
            <span className="xs_sub_title">Job Types</span>
          </div>
          <ul className="job_categories">
            {jobTypes && Array.isArray(jobTypes)
              ? jobTypes.map(
                  ({
                    _id,
                    name,
                    image,
                  }: {
                    _id: string;
                    name: string;
                    image: string;
                  }) => (
                    <li
                      key={_id}
                      className={`${job_type.includes(_id) ? " active" : ""}`}
                      onClick={() => handleChange(_id, "job_type")}
                    >
                      <figure className="type_icon">
                        <img src={image} alt="icon" />
                      </figure>
                      <span className="name">{name}</span>
                    </li>
                  )
                )
              : null}
          </ul>
          <span className="error_msg">{errors.job_type}</span>
          <div className="form_field">
            <span className="xs_sub_title">{"Specialisation"}</span>
          </div>
          <div className="flex_row">
            <div className="flex_col_sm_6">
              <div className="tags_wrap">
                <ul>
                  {specializations?.length >= 0 && categories?.length > 0 && (
                    <li
                      onClick={() => {
                        if (!selectedAll) {
                          setSelectedAll(true);
                        }
                        updateDetails([], "specialization");
                      }}
                      className={selectedAll ? "selected" : ""}
                    >
                      {"All"}
                    </li>
                  )}
                  {specializations.map(
                    ({ _id, name }: { _id: string; name: string }) => {
                      return (
                        <li
                          key={_id}
                          className={
                            specialization.includes(_id) && !selectedAll
                              ? "selected"
                              : undefined
                          }
                          onClick={() => {
                            handleChange(_id, "specialization");
                            if (selectedAll) {
                              setSelectedAll(false);
                            }
                          }}
                        >
                          {name}
                        </li>
                      );
                    }
                  )}
                </ul>
                <span className="error_msg">
                  {!selectedAll ? errors.specialization : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="form_field">
            <button
              className={`fill_btn full_btn btn-effect ${
                checkErrors() ? "disable_btn" : ""
              }`}
              onClick={() => {
                if (selectedAll) {
                  updateDetails(
                    specializations.map((item: any) => item._id),
                    "specialization"
                  );
                }

                handleContinue();
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobType;
