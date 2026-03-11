import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Heading,
  Text,
  Container,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { DashboardStats, RecentActivity, BillCard, BillFormModal, ContributionModal } from '../components';
import { useAuthStore, useBillStore, useContributionStore } from '../store';
import { Bill, Contribution, Notification } from '../types/api';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const {
    bills,
    isLoading: billsLoading,
    error: billsError,
    fetchBills,
  } = useBillStore();
  const {
    contributions,
    isLoading: contributionsLoading,
    fetchContributions,
  } = useContributionStore();

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch initial data
    fetchBills();
    fetchContributions();
    
    // Mock notifications for now
    setNotifications([
      {
        id: 1,
        user_id: user?.id || 1,
        bill_id: 1,
        message: 'Your "Monthly Rent" bill is due in 3 days',
        type: 'reminder',
        is_sent: false,
        created_at: new Date().toISOString(),
      },
    ]);
  }, [isAuthenticated, navigate, fetchBills, fetchContributions, user?.id]);

  const handleCreateBill = () => {
    setSelectedBill(null);
    setIsBillModalOpen(true);
  };

  const handleEditBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsBillModalOpen(true);
  };

  const handleDeleteBill = async (billId: number) => {
    const { deleteBill } = useBillStore.getState();
    await deleteBill(billId);
    fetchBills();
  };

  const handleContribute = (billId: number) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      setSelectedBill(bill);
      setIsContributionModalOpen(true);
    }
  };

  const handleBillSubmit = async (data: any) => {
    try {
      if (selectedBill) {
        // Update existing bill
        const { updateBill } = useBillStore.getState();
        await updateBill(selectedBill.id, data);
      } else {
        // Create new bill
        const { createBill } = useBillStore.getState();
        await createBill(data);
      }
      setIsBillModalOpen(false);
      fetchBills();
    } catch (error) {
      console.error('Failed to save bill:', error);
    }
  };

  const handleContributionSubmit = async (data: any) => {
    try {
      const { createContribution } = useContributionStore.getState();
      await createContribution(data);
      setIsContributionModalOpen(false);
      fetchBills();
      fetchContributions();
    } catch (error) {
      console.error('Failed to add contribution:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="info">
          <AlertIcon />
          Please log in to access your dashboard
        </Alert>
      </Container>
    );
  }

  if (billsLoading || contributionsLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" />
          <Text>Loading your dashboard...</Text>
        </VStack>
      </Container>
    );
  }

  if (billsError) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {billsError}
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={bg} minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Box>
              <Heading size="2xl" color="gray.800">
                Welcome back, {user?.full_name}!
              </Heading>
              <Text color="gray.600" mt={2}>
                Here's an overview of your bills and contributions
              </Text>
            </Box>
            
            <HStack spacing={4}>
              <Button
                leftIcon={<FiRefreshCw />}
                variant="outline"
                onClick={() => {
                  fetchBills();
                  fetchContributions();
                }}
              >
                Refresh
              </Button>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={handleCreateBill}
              >
                New Bill
              </Button>
            </HStack>
          </HStack>

          {/* Dashboard Stats */}
          <DashboardStats
            bills={bills}
            contributions={contributions}
            notifications={notifications}
          />

          {/* Recent Activity */}
          <RecentActivity
            bills={bills}
            contributions={contributions}
          />

          {/* Bills Grid */}
          <Box>
            <HStack justify="space-between" align="center" mb={6}>
              <Heading size="lg" color="gray.800">
                Your Bills
              </Heading>
              <Text color="gray.600">
                {bills.length} total • {bills.filter(b => !b.is_paid).length} active
              </Text>
            </HStack>
            
            {bills.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {bills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onEdit={handleEditBill}
                    onDelete={handleDeleteBill}
                    onContribute={handleContribute}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box
                bg={cardBg}
                p={12}
                borderRadius="lg"
                textAlign="center"
                shadow="md"
              >
                <VStack spacing={4}>
                  <Heading size="md" color="gray.600">
                    No bills yet
                  </Heading>
                  <Text color="gray.500">
                    Create your first bill to get started with tracking your contributions
                  </Text>
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    onClick={handleCreateBill}
                  >
                    Create Your First Bill
                  </Button>
                </VStack>
              </Box>
            )}
          </Box>
        </VStack>
      </Container>

      {/* Modals */}
      <BillFormModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        onSubmit={handleBillSubmit}
        bill={selectedBill}
      />

      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        onSubmit={handleContributionSubmit}
        billId={selectedBill?.id || 0}
        billName={selectedBill?.name || ''}
        currentBalance={selectedBill?.current_balance || 0}
        targetAmount={selectedBill?.target_amount || 0}
      />
    </Box>
  );
};
