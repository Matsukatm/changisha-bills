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
  FormControl,
  FormLabel,
  Input,
  useToast,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(1, 'Full name is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, login, register, isLoading, error } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.700');

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(isLoginMode ? loginSchema : registerSchema),
    defaultValues: isLoginMode
      ? { email: '', password: '' }
      : { email: '', password: '', full_name: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Reset form when switching modes
    reset();
  }, [isLoginMode, reset]);

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    try {
      if (isLoginMode) {
        await login(data.email, data.password);
        toast({
          title: 'Login successful',
          description: 'Welcome back to Changisha Bills!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await register(data as RegisterFormData);
        toast({
          title: 'Registration successful',
          description: 'Welcome to Changisha Bills!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      // Error is handled by the store
    }
  };

  if (isAuthenticated) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" />
          <Text>Redirecting to dashboard...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Box bg={bg} minH="100vh">
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="center">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" color="gray.800" mb={2}>
              Changisha Bills
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Smart Bill Management for Your Financial Goals
            </Text>
          </Box>

          {/* Auth Card */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl" w="full" maxW="md">
            <CardBody p={8}>
              <VStack spacing={6} align="stretch">
                {/* Form Header */}
                <Box textAlign="center">
                  <Heading size="lg" color="gray.800">
                    {isLoginMode ? 'Welcome Back' : 'Create Account'}
                  </Heading>
                  <Text color="gray.600" mt={2}>
                    {isLoginMode
                      ? 'Sign in to manage your bills'
                      : 'Get started with Changisha Bills'}
                  </Text>
                </Box>

                {/* Error Alert */}
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={4} align="stretch">
                    {!isLoginMode && (
                      <FormControl isInvalid={!!errors.full_name}>
                        <FormLabel>Full Name</FormLabel>
                        <Controller
                          name="full_name"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              bg={useColorModeValue('white', 'gray.600')}
                            />
                          )}
                        />
                        <FormErrorMessage>
                          {errors.full_name?.message}
                        </FormErrorMessage>
                      </FormControl>
                    )}

                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel>Email Address</FormLabel>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            bg={useColorModeValue('white', 'gray.600')}
                          />
                        )}
                      />
                      <Text color="red.500" fontSize="sm">
                        {errors.email?.message}
                      </Text>
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel>Password</FormLabel>
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                            bg={useColorModeValue('white', 'gray.600')}
                          />
                        )}
                      />
                      <Text color="red.500" fontSize="sm">
                        {errors.password?.message}
                      </Text>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      isLoading={isLoading}
                      w="full"
                    >
                      {isLoginMode ? 'Sign In' : 'Create Account'}
                    </Button>
                  </VStack>
                </form>

                <Divider />

                {/* Switch Mode */}
                <Box textAlign="center">
                  <Text color="gray.600">
                    {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
                  </Text>
                  <Button
                    variant="link"
                    colorScheme="blue"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    mt={2}
                  >
                    {isLoginMode ? 'Sign Up' : 'Sign In'}
                  </Button>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Features */}
          <Box textAlign="center">
            <Text color="gray.600" mb={4}>
              Features:
            </Text>
            <HStack spacing={8} justify="center" flexWrap="wrap">
              <VStack>
                <Text fontWeight="bold">📊 Dashboard</Text>
                <Text fontSize="sm" color="gray.500">Track all your bills</Text>
              </VStack>
              <VStack>
                <Text fontWeight="bold">💰 Contributions</Text>
                <Text fontSize="sm" color="gray.500">Manage payments</Text>
              </VStack>
              <VStack>
                <Text fontWeight="bold">🔔 Reminders</Text>
                <Text fontSize="sm" color="gray.500">Never miss a due date</Text>
              </VStack>
              <VStack>
                <Text fontWeight="bold">📱 Mobile Ready</Text>
                <Text fontSize="sm" color="gray.500">Access anywhere</Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
