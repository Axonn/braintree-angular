var phantom = require('phantom');
var assert = require('assert');
var app = require('./support/app');

var baseURL = 'http://localhost:3001';

describe('Integration Suite', function() {

  var ph;
  var page;
  var server;
  this.timeout(1e4);
  var nonceInput = '<input type="hidden" name="payment_method_nonce">';

  before(function(done) {
    phantom.create(function(phInstance) {
      ph = phInstance;
      ph.createPage(function(phPage) {

        page = phPage;

        page.onConsoleMessage(function(msg) {
          console.log('page console -> ', msg);
        });

        server = app.listen(3001, function() {
          done();
        });

      });
    });
  });

  context('Drop-In', function() {

    it('adds elements to the page on setup', function(done) {
      page.open(baseURL+'/test-dropin.html', function(status) {
        page.evaluate(function() { return document.documentElement.innerHTML; }, function(result) {

          assert(result.indexOf('iframe') !== -1, 'adds an iframe to the page');
          assert(result.indexOf(nonceInput) !== -1, 'adds nonce input');
          assert(result.indexOf('id="braintree-dropin-container"') !== -1, 'adds correct id');

          done();
        });
      });
    });

  });

  context('Drop-In with Callback', function() {

    it('adds elements to the page on setup', function(done) {
      page.open(baseURL+'/test-dropin-callback.html', function(status) {
        page.evaluate(function() { return document.documentElement.innerHTML; }, function(result) {

          // TODO

          done();
        });
      });
    });

  });

  context('PayPal', function() {

    it('adds elements to the page on setup', function(done) {
      page.open(baseURL+'/test-paypal.html', function(status) {
        page.evaluate(function() { return document.documentElement.innerHTML; }, function(result) {

          console.log(result);
          assert(result.indexOf('id="braintree-paypal-container"') !== -1, 'adds correct id');
          assert(result.indexOf('id="braintree-paypal-button"') !== -1, 'adds braintree-paypal-button');

          done();
        });
      });
    });

  });

  context('Advanced', function() {

    it('initializes API client', function(done) {
      page.open(baseURL+'/test-advanced.html', function(status) {
        page.evaluate(function() { return window.braintreeApiInitialized; }, function(result) {

          assert(result, 'Braintree API client was initialized');

          done();
        });
      });
    });

  });

  after(function(done) {
    ph.exit();
    server.close();
    done();
  });
});


