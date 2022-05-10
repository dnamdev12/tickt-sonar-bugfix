import React, { Component } from "react";
import _ from "lodash";
import Modal from "@material-ui/core/Modal";
import NumberFormat from "react-number-format";
import Constants, { MoEConstants } from "../../../../utils/constants";
import regex from "../../../../utils/regex";
import { portfolioModal } from "../../../builderInfo/builderInfo";
import ChangeEmailModal from "./changeEmailModal/changeEmailModal";
import {
  tradieUpdateProfileDetails,
  tradieUpdateBasicDetails,
  tradieUpdatePassword,
  tradieAddPortfolioJob,
  tradieUpdatePortfolioJob,
  tradieDeletePortfolioJob,
  tradieChangeEmail,
} from "../../../../redux/profile/actions";
import { onFileUpload } from "../../../../redux/auth/actions";
import { setShowToast } from "../../../../redux/common/actions";

import portfolioPlaceholder from "../../../../assets/images/portfolio-placeholder.jpg";
import dotMenu from "../../../../assets/images/menu-dot.png";
import dummy from "../../../../assets/images/u_placeholder.jpg";
import cameraBlack from "../../../../assets/images/camera-black.png";
import editIconBlue from "../../../../assets/images/ic-edit-blue.png";
import profilePlaceholder from "../../../../assets/images/ic-placeholder-detail.png";
import cancel from "../../../../assets/images/ic-cancel.png";
import remove from "../../../../assets/images/icon-close-1.png";
import addMedia from "../../../../assets/images/add-image.png";
import addMediaLrg from "../../../../assets/images/add-image-lg.png";
import spherePlaceholder from "../../../../assets/images/ic_categories_placeholder.svg";
import eyeIconClose from "../../../../assets/images/icon-eye-closed.png";
import eyeIconOpen from "../../../../assets/images/icon-eye-open.png";
import removeFile from "../../../../assets/images/icon-close-1.png";
import jpegFile from "../../../../assets/images/jpeg.png";
import jpgFile from "../../../../assets/images/jpg.png";
import pngFile from "../../../../assets/images/png.png";
import pdfFile from "../../../../assets/images/pdf.png";
import docFile from "../../../../assets/images/doc.png";
import viewProfile from "../../../../assets/images/view.png";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import storageService from "../../../../utils/storageService";
import { validateABN } from "../../../../utils/common";
//@ts-ignore
import Skeleton from "react-loading-skeleton";
import { updateChatUserDetails } from "../../../../services/firebase";
import { moengage, mixPanel } from "../../../../services/analyticsTools";

interface Props {
  history: any;
  tradieProfileData: any;
  builderProfile: any;
  tradieProfileViewData: any;
  tradieBasicDetailsData: any;
  tradeListData: any;
  isLoading: boolean;
  getTradieProfileView: () => void;
  getTradieBasicDetails: () => void;
  callTradeList: () => void;
  callTradieProfileData: () => void;
  getProfileBuilder: () => void;
  cleanTradieBasicDetails: () => void;
  cleanTradieProfileViewData: () => void;
}

interface State {
  errors: any;
  isToggleSidebar: boolean;
  profileModalClicked: boolean;
  areasOfSpecsModalClicked: boolean;
  aboutModalClicked: boolean;
  isAddEditPortfolioModal: boolean;
  portfolioJobClicked: boolean;
  passwordModalClicked: boolean;
  basicDetailsData: any;
  trade: Array<any>;
  specialization: Array<any>;
  allSpecializationSelected: boolean;
  about: string;
  userImage: string;
  password: string;
  showPassword: boolean;
  newPassword: string;
  showNewPassword: boolean;
  confirmNewPassword: string;
  showConfirmNewPassword: boolean;
  formData: any;
  profileViewData: any;
  localProfileView: any;
  tradeData: Array<any>;
  specializationData: Array<any>;
  portfolioJobDetail: any;
  addPortfolioJob: boolean;
  editPortfolioJob: boolean;
  deletePortfolioJob: boolean;
  portfolioJobIndex: number | null;
  confirmationModalClicked: boolean;
  changeEmailModalClicked: boolean;
  newEmail: string;
  addQualificationClicked: boolean;
  isProfileViewDataChanged: boolean;
  isEditProfileModalChanged: boolean;
  localQualificationDoc: any;
  remainingQualificationDoc: any;
}

export class PersonalInformation extends Component<Props, State> {
  private userType: any;

  constructor(props: any) {
    super(props);
    this.state = {
      errors: {},
      isToggleSidebar: false,
      profileModalClicked: false,
      areasOfSpecsModalClicked: false,
      aboutModalClicked: false,
      portfolioJobClicked: false,
      isAddEditPortfolioModal: false,
      passwordModalClicked: false,
      trade: [],
      tradeData: [],
      specialization: [],
      specializationData: [],
      allSpecializationSelected: false,
      about: "",
      userImage: "",
      password: "",
      showPassword: false,
      newPassword: "",
      showNewPassword: false,
      confirmNewPassword: "",
      showConfirmNewPassword: false,
      formData: null,
      basicDetailsData: {},
      profileViewData: {},
      localProfileView: "",
      portfolioJobDetail: "",
      addPortfolioJob: false,
      editPortfolioJob: false,
      deletePortfolioJob: false,
      portfolioJobIndex: null,
      confirmationModalClicked: false,
      changeEmailModalClicked: false,
      isProfileViewDataChanged: false,
      isEditProfileModalChanged: false,
      newEmail: "",
      addQualificationClicked: false,
      localQualificationDoc: [],
      remainingQualificationDoc: [],
    };

    this.userType = storageService.getItem("userType");
  }

  componentDidMount() {
    this.props.getTradieProfileView();
    this.props.getTradieBasicDetails();
    if (!this.props.tradeListData.length) {
      this.props.callTradeList();
    }
  }

  componentWillUnmount() {
    this.props.cleanTradieProfileViewData();
    this.props.cleanTradieBasicDetails();
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (
      nextProps.tradieProfileViewData &&
      Object.keys(prevState.profileViewData).length === 0 &&
      !_.isEqual(nextProps.tradieProfileViewData, prevState.profileViewData)
    ) {
      return {
        profileViewData: nextProps.tradieProfileViewData,
        userImage:
          nextProps.tradieProfileViewData?.tradieImage ||
          nextProps.tradieProfileViewData?.builderImage,
      };
    }
    if (
      nextProps.tradieBasicDetailsData &&
      Object.keys(prevState.basicDetailsData).length === 0 &&
      !_.isEqual(nextProps.tradieBasicDetailsData, prevState.basicDetailsData)
    ) {
      return {
        basicDetailsData: nextProps.tradieBasicDetailsData,
      };
    }
    if (
      storageService.getItem("userType") === 1 &&
      nextProps.tradeListData &&
      (!prevState.localQualificationDoc?.length ||
        !prevState.remainingQualificationDoc?.length) &&
      nextProps.tradieBasicDetailsData
    ) {
      const data = [...nextProps.tradeListData][0]?.qualifications?.map(
        (item: any) => item.name?.length && { _id: item._id, name: item.name }
      );
      const alreadyFilledQualificationDoc: Array<any> =
        nextProps.tradieBasicDetailsData?.qualificationDoc?.map(
          ({ qualification_id }: { qualification_id: string }) =>
            qualification_id?.length && qualification_id
        );
      const remainingQualificationDoc = data?.filter(
        ({ _id }: { _id: string }) =>
          !alreadyFilledQualificationDoc?.includes(_id)
      );
      return {
        localQualificationDoc: data ? data : [],
        remainingQualificationDoc: remainingQualificationDoc
          ? remainingQualificationDoc
          : [],
      };
    }
    return null;
  }

  toggleSidebar = () =>
    this.setState({ isToggleSidebar: !this.state.isToggleSidebar });

