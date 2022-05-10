import { Component } from 'react'
import Urls,{ urlFor } from '../../../network/Urls';
import { setLoading } from '../../../redux/common/actions';
interface Props {
}

interface State {
    url: string,
}

export class PrivacyPolicy extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            url: urlFor(Urls.privacyPolicyWeb),
        }
    }

    render() {
        if (!this.state.url) {
            setLoading(true);
        }
        return (
            <div className="h-75vh">
                {/* <span className="sub_title"> Privacy Policy</span> */}
                {this.state.url && <iframe src={this.state.url} title="Privacy Policy" width="100%" height="100%" />}
            </div>
        )
    }
}

export default PrivacyPolicy;
