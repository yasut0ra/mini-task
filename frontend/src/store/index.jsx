import { createContext, useContext, useReducer, useEffect } from 'react';

// 初期状態
const initialState = {
  error: null,
  loading: false
};

// アクション
export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const SET_LOADING = 'SET_LOADING';

// リデューサー
function reducer(state, action) {
  switch (action.type) {
    case SET_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// コンテキスト
const StoreContext = createContext(null);

// プロバイダーコンポーネント
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // グローバルストアの初期化
  useEffect(() => {
    store.init(dispatch);
  }, [dispatch]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// カスタムフック
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

// ストアのインスタンス（APIエラーハンドリング用）
export const store = {
  dispatch: null,
  init(dispatch) {
    this.dispatch = dispatch;
  }
};