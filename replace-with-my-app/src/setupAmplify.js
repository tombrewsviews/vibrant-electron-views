import Amplify from '@aws-amplify/core';
import Storage from '@aws-amplify/storage';
import maybeSetupAmplifyDevEnv from './maybeSetupAmplifyDevEnv.js';

let config = {
  aws_project_region: process.env.REACT_APP_AWS_REGION,
  aws_cognito_identity_pool_id:
    process.env.REACT_APP_WELLNESS_ADMIN_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.REACT_APP_AWS_REGION,
  aws_user_pools_id:
    process.env.REACT_APP_WELLNESS_ADMIN_AWS_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id:
    process.env.REACT_APP_WELLNESS_ADMIN_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
  oauth: {},
  // Auth: {
  //   identityPoolId: process.env.REACT_APP_WELLNESS_ADMIN_AWS_COGNITO_IDENTITY_POOL_ID,
  //   region: process.env.REACT_APP_AWS_REGION,
  //   userPoolId: process.env.REACT_APP_WELLNESS_ADMIN_AWS_COGNITO_USER_POOL_ID,
  //   userPoolWebClientId: process.env.REACT_APP_WELLNESS_ADMIN_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
  // },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_UPLOAD_S3_BUCKET, //REQUIRED -  Amazon S3 bucket
      region: process.env.REACT_APP_AWS_REGION, //OPTIONAL -  Amazon service region
    },
  },
};

// If working offline, send a hardcoded identity
maybeSetupAmplifyDevEnv();

Amplify.configure(config);
Storage.configure(config.Storage.AWSS3);
