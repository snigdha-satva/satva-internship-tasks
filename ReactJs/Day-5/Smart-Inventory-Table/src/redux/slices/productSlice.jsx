import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [
        {id: 1, name: 'Product A', price: '1000 Rs'},
        {id: 2, name: 'Product B', price: '1400 Rs'},
        {id: 3, name: 'Product C', price: '3000 Rs'},
        {id: 4, name: 'Product D', price: '3400 Rs'},
        {id: 5, name: 'Product E', price: '2300 Rs'},
        {id: 6, name: 'Product F', price: '1200 Rs'}
    ]
};

const productSlice = createSlice ({
    name: 'products',
    initialState,
    reducers: {
        deleteProduct: (state, action) => {
            state.products = state.products.filter(
                (product) => product.id !== action.payload
            )
        }
    }
});

export const { deleteProduct } = productSlice.actions;
export default productSlice.reducer;