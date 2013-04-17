// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["bindable", "../utils/async", "cstep", "asyngleton", "outcome"], function(bindable, async, cstep, asyngleton, outcome) {
    var _ref;

    return (function(_super) {
      __extends(_Class, _super);

      function _Class() {
        _ref = _Class.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /*
      */


      _Class.prototype.limit = 1;

      /*
       loads the template, and anything else that might be needed
      */


      _Class.prototype.load = asyngleton(function(callback) {
        return this._callViewMethod("load", "loaded", false, callback);
      });

      /*
       renders the view
      */


      _Class.prototype.render = asyngleton(function(callback) {
        var _this = this;

        return this.load(function() {
          return _this._callViewMethod("render", "rendered", false, callback);
        });
      });

      /*
       called when we want to display the view
      */


      _Class.prototype.display = asyngleton(function(callback) {
        var _this = this;

        return this.render(function() {
          return _this._callViewMethod("display", "displayed", false, callback);
        });
      });

      /*
       removes & unloads the view
      */


      _Class.prototype.remove = asyngleton(function(callback) {
        var _this = this;

        return this.display(function() {
          return _this._callViewMethod("remove", "removed", true, callback);
        });
      });

      /*
      */


      _Class.prototype._callViewMethod = function(method, event, reverse, callback) {
        var done, run, stack,
          _this = this;

        if (callback == null) {
          callback = (function() {});
        }
        this.emit(method);
        stack = reverse ? this.source().reverse() : this.source();
        run = function(item, next) {
          var fn;

          fn = item[method];
          if (!fn) {
            return next();
          }
          return fn.call(item, next);
        };
        done = outcome.e(callback).s(function() {
          _this.emit(event);
          return callback();
        });
        if (!~this.limit) {
          return async.forEach(this.source(), run, done);
        } else {
          return async.eachLimit(this.source(), this.limit, run, done);
        }
      };

      return _Class;

    })(bindable.Collection);
  });

}).call(this);
