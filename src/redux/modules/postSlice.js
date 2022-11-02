import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  post: [],
  isLoading: true,
  error: null,
 
};

const accessToken = localStorage.getItem("Access_Token");
const refreshToken = localStorage.getItem("Refresh_Token");
console.log(accessToken);
console.log(refreshToken);

export const __getPost = createAsyncThunk(
  "post/__getPost",
  async (payload, thunkAPI) => {
    console.log("겟payload 사진가니", payload)
    try {
      
      const data = await axios.get(`http://13.124.38.31/api/post`, {
        headers: {
          enctype: "multipart/form-data",
          // "Content-Type": `application/json`,
          // Authorization: ` ${accessToken}`,
          Authorization: accessToken,
          RefreshToken: refreshToken,
          "Cache-Control": "no-cache",
        },
      });
      console.log("겟img사진가니", data.data.data)
      return thunkAPI.fulfillWithValue(data.data.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const __getPostDetail = createAsyncThunk(
  "post/__getPostDetail",
  async (payload, thunkAPI) => {
    try {
      
      const data = await axios.get(`http://13.124.38.31/api/post/${payload}`, {
        headers: {
          "Content-Type": `application/json`,
          // Authorization: `Bearer ${accessToken}`,
          Authorization: accessToken,
          RefreshToken: refreshToken,
          "Cache-Control": "no-cache",
        },
      });
     
      return thunkAPI.fulfillWithValue(data.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const __addPost = createAsyncThunk(
  "post/__addPost",
  async (payload, thunkAPI) => {
    try {
      console.log("포스트payload사진가니", payload)
      await axios
        .post(
          `http://13.124.38.31/api/post`,
          // JSON.stringify(payload),
          payload,
          console.log("포스트 사진가니", payload),
          {
            headers: {
              enctype: "multipart/form-data",
              // "Content-Type": `application/json`,
              Authorization: accessToken,
              RefreshToken: refreshToken,
              "Cache-Control": "no-cache",
            },
          }
          
        )
       
        .then((response) => {
          console.log("포스트 사진가니", response)
        });
    } catch (error) {
 
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const __deletePost = createAsyncThunk(
  "post/__deletePost",
  async (payload, thunkAPI) => {
    try {
      const data = await axios.delete(
        `http://13.124.38.31/api/post/${payload}`,
        {
          headers: {
            enctype: "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: refreshToken,
            "Cache-Control": "no-cache",
          },
        }
      );
      return thunkAPI.fulfillWithValue(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const __editPost = createAsyncThunk(
  "post/__editPost",
  async (payload, thunkAPI) => {
  
    try {
      const data = await axios.put(
        `
        http://13.124.38.31/api/post/${payload.postId}
        `,
        payload.formData,
        {
          headers: {
            enctype: "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
            RefreshToken: refreshToken,
            "Cache-Control": "no-cache",
          },
        }
      );

      return thunkAPI.fulfillWithValue(data.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,

  reducers: {},
  extraReducers: {
    //__getPost
    [__getPost.pending]: (state) => {
      state.isLoading = true;
    },
    [__getPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.post = action.payload;
    },
    [__getPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    //__getPostDetail
    [__getPostDetail.pending]: (state) => {
      state.isLoading = true;
    },
    [__getPostDetail.fulfilled]: (state, action) => {
      state.isLoading = false;

      const indexId = state.post.findIndex((post) => {
        if (post.postId == action.payload.postId) {
          return true;
        }
        return false;
      });
      state.post[indexId] = action.payload;

      state.post = [...state.post];
    },
    [__getPostDetail.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    //__addPost
    [__addPost.pending]: (state) => {
      state.isLoading = true;
    },
    [__addPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.post = action.payload;
    },
    [__addPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    //__deletePost
    [__deletePost.pending]: (state) => {
      state.isLoading = true;
    },
    [__deletePost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.post = state.post.filter((post) => post.postId !== action.payload);
    },

    [__deletePost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    //__editPost
    [__editPost.pending]: (state) => {
      state.isLoading = true;
    },
    [__editPost.fulfilled]: (state, action) => {
      state.isLoading = false;

      const indexId = state.post.findIndex((post) => {
        if (post.postId == action.payload.postId) {
          return true;
        }
        return false;
      });
      state.post[indexId] = action.payload;

      state.post = [...state.post];
    },
    [__editPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default postSlice.reducer;
