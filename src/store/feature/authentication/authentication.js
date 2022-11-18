import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  login: false,
  user_data: {},
};

export const authenticationSlice = createSlice({
  name: 'authenticate',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload;
    },
    setUserdata: (state, action) => {
      state.user_data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setLogin, setUserdata} = authenticationSlice.actions;

export default authenticationSlice.reducer;
