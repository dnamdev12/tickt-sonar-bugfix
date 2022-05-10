import React, { useEffect, useState } from 'react'
import { withRouter } from "react-router-dom";
// @ts-ignore
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import moment from 'moment';
import { setShowToast } from '../../../../redux/common/actions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { renderTimeWithFormat } from '../../../../utils/common';
import AddMilestones from './addEditMilestone';
import {
  updateTemplate,
  getMileStoneByTempId,
} from "../../../../redux/jobs/actions";

const JobMilestones = (props: any) => {
    const [dataItems, setDataItems] = useState([]);
    const [editItem, setEditItems] = useState<{ [index: string]: any }>({});
    const [toggleAddEdit, setAddEdit] = useState<any>({ toggle: false, item: null, index: null });
    const [open, setOpen] = React.useState(false);
    const [deleteItem, setDeleteItem] = React.useState(null);
    const [localMilestones, setLocalMile] = useState([]);
    const [allMilestones, setAllMilestones] = useState({});


    const handleClickOpen = (id: any) => {
        setOpen(true)
        setDeleteItem(id);
    };
    const handleClose = () => {
        setOpen(false)
        setDeleteItem(null);
    };

    const handleYes = () => {
        localMilestones.splice(toggleAddEdit?.index, 1)
        setOpen(false);
        setDeleteItem(null);
    }

    const prefetch = async () => {
        let response = await getMileStoneByTempId(props?.id);
        if (response.success) {
            console.log({
                response
            })
            if (response?.data && Array.isArray(response?.data?.milestones) && response?.data?.milestones?.length) {
                setDataItems(response?.data?.milestones)

                let filteredData: any = response?.data?.milestones.map((item: any) => {
                    return {
                        milestone_name: item?.milestoneName,
                        order: item?.order,
                        isPhotoevidence: item?.isPhotoevidence,
                        recommended_hours: item?.recommendedHours,
                        from_date: moment(item?.fromDate).isValid() ? moment(item?.fromDate).format('MM-DD-YYYY') : '',
                        to_date: moment(item?.toDate).isValid() ? moment(item?.toDate).format('MM-DD-YYYY') : '',
                    }
                });
                setAllMilestones(response?.data)
                setLocalMile(filteredData);
            }
        }
    }

    useEffect(() => {
        console.log('Here!!!!')
        prefetch()
    }, []);

    const checkOnClick = (e: any, index: any) => {
        let edit_item_clone: any = editItem;
        edit_item_clone[index] = e.target.checked;
        setEditItems((prev) => ({ ...prev, ...edit_item_clone }));
    }

    const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        const reOrderedMilestones: any = reorder(
            localMilestones,
            source.index,
            destination.index
        );

        setLocalMile(reOrderedMilestones);
    };

    const format = 'MM-DD-YYYY';

    const backToScreen = (data?: any) => {
        let local_mile: any = localMilestones;
        setAddEdit({ toggle: false });
        if (data) {
            let data_: any = data?.data;
            let index = data?.index;
        
            if(index == undefined){
                local_mile.push(data_);
            } else {
                local_mile[index] = data_;
            }
            setLocalMile(local_mile);
        }
    }

    if (toggleAddEdit?.toggle) {
        return (
            <AddMilestones
                backToScreen={backToScreen}
                item={toggleAddEdit?.item}
                items={localMilestones}
                index={toggleAddEdit?.index}
            />
        )
    }

    const checkIfValidDates = (item: any) => {
        let isfilter: any = localMilestones.filter((item_: any) => {
            if (item_.hasOwnProperty('from_date')) {
                if (item_?.from_date !== "Invalid date" || !item_?.from_date?.length) {
                    return item_;
                }
            }
        });
        if (!isfilter?.length) {
            return true;
        } else {

            const newarr: any = isfilter.slice().sort((a: any, b: any) => {
                return moment(a.from_date, 'MM-DD-YYYY').diff(moment(b.from_date, 'MM-DD-YYYY'));
            });
            let filteredItem: any = item.filter((item_reorder: any) => {
                if (item_reorder.hasOwnProperty('from_date')) {
                    if (item_reorder?.from_date !== "Invalid date" || !item_reorder?.from_date?.length) {
                        return item_reorder;
                    }
                }
            });
            return JSON.stringify(newarr) === JSON.stringify(filteredItem);
        }
    }

    const handleSubmit = async () => {
        let all_milestones: any = allMilestones;
        let data = {
            "templateId": all_milestones?.tempId,
            "template_name": all_milestones?.templateName,
            "milestones": localMilestones.map((item: any, index: any) => {
                item['order'] = index + 1;
                return item;
            })
        }

        let response = await updateTemplate(data);
        if (response?.success) {
            props.history.push({
                pathname: '/template-sucess',
                state: { redirectTo: '/update-user-info' }
            });
        }
    }

    return (
        <div className="custom_container">
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete the milestone ?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleYes} color="primary" autoFocus>
                        {'Yes'}
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        {'No'}
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="form_field">
                <div className="flex_row">
                    <div className="flex_col_sm_12">
                        <div
                            className="relate">
                            <span
                                style={{ zIndex: 999, cursor: 'pointer' }}
                                onClick={() => {
                                    props.backToScreen();
                                }}
                                className="back">
                            </span>
                            <span className="title">
                                {'Job Milestones'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex_row">
                    <div className="flex_col_sm_5">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="milestones">
                                {(provided, snapshot) => (
                                    <ul ref={provided.innerRef}
                                        className={`milestones${snapshot.isDraggingOver ? ' dragging-over' : ''}`}>
                                        {localMilestones?.length > 0 &&
                                            localMilestones.map(({
                                                milestone_name,
                                                isPhotoevidence,
                                                recommended_hours,
                                                from_date,
                                                to_date,
                                                order
                                            }: {
                                                milestone_name: string,
                                                isPhotoevidence: boolean,
                                                from_date: string,
                                                to_date: string,
                                                recommended_hours: any
                                                order: any
                                            }, index: any) => (
                                                <Draggable
                                                    key={`${index}-${milestone_name}`}
                                                    draggableId={`${milestone_name}-${index}`}
                                                    index={index}>
                                                    {(provided: any) => (
                                                        <li
                                                            key={index}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                            }}>
                                                            {editItem[index] ? (
                                                                <div className="edit_delete">
                                                                    <span
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setAddEdit({
                                                                                toggle: true,
                                                                                item: {
                                                                                    milestone_name,
                                                                                    isPhotoevidence,
                                                                                    recommended_hours,
                                                                                    from_date,
                                                                                    to_date,
                                                                                    order
                                                                                },
                                                                                index: index
                                                                            });
                                                                        }}
                                                                        className="edit">
                                                                    </span>
                                                                    <span
                                                                        onClick={(e) => {
                                                                            handleClickOpen(index);
                                                                        }}
                                                                        className="delete"></span>
                                                                </div>
                                                            ) : ''}
                                                            <div className="checkbox_wrap agree_check">
                                                                <input
                                                                    checked={editItem[index]}
                                                                    onChange={(e: any) => {
                                                                        checkOnClick(e, index)
                                                                    }}
                                                                    className="filter-type filled-in"
                                                                    type="checkbox"
                                                                    id={`milestone${index}`} />
                                                                <label htmlFor={`milestone${index}`}>
                                                                    {`${index + 1}. ${milestone_name}`}
                                                                </label>
                                                                <div className="info">
                                                                    {isPhotoevidence ?
                                                                        <span>{'Photo evidence required'}</span>
                                                                        : <span></span>}
                                                                    <span>
                                                                        {renderTimeWithFormat(
                                                                            from_date,
                                                                            to_date,
                                                                            format
                                                                        )}
                                                                    </span>
                                                                    <span>
                                                                        {recommended_hours}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                        {!localMilestones?.length ? (
                            <React.Fragment>
                                <div className="form_field">
                                    <button
                                        className="fill_btn fill_grey_btn full_btn btn-effect"
                                        onClick={() => {
                                            setAddEdit({ toggle: true, item: null });
                                        }}>
                                        {'+ Add milestone'}
                                    </button>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <div className="form_field">
                                    <button
                                        className="fill_btn fill_grey_btn full_btn btn-effect"
                                        onClick={() => {
                                            setAddEdit({ toggle: true, item: null });
                                        }}>
                                        {'+ Add milestone'}
                                    </button>
                                </div>
                                <div className="form_field">
                                    <button
                                        onClick={() => {
                                            let check: boolean = checkIfValidDates(localMilestones);
                                            if (check) {
                                                handleSubmit();
                                            } else {
                                                setShowToast(true, "Please arrange milestone date wise")
                                            }
                                        }}
                                        className={`fill_btn full_btn btn-effect`}>
                                        {'Save'}
                                    </button>
                                </div>
                            </React.Fragment>
                        )}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default withRouter(JobMilestones);
