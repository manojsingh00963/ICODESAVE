import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const host = 'http://localhost:5000';

// ✅ Get all notes
export const getNotes = createAsyncThunk('notes/getNotes', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    toast.error('Authorization token is missing!');
    return rejectWithValue('No token found');
  }

  try {
    const response = await axios.get(`${host}/api/notes/fetchnotes`, {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token, // ✅ No need for Bearer prefix
      },
    });

    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch notes');
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch notes');
  }
});

// ✅ Add a note
export const addNote = createAsyncThunk(
  'notes/addNote',
  async ({ title, content, tag }, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error('Authorization token is missing!');
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(
        `${host}/api/notes/addnote`,
        { title, content, tag },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        }
      );

      toast.success('Note added successfully!');
      return response.data;
    } catch (error) {
      console.error('Add Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add note');
      return rejectWithValue(error.response?.data?.message || 'Failed to add note');
    }
  }
);

// ✅ Delete a note
export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error('Authorization token is missing!');
      return rejectWithValue('No token found');
    }

    try {
      await axios.delete(`${host}/api/notes/deletenote/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });

      toast.success('Note deleted successfully!');
      return id;
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete note');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete note');
    }
  }
);

// ✅ Edit a note
export const editNote = createAsyncThunk(
  'notes/editNote',
  async ({ id, title, content, tag }, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error('Authorization token is missing!');
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.put(
        `${host}/api/notes/updatenote/${id}`,
        { title, content, tag },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        }
      );

      toast.success('Note updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Update Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update note');
      return rejectWithValue(error.response?.data?.message || 'Failed to update note');
    }
  }
);

// ✅ Initial state
const initialState = {
  notes: [],
  loading: false,
  error: null,
};

// ✅ Create Slice
export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    resetNotes: (state) => {
      state.notes = [];
      toast.info('All notes cleared');
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get Notes
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Add Note
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      })

      // ✅ Delete Note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((note) => note._id !== action.payload);
      })

      // ✅ Edit Note
      .addCase(editNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(
          (note) => note._id === action.payload._id
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      });
  },
});

export const { resetNotes } = noteSlice.actions;

export default noteSlice.reducer;
