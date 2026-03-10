import { useRoutes } from 'react-router-dom';
// import AppRoutes from './Routes2';
import path from './routeConfig';

function index() {
  return useRoutes(path);
}

export default index