  tradeHandler = (item: any, name: string) => {
    const id = item?._id;
    if (name === "trade") {
      if (this.state.trade.length && this.state.trade[0] == id) {
        this.setState({
          trade: [],
          tradeData: [],
          specialization: [],
          allSpecializationSelected: false,
        });
      } else {
        this.setState({
          trade: [id],
          tradeData: [
            {
              tradeId: id,
              tradeName: item?.trade_name,
              tradeSelectedUrl: item?.selected_url,
            },
          ],
          specialization: [],
          allSpecializationSelected: false,
        });
      }
    } else if (name === "specializationId") {
      this.setState((state: any) => {
        var newData = [...state.specialization];
        var newSpecsData = [...state.specializationData];
        if (state.allSpecializationSelected) {
          newData = [];
          newSpecsData = [];
        }
        const itemIndex = newData.indexOf(id);
        if (newData.indexOf(id) < 0) {
          newData.push(id);
          newSpecsData.push({
            specializationId: id,
            specializationName: item?.name,
          });
        } else {
          newData.splice(itemIndex, 1);
          newSpecsData.splice(itemIndex, 1);
        }
        return {
          specialization: newData,
          specializationData: newSpecsData,
          allSpecializationSelected: false,
        };
      });
    } else if (name === "All Clicked") {
      if (this.state.allSpecializationSelected) {
        this.setState({
          allSpecializationSelected: false,
          specialization: [],
          specializationData: [],
        });
      } else {
        const newSpecialization = item.map(({ _id }: { _id: string }) => _id);
        const newSpecializationData = item.map(
          ({ _id, name }: { _id: string; name: string }) => {
            return {
              specializationId: _id,
              specializationName: name,
            };
          }
        );
        this.setState({
          allSpecializationSelected: true,
          specialization: newSpecialization,
          specializationData: newSpecializationData,
        });
      }
    } else if (name === "Clear All") {
      this.setState({
        allSpecializationSelected: false,
        trade: [],
        tradeData: [],
        specialization: [],
        specializationData: [],
      });
    }
  };

  submitAreasOfTrade = () => {
    const newData = { ...this.state.profileViewData };
    newData.areasOfSpecialization.tradeData = this.state.tradeData;
    newData.areasOfSpecialization.specializationData =
      this.state.specializationData;
    this.setState({
      profileViewData: newData,
      areasOfSpecsModalClicked: false,
      isProfileViewDataChanged: true,
    });
  };

  onFileChange = async (e: any, type?: string, id?: string) => {
    const formData = new FormData();
    const newFile = e.target.files[0];
    var uploadFileName = newFile?.name?.split(".");
    uploadFileName?.pop();
    uploadFileName = uploadFileName?.join(".");
    var fileType = newFile?.type?.split("/")[1]?.toLowerCase();
    const docTypes: Array<any> = [
      "jpeg",
      "jpg",
      "png",
      "pdf",
      "msword",
      "doc",
      "docx",
      "vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const docTypes2: Array<any> = ["jpeg", "jpg", "png"];
    var selectedFileSize = newFile?.size / 1024 / 1024;
    if (type === "profileImage" || type === "addJobPhotos") {
      if (docTypes2.indexOf(fileType) < 0 || selectedFileSize > 10) {
        alert("The file must be in proper format or size");
        return;
      }
    } else if (docTypes.indexOf(fileType) < 0 || selectedFileSize > 10) {
      alert("The file must be in proper format or size");
      return;
    }
    formData.append("file", newFile);
    if (type === "profileImage") {
      this.setState({
        userImage: URL.createObjectURL(newFile),
        formData: formData,
        isProfileViewDataChanged: true,
      });
    }
    if (type === "addJobPhotos") {
      const res = await onFileUpload(formData);
      if (res.success) {
        const data: any = { ...this.state.portfolioJobDetail };
        data?.portfolioImage?.push(res.imgUrl);
        this.setState({ portfolioJobDetail: data });
      }
    }
    if (type === "filledQualification") {
      const res = await onFileUpload(formData);
      if (res.success) {
        const newBasicData: any = { ...this.state.basicDetailsData };
        const newqualificationDoc: Array<any> = newBasicData?.qualificationDoc;
        const item = newqualificationDoc?.find(
          (i) => i.qualification_id === id
        );
        item.url = res.imgUrl;
        item.fileName = uploadFileName;
        this.setState({
          basicDetailsData: newBasicData,
          isEditProfileModalChanged: true,
        });
      }
    }
    if (type === "remainingQualification") {
      const res = await onFileUpload(formData);
      if (res.success) {
        const data: Array<any> = [...this.state.remainingQualificationDoc];
        const item = data?.find((i) => i._id === id);
        item.url = res.imgUrl;
        item.fileName = uploadFileName;
        this.setState({
          remainingQualificationDoc: data,
          isEditProfileModalChanged: true,
        });
      }
    }
  };

  validateBasicDetailsForm = () => {
    const newErrors: any = {};
    if (!this.state.basicDetailsData?.fullName) {
      newErrors.fullName = Constants.errorStrings.fullNameEmpty;
    } else if (this.state.basicDetailsData?.fullName.trim()?.length > 50) {
      newErrors.fullName = "Maximum 50 characters are allowed.";
    } else {
      const nameRegex = new RegExp(regex.fullname);
      if (!nameRegex.test(this.state.basicDetailsData?.fullName.trim())) {
        newErrors.fullName = Constants.errorStrings.fullNameErr;
      }
    }

    if (!this.state.basicDetailsData?.mobileNumber) {
      newErrors.mobileNumber = Constants.errorStrings.phoneNumberEmpty;
    } else {
      const phoneRegex = new RegExp(regex.mobile);
      if (!phoneRegex.test(this.state.basicDetailsData?.mobileNumber)) {
        newErrors.mobileNumber = Constants.errorStrings.phoneNumberErr;
      }
    }

    if (!this.state.basicDetailsData?.abn) {
      newErrors.abn = Constants.errorStrings.abnEmpty;
    } else {
      const abnRegex = new RegExp(regex.abn);
      if (!abnRegex.test(this.state.basicDetailsData.abn.replaceAll(" ", ""))) {
        newErrors.abn = Constants.errorStrings.abnErr;
      }
      if (!validateABN(this.state.basicDetailsData.abn.replaceAll(" ", ""))) {
        newErrors.abn = Constants.errorStrings.abnErr;
      }
    }

    if (this.userType === 1) {
      const newQualificationDoc =
        this.state.basicDetailsData?.qualificationDoc?.find(
          ({ url, isSelected }: { url: string; isSelected: string }) =>
            !url?.length && !isSelected?.length
        );
      if (
        !!newQualificationDoc &&
        Object.keys(newQualificationDoc)?.length > 0
      ) {
        setShowToast(true, "Please upload all selected documents");
        return;
      }

      const newRemainingDoc = this.state.remainingQualificationDoc?.find(
        ({ url, isSelected }: { url: string; isSelected: string }) =>
          !url?.length && isSelected?.length
      );
      console.log(newRemainingDoc, "newRemainingDoc validation");
      if (!!newRemainingDoc && Object.keys(newRemainingDoc)?.length > 0) {
        setShowToast(true, "Please upload all selected documents");
        return;
      }
    } else {
      if (!this.state.basicDetailsData?.companyName) {
        newErrors.companyName = Constants.errorStrings.companyNameEmpty;
      } else if (this.state.basicDetailsData?.companyName.trim()?.length > 50) {
        newErrors.companyName = "Maximum 50 characters are allowed.";
      } else {
        const nameRegex = new RegExp(regex.fullname);
        if (!nameRegex.test(this.state.basicDetailsData.companyName.trim())) {
          newErrors.companyName = Constants.errorStrings.companyNameErr;
        }
      }
      if (!this.state.basicDetailsData?.position) {
        newErrors.position = Constants.errorStrings.positionNameEmpty;
      } else if (this.state.basicDetailsData?.position.trim()?.length > 50) {
        newErrors.position = "Maximum 50 Characters Are Allowed.";
      } else {
        const positionRegex = new RegExp(regex.fullname);
        if (!positionRegex.test(this.state.basicDetailsData.position.trim())) {
          newErrors.position = Constants.errorStrings.positionNameErr;
        }
      }
    }

    this.setState({ errors: newErrors });
    return !Object.keys(newErrors).length;
  };

  validatePasswordForm = () => {
    const newErrors: any = {};
    if (!this.state.password) {
      newErrors.password = Constants.errorStrings.oldPassword;
    }
    if (!this.state.newPassword) {
      newErrors.newPassword = "New Password is required";
    } else {
      const passwordRegex = new RegExp(regex.password);
      if (!passwordRegex.test(this.state.newPassword.trim())) {
        newErrors.newPassword = Constants.errorStrings.passwordError;
      }
    }
    if (
      this.state.newPassword.trim() !== this.state.confirmNewPassword.trim()
    ) {
      newErrors.confirmNewPassword = Constants.errorStrings.confirmNewPassword;
    }
    this.setState({ errors: newErrors });
    return !Object.keys(newErrors).length;
  };

  validateChangeEmailForm = () => {
    const newErrors: any = {};
    if (!this.state.newEmail) {
      newErrors.newEmail = "New Email Address is required";
    } else {
      const emailRegex = new RegExp(regex.email);
      if (!emailRegex.test(this.state.basicDetailsData?.email)) {
        newErrors.newEmail = Constants.errorStrings.emailErr;
      }
    }

    if (!this.state.password) {
      newErrors.currentPassword = "Current Password is required";
    } else {
      const passwordRegex = new RegExp(regex.password);
      if (!passwordRegex.test(this.state.password.trim())) {
        newErrors.currentPassword = Constants.errorStrings.passwordError;
      }
    }

    this.setState({ errors: newErrors });
    return !Object.keys(newErrors).length;
  };

  changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBasicDetails = { ...this.state.basicDetailsData };
    newBasicDetails[`${e.target.name}`] = e.target.value;
    this.setState({
      basicDetailsData: newBasicDetails,
      isEditProfileModalChanged: true,
    });
  };

