export const UPDATE_STORAGE = "update_storage";
export const CLEAR_STORAGE = "clear_storage";

export const onUpdateStorage = (data: any) => {
    return {
        type: UPDATE_STORAGE,
        value: data
    }
}

export const onClearStorage = () => {
    return {
        type: CLEAR_STORAGE
    }
}