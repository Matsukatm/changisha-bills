import { setupServer } from 'msw/node';
import { rest } from 'msw';

const handlers = [
  // Auth endpoints
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-token',
        token_type: 'bearer',
      })
    );
  }),

  rest.post('/api/v1/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 1,
        email: req.body.email,
        full_name: req.body.full_name,
        is_active: true,
        created_at: new Date().toISOString(),
      })
    );
  }),

  rest.get('/api/v1/auth/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        is_active: true,
        created_at: new Date().toISOString(),
      })
    );
  }),

  // Bills endpoints
  rest.get('/api/v1/bills', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          user_id: 1,
          name: 'Monthly Rent',
          target_amount: 50000,
          current_balance: 25000,
          due_date: '2024-12-31',
          payment_method: 'M-Pesa',
          recipient_account: '0712345678',
          is_paid: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          user_id: 1,
          name: 'Electricity Bill',
          target_amount: 5000,
          current_balance: 5000,
          due_date: '2024-11-15',
          payment_method: 'Bank Transfer',
          recipient_account: '1234567890',
          is_paid: true,
          created_at: new Date().toISOString(),
        },
      ])
    );
  }),

  rest.post('/api/v1/bills', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        user_id: 1,
        ...req.body,
        current_balance: 0,
        is_paid: false,
        created_at: new Date().toISOString(),
      })
    );
  }),

  // Contributions endpoints
  rest.get('/api/v1/contributions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          user_id: 1,
          bill_id: 1,
          amount: 5000,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          user_id: 1,
          bill_id: 1,
          amount: 3000,
          created_at: new Date().toISOString(),
        },
      ])
    );
  }),

  rest.post('/api/v1/contributions', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        user_id: 1,
        ...req.body,
        created_at: new Date().toISOString(),
      })
    );
  }),
];

export const server = setupServer(...handlers);
