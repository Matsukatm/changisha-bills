import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  useColorModeValue,
  useToast,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContributionCreate } from '../types/api';

const contributionSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
});

type ContributionFormData = z.infer<typeof contributionSchema>;

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContributionCreate) => void;
  billId: number;
  billName: string;
  currentBalance: number;
  targetAmount: number;
  isLoading?: boolean;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  billId,
  billName,
  currentBalance,
  targetAmount,
  isLoading = false,
}) => {
  const toast = useToast();
  const remainingAmount = targetAmount - currentBalance;
  const maxContribution = Math.max(0, remainingAmount);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const watchedAmount = watch('amount');

  const onFormSubmit = (data: ContributionFormData) => {
    if (data.amount > maxContribution) {
      toast({
        title: 'Invalid Amount',
        description: `Maximum contribution is KES ${maxContribution.toLocaleString()}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSubmit({
      bill_id: billId,
      amount: data.amount,
    });
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Contribution</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            {/* Bill Info */}
            <Card bg={cardBg} shadow="sm" borderRadius="md" w="full">
              <CardBody p={4}>
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="bold" color={textColor}>
                    {billName}
                  </Text>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">
                      Current Balance:
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      KES {currentBalance.toLocaleString()}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">
                      Target Amount:
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      KES {targetAmount.toLocaleString()}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">
                      Remaining:
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="green.500">
                      KES {maxContribution.toLocaleString()}
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Contribution Form */}
            <FormControl isInvalid={!!errors.amount}>
              <FormLabel>Contribution Amount (KES)</FormLabel>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    min={1}
                    max={maxContribution}
                    precision={2}
                  >
                    <NumberInputField
                      {...field}
                      placeholder="0.00"
                      bg={cardBg}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
              
              {watchedAmount > maxContribution && (
                <Text fontSize="sm" color="red.500" mt={2}>
                  Amount exceeds remaining balance by KES {(watchedAmount - maxContribution).toLocaleString()}
                </Text>
              )}
            </FormControl>

            {/* Preview */}
            {watchedAmount > 0 && watchedAmount <= maxContribution && (
              <Card bg={cardBg} shadow="sm" borderRadius="md" w="full">
                <CardBody p={4}>
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      Contribution Preview
                    </Text>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.500">
                        New Balance:
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="green.500">
                        KES {(currentBalance + watchedAmount).toLocaleString()}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.500">
                        Progress:
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="blue.500">
                        {(((currentBalance + watchedAmount) / targetAmount) * 100).toFixed(1)}%
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            isLoading={isLoading}
            onClick={handleSubmit(onFormSubmit)}
            isDisabled={watchedAmount > maxContribution || watchedAmount <= 0}
          >
            Add Contribution
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
