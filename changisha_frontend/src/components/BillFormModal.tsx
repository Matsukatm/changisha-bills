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
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BillCreate, BillUpdate } from '../types/api';

const billSchema = z.object({
  name: z.string().min(1, 'Bill name is required'),
  target_amount: z.number().min(1, 'Target amount must be greater than 0'),
  due_date: z.string().min(1, 'Due date is required'),
  payment_method: z.string().min(1, 'Payment method is required'),
  recipient_account: z.string().min(1, 'Recipient account is required'),
});

type BillFormData = z.infer<typeof billSchema>;

interface BillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BillCreate | BillUpdate) => void;
  bill?: BillUpdate | null;
  isLoading?: boolean;
}

export const BillFormModal: React.FC<BillFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bill,
  isLoading = false,
}) => {
  const isEditing = !!bill;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
    defaultValues: bill || {
      name: '',
      target_amount: 0,
      due_date: '',
      payment_method: '',
      recipient_account: '',
    },
  });

  const onFormSubmit = (data: BillFormData) => {
    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? 'Edit Bill' : 'Create New Bill'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Bill Name</FormLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g., Monthly Rent" />
                )}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.target_amount}>
              <FormLabel>Target Amount (KES)</FormLabel>
              <Controller
                name="target_amount"
                control={control}
                render={({ field }) => (
                  <NumberInput min={1}>
                    <NumberInputField {...field} placeholder="0.00" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
              <FormErrorMessage>{errors.target_amount?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.due_date}>
              <FormLabel>Due Date</FormLabel>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                  />
                )}
              />
              <FormErrorMessage>{errors.due_date?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.payment_method}>
              <FormLabel>Payment Method</FormLabel>
              <Controller
                name="payment_method"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select payment method">
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Paybill">Paybill</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </Select>
                )}
              />
              <FormErrorMessage>{errors.payment_method?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.recipient_account}>
              <FormLabel>Recipient Account</FormLabel>
              <Controller
                name="recipient_account"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., 0712345678 or Account Number"
                  />
                )}
              />
              <FormErrorMessage>{errors.recipient_account?.message}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            onClick={handleSubmit(onFormSubmit)}
          >
            {isEditing ? 'Update Bill' : 'Create Bill'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
