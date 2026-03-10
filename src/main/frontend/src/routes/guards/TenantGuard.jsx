import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAccount } from '../../auth/AuthContext'
import { routePath } from '../routeAddress';

function TenantGuard() {
  const {user} = useAccount();

  if(!user === null )
    // 비로그인이거나 테넌트멤버에 없으면 리다이렉트.
    <Navigate to={routePath.lmsVisitor} replace />
  return <Outlet></Outlet>
}

export default TenantGuard