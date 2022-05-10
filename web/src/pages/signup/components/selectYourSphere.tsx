import { useState } from "react";
import { setShowToast } from "../../../redux/common/actions";
import spherePlaceholder from "../../../assets/images/tick-grey.svg";
import noData from "../../../assets/images/no-search-data.png";

interface Propstype {
  updateSteps: (num: number, data: any) => void;
  step: number;
  tradeListData: Array<any>;
  trade: string;
}

const SelectCategories = (props: Propstype) => {
  const [trade, setTrade] = useState(props.trade);
  const [imgPath, setimagePath] = useState<any>([]);

  const onClick = (item: string) => {
    if (item == trade) {
      return setTrade("");
    }
    setTrade(item);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (trade) {
      props.updateSteps(props.step + 1, { trade });
    } else {
      setShowToast(true, "Please select a trade");
    }
  };

  const onImageError = (index: number) => {
    let tmp = [...imgPath];
    tmp[index] = true;
    setimagePath(tmp);
  };

  return (
    <div className="select_sphere form_wrapper">
      <ul>
        {props.tradeListData?.length ? (
          props.tradeListData.map((item, index) => {
            const active = trade === item._id;
            const imgSrc =
              item.selected_url && !imgPath[index]
                ? item.selected_url
                : spherePlaceholder;
            return (
              <li
                key={item._id}
                className={active ? "active" : ""}
                onClick={() => onClick(item._id)}
              >
                <figure>
                  <img onError={() => onImageError(index)} src={imgSrc} />
                </figure>
                <span className="name">{item.trade_name}</span>
              </li>
            );
          })
        ) : (
          <li className="no_data">
            <img src={noData} alt="no-data" />
          </li>
        )}
      </ul>
      <button className="fill_btn btn-effect" onClick={onSubmit}>
        Next
      </button>
    </div>
  );
};

export default SelectCategories;
