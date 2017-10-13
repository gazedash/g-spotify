// @flow
import R from "ramda";
import { stringify } from "qs";

const ENDPOINT = "https://api.spotify.com";
const VERSION = "v1";

// SECRET, headers: arrow functions to make sure value is updated
const SECRET = () => {
  return localStorage.getItem("token") || "";
};
const headers = () =>
  new Headers({
    Accept: "application/json",
    Authorization: `Bearer ${SECRET()}`
  });
const BASE_URL = `${ENDPOINT}/${VERSION}/`;

export function buildUrl(method: ?string, args?: Object): string {
  if (method) {
    const query = stringify(
      { market: "us", ...args },
      // options
      { addQueryPrefix: true }
    );
    return `${BASE_URL}${method}${query}`;
  }
  return "";
}

function fetchJson(method: string, args?: Object): Promise<{}> {
  const url = buildUrl(method, args);
  return fetch(url, { headers: headers() })
    .then(res => res.json())
    .catch(error => {
      console.error(error);
      return { error };
    });
}

// fetchAlbum("0sNOF9WDwhWunNAHPD3Baj");

export const fetchArtist = async (query: ?string, args?: {}): Object =>
  fetchJson(`search`, { query, type: "artist", ...args });

// spotify artist id
export const fetchArtistAlbumsList = async (id: ?string, args?: {}): Object =>
  id ? fetchJson(`artists/${id}/albums`, { limit: 50, ...args }) : () => {};

// artist->fetchArtist.id->fetchArtistAlbumsList[]->fetchAlbum @each fetchAudioFeatures
// 1=>1=>1=>N=N+3

export const fetchAlbum = async (ids?: string, args?: {}): Object =>
  fetchJson(`albums`, { ids, ...args });

export const fetchAudioFeatures = async (ids: ?string, args?: {}): Object =>
  fetchJson("audio-features", { ids, ...args });

export const checkLogin = async () => {
  const user = await fetchJson("me");
  // no error in user = true = isLoggedIn
  return !("error" in user);
};

export const recommendations = async (args?: {}) => fetchJson('recommendations/available-genre-seeds', args);

export const fetchSongsAndFeatures = async (
  artist?: string,
  args?: {}
): Object => {
  const res = await fetchArtist(artist);
  const artistObj = R.path(["artists", "items", 0], res);
  const id = artistObj
    ? typeof artistObj.id === "string" ? artistObj.id : null
    : null;
  if (id) {
    const { items = [] } = await fetchArtistAlbumsList(id);
    const ids = items.map(({ id }) => id);
    // const { albums = [] } = await fetchAlbum(ids.toString());
    const albums: Array<any> = R.unnest(
      R.map(R.prop("albums"))(
        await Promise.all(
          R.splitEvery(20, ids).map(chunk => fetchAlbum(chunk.toString()))
        )
      )
    );
    const tracksByAlbums = albums.map(
      // ({
      //   name,
      //   images,
      //   items
      // })
      ({ tracks: { items = [] } }) => items
    );
    const tracksWithFeatures = tracksByAlbums.map(async tracks => {
      // const { items = [], name, images } = tracks;
      const sortedTracks = R.sortBy(R.prop("id"))(tracks);
      const ids = sortedTracks.map(({ id }) => id).toString();
      const { audio_features = [] } = await fetchAudioFeatures(ids);
      // debugger;
      const sortedFeatures = R.sortBy(R.prop("id"))(
        audio_features
      ).map(item => ({
        ...item,
        hysterical: item.energy * (1 - item.valence)
      }));

      // return {
      //   name,
      //   images,
      //   items: R.zipWith(
      //     (track, feature) => ({ ...track, ...feature }),
      //     sortedTracks,
      //     sortedFeatures
      //   )
      // };
      return R.zipWith(
        (track, feature) => ({ ...track, ...feature }),
        sortedTracks,
        sortedFeatures
      );
    });
    const res = await Promise.all(tracksWithFeatures);
    // console.log(R.sortBy(R.prop("hysterical"))(R.unnest(res)));
    // console.log(R.sortBy(R.prop("valence"))(R.unnest(res)));

    return R.unnest(res);
  }
  return [];
};
