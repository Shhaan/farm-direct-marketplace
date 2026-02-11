import { createSlice } from "@reduxjs/toolkit";


const initialState = {   
    isAuthenticated:false,
    isFarmer:false,
    user:{},
    loading:false,
    error:null,
    }


const UserSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        UserLogLoading: (state) => {
            
            state.loading = true;
            state.error = null;
        },
        UserisFarmer: (state) => {
            state.isFarmer = true;
        },
        UserRegistered: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        UserRegistrationerr: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})




export const {UserLogLoading,UserRegistered,UserRegistrationerr,UserisFarmer} = UserSlice.actions
export default UserSlice.reducer