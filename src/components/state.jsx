// import React from 'react'
import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'


const user_info = createSlice({
    name: 'user_info',
    initialState : {
        username : '',
        id:'1234',
        count:0,
        profile_pic:'',
        accessToken:'',
        refreshToken:''
    },
    reducers : {
        set_user_info : (state,action) => {
            state.username = action.payload.username
            state.id = action.payload.id
            state.profile_pic = action.payload.profile_pic
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
        },
        increment : (state)=>{
            state.count += 1
        },
        decrement : (state)=>{
            state.count -= 1
        }
    }
}
)

const persistconfig = {
    key : "root",
    storage,
    version : 1
}

const reducer = combineReducers({
    user_info : user_info.reducer
})

const persistedreducer = persistReducer(persistconfig,reducer)
export const { set_user_info } = user_info.actions

const store = configureStore({
    reducer: persistedreducer
})

export default store