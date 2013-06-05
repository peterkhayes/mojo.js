// Generated by CoffeeScript 1.6.2
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["../../../collection", "../../../adapters/index", "dref", "hoist", "pilot-block"], function(ViewCollection, adapters, dref, hoist, pilot) {
    var ListSection;

    ListSection = (function() {
      function ListSection(view, name, options) {
        this.view = view;
        this.name = name;
        this.options = options;
        this._removeModelView = __bind(this._removeModelView, this);
        this._insertDeferredSections = __bind(this._insertDeferredSections, this);
        this._hookModelView = __bind(this._hookModelView, this);
        this._onSourceChange = __bind(this._onSourceChange, this);
        this.__source = this.options.source;
        this._modelViewClass = adapters.getViewClass(this.options.modelViewClass || this.options.itemViewClass);
        this._viewCollection = this.modelViews = new ViewCollection();
        this._viewCollection.bind({
          remove: this._removeModelView
        }).now();
        this._deferredSections = [];
        this.section = pilot.createSection();
      }

      /*
      */


      ListSection.prototype.toString = function() {
        return this.section.toString();
      };

      ListSection.prototype.load = function(next) {
        var _this = this;

        this.initList();
        return this._fetchRemote(function() {
          return _this._viewCollection.load(next);
        });
      };

      /*
      */


      ListSection.prototype._fetchRemote = function(next) {
        var _ref, _ref1;

        if (this._viewCollection.length() || !((_ref = this._sourceCollection) != null ? _ref.fetch : void 0)) {
          return next();
        }
        return (_ref1 = this._sourceCollection) != null ? _ref1.fetch(next) : void 0;
      };

      /*
      */


      ListSection.prototype.render = function(next) {
        return this._viewCollection.render(next);
      };

      /*
      */


      ListSection.prototype.display = function(next) {
        return this._viewCollection.display(next);
      };

      /*
      */


      ListSection.prototype.remove = function(next) {
        var _ref;

        if ((_ref = this._sourceBinding) != null) {
          _ref.dispose();
        }
        this._sourceBinding = void 0;
        return this._viewCollection.remove(next);
      };

      /*
      */


      ListSection.prototype.initList = function() {
        var hoister, map,
          _this = this;

        hoister = hoist();
        map = this.options.map || this.options.transform;
        if (map) {
          hoister.map(function(model) {
            return map(model, _this);
          });
        }
        this._modelTransformer = hoister.map(function(model) {
          var ops;

          ops = {};
          ops.item = model;
          ops.model = model;
          ops._id = dref.get(model, "_id");
          return ops;
        }).cast(this._modelViewClass).map(function(model) {
          _this._hookModelView(model);
          return model;
        });
        return this._bindSource();
      };

      /*
      */


      ListSection.prototype._onSourceChange = function(source) {
        var binding, _ref;

        this._viewCollection.source([]);
        this._deferredSections = [];
        this._sourceCollection = adapters.getCollection(source);
        if ((_ref = this._sourceBinding) != null) {
          _ref.dispose();
        }
        this._sourceBinding = binding = this._sourceCollection.bind();
        if (this.options.filter) {
          this._sourceBinding.filter(this.options.filter);
        }
        return binding.transform(this._modelTransformer).to(this._viewCollection).now();
      };

      /*
      */


      ListSection.prototype._bindSource = function() {
        if (!this.__source) {
          return;
        }
        if (typeof this.__source === "string") {
          return this._bindSourceString();
        } else {
          return this._bindSourceInst();
        }
      };

      /*
      */


      ListSection.prototype._bindSourceString = function() {
        return this.view.bind(this.__source, this._onSourceChange).now();
      };

      /*
      */


      ListSection.prototype._bindSourceInst = function() {
        return this._onSourceChange(this.__source);
      };

      /*
      */


      ListSection.prototype._hookModelView = function(modelView) {
        var self;

        self = this;
        this.view.linkChild(modelView);
        modelView.decorators.push({
          load: function(next) {
            if (self._loaded) {
              self._deferInsert(modelView.section);
            } else {
              self.section.append(modelView.section);
            }
            return next();
          }
        });
        return modelView;
      };

      /*
      */


      ListSection.prototype._deferInsert = function(section) {
        this._deferredSections.push(section);
        return this._deferInsert2();
      };

      /*
      */


      ListSection.prototype._deferInsert2 = function() {
        clearTimeout(this._deferInsertTimeout);
        return this._deferInsertTimeout = setTimeout(this._insertDeferredSections, 0);
      };

      /*
      */


      ListSection.prototype._insertDeferredSections = function() {
        var _ref;

        (_ref = this.section).append.apply(_ref, this._deferredSections);
        return this._deferredSections = [];
      };

      /*
      */


      ListSection.prototype._removeModelView = function(modelView) {
        if (!modelView) {
          return;
        }
        return modelView.remove();
      };

      ListSection.test = function(options) {
        return options.type === "list";
      };

      return ListSection;

    })();
    return ListSection;
  });

}).call(this);