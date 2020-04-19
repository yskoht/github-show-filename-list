// ==UserScript==
// @name         GitHub Show Filename List
// @namespace    https://github.com/yskoht/github-show-filename-list
// @version      0.1
// @description  Show filename list on "Files changed" tab in GitHub
// @author       yskoht
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var font_css = '';
  font_css += 'font-size: 12px;';
  font_css += 'font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;';

  var span_css = '';
  span_css += font_css
  span_css += 'margin-right: 8px;';
  span_css += 'display: inline-block;';
  span_css += 'width: 40px;';
  span_css += 'height: 18px;';
  span_css += 'text-align: center;';
  span_css += 'border-radius: 0 3px 3px 0;';

  var removeOldElement = () => {
    var oldElement = document.getElementById('file-name-lists');
    if(oldElement) { oldElement.parentNode.removeChild(oldElement); }
  };

  var createNewDiv = () => {
    var div = document.createElement('div');
    div.style = 'margin: 0 0 32px 0';
    div.id = 'file-name-lists';
    return div;
  };

  var addFileNames = (div) => {
    var fileInfos = document.getElementsByClassName('file-info');

    for(var i = 0; i < fileInfos.length; i++) {
      var fileInfo = fileInfos[i];
      var link = fileInfo.getElementsByTagName('a')[0];
      var fileName = link.title;
      var href = link.href;

      var diffStat = fileInfo.getElementsByClassName('diffstat')[0];
      var ariaLabel = diffStat.getAttribute('aria-label');
      var m = /^.+:\s(\d+)\s.+&\s(\d+)\s.+$/.exec(ariaLabel);
      var addition = m ? m[1] : 0;
      var deletion = m ? m[2] : 0;

      var d = document.createElement('div');
      d.style = 'margin-top: 2px;';

      var span_add = document.createElement('span');
      span_add.innerText = '+' + addition;
      span_add.style = span_css + 'background-color: #cfc; color: #399839'

      var span_del = document.createElement('span');
      span_del.innerText = '-' + deletion;
      span_del.style = span_css + 'background-color: #fdd; color: #c33'

      var a = document.createElement('a');
      a.href = href;
      a.innerText = fileName;
      a.style = font_css;

      d.appendChild(span_add);
      d.appendChild(span_del);
      d.appendChild(a);

      div.appendChild(d);
    }
  };

  var createNewElement = () => {
    var div = createNewDiv();
    addFileNames(div);
    return div;
  };

  var run = () => {
    removeOldElement();

    var refElement = document.getElementById('files');
    var fileInfos = document.getElementsByClassName('file-info');
    if(!refElement || fileInfos.length === 0) return;

    var newElement = createNewElement();
    refElement.parentNode.insertBefore(newElement, refElement);
  };

  run();

  var rS = window.history.replaceState;
  window.history.replaceState = function(a, b, url) {
    run();
    rS.apply(this, arguments);
  };
})();
