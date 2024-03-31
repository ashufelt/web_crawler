const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML } = require('../src/crawl.js')

test('normalizeURL https://blog.boot.dev/path/ to blog.boot.dev/path', () =>
    expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path')
)

test('normalizeURL https://blog.boot.dev/path to blog.boot.dev/path', () =>
    expect(normalizeURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path')
)

test('normalizeURL http://blog.boot.dev/path/ to blog.boot.dev/path', () =>
    expect(normalizeURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path')
)

test('normalizeURL http://blog.boot.dev/path to blog.boot.dev/path', () =>
    expect(normalizeURL('http://blog.boot.dev/path')).toBe('blog.boot.dev/path')
)

test('normalizeURL http://blog.boot.dev/ to blog.boot.dev', () =>
    expect(normalizeURL('http://blog.boot.dev/')).toBe('blog.boot.dev')
)

test('normalizeURL https://ashufelt.com/home/ to ashufelt.com/home', () =>
    expect(normalizeURL('https://ashufelt.com/home/')).toBe('ashufelt.com/home')
)

test('normalizeURL http://ashufelt.com/home to ashufelt.com/home', () =>
    expect(normalizeURL('http://ashufelt.com/home')).toBe('ashufelt.com/home')
)

test('normalizeURL http://www.ashufelt.com/home/ to www.ashufelt.com/home', () =>
    expect(normalizeURL('http://www.ashufelt.com/home/')).toBe('www.ashufelt.com/home')
)

test('getURLsFromHTML one link', () => {
    const htmlbody1 = `<html>
    <body>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
    </body>
</html>`;
    const expected = [`https://blog.boot.dev`];
    expect(getURLsFromHTML(htmlbody1, `https://blog.boot.dev`)).toEqual(expected)
})

test('getURLsFromHTML three link', () => {
    const htmlbody3 = `<html>
    <body>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        <a href="https://ashufelt.com"><span>Another link</span></a>
        <a href="https://blog.boot.dev/path"><span>And a third</span></a>
    </body>
</html>`;
    const expected = [
        `https://blog.boot.dev`,
        `https://ashufelt.com`,
        `https://blog.boot.dev/path`,
    ];
    expect(getURLsFromHTML(htmlbody3, `https://blog.boot.dev`)).toEqual(expected)
})

test(`getURLsFromHTML relative link '/page2' with baseURL='https://blog.boot.dev'`, () => {
    const htmlbodyrel1 = `<html>
    <body>
        <a href="/page2"><span>Go to Boot.dev/page2</span></a>
    </body>
</html>`;
    const expected = [`https://blog.boot.dev/page2`];
    expect(getURLsFromHTML(htmlbodyrel1, `https://blog.boot.dev`)).toEqual(expected)
})

test(`getURLsFromHTML relative link './page2' with baseURL='https://blog.boot.dev'`, () => {
    const htmlbodyrel1 = `<html>
    <body>
        <a href="./page2"><span>Go to Boot.dev/page2</span></a>
    </body>
</html>`;
    const expected = [`https://blog.boot.dev/page2`];
    expect(getURLsFromHTML(htmlbodyrel1, `https://blog.boot.dev`)).toEqual(expected)
})

test(`getURLsFromHTML multiple relative links with baseURL='https://blog.boot.dev'`, () => {
    const htmlbodyrel1 = `<html>
    <body>
        <a href="./page2"><span>Go to Boot.dev/page2</span></a>
        <a href="/page3"><span>Go to Boot.dev/page2</span></a>
        <a href="./another/page/"><span>Go to Boot.dev/page2</span></a>
    </body>
</html>`;
    const expected = [
        `https://blog.boot.dev/page2`,
        `https://blog.boot.dev/page3`,
        `https://blog.boot.dev/another/page`,
    ];
    expect(getURLsFromHTML(htmlbodyrel1, `https://blog.boot.dev`)).toEqual(expected)
})

test(`getURLsFromHTML multiple relative and absolute links with baseURL='https://blog.boot.dev'`, () => {
    const htmlbodyrel1 = `<html>
    <body>
        <a href="./page2"><span>Go to Boot.dev/page2</span></a>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        <a href="https://ashufelt.com"><span>Another link</span></a>
        <a href="/page3"><span>Go to Boot.dev/page2</span></a>
        <a href="./another/page/"><span>Go to Boot.dev/page2</span></a>
    </body>
</html>`;
    const expected = [
        `https://blog.boot.dev/page2`,
        `https://blog.boot.dev`,
        `https://ashufelt.com`,
        `https://blog.boot.dev/page3`,
        `https://blog.boot.dev/another/page`,
    ];
    expect(getURLsFromHTML(htmlbodyrel1, `https://blog.boot.dev`)).toEqual(expected)
})

test('getURLsFromHTML one a tag without href attribute', () => {
    const htmlbody1 = `<html>
    <body>
        <a othertag='garbage'><span>Go to Boot.dev</span></a>
    </body>
</html>`;
    const expected = [];
    expect(getURLsFromHTML(htmlbody1, `https://blog.boot.dev`)).toEqual(expected)
})

test(`getURLsFromHTML multiple relative and absolute links, with garbage mixed in, with baseURL='https://blog.boot.dev'`, () => {
    const htmlbodyrel1 = `<html>
    <body>
        <a href="./page2"><span>Go to Boot.dev/page2</span></a>
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        <a othertag='garbage'><span>Go to Boot.dev</span></a>
        <a othertag='garbage'><span>Go to Boot.dev</span></a>
        <a href="https://ashufelt.com"><span>Another link</span></a>
        <a href="/page3"><span>Go to Boot.dev/page2</span></a>
        <a href="./another/page/"><span>Go to Boot.dev/page2</span></a>
        <a othertag='garbage'><span>Go to Boot.dev</span></a>
    </body>
</html>`;
    const expected = [
        `https://blog.boot.dev/page2`,
        `https://blog.boot.dev`,
        `https://ashufelt.com`,
        `https://blog.boot.dev/page3`,
        `https://blog.boot.dev/another/page`,
    ];
    expect(getURLsFromHTML(htmlbodyrel1, `https://blog.boot.dev`)).toEqual(expected)
})