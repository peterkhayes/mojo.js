// Generated by CoffeeScript 1.6.2
(function() {
  define(["../../core/models/locator", "bindable"], function(modelLocator, bindable) {
    modelLocator.set({
      /*
      */

      grades: new bindable.Collection(["Pre-school", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Other"].map(function(label) {
        return {
          _id: label,
          name: label
        };
      }))
    });
    setTimeout((function() {
      console.log("PUSH");
      modelLocator.get("grades").pop();
      return modelLocator.get("grades").push({
        name: "fdsfsfsfds",
        _id: "5396"
      });
    }), 1000);
    return modelLocator;
  });

}).call(this);
