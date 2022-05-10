import { useState } from 'react';
import { setShowToast } from '../../../redux/common/actions';
import noData from '../../../assets/images/no-search-data.png'

interface Propstype {
    updateSteps: (num: number, data: any) => void
    step: number
    tradeListData: Array<any>,
    trade: string,
    specialization: Array<string>
}

const Specialization = (props: Propstype) => {
    const [specialization, setSpecialization] = useState(props.specialization);

    const changeHandler = (id: string) => {
        setSpecialization((prevData: Array<string>) => {
            const newData = [...prevData];
            const itemIndex = newData.indexOf(id);
            if (newData.indexOf(id) < 0) {
                newData.push(id);
            } else {
                newData.splice(itemIndex, 1);
            }
            return newData;
        })
    }


    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (specialization.length) {
            props.updateSteps(props.step + 1, { specialization })
        } else {
            setShowToast(true, "Please select at least one specialisation")
        }
    }

    const specializationList = props.tradeListData.find(i => i._id === props.trade)?.specialisations;

    return (
        <div className="form_wrapper tags_wrap">
            <form onSubmit={onSubmit}>
                <ul>
                    {specializationList?.length ? specializationList.map((item: any) => {
                        const active = specialization.indexOf(item._id) >= 0;
                        return (
                            <li key={item._id} className={active ? 'active' : ''} onClick={() => changeHandler(item._id)}>{item.name}</li>
                        )
                    }) : <li className='no_data'>
                            <img src={noData} alt="no-data" />
                        </li>}
                </ul>

                <div className="form_field">
                    <button className="fill_btn btn-effect">Next</button>
                </div>
            </form>
        </div>
    )
}

export default Specialization