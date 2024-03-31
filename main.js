const { argv, exit } = require('node:process');
const { crawlPage } = require('./src/crawl.js');
const { printReport } = require('./src/report.js')

async function main() {
    if (argv.length !== 3) {
        console.log(`Proper usage is to provide just one url to the web-crawler`)
        console.log(`You have provided ${argv.length - 2} inputs, an invalid amount`)
        exit(1)
    }
    console.log(`Crawler beginning with base URL = ${argv[2]}`)
    let pages = await crawlPage(argv[2], argv[2], {})
    printReport(pages)
}

main()