import { useEffect, useState } from "react";
import storageService from "../../../utils/storageService";
import Modal from "@material-ui/core/Modal";
import DigitalIdVerification from "./digitalIdVerification";
import cancel from "../../../assets/images/ic-cancel.png";
import verifiedIcon from "../../../assets/images/checked-2.png";
import { moengage, mixPanel } from "../../../services/analyticsTools";
import { MoEConstants } from "../../../utils/constants";

interface BankDetails {
  userId: string;
  account_name: string;
  account_number: string;
  bsb_number: string;
  accountVerified: boolean;
  stripeAccountId: string;
}

interface Props {
  getBankDetails: () => void;
  addBankDetails: (data: any) => void;
  updateBankDetails: (data: any) => void;
  bankDetails: BankDetails;
}

const digitalInfoPoints: Array<string> = [
  "Passport",
  "Driver Licence (Driver's license) - scans of front and back are required",
  "Photo Card - scans of front and back are required",
  "New South Wales Driving Instructor Licence - scans of front and back are required",
  "Tasmanian Government Personal Information Card - scans of front and back are required",
  "ImmiCard - scans of front and back are required",
  "Proof of Age card - scans of front and back are required",
  "Australian Defence Force (ADF) identification card (Military ID) - scans of front and back are required",
];

