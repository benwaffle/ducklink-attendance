const showEventsSelector = '#react-app > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)'

async function load() {
  $('#org-event-discovery-list a').map((index, a) => {
    const eventId = a.href.split('/').reverse()[0]
    browser.runtime.sendMessage({
      type: 'get attendance',
      eventId
    }).then(res => {
      console.log(`${eventId} => ${res}`)
      const infos = $(a).children('div').children('div').children('div:nth-child(3)').children('div:nth-child(1)')
      infos.append($(`<div>${res} people</div>`))
    })
  })
}

$(document).on('click', showEventsSelector, () => setTimeout(load, 1500))
$(() => setTimeout(load, 1000))