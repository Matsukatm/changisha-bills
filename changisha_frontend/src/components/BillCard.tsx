import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Progress,
  VStack,
  HStack,
  Badge,
  IconButton,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiDollarSign } from 'react-icons/fi';
import { Bill } from '../types/api';

interface BillCardProps {
  bill: Bill;
  onEdit?: (bill: Bill) => void;
  onDelete?: (billId: number) => void;
  onContribute?: (billId: number) => void;
}

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  onEdit,
  onDelete,
  onContribute,
}) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const progressPercentage = bill.target_amount > 0 
    ? (bill.current_balance / bill.target_amount) * 100 
    : 0;

  const isOverdue = new Date(bill.due_date) < new Date() && !bill.is_paid;
  const daysUntilDue = Math.ceil((new Date(bill.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getStatusColor = () => {
    if (bill.is_paid) return 'green';
    if (isOverdue) return 'red';
    if (daysUntilDue <= 3) return 'orange';
    return 'blue';
  };

  const getStatusText = () => {
    if (bill.is_paid) return 'Paid';
    if (isOverdue) return 'Overdue';
    if (daysUntilDue <= 1) return 'Due Today';
    if (daysUntilDue <= 3) return `Due in ${daysUntilDue} days`;
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden">
      <CardBody p={6}>
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <Flex justify="space-between" align="start">
            <Box flex="1">
              <Heading size="md" color={textColor} mb={2}>
                {bill.name}
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={1}>
                {bill.payment_method} • {bill.recipient_account}
              </Text>
              <Badge colorScheme={getStatusColor()} borderRadius="full" px={3}>
                {getStatusText()}
              </Badge>
            </Box>
            
            <HStack spacing={2}>
              {onContribute && !bill.is_paid && (
                <IconButton
                  aria-label="Add contribution"
                  icon={<FiDollarSign />}
                  size="sm"
                  colorScheme="green"
                  onClick={() => onContribute(bill.id)}
                />
              )}
              {onEdit && (
                <IconButton
                  aria-label="Edit bill"
                  icon={<FiEdit />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(bill)}
                />
              )}
              {onDelete && (
                <IconButton
                  aria-label="Delete bill"
                  icon={<FiTrash2 />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(bill.id)}
                />
              )}
            </HStack>
          </Flex>

          {/* Progress Section */}
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                Progress
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                KES {bill.current_balance.toLocaleString()} / KES {bill.target_amount.toLocaleString()}
              </Text>
            </Flex>
            
            <Progress
              value={progressPercentage}
              colorScheme={bill.is_paid ? 'green' : 'blue'}
              size="lg"
              borderRadius="full"
            />
            
            <Flex justify="space-between" align="center">
              <Text fontSize="xs" color="gray.500">
                {progressPercentage.toFixed(1)}% Complete
              </Text>
              <Text fontSize="xs" color="gray.500">
                KES {(bill.target_amount - bill.current_balance).toLocaleString()} remaining
              </Text>
            </Flex>
          </VStack>

          {/* Due Date */}
          <Box>
            <Text fontSize="sm" color="gray.500">
              Due Date: {new Date(bill.due_date).toLocaleDateString()}
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};
