const url = 'https://stevens.campuslabs.com/engage/account/tokens'
const base = 'https://se-app-checkins.azurewebsites.net'

function get(url, accessToken) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function loggedIn() {
  return browser.runtime.sendMessage({
    type: 'logged in',
    data: {
      accessToken
    },
  })
}

function notLoggedIn() {
  browser.runtime.sendMessage({
    type: 'not logged in',
  })
}

let accessToken = 'error'

async function getToken() {
  console.log('[bg]', 'acquiring token')
  try {
    let res = await fetch(url, {mode: 'cors'})
    let data = await res.json()
    console.log('[bg]', data)
    accessToken = data.accessToken
    let res2 = await loggedIn()
    if (res2 === 'retry')
      getToken()
  } catch (err) {
    console.error('[bg]', err)
    accessToken = 'error'
    notLoggedIn()
  }
}

getToken()

browser.runtime.onMessage.addListener((request) => {
  switch (request.type) {
    case 'popup opened':
      if (accessToken === 'error') {
        notLoggedIn()
        getToken()
      } else
        loggedIn().then(data => (data === 'retry' && getToken()))
      break;
    case 'get attendance':
      console.log('[bg]', `get attendance for ${request.eventId}`)
      return get(`${base}/event/${request.eventId}/attendance/count`, accessToken)
        .then(res => res.json())
        .then(data => {
          console.log('[bg]', `${request.eventId} => ${data.count}`)
          return data.count
        })
        .catch(err => {
          console.error('[bg]', err)
          return 'error'
        })
  }
})