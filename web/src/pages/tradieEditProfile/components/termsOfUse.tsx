import { Component } from 'react'
import Urls,{ urlFor } from '../../../network/Urls';
import {setLoading} from '../../../redux/common/actions';
interface Props {
}

interface State {
    url: string,
}

export class TermsOfUse extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            url: urlFor(Urls.tncWeb),
        }
    }

    render() {
        if(!this.state.url){
            setLoading(true);
        }
        return (
            <div className="h-75vh">
                {/* <span className="sub_title">Terms of use</span> */}
                {this.state.url && <iframe src={this.state.url} title="Privacy Policy" width="100%" height="100%" />}
            </div>
        )
    }
}

export default TermsOfUse;
