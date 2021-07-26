const insertAlbum = ({ href, image }) => {
  let albumsEl = document.querySelector('.albums')

  if (!albumsEl) {
    albumsEl = document.createElement('div')
    albumsEl.classList.add('albums')
    document.body.prepend(albumsEl)
  }

  const aEl = document.createElement('a')
  aEl.classList.add('album')
  aEl.setAttribute('href', href)
  aEl.setAttribute('target', '_blank')

  const imgEl = document.createElement('img')
  imgEl.setAttribute('src', image)

  aEl.append(imgEl)
  albumsEl.append(aEl)
}

const sanitizeAlbums = albumsData => {
  return albumsData.map(({ album: { external_urls: { spotify: href }, images } }) => ({
    href,
    image: images[images.length - 2].url
  }))
}

const fetchAlbumsFromAPI = url => {
  return fetch(url, {
    headers: { 'Authorization': `Bearer ${access_token}` }
  })
}

const fetchAlbums = async (url = 'https://api.spotify.com/v1/me/albums?limit=50&offset=0') => {  
    let albums = []
    let nextURL = url

    while (nextURL) {
      const albumsFromAPI = await fetchAlbumsFromAPI(nextURL).then(res => res.json())
      nextURL = albumsFromAPI.next
      albums = albums.concat(albumsFromAPI.items)
    }

    return Promise.resolve(albums)
}

const access_token = document.cookie.split(';').find(el => el.includes('access_token'))?.split('=')[1]

if (access_token) {
  const btnAuthEl = document.querySelector('.btn-auth')
  btnAuthEl.classList.add('loading')

  fetchAlbums().then(res => {
    const sanitizedAlbums = sanitizeAlbums(res)
    sanitizedAlbums.forEach(sanitizedAlbum => insertAlbum(sanitizedAlbum))
    btnAuthEl.remove()
  })
}