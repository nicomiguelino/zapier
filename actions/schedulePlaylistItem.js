const utils = require('../utils');

// Terminal states that indicate the asset is ready
const READY_STATES = ['downloading', 'processing', 'finished'];

const schedulePlaylistItem = {
  key: 'schedule_playlist_item',
  noun: 'Playlist Item',
  display: {
    label: 'Add Asset to Playlist',
    description: 'Add an asset to a playlist with scheduling',
  },
  operation: {
    inputFields: [
      {
        key: 'playlist_id',
        label: 'Playlist',
        type: 'string',
        required: true,
        dynamic: 'get_playlists.id.name',
        helpText: 'Select the playlist',
      },
      {
        key: 'asset_id',
        label: 'Asset',
        type: 'string',
        required: true,
        dynamic: 'get_assets.id.title',
        helpText: 'Select the asset to schedule',
      },
      {
        key: 'duration',
        label: 'Duration (seconds)',
        type: 'integer',
        required: false,
        default: '10',
        helpText: 'How long should this asset be shown (in seconds)',
      },
    ],
    perform: async (z, bundle) => {
      // Check asset status until ready
      let assetStatus;
      do {
        const statusResponse = await z.request({
          url: `https://api.screenlyapp.com/api/v4/assets?id=eq.${bundle.inputData.asset_id}`,
          headers: {
            Authorization: `Token ${bundle.authData.api_key}`,
          },
        });

        const assets = utils.handleError(statusResponse, 'Failed to check asset status');
        assetStatus = assets[0].status;

        // Log status for debugging
        z.console.log(`Asset ${bundle.inputData.asset_id} status: ${assetStatus}`);

      } while (!READY_STATES.includes(assetStatus));

      // Now proceed with adding to playlist
      const payload = {
        asset_id: bundle.inputData.asset_id,
        playlist_id: bundle.inputData.playlist_id,
      };

      if (bundle.inputData.duration) {
        payload.duration = bundle.inputData.duration;
      }

      const response = await z.request({
        url: 'https://api.screenlyapp.com/api/v4/playlist-items/',
        method: 'POST',
        headers: {
          'Authorization': `Token ${bundle.authData.api_key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: payload,
      });

      const assets = utils.handleError(response, 'Failed to add asset to playlist');

      if (assets.length === 0) {
        throw new Error('No assets returned from the Screenly API');
      }

      return assets[0];
    },
    sample: {
      id: 1,
      asset: 1,
      playlist: 1,
      conditions: {
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-12-31T23:59:59Z',
      },
    },
  },
};

module.exports = schedulePlaylistItem;