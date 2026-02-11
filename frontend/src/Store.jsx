import { configureStore } from "@reduxjs/toolkit";
import UserSlice from './Slices/UserSlice'
import Token from "./Slices/Access";
const store = configureStore({
    reducer:{
        'user':UserSlice,
         Token
    }, 
})

export default store