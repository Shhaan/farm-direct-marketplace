import { createSlice } from "@reduxjs/toolkit";


const initialState = {   
    access:localStorage.getItem('access_token')?localStorage.getItem('access_token'):null,
    refresh:localStorage.getItem('refresh_token')?localStorage.getItem('refresh_token'):null
    }


const tokens = createSlice({
    name:'token',
    initialState,
    reducers: {
        setToken: (state,action) => {
            
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
        },
        removetoken:(state)=>{
              
            state.access = null ;
            state.refresh = null;
        }
        
    } 
})



 export default tokens.reducer
 export const {setToken,removetoken} = tokens.actions