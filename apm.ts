import apm from 'elastic-apm-node';

apm.start({
  serviceName: '',
  secretToken: '',
  serverUrl: '',
  environment: 'local',
})