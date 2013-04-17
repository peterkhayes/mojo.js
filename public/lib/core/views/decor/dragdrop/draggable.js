// Generated by CoffeeScript 1.6.2
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../base", "./collection", "jquery", "underscore"], function(BaseViewDecorator, droppables, $, _) {
    var DraggableDecorator, _ref;

    DraggableDecorator = (function(_super) {
      __extends(DraggableDecorator, _super);

      function DraggableDecorator() {
        this._followMouse = __bind(this._followMouse, this);
        this._coords = __bind(this._coords, this);
        this._event = __bind(this._event, this);
        this._drag = __bind(this._drag, this);
        this._stopDrag = __bind(this._stopDrag, this);
        this._startDrag = __bind(this._startDrag, this);
        this._initListeners = __bind(this._initListeners, this);        _ref = DraggableDecorator.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DraggableDecorator.prototype.init = function() {
        DraggableDecorator.__super__.init.call(this);
        return this.name = this.view.draggable;
      };

      /*
      */


      DraggableDecorator.prototype.display = function(callback) {
        this._initListeners();
        return callback();
      };

      DraggableDecorator.prototype.remove = function(callback) {
        return callback();
      };

      /*
      */


      DraggableDecorator.prototype._initListeners = function() {
        var el;

        el = this.view.el;
        this.document = $(document);
        return el.bind("mousedown", this._startDrag);
      };

      /*
      */


      DraggableDecorator.prototype._startDrag = function(e) {
        e.preventDefault();
        this.document.bind("mousemove", this._drag);
        this.document.one("mouseup", this._stopDrag);
        this._offset = {
          x: e.offsetX,
          y: e.offsetY
        };
        this.draggedItem = this.document.find("body").append(this.view.el.html()).children().last();
        this.draggedItem.css({
          "z-index": 99999999,
          "position": "absolute",
          "opacity": 0.8
        });
        this.draggedItem.transit({
          scale: 1.5
        });
        return this._followMouse(e);
      };

      DraggableDecorator.prototype._stopDrag = function(e) {
        droppables.drop(this.name, this._event(e));
        this.document.unbind("mousemove", this._mouseMoveListener);
        return this.draggedItem.remove();
      };

      DraggableDecorator.prototype._drag = function(e) {
        droppables.drag(this.name, this._event(e));
        return this._followMouse(e);
      };

      DraggableDecorator.prototype._event = function(e) {
        return {
          view: this.view,
          draggedItem: this.draggedItem,
          mouse: {
            x: e.pageX,
            y: e.pageY
          }
        };
      };

      DraggableDecorator.prototype._coords = function(e) {
        return {
          left: e.pageX - this._offset.x,
          top: e.pageY - this._offset.y
        };
      };

      DraggableDecorator.prototype._followMouse = function(e) {
        return this.draggedItem.css(this._coords(e));
      };

      return DraggableDecorator;

    })(BaseViewDecorator);
    DraggableDecorator.test = function(view) {
      return view.draggable;
    };
    return DraggableDecorator;
  });

}).call(this);
