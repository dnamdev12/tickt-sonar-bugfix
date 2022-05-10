import { combineReducers } from 'redux'
import auth from './auth/reducers';
import common from './common/reducers';
import homeSearch from './homeSearch/reducers';
import jobs from './jobs/reducers';
import profile from './profile/reducers';

const appReducer = combineReducers({
        auth,
        common,
        homeSearch,
        jobs,
        profile,
});

const rootReducer = (state: any, action: any) => {
        // when a logout action is dispatched it will reset redux state
        if (action.type === 'USER_LOGGED_OUT') {

                state = undefined;
        }

        return appReducer(state, action);
};

export default rootReducer