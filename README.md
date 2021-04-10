# Code to PDF

<p align="center">
<img width="40%" src="images/CodeToPdfLogo.png">
<hr/>
</p>

> :warning: **If you are using Firefox**: Have a look at the known issues [here](#known-issues-when-using-firefox)

This extension can be used to convert your code into a _PDF File_ like it works with **IntelliJ**. It works with single code files as well as with whole Directories. It uses _puppeteer-core_ under the hood so you need **Firefox** or **Chrome** installed.

## Features

- Convert whole directories or single files of code into PDFs.
- Syntax Highlighting thanks to Prism.js for every major language.
- easy to use via _commands_ or the _explorer context menu_.

## Extension Settings

This extension contributes the following settings:

- `codeToPdf.openHTMLPageInBrowser`
  - default: `false`
  - opens a browser window with the html which will be converted to pdf
- `codeToPdf.ignoredFileExtensions`
  - default: `[".txt", ".pdf",".jpg",".jpeg",".png",".xlsx",".docx",".pptx",".ico"]`
  - Stores file extensions which will be ignored when converting to pdf e.g. ['.html']
- `codeToPdf.pathForBrowserExec`
  - default: `""`
  - Usable for MacOS Users when the Browser is not installed in the default location

## Release Notes

## Known Issues when using Firefox

- **Firefox cannot be closed with puppeteer**: Because of a locked user profile puppeteer cannot close firefox. The task has to be cancelled manually.
- **PDF colors can look blurred**: The converted PDF can looked blurred. A workarround is to enable the `openHTMLPageInBrowser` option and convert it manually.
