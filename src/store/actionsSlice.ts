import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ActionsState {
  selectedAction: string;
  startIndex: string;
  endIndex: string;
  actionFrom: string;
  actionTo: string;
  indexOffset: number;
}

const initialState: ActionsState = {
  selectedAction: '',
  startIndex: '',
  endIndex: '',
  actionFrom: '',
  actionTo: '',
  indexOffset: 0,
};

export const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    setSelectedAction: (state, action: PayloadAction<string>) => {
      state.selectedAction = action.payload;
    },
    setStartIndex: (state, action: PayloadAction<string>) => {
      state.startIndex = action.payload;
    },
    setEndIndex: (state, action: PayloadAction<string>) => {
      state.endIndex = action.payload;
    },
    setActionFrom: (state, action: PayloadAction<string>) => {
      state.actionFrom = action.payload;
    },
    setActionTo: (state, action: PayloadAction<string>) => {
      state.actionTo = action.payload;
    },
    setIndexOffset: (state, action: PayloadAction<number>) => {
      state.indexOffset = action.payload;
    },
    resetActionState: () => initialState,
  },
});

export const {
  setSelectedAction,
  setStartIndex,
  setEndIndex,
  setActionFrom,
  setActionTo,
  setIndexOffset,
  resetActionState,
} = actionsSlice.actions;

export default actionsSlice.reducer;