  submitBasicProfileDetails = async () => {
    if (this.validateBasicDetailsForm()) {
      const basicDetails = { ...this.state.basicDetailsData };
      const filledQualification =
        this.userType === 1
          ? [...this.state.basicDetailsData?.qualificationDoc]?.map(
              ({
                url,
                qualification_id,
              }: {
                url: string;
                qualification_id: string;
              }) =>
                url?.length && { qualification_id: qualification_id, url: url }
            )
          : [];
      const newFilledQualification = filledQualification?.filter(
        (i: any) => i && Object.keys(i)?.length > 0
      );
      const remainingQualification = this.state.remainingQualificationDoc?.map(
        ({ _id, url }: { _id: string; url: string }) =>
          url?.length && { qualification_id: _id, url: url }
      );
      const newRemainingQualification = remainingQualification?.filter(
        (i: any) => i && Object.keys(i)?.length > 0
      );

      const builderData = {
        companyName: basicDetails?.companyName,
        position: basicDetails?.position,
      };

      const data = {
        fullName: basicDetails?.fullName,
        mobileNumber: basicDetails?.mobileNumber,
        email: basicDetails?.email,
        abn: basicDetails?.abn,
        qualificationDoc:
          this.userType === 1
            ? [...newFilledQualification, ...newRemainingQualification]
            : undefined,
        ...(this.userType === 1 ? {} : builderData),
        ...(this.userType === 1 && {
          businessName: basicDetails?.businessName,
        }),
      };
      const res = await tradieUpdateBasicDetails(data);
      if (res?.success) {
        this.props.cleanTradieBasicDetails();
        updateChatUserDetails("userName", data.fullName);
        basicDetails.qualificationDoc =
          this.userType === 1 ? data.qualificationDoc : [];
        this.setState((prevState: any) => ({
          profileModalClicked: false,
          addQualificationClicked: false,
          remainingQualificationDoc: [],
          basicDetailsData: basicDetails,
          isEditProfileModalChanged: false,
        }));
        this.props.getTradieBasicDetails();
        this.userType === 1
          ? this.props.callTradieProfileData()
          : this.props.getProfileBuilder();
      }
    }
  };

  passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  updatePasswordHandler = async () => {
    if (this.validatePasswordForm()) {
      const data = {
        user_type: storageService.getItem("userType"),
        oldPassword: this.state.password,
        newPassword: this.state.newPassword,
      };
      const res = await tradieUpdatePassword(data);
      if (res.success) {
        this.props.history.push("/change-password-success");
      }
    }
  };

  passwordModalCloseHandler = () => {
    this.setState({
      profileModalClicked: true,
      passwordModalClicked: false,
      password: "",
      newPassword: "",
      confirmNewPassword: "",
      showPassword: false,
      showNewPassword: false,
      showConfirmNewPassword: false,
      errors: {},
    });
  };

  changeEmailModalCloseHandler = () => {
    this.setState({
      profileModalClicked: true,
      changeEmailModalClicked: false,
      password: "",
      newEmail: "",
      showPassword: false,
      errors: {},
    });
  };

  submitPortfolioJobs = async () => {
    if (this.state.addPortfolioJob) {
      const portfolioJobDetail = this.state.portfolioJobDetail;
      const data = {
        jobName: portfolioJobDetail?.jobName,
        jobDescription: portfolioJobDetail?.jobDescription,
        url: portfolioJobDetail?.portfolioImage,
      };
      const res = await tradieAddPortfolioJob(data);
      if (res?.success) {
        moengage.moE_SendEvent(MoEConstants.ADDED_PORTFOLIO, {
          timeStamp: moengage.getCurrentTimeStamp(),
        });
        mixPanel.mixP_SendEvent(MoEConstants.ADDED_PORTFOLIO, {
          timeStamp: moengage.getCurrentTimeStamp(),
        });
        const data = { ...this.state.profileViewData };
        data.portfolio.push(res?.data);
        this.setState({
          portfolioJobDetail: "",
          profileViewData: data,
          portfolioJobClicked: false,
          isAddEditPortfolioModal: false,
          addPortfolioJob: false,
          portfolioJobIndex: null,
        });
      }
    }
    if (this.state.editPortfolioJob) {
      const portfolioJobDetail = this.state.portfolioJobDetail;
      const data = {
        portfolioId: portfolioJobDetail?.portfolioId,
        jobName: portfolioJobDetail?.jobName,
        jobDescription: portfolioJobDetail?.jobDescription,
        url: portfolioJobDetail?.portfolioImage,
      };
      const res = await tradieUpdatePortfolioJob(data);
      if (res?.success) {
        const index = this.state.portfolioJobIndex;
        const newProfileData = { ...this.state.profileViewData };
        const newPortfolio = newProfileData?.portfolio;
        newPortfolio.splice(index, 1, portfolioJobDetail);
        this.setState({
          profileViewData: newProfileData,
          portfolioJobClicked: true,
          isAddEditPortfolioModal: false,
          editPortfolioJob: false,
          portfolioJobIndex: null,
        });
        return;
      }
    }
    if (this.state.deletePortfolioJob) {
      const portfolioJobDetail = this.state.portfolioJobDetail;
      const index = this.state.portfolioJobIndex;
      const newProfileData = { ...this.state.profileViewData };
      const newPortfolio = newProfileData?.portfolio;
      newPortfolio.splice(index, 1);
      const res = await tradieDeletePortfolioJob(
        portfolioJobDetail?.portfolioId
      );
      if (res?.success) {
        this.setState({
          portfolioJobDetail: "",
          profileViewData: newProfileData,
          portfolioJobClicked: false,
          isAddEditPortfolioModal: false,
          deletePortfolioJob: false,
          confirmationModalClicked: false,
          portfolioJobIndex: null,
        });
        return;
      }
    }
  };

  closeAddEditPortofolioModal = () => {
    this.setState((prevState: any) => ({
      isAddEditPortfolioModal: false,
      portfolioJobClicked: prevState.addPortfolioJob ? false : true,
      addPortfolioJob: false,
    }));
  };

  addNewPortfolioJob = () => {
    this.setState({
      addPortfolioJob: true,
      isAddEditPortfolioModal: true,
      portfolioJobDetail: {
        jobName: "",
        jobDescription: "",
        portfolioImage: [],
      },
    });
  };

