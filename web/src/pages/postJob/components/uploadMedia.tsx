import React, { useEffect, useState } from 'react';
import remove from "../../../assets/images/icon-close-1.png";
import addMedia from "../../../assets/images/add-image.png";
import docThumbnail from '../../../assets/images/add-document.png'
import { onFileUpload } from '../../../redux/auth/actions';
import { setLoading, setShowToast } from '../../../redux/common/actions';
import { thumbnailExtract } from '../../../common/thumbnail';
//@ts-ignore
import DropboxChooser from 'react-dropbox-chooser';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';

interface Proptypes {
    jobName?: string;
    title?: string;
    para?: string;
    hasDescription?: boolean;
    data: any;
    stepCompleted: boolean;
    handleStepComplete: (data: any) => void;
    handleStepForward: (data: any) => void;
    handleStepBack: () => void;
}

const imageFormats: Array<any> = ["jpeg", "jpg", "png"];
const videoFormats: Array<any> = ["mp4", "wmv", "avi"];
const docTypes: Array<any> = ["jpeg", "jpg", "png", "mp4", "wmv", "avi", "pdf", "doc", "docx", "msword"];
const docformats: Array<any> = ["pdf", "doc", "docx", "msword"];

const UploadMedia = ({ jobName, title, para, hasDescription, data, stepCompleted, handleStepForward, handleStepComplete, handleStepBack }: Proptypes) => {
    const [update, forceUpdate] = useState({});
    const [filesUrl, setFilesUrl] = useState([] as any);
    const [description, setDescription] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const [selectedSlide, setSelectSlide] = useState(1);
    const [isItemsLoad, setLoadItems] = useState({});
    const [renderAsyncLoad, setAsyncLoad] = useState<any>(null);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isFileChoser = Boolean(anchorEl);

    const fileChoserClicked = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const fileChoserClosed = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (stepCompleted) {
            setFilesUrl(data?.urls);
            setSubmitClicked(true);
        }
    }, [stepCompleted, data]);

    const randomDelay = (item: any, index: any) => new Promise(resolve => {

        let split_item_format = item.split('.');
        let get_split_fromat = split_item_format[split_item_format.length - 1];

        let split_item_name = item.split('/');
        let get_split_name = split_item_name[split_item_name.length - 1];
        let image_render: any = null;
        let loadByIndex = { [index]: true };

        if (get_split_fromat) {
            if (imageFormats.includes(get_split_fromat)) {
                image_render = (
                    <img
                        id={`media_${index}`}
                        onClick={() => { setItemToggle(index) }}
                        title={get_split_name}
                        src={item}
                        onLoad={() => {
                            loadByIndex[index] = false;
                            console.log('image_render', '--->', { loadByIndex })
                        }}
                        alt="media"
                    />)
            }
        }

        if (!loadByIndex[index]) {
            console.log('Hered!!!')
            resolve(image_render);
        }
    });


    const calc = async (item: any, index: any) => {
        let result = await randomDelay(item, index);
        console.log({ result });
        return result;
    };

    const asyncFunc = async () => {
        const p = filesUrl.map((item: any, index: any) => calc(item.link, index));
        const results = await Promise.all(p);
        setAsyncLoad(results);
    };

    useEffect(() => {
        asyncFunc();
    }, [filesUrl])

    const checkErrors = () => {
        if (!filesUrl?.length) {
            return true;
        }

        if (hasDescription && (!description.trim() || description.length > 1000)) {
            return true;
        }

        return false;
    }

    const removeFromItem = (index: any) => {
        filesUrl.splice(index, 1);
        setFilesUrl(filesUrl);
        Array.isArray(update) ? forceUpdate([]) : forceUpdate({});
    }


    const checkIfVideoExist = () => {
        let videoItems: any = [];
        let ImageItems: any = [];
        let concatFormat = [...imageFormats, ...docformats];
        filesUrl.forEach((element: any) => {
            let split_items = element.link.split('.');
            let format_split_items = split_items[split_items?.length - 1];
            if (videoFormats.includes(format_split_items)) {
                videoItems.push(format_split_items);
            }

            if (concatFormat.includes(format_split_items)) {
                ImageItems.push(format_split_items);
            }
        });
        console.log({
            concatFormat,
            ImageItems,
            videoItems
        })
        if (ImageItems?.length === 6) {
            return ".mp4, .wmv, .avi";
        }

        if (videoItems?.length == 2) {
            return ".png,.jpg,.jpeg,.pdf,.doc";
        }

        return ".png,.jpg,.jpeg,.pdf,.doc,.mp4,.wmv,.avi";
    }

    const checkIfVideoExist_ = () => {
        let videoItems = [];
        let ImageItems = [];
        filesUrl.forEach((element: any) => {
            let split_items = element.link.split('.');
            let format_split_items = split_items[split_items?.length - 1];
            if (videoFormats.includes(format_split_items)) {
                videoItems.push(format_split_items);
            }

            if ([...imageFormats, ...docformats].includes(format_split_items)) {
                ImageItems.push(format_split_items);
            }
        });


        return {
            videoCount: videoItems.length,
            imageCount: ImageItems.length
        }

    }

    const onDropBoxSuccess = (files: any) => {
        onFileChange('', true, files[0]);
    }

    const onDropBoxCancel = (err: any) => {
        console.log(err, "err --- Dropbox");
    }

    const onFileChange = async (e: any, isDropbox?: boolean, dropBoxFile?: any) => {
        const formData = new FormData();
        var fileType;
        const newFile = isDropbox ? dropBoxFile?.link : e.target.files[0];
        if (isDropbox) {
            let dropBoxArr: any = newFile?.split(".");
            fileType = dropBoxArr[dropBoxArr.length - 1]?.toLowerCase();
        } else {
            fileType = (newFile?.type?.split('/')[1])?.toLowerCase();
        }

        fileChoserClosed();

        if (hasDescription && !imageFormats.includes(fileType)) {
            setShowToast(true, "The file must be in proper format");
            return;
        }

        if (filesUrl?.length === 8) {
            setShowToast(true, "Max files upload limit is 6")
            return;
        }

        let checkCounts: any = checkIfVideoExist_();

        if (checkCounts?.videoCount === 2) {
            if (videoFormats.includes(fileType)) {
                return
            }
        }

        if (checkCounts?.imageCount >= 6) {
            let concatFormats = [...imageFormats, ...docformats];
            if (concatFormats.includes(fileType)) {
                return
            }
        }

        let filesUrlClone: any = filesUrl;

        let countVideoFormats = filesUrlClone.map((item: any) => {
            let split_items = item.link.split('.');

            let format_split_items = split_items[split_items?.length - 1];

            if (videoFormats.includes(format_split_items)) {
                return format_split_items;
            }
        }).filter((item: any) => item !== undefined);

        var selectedFileSize = isDropbox ? dropBoxFile?.bytes / 1024 / 1024 : newFile?.size / 1024 / 1024; // size in mb

        if (docTypes.indexOf(fileType) < 0 || (selectedFileSize > 10)) {
            setShowToast(true, "The file must be in proper format or size")
            return;
        }

        if (imageFormats.includes(fileType) && selectedFileSize > 10) { // image validations
            setShowToast(true, "The image file size must be below 10 mb")
            return;
        }

        if (videoFormats.includes(fileType)) { // video validations
            if (selectedFileSize > 10) {
                setShowToast(true, "The video file size must be below 20 mb")
                return;
            }
            if (countVideoFormats?.length > 1) {
                setShowToast(true, "Max video file upload limit is 2")
                return;
            }
        }

        !isDropbox && formData.append('file', newFile);
        setLoadItems({});
        const res: any = isDropbox ? { success: true } : await onFileUpload(formData);
        setLoading(true);
        if (res.success) {
            let link: string = isDropbox ? dropBoxFile?.link : res?.imgUrl;
            let check_type: any = imageFormats.includes(fileType) ? 1 : videoFormats.includes(fileType) ? 2 : ["doc", "docx", "msword"].includes(fileType) ? 3 : 4
            setFilesUrl((prev: Array<any>) => [...prev, {
                "mediaType": check_type,
                "link": link
            }]);
            setLoadItems((prev: any) => ({
                [filesUrl.length - 1]: false
            }))
        }
    }


    const setItemToggle = (index: any) => {
        setSelectSlide(index + 1);
    }

    const renderbyFileFormat = (item: any, index: any, base64?: any) => {
        let split_item_format = item.split('.');
        let get_split_fromat = split_item_format[split_item_format.length - 1];

        let split_item_name = item.split('/');
        let get_split_name = split_item_name[split_item_name.length - 1];
        let image_render: any = null;
        let loadByIndex = { [index]: true };
        if (get_split_fromat) {
            if (imageFormats.includes(get_split_fromat)) {
                image_render = (
                    <img
                        id={`media_${index}`}
                        title={get_split_name}
                        src={item}
                        async-src={item}
                        decoding="async"
                        loading="lazy"
                        onLoad={() => {
                            console.log('Loaded!')
                            loadByIndex[index] = false;
                            console.log('image_render', '--->', { loadByIndex })
                            setLoadItems((prev: any) => ({
                                [index]: true
                            }))
                        }}
                        alt="media"
                    />)
            }

            if (videoFormats.includes(get_split_fromat)) {
                if (base64) {
                    image_render = (
                        <video
                            id={`media_${index}`}
                            title={get_split_name}
                            crossOrigin="anonymous"
                            src={item}
                            poster={base64}
                            controls={false}
                            onLoadedData={() => {
                                console.log('Loaded!')
                                setLoadItems((prev: any) => ({
                                    [index]: true
                                }))
                            }}
                        />
                    )
                } else {
                    image_render = (
                        <video id={`media_${index}`} crossOrigin="anonymous"
                            src={item}
                            controls={false}
                            title={get_split_name}
                            onLoadedData={() => {
                                console.log('Loaded!')
                                setLoadItems((prev: any) => ({
                                    [index]: true
                                }))
                            }}
                        />
                    )
                }
            }

            if (docformats.includes(get_split_fromat)) {
                image_render = (
                    <img
                        id={`media_${index}`}
                        title={get_split_name}
                        src={docThumbnail}
                        async-src={item}
                        decoding="async"
                        loading="lazy"
                        onLoad={() => {
                            loadByIndex[index] = false;
                            console.log('Loaded!')
                            setLoadItems((prev: any) => ({
                                [index]: true
                            }))
                        }}
                        alt="media"
                    />)
            }
            return (
                <figure className="img_video">
                    <React.Fragment>
                        {image_render && (
                            <React.Fragment>
                                {image_render}
                                <img
                                    onClick={() => { removeFromItem(index) }}
                                    src={remove}
                                    alt="remove"
                                    className="remove"
                                />
                            </React.Fragment>
                        )}
                    </React.Fragment>
                </figure>
            )
        }
    }

    let IsRenderValues = null;
    if (Object.values(isItemsLoad)?.length) {
        IsRenderValues = Array.isArray(Object.values(isItemsLoad)) && Object.values(isItemsLoad)[0] === true ? Object.values(isItemsLoad)[0] : false;
    }

    if (IsRenderValues === false) {
        setLoading(true);
    }

    if (IsRenderValues === true) {
        setLoading(false);
    }

    let checkErrors_: any = checkErrors();
    console.log({ IsRenderValues, isItemsLoad, check: checkErrors_ })
    return (
        <div className={`app_wrapper${jobName ? ' padding_0' : ''}`}>
            <div className={`section_wrapper${jobName ? ' padding_0' : ''}`}>
                <div className="custom_container">
                    <canvas id="canvas-extractor" style={{ display: 'none' }}></canvas>

                    <div className="form_field">
                        <div className="flex_row">
                            <div className={`flex_col_sm_${jobName ? '7' : '6'}`}>
                                <div className="relate">
                                    <button
                                        onClick={() => { hasDescription ? handleStepBack() : handleStepForward(6) }}
                                        className="back"></button>
                                    <span className={jobName ? "xs_sub_title" : "title"}>{jobName || 'Photos and documents'}</span>
                                </div>
                                {title && <span className="sub_title">{title}</span>}
                                <p className="commn_para">
                                    {para || 'Record a short video (up to 30 seconds) or add up to 6 photos and files to demonstrate your job and any unique requirements.'}
                                </p>
                            </div>
                            {!jobName && !filesUrl?.length && !hasDescription ? (
                                <div className="flex_col_sm_5 text-right">
                                    <span
                                        onClick={() => {
                                            handleStepForward(14)
                                        }}
                                        className="link">
                                        {'Skip'}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex_row">
                        <div className="flex_col_sm_12">
                            <div className="upload_img_video">
                                {filesUrl?.length ?
                                    filesUrl.map((item: any, index: number) => (renderbyFileFormat(item?.link, index, item?.base64)))
                                    : null}

                                <button
                                    className='media_btn'
                                    id="fade-button"
                                    aria-controls={isFileChoser ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={isFileChoser ? 'true' : undefined}
                                    onClick={fileChoserClicked}
                                >
                                    <img src={addMedia} alt="" />
                                </button>

                                <Menu
                                    className="fsp_modal range dropbox"
                                    id="fade-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={isFileChoser}
                                    onClose={fileChoserClosed}
                                    TransitionComponent={Fade}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    {filesUrl?.length < 8 ? (
                                        <React.Fragment>
                                            <label className="upload_media" htmlFor="upload_img_video">
                                                {/* <img src={addMedia} alt="" /> */}
                                                Upload from files
                                            </label>
                                            {!hasDescription ? (
                                                <>
                                                    <input
                                                        onChange={onFileChange}
                                                        type="file"
                                                        accept={checkIfVideoExist()}
                                                        style={{ display: "none" }}
                                                        id="upload_img_video"
                                                    />
                                                    <DropboxChooser
                                                        appKey={process.env.REACT_APP_DROPBOX_APP_KEY}
                                                        success={(files: any) => onDropBoxSuccess(files)}
                                                        cancel={(err: any) => onDropBoxCancel(err)}
                                                        multiselect={false}
                                                        linkType={'direct'}
                                                    >
                                                        <button className="dropbox-button">Upload from Dropbox</button>
                                                    </DropboxChooser>
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        onChange={onFileChange}
                                                        type="file"
                                                        accept={hasDescription ? "image/png,image/jpg,image/jpeg" : "image/png,image/jpg,image/jpeg,.pdf, .doc, video/mp4, video/wmv, video/avi"}
                                                        style={{ display: "none" }}
                                                        id="upload_img_video"
                                                    />
                                                    <DropboxChooser
                                                        appKey={process.env.REACT_APP_DROPBOX_APP_KEY}
                                                        success={(files: any) => onDropBoxSuccess(files)}
                                                        cancel={(err: any) => onDropBoxCancel(err)}
                                                        multiselect={false}
                                                        linkType={'direct'}
                                                    >
                                                        <button className="dropbox-button">Upload from Dropbox</button>
                                                    </DropboxChooser>
                                                </>
                                            )}
                                        </React.Fragment>
                                    ) : null}
                                </Menu>

                            </div>
                        </div>
                    </div>
                    <div className="flex_row">
                        <div className="flex_col_sm_8">
                            {hasDescription && (
                                <div className="form_field">
                                    <label className="form_label">Photo Description</label>
                                    <div className="text_field">
                                        <textarea placeholder="The item has.." value={description} onChange={({ target: { value } }: any) => setDescription(value)} />
                                        {description.length ?
                                            <span className="char_count">
                                                {`character length : ${description.length} / 1000`}
                                            </span>
                                            : ''}
                                    </div>
                                    <span className="error_msg">{submitClicked && !description.trim() ? 'Photo Description is required.' : description.length > 1000 ? 'Maximum 1000 characters are allowed.' : ''}</span>
                                </div>
                            )}
                            <div className="form_field">
                                <button
                                    onClick={() => {
                                        setSubmitClicked(true);
                                        let filteredItems: any = [];
                                        let isRender: boolean = false;
                                        filesUrl.forEach((item: any, index: any) => {
                                            if (item?.mediaType === 2) {
                                                if (!item?.base64) {
                                                    let base64 = thumbnailExtract({
                                                        canvasId: '#canvas-extractor',
                                                        videoId: `#media_${index}`
                                                    });
                                                    item['base64'] = base64;
                                                }
                                            }
                                            filteredItems.push(item);
                                        });
                                        if (!isRender) {
                                            setFilesUrl(filteredItems);
                                            handleStepComplete({
                                                urls: filteredItems,
                                                description: hasDescription ? description : undefined,
                                            })
                                        }
                                    }}
                                    className={`fill_btn full_btn btn-effect ${checkErrors_ && IsRenderValues == null ? 'disable_btn' : !checkErrors_ && !IsRenderValues ? 'disable_btn' : ''}`}>
                                    {'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default UploadMedia
