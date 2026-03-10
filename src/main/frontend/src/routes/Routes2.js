import { Routes, Route } from 'react-router-dom';

// 권한
import LmsAuth from '../auth/LmsAuth.jsx';
import RoleRoute from '../auth/RoleRoute.jsx';

// 경로
import { routePath } from './routeAddress.js';

//페이지
import Layout2 from '../components/layout/Real/Layout2.jsx';
import GridLayout from './layouts/GridLayout.jsx';
import TenantSettingLayout from './layouts/TenantSettingLayout.jsx';
import SuperMain from '../pages/Super/SuperMain.jsx';

function AppRoutes() {
  return (
    // 권한기준
    /**
     * 흠...
     * 슈퍼메인 > LMS 진입 > 튕김 > LMS visitor
     */


    <Routes>
    {/* 로그인 필요 X =========================================================================*/}
      {/* Landing Page 레이아웃 ------------------------------------------------ */}
      <Route  element={<Layout2></Layout2>}>
        <Route index element={<SuperMain />} />
        
        
      </Route>
      {/* LMS 레이아웃 ------------------------------------------------------------  */}
      <Route element={<GridLayout></GridLayout>} >

      </Route>


    {/* 로그인 필요 o ==========================================================================*/}
    
      {/* LMS 레이아웃------------------------------------------------------------  */}
      {/* 튕기면 LMS vistor로 보냄 >> 백에서  */}
      <Route element={<LmsAuth />}>
        {/* 테넌트 가드 자리, 테넌트와 같은 소속이 아니면 LMS visitor로 보냄 */}
        <Route element={<RoleRoute roles={[1, 2]} />}>
          {/* 회사정보 세팅 */}
          <Route path={routePath.lms.setting} element={<TenantSettingLayout></TenantSettingLayout>} />
          <Route element={<GridLayout></GridLayout>} >
            
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
