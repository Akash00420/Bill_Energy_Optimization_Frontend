import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

// Thunk 1: Create a new bill
export const createBill = createAsyncThunk(
  "bill/createBill",
  async (billData, { rejectWithValue }) => {
    try {
      const res = await api.post("/bills/create-bill", billData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create bill"
      );
    }
  }
);

// Thunk 2: Get all bills
export const getAllBills = createAsyncThunk(
  "bill/getAllBills",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/bills/all-bills");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch bills"
      );
    }
  }
);

// Thunk 3: Get single bill by ID
export const getBillById = createAsyncThunk(
  "bill/getBillById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bills/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch bill"
      );
    }
  }
);

// Thunk 4: Update bill by ID
export const updateBill = createAsyncThunk(
  "bill/updateBill",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/bills/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to update bill"
      );
    }
  }
);

// Thunk 5: Delete bill by ID
export const deleteBill = createAsyncThunk(
  "bill/deleteBill",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/bills/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete bill"
      );
    }
  }
);

const billSlice = createSlice({
  name: "bill",
  initialState: {
    bills: [],
    billData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBillData: (state) => {
      state.billData = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── Create Bill ──────────────────────────────
      .addCase(createBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ backend returns { success: true, data: bill }
        const bill = action.payload.data || action.payload;
        state.bills.push(bill);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Get All Bills ────────────────────────────
      .addCase(getAllBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBills.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ backend returns { success: true, count: n, data: [...] }
        state.bills = action.payload.data || action.payload;
      })
      .addCase(getAllBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Get Bill By ID ───────────────────────────
      .addCase(getBillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillById.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ backend returns { success: true, data: bill }
        state.billData = action.payload.data || action.payload;
      })
      .addCase(getBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Update Bill ──────────────────────────────
      .addCase(updateBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ backend returns { success: true, data: updatedBill }
        const updated = action.payload.data || action.payload;
        const index = state.bills.findIndex((b) => b._id === updated._id);
        if (index !== -1) state.bills[index] = updated;
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Delete Bill ──────────────────────────────
      .addCase(deleteBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ we return { id } manually from thunk so no .data needed
        state.bills = state.bills.filter((b) => b._id !== action.payload.id);
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearBillData } = billSlice.actions;
export default billSlice.reducer;