ContentEditable Editor for Firefox
==================================

This extension is a content-editable editor for Firefox. A button can put the
current documet in edit mode (the while page can be modified). A sidebar opens
with tools to change formatting. Another button can be used to save the page,
either on disk, or on the web using PUT requests.


Getting started with the code
=============================

Developpment
------------

Simple setup:

- Install the Mozilla addon SDK. You should have a `addon-sdk` alias in your
  shell. Run it.
- Run `cfx run` to execute Firefox with the addon preinstalled.
- Run `cfx xpi` to generate the XPI file.

To reload an extension automatically, it is possible to have
[grunt](http://gruntjs.com/) build the xpi file automatically, and have then the
extension autoinstalled:

- Install the [autoinstalled](https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/) extension and have it listen on port 8888.
- Install grunt using `npm install`
- Run `grunt` in a shell where `cfx` is available, when you modify a file, the
  extension will be reinstalled.


Deployment
----------

Run `cfx xpi` to generate the XPI file.
