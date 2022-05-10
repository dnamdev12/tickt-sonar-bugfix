import { Component } from 'react'

interface Props {
}

interface State {
    isToggleSidebar: boolean,
}

export class SupportChat extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            isToggleSidebar: false,
        }
    }

    render() {
        return (
            <div className="flex_row">
                <div className="flex_col_sm_8">
                    <span className="sub_title">Support chat</span>
                    <span className="info_note">Select the category with which the problem occurred</span>
                    <div className="support_categ">
                        <div className="radio_wrap agree_check">
                            <input
                                className="filter-type filled-in"
                                type="radio"
                                id="Jobs" />
                            <label htmlFor="Jobs">Jobs</label>
                        </div>
                        <div className="radio_wrap agree_check">
                            <input
                                className="filter-type filled-in"
                                type="radio"
                                id="Categories" />
                            <label htmlFor="Categories">Categories</label>
                        </div>
                        <div className="radio_wrap agree_check">
                            <input
                                className="filter-type filled-in"
                                type="radio"
                                id="Profile" />
                            <label htmlFor="Profile">Profile</label>
                        </div>
                        <div className="radio_wrap agree_check">
                            <input
                                className="filter-type filled-in"
                                type="radio"
                                id="Tradie" />
                            <label htmlFor="Tradie">Tradesperson</label>
                        </div>
                        <div className="radio_wrap agree_check">
                            <input
                                className="filter-type filled-in"
                                type="radio"
                                id="Revenue" />
                            <label htmlFor="Revenue">Revenue</label>
                        </div>
                        <div className="radio_wrap agree_check">
                            <input
                                className="filter-type filled-in"
                                type="radio"
                                id="Other" />
                            <label htmlFor="Other">Other</label>
                        </div>
                    </div>
                    <div className="mb50">
                        <label className="form_label">Write your message</label>
                        <div className="text_field">
                            <input type="text" placeholder="Your message" name="messag" />
                        </div>
                        <span className="error_msg"></span>
                    </div>
                    <button className="fill_btn full_btn btn-effect">Send</button>
                </div>
            </div>
        )
    }
}

export default SupportChat;
