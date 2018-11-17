const url = 'https://stevens.campuslabs.com/engage/account/tokens'
const base = 'https://se-app-checkins.azurewebsites.net'

function get(url, accessToken) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

const loading = document.getElementById('loadinggif')
const loginButton = document.getElementById('login')
const username = document.getElementById('name')

browser.runtime.sendMessage({type: 'popup opened'})

browser.runtime.onMessage.addListener((request, sender, respond) => {
  console.log('[popup]', request)

  switch (request.type) {
    case 'logged in':
      return get(`${base}/account`, request.data.accessToken)
        .then(res => res.json())
        .then(data => {
          console.log('[popup]', data)
          if (data.error) {
            username.textContent = data.error.data
            browser.tabs.create({url: 'https://stevens.campuslabs.com/engage/account/logout'})
            return 'retry'
          } else {
            username.textContent = `hello ${data.name}`
            username.hidden = false
            loading.hidden = true
          }
        })
      break;
    
    case 'not logged in':
      loading.hidden = true
      loginButton.hidden = false
      break;
  }
})

loginButton.addEventListener('click', () => {
  browser.tabs.create({url: 'https://stevens.campuslabs.com/engage'})
})