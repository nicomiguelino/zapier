import { ZObject, Bundle } from 'zapier-platform-core';
import utils from '../utils.js';

const getAssets = {
  key: 'get_assets',
  noun: 'Asset',
  display: {
    label: 'Get Assets',
    description: 'Triggers when listing available Screenly assets.',
    hidden: true,
  },
  operation: {
    perform: async (z: ZObject, bundle: Bundle): Promise<object> => {
      const response = await z.request({
        url: 'https://api.screenlyapp.com/api/v4/assets/',
        headers: {
          Authorization: `Token ${bundle.authData.api_key}`,
        },
      });

      return utils.handleError(response, 'Failed to fetch assets');
    },
    sample: {
      id: 1,
      title: 'Sample Asset',
      type: 'image',
      duration: 10,
      url: 'https://example.com/sample.jpg',
    },
  },
};

export { getAssets };
