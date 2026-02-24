import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users: [
        {id: 1, name: 'Snigdha', email: 'sdsdsd@gmgmg.com', role: 'Admin'},
        {id: 2, name: 'Tanya', email: 'ererer@gmgmg.com', role: 'Editor'},
        {id: 3, name: 'Khushi', email: 'eerdgh@gmgmg.com', role: 'Editor'},
        {id: 4, name: 'Aashka', email: 'yyyuyh@gmgmg.com', role: 'Viewer'},
        {id: 5, name: 'Nidhi', email: 'kukujgh@gmgmg.com', role: 'Viewer'},
        {id: 6, name: 'Sdsdds', email: 'sdsdsd@gmgmg.com', role: 'Admin'},
        {id: 7, name: 'Assadwr', email: 'ererer@gmgmg.com', role: 'Editor'},
        {id: 8, name: 'Fefsdfd', email: 'eerdgh@gmgmg.com', role: 'Editor'},
        {id: 9, name: 'Hrtrtc', email: 'yyyuyh@gmgmg.com', role: 'Viewer'},
        {id: 10, name: 'Ewrff', email: 'kukujgh@gmgmg.com', role: 'Viewer'},
        {id: 11, name: 'Finhtt', email: 'sdsdsd@gmgmg.com', role: 'Admin'},
        {id: 12, name: 'Mhjuku', email: 'ererer@gmgmg.com', role: 'Editor'},
        {id: 13, name: 'Phjhjh', email: 'eerdgh@gmgmg.com', role: 'Editor'},
        {id: 14, name: 'Yrfgf', email: 'yyyuyh@gmgmg.com', role: 'Viewer'},
        {id: 15, name: 'Redfv', email: 'kukujgh@gmgmg.com', role: 'Viewer'},

    ]
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        deleteUser: (state, action) => {
            state.users = state.users.filter(
                (user) => user.id !== action.payload
            );
        },
    },
});

export const { deleteUser } = userSlice.actions;
export default userSlice.reducer;