  addInfoAboutYou = () => {
    this.setState((prevState: any) => ({
      aboutModalClicked: true,
      about:
        prevState?.profileViewData?.about ||
        prevState?.profileViewData?.aboutCompany ||
        "",
    }));
  };

  submitUpdateProfile = async () => {
    const newSpecialization: Array<any> = [
      ...this.state.profileViewData?.areasOfSpecialization?.specializationData,
    ];
    var newSpecializationData: Array<any> = newSpecialization?.map(
      ({ specializationId }: { specializationId: string }) =>
        specializationId?.length > 0 && specializationId
    );
    const data = {
      fullName: this.state.basicDetailsData?.fullName,
      userImage:
        this.state.profileViewData?.tradieImage ||
        this.state.profileViewData?.builderImage,
      trade: [
        this.state.profileViewData?.areasOfSpecialization?.tradeData[0]
          ?.tradeId,
      ],
      specialization: newSpecializationData,
      about:
        this.userType === 1
          ? this.state.profileViewData?.about || ""
          : undefined,
      position:
        this.userType === 1 ? undefined : this.state.profileViewData?.position,
      companyName:
        this.userType === 1
          ? undefined
          : this.state.profileViewData?.companyName,
      aboutCompany:
        this.userType === 1
          ? undefined
          : this.state.profileViewData?.about ||
            this.state.profileViewData?.aboutCompany,
    };
    if (this.state.formData) {
      const res1 = await onFileUpload(this.state.formData);
      if (res1?.success) {
        data.userImage = res1?.imgUrl;
      }
    }
    const res2 = await tradieUpdateProfileDetails(data);
    if (res2?.success) {
      if (this.state.formData) {
        updateChatUserDetails("userImage", data.userImage);
      }
      this.setState({
        formData: null,
        isProfileViewDataChanged: false,
      });
      this.userType === 1
        ? this.props.callTradieProfileData()
        : this.props.getProfileBuilder();
      if (
        this.userType === 2 &&
        this.state.about &&
        this.state.profileViewData?.companyName !== this.state.about
      ) {
        moengage.moE_SendEvent(MoEConstants.ADDED_INFO_ABOUT_COMPANY, {
          timeStamp: moengage.getCurrentTimeStamp(),
        });
        mixPanel.mixP_SendEvent(MoEConstants.ADDED_INFO_ABOUT_COMPANY, {
          timeStamp: moengage.getCurrentTimeStamp(),
        });
      }
    }
  };

  changeEmailHandler = async () => {
    if (this.validateChangeEmailForm()) {
      const data = {
        currentEmail: this.state.basicDetailsData?.email,
        newEmail: this.state.newEmail,
        password: this.state.password,
        user_type: storageService.getItem("userType"),
      };
      const res = await tradieChangeEmail(data);
      if (res?.success) {
      }
    }
  };

  removeQualificationFileHandler = (e: any, id: string, type: string) => {
    e.stopPropagation();
    if (type === "filledQualification") {
      const newBasicData: any = { ...this.state.basicDetailsData };
      const newqualificationDoc: Array<any> = newBasicData?.qualificationDoc;
      const item = newqualificationDoc?.find((i) => i.qualification_id === id);
      item.url = "";
      item.fileName = "";
      newBasicData.qualificationDoc = newqualificationDoc;
      this.setState({ basicDetailsData: newBasicData });
    }
    if (type === "remainingQualification") {
      const data: Array<any> = [...this.state.remainingQualificationDoc];
      const item = data?.find((i) => i._id === id);
      item.url = "";
      item.fileName = "";
      this.setState({ remainingQualificationDoc: data });
    }
  };

  changeQualificationHandler = (id: string, type: string) => {
    if (type === "filledQualification") {
      const newBasicData: any = { ...this.state.basicDetailsData };
      const newqualificationDoc: Array<any> = newBasicData?.qualificationDoc;
      const item = newqualificationDoc?.find((i) => i.qualification_id === id);
      const itemIndex = newqualificationDoc?.indexOf(item);
      if (item.isSelected) {
        newqualificationDoc.splice(itemIndex, 1, {
          qualification_id: id,
          url: "",
        });
      } else {
        newqualificationDoc.splice(itemIndex, 1, {
          qualification_id: id,
          url: "",
          isSelected: "isSelected",
        });
      }
      newBasicData.qualificationDoc = newqualificationDoc;
      this.setState({ basicDetailsData: newBasicData });
    }

    if (type === "remainingQualification") {
      const newqualificationDoc: Array<any> = [
        ...this.state.remainingQualificationDoc,
      ];
      const item = newqualificationDoc?.find((i) => i._id === id);
      const itemIndex = newqualificationDoc?.indexOf(item);
      if (item.isSelected) {
        newqualificationDoc.splice(itemIndex, 1, {
          _id: id,
          url: "",
          name: item.name,
        });
      } else {
        newqualificationDoc.splice(itemIndex, 1, {
          _id: id,
          url: "",
          name: item.name,
          isSelected: "isSelected",
        });
      }
      this.setState({ remainingQualificationDoc: newqualificationDoc });
    }
  };

  qualificationFileDetails = (url: any) => {
    var fileArray = url.replace(/^.*[\\\/]/, "").split(".");
    const type = fileArray[1].toLowerCase();
    switch (type) {
      case "jpeg":
        return { fileName: fileArray[0], fileType: jpegFile };
      case "jpg":
        return { fileName: fileArray[0], fileType: jpgFile };
      case "png":
        return { fileName: fileArray[0], fileType: pngFile };
      case "pdf":
        return { fileName: fileArray[0], fileType: pdfFile };
      case "doc":
        return { fileName: fileArray[0], fileType: docFile };
      case "docx":
        return { fileName: fileArray[0], fileType: docFile };
      default:
        return null;
    }
  };

  editProfileCloseHandler = () => {
    this.setState((prevState: any) => ({
      profileModalClicked: false,
      basicDetailsData: this.props.tradieBasicDetailsData
        ? this.props.tradieBasicDetailsData
        : {},
      addQualificationClicked: false,
      remainingQualificationDoc: [],
      errors: {},
    }));
  };

