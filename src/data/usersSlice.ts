import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

type UsersState = {
  users: User[];
  status: "idle" | "pending" | "success" | "error";
};

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (page: number, thunkAPI) => {
    try {
      const res = await fetch(`https://reqres.in/api/users?page=${page}`);
      return await res.json();
    } catch (e) {
      thunkAPI.rejectWithValue("Not able to fetch the users");
    }
  }
);

const initialState: UsersState = {
  users: [],
  status: "idle",
};

const usersSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    deleteUser: (state: UsersState, action: PayloadAction<number>) => {
      const idToDelete = action.payload;
      const eleToDelete = state.users.findIndex(
        (user) => user.id === idToDelete
      );
      if (eleToDelete > -1) state.users.splice(eleToDelete, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "success";
        console.log(action.payload);
        state.users = action.payload["data"] as User[];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "error";
        console.log(action.payload);
        state.users = [];
      });
  },
});

export default usersSlice.reducer;

export const { deleteUser } = usersSlice.actions;
