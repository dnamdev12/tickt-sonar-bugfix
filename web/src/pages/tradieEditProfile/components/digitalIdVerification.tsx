import React, { useState } from 'react';
import { setShowToast } from '../../../redux/common/actions';
//@ts-ignore
import FsLightbox from 'fslightbox-react';
import { uploadStripeDocument } from '../../../redux/profile/actions';
import { useHistory } from 'react-router-dom';

import addMedia from "../../../assets/images/add-image.png";
import close from '../../../assets/images/icon-close-1.png';

const imageFormats: Array<string> = ["jpeg", "jpg", "png"];
interface Props {
    setIdVerifClicked?: (data: boolean) => void;
    markMilestoneVerif?: (data: any) => void;
    stripeAccountId: string;
    redirect_from?: string
}

const LodgeDispute = (props: Props) => {
    const [frontPhotoId, setFrontPhotoId] = useState<any>({});
    const [backPhotoId, setBackPhotoId] = useState<any>({});
    const [formData] = useState<any>(new FormData());

    const [toggler, setToggler] = useState(false);
    const [selectedSlide, setSelectSlide] = useState(1);
    const history = useHistory();

    const removeFromItem = (type: string) => {
        if (type === 'frontId') {
            formData.delete('stripeAccountId');
            formData.delete('frontPhotoIDUpload');
            setFrontPhotoId({});
        }
        if (type === 'backId') {
            formData.delete('backPhotoIDUpload');
            setBackPhotoId({});
        }
    }

    const onFileChange = async (e: any) => {
        const newFile = e.target.files[0];
        var fileType = (newFile?.type?.split('/')[1])?.toLowerCase();
        var selectedFileSize = newFile?.size / 1024 / 1024; // size in mib

        if (imageFormats.indexOf(fileType) < 0 || (selectedFileSize > 10)) {
            setShowToast(true, "The file must be in proper format or size")
            return;
        }

        if (imageFormats.includes(fileType) && selectedFileSize > 10) { // image validations
            setShowToast(true, "The image file size must be below 10 mb")
            return;
        }

        const data = {
            localURL: URL.createObjectURL(newFile),
        }
        if (Object.keys(frontPhotoId)?.length === 0) {
            formData.append('stripeAccountId', props.stripeAccountId);
            formData.append('frontPhotoIDUpload', newFile);
            setFrontPhotoId(data);
        } else if (Object.keys(backPhotoId)?.length === 0) {
            formData.append('backPhotoIDUpload', newFile);
            setBackPhotoId(data);
        }
    }

    const checkErrors = () => {
        return (Object.keys(frontPhotoId)?.length && Object.keys(backPhotoId)?.length) ? false : true;
    }

    const handleSubmit = async () => {
        const res = await uploadStripeDocument(formData);
        if (res.success && props.redirect_from === 'mark-milestone' && props.markMilestoneVerif) {
            setShowToast(true, res.msg);
            props.markMilestoneVerif('verifSuccess');
            return;
        } else if (res.success) {
            history.push('/id-verification-success');
        }
    }

    const renderFilteredItems = () => {
        let sources: any = [];
        let types: any = [];

        if (Object.keys(frontPhotoId)?.length > 0) {
            sources.push(frontPhotoId.localURL);
            types.push('image');
        }

        if (Object.keys(backPhotoId)?.length > 0) {
            sources.push(backPhotoId.localURL);
            types.push('image');
        }

        return { sources, types };
    }

    const { sources, types } = renderFilteredItems();
    return (
        <div className="flex_row">
            <div className="flex_col_sm_8">
                <div className="relate">
                    <button
                        onClick={() => {
                            if (props.redirect_from === 'mark-milestone' && props.markMilestoneVerif) {
                                props.markMilestoneVerif('backStep');
                            } else if (props.setIdVerifClicked) props.setIdVerifClicked(false);
                        }}
                        className="back"></button>
                    <span className="xs_sub_title">
                        {'Add your ID photo'}
                    </span>
                </div>
                <p className="commn_para">Please add image of Front & Back side of your ID.</p>

                <FsLightbox
                    toggler={toggler}
                    slide={selectedSlide}
                    sources={sources}
                    types={types}
                    onClose={() => setSelectSlide(1)}
                />
            </div>

            <div className="flex_col_sm_12">
                <div className="upload_img_video">
                    {Object.keys(frontPhotoId)?.length > 0 &&
                        <figure className="img_video" onClick={() => {
                            setToggler((prev: boolean) => !prev);
                            setSelectSlide(1);
                        }}>
                            <img title={'front-photo-id'} src={frontPhotoId.localURL} alt="media" />
                            <img
                                onClick={(e) => { e.stopPropagation(); removeFromItem('frontId'); }}
                                src={close} alt="remove" className="remove" />
                        </figure>
                    }
                    {Object.keys(backPhotoId)?.length > 0 &&
                        <figure className="img_video" onClick={() => {
                            setToggler((prev: boolean) => !prev);
                            setSelectSlide(2);
                        }}>
                            <img title={'back-photo-id'} src={backPhotoId.localURL} alt="media" />
                            <img
                                onClick={(e) => { e.stopPropagation(); removeFromItem('backId') }}
                                src={close} alt="remove" className="remove" />
                        </figure>
                    }

                    {(Object.keys(frontPhotoId)?.length && Object.keys(backPhotoId)?.length) ? null : (
                        <React.Fragment>
                            <label className="upload_media" htmlFor="upload_img_video">
                                <img src={addMedia} alt="" />
                            </label>
                            <input
                                onChange={onFileChange}
                                type="file"
                                accept="image/png,image/jpg,image/jpeg"
                                style={{ display: "none" }}
                                id="upload_img_video"
                            />
                        </React.Fragment>
                    )}
                </div>
                <button
                    onClick={handleSubmit}
                    className={`fill_btn full_btn btn-effect ${checkErrors() ? 'disable_btn' : ''}`}>
                    {'Submit'}
                </button>
            </div>
        </div>
    )
}

export default LodgeDispute;