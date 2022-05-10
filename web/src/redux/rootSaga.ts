import { all, call } from 'redux-saga/effects';
import auth from './auth/sagas';
import homeSearch from './homeSearch/sagas';
import jobs from './jobs/sagas';
import profile from './profile/sagas';

export default function* rootSaga(): any {
    return yield all([
        call(auth),
        call(jobs),
        call(homeSearch),
        call(profile),
    ])
}