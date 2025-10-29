import { getMonthlyOrders } from '@/src/app/actions/orders';
import PageComponent from './page-component';
import { getCategoryData, getCategoryAvailability } from '@/src/app/actions/categories';
import { getLatestUsers } from '@/src/app/actions/auth';

const Dashboard = async () => {
  const monthlyOrders = await getMonthlyOrders();
  const categoryData = await getCategoryData();
  const categoryAvailability = await getCategoryAvailability();

  console.log('Category Data:', categoryData);
  console.log('Category Availability:', categoryAvailability);
  const latestUsers = await getLatestUsers();

  return (
    <PageComponent
      latestUsers={latestUsers}
      monthlyOrders={monthlyOrders}
      categoryData={categoryData}
      categoryAvailability={categoryAvailability}
    />
  );
};

export default Dashboard;