// import { BrowserRouter, Routes, Route, Link , Navigate, useLocation} from 'react-router-dom';
import { BrowserRouter } from "react-router-dom";
// import GeneralSignup from './pages/GeneralSignup';
// import TenantSignup from './pages/TenantSignup';
// import Login from './pages/Login';
// import ProtectedRoute from './components/ProtectedRoute.jsx';
// 라이브러리
import { ToastContainer } from "react-toastify";

//페이지
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./auth/AuthProvider";
import { SelectedCompanyProvider } from './contexts/SelectedCompanyContext';

//스타일


export default function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
      <SelectedCompanyProvider>
        <AppRoutes />
          <ToastContainer
                autoClose={2000}
                closeOnClick={true}
                draggable={false}
                theme="light"
                position="top-center"
                style={{zIndex: "99999999"}}
              />
        </SelectedCompanyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