const BankingDetails = ({
  getBankDetails,
  addBankDetails,
  updateBankDetails,
  bankDetails,
}: Props) => {
  const [data, setData] = useState<any>({
    accountVerified: false,
    account_name: "",
    account_number: "",
    bsb_number: "",
    stripeAccountId: "",
  });
  const [errors, setErrors] = useState({
    account_name: "",
    account_number: "",
    bsb_number: "",
  });
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const [digitalIdInfo, setDigitalIdInfo] = useState<boolean>(false);
  const [idVerifClicked, setIdVerifClicked] = useState<boolean>(false);

  const errorLabel = {
    account_number: "Account Number",
    account_name: "Account Name",
    bsb_number: "BSB Number",
  } as { [key: string]: string };

  useEffect(() => {
    getBankDetails();
  }, [getBankDetails]);

  useEffect(() => {
    setData(
      Object.keys(bankDetails).length
        ? bankDetails
        : {
            accountVerified: false,
            account_name: "",
            account_number: "",
            bsb_number: "",
            stripeAccountId: "",
          }
    );
  }, [bankDetails]);

  const validate = (name: string, value: string) => {
    if (value && !value.trimLeft()) {
      return `${errorLabel[name]} is required`;
    }
    switch (name) {
      case "account_number":
        return value.length > 10
          ? "Maximum 10 digits are allowed"
          : value.length < 6
          ? "Minimum 6 digits are required"
          : "";
      case "bsb_number":
        return !/^\d{3}-\d{3}$/.test(value)
          ? "Please enter valid BSB Number like 123-444"
          : "";
    }

    return "";
  };
  const [input, setInput] = useState<any>();

  const handleChange = ({ target: { name, value } }: any) => {
    if (name === "bsb_number") {
      setInput(value);
      if (value.length === 4 && value.includes("-")) {
        setInput(value.replace("-", ""));
      }
      if (value.length === 3) {
        setInput(value + "-");
        setData((prevData: any) => ({
          ...prevData,
          bsb_number: input,
        }));
      }
    }
    setData((prevData: any) => ({
      ...prevData,
      [name]: value?.trimLeft(),
    }));

    if (submitClicked) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validate(name, value),
      }));
    }
  };

  const handleSave = () => {
    if (!submitClicked) {
      setSubmitClicked(true);
    }

    const hasErrors = Object.keys(data).reduce((prevValue, name) => {
      const error = validate(name, data[name]);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));

      return prevValue || error;
    }, "");

    const updatedBankDetails = {
      account_name: data.account_name?.trim(),
      account_number: data.account_number,
      bsb_number: data.bsb_number,
    };
    console.log(data.bsb_number, "33333333333#####################");
    if (!hasErrors) {
      if (bankDetails.userId) {
        updateBankDetails({
          userId: data.userId,
          ...updatedBankDetails,
        });
      } else {
        addBankDetails(updatedBankDetails);
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
        };
        moengage.moE_SendEvent(MoEConstants.ADDED_PAYMENT_DETAILS, mData);
        mixPanel.mixP_SendEvent(MoEConstants.ADDED_PAYMENT_DETAILS, mData);
      }
    }
  };
  const userType = storageService.getItem("userType");
  const updated =
    data.account_name?.trim() !== bankDetails.account_name?.trim() ||
    data.account_number !== bankDetails.account_number ||
    data.bsb_number !== bankDetails.bsb_number;

  return idVerifClicked ? (
    <DigitalIdVerification
      setIdVerifClicked={setIdVerifClicked}
      stripeAccountId={data.stripeAccountId}
    />
  ) : (
    <div className="flex_row">
      <div className="flex_col_sm_8">
        <span className="sub_title">Payment details</span>
        <span className="info_note">
          {userType === 1
            ? "Enter your Bank account details"
            : "Enter your card details"}
        </span>
        <div className="form_field">
          <label className="form_label">Account Name</label>
          <div className="text_field">
            <input
              type="text"
              placeholder="Enter Account Name"
              name="account_name"
              value={data.account_name}
              onChange={handleChange}
              maxLength={50}
            />
          </div>
          <span className="error_msg">{errors.account_name}</span>
        </div>
        <div className="form_field">
          <label className="form_label">BSB Number</label>

          <div className="text_field">
            {console.log(data.bsb_number, "12@@@@@@@@@@@@")}
            <input
              type="text"
              placeholder="Enter BSB Number"
              name="bsb_number"
              value={input}
              onChange={handleChange}
              maxLength={7}
            />
          </div>
          <span className="error_msg">{errors.bsb_number}</span>
        </div>
        <div className="form_field">
          <label className="form_label">Account Number</label>
          <div className="text_field">
            <input
              type="number"
              placeholder="Enter Account Number"
              name="account_number"
              value={data.account_number}
              onChange={handleChange}
              maxLength={10}
              max={9999999999}
            />
          </div>
          <span className="error_msg">{errors.account_number}</span>
        </div>

        {data.account_name &&
          data.account_number &&
          data.bsb_number &&
          data.stripeAccountId && (
            <>
              <div className="form_field">
                <button
                  className="fill_grey_btn full_btn btn-effect id_verified"
                  onClick={() => {
                    if (data?.accountVerified) return;
                    setIdVerifClicked(true);
                  }}
                >
                  {data?.accountVerified && (
                    <img src={verifiedIcon} alt="verified" />
                  )}
                  {`${
                    data?.accountVerified
                      ? "ID Verified"
                      : "Add ID Verification"
                  }`}
                </button>
              </div>
              <span
                className="show_label id_info"
                onClick={() => setDigitalIdInfo(true)}
              >
                ID verification is required as part of Stripe ID verification
                process.
              </span>
            </>
          )}

        <button
          className={`fill_btn full_btn btn-effect${
            !updated ? " disabled" : ""
          }`}
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>

      <Modal
        className="custom_modal"
        open={digitalIdInfo}
        onClose={() => setDigitalIdInfo(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          className="custom_wh profile_modal"
          data-aos="zoom-in"
          data-aos-delay="30"
          data-aos-duration="1000"
        >
          <div className="heading">
            <span className="sub_title">ID verification</span>
            <button
              className="close_btn"
              onClick={() => setDigitalIdInfo(false)}
            >
              <img src={cancel} alt="cancel" />
            </button>
          </div>
          <div className="inner_wrap">
            <span className="show_label">
              ID verification is required as part of Stripe ID verification
              process.
            </span>
            <span className="show_label">
              Below is a spansting of documents that can accept as proof of
              identity, address, and entity.
            </span>
            <ul className="verificationid_list">
              {digitalInfoPoints.map((info, index) => (
                <li className="show_label" key={index}>
                  {info}
                </li>
              ))}
            </ul>
            <div className="bottom_btn custom_btn center">
              <button
                className={`fill_btn full_btn btn-effect`}
                onClick={() => setDigitalIdInfo(false)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BankingDetails;
