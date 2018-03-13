import chrome from 'sinon-chrome';
import chai from 'chai';
import 'jsdom-global';

const expect = chai.expect;

let Crawler;

describe('Page Crawler', () => {
    before(() => {
        window.chrome = chrome;
        global.setTimeout = () => {
        };
        global.setInterval = () => {
        };
        Crawler = require('../src/crawler/crawler.js');
    });
    beforeEach(function () {
        chrome.flush();
        document.documentElement.innerHTML =
            "<html><head></head><body><a href='home.html'>Home</a></body>";
    });
    it('initializes without error', () => {
        expect(() => {
            new Crawler()
        }).to.not.throw();
    });
    it('initializes when nofollow exists', () => {
        document.documentElement.innerHTML = "<html><head><meta name='robots' content='nofollow' /></head><body></body>";
        expect(() => { new Crawler() }).to.not.throw();
        expect(Crawler.getRobotsMeta()).to.equal('nofollow');
    });
    it('initializes when noindex exists', () => {
        document.documentElement.innerHTML = "<html><head><meta name='robots' content='noindex' /></head><body></body>";
        expect(() => { new Crawler() }).to.not.throw();
        expect(Crawler.getRobotsMeta()).to.equal('noindex');
    });
    it('getRobotsMeta does not crash when name prop does not exist', () => {
        document.documentElement.innerHTML = "<html><head><meta content='test' /></head><body></body>";
        expect(() => { Crawler.getRobotsMeta() }).to.not.throw();
    });
    it('getRobotsMeta does not crash when content prop does not exist', () => {
        document.documentElement.innerHTML = "<html><head><meta name='robots' /></head><body></body>";
        expect(() => { Crawler.getRobotsMeta() }).to.not.throw();
    });
    it('findLinks sends runtime message one time', () => {
        document.documentElement.innerHTML = "<html><head></head><body>" +
            "<a href='home.html'>Link 1</a><a href='https://www.google.com'>Link 2</a></body>";            
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
        Crawler.findLinks();
        expect(window.chrome.runtime.sendMessage.calledOnce).to.be.true;
        Crawler.findLinks();
        expect(window.chrome.runtime.sendMessage.calledOnce).to.be.true;
    });
    it('getBaseUrl sends runtime message', () => {
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
        Crawler.getBaseUrl();
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.false;
    });
    it('set BaseUrl sets url without error', () => {
        expect(() => { Crawler.baseUrl = "https://www.example.com" }).to.not.throw();
    });
});