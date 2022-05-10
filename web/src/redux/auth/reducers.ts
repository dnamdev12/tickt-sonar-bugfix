import * as actionTypes from './constants'

const initialState = {
    tradeListData: [],
    error: '',
}

const reducer = (state = initialState, action: any) => {
    // console.log(action)
    switch (action.type) {
        case actionTypes.RECEIVE_API_DATA:
            return {
                ...state,
                userData: action.data
            }
        case actionTypes.FAILED_API_DATA:
            return {
                ...state,
                error: action.message
            }
        case actionTypes.CALL_TRADE_LIST_SUCCESSED:
            return {
                ...state,
                tradeListData: action.payload
            }
        default: return state
    }
}

export default reducer