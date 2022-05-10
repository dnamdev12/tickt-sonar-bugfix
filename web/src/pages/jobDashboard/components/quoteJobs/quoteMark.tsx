import React, { useState, useEffect } from "react";
import { postHomeApplyJob } from "../../../../redux/homeSearch/actions";
import {
  addQuote,
  addItem,
  updateItem,
  deleteItem,
  quoteByJobId,
} from "../../../../redux/quotes/actions";
import NumberFormat from "react-number-format";
import Modal from "@material-ui/core/Modal";
import storageService from "../../../../utils/storageService";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import deleteQuote from "../../../../assets/images/ic-delete.png";
import cancel from "../../../../assets/images/ic-cancel.png";
import { moengage, mixPanel } from "../../../../services/analyticsTools";
import { MoEConstants } from "../../../../utils/constants";

const QuoteMark = (props: any) => {
  const [Items, setItems] = useState<Array<any>>([]);
  const [isEdit, setEdit] = useState<any>(null);
  const [totalItemsAmt, setTotalItemsAmt] = useState<number>(0);
  const [quoteId, setQuoteId] = useState<string>("");
  const [deleteItemModal, setDeleteItemModal] = useState<boolean>(false);
  const [localQuote, setLocalQuote] = useState<any>({
    item_number: 1,
    description: "",
    price: 0,
    quantity: 0,
    totalAmount: 0,
  });
  const [isQuoteDialog, setIsQuoteDialog] = useState<boolean>(false);
  var jobData = props.location?.state?.jobData;
  console.log("jobData: ", jobData);

  useEffect(() => {
    preFetch();
  }, []);

  console.log("Items: ", Items);
  const preFetch = async () => {
    const isItemsEditable =
      props.location?.state?.redirect_from === "appliedJobs" ? true : false;
    if (isItemsEditable) {
      const data: any = {
        jobId: props.location?.state?.jobData?.jobId,
        tradieId: storageService.getItem("userInfo")?._id,
      };
      const res = await quoteByJobId(data);
      if (res.success && res.data?.resultData[0]?.quote_item?.length) {
        const items_ = res.data?.resultData[0]?.quote_item;
        setItems(items_);
        setQuoteId(res.data?.resultData[0]?._id);
        let item_no = items_[items_?.length - 1]?.item_number
          ? items_[items_?.length - 1]?.item_number + 1
          : 1;
        setLocalQuote((prev: any) => ({ ...prev, item_number: item_no }));
        props.dataFetched(true);
      } else {
        props.dataFetched(false);
      }
    } else {
      props.dataFetched(true);
    }
  };

  const deleteItem_ = async (item: any) => {
    const data = {
      itemId: item?._id,
    };
    const res = await deleteItem(data);
    if (res.success) {
      return true;
    } else {
      return false;
    }
  };

  const addItem_ = async (item: any) => {
    let items_ = Items;
    const data = {
      quoteId: quoteId,
      item_number: item?.item_number,
      description: item?.description,
      price: item?.price,
      quantity: item?.quantity,
      totalAmount: item?.totalAmount,
    };
    const res = await addItem(data);
    if (res.success && res.data?.resultData) {
      items_.push(res.data?.resultData);
      setItems(items_);
      setLocalQuote({
        item_number: items_[items_?.length - 1]?.item_number
          ? items_[items_?.length - 1]?.item_number + 1
          : 1,
        description: "",
        price: 0,
        quantity: 0,
        totalAmount: 0,
      });
    }
  };

  const updateItem_ = async (index: number, items: any) => {
    const newAmount: number = totalItemsAmount(items);
    const item = items[index];
    const data = {
      itemId: item?._id,
      item_number: item?.item_number,
      description: item?.description,
      price: item?.price,
      quantity: item?.quantity,
      totalAmount: item?.totalAmount,
      quoteId: quoteId,
      amount: newAmount,
    };
    const res = await updateItem(data);
    if (res.success) {
      return true;
    } else {
      return false;
    }
  };

  const moECalled = () => {
    const mData = {
      timeStamp: moengage.getCurrentTimeStamp(),
      category: jobData?.tradeName,
      location: jobData?.locationName,
      "Number of milestone": jobData?.jobMilestonesData?.length,
      Amount: totalItemsAmt,
    };
    moengage.moE_SendEvent(MoEConstants.QUOTED_A_JOB, mData);
    mixPanel.mixP_SendEvent(MoEConstants.QUOTED_A_JOB, mData);
  };

  const applyJobClicked = async () => {
    const jobDetailsData: any = props.location?.state?.jobData;
    const data = {
      jobId: jobDetailsData?.jobId,
      builderId: jobDetailsData?.postedBy?.builderId,
      tradeId: jobDetailsData?.tradeId,
      specializationId: jobDetailsData?.specializationId,
    };
    const res = await postHomeApplyJob(data);
    if (res.success) {
      moECalled();
      props.history.push({
        pathname: "/quote-job-success",
        state: {
          builderName: props.builderName ? props.builderName : "Builder",
        },
      });
    }
  };

  const handleSubmit = async () => {
    const jobId: string = props.location?.state?.jobData?.jobId;
    const data: any = {
      jobId: jobId,
      userId: storageService.getItem("userInfo")?._id,
      amount: totalItemsAmt,
      quote_item: Items,
    };
    const res: any = await addQuote(data);
    if (res.success) {
      if (props.location?.state?.base_redirect === "newJobs") {
        moECalled();
        props.history.push({
          pathname: "/quote-job-success",
          state: {
            builderName: props.builderName ? props.builderName : "Builder",
          },
        });
      } else {
        applyJobClicked();
      }
    }
  };

  const handleChange = (name: any, value: any) => {
    if (name === "description" && value.length > 250) {
      return;
    }
    setLocalQuote((prev: any) => ({
      ...prev,
      [name]: name === "description" ? value : +value,
    }));
  };

  const totalItemsAmount = (items: any) => {
    let totalAmount = items.slice(1, items.length).reduce((a: any, b: any) => {
      return a + b.totalAmount;
    }, Items[0].totalAmount);
    return totalAmount;
  };

  const calculateTotal = () => {
    if (Items?.length) {
      let totalAmt_ = totalItemsAmount(Items);
      if (totalAmt_ && totalAmt_ !== totalItemsAmt) {
        setTotalItemsAmt(totalAmt_);
      }
      const total = (
        <NumberFormat
          value={totalAmt_}
          decimalScale={2}
          displayType={"text"}
          thousandSeparator={true}
          isNumericString={true}
        />
      );
      return total;
    }
    return `$0`;
  };

  const saveAddItem = async () => {
    if (isEditTrue) {
      let index = isEdit;
      let items_ = Items;
      let item: any = localQuote;
      item["totalAmount"] = +item.quantity * +item.price;
      items_[isEdit] = item;
      let isSuccess: boolean = true;
      if (quoteId) {
        isSuccess = await updateItem_(index, items_);
      }
      if (isSuccess) {
        setItems(items_);
        setEdit(null);
        setLocalQuote({
          item_number: items_[items_?.length - 1]?.item_number + 1,
          description: "",
          price: 0,
          quantity: 0,
          totalAmount: 0,
        });
      }
      return;
    } else {
      let items_ = Items;
      let item: any = localQuote;
      item["totalAmount"] = +item.quantity * +item.price;
      if (props.location?.state?.redirect_from === "appliedJobs") {
        await addItem_(item);
      } else {
        items_.push(item);
        setItems(items_);
        setLocalQuote({
          item_number: items_[items_?.length - 1]?.item_number
            ? items_[items_?.length - 1]?.item_number + 1
            : 1,
          description: "",
          price: 0,
          quantity: 0,
          totalAmount: 0,
        });
      }
    }
    if (isQuoteDialog) {
      setIsQuoteDialog(false);
    }
  };

  const handleQuoteDialog = (ans?: string, hitApi?: boolean) => {
    if (quoteId) {
      setIsQuoteDialog(ans === "yes" ? true : false);
      if (hitApi) saveAddItem();
    } else {
      saveAddItem();
    }
  };

  let description = localQuote.description;
  let price: any = localQuote.price;
  let qty: any = localQuote.quantity;
  let total_cal = +qty * +price;
  let total = total_cal === 0 ? "" : total_cal;
  let isEditTrue = isEdit !== null && isEdit > -1 ? true : false;

  const callItemNo = () => {
    if (localQuote?._id) {
      console.log("localQuote?._id-----------if");
      return localQuote?.item_number;
    }
    if (isEdit !== null) {
      return Items[isEdit]?.item_number;
    }
    console.log("Items---------else");
    return Items[Items?.length - 1]?.item_number
      ? Items[Items?.length - 1]?.item_number + 1
      : 1;
  };

  const quoteValidate = () => {
    if (description?.length === 0 || qty === 0 || price === 0) {
      return true;
    }
    return false;
  };

  const deleteItemHandler = async () => {
    let index = isEdit;
    let items_ = Items;
    let filtered = items_.filter(( index: any) => index !== isEdit);
    setItems(filtered);
    setEdit(null);
    let length = filtered[filtered?.length - 1]?.item_number;
    let id = length > 0 ? length + 1 : 1;
    let res: any = true;
    if (quoteId) {
      res = await deleteItem_(items_[index]);
    }
    if (res) {
      setLocalQuote({
        item_number: id,
        description: "",
        price: 0,
        quantity: 0,
        totalAmount: 0,
      });
    }
    setDeleteItemModal(false);
  };

  return (
    <div className="flex_col_sm_6">
      <div className="relate form_field">
        <button
          onClick={() => {
            if (isEditTrue) {
              setEdit(null);
              setLocalQuote({
                item_number: Items[Items?.length - 1]?.item_number
                  ? Items[Items?.length - 1]?.item_number + 1
                  : 1,
                description: "",
                price: 0,
                quantity: 0,
                totalAmount: 0,
              });
            } else {
              props.history.goBack();
            }
          }}
          className="back"
        ></button>
      </div>
      <span className="sub_title">{"Quote for this job"}</span>
      <>
        {Items?.length > 0 && !isEditTrue
          ? Items.map((item: any, index: number) => (
              <div className="change_req">
                <div className="edit_delete">
                  <span
                    onClick={() => {
                      setEdit(index);
                      setLocalQuote(item);
                    }}
                    className="editdark"
                  ></span>
                </div>
                <div className="flex_row">
                  <div className="flex_col_sm_2">
                    <label className="form_label">Item</label>
                  </div>
                  <div className="flex_col_sm_6">
                    <label className="form_label">Description</label>
                  </div>
                  <div className="flex_col_sm_4">
                    <label className="form_label">Price</label>
                  </div>
                  <>
                    <div className="flex_col_sm_2">
                      <span className="show_label">{item.item_number}</span>
                    </div>
                    <div className="flex_col_sm_6">
                      <span className="show_label line-1">
                        {item.description}
                      </span>
                    </div>
                    <div className="flex_col_sm_4">
                      <span className="show_label">
                        <NumberFormat
                          value={item.totalAmount}
                          displayType={"text"}
                          prefix={"$ "}
                          thousandSeparator={true}
                          isNumericString={true}
                        />
                      </span>
                    </div>
                  </>
                </div>
              </div>
            ))
          : null}
      </>

      {props.isDataFetched && (
        <div className="change_req">
          {isEditTrue && Items.length > 1 && (
            <span
              onClick={() => setDeleteItemModal(true)}
              className="delete_quote"
            >
              {"Delete"}
              <img src={deleteQuote} alt="delete" />
            </span>
          )}
          <span className="inner_title">{`${
            isEditTrue ? "Edit" : "Add"
          } Item`}</span>
          <div className="form_field">
            <label className="form_label">{"Item Number"}</label>
            <div className="text_field">
              <input type="number" value={callItemNo()} />
            </div>
          </div>
          <div className="form_field">
            <label className="form_label">Description</label>
            <div className="text_field">
              <textarea
                value={description}
                onChange={(e) =>
                  handleChange("description", e.target.value.trimLeft())
                }
              ></textarea>
            </div>
          </div>
          <div className="form_field">
            <div className="flex_row">
              <div className="flex_col_sm_4">
                <label className="form_label">Price</label>
                <div className="text_field">
                  <NumberFormat
                    value={price || ""}
                    decimalScale={2}
                    allowNegative={false}
                    className="foo"
                    placeholder="$100"
                    displayType={"input"}
                    thousandSeparator={true}
                    isNumericString={true}
                    prefix={"$"}
                    onValueChange={(values) => {
                      const {  value } = values;
                      handleChange("price", value);
                    }}
                  />
                </div>
              </div>
              <div className="flex_col_sm_4">
                <label className="form_label">Qty</label>
                <div className="text_field">
                  <NumberFormat
                    value={qty || ""}
                    className="foo"
                    placeholder="10"
                    displayType={"input"}
                    thousandSeparator={true}
                    isNumericString={true}
                    onValueChange={(values) => {
                      const { value } = values;
                      handleChange("quantity", value);
                    }}
                  />
                </div>
              </div>
              <div className="flex_col_sm_4">
                <label className="form_label">Total</label>
                <div className="text_field">
                  <NumberFormat
                    readOnly
                    value={total || ""}
                    decimalScale={2}
                    allowNegative={false}
                    className="foo"
                    placeholder="$1000"
                    displayType={"input"}
                    thousandSeparator={true}
                    isNumericString={true}
                    prefix={"$"}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleQuoteDialog("yes")}
            className={`fill_btn w100per ${
              quoteValidate() ? "disable_btn" : ""
            }`}
          >
            {`${isEditTrue ? "Save" : "Add"} Item`}
          </button>
        </div>
      )}

      <Modal
        className="custom_modal"
        open={deleteItemModal}
        onClose={() => setDeleteItemModal(false)}
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
            <span className="xs_sub_title">{`Delete item confirmation`}</span>
            <button
              className="close_btn"
              onClick={() => setDeleteItemModal(false)}
            >
              <img src={cancel} alt="cancel" />
            </button>
          </div>
          <div className="modal_message">
            <p>Are you sure you still want to delete item?</p>
          </div>
          <div className="dialog_actions">
            <button className="fill_btn btn-effect" onClick={deleteItemHandler}>
              Yes
            </button>
            <button
              className="fill_grey_btn btn-effect"
              onClick={() => setDeleteItemModal(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>

      <Dialog
        open={isQuoteDialog}
        // onClose={() => handleQuoteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="xs_alert_dialog_title">
          {"This quote will be send to builder"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Are you sure you want to update quote?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleQuoteDialog("no", true)} color="primary">
            {"Yes"}
          </Button>
          <Button onClick={() => handleQuoteDialog("no")} color="primary">
            {"No"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Modal
                className="custom_modal"
                open={isQuoteDialog}
                onClose={() => handleQuoteDialog('no')}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className="custom_wh confirmation" data-aos="zoom-in" data-aos-delay="30" data-aos-duration="1000">
                    <div className="heading">
                        <span className="xs_sub_title">{'This quote will be send to builder'}</span>
                        <button className="close_btn" onClick={() => handleQuoteDialog('no')}>
                            <img src={cancel} alt="cancel" />
                        </button>
                    </div>
                    <div className="modal_message">
                        <p>Are you sure you want to update quote?</p>
                    </div>
                    <div className="dialog_actions">
                        <button className="fill_btn btn-effect" onClick={() => handleQuoteDialog('no', true)}>Yes</button>
                        <button className="fill_grey_btn btn-effect" onClick={() => handleQuoteDialog('no')}>No</button>
                    </div>
                </div>
            </Modal> */}

      {Items?.length > 0 && !isEditTrue && (
        <div className="total_quote">
          <span className="fill_grey_btn">
            {`Total Quote: $`}
            {calculateTotal()}
          </span>
        </div>
      )}

      {quoteId || !props.isDataFetched || isEditTrue ? null : (
        <button
          onClick={handleSubmit}
          className={`fill_grey_btn quote_btn ${
            Items?.length === 0 ? "disable_btn" : ""
          }`}
        >
          {"Submit Quote"}
        </button>
      )}
    </div>
  );
};

export default QuoteMark;