  render() {
    let props: any = this.props;
    let {
      errors,
      profileModalClicked,
      areasOfSpecsModalClicked,
      aboutModalClicked,
      isAddEditPortfolioModal,
      portfolioJobClicked,
      passwordModalClicked,
      basicDetailsData,
      trade,
      specialization,
      allSpecializationSelected,
      about,
      userImage,
      profileViewData,
      password,
      showPassword,
      newPassword,
      showNewPassword,
      confirmNewPassword,
      showConfirmNewPassword,
      portfolioJobDetail,
      addPortfolioJob,
      confirmationModalClicked,
      changeEmailModalClicked,
      isProfileViewDataChanged,
      isEditProfileModalChanged,
      addQualificationClicked,
      localQualificationDoc,
      remainingQualificationDoc,
    } = this.state;

    const tradeList: any = props.tradeListData;
    const isSkeletonLoading: any = props.isSkeletonLoading;
    const specializationList = props.tradeListData.find(
      ({ _id }: { _id: string }) => _id === trade[0]
    )?.specialisations;

    return (
      <>
        <div className="flex_row f_col">
          <div className="flex_col_sm_4">
            <div className="upload_profile_pic">
              {isSkeletonLoading ? (
                <Skeleton height={240} />
              ) : (
                <figure className="user_img">
                  <img src={userImage ? userImage : dummy} alt="Profile-pic" />
                  <label className="camera" htmlFor="upload_profile_pic">
                    <img src={cameraBlack} alt="camera" />
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    style={{ display: "none" }}
                    id="upload_profile_pic"
                    onChange={(e) => this.onFileChange(e, "profileImage")}
                  />
                </figure>
              )}
            </div>
          </div>
          <div className="flex_col_sm_8">
            <div className="title_view_wrap">
              {isSkeletonLoading ? (
                <Skeleton />
              ) : (
                <span
                  className="title line-2"
                  title={basicDetailsData?.fullName}
                >
                  {basicDetailsData?.fullName}
                  <span
                    className="edit_icon"
                    title="Edit"
                    onClick={() => this.setState({ profileModalClicked: true })}
                  >
                    <img src={editIconBlue} alt="edit" />
                  </span>
                </span>
              )}
              {isSkeletonLoading ? (
                <Skeleton />
              ) : (
                <a
                  href="javascript:void(0)"
                  className="view_profile"
                  onClick={() => {
                    props.cleanTradieProfileViewData();
                    props.history.push(
                      `/${this.userType === 1 ? "tradie" : "builder"}-info?${
                        this.userType === 1 ? "trade" : "builder"
                      }Id=${basicDetailsData?.userId}`
                    );
                  }}
                >
                  <img src={viewProfile} alt="view-profile" />
                  View public profile
                </a>
              )}
            </div>

            <span className="tagg">
              {isSkeletonLoading ? <Skeleton /> : basicDetailsData?.position}
            </span>

            <div className="flex_row">
              <div className="flex_col_sm_4 w85per">
                <div className="job_progress_wrap" id="scroll-progress-bar">
                  {isSkeletonLoading ? (
                    <Skeleton count={2} />
                  ) : (
                    <div className="progress_wrapper">
                      <span className="show_label">Complete your profile</span>
                      <span className="approval_info">
                        {this.userType === 1
                          ? this.props.tradieProfileData?.profileCompleted
                          : this.props.builderProfile?.profileCompleted}
                      </span>
                      <span className="progress_bar">
                        <input
                          className="done_progress"
                          id="progress-bar"
                          type="range"
                          min="0"
                          value={parseInt(
                            this.userType === 1
                              ? this.props.tradieProfileData?.profileCompleted
                              : this.props.builderProfile?.profileCompleted
                          )}
                        />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ul className="review_job">
              {isSkeletonLoading ? (
                <Skeleton />
              ) : (
                <li>
                  <span className="icon reviews">
                    {profileViewData?.ratings || "0"}
                  </span>
                  <span className="review_count">{`${
                    profileViewData?.reviewsCount || "0"
                  } reviews`}</span>
                </li>
              )}
              {isSkeletonLoading ? (
                <Skeleton />
              ) : (
                <li>
                  <span className="icon job">
                    {profileViewData?.jobCompletedCount}
                  </span>
                  <span className="review_count"> jobs completed</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <Modal
          className="custom_modal"
          open={profileModalClicked}
          onClose={this.editProfileCloseHandler}
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
              <span className="sub_title">Edit Profile</span>
              <button
                className="close_btn"
                onClick={this.editProfileCloseHandler}
              >
                <img src={cancel} alt="cancel" />
              </button>
            </div>
            <div className="inner_wrap">
              <div className="inner_wrappr">
                <div className="form_field">
                  <label className="form_label">Full Name</label>
                  <div className="text_field">
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      name="fullName"
                      value={basicDetailsData?.fullName}
                      onChange={this.changeHandler}
                    />
                  </div>
                  {!!errors?.fullName && (
                    <span className="error_msg">{errors?.fullName}</span>
                  )}
                </div>
                <div className="form_field">
                  <label className="form_label">Mobile Number</label>
                  <div className="text_field f_spacebw">
                    <span className="show_label">{`+61 ${basicDetailsData?.mobileNumber}`}</span>
                  </div>
                  {!!errors?.mobileNumber && (
                    <span className="error_msg">{errors?.mobileNumber}</span>
                  )}
                </div>
                <div className="form_field">
                  <label className="form_label">Email</label>
                  <div className="text_field f_spacebw">
      
                    <span className="show_label">
                      {basicDetailsData?.email}
                    </span>
                  </div>
                  {!!errors?.email && (
                    <span className="error_msg">{errors?.email}</span>
                  )}
                </div>
                {storageService.getItem("userInfo")?.accountType ===
                  "normal" && (
                  <div className="form_field f_spacebw">
                    <a
                      className="link"
                      onClick={() =>
                        this.setState({
                          changeEmailModalClicked: true,
                          profileModalClicked: false,
                        })
                      }
                    >
                      {" "}
                      Change Email
                    </a>
                    <a
                      className="link"
                      onClick={() =>
                        this.setState({
                          passwordModalClicked: true,
                          profileModalClicked: false,
                        })
                      }
                    >
                      Change Password
                    </a>
                  </div>
                )}

                {this.userType === 1 && (
                  <div className="form_field">
                    <label className="form_label">Business Name</label>
                    <div className="text_field">
                      <input
                        type="text"
                        placeholder="Enter Business Name"
                        name="businessName"
                        value={basicDetailsData?.businessName}
                        onChange={this.changeHandler}
                      />
                    </div>
                    {!!errors?.businessName && (
                      <span className="error_msg">{errors?.businessName}</span>
                    )}
                  </div>
                )}
                {this.userType === 1 && (
                  <div className="form_field">
                    <label className="form_label">
                      Australian Business Number
                    </label>
                    <div className="text_field">
                      <NumberFormat
                        value={basicDetailsData?.abn}
                        displayType={"input"}
                        type={"tel"}
                        placeholder="51 824 753 556"
                        format="## ### ### ###"
                        isNumericString={true}
                        onValueChange={(values) => {
                          const { formattedValue, value } = values;
                          const newBasicDetails = {
                            ...this.state.basicDetailsData,
                          };
                          newBasicDetails.abn = value;
                          this.setState({
                            basicDetailsData: newBasicDetails,
                            isEditProfileModalChanged: true,
                          });
                        }}
                      />
                    </div>
                    {!!errors?.abn && (
                      <span className="error_msg">{errors?.abn}</span>
                    )}
                  </div>
                )}

                {this.userType === 1 && (
                  <div className="form_field">
                    <label className="form_label">
                      Qualification documents{" "}
                    </label>

                    {basicDetailsData?.qualificationDoc?.length > 0 &&
                      localQualificationDoc.length > 0 && (
                        <>
                          {basicDetailsData?.qualificationDoc?.map(
                            ({
                              qualification_id,
                              url,
                              isSelected,
                              fileName,
                            }: {
                              qualification_id: string;
                              url: string;
                              isSelected: string;
                              fileName: string;
                            }) => {
                              const qualificationName: string =
                                localQualificationDoc.find(
                                  ({ _id }: { _id: string }) =>
                                    _id === qualification_id
                                )?.name;
                              const docDetails: any =
                                url && this.qualificationFileDetails(url);
                              return (
                                <>
                                  <div
                                    className="f_spacebw mt-15"
                                    key={qualification_id}
                                  >
                                    <div className="checkbox_wrap agree_check">
                                      <input
                                        className="filter-type filled-in"
                                        type="checkbox"
                                        checked={!!isSelected ? false : true}
                                        name={qualificationName}
                                        id={qualificationName}
                                        onChange={() =>
                                          this.changeQualificationHandler(
                                            qualification_id,
                                            "filledQualification"
                                          )
                                        }
                                      />
                                      <label htmlFor={qualificationName}>
                                        {qualificationName}
                                      </label>
                                    </div>
                                    {url ? (
                                      <div
                                        className="file_upload_box"
                                        onClick={() =>
                                          window.open(
                                            `${window.location.origin}/doc-view?url=${url}&header=true`,
                                            "_blank"
                                          )
                                        }
                                      >
                                        <span
                                          className="close"
                                          onClick={(e) =>
                                            this.removeQualificationFileHandler(
                                              e,
                                              qualification_id,
                                              "filledQualification"
                                            )
                                          }
                                        >
                                          <img src={removeFile} />
                                        </span>
                                        <span className="file_icon">
                                          <img src={docDetails?.fileType} />
                                        </span>
                                        <div className="file_details">
                                          <span className="name">
                                            {fileName
                                              ? fileName
                                              : docDetails?.fileName}
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="upload_doc">
                                        <label
                                          className={`upload_btn ${
                                            isSelected ? "disable" : ""
                                          }`}
                                          htmlFor={qualificationName + "upload"}
                                        >
                                          Upload
                                        </label>
                                        <input
                                          type="file"
                                          className="none"
                                          id={qualificationName + "upload"}
                                          accept="image/jpeg,image/jpg,image/png,application/pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                          disabled={!!isSelected ? true : false}
                                          onChange={(e) =>
                                            this.onFileChange(
                                              e,
                                              "filledQualification",
                                              qualification_id
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                </>
                              );
                            }
                          )}
                        </>
                      )}

                    {addQualificationClicked &&
                      remainingQualificationDoc?.length > 0 &&
                      remainingQualificationDoc?.map(
                        ({
                          _id,
                          name,
                          url,
                          isSelected,
                          fileName,
                        }: {
                          _id: string;
                          name: string;
                          url: string;
                          isSelected: string;
                          fileName: string;
                        }) => {
                          const docDetails: any =
                            url && this.qualificationFileDetails(url);
                          return (
                            <>
                              <div className="f_spacebw mt-15" key={_id}>
                                <div className="checkbox_wrap agree_check">
                                  <input
                                    className="filter-type filled-in"
                                    type="checkbox"
                                    checked={!!isSelected ? true : false}
                                    name={name}
                                    id={name}
                                    onChange={() =>
                                      this.changeQualificationHandler(
                                        _id,
                                        "remainingQualification"
                                      )
                                    }
                                  />
                                  <label htmlFor={name}>{name}</label>
                                </div>
                                {url ? (
                                  <div
                                    className="file_upload_box"
                                    onClick={() =>
                                      window.open(
                                        `${window.location.origin}/doc-view?url=${url}&header=true`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <span
                                      className="close"
                                      onClick={(e) =>
                                        this.removeQualificationFileHandler(
                                          e,
                                          _id,
                                          "remainingQualification"
                                        )
                                      }
                                    >
                                      <img src={removeFile} />
                                    </span>
                                    <span className="file_icon">
                                      <img src={docDetails?.fileType} />
                                    </span>
                                    <div className="file_details">
                                      <span className="name">{fileName}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="upload_doc">
                                    <label
                                      className={`upload_btn ${
                                        !isSelected ? "disable" : ""
                                      }`}
                                      htmlFor={name + "upload"}
                                    >
                                      Upload
                                    </label>
                                    <input
                                      type="file"
                                      className="none"
                                      id={name + "upload"}
                                      accept="image/jpeg,image/jpg,image/png,application/pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                      disabled={!!isSelected ? false : true}
                                      onChange={(e) =>
                                        this.onFileChange(
                                          e,
                                          "remainingQualification",
                                          _id
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        }
                      )}
                  </div>
                )}
                {this.userType === 2 && (
                  <>
                    <div className="form_field">
                      <label className="form_label">Company Name</label>
                      <div className="text_field">
                        <input
                          type="text"
                          placeholder="Company Name"
                          name="companyName"
                          value={basicDetailsData?.companyName}
                          onChange={this.changeHandler}
                        />
                      </div>
                      {!!errors?.companyName && (
                        <span className="error_msg">{errors?.companyName}</span>
                      )}
                    </div>
                    <div className="form_field">
                      <label className="form_label">Your Position</label>
                      <div className="text_field">
                        <input
                          type="text"
                          placeholder="Your Position"
                          name="position"
                          value={basicDetailsData?.position}
                          onChange={this.changeHandler}
                        />
                      </div>
                      {!!errors?.position && (
                        <span className="error_msg">{errors?.position}</span>
                      )}
                    </div>
                    <div className="form_field">
                      <label className="form_label">
                        Australian Business Number
                      </label>
                      <div className="text_field">
  
                        <NumberFormat
                          value={basicDetailsData?.abn}
                          displayType={"input"}
                          type={"tel"}
                          placeholder="51 824 753 556"
                          format="## ### ### ###"
                          isNumericString={true}
                          onValueChange={(values) => {
                            const { value } = values;
                            const newBasicDetails = {
                              ...this.state.basicDetailsData,
                            };
                            newBasicDetails.abn = value;
                            this.setState({
                              basicDetailsData: newBasicDetails,
                              isEditProfileModalChanged: true,
                            });
                          }}
                        />
                      </div>
                      {!!errors?.abn && (
                        <span className="error_msg">{errors?.abn}</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {this.userType === 1 &&
                basicDetailsData?.qualificationDoc?.length < 6 &&
                !addQualificationClicked && (
                  <>
                    <div className="form_field">
                      <button
                        className="fill_grey_btn full_btn btn-effect"
                        onClick={() =>
                          this.setState({ addQualificationClicked: true })
                        }
                      >
                        Add qualification documents{" "}
                      </button>
                    </div>
                    <span className="info_note">
                      Don’t worry, nobody will see it. This is for verification
                      only!
                    </span>
                  </>
                )}
            </div>
            <div className="bottom_btn custom_btn">
              <button
                className={`fill_btn full_btn btn-effect ${
                  isEditProfileModalChanged ? "" : "disable_btn"
                }`}
                onClick={this.submitBasicProfileDetails}
              >
                Save changes
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          className="custom_modal"
          open={passwordModalClicked}
          onClose={this.passwordModalCloseHandler}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div
            className="custom_wh profile_modal"
            data-aos="zoom-in"
            data-aos-delay="30"
            data-aos-duration="1000"
          >
            <div className="heading form_field">
              <div className="relate">
                <button
                  className="back"
                  onClick={this.passwordModalCloseHandler}
                ></button>
                <div className="md_heading">
                  <span className="sub_title">Change password</span>
                </div>
              </div>
              <button
                className="close_btn"
                onClick={this.passwordModalCloseHandler}
              >
                <img src={cancel} alt="cancel" />
              </button>
            </div>
            <div className="inner_wrap">
              <div className="inner_wrappr">
                <div className="form_field">
                  <label className="form_label">Old Password</label>
                  <div className="text_field">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="detect_input"
                      placeholder="Enter Password"
                      name="password"
                      value={password}
                      onChange={this.passwordHandler}
                    />
                    <span
                      className="detect_icon"
                      onClick={() =>
                        this.setState((prevState: any) => ({
                          showPassword: !prevState.showPassword,
                        }))
                      }
                    >
                      <img
                        src={showPassword ? eyeIconOpen : eyeIconClose}
                        alt=""
                      />
                    </span>
                  </div>
                  {!!errors?.password && (
                    <span className="error_msg">{errors?.password}</span>
                  )}
                </div>
                <div className="form_field">
                  <label className="form_label">New Password</label>
                  <div className="text_field">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="detect_input"
                      placeholder="Enter New Password"
                      name="newPassword"
                      value={newPassword}
                      onChange={this.passwordHandler}
                    />
                    <span
                      className="detect_icon"
                      onClick={() =>
                        this.setState((prevState: any) => ({
                          showNewPassword: !prevState.showNewPassword,
                        }))
                      }
                    >
                      <img
                        src={showNewPassword ? eyeIconOpen : eyeIconClose}
                        alt=""
                      />
                    </span>
                  </div>
                  {!!errors?.newPassword && (
                    <span className="error_msg">{errors?.newPassword}</span>
                  )}
                </div>
                <div className="form_field">
                  <label className="form_label">Confirm New Password</label>
                  <div className="text_field">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      className="detect_input"
                      placeholder="Enter Confirm New Password"
                      name="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={this.passwordHandler}
                    />
                    <span
                      className="detect_icon"
                      onClick={() =>
                        this.setState((prevState: any) => ({
                          showConfirmNewPassword:
                            !prevState.showConfirmNewPassword,
                        }))
                      }
                    >
                      <img
                        src={
                          showConfirmNewPassword ? eyeIconOpen : eyeIconClose
                        }
                        alt=""
                      />
                    </span>
                  </div>
                  {!!errors?.confirmNewPassword && !errors?.newPassword && (
                    <span className="error_msg">
                      {errors?.confirmNewPassword}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="bottom_btn custom_btn">
              <button
                className={`fill_btn full_btn btn-effect ${
                  password && newPassword && confirmNewPassword
                    ? ""
                    : "disable_btn"
                }`}
                onClick={this.updatePasswordHandler}
              >
                Save changes
              </button>
            </div>
          </div>
        </Modal>

        {/* change email */}
        <ChangeEmailModal
          history={props.history}
          isChangeEmailModalClicked={changeEmailModalClicked}
          currentEmail={this.state.basicDetailsData?.email}
          changeEmailModalCloseHandler={this.changeEmailModalCloseHandler}
        />

        {this.userType === 1 && (
          <div className="section_wrapper">
            {isSkeletonLoading ? (
              <Skeleton />
            ) : (
              <span className="sub_title">
                {"Areas of specialisation"}
                {this.userType === 1 && (
                  <span
                    className="edit_icon"
                    title="Edit"
                    onClick={() =>
                      this.setState({ areasOfSpecsModalClicked: true })
                    }
                  >
                    <img src={editIconBlue} alt="edit" />
                  </span>
                )}
              </span>
            )}
            <div className="tags_wrap">
              {isSkeletonLoading ? (
                <Skeleton count={3} />
              ) : (
                <ul>
                  {profileViewData?.areasOfSpecialization?.tradeData?.map(
                    (
                      {
                        tradeId,
                        tradeName,
                        tradeSelectedUrl,
                      }: {
                        tradeId: string;
                        tradeName: string;
                        tradeSelectedUrl: string;
                      },
                      index: number
                    ) => {
                      if (this.userType === 1 && index > 0) {
                        return null;
                      }

                      return (
                        <li key={tradeId} className="main">
                          {tradeName}
                        </li>
                      );
                    }
                  )}
                  {profileViewData?.areasOfSpecialization?.specializationData?.map(
                    ({
                      specializationId,
                      specializationName,
                    }: {
                      specializationId: string;
                      specializationName: string;
                    }) => {
                      return (
                        <li key={specializationId}>{specializationName}</li>
                      );
                    }
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
        <Modal
          className="custom_modal"
          open={areasOfSpecsModalClicked}
          onClose={() => this.setState({ areasOfSpecsModalClicked: false })}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div
            className="custom_wh filter_modal"
            data-aos="zoom-in"
            data-aos-delay="30"
            data-aos-duration="1000"
          >
            <div className="heading">
              <span className="sub_title">What is your trade?</span>
              <button
                className="close_btn"
                onClick={() =>
                  this.setState({ areasOfSpecsModalClicked: false })
                }
              >
                <img src={cancel} alt="cancel" />
              </button>
            </div>

            <div className="inner_wrap">
              <div className="form_field">
                <span className="xs_sub_title">Categories</span>
              </div>
              <div className="select_sphere">
                <ul>
                  {tradeList?.map(
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
                      const active = trade[0] === _id;
                      return (
                        <li
                          key={_id}
                          className={active ? "active" : ""}
                          onClick={() =>
                            this.tradeHandler(
                              { _id, trade_name, selected_url },
                              "trade"
                            )
                          }
                        >
                          <figure>
                            <img
                              src={
                                selected_url ? selected_url : spherePlaceholder
                              }
                              alt=""
                            />
                          </figure>
                          <span className="name">{trade_name}</span>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
              <div className="form_field">
                <span className="xs_sub_title">Specialisation</span>
              </div>
              <div className="tags_wrap">
                <ul>
                  {specializationList?.length > 0 && (
                    <li
                      className={allSpecializationSelected ? "selected" : ""}
                      onClick={() =>
                        this.tradeHandler(specializationList, "All Clicked")
                      }
                    >
                      All
                    </li>
                  )}
                  {specializationList?.map(
                    ({ _id, name }: { _id: string; name: string }) => {
                      const active = specialization?.indexOf(_id) >= 0;
                      return (
                        <li
                          key={_id}
                          className={
                            active && !allSpecializationSelected
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            this.tradeHandler({ _id, name }, "specializationId")
                          }
                        >
                          {name}
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>
            <div className="filter_btn">
              <a
                className={`link ${
                  trade.length && specialization.length ? "" : "disable_link"
                }`}
                onClick={() => this.tradeHandler("Clear All", "Clear All")}
              >
                Clear All
              </a>
              <button
                className={`fill_btn full_btn btn-effect ${
                  trade.length && specialization.length ? "" : "disable_btn"
                }`}
                onClick={this.submitAreasOfTrade}
              >
                Save changes
              </button>
            </div>
          </div>
        </Modal>

        <div className="section_wrapper">
          {isSkeletonLoading ? (
            <Skeleton />
          ) : (
            <span className="sub_title">
              About {this.userType === 2 && "company"}
              {(profileViewData?.about || profileViewData?.aboutCompany) && (
                <span
                  className="edit_icon"
                  title="Edit"
                  onClick={this.addInfoAboutYou}
                >
                  <img src={editIconBlue} alt="edit" />
                </span>
              )}
            </span>
          )}
          {!profileViewData?.about && !profileViewData?.aboutCompany && (
            <button
              className="fill_grey_btn full_btn btn-effect"
              onClick={this.addInfoAboutYou}
            >
              {isSkeletonLoading ? (
                <Skeleton />
              ) : (
                `Add info about ${this.userType === 1 ? "you" : "company"}`
              )}
            </button>
          )}
          <p className="commn_para">
            {isSkeletonLoading ? (
              <Skeleton />
            ) : (
              profileViewData?.about || profileViewData?.aboutCompany
            )}
          </p>
        </div>

        <Modal
          className="custom_modal"
          open={aboutModalClicked}
          onClose={() =>
            this.setState({
              about: profileViewData?.about ? profileViewData?.about : "",
              aboutModalClicked: false,
              errors: {},
            })
          }
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
              <span className="sub_title">
                About {this.userType === 2 && "company"}
              </span>
              <button
                className="close_btn"
                onClick={() =>
                  this.setState({
                    about: profileViewData?.about ? profileViewData?.about : "",
                    aboutModalClicked: false,
                    errors: {},
                  })
                }
              >
                <img src={cancel} alt="cancel" />
              </button>
            </div>
            <div className="form_field">
              <label className="form_label">
                {this.userType === 1 ? "Description" : ""}
              </label>
              <div className="text_field">
                <textarea
                  placeholder="Enter Description"
                  maxLength={1000}
                  value={about}
                  onChange={({
                    target: { value },
                  }: {
                    target: { value: string };
                  }) => this.setState({ about: value })}
                />
                <span className="char_count">{`${about.length}/1000`}</span>
              </div>
              {!!errors.about && (
                <span className="error_msg">{errors.about}</span>
              )}
            </div>
            <div className="bottom_btn custom_btn">
              <button
                className="fill_btn full_btn btn-effect"
                onClick={() => {
                  let err: any = {};
                  if (about.trim().length < 1) {
                    err.about = "Description is required";
                    this.setState({ errors: err });
                  } else {
                    const newData = { ...profileViewData };
                    newData.about = about;
                    this.setState({
                      profileViewData: newData,
                      aboutModalClicked: false,
                      isProfileViewDataChanged: true,
                    });
                  }
                }}
              >
                Save changes
              </button>
              <button
                className="fill_grey_btn btn-effect"
                onClick={() =>
                  this.setState({
                    about: profileViewData?.about ? profileViewData?.about : "",
                    aboutModalClicked: false,
                    errors: {},
                  })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        <div className="section_wrapper">
          <span className="sub_title">
            {isSkeletonLoading ? <Skeleton /> : "Portfolio"}
          </span>
          {profileViewData?.portfolio?.length === 0 && (
            <button
              className="fill_grey_btn full_btn btn-effect"
              onClick={this.addNewPortfolioJob}
            >
              {isSkeletonLoading ? <Skeleton /> : "Add portfolio"}
            </button>
          )}
          {isSkeletonLoading ? (
            <Skeleton height={200} />
          ) : (
            <ul className="portfolio_wrappr">
              {profileViewData?.portfolio?.map(
                (
                  {
                    jobDescription,
                    jobName,
                    portfolioId,
                    portfolioImage,
                  }: {
                    jobDescription: string;
                    jobName: string;
                    portfolioId: string;
                    portfolioImage: Array<any>;
                  },
                  index: number
                ) => {
                  return (
                    <li
                      className="media"
                      key={portfolioId}
                      onClick={() =>
                        this.setState({
                          portfolioJobClicked: true,
                          portfolioJobDetail: {
                            jobDescription,
                            jobName,
                            portfolioId,
                            portfolioImage,
                          },
                          portfolioJobIndex: index,
                        })
                      }
                    >
                      <figure className="portfolio_img">
                        <img
                          src={
                            portfolioImage[0]
                              ? portfolioImage[0]
                              : profilePlaceholder
                          }
                          alt="portfolio-images"
                        />
                        <span className="xs_sub_title">
                          <p className="line-3" title={jobName}>
                            {jobName}
                          </p>
                        </span>
                      </figure>
                    </li>
                  );
                }
              )}

              {profileViewData?.portfolio?.length < 6 &&
                profileViewData?.portfolio?.length > 0 && (
                  <label className="upload_media">
                    <img
                      src={addMediaLrg}
                      alt="add"
                      onClick={this.addNewPortfolioJob}
                    />
                  </label>
                )}
            </ul>
          )}
        </div>

        <Modal
          className="custom_modal"
          open={portfolioJobClicked}
          onClose={() => this.setState({ portfolioJobClicked: false })}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div
            className="custom_wh portfolio_preview"
            data-aos="zoom-in"
            data-aos-delay="30"
            data-aos-duration="1000"
          >
            <div className="flex_row">
              <div className="flex_col_sm_6">
                <Carousel
                  responsive={portfolioModal}
                  showDots={true}
                  infinite={true}
                  autoPlay={true}
                  arrows={false}
                  className="portfolio_wrappr"
                >
                  {portfolioJobDetail?.portfolioImage?.length > 0 ? (
                    portfolioJobDetail?.portfolioImage?.map((image: string) => {
                      return (
                        <div
                          className="media"
                          key={portfolioJobDetail?.portfolioId}
                        >
                          <figure className="portfolio_img">
                            <img
                              src={image ? image : portfolioPlaceholder}
                              alt="portfolio-images"
                            />
                            <span
                              className="back bk_white"
                              title="Back"
                              onClick={() =>
                                this.setState({ portfolioJobClicked: false })
                              }
                            ></span>
                          </figure>
                        </div>
                      );
                    })
                  ) : (
                    <img alt="" src={portfolioPlaceholder} />
                  )}
                </Carousel>
              </div>
              <div className="flex_col_sm_6">
                <span className="dot_menu">
                  <img src={dotMenu} alt="menu" />

                  <div className="edit_menu">
                    <ul>
                      <li
                        className="icon edit"
                        onClick={() =>
                          this.setState({
                            isAddEditPortfolioModal: true,
                            portfolioJobClicked: false,
                            editPortfolioJob: true,
                          })
                        }
                      >
                        Edit
                      </li>
                      <li
                        className="icon delete"
                        onClick={() =>
                          this.setState({
                            deletePortfolioJob: true,
                            confirmationModalClicked: true,
                          })
                        }
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                </span>
                <span className="xs_sub_title">Job Description</span>
                <div className="job_content">
                  <p>{portfolioJobDetail?.jobDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          className="custom_modal"
          open={confirmationModalClicked}
          onClose={() =>
            this.setState({
              confirmationModalClicked: false,
              portfolioJobIndex: null,
            })
          }
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div
            className="custom_wh confirmation"
            data-aos="zoom-in"
            data-aos-delay="30"
            data-aos-duration="1000"
          >
            <div className="heading">
              <span className="xs_sub_title">Delete Portfolio Job</span>
              <button
                className="close_btn"
                onClick={() =>
                  this.setState({
                    confirmationModalClicked: false,
                    portfolioJobIndex: null,
                  })
                }
              >
                <img src={cancel} alt="cancel" />
              </button>
            </div>
            <div className="modal_message">
              <p>Are you sure you want to delete portfolio job?</p>
            </div>
            <div className="dialog_actions">
              <button
                className="fill_btn btn-effect"
                onClick={this.submitPortfolioJobs}
              >
                Yes
              </button>
              <button
                className="fill_grey_btn btn-effect"
                onClick={() =>
                  this.setState({
                    confirmationModalClicked: false,
                    portfolioJobIndex: null,
                  })
                }
              >
                No
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          className="custom_modal"
          open={isAddEditPortfolioModal}
          onClose={this.closeAddEditPortofolioModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div
            className="custom_wh"
            data-aos="zoom-in"
            data-aos-delay="30"
            data-aos-duration="1000"
          >
            <div className="heading">
              <div className="relate">
                <button
                  className="back"
                  onClick={this.closeAddEditPortofolioModal}
                />
                <div className="md_heading">
                  <span className="sub_title">Portfolio</span>
                  <span className="info_note">
                    {storageService.getItem("userType") === 1
                      ? "Tradespeople who have a portfolio with photos get job faster."
                      : "Showcase your work and attract the best talent to your jobs."}
                  </span>
                </div>
              </div>
              <button
                className="close_btn"
                onClick={this.closeAddEditPortofolioModal}
              >
                <img src={cancel} alt="cancel" />
              </button>
            </div>
            <div className="inner_wrap">
              <div className="inner_wrappr">
                <div className="form_field">
                  <label className="form_label">Job Name</label>
                  <div className="text_field">
                    <input
                      type="text"
                      placeholder="Enter Job Name"
                      value={portfolioJobDetail?.jobName}
                      maxLength={100}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const data = { ...portfolioJobDetail };
                        data.jobName = e.target.value;
                        this.setState({ portfolioJobDetail: data });
                      }}
                    />
                  </div>
                </div>
                <div className="form_field">
                  <label className="form_label">{`Job Description ${
                    this.userType === 2 ? `(optional)` : ""
                  }`}</label>
                  <div className="text_field">
                    <textarea
                      placeholder="Enter Job Description"
                      value={portfolioJobDetail?.jobDescription}
                      maxLength={1000}
                      onChange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        const data = { ...portfolioJobDetail };
                        data.jobDescription = e.target.value;
                        this.setState({ portfolioJobDetail: data });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="upload_img_video">
                {portfolioJobDetail?.portfolioImage?.map(
                  (image: string, index: number) => {
                    return (
                      <figure className="img_video" key={image}>
                        <img
                          src={image ? image : dummy}
                          async-src={image ? image : dummy}
                          decoding="async"
                          loading="lazy"
                          alt="portfolio-images"
                        />
                        <img
                          src={remove}
                          alt="remove"
                          className="remove"
                          onClick={() => {
                            const data: any = { ...portfolioJobDetail };
                            data?.portfolioImage?.splice(index, 1);
                            this.setState({ portfolioJobDetail: data });
                          }}
                        />
                      </figure>
                    );
                  }
                )}

                {portfolioJobDetail?.portfolioImage?.length < 6 &&
                  addPortfolioJob && (
                    <>
                      <label
                        className="upload_media"
                        htmlFor="upload_img_video"
                      >
                        <img src={addMedia} alt="add" />
                      </label>

                      <input
                        type="file"
                        accept="image/png,image/jpg,image/jpeg"
                        style={{ display: "none" }}
                        id="upload_img_video"
                        onChange={(e) => this.onFileChange(e, "addJobPhotos")}
                      />
                    </>
                  )}
              </div>
            </div>
            <div className="bottom_btn custom_btn">
              <button
                className={`fill_btn full_btn btn-effect ${
                  portfolioJobDetail?.jobName?.trim() &&
                  (this.userType === 2
                    ? true
                    : portfolioJobDetail?.jobDescription?.trim()) &&
                  (this.userType === 2
                    ? true
                    : portfolioJobDetail?.portfolioImage?.length)
                    ? ""
                    : "disable_btn"
                }`}
                onClick={this.submitPortfolioJobs}
              >
                Save changes
              </button>
              <button
                className="fill_grey_btn btn-effect"
                onClick={this.closeAddEditPortofolioModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        <div className="section_wrapper">
          <button
            className={`fill_btn full_btn btn-effect ${
              isProfileViewDataChanged ? "" : "disable_btn"
            }`}
            onClick={this.submitUpdateProfile}
          >
            {isSkeletonLoading ? <Skeleton /> : "Save changes"}
          </button>
        </div>
      </>
    );
  }
}

export default PersonalInformation;
