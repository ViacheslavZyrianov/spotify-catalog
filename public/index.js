const insertAlbum = ({ album }) => {
  const albumSrc = album.images[album.images.length - 1].url
  const imgEl = document.createElement('img')
  imgEl.setAttribute('src', albumSrc)
  document.querySelector('.albums').appendChild(imgEl)
}

const access_token = document.cookie.split(';').find(el => el.includes('access_token'))?.split('=')[1]

if (access_token) {
  const fetchAlbum = (limit, offset) => fetch(`https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}`, {
    headers: { 'Authorization': `Bearer ${access_token}` }
  })

  Promise.all([
    fetchAlbum(50, 0),
    fetchAlbum(50, 1),
    fetchAlbum(50, 2),
    fetchAlbum(42, 3)
  ]).then(res => res.map(resItem => resItem.json().then(({ items }) => {
    items.forEach(album => {
      insertAlbum(album)
    })
  })))
}