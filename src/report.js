function printReport(pages) {
    let sortedPages = sortPages(pages)
    console.log('---------------Report begins here--------------')
    for (let page of sortedPages) {
        console.log(`Found ${page[1]} internal links to ${page[0]} `)
    }
}

function sortPages(pages) {
    let pagesList = []
    for (let [key, value] of Object.entries(pages)) {
        pagesList.push([key, value])
    }
    pagesList.sort(function (a, b) {
        return b[1] - a[1]
    })
    return pagesList
}

module.exports = {
    printReport
}