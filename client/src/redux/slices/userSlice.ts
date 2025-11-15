import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interfaces/User";

const initialState: User = {
    _id:"",
    username: "",
    email: "",
    password: "",
    followings: []
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state: any, action: PayloadAction<User>) => {
            return {...state, ...action.payload}
        },
        addUserFollowers: (state:any, action: PayloadAction<string[]>) => {
            return {...state, followings: action.payload}
        }
    }
})

export const {setUser, addUserFollowers} = userSlice.actions

export default userSlice.reducer