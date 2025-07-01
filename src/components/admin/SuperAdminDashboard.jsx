import { Box } from '@mui/material';
import Layout from './Layout';
import DashboardContent from './DashboardContent'; // Your card & data layout

const SuperAdminDashboard = () => {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
};

export default SuperAdminDashboard;