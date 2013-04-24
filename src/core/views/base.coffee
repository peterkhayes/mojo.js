define ["jquery", 
"events", 
"bindable",
"./collection",
"../utils/idGenerator",
"outcome", 
"dref",
"underscore", 
"./decor/facade",
"asyngleton", 
"../models/locator",
"../utils/compose",
"../utils/async", 
"toarray"], ($, events, bindable, ViewCollection, generateId, outcome, dref, _, 
  ViewDecorator, asyngleton, modelLocator, compose, async, toarray) ->
    


  class BaseView extends bindable.Object

    ###
     may seem a bit antipattern-ish to use a singleton object like this for all views, bit 
     it makes data-binding to one object a helluvalot easier, and it also promotes good use by making it
     easier for developer to reuse global data. 

     This also reduces the amount of written code tremendously.
    ###

    constructor: (options = {}) ->

      @_id = dref.get(options, "_id") or dref.get(options.item or {}, "_id") or generateId()



      options = _.extend {}, @data or {}, options

      options.view = @
      options.modelLocator = modelLocator

      super options

      # controls bindings, events, templates, transitions based on the given options.
      @decorator = new ViewDecorator @

      # inherit from the parent prototype
      #@_inheritDecorators()

      # items to load with the view
      @loadables = new ViewCollection [@decorator]

      compose @, @loadables, ["load", "render", "display", "remove"]

      # initialize the options
      @_init()
      @decorator.init()

    ###

    _inheritDecorators: () ->
      for p in @_parentClasses()
        for key of p
          prop = p[key]
          @decorator.inherit key, @, prop


    ###

    ###
    ###

    _parentClasses: () ->
      parents = []
      cp = @constructor.__super__
      while cp
        parents.push cp
        cp = cp.constructor.__super__

      parents

    ###
    ###

    init: () ->
      # OVERRIDE ME

    ###
    ###

    _init: () ->
      @init()
      @_listen()

    ###
    ###

    _listen: () ->

      @loadables.on 

        # emitted before load
        load: @_onLoad

        # emitted after all the children have been loaded
        loaded: @_onLoaded

        # emitted before render
        render: @_onRender

        # emitted after all children have been attached - before transitions & events
        rendered: @_onRendered

        # emitted before display
        display: @_onDisplay,

        # emitted after this view has been attached to an element - after transitions & events
        displayed: @_onDisplayed,

        # emitted before remove
        remove: @_onRemove,

        # emitted after this view has been completely removed
        removed: @_onRemoved

    ###
     returns a search for a particular element
    ###

    $: (search) -> @el?.find search

    ###
     attaches to an element
    ###

    attach: (selectorOrElement, callback) ->
      @element selectorOrElement
      @loadables.display callback

    ###
    ###

    element: (selectorOrElement) ->
      return @el if not arguments.length
      @el  = if typeof selectorOrElement is "string" then $(selectorOrElement) else selectorOrElement
      el = @el[0]

      # happens for items such as state views
      if el._view
        @_parent = el._view
      else
        el._view = @

      @selector = selectorOrElement
      @

    ###
    ###

    parent: () -> 
      return @_parent if @_parent
      p = @el[0].parentNode
      while p
        return p._view if p._view
        p = p.parentNode
      return null

    ###
    ###

    root: () ->
      p = @
      p = pv while pv = p.parent()
      p
      
    ###
    ###

    emit: () ->
      super arguments...

      arguments[0] = arguments[0].toLowerCase()

      # also send it to the element
      @el?.trigger.apply @el, arguments

    ###
    ###

    _onLoad      : () =>
    _onLoaded    : () =>

    _onRender    : () =>
    _onRendered  : () => 

    _onDisplay   : () =>
    _onDisplayed : () => 

    _onRemove    : () =>
      @_removing = true

    _onRemoved   : () =>
      return if not @el
      
      if @_parent
        @_parent = undefined
      else
        @el[0]._view = undefined

      @dispose()
      @el = undefined



