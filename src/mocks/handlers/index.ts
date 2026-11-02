import { subscriptionsHandlers } from './subscriptions';
import { usersHandlers } from './users';

export const handlers = [...usersHandlers, ...subscriptionsHandlers];
