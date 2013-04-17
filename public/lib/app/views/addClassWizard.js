// Generated by CoffeeScript 1.6.2
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["../../core/views/state", "../core/templates", "./addClass", "./addStudents", "./addBehaviors"], function(StateView, templates, AddClassView, AddStudentsView, AddBehaviorsView) {
    var AddClassWizardView, _ref;

    return AddClassWizardView = (function(_super) {
      __extends(AddClassWizardView, _super);

      function AddClassWizardView() {
        _ref = AddClassWizardView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /*
      */


      AddClassWizardView.prototype.template = templates.addClassWizard;

      /*
      */


      AddClassWizardView.prototype.childrenElement = ".modal-body";

      /*
      */


      AddClassWizardView.prototype.transition = {
        ".confirmation-dailog": {
          enter: {
            from: {
              opacity: 0,
              scale: 0.9
            },
            to: {
              opacity: 1,
              scale: 1
            }
          },
          exit: {
            to: {
              opacity: 0,
              scale: 1.1
            }
          }
        },
        ".modal-backdrop": {
          enter: {
            from: {
              opacity: 0
            },
            to: {
              opacity: 0.25
            }
          },
          exit: {
            to: {
              opacity: 0
            }
          }
        }
      };

      /*
      */


      AddClassWizardView.prototype.events = {
        "noMoreStates": "remove",
        "click .close .cancel-btn": "remove",
        "click #next-class-step": "_next"
      };

      /*
      */


      AddClassWizardView.prototype.states = [AddClassView, AddStudentsView, AddBehaviorsView];

      /*
      */


      AddClassWizardView.prototype.init = function() {
        AddClassWizardView.__super__.init.call(this);
        return this.bind("currentView.title", "title");
      };

      /*
      */


      AddClassWizardView.prototype._endOfStates = function() {
        return this.remove();
      };

      /*
      */


      AddClassWizardView.prototype._next = function() {
        return this.get("currentView").emit("next");
      };

      /*
      */


      AddClassWizardView.prototype._onCurrentStateChange = function() {
        return this.get("currentView").once("complete", this.nextState);
      };

      return AddClassWizardView;

    })(StateView);
  });

}).call(this);
