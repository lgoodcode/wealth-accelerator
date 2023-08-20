import { requiredEnvList } from '@/config/required-env-list';

// Skip checking environment variables if in local development or running on CI
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && !process.env.CircleCI) {
  requiredEnvList.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} is not defined`);
    }

    console.log('✅', envVar, 'is defined');
  });
}
