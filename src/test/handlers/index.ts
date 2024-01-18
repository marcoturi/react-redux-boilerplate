import { usersHandlers } from './users';
import { subscriptionHandlers } from '@/test/handlers/subscriptions';

export const handlers = [...usersHandlers, ...subscriptionHandlers];
