// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../base", "../../templates/factory"], function(View, templates) {
    var SelectInputView;
    return SelectInputView = (function(_super) {

      __extends(SelectInputView, _super);

      function SelectInputView() {
        return SelectInputView.__super__.constructor.apply(this, arguments);
      }

      /*
      */


      SelectInputView.prototype.template = templates.fromSource("<select></select>");

      /*
      */


      SelectInputView.prototype.init = function() {
        SelectInputView.__super__.init.call(this);
        return this.source = {};
      };

      return SelectInputView;

    })(View);
  });

}).call(this);