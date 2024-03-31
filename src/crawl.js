const url = require('node:url')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const _ = require('lodash')
const { link } = require('node:fs')

function normalizeURL(url_in) {
    const myURL = url.parse(url_in)
    return _.trim(myURL.hostname + myURL.pathname, '/')
}

function getURLsFromHTML(htmlBody, baseURL) {
    const myDOM = new JSDOM(htmlBody)
    const aTags = myDOM.window.document.querySelectorAll('a')
    const urls = []
    for (let aTag of aTags) {
        //console.log(`Checking ${aTag} for href attribute`)
        let linkURL = aTag.getAttribute('href')
        if (null !== linkURL) {
            const myParsedURL = url.parse(linkURL)
            if (null === myParsedURL.hostname) {
                urls.push(baseURL + '/' + _.trim(linkURL, './'))
            }
            else {
                urls.push(linkURL)
            }
            //console.log(`urls=${urls}`)
        }
    }
    return urls
}

async function crawlPage(baseURL, currentURL, pages) {
    if (url.parse(baseURL).hostname !== url.parse(currentURL).hostname) {
        return pages
    }
    currentURLNormal = normalizeURL(currentURL)
    if (currentURLNormal in pages) {
        pages[currentURLNormal]++
        return pages
    }
    pages[currentURLNormal] = 1
    const response = await fetch(currentURL);
    console.log(`fetching ${currentURL}`)
    if (!response.ok) {
        console.log(`${response.status}: ${response.statusText}`)
        return
    }
    if (!response.headers.get('Content-Type').includes('text/html')) {
        console.log(`Received 'Content-Type'=${response.headers.get('Content-Type')}`)
        console.log(`Expecting 'Content-Type'=text/html, exiting`)
        return
    }
    currentHTML = await response.text()
    linksOnPage = getURLsFromHTML(currentHTML, baseURL)
    for (let link of linksOnPage) {
        await crawlPage(baseURL, link, pages)
    }
    return pages
}

module.exports = {
    normalizeURL, getURLsFromHTML, crawlPage
}
