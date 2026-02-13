import { subscriptionHandlers } from '@/test/handlers/subscriptions';
import { usersHandlers } from './users';

export const handlers = [...usersHandlers, ...subscriptionHandlers];
