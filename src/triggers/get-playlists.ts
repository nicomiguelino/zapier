import { ZObject, Bundle } from 'zapier-platform-core';
import utils from '../utils.js';

const getPlaylists = {
  key: 'get_playlists',
  noun: 'Playlist',
  display: {
    label: 'Get Playlists',
    description: 'Triggers when listing available Screenly playlists.',
    hidden: true,
  },
  operation: {
    perform: async (z: ZObject, bundle: Bundle): Promise<object> => {
      const response = await z.request({
        url: 'https://api.screenlyapp.com/api/v4/playlists/',
        headers: {
          Authorization: `Token ${bundle.authData.api_key}`,
        },
      });

      return utils.handleError(response, 'Failed to fetch playlists');
    },
    sample: {
      id: 1,
      name: 'Sample Playlist',
      description: 'A sample playlist',
      items_count: 5,
    },
  },
};

export { getPlaylists };
