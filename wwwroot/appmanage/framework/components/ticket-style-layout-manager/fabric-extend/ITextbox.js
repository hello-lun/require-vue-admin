define([
  'fabric'
], function(fabric) {
  'use strict';
  
  fabric.ITextbox = fabric.util.createClass(
    fabric.Textbox, 
    fabric.Observable, 
    {
      type: 'i-textbox',

      _wrapLine: function(_line, lineIndex, desiredWidth, reservedSpace) {
        var lineWidth        = 0,
            graphemeLines    = [],
            line             = [],
            // spaces in different languges?
            // words            = _line.split(this._reSpaceAndTab),
            words            = _line.split(''),
            word             = '',
            offset           = 0,
            infix            = '',
            wordWidth        = 0,
            infixWidth       = 0,
            largestWordWidth = 0,
            lineJustStarted = true,
            additionalSpace = this._getWidthOfCharSpacing(),
            reservedSpace = reservedSpace || 0;
  
        desiredWidth -= reservedSpace;
        for (var i = 0; i < words.length; i++) {
          // i would avoid resplitting the graphemes
          word = fabric.util.string.graphemeSplit(words[i]);
          wordWidth = this._measureWord(word, lineIndex, offset);
          offset += word.length;
  
          lineWidth += infixWidth + wordWidth - additionalSpace;
  
          if (lineWidth >= desiredWidth && !lineJustStarted) {
            graphemeLines.push(line);
            line = [];
            lineWidth = wordWidth;
            lineJustStarted = true;
          }
          else {
            lineWidth += additionalSpace;
          }
  
          if (!lineJustStarted) {
            line.push(infix);
          }
          line = line.concat(word);
  
          infixWidth = this._measureWord([infix], lineIndex, offset);
          offset++;
          lineJustStarted = false;
          // keep track of largest word
          if (wordWidth > largestWordWidth) {
            largestWordWidth = wordWidth;
          }
        }
  
        i && graphemeLines.push(line);
  
        if (largestWordWidth + reservedSpace > this.dynamicMinWidth) {
          this.dynamicMinWidth = largestWordWidth - additionalSpace + reservedSpace;
        }
  
        return graphemeLines;
      },
  
    }
  );

  fabric.ITextbox.fromObject = function(object, callback) {
    return fabric.Object._fromObject('ITextbox', object, callback, 'text');
  };
});
