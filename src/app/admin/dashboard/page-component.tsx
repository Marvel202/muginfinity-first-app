'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';

type MonthlyOrderData = {
  name: string;
  orders: number;
};

type CatrgoryData = {
  name: string;
  products: number;
};

type CategoryAvailability = {
  name: string;
  available: number;
  category: string;
};

type LatestUser = {
  id: string;
  email: string;
  date: string | null;
  totalPurchases: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PageComponent = ({
  monthlyOrders,
  categoryData,
  categoryAvailability,
  latestUsers,
}: {
  monthlyOrders: MonthlyOrderData[];
  categoryData: CatrgoryData[];
  categoryAvailability: CategoryAvailability[];
  latestUsers: LatestUser[];
}) => {
  return (
    <div className='flex-1 p-8 overflow-auto'>
      <h1 className='text-3xl font-bold mb-6'>Dashboard Overview</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='orders' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey='products'
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  fill='#8884d8'
                  labelLine={false}
                  label={(props: { name?: string; value?: number }) => {
                    const total = categoryData.reduce((sum, item) => sum + item.products, 0);
                    const percent = props.value && total > 0 ? ((props.value / total) * 100).toFixed(0) : '0';
                    return `${props.name || ''} ${percent}%`;
                  }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category To products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Products Available</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={categoryAvailability}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis 
                  dataKey='name' 
                  angle={-45}
                  textAnchor='end'
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm text-gray-600">
                            Category: {data.category}
                          </p>
                          <p className="text-sm text-green-600 font-medium">
                            Available: {data.available} pieces
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey='available' fill='#82ca9d' name="Available Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Latest Users */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Purchases</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.date}</TableCell>
                    <TableCell>{user.totalPurchases}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageComponent;