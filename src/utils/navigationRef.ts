import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from '@/src/interface/tab.interface';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
