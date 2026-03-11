import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  Badge,
  useColorModeValue,
  Box,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { Bill, Notification, Contribution } from '../types/api';

interface DashboardStatsProps {
  bills: Bill[];
  contributions: Contribution[];
  notifications: Notification[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  bills,
  contributions,
  notifications,
}) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const activeBills = bills.filter(bill => !bill.is_paid);
  const paidBills = bills.filter(bill => bill.is_paid);
  const totalContributions = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
  const upcomingReminders = notifications.filter(n => n.type === 'reminder');

  const stats = [
    {
      label: 'Total Bills',
      value: bills.length,
      icon: FiCalendar,
      color: 'blue',
      helpText: `${activeBills.length} active, ${paidBills.length} paid`,
    },
    {
      label: 'Total Contributions',
      value: `KES ${totalContributions.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'green',
      helpText: `${contributions.length} contributions`,
    },
    {
      label: 'Active Bills',
      value: activeBills.length,
      icon: FiTrendingUp,
      color: 'orange',
      helpText: `${paidBills.length} completed`,
    },
    {
      label: 'Reminders',
      value: upcomingReminders.length,
      icon: FiCheckCircle,
      color: 'purple',
      helpText: 'Upcoming reminders',
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {stats.map((stat, index) => (
        <Card key={index} bg={cardBg} shadow="md" borderRadius="lg">
          <CardBody p={6}>
            <VStack align="start" spacing={3}>
              <HStack>
                <Box
                  p={2}
                  borderRadius="md"
                  bg={`${stat.color}.100`}
                  color={`${stat.color}.500`}
                >
                  <stat.icon size={20} />
                </Box>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600">
                    {stat.label}
                  </StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color={textColor}>
                    {stat.value}
                  </StatNumber>
                  <StatHelpText fontSize="xs" color="gray.500">
                    {stat.helpText}
                  </StatHelpText>
                </Stat>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};

interface RecentActivityProps {
  bills: Bill[];
  contributions: Contribution[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  bills,
  contributions,
}) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const recentBills = bills.slice(0, 3);
  const recentContributions = contributions.slice(0, 3);

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
      {/* Recent Bills */}
      <Card bg={cardBg} shadow="md" borderRadius="lg">
        <CardBody p={6}>
          <Heading size="md" mb={4} color={textColor}>
            Recent Bills
          </Heading>
          <VStack align="stretch" spacing={3}>
            {recentBills.length > 0 ? (
              recentBills.map((bill) => (
                <Box key={bill.id}>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium" color={textColor}>
                        {bill.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        KES {bill.current_balance.toLocaleString()} / KES {bill.target_amount.toLocaleString()}
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={bill.is_paid ? 'green' : 'blue'}
                      borderRadius="full"
                    >
                      {bill.is_paid ? 'Paid' : 'Active'}
                    </Badge>
                  </HStack>
                  {bill.id !== recentBills[recentBills.length - 1].id && (
                    <Divider mt={2} />
                  )}
                </Box>
              ))
            ) : (
              <Text color="gray.500" textAlign="center" py={4}>
                No bills yet
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Recent Contributions */}
      <Card bg={cardBg} shadow="md" borderRadius="lg">
        <CardBody p={6}>
          <Heading size="md" mb={4} color={textColor}>
            Recent Contributions
          </Heading>
          <VStack align="stretch" spacing={3}>
            {recentContributions.length > 0 ? (
              recentContributions.map((contribution) => (
                <Box key={contribution.id}>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium" color={textColor}>
                        Contribution
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(contribution.created_at).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <Text fontWeight="bold" color="green.500">
                      KES {contribution.amount.toLocaleString()}
                    </Text>
                  </HStack>
                  {contribution.id !== recentContributions[recentContributions.length - 1].id && (
                    <Divider mt={2} />
                  )}
                </Box>
              ))
            ) : (
              <Text color="gray.500" textAlign="center" py={4}>
                No contributions yet
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};
