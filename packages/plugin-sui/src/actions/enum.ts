export enum SuiAction {
    TRANSFER_TOKEN = "TRANSFER_TOKEN",
    SWAP_TOKEN = "SWAP_TOKEN",
    GET_BALANCE = "GET_BALANCE",
    GET_TOKEN = "GET_TOKEN",
    GET_PORTFOLIO = "GET_PORTFOLIO",
    GET_METADATA_TOKEN = "GET_METADATA_TOKEN",
}

export enum SuiLendAction {
    BORROW_TOKEN_SUILEND = "BORROW_TOKEN_SUILEND",
    REPAY_TOKEN_SUILEND = "REPAY_TOKEN_SUILEND",
    DEPOSIT_TOKEN_SUILEND = "DEPOSIT_TOKEN_SUILEND",
    WITHDRAW_TOKEN_SUILEND = "WITHDRAW_TOKEN_SUILEND",
}

export enum SentimentAction {
    FILTER_TWEETS = "FILTER_TWEETS",
}

export enum ChatDataAction {
    INSIGHT_DATA = "INSIGHT_DATA",
    RAW_DATA = "RAW_DATA",
    ERROR = "ERROR"
}
