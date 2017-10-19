# G-spotify
is a web app that allows you to quickly sort and plot band songs by features.
You can also play a preview if it's available.

![G-spotify](https://user-images.githubusercontent.com/11088992/31781775-f1bb1bf6-b501-11e7-9ab0-a60fa6f5c562.png)
![G-spotify](https://user-images.githubusercontent.com/11088992/31781774-f1957a36-b501-11e7-9133-364129e35ddc.png)
![G-spotify](https://user-images.githubusercontent.com/11088992/31781773-f17319a0-b501-11e7-94da-87ccc972e287.png)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

Make sure to get an API key from [Spotify Web Api](developer.spotify.com/web-api/)
and place it in `scr/api/secret.ts` like so:
```echo "export default 'YOUR_TOKEN';" >> src/api/secret.js```

### install dependencies
```yarn install```

### serve at localhost:3000
```yarn start```

### build for production with minification
```yarn build```
