import React, { useState, useEffect } from "react";
import { quoteByJobId } from "../../../../redux/quotes/actions";
import storageService from "../../../../utils/storageService";
import NumberFormat from "react-number-format";

const ActiveQuoteMark = (props: any) => {
  const [Items, setItems] = useState<Array<any>>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    preFetch();
  }, []);

  const preFetch = async () => {
    const data: any = {
      jobId: props.location?.state?.jobData?.jobId,
      tradieId: storageService.getItem("userInfo")?._id,
    };
    const res = await quoteByJobId(data);
    if (res.success && res.data?.resultData[0]?.quote_item?.length) {
      setItems(res.data?.resultData[0]?.quote_item);
      setTotalAmount(res.data?.resultData[0]?.totalQuoteAmount);
      props.dataFetched(true);
    } else {
      props.dataFetched(false);
    }
  };

  return (
    <div className="flex_col_sm_6">
      <div className="relate form_field">
        <button
          onClick={() => props.history.goBack()}
          className="back"
        ></button>
      </div>
      <span className="sub_title">{"Your Quote"}</span>
      <>
        {Items?.length > 0 &&
          Items.map((item: any) => (
            <div className="change_req">
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
          ))}
      </>

      {Items?.length > 0 && (
        <div className="total_quote">
          <span className="fill_grey_btn">
            {`Total Quote: `}
            {
              <NumberFormat
                value={totalAmount}
                displayType={"text"}
                prefix={"$"}
                thousandSeparator={true}
                isNumericString={true}
              />
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default ActiveQuoteMark;
