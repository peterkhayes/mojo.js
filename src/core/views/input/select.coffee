define ["./base", "../base", "../../templates/factory", "dref", "bindable"], (InputView, View, templates, dref, bindable) ->
    
  class SelectInputOptionView extends View
    template: templates.fromSource("<option value='{{model.value}}'>{{model.label}}</option>", { engine: "handlebars" })


  class SelectInputView extends InputView
    ###
    ###

    template: templates.fromSource("<select name='{{view.name}}'><option>{{view.selectLabel}}</option>{{{sections.selectList}}}</select>", { engine: "handlebars" })

    ###
    ###

    sections:
      selectList:
        type           : "list"
        modelViewClass : SelectInputOptionView
        source         : "source"
        transform      : (model, list) -> 
        
          view = list.view
          
          _id   : dref.get(model, "_id"),
          value : (dref.get(model, view.get("modelValue")) or dref.get(model, view.get("modelLabel"))),
          label : dref.get(model, view.get("modelLabel")),
          data  : model
          

    ###
    ###

    selectLabel: "Select"

    ###
    ###

    modelLabel: "label"

    ###
    ###

    modelValue: "_id"

    ###
    ###

    events: 
      "change": (event) ->
        selected    = @$(":selected")
        selectedVal = selected.val()

        # de-select the model
        if not selectedVal.length
          return @deselect()

        # need to offset the default value
        @select selected.index() - 1
        
    ###
     Selects an model based on the index
    ###

    select: (index) =>

      if !~index
        return @deselect()

      @set "value", @get("source").at(index).value

    ###
     deselects the model
    ###

    deselect: () ->
      @set "value", undefined

    ###
    ###

    _onValueChanged: (value) =>

      super value

      index = -1

      for model, i in @get("source").source()
        if model.value is value
          # offset the default model
          index = i + 1
          break

      if not ~index
        index = 0

      @$().children().eq(index).attr("selected", "selected")


