const puppeteer = require("puppeteer");
const path = require('path');
const fs = require('fs');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe("Task 1", () => {
    it("`.esports-info` sections should have `height`, `width` and `border` defined", async () => {
        try {
            const esportsInfo = await page.$$('.esports-info');
            for (let i = 0; i < esportsInfo.length; i++) {
                const height = await page.evaluate(el => getComputedStyle(el).height, esportsInfo[i]);
                const width = await page.evaluate(el => getComputedStyle(el).width, esportsInfo[i]);
                const border = await page.evaluate(el => getComputedStyle(el).border, esportsInfo[i]);
                expect(parseInt(height)).toBeGreaterThan(1);
                expect(parseInt(width)).toBeGreaterThan(1);
                expect(parseInt(border)).toBeGreaterThan(0);
            }
        } catch (error) {
            throw error;
        }
    });
    it("Images on page should have their `height` and `width` defined", async () => {
        const stylesheet = fs
            .readFileSync(path.resolve('./style.css'), 'utf8')
            .replace(/\s/g, '');
        expect(stylesheet).toMatch(/img{[^}]*width:/)
    });
    it("Content inside the section tags should be Scrollable", async () => {
        const sections = await page.$$('section');
        for (let i = 0; i < sections.length - 1; i++) {
            const isScrollable = await sections[i].evaluate(el => el.scrollHeight > el.clientHeight);
            expect(isScrollable).toBe(true);
        }
    });
});

describe("Task 2", () => {
    it("Image in `.esports-tournaments` section should have it's `float` css property set", async () => {
        try {
            const floatProperty = await page.evaluate(el => getComputedStyle(el).float, await page.$('.esports-tournaments img'));
            expect(floatProperty).toMatch(/^(left|right)$/);
        } catch (error) {
            throw error;
        }
    });